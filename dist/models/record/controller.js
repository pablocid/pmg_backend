"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../dataconnection/mongodb");
const schema_1 = require("./schema");
exports.Records = new mongodb_1.MongoConnection('records', schema_1.RecordSchema).model;
