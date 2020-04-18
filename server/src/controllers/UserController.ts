import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Draw } from "../models/Draw";

class UserController {
    public async index(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            res.json(await User.findAll({include:[Draw]}));
        } catch (e) {
            next(e);
        }
    }
    public async show(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            res.json(await User.findByPk(req.params.id,{include:[Draw]}));
        } catch (e) {
            next(e);
        }
    }
    public async create(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }
    public async update(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            await User.update(req.body,{where:{id: req.params.id}});
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }
    public async delete(req:Request, res:Response, next:NextFunction): Promise<void> {
        try {
            await User.destroy({where: {id: req.params.id}});
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }
}
const user = new UserController();
export default user;