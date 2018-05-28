"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
var config = require('../../config/enviroment');
class MongoConnection {
    constructor(name, schm) {
        this.MConnOptions = {};
        global.Promise = require("q").Promise;
        mongoose.Promise = global.Promise;
        this._connection = mongoose_1.createConnection(MongoConnection.STRING_CONNECTION);
        this.model = this._connection.model(name, schm);
    }
}
MongoConnection.STRING_CONNECTION = config.mongo.uri;
exports.MongoConnection = MongoConnection;
