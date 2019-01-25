const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
var users = [];

// GET route to serve index.html as entry point
router.get('/', function(req, res, next) {
    console.log(req.session)
    return res.sendFile(path.join(__dirname + 'index.html'));
});

//POST route to register a new user 
router.post('/register', function(req, res, next) {
    // confirm that user typed same password twice
    console.log(req.session)
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    //If user is registering, it will create a new user and redirect to the profile
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        //Using bcrypt to hash the password to store
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            if (err) {
                return next(err);
            }
            req.body.password = hash;
            var userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
            }
            currentUser = userData;
            users.push(userData);
            req.session.userId = userData.username;
            return res.redirect("/profile");
        })
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})

//if user is logging in, it will check the user's email and password from db and show the profile
router.post("/signin", function(req, res, next) {
    if (req.body.logemail && req.body.logpassword) {
        function found(element) {
            return element.email === req.body.logemail;
        };
        currentUser = users.find(found);

        if (users.find(found) !== undefined) {
            bcrypt.compare(req.body.logpassword, currentUser.password, function(err, result) {
                if (result === true) {
                    req.session.userId = currentUser.username
                    return res.redirect("/profile");
                } else {
                    return res.send('<h2>You have entered the wrong password</h2>');
                }
            })
        } else {
            return res.send('<h2>Your email is not registered</h2>')
        }
    }
})

// GET route for logging in
router.get('/profile', function(req, res, next) {
    if (req.session.userId) {
        return res.send('<h2>Name: </h2>' + currentUser.username + '<h2>Email: </h2>' + currentUser.email+'<br><a type="button" href="/logout">Logout</a>')
    } else {
      var err = new Error("Not authorized");
      err.status = 400;
      return next(err);
    }
});

// GET route for logout which will destroy the session
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;