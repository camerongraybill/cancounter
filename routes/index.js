const express = require('express');
const router = new express.Router();
let io = null;

router.get('/', function(req, res, next) {
  res.render("index.html");
});

module.exports = {
    router: router,
    register_io: (io_) => {
        io = io_;
    },
    send_update: (new_data) => {
        io.emit('new_data', new_data);
    }
};