let root = new Vue({
  el: "#root",

  data: {
    numFish: 0,
    numGold: 0,

    numFishSec: 0,
    numGoldSec: 0,

    stance: true,

    availableSpace: 0,
    availableStorage: 100,

    fishingState: true,
    sellingState: false,


    sea: {
      canoe: {
        name: "Canoe",
        count: 0,
        cost: 100,
        fish: 0,
        space: 1
      },
      canoeextension: {
        name: "Extension",
        count: 0,
        cost: 250,
        fish: 0,
        space: 2
      },
    },

    land: {
      permit: {
        name: "Sell Permit",
        count: 0,
        cost: 250,
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
        fish: 0,
        storage: 1000
      },
      stand: {
        name: "Selling Stand",
        count: 0,
        cost: 50,
        fish: 0
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

      // faz pescar mais por segundo?
      // +1 peixe por segundo
      fishingrod: {
        name: "Fishing Rod",
        count: 0,
        cost: 15,
        fish: 1
      },

      // faz toda a gente pescar mais por segundo?
      // sempre que compra faz x numero de pessoas e preço e faz mais 1 peixe por segundo durante 10 segundos???
      // bait: {
      //   name: "Bait",
      //   count: 0,
      //   cost: 4,
      //   fisht: 1
      // },

    },
  },
  methods: {
    fishCheck: function () {
      if (this.numFish < this.availableStorage) {
        this.numFish++

        if (this.objects.fishingrod.count > 0) {
          this.numFish++
        }
        if (this.numFish >= this.availableStorage) {
          this.fishingState = false;
        }
        if (this.numFish > 0 && this.stance == false) {
          this.sellingState = true;
        }

      } else {
        this.fishingState = false;
      }
    },

    sellCheck: function () {
      if (this.numFish > 0 && this.stance == false) {
        this.numFish--
        this.numGold += this.objects.fish.cost
        if (this.numFish < this.availableStorage) {
          this.fishingState = true;
        }
        if (this.numFish <= 0) {
          this.sellingState = false;
        }
      } else {
        this.sellingState = false;
      }
    },

    stanceCheck: function () {
      if (this.stance == true) {
        this.stance = false;
        if (this.numFish > 0) {
          this.sellingState = true;
        }
      } else {
        this.stance = true;
        this.sellingState = false;
      }
    },

    buyFishingRod: function () {
      this.objects.fishingrod.count += 1;
      this.numGold -= this.objects.fishingrod.cost;
    },

    buySeller: function () {
      this.land.seller.count += 1;
      this.numGold -= this.land.seller.cost;
      this.land.seller.cost = Math.ceil(this.land.seller.cost * 1.5);
    },

    permitBuy: function () {
      this.land.permit.count += 1;
      this.numGold -= this.land.permit.cost;
      this.land.seller.fish += .25;
      this.objects.fish.cost += .25;
      this.land.dock.count += 1;
    },

    friendBuy: function () {
      this.objects.friend.count += 1;
    },

    canoeBuy: function () {
      this.sea.canoe.count += 1;
      this.numGold -= this.sea.canoe.cost;
      this.sea.canoe.cost = Math.ceil(this.sea.canoe.cost * 1.5);

      this.availableSpace += this.sea.canoe.space;
    },

    canoeExtenstionBuy: function () {
      if (this.sea.canoeextension.count >= 1) return;
      this.sea.canoeextension.count += 1;
      this.numGold -= this.sea.canoeextension.cost;
      this.availableSpace += this.sea.canoeextension.space;
    },

    dockStorageBuy: function () {
      this.land.dockstorage.count += 1;
      this.numGold -= this.land.dockstorage.cost;

      this.availableStorage += this.land.dockstorage.storage;
    },

    dockLocationBuy: function () {
      this.land.docklocation.count += 1;
      this.numGold -= this.land.docklocation.cost;

      this.objects.fish.cost += .25;
    },

    standBuy: function () {
      this.land.stand.count += 1;
      this.numGold -= this.land.stand.cost;
    },


    todo: function () {
      setInterval(() => {
        // fish and gold each second
        this.numFishSec = this.objects.friend.count * this.objects.friend.fish
        this.numGoldSec = this.land.seller.count * this.land.seller.fish;

        // fish if theres available storage
        if (this.numFish < this.availableStorage && this.stance == true) {
          this.numFish += Math.round(this.objects.friend.count * this.objects.friend.fish);
        }

        // exchange fish for gold
        for (let i = 0; i < this.land.seller.count; i++) {
          if (this.numFish < 1) {
            break
          } else {
            this.numFish--;
            this.numGold += this.land.seller.fish;
          }
        }



        console.log("tick");
      }, 1000);

    },

  },
  mounted: function () {

    this.todo()
  },

});