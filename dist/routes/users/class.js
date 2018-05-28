"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(obj) {
        if (obj) {
            if (obj._id) {
                this._id = obj.id;
            }
            if (obj.email) {
                this.email = obj.email;
            }
            if (obj.firstName) {
                this.firstName = obj.firstName;
            }
            if (obj.lastName) {
                this.lastName = obj.lastName;
            }
            if (obj.password) {
                this.password = obj.password;
            }
            if (obj.role) {
                this.role = obj.role;
            }
        }
    }
    payload() {
        return {
            _id: this._id,
            role: this.role
        };
    }
    json() {
        let obj = {};
        if (this._id) {
            obj._id = this._id;
        }
        obj.email = this.email;
        obj.firstName = this.firstName;
        obj.lastName = this.lastName;
        obj.role = this.role;
        obj.password = '***';
        return obj;
    }
}
exports.User = User;
