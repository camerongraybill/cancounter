const Router = require("express").Router;

const api_router = new Router();

api_router.use("/auth", require("./api_modules/auth"));
api_router.use("/charities", require("./api_modules/charities"));
api_router.use("/kiosks", require("./api_modules/kiosks"));
api_router.use("/summary", require("./api_modules/summary"));


module.exports = api_router;