"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conf = require('../../../config/enviroment');
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const jsonwebtoken_1 = require("jsonwebtoken");
const users_1 = require("../users");
const bcrypt_1 = require("bcrypt");
class PassportConf {
    static JWTconf(P) {
        let pass = new PassportConf();
        P.use(pass.jwtConfiguration());
    }
    static SignJWT(payload) {
        let signOpts = {};
        signOpts.expiresIn = '12h';
        return jsonwebtoken_1.sign(payload, conf.secrets.app, signOpts);
    }
    static LocalConf(P) {
        let pass = new PassportConf();
        P.use(pass.localConfiguration());
        P.serializeUser(pass.serializeUser());
        P.deserializeUser(pass.deserializeUser());
    }
    constructor() {
        this.userCtrl = new users_1.UserController();
    }
    jwtConfiguration() {
        let jwtOpts = { jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('Bearer'), secretOrKey: conf.secrets.app };
        let jwtConf = new passport_jwt_1.Strategy(jwtOpts, (jwt_payload, next) => {
            if (jwt_payload)
                next(null, jwt_payload);
            else
                next(null, false);
        });
        return jwtConf;
    }
    localConfiguration() {
        let local = new passport_local_1.Strategy({
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            this.userCtrl.getUserByEmail(username)
                .then(u => {
                if (this.isValidPassword(password, u.password))
                    done(null, u.json());
                else
                    done(null, false);
            })
                .catch(e => done(e));
        });
        return local;
    }
    serializeUser() {
        return (user, done) => {
            done(null, user._id);
        };
    }
    deserializeUser() {
        return (id, done) => {
            this.userCtrl.getUser(id)
                .then(u => done(null, u.json()))
                .catch(e => done(e));
        };
    }
    isValidPassword(candidate, password) {
        return bcrypt_1.compareSync(candidate, password);
    }
}
exports.PassportConf = PassportConf;
