import { Model } from "mongoose";
import { IRecord, IRecordModel } from "./interface";
import { MongoConnection } from '../../dataconnection/mongodb';
import { RecordSchema } from './schema';
//import { Record } from './class';
import { clone } from 'lodash';
import { defer as Defer } from 'q';
import { extend as Extend } from 'lodash';
import { RecordColumn } from "aws-sdk/clients/kinesisanalytics";

// export class RecordController {
//     public recordModel: Model<IRecordModel>;
//     public static get model():  Model<IRecordModel>{
//         return new MongoConnection('records', RecordSchema).model;
//     }

//     constructor() {
//         this.recordModel = new MongoConnection('records', RecordSchema).model;
//     }

//     public async records():Promise<IRecordModel[]> {
//         return await this.recordModel.find();
//     }

//     public async getRecord(_id: string) {
//         return await this.recordModel.findOne({ _id });
//     }

// }

export const Records:Model<IRecordModel> = new MongoConnection('records', RecordSchema).model;