const router = new require("express").Router();

db = require("../../db").db;

router.route("")
    .get((req, res, next) => {
        // Return all kiosks
        db.query("select * from kiosk_summary", (err, rows) => {
            if (err)
                next(err);
            else
                res.json(rows.rows);
        })
    });

router.route("/:name")
    .get((req, res, next) => {
        // Return specific kiosk
        db.query("select * from kiosk_summary k where k.name = $1", [req.params.name], (err, rows) => {
            if (err)
                next(err);
            else if (rows.rows.length === 0)
                next();
            else
                res.json(rows.rows[0]);
        });
    });

router.route("/:name/add")
    .get((req, res, next) => {
        // Add a can to a kiosk
        db.query("select id from kiosks where name = $1", [req.params.name], (err, name_rows) => {
            if (err)
                next(err);
            else if (name_rows.rows.length === 0)
                next();
            else
                db.query("select charity_name from active_ranges where end_time is null", (err, active_charity) => {
                    if (err)
                        next(err);
                    else if (active_charity.rows.length === 0)
                        next();
                    else
                        db.query("insert into can_submissions (kiosk, charity) values ($1, $2)", [name_rows.rows[0]['id'], active_charity.rows[0]['name']], (err) => {
                            if (err)
                                next(err);
                            else
                                res.sendStatus(200);
                        });
                })
        });
    });

router.route("/:name/reset")
    .get((req, res, next) => {
        // Add a can to a kiosk
        db.query("update kiosks set (last_reset) = (now()) where name = $1", [req.params.name], (err) => {
            if (err)
                next(err);
            else
                res.sendStatus(200);
        });
    });

module.exports = router;