"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const updatedSchema = new mongoose_1.Schema({
    user: mongoose_1.Schema.Types.ObjectId,
    date: mongoose_1.Schema.Types.Date
});
const attributeSchema = new mongoose_1.Schema({
    id: String,
    string: String,
    number: Number,
    reference: mongoose_1.Schema.Types.ObjectId
});
exports.RecordSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    schm: mongoose_1.Schema.Types.ObjectId,
    created: mongoose_1.Schema.Types.Date,
    updated: [updatedSchema],
    attributes: [attributeSchema]
});
