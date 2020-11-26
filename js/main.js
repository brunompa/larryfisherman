let root = new Vue({
  el: "#root",

  data: {
    numFish: 0,
    numGold: 0,

    availableSpace: 0,

    objects: {
      fish: {
        name: "Fish",
        count: 0,
        cost: .25,
        capacity: Infinity,
      },
      // selling
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
      stand: {
        name: "Selling Stand",
        count: 0,
        cost: 50,
        fish: 0
      },
      // fishing
      friend: {
        name: "Friend",
        count: 0,
        cost: 0,
        fish: 1
      },
      // boats
      canoe: {
        name: "Canoe",
        count: 0,
        cost: 100,
        fish: 0,
        space: 1
      },
    },
  },
  methods: {
    fishAdd: function () {
      this.numFish++
    },
    fishSell: function () {
      this.numFish--
      this.numGold += this.objects.fish.cost
    },


    buySeller: function () {
      this.objects.seller.count += 1;
      this.numGold -= this.objects.seller.cost;
      this.objects.seller.cost = Math.ceil(this.objects.seller.cost * 1.5);
    },


    permitBuy: function () {
      this.objects.permit.count += 1;
      this.numGold -= this.objects.permit.cost;
      this.objects.seller.fish += .25;
      this.objects.fish.cost += .25;
    },

    friendBuy: function () {
      this.objects.friend.count += 1;
    },

    canoeBuy: function () {
      this.objects.canoe.count += 1;
      this.numGold -= this.objects.canoe.cost;
      this.objects.canoe.cost = Math.ceil(this.objects.canoe.cost * 1.5);

      this.availableSpace += this.objects.canoe.space;
    },


    standBuy: function () {
      this.objects.stand.count += 1;
      this.numGold -= this.objects.stand.cost;
    },


    todo: function () {
      setInterval(() => {
        this.numFish += Math.round(this.objects.friend.count * this.objects.friend.fish);


        for (let i = 0; i < this.objects.seller.count; i++) {
          if (this.numFish < 1) {
            break
          } else {
            this.numFish--;
            this.numGold += this.objects.seller.fish;
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