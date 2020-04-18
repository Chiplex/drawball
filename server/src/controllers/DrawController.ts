import { Request, Response, NextFunction } from "express";
import { Draw } from "../models/Draw";
import { User } from "../models/User";

class DrawController {
    public async index(req:Request, res:Response, next:NextFunction) {
        try {
            res.json(await Draw.findAll({include:[User]}));    
        } catch (e) {
            next(e);
        }
    }

    public async show(req:Request, res:Response, next:NextFunction) {
        try {
            res.json(await Draw.findByPk(req.params.id,{include:[User]}));
        } catch (e) {
            next(e);
        }
    }

    public async create(req:Request, res:Response, next:NextFunction):Promise<void> {
        try {
            const draw = await Draw.create(req.body);
            res.status(201).json(draw);
        } catch (e) {
            next(e)
        }
    }

    public async update(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            await Draw.update(req.body, {where:{id:req.params.id}});
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

    public async delete(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            await Draw.destroy({where:{id:req.params.id}});
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }
}

const draw = new DrawController();
export default draw;