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
const class_route_1 = require("../../models/class.route");
const express_1 = require("express");
const Passport = require("passport");
const passportConf_1 = require("./passportConf");
const users_1 = require("../users");
const bcrypt_1 = require("bcrypt");
const _ = require('lodash');
const conf = require('../../../config/enviroment');
class AuthService extends class_route_1.BaseRoute {
    constructor() {
        super();
        this.userCtrl = new users_1.UserController();
    }
    static get route() {
        let r = express_1.Router();
        var obj = new AuthService();
        r.get("/", (req, res, next) => {
            obj.index(req, res, next);
        });
        r.post('/', (req, res, next) => {
            obj.login(req, res, next);
        });
        return r;
    }
    static isAutha(role) {
        if (!role)
            role = 'guest';
        return (req, res, next) => {
            if (req.isAuthenticated() && AuthService.isRole(role, req.user.role))
                return next();
            res.status(401).json({ message: 'no auth' });
        };
    }
    static isAuthJWT(role) {
        if (!role)
            role = 'guest';
        let opt = {};
        opt.session = false;
        return (req, res, next) => {
            Passport.authenticate('jwt', opt, (nose, user, info, status) => {
                console.log(nose, user, info, status);
                if (user && AuthService.isRole(role, user.role)) {
                    req.user = user;
                    return next();
                }
                res.status(401).json({ message: info ? info.message : 'no auth' });
            })(req, res, next);
        };
    }
    static isRole(role, userRole) {
        let ri = AuthService.roles.indexOf(role);
        let uri = AuthService.roles.indexOf(userRole);
        if (!role || ri === -1)
            return false;
        if (!userRole || uri === -1)
            return false;
        if (uri >= ri)
            return true;
        else
            return false;
    }
    static comparePasswords(candidate, hash) {
        return bcrypt_1.compare(candidate, hash);
    }
    static hashPassword(password) {
        return bcrypt_1.hash(password, 10);
    }
    index(req, res, next) {
        res.json({ message: "empty route" });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.body.username;
            const password = req.body.password;
            if (!req.body.username || !req.body.password) {
                res.status(401).json({ message: 'no name or password set' });
                return;
            }
            const user = yield this.userCtrl.getUserByEmail(name);
            if (!user._id) {
                res.status(401).json({ message: "username did not match" });
                return;
            }
            const match = yield AuthService.comparePasswords(password, user.password);
            if (!match) {
                res.status(401).json({ message: "passwords did not match" });
                return;
            }
            res.json({ message: "ok", token: passportConf_1.PassportConf.SignJWT(user.payload()) });
        });
    }
}
AuthService.roles = ['guest', 'user', 'editor', 'admin'];
exports.AuthService = AuthService;
