import { Schema } from "mongoose";

const updatedSchema = new Schema({
    user:Schema.Types.ObjectId,
    date:Schema.Types.Date
});

const attributeSchema = new Schema({
    id:String,
    string:String,
    number:Number,
    reference:Schema.Types.ObjectId
});
export const RecordSchema = new Schema({
    _id:Schema.Types.ObjectId,
    schm:Schema.Types.ObjectId,
    created:Schema.Types.Date,
    updated:[updatedSchema],
    attributes:[attributeSchema]
});

// export const RecordSchema: Schema = new Schema({
//     created: Schema.Types.Date,
//     email: Schema.Types.String,
//     password: Schema.Types.String,
//     firstName: Schema.Types.String,
//     lastName: Schema.Types.String,
//     role: Schema.Types.String,
// });