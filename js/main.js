let root = new Vue({
  el: "#root",

  data: {
    numGold: 0,

    numFishSec: 0,
    numGoldSec: 0,

    stance: false,

    availableSpace: 0,
    availableStorage: 100,

    fishingState: true,
    sellingState: true,

    fishingDepth: 0,

    tutorial: true,


    sea: {
      canoe: {
        name: "Canoe",
        count: 0,
        cost: 75,
        space: 1
      },
      canoeextension: {
        name: "Extension",
        count: 0,
        cost: 250,
        space: 2
      },
      deckboat: {
        name: "Deck Boat",
        count: 0,
        cost: 750,
        space: 3,
      },
      sailboat: {
        name: "Sail Boat",
        count: 0,
        cost: 1500,
        space: 7,
      },
      trawler: {
        name: "Trawler",
        count: 0,
        cost: 2300,
        space: 12,
      },
    },

    land: {
      permit: {
        name: "Sell Permit",
        count: 0,
        cost: 50,
        fish: 0
      },
      seller: {
        name: "Seller",
        count: 0,
        cost: 15,
        fish: .25
      },
      dock: {
        name: "Dock",
        count: 0,
        storage: 550
      },
      docklocation: {
        name: "Better Location",
        count: 0,
        cost: 300,
        fish: 0
      },
      dockstorage: {
        name: "More Storage",
        count: 0,
        cost: 300,
        storage: 1000
      },
      stand: {
        name: "Selling Stand",
        count: 0,
        cost: 50,
      },
      store: {
        name: "Store",
        count: 0,
        cost: 1500,
      },
      storelocation: {
        name: "Better Location",
        count: 0,
        cost: 5000,
      },
      
    },

    objects: {
      fish: {
        name: "Fish",
        count: 0,
        cost: .25,
      },

      friend: {
        name: "Friend",
        count: 0,
        cost: 0,
        fish: 1
      },

      fishingrod: {
        name: "Fishing Rod",
        count: 0,
        cost: 15,
        fish: 1
      },

      bait: {
        name: "Bait",
        count: 0,
        cost: 4,
        fisht: 1
      },

    },
  },
  methods: {
    fishCheck: function () {
      if (this.objects.fish.count < this.availableStorage) {
        this.objects.fish.count++

        if (this.objects.fishingrod.count > 0 && this.objects.bait.count > 0) {
          this.objects.bait.count--;
          this.objects.fish.count++;
        }
        if (this.objects.fishingrod.count > 0 && this.availableStorage > this.objects.fish.count) {
          this.objects.fish.count++
        }
        if (this.objects.fish.count >= this.availableStorage) {
          this.fishingState = false;
        }
        if (this.objects.fish.count > 0 && this.stance == false) {
          this.sellingState = true;
        }

      } else {
        this.fishingState = false;
      }
    },

    sellCheck: function () {
      if (this.objects.fish.count > 0 && this.stance == false) {
        this.objects.fish.count--
        this.numGold += this.objects.fish.cost
        if (this.objects.fish.count < this.availableStorage) {
          this.fishingState = true;
        }
        if (this.objects.fish.count <= 0) {
          this.sellingState = false;
        }
      } else {
        this.sellingState = false;
      }
    },

    stanceCheck: function () {
      if (this.stance == true) {
        this.stance = false;
        if (this.objects.fish.count > 0) {
          this.sellingState = true;
        }
      } else {
        this.stance = true;
        this.sellingState = false;
      }
    },

    buyFishingRod: function () {
      this.itemBuy("objects", "fishingrod");
    },

    buySeller: function () {
      this.itemBuy("land", "seller");

      this.land.seller.cost = Math.ceil(15 * Math.pow(1.5, this.land.seller.count));
    },

    permitBuy: function () {
      this.itemBuy("land", "permit");

      this.land.seller.fish += .25;
      this.objects.fish.cost += .25;
      this.land.dock.count += 1;
    },

    friendBuy: function () {
      this.objects.friend.count += 1;
    },

    canoeBuy: function () {
      this.itemBuy("sea", "canoe");

      this.availableSpace += this.sea.canoe.space;
    },

    canoeExtenstionBuy: function () {
      if (this.sea.canoeextension.count >= 1) return;
      this.itemBuy("sea", "canoeextension");

      this.availableSpace += this.sea.canoeextension.space;
    },

    dockStorageBuy: function () {
      this.itemBuy("land", "dockstorage");

      this.availableStorage += this.land.dockstorage.storage;
    },

    dockLocationBuy: function () {
      this.itemBuy("land", "docklocation");

      this.objects.fish.cost += .25;
    },

    standBuy: function () {
      this.itemBuy("land", "stand");
    },

    baitBuy: function () {
      this.itemBuy("objects", "bait");
    },

    storeBuy: function () {
      this.itemBuy("land", "store");

      this.objects.fish.cost += .25;
    },

    storeLocationBuy: function () {
      this.itemBuy("land", "storelocation");

      this.objects.fish.cost += .5;
    },

    deckboatBuy: function () {
      this.itemBuy("sea", "deckboat");

      this.availableSpace += this.sea.deckboat.space;
    },

    sailboatBuy: function () {
      this.itemBuy("sea", "sailboat");

      this.availableSpace += this.sea.sailboat.space;
    },

    trawlerBuy: function () {
      this.itemBuy("sea", "trawler");

      this.availableSpace += this.sea.trawler.space;
    },

    changeFishingDepth: function () {
      this.fishingDepth = document.getElementById("fishingDepth").value;
      console.log(document.getElementById("fishingDepth").value);
    },

    itemBuy: function (param1, object) {
      this[param1][object].count += 1;
      this.numGold -= this[param1][object].cost;
    },

    todo: function () {
      setInterval(() => {
        // fish and gold each second
        this.numFishSec = this.objects.friend.count * this.objects.friend.fish;
        this.numGoldSec = this.land.seller.count * this.land.seller.fish;

        // fish if theres available storage
        if (this.objects.fish.count < this.availableStorage && this.stance == true) {
          this.objects.fish.count += Math.round(this.objects.friend.count * this.objects.friend.fish);
          if (this.objects.fish.count < this.availableStorage) {
            this.fishingState = true;
          } else {
            this.fishingState = false;
          }
        }

        // exchange fish for gold
        for (let i = 0; i < this.land.seller.count; i++) {
          if (this.objects.fish.count < 1) {
            break
          } else {
            this.objects.fish.count--;
            this.numGold += this.land.seller.fish;

            if (this.objects.fish.count < this.availableStorage) {
              this.fishingState = true;
            } else {
              this.fishingState = false;
            }
          }
        }

        // console.log("tick");
      }, 1000);

    },

  },
  mounted: function () {

    this.todo()
  },

});