const router = new require("express").Router();

db = require("../../db").db;

router.route("")
    .get((req, res) => {
        // Return all charities
        res.json([{}])
    });

router.route("/current")
    .get((req, res) => {
         // Return name for current charity
        res.json({
            name: 'CCI',
            imgurl: 'http://drexel.edu/~/media/Images/cci/Logos/College_ComputingInformatics-oneline100height.ashx?h=100&w=642&hash=9475C156117BEE0FA24744513A2052C69AAA1FF9'
        });
    });

router.route("/:name")
    .get((req, res) => {
        // Return specific charity
        res.json({
            name: 'CCI',
            imgurl: 'http://drexel.edu/~/media/Images/cci/Logos/College_ComputingInformatics-oneline100height.ashx?h=100&w=642&hash=9475C156117BEE0FA24744513A2052C69AAA1FF9',
            description: 'some shitty college',
            location: "Philly",
            total_amount: 1,
            total_cans: 2,
            active: true
        });
    });

module.exports = router;