const router = new require("express").Router();

db = require("../../db").db;

router.route("")
    .get((req, res) => {
        // Return all kiosks
    });

router.route("/:name")
    .get((req, res) => {
        // Return specific kiosk
        res.json({
            id: 1,
            name: "demo",
            location: "here",
            total_earned: 0,
            current_cans: 2,
            total_cans: 10,
            money_in_last_hour: 1
        });
    });

router.route("/:name/add")
    .get((req, res) => {
        // Add a can to a kiosk
    });

router.route("/:name/reset")
    .get((req, res) => {
        // Add a can to a kiosk
    });

module.exports = router;