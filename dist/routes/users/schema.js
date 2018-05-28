"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    created: mongoose_1.Schema.Types.Date,
    email: mongoose_1.Schema.Types.String,
    password: mongoose_1.Schema.Types.String,
    firstName: mongoose_1.Schema.Types.String,
    lastName: mongoose_1.Schema.Types.String,
    role: mongoose_1.Schema.Types.String,
});
