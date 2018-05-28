"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const Q = require("q");
var conf = require('../../config/enviroment');
class AWSConnection {
    constructor() {
        this.s3 = new aws_sdk_1.S3();
        this.s3.config.accessKeyId = conf.AWS.accessKeyId;
        this.s3.config.secretAccessKey = conf.AWS.AWS_SECRET_ACCESS_KEY;
        this.s3.config.s3BucketEndpoint;
        this.s3.config.setPromisesDependency(Q);
        this.bucket = 'myexpress';
    }
    get listBuckets() {
        return this.s3.listBuckets().promise();
    }
    getBucketFiles() {
        var d = Q.defer();
        this.s3.listObjects({ Bucket: this.bucket }, (err, data) => {
            if (err) {
                d.reject(err);
            }
            d.resolve(data);
        });
        return d.promise;
    }
}
exports.AWSConnection = AWSConnection;
