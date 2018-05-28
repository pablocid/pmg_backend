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
const controller_1 = require("./controller");
const auth_1 = require("../auth");
class UserRoute extends class_route_1.BaseRoute {
    static get route() {
        let r = express_1.Router();
        r.get("/", auth_1.AuthService.isAuthJWT('admin'), (req, res, next) => {
            new UserRoute().index(req, res, next);
        });
        r.get("/me", (req, res, next) => {
            new UserRoute().getMe(req, res, next);
        });
        r.get("/:id", auth_1.AuthService.isAuthJWT('admin'), (req, res, next) => {
            new UserRoute().getUser(req, res, next);
        });
        r.post("/", auth_1.AuthService.isAuthJWT('admin'), (req, res, next) => {
            new UserRoute().setUser(req, res, next);
        });
        r.post("/me", auth_1.AuthService.isAuthJWT('user'), (req, res, next) => {
            new UserRoute().updateMe(req, res, next);
        });
        r.post("/:id", auth_1.AuthService.isAuthJWT('admin'), (req, res, next) => {
            new UserRoute().update(req, res, next);
        });
        r.delete("/:id", auth_1.AuthService.isAuthJWT('admin'), (req, res, next) => {
            new UserRoute().deleteUser(req, res, next);
        });
        return r;
    }
    constructor() {
        super();
        this._userCtrl = new controller_1.UserController();
    }
    index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var u1 = yield this._userCtrl.users;
            }
            catch (e) {
                res.json(e);
                console.error(e.message);
            }
            res.json(u1.map(x => x.json()));
        });
    }
    getMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.user._id;
            let u1;
            try {
                u1 = yield this._userCtrl.getUser(id);
            }
            catch (e) {
                console.error(e.message);
            }
            if (!u1._id) {
                res.status(204).json();
                return;
            }
            res.json(u1.json());
        });
    }
    updateMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = req.user._id;
            const email = req.body.email;
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            let upData = { _id, email, firstName, lastName };
            for (let d in upData) {
                if (upData[d] === undefined)
                    delete upData[d];
            }
            let Up;
            try {
                Up = yield this._userCtrl.updateUser(upData);
            }
            catch (e) {
                console.log('catching error: ', e);
                res.status(400).json(e);
            }
            res.json(Up.json());
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = req.params.id;
            const email = req.body.email;
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const password = req.body.password;
            const role = req.body.role;
            let upData = { _id, email, firstName, lastName, password, role };
            for (let d in upData) {
                if (upData[d] === undefined || upData[d] === '')
                    delete upData[d];
            }
            let Up;
            try {
                Up = yield this._userCtrl.updateUser(upData);
            }
            catch (e) {
                console.log('catching error: ', e);
                res.status(400).json(e);
            }
            res.json(Up.json());
        });
    }
    getUser(req, res, next) {
        let id = req.params.id;
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                var u1 = yield this._userCtrl.getUser(id);
                if (!u1._id) {
                    res.status(204).json();
                    return;
                }
                res.json(u1.json());
            }
            catch (e) {
                console.error(e.message);
                res.status(400).json({ message: e.message });
            }
        }))();
    }
    setUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const role = req.body.role;
            const password = req.body.password;
            let user = { email, firstName, lastName, role, password };
            let old;
            try {
                old = yield this._userCtrl.getUserByEmail(email);
            }
            catch (e) {
                console.error(e.message);
                res.status(400).json({ message: e.message });
            }
            if (old._id) {
                res.status(409).json({ message: 'the email already exist' });
                return;
            }
            try {
                res.status(201).json(yield this._userCtrl.setUser(user));
            }
            catch (e) {
                console.error(e.message);
                res.status(400).json({ message: e.message });
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            const id = req.params.id;
            let d;
            try {
                d = yield self._userCtrl.deleteUser(id);
            }
            catch (e) {
                res.status(400).json({ message: e.message });
                return;
            }
            if (d._id) {
                res.json(d.json());
                return;
            }
            res.status(400).json(d);
        });
    }
}
exports.UserRoute = UserRoute;
