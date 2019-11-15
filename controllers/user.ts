import { Request, Response } from 'express';
import User from '../models/user';

function login(req: Request, res: Response): void {

    const email: string = req.body.email;
    const password: string = req.body.password;

    User.findOne({ "email": email, "password": password}).then((data) => {
        let status:number = 200;
        if(data == null) status = 404;
        console.log(data);
        res.status(status).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })

}

function register(req: Request, res: Response): void {

    const email: string = req.body.email;
    const name: string = req.body.name;
    const password: string = req.body.password;

    const user = new User({email, name, password});

    user.save().then((data) => {
        res.status(201).json(data);
    }).catch((err) => {
        res.status(500).json(err);
    })
}

export default {login, register}
