let root = new Vue({
  el: "#root",

  data: {
    numGold: 0,

    bettingResult: 0,

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
        count: 0.0,
        value: 0,
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
      if (this.objects.fish.value < this.availableStorage) {
        this.updateFishCount(this.objects.fish.count + 1)
        this.objects.fish.total++

        if (this.objects.fishingrod.count > 0 && this.objects.bait.count > 0) {
          this.objects.bait.count--;
          this.updateFishCount(this.objects.fish.count + 1)
          this.objects.fish.total++
        }
        if (this.objects.fishingrod.count > 0 && this.availableStorage > this.objects.fish.count) {
          this.updateFishCount(this.objects.fish.count + 1)
          this.objects.fish.total++
        }

        this.updateFishingState ();

      } else {
        this.fishingState = false;
      }
    },

    updateFishingState: function () {
      // fish check code
      if (this.objects.fish.count >= this.availableStorage) {
        this.fishingState = false;
      }
      else {
        this.fishingState = true;
      }

      // code to test if the else doesnt work like intended
      // maybe just use a else here since its the only other option?
      // if (this.objects.fish.count < this.availableStorage) {
      // }

      if (this.objects.fish.count > 0 && this.stance == false) {
        this.sellingState = true;
      }
      if (this.objects.fish.count <= 0) {
        this.sellingState = false;
      }

    },

    updateHelper: function (helper, value) {
      this.land.helper.busy += value;
      this.land.helper.free -= value;
      this.land[helper].count += value;
    },

    addSellerCount: function () {
      if (this.land.helper.free > 0) {
        this.updateHelper("seller", 1);
        this.updateGoldPerSec();
      }
    },

    subSellerCount: function () {
      if (this.land.seller.count > 0) {
        this.updateHelper("seller", -1);
        this.updateGoldPerSec();
      }
    },

    addFishermanCount: function () {
      if (this.land.helper.free > 0) {
        this.updateHelper("fisherman", 1);
        this.updateFishPerSec();
      }
    },

    subFishermanCount: function () {
      if (this.land.fisherman.count > 0) {
        this.updateHelper("fisherman", -1);
        this.updateFishPerSec();
      }
    },

    updateFishPerSec: function () {
      this.numFishSec = this.land.fisherman.count * this.land.fisherman.fish;
    },

    updateGoldPerSec: function () {
      this.numGoldSec = this.land.seller.count * this.objects.fish.cost;
    },

    sellCheck: function () {
      if (this.objects.fish.value > 0 && this.stance == false) {
        this.updateFishCount(this.objects.fish.count - 1)
        this.numGold += this.objects.fish.cost
        this.updateFishingState();
      } else {
        this.sellingState = false;
      }
    },

    updateFishCount: function (double) {
      this.objects.fish.count = double
      this.objects.fish.value = Math.trunc(double)
    },

    stanceCheck: function () {
      if (this.stance == true) {
        this.stance = false;
        if (this.objects.fish.value > 0) {
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
      this.updateGoldPerSec();
    },

    buySushiRestaurant: function () {
      this.buyItem("land", "sushirestaurant");
      this.availableStorage += this.land.sushirestaurant.storage;
      this.objects.fish.cost += this.land.sushirestaurant.value;
      this.updateGoldPerSec();
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
      this.updateGoldPerSec();
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

    // on img click show the gambling section
    showGamblingSection: function () {
      let bettingSection = document.getElementById("betting-section");
      bettingSection.classList.toggle("d-none");
    },
    
    // function that runs when the user click race
    horseBetting: function () {
      let bettingGoldAmount = document.getElementById('betting-gold-amount').value;
      let horseUserBettingOn = document.getElementById('horse-bet-winning').value;

      bettingGoldAmount = parseInt(bettingGoldAmount) || 0
      horseUserBettingOn = parseInt(horseUserBettingOn) || 0

      let result = (Math.floor(Math.random() * 5) + 1);
      this.bettingResult = result;
      let odds = (Math.floor(Math.random() * 8) + 1);

      console.log(bettingGoldAmount)
      console.log(this.numGold)

      let wonOnBet = 0;
       
      let divAlertLoss = document.getElementById("alert-l");
      let divAlertWon = document.getElementById("alert-w");

      if (bettingGoldAmount > this.numGold || bettingGoldAmount <= 0){
        // alert("Gold no good!")
        document.getElementById("alert-error").classList.remove("d-none");
        document.getElementById("betting-error").innerHTML = "The amount of gold you entered is not valid";

        divAlertLoss.classList.add("d-none");
        divAlertWon.classList.add("d-none");

      } else if (horseUserBettingOn > 5 || horseUserBettingOn < 1) {
        // alert("Horsey horse no good?")
        document.getElementById("alert-error").classList.remove("d-none");
        document.getElementById("betting-error").innerHTML = "You can only bet from horse 1 to 5";

        divAlertLoss.classList.add("d-none");
          divAlertWon.classList.add("d-none");

      } else if(horseUserBettingOn > 0 && bettingGoldAmount > 0) {
        this.numGold -= bettingGoldAmount;
        document.getElementById("alert-error").classList.add("d-none");
        if (result == horseUserBettingOn) {
          console.log("won")
          this.numGold += bettingGoldAmount * odds;
          wonOnBet = bettingGoldAmount * odds;
          divAlertLoss.classList.add("d-none");
          divAlertWon.classList.remove("d-none");

        } else {
          console.log("lost")
          divAlertLoss.classList.remove("d-none");
          divAlertWon.classList.add("d-none");

        }
      }
      
      console.log("- odds   " + odds)
      console.log("- bet    " + horseUserBettingOn);
      console.log("- result " + result);
      console.log("- earned " + wonOnBet);
      
      // document.getElementById('betting-gold-amount').value = '';
      // document.getElementById('horse-bet-winning').value = '';
    },


    todo: function () {



      setInterval(() => {
        let fishermen = this.land.fisherman.count
        let sellers = this.land.seller.count

        let fishermenReady = this.fishermen !== 0 && this.stance !== false ? true : false;

        // console.log(fishermenReady)

        if (fishermenReady == true && this.objects.fish.count < this.availableStorage) {
          let numeroDePeixes = this.land.fisherman.count / 10
          this.updateFishCount(this.objects.fish.count + numeroDePeixes)
          this.objects.fish.total += numeroDePeixes
          // console.log(numeroDePeixes)
          // console.log(this.objects.fish.count)

          this.updateFishingState ();


          // implement hability for fisherman to use bait
          // well leave a if until I find a better solution
          if (this.objects.bait.count > 0) {

            this.objects.bait.count -= numeroDePeixes;
            this.updateFishCount(this.objects.fish.count + numeroDePeixes);
            
            // console.log(numeroDePeixes)
            // console.log(this.objects.bait.count)

            // this.objects.fish.total++;
            
          }
        }


        if (sellers !== 0 && this.objects.fish.value > 0) {
          let numeroDePeixes = this.land.seller.count
          this.updateFishCount(this.objects.fish.count - numeroDePeixes)
          this.numGold += this.land.seller.count * this.objects.fish.cost
         this.updateFishingState ();
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
  }

});

