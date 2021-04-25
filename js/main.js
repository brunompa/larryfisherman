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
        space: 3
      },
      sailboat: {
        name: "Sail Boat",
        count: 0,
        cost: 1500,
        space: 7
      },
      trawler: {
        name: "Trawler",
        count: 0,
        cost: 2300,
        space: 12
      },
    },

    land: {
      employee: {
        name: "Employee",
        count: 0,
        cost: 15,
      },
      friend: {
        name: "Friend",
        count: 0,
        cost: 0,
        fish: 1,
      },
      helper: {
        busy: 0,
        free: 0,
      },
      fisherman: {
        name: "Fisherman",
        count: 0,
        fish: 1,
      },
      seller: {
        name: "Seller",
        count: 0,
      },
      dock: {
        name: "Dock",
        count: 0,
        storage: 550,
      },
      docklocation: {
        name: "Better Location",
        count: 0,
        cost: 200,
        value: .25,
      },
      dockstorage: {
        name: "More Storage",
        count: 0,
        cost: 200,
        storage: 750,
      },
      stand: {
        name: "Selling Stand",
        count: 0,
        cost: 50,
        value: .25,
      },
      store: {
        name: "Store",
        count: 0,
        cost: 750,
        value: .25,
        storage: 1200,
      },
      storelocation: {
        name: "Better Location",
        count: 0,
        cost: 1500,
        value: .5,
      },
      sushirestaurant: {
        name: "Sushi Restaurant",
        count: 0,
        cost: 2000,
        value: .25,
        storage: 500,
      },
    },

    objects: {
      fish: {
        name: "Fish",
        count: 0,
        cost: .25,
        total: 0,
      },
      fishingrod: {
        name: "Fishing Rod",
        count: 0,
        cost: 5,
        fish: 1,
        space: 1
      },
      bait: {
        name: "Bait",
        count: 0,
        cost: 1,
        fish: 1
      },
      permit: {
        name: "Sell Permit",
        count: 0,
        cost: 25,
        value: .25,
      },
    },
  },

  methods: {
    fishCheck: function () {
      if (this.objects.fish.count < this.availableStorage) {
        this.objects.fish.count++
        this.objects.fish.total++

        if (this.objects.fishingrod.count > 0 && this.objects.bait.count > 0) {
          this.objects.bait.count--;
          this.objects.fish.count++;
          this.objects.fish.total++

        }
        if (this.objects.fishingrod.count > 0 && this.availableStorage > this.objects.fish.count) {
          this.objects.fish.count++
          this.objects.fish.total++

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

    addSellerCount: function () {
      if (this.land.helper.free > 0) {
        this.land.helper.busy++;
        this.land.helper.free--;

        this.land.seller.count++;
      }
    },

    subSellerCount: function () {
      if (this.land.seller.count > 0) {
        this.land.helper.busy--;
        this.land.helper.free++;

        this.land.seller.count--;
      }
    },

    addFishermanCount: function () {
      if (this.land.helper.free > 0) {
        this.land.helper.busy++;
        this.land.helper.free--;

        this.land.fisherman.count++;
      }
    },

    subFishermanCount: function () {
      if (this.land.fisherman.count > 0) {
        this.land.helper.busy--;
        this.land.helper.free++;

        this.land.fisherman.count--;
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

    buyStore: function () {
      this.buyItem("land", "store");
      this.availableStorage += this.land.store.storage;
      this.objects.fish.cost += this.land.store.value;
    },

    buySushiRestaurant: function () {
      this.buyItem("land", "sushirestaurant");
      this.availableStorage += this.land.sushirestaurant.storage;
      this.objects.fish.cost += this.land.sushirestaurant.value;
    },

    buyEmployee: function () {
      this.buyItem("land", "employee");
      this.land.employee.cost = Math.ceil(15 * Math.pow(1.3, this.land.employee.count));
      this.land.helper.free++;
    },

    buyFriend: function () {
      this.land.friend.count += 1;
      this.land.helper.free++;
    },

    buyBait: function () {
      this.objects.bait.count += 10;
      this.numGold -= this.objects.bait.cost;
    },

    buyDockStorage: function () {
      this.buyItem("land", "dockstorage");
      this.availableStorage += this.land.dockstorage.storage;
    },


    // whenever you buy something that increases the value of fish
    buyOrderValue: function (place, ovni) {
      this.buyItem(place, ovni);
      this.objects.fish.cost += this[place][ovni].value;
    },

    // whenever you buy a item that increases space (friends capacity)
    buyOrderSpace: function (place, ovni) {
      this.buyItem(place, ovni);
      this.availableSpace += this[place][ovni].space;
    },

    // whenever you buy something
    buyItem: function (param1, object) {
      this[param1][object].count += 1;
      this.numGold -= this[param1][object].cost;
    },

    // change depth that you fish in
    changeFishingDepth: function () {
      this.fishingDepth = document.getElementById("fishingDepth").value;
      console.log(document.getElementById("fishingDepth").value);
    },

    todo: function () {
      setInterval(() => {
        // fish and gold each second
        this.numFishSec = this.land.fisherman.count * this.land.fisherman.fish;
        this.numGoldSec = this.land.seller.count * this.objects.fish.cost;

        // fish if theres available storage
        if (this.objects.fish.count < this.availableStorage && this.stance == true) {
          this.objects.fish.count += (this.land.fisherman.count * this.land.fisherman.fish / 10);
          this.objects.fish.total += (this.land.fisherman.count * this.land.fisherman.fish / 10);
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
            this.numGold += this.objects.fish.cost;

            if (this.objects.fish.count < this.availableStorage) {
              this.fishingState = true;
            } else {
              this.fishingState = false;
            }
          }
        }

        // console.log("tick");
      }, 100);
    },
  },
  mounted: function () {
    this.todo()

    // cheatcode
    const pressed = [];
    const cheatCode = 'birthday';
    window.addEventListener("keyup", (e) => {
      pressed.push(e.key);
      pressed.splice(-cheatCode.lenght - 1, pressed.lenght - cheatCode.lenght);
      if (pressed.join('').includes(cheatCode)) {
        this.numGold += 10000;
        pressed.length = 0;
      }
    });
  },
});