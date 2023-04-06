global.express=require('express')
global.config = require("./configs/configs.json");
global.RunSQL = require("./db/db.fun").RunSQL
global.RunSQLOne = require("./db/db.fun").RunSQLOne
global.checker=require('./middleware/checkaccess').checker;
global.router = express.Router();