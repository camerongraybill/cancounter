const router = new require("express").Router();

db = require("../../db").db;

router.route("")
    .get((req, res, next) => {
        // Return all charities
        db.query("select * from charity_summary", (err, rows) => {
            if (err)
                next(err);
            else
                res.json(rows.rows);
        });
    });

router.route("/:name")
    .get((req, res, next) => {
        // Return specific charity
        if (req.params.name === "current") {
            db.query("select * from charity c, active_ranges a where a.charity_name = c.name and a.end_time is null", (err, rows) => {
                if (err)
                    next(err);
                else
                    res.json(rows.rows[0]);
            });
        } else {
            db.query("select * from charity_summary c where c.name = $1", [req.params.name], (err, rows) => {
                if (err)
                    next(err);
                else if (rows.rows.length === 0)
                    next();
                else
                    res.json(rows.rows[0]);
            });
        }
    });

module.exports = router;