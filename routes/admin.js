const Router = require("express").Router;

const admin_router = new Router();

admin_router.route("")
    .get((req, res, next) => {
        res.render("admin");
    });

module.exports = admin_router;