var express = require("express");
var router = express.Router();

const User = require("../models/Users");
const Exercise = require("../models/Exercises");
const Plan = require("../models/Plans");

router.get("/", function(req, res) {
    User.find(function(err, user) {
        if (err) {
            console.log(err);
        } else {
            res.json(user);
        }
    })
});

router.post("/register", (req, res) => {
    const newUser = new User({
        name: req.body.userName,
        email: req.body.userEmail,
        password: req.body.userPassword,
        loggedIn: true,
        dob: req.body.userDOB,
        age: req.body.age,
        height: req.body.height,
        weight: req.body.weight,
        physicalIssues: req.body.physicalIssues
    });

    newUser.save()
        .then(user => {
            console.log("Saved");
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.route("/login").post((req, res) => {

    console.log(req.body);

    let response = {
        val: ""
    };

    if (!req.body.userEmail || !req.body.userPassword) {
        console.log("Why is this coming up?")
        response.val = 0;
        console.log("Empty Fields.");
        res.json(response);
    } else {
        User.findOne({ email: req.body.userEmail }, function(err, user) {
            if (err) {
                console.log(err);
                console.log("Rubbish.");
            } else {
                console.log("Working");
                if (!user) {
                    console.log("Not registered.");
                    response.val = 1;
                    res.json(response);
                } else {
                    if (req.body.userPassword === user.password) {
                        const idRequired = user._id;
                        User.findByIdAndUpdate(idRequired, { $set: { loggedIn: true } }, (err, doc) => {
                            if (err) return console.log(err);
                            else return console.log("Here are the docs: ", doc);
                        });
                        console.log("You're in!");
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

router.route("/logout").post((req, res) => {

    console.log(req.body);

    let response = {
        val: ""
    };

    User.findByIdAndUpdate(req.body.userID, { $set: { loggedIn: false } }, (err, doc) => {
        if (err) return console.log(err);
        else console.log("Updated: ", doc);
    });
    console.log("You're logged out!");
    response.val = 1;
    res.json(response);

});

router.get("/exercises", function(req, res) {
    Exercise.find(function(err, exercise) {
        if (err) {
            console.log(err);
        } else {
            res.json(exercise);
        }
    })
});

router.post("/addexercise", (req, res) => {

    const newExercise = new Exercise({
        exerciseName: req.body.exerciseName,
        type: req.body.type,
        target: req.body.target,
        info: req.body.info,
        equipment: req.body.equipment,
        forAll: req.body.forAll,
        addedBy: req.body.addedBy
    });

    console.log("This is the new exercise: ", newExercise);

    newExercise.save()
        .then(exercise => {
            console.log("Saved");
            res.status(200).json(exercise);
        })
        .catch(err => {
            console.log(err)
            res.status(400).send(err);
        });
});

router.route("/editexercise").post((req, res) => {
    console.log(req.body);

    let response = {
        val: ""
    }

    User.findOne({ loggedIn: true }, (err, user) => {
        if (err) {
            return console.log(err);
        } else {
            console.log("We have reached the point where we look through all the exercises to see who added them.");
            if (!req.body.exerciseName) {
                response.val = 1;
                res.json(response);
                console.log("Fill in the name of the exercise that you wish to edit.")
            } else {
                if (user.email === "rajarshi.ray16@gmail.com") {
                    Exercise.findOne({ exerciseName: req.body.exerciseName, forAll: true }, (err2, exercise) => {
                        if (err2) {
                            return console.log(err2);
                        } else {
                            if (!req.body.type && (req.body.target === []) && !req.body.info) {
                                console.log("Fill in at least one of the aspects to edit.")
                                response.val = 2;
                                res.json(response);
                            } else {
                                if (req.body.type) {
                                    const idRequired = user._id;
                                    Exercise.findByIdAndUpdate(idRequired, { $set: { type: req.body.type } }, (err, docs) => {
                                        if (err) return console.log(err);
                                        else console.log("Delete: ", docs);
                                    });
                                    console.log("The changes have been made for the user.")
                                }
                                if (req.body.target !== []) {
                                    const idRequired = user._id;
                                    Exercise.findByIdAndUpdate(idRequired, { $set: { target: req.body.target } }, (err, docs) => {
                                        if (err) return console.log(err);
                                        else console.log("Delete: ", docs);
                                    });
                                    console.log("The changes have been made for the user.")
                                }
                                if (req.body.info) {
                                    const idRequired = user._id;
                                    Exercise.findByIdAndUpdate(idRequired, { $set: { info: req.body.info } }, (err, docs) => {
                                        if (err) return console.log(err);
                                        else console.log("Delete: ", docs);
                                    });
                                    console.log("The changes have been made for the user.")
                                }
                                response.val = 3;
                                res.json(response);
                            }
                        }
                    });
                } else {
                    Exercise.findOne({ addedBy: user.email, exerciseName: req.body.exerciseName, forAll: false }, (err2, exercise) => {
                        if (err2) {
                            return console.log(err2);
                        } else {
                            if (!req.body.type && (req.body.target === []) && !req.body.info) {
                                console.log("Fill in at least one of the aspects to edit.")
                                response.val = 2;
                                res.json(response);
                            } else {
                                if (req.body.type) {
                                    const idRequired = user._id;
                                    Exercise.findByIdAndUpdate(idRequired, { $set: { type: req.body.type } }, (err, docs) => {
                                        if (err) return console.log(err);
                                        else console.log("Delete: ", docs);
                                    });
                                    console.log("The changes have been made for the user.")
                                }
                                if (req.body.target !== []) {
                                    const idRequired = user._id;
                                    Exercise.findByIdAndUpdate(idRequired, { $set: { target: req.body.target } }, (err, docs) => {
                                        if (err) return console.log(err);
                                        else console.log("Delete: ", docs);
                                    });
                                    console.log("The changes have been made for the user.")
                                }
                                if (req.body.info) {
                                    const idRequired = user._id;
                                    Exercise.findByIdAndUpdate(idRequired, { $set: { info: req.body.info } }, (err, docs) => {
                                        if (err) return console.log(err);
                                        else console.log("Delete: ", docs);
                                    });
                                    console.log("The changes have been made for the user.")
                                }
                                response.val = 3;
                                res.json(response);
                            }
                        }
                    });
                }
            }
        }
    })
});

router.route("/deleteexercise").post((req, res) => {
    console.log(req.body);

    let response = {
        val: ""
    }

    User.findOne({ loggedIn: true }, function(err, user) {
        if (err)
            console.log(err);
        else {
            if (!req.body.exerciseName) {
                console.log("Please, enter which exercise you wish to delete.")
                response.val = 1;
                return res.json(response);
            }
            let idRequired;
            if (user.email === "rajarshi.ray16@gmail.com") {
                Exercise.findOne({ addedBy: "admin" }, function(err2, exercise) {
                    if (err2) return console.log(err2);
                    else {
                        idRequired = exercise._id;
                    }
                });
                Exercise.findByIdAndDelete(idRequired, (err, docs) => {
                    if (err) return console.log(err);
                    else console.log("Deleted: ", docs);
                });
                response.val = 2;
                return res.json(response);
            } else {
                Exercise.findOne({ addedBy: user.email }, function(err2, exercise) {
                    if (err2) return console.log(err2);
                    else {
                        idRequired = exercise._id;
                    }
                });
                Exercise.findByIdAndDelete(idRequired, (err, docs) => {
                    if (err) return console.log(err);
                    else console.log("Deleted: ", docs);
                });
                response.val = 2;
                return res.json(response);
            }
        }
    });
});

router.get("/plans", function(req, res) {
    Plan.find(function(err, plan) {
        if (err) {
            console.log(err);
        } else {
            res.json(plan);
        }
    })
});

router.post("/addplan", (req, res) => {

    // let existingWorkouts;

    // Plan.find(function(err, plan) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         existingWorkouts = plan;
    //     }
    // })

    // existingWorkouts.forEach(existingWorkout => {
    //     existingWorkout
    // });

    const newPlan = new Plan({
        email: req.body.email,
        planName: req.body.planName,
        type: req.body.type,
        target: req.body.target,
        day: req.body.day,
        plans: req.body.plans,
        restTimeBDE: req.body.restTimeBDE
    });

    console.log("This is the new exercise: ", newPlan);

    newPlan.save()
        .then(plan => {
            console.log("Saved");
            res.status(200).json(plan);
        })
        .catch(err => {
            console.log(err)
            res.status(400).send(err);
        });
});

module.exports = router;