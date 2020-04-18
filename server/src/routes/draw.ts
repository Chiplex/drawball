import { Router } from "express";
import DrawController from "../controllers/DrawController";

class Draw{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', DrawController.index);
        this.router.get('/:id', DrawController.show);
        this.router.post('/', DrawController.create);
        this.router.put('/:id', DrawController.update);
        this.router.delete('/:id', DrawController.delete);
    }
}

const draw = new Draw();
export default draw.router;