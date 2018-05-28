import { json as Json, urlencoded as Urlencoded } from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as errorHandler from "errorhandler";
import * as methodOverride from "method-override";
import { UserRoute } from './routes';
import * as CORS from 'cors';
import * as Passport from 'passport';
import { AuthService, PassportConf } from './routes/auth';
import * as graphqlHTTP from 'express-graphql';
import { schema } from './dataconnection/schema';

const conf = require('../config/enviroment');


/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.InjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //add routes
        this.routes();

    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {

        //use logger middlware
        this.app.use(logger("dev"));

        //use json form parser middlware
        this.app.use(Json());

        //use query string parser middlware
        this.app.use(Urlencoded({ extended: true }));

        //use override middlware
        this.app.use(methodOverride());

        // PassportJs Configuration
        this.app.use(Passport.initialize());

        // setting JWT strategy
        PassportConf.JWTconf(Passport);

        // setting Local strategy
        PassportConf.LocalConf(Passport);
        this.app.use(Passport.session());


        //catch 404 and forward to error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });

        //error handling
        this.app.use(errorHandler());

        //CORS
        this.app.use(CORS())

    }

    /**
     *
     * @class Server
     * @method routes
     */
    public routes() {
        this.app.use('/auth', AuthService.route);
        this.app.use('/users', AuthService.isAuthJWT('user'), UserRoute.route);
        /**
         * TODO: segmentar contenido desde graphql dependiendo del rol del usuario
         */
        this.app.use('/graphql', graphqlHTTP({
            schema,
            graphiql: true
        }));
        this.app.use('/', (req, res) => { res.send("Backend PMG ...") });

    }

}