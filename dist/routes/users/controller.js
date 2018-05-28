"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../dataconnection/mongodb");
const schema_1 = require("./schema");
const class_1 = require("./class");
const auth_1 = require("../auth");
const lodash_1 = require("lodash");
class UserController {
    constructor() {
        this.userModel = new mongodb_1.MongoConnection('User', schema_1.UserSchema).model;
    }
    get users() {
        return this.userModel.find()
            .then(u => {
            return u.map(x => new class_1.User(x));
        })
            .catch(e => { throw e; });
    }
    getUser(id) {
        return this.userModel.findOne({ _id: id })
            .then(x => {
            let usr = new class_1.User(x);
            return usr;
        })
            .catch(e => { throw e; });
    }
    setUser(user) {
        return auth_1.AuthService.hashPassword(user.password)
            .then(hashPass => {
            if (!user.password)
                throw { message: 'no password' };
            user.password = hashPass;
            return user;
        })
            .then(u => {
            return this.userModel.create(u);
        })
            .then(x => {
            let usr = new class_1.User(x);
            return usr;
        })
            .catch(e => { throw e; });
    }
    updateUser(value) {
        if (!value._id)
            throw { message: '_id dont exist' };
        return this.userModel.findById(value._id)
            .then(usr => {
            if (!usr || !usr._id)
                throw { message: 'user dont exist' };
            return usr;
        })
            .then(usr => {
            if (value.password) {
                return auth_1.AuthService.hashPassword(value.password)
                    .then(hashPass => {
                    value.password = hashPass;
                    return usr;
                })
                    .catch(e => { throw e; });
            }
            return usr;
        })
            .then(usr => {
            if (value.email && value.email !== usr.email) {
                console.log('changind the email', usr.email, value.email);
                return this.userModel.findOne({ email: value.email })
                    .then(exist => {
                    if (exist)
                        throw { message: `the email ${value.email} is already in use, pick another` };
                    return usr;
                })
                    .catch(e => { throw e; });
            }
            return usr;
        })
            .then(usr => lodash_1.extend(usr, value))
            .then(usr => {
            return usr.save()
                .catch((e) => { throw e; });
        })
            .then(usr => new class_1.User(usr))
            .catch(e => { throw e; });
    }
    deleteUser(id) {
        return this.userModel.findByIdAndRemove(id)
            .then((x) => {
            let usr = new class_1.User(x);
            if (!usr._id) {
                throw { message: '_id is not found' };
            }
            return usr;
        })
            .catch(e => { throw e; });
    }
    getUserByFirstName(value) {
        return this.userModel.findOne({ firstName: value })
            .then(x => {
            let usr = new class_1.User(x);
            return usr;
        })
            .catch(e => { throw e; });
    }
    getUserByEmail(value) {
        return this.userModel.findOne({ email: value })
            .then(x => {
            let usr = new class_1.User(x);
            return usr;
        })
            .catch(e => { throw e; });
    }
}
exports.UserController = UserController;
