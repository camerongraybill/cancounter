const router = new require("express").Router();

db = require("../../db").db;

router.route("")
    .get((req, res, next) => {
        // Return all charities
        db.query("select * from charities", (err, rows) => {
            if (err)
                next(err);
            else
                res.json(rows.rows);
        });
    });

router.route("/current")
    .get((req, res, next) => {
         // Return name for current charity
        db.query("select * from charities c, active_ranges a where a.charity_name = c.name and a.end_time is null", (err, rows) => {
            if (err)
                next(err);
            else
                res.json(rows.rows[0]);
        });
    });

router.route("/:name")
    .get((req, res, next) => {
        // Return specific charity
        db.query("select * from charities c where c.name = $1", (err, rows) => {
            if (err)
                next(err);
            else if (rows.rows.length() === 0)
                next();
            else
                res.json(rows.rows[0]);
        });
    });

module.exports = router;