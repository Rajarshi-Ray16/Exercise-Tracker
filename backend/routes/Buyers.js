var express = require("express");
var router = express.Router();

// Load Buyer model
const Buyer = require("../models/Buyers");
const Item = require("../models/Items")
const Product = require("../models/Products")

// Getting all the buyers
router.get("/", function(req, res) {
    Buyer.find(function(err, buyers) {
        if (err) {
            console.log(err);
        } else {
            res.json(buyers);
        }
    })
});

// Add a buyer to db
router.post("/register", (req, res) => {

    const newBuyer = new Buyer({
        buyerName: req.body.buyerName,
        buyerEmail: req.body.buyerEmail,
        age: req.body.age,
        buyerContactNumber: req.body.buyerContactNumber,
        batchName: req.body.batchName,
        buyerPassword: req.body.buyerPassword,
        date: req.body.date,
        wallet: req.body.wallet,
        loggedIn: req.body.loggedIn
    });

    newBuyer.save()
        .then(buyer => {
            // console.log(buyer)
            console.log("Saved");
            res.status(200).json(buyer);
        })
        .catch(err => {
            return res.status(400).send(err);
        });

});

// Login API
router.route("/login").post((req, res) => {

    console.log(req.body);

    let response = {
        val: ""
    };

    // const id = req.body.id;

    if (!req.body.buyerEmail || !req.body.buyerPassword) {
        console.log("Why is this coming up?")
        response.val = 0;
        console.log("Empty Fields.");
        res.json(response);
    } else {
        Buyer.findOne({ buyerEmail: req.body.buyerEmail }, function(err, buyers) {
            if (err) {
                console.log(err);
                console.log("Rubbish.");
            } else {
                console.log("Working");
                if (!buyers) {
                    //Not found
                    console.log("Not registered.");
                    response.val = 1;
                    res.json(response);
                } else {
                    if (req.body.buyerPassword === buyers.buyerPassword) {
                        // const identifier = { buyerEmail: req.body.buyerEmail };
                        // const update = { $set: { loggedIn: true } };
                        // Buyer.updateOne(identifier, update, { upsert: true });
                        const idRequired = buyers._id;
                        // Buyer.findByIdAndUpdate(idRequired, { $set: { "loggedIn": true } }, { new: true });
                        Buyer.findByIdAndUpdate(idRequired, { $set: { loggedIn: true } }, (err, doc) => {
                            if (err) return console.log(err);
                        });
                        // res.json(response);
                        console.log("You're in!");
                        // buyers.loggedIn = true;
                        response.val = 3;
                        res.json(response);
                    } else {
                        console.log("Not your account!");
                        response.val = 2;
                        res.json(response);
                    }
                }
            }
        });
    }
});

//Logout API
router.route("/logout").post((req, res) => {
    console.log(req.body);

    let response = {
        val: ""
    };

    Buyer.findOne({ buyerName: req.body.buyerName }, function(err, buyers) {
        if (err)
            console.log(err);
        else {
            console.log("Working");
            const idRequired = buyers._id;
            // Buyer.findByIdAndUpdate(idRequired, { $set: { "loggedIn": true } }, { new: true });
            Buyer.findByIdAndUpdate(idRequired, { $set: { loggedIn: false } }, (err, doc) => {
                if (err) return console.log(err);
            });
            console.log("You're logged out!");
            response.val = 1;
            res.json(response);
        }
    });
});

// Edit the details of a buyer
router.route("/edit").post((req, res) => {
    console.log(req.body);

    let response = {
        val: ""
    }

    Buyer.findOne({ loggedIn: true }, (err, buyer) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Working till here.");
            if (!req.body.password) {
                response.val = 0;
                res.json(response);
            } else {
                if (!req.body.buyerName && !req.body.buyerEmail && !req.body.shopName && !req.body.buyerContactNumber && !req.body.openingTime && !req.body.closingTime) {
                    response.val = 1;
                    res.json(response);
                    console.log("Fill at least one of the blanks.")
                } else {
                    if (req.body.buyerName) {
                        const idRequired = buyer._id;
                        Buyer.findByIdAndUpdate(idRequired, { $set: { buyerName: req.body.buyerName } }, (err, docs) => {
                            if (err) return console.log(err);
                            else console.log("Delete: ", docs);
                        });
                        console.log("The changes have been made for the user.")
                    }
                    if (req.body.buyerEmail) {
                        const idRequired = buyer._id;
                        Buyer.findByIdAndUpdate(idRequired, { $set: { buyerEmail: req.body.buyerEmail } }, (err, docs) => {
                            if (err) return console.log(err);
                            else console.log("Delete: ", docs);
                        });
                        console.log("The changes have been made for the user.")
                    }
                    if (req.body.buyerContactNumber) {
                        const idRequired = buyer._id;
                        Buyer.findByIdAndUpdate(idRequired, { $set: { buyerContactNumber: req.body.buyerContactNumber } }, (err, docs) => {
                            if (err) return console.log(err);
                            else console.log("Delete: ", docs);
                        });
                        console.log("The changes have been made for the user.")
                    }
                    response.val = 2;
                    res.json(response);
                }
            }
        }
    })
});

// Delete an account
router.route("/delete").post((req, res) => {
    console.log(req.body);

    let response = {
        val: ""
    }

    Buyer.findOne({ loggedIn: true }, function(err, buyers) {
        if (err)
            console.log(err);
        else {
            if (!req.body.buyerPassword) {
                response.val = 0;
                console.log("Enter your password to delete your account!");
                return res.json(response);
            } else {
                if (!(buyers.buyerPassword === req.body.buyerPassword)) {
                    console.log("The password is incorrect!");
                    response.val = 1;
                    res.json(response);
                } else {
                    console.log("Working");
                    const idRequired = buyers._id;
                    Buyer.findByIdAndUpdate(idRequired, { $set: { loggedIn: false } }, (err, docs) => {
                        if (err) return console.log(err);
                        else console.log("Updated: ", docs);
                    });
                    console.log("You're logged out!");
                    Buyer.findByIdAndDelete(idRequired, (err, docs) => {
                        if (err) return console.log(err);
                        else console.log("Deleted: ", docs);
                    });
                    console.log("The account has been deleted.");
                    response.val = 2;
                    res.json(response);
                }
            }
        }
    });
});

// Add money to a buyer's wallet
router.route("/addtowallet").post((req, res) => {
    console.log(req.body);

    let response = {
        val: ""
    };

    if (req.body.amountToBeAdded === 0) {
        response.val = 0;
        res.json(response);
    } else {
        Buyer.findOne({ loggedIn: true }, function(err, buyers) {
            if (err)
                console.log(err);
            else {
                console.log("Working");
                if (!buyers) {
                    console.log("Not logged in.");
                    response.val = 1;
                    res.json(response);
                } else {
                    const idRequired = buyers._id;
                    let finalAmount = parseInt(buyers.wallet) + parseInt(req.body.amountToBeAdded);
                    Buyer.findByIdAndUpdate(idRequired, { $set: { wallet: finalAmount } }, (err, doc) => {
                        if (err) return console.log(err);
                        response.val = 2;
                        res.json(response);
                    });
                }
            }
        });
    }
    console.log("In server", response);
});

// Spend the money from the wallet
router.route("/spendfromwallet").post((req, res) => {
    console.log(req.body);

    let response = {
        val: ""
    };

    const newProduct = new Product({
        vendor: req.body.shopName,
        buyer: req.body.buyerName,
        productName: req.body.itemName,
        status: req.body.status,
        addons: req.body.itemAddons,
        orderTime: req.body.orderTime
    });

    Buyer.findOne({ loggedIn: true }, function(err1, buyer) {
        if (err1) {
            console.log(err1);
        } else {
            if (req.body.amountToBeSpent === 0) {
                response.val = 0;
                res.json(response);
            } else if (req.body.amountToBeSpent >= buyer.wallet) {
                response.val = 1;
                res.json(response);
            } else {
                let idRequired = buyer._id;
                let finalAmount = parseInt(buyer.wallet) - parseInt(req.body.amountToBeSpent);
                Buyer.findByIdAndUpdate(idRequired, { $set: { wallet: finalAmount } }, (err2, doc1) => {
                    if (err2) return console.log(err2);
                    else console.log("Here: ", doc1)
                });
                newProduct.save()
                    .then(product => {
                        console.log("Saved: ", product);
                    })
                    .catch(err => {
                        return res.status(400).send(err);
                    });
                response.val = 2;
                res.json(response);
            }
        }
    })
    console.log("In server", response);
});

router.route("/rateproduct").post((req, res) => {
    // console.log(req.body);
    // console.log("We are rating a product.")

    let response = {
        val: ""
    };

    Item.findOne({ itemName: req.body.itemName }, function(err1, item) {
        if (err1) {
            console.log("There was an error")
            console.log(err1);
        } else {
            // console.log("The item has been found as: ", item);
            if (item.timesOrdered === 0) {
                let idRequired = item._id;
                Item.findByIdAndUpdate(idRequired, { $set: { rating: 0 } }, (err2, doc) => {
                    if (err2) return console.log(err2);
                    else console.log("Here: ", doc);
                })
            } else {
                console.log("The original rating is: ", item.rating);
                let finalValue = ((item.rating * item.timesOrdered) + parseInt(req.body.productRating)) / (item.timesOrdered);
                console.log("The final rating is: ", finalValue);
                let idRequired = item._id;
                Item.findByIdAndUpdate(idRequired, { $set: { rating: finalValue } }, (err2, doc) => {
                    if (err2) return console.log(err2);
                    else console.log("Here: ", doc);
                })
            }
            response.val = 1
            res.json(response);
        }
    });

})

module.exports = router;