const router = new require("express").Router();
const passport = require("passport");

router.route("").post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {res.redirect('/')});

module.exports = router;