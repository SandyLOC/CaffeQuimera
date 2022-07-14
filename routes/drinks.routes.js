const router = require("express").Router();
const Drink = require("../models/Drinks.model")
const Pastry = require("../models/Pastries.model")
const isAdmin = require("../middleware/isAdmin");

router.get("/drinks", (req, res, next) => {
  let admin = false
  if(req.session?.user?.role === "admin"){
    admin = true
  }
  Drink.find().sort({type: 1})
  .then(drinks => {
    res.render("drinks", {drinks, admin});
  })

});

router.get("/pastries", (req, res, next) => {
  Pastry.find()
  .then(pastries => {
    res.render("pastries", {pastries});
})

});
router.get("/new-product", isAdmin, (req, res, next) => {
    res.render("newproduct");
  });


router.post("/new-product", (req, res) => {
    console.log(req.body)

    //Store in mongo db
    let type = req.body.type;
    if(type === "pastel" || type === "nieve"){
        Pastry.create(req.body)
        .then(newPastry => {
        console.log(newPastry)
        res.redirect("/pastries")
        }).catch(console.log("Error creating new pastry"))
    } else {
        Drink.create(req.body)
        .then(newDrink => {
          console.log(newDrink)
          res.redirect("/drinks")
        }).catch(console.log("Error creating new drink"))
    }
})

//Route to order
  router.post("/orders", async (req, res) => {
    console.log(req.body)
    const orders = JSON.parse(req.body.drinks)

    //Find drink by ID and send to order
    const drinks = await Drink.find({ '_id': { $in: orders } })
    const pastries = await Pastry.find({ '_id': { $in: orders } })
    
        console.log(drinks)
        res.render("order", ({drinks}))

})

router.post("/send-orders", async (req, res) => {
  console.log("orders", req.body)

res.send("Orden enviada, gracias!")


})
  module.exports = router