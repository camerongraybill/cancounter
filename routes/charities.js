const Router = require("express").Router;

const kiosk_router = new Router();

kiosk_router.route("")
    .get((req, res, next) => {
        res.render("charities");
    });

module.exports = kiosk_router;