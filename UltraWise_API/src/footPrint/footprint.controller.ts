import Controller from "../interface/controller.interface";
import { Router } from "express";
import { Request, Response } from "express";
export class footPrintController implements Controller{
    public path :string
    public route = Router()
    constructor(){
        this.path = "footprint"
        this.assignRoutes
    }

    private assignRoutes(){
        this.route.post("/storeReadings", this.uploadData)
    }

    public uploadData(req:Request,res:Response){
        const {height,time} = req.body
    }

    // private get
}