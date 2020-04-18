import express, { Application, json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
// import * as Routes from './routes';
import UserRoutes from "./routes/user";
import DrawRoutes from "./routes/draw";

class Server {
    public app:Application;

    constructor(){
        this.app = express();
        this.config();
        this.middleware();
        this.routes();
    } 

    config():void{
        this.app.set('port', process.env.PORT || 3000);
    }

    middleware():void{
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(json());
        this.app.use(urlencoded({extended:false}));
    }

    routes():void{
        this.app.use('/api/user/', UserRoutes);
        this.app.use('/api/draw/', DrawRoutes);
    }

    start():void{
        this.app.listen(this.app.get('port'), () => {
            console.log('App is listening on port' + this.app.get('port'));
          });
    }
}
const server = new Server();
server.start();