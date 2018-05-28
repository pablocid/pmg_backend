"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./record/controller");
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const GraphQLJSON = require('graphql-type-json');
function checkParam(param, dataType) {
    if (param === null) {
        return false;
    }
    var response = false;
    if (dataType === 'string') {
        if (typeof param === 'string' && param.length > 0) {
            response = true;
        }
    }
    if (dataType === 'number') {
        if (typeof param === 'number') {
            response = true;
        }
        if (typeof param === 'string') {
            if (/^\d*$/.test(param)) {
                response = true;
            }
        }
    }
    if (dataType === 'objectId') {
        if (/^[0-9a-f]{24}$/i.test(param)) {
            response = true;
        }
    }
    if (dataType === 'filter') {
        try {
            var arr = JSON.parse(param);
            if (arr.length) {
                var isValid = true;
                for (var index = 0; index < arr.length; index++) {
                    if (arr[index].key === null || arr[index].value === null || arr[index].datatype === null) {
                        isValid = false;
                    }
                }
                response = isValid;
            }
        }
        catch (err) {
            response = false;
            console.log('invalid JSON');
        }
    }
    return response;
}
exports.resolvers = {
    Query: {
        getRecord: (root, o) => __awaiter(this, void 0, void 0, function* () { return yield controller_1.Records.findById(o.id); }),
        getRecords: (root, o) => __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (checkParam(o.schm, 'objectId')) {
                query.schm = o.schm;
            }
            if (checkParam(o.filter, 'filter')) {
                query["$and"] = [];
                var filter = JSON.parse(filter);
                for (let i = 0; i < filter.length; i++) {
                    const p = { attributes: {} };
                    p["attributes"]["$elemMatch"] = {};
                    p["attributes"]["$elemMatch"]['id'] = filter[i].key;
                    p["attributes"]["$elemMatch"][filter[i].datatype] = filter[i].value;
                    query["$and"].push(p);
                }
            }
            return yield controller_1.Records.find(query);
        }),
        getUnit: (root, o) => __awaiter(this, void 0, void 0, function* () {
            const record = yield controller_1.Records.findById(o.id);
            record.obj = record;
            return record;
        }),
    },
    Unit: {
        assessments: (obj, rec, context, info) => __awaiter(this, void 0, void 0, function* () {
            const pipe = [];
            pipe.push({ $match: { attributes: { $elemMatch: { "id": "57c42f77c8307cd5b82f4486", "reference": obj._id } } } });
            if (Array.isArray(rec.ids) && rec.ids.length > 0) {
                const match = { $match: { $or: [] } };
                for (let schm of rec.ids) {
                    match.$match.$or.push({ schm: mongoose_1.Types.ObjectId(schm) });
                }
                pipe.push(match);
            }
            return yield controller_1.Records.aggregate(pipe);
        }),
        parents: (obj, rec, context, info) => __awaiter(this, void 0, void 0, function* () {
            const query = { $or: [] };
            for (let id of rec.ids) {
                let ref = lodash_1.find(obj.attributes, { id });
                if (!rec || !ref.reference) {
                    continue;
                }
                query.$or.push({ _id: ref.reference });
            }
            console.log(query);
            return yield controller_1.Records.find(query);
        }),
        children: (obj, rec, context, info) => __awaiter(this, void 0, void 0, function* () {
            const q = {
                attributes: {
                    $elemMatch: {
                        "id": rec.id || "no id",
                        "reference": obj._id
                    }
                }
            };
            if (rec.query) {
                if (rec.query.schm) {
                    q['schm'] = rec.query.schm;
                }
                if (rec.query.filter) {
                    q["$and"] = [];
                    const filter = rec.query.filter;
                    for (var i = 0; i < filter.length; i++) {
                        const p = { attributes: {} };
                        p["attributes"]["$elemMatch"] = {};
                        p["attributes"]["$elemMatch"]['id'] = filter[i].key;
                        p["attributes"]["$elemMatch"][filter[i].datatype] = filter[i].value;
                        q["$and"].push(p);
                    }
                }
            }
            return yield controller_1.Records.find(q);
        }),
        attributes: (obj, rec, context, info) => {
            if (!rec.ids || !Array.isArray(rec.ids) || !rec.ids.length) {
                return obj.attributes;
            }
            const attrs = [];
            for (let id of rec.ids) {
                attrs.push(lodash_1.find(obj.attributes, { id }));
            }
            return attrs;
        },
    },
    Assessment: {},
    Record: {
        attributes: (obj, rec, context, info) => {
            if (!rec.ids || !Array.isArray(rec.ids) || !rec.ids.length) {
                return obj.attributes;
            }
            const attrs = [];
            for (let id of rec.ids) {
                attrs.push(lodash_1.find(obj.attributes, { id }));
            }
            return attrs;
        },
        reference: (obj, rec, context, info) => __awaiter(this, void 0, void 0, function* () {
            return yield controller_1.Records
                .findOne({
                schm: rec.schm,
                attributes: {
                    $elemMatch: {
                        "id": rec.id || "57c42f77c8307cd5b82f4486",
                        "reference": obj._id
                    }
                }
            });
        }),
        references: (obj, rec, context, info) => __awaiter(this, void 0, void 0, function* () {
            const pipe = [];
            pipe.push({ $match: { attributes: { $elemMatch: { "id": "57c42f77c8307cd5b82f4486", "reference": obj._id } } } });
            if (Array.isArray(rec.schms) && rec.schms.length > 0) {
                const match = { $match: { $or: [] } };
                for (let schm of rec.schms) {
                    match.$match.$or.push({ schm: mongoose_1.Types.ObjectId(schm) });
                }
                pipe.push(match);
            }
            return yield controller_1.Records.aggregate(pipe);
        }),
        relation: (obj, rec, context, info) => __awaiter(this, void 0, void 0, function* () {
            const q = {
                attributes: {
                    $elemMatch: {
                        "id": rec.id || "no id",
                        "reference": obj._id
                    }
                }
            };
            if (rec.query) {
                if (rec.query.schm) {
                    q['schm'] = rec.query.schm;
                }
                if (rec.query.filter) {
                    q["$and"] = [];
                    const filter = rec.query.filter;
                    for (var i = 0; i < filter.length; i++) {
                        const p = { attributes: {} };
                        p["attributes"]["$elemMatch"] = {};
                        p["attributes"]["$elemMatch"]['id'] = filter[i].key;
                        p["attributes"]["$elemMatch"][filter[i].datatype] = filter[i].value;
                        q["$and"].push(p);
                    }
                }
            }
            console.log(JSON.stringify(q));
            return yield controller_1.Records.find(q);
        }),
    },
    Attribute: {
        Reference: (obj, {}, context, info) => __awaiter(this, void 0, void 0, function* () {
            return yield controller_1.Records.findOne({ _id: obj.reference });
        })
    },
};
