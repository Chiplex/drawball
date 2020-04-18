import { Router } from "express";
import UserController from "../controllers/UserController";

class User{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', UserController.index);
        this.router.get('/:id', UserController.show);
        this.router.post('/', UserController.create);
        this.router.put('/:id', UserController.update);
        this.router.delete('/:id', UserController.delete);
    }
}

const user = new User();
export default user.router;