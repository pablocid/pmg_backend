"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const express = require("express");
const logger = require("morgan");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const routes_1 = require("./routes");
const CORS = require("cors");
const Passport = require("passport");
const auth_1 = require("./routes/auth");
const graphqlHTTP = require("express-graphql");
const schema_1 = require("./dataconnection/schema");
const conf = require('../config/enviroment');
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        this.app.use(logger("dev"));
        this.app.use(body_parser_1.json());
        this.app.use(body_parser_1.urlencoded({ extended: true }));
        this.app.use(methodOverride());
        this.app.use(Passport.initialize());
        auth_1.PassportConf.JWTconf(Passport);
        auth_1.PassportConf.LocalConf(Passport);
        this.app.use(Passport.session());
        this.app.use((err, req, res, next) => {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        this.app.use(CORS());
    }
    routes() {
        this.app.use('/auth', auth_1.AuthService.route);
        this.app.use('/users', auth_1.AuthService.isAuthJWT('user'), routes_1.UserRoute.route);
        this.app.use('/graphql', graphqlHTTP({
            schema: schema_1.schema,
            graphiql: true
        }));
        this.app.use('/', (req, res) => { res.send("Backend PMG ..."); });
    }
}
exports.Server = Server;
