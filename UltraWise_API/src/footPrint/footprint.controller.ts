import Controller from "../interface/controller.interface";
import { Router } from "express";
import { Request, Response } from "express";
import ultraSonic from "../schema/footprint.schema";
import HttpError from "../interface/httpError.interface";
import tankSchema_ from "../schema/tankDimension.schema";
export class footPrintController implements Controller{
    public path :string
    public route = Router()
    constructor(){
        this.path = "footprint"
        this.assignRoutes
    }

    private assignRoutes(){
        this.route.get("/getReadings", this.getReading)
        this.route.post("/uploadTankDimensions", this.storeTankDimensions)
    }

    public async getReading(req:Request,res:Response){
        try {
            const ultraData = await ultraSonic.find()
            if(ultraData.length == 0 || ultraData == null){
                throw new HttpError("no data yet", 404)
            }
            res.status(200).json(
                {
                    success: true,
                    message:"data fetched successfully",
                    data:ultraData
                }
            )
        } catch (error) {
            if(error instanceof HttpError){
                res.status(error.statusCode as number || 500).json({
                    success: false,
                    error: error.message || "an error occured"
                })
            }
        }
    }

    public async storeTankDimensions(req:Request,res:Response){
            const {tankVolume,tankHeight} = req.body
            
            try {
            if(!tankVolume){throw new HttpError("empty field",401)}
            if(!tankHeight){throw new HttpError("empty field",401)}
            let tankRadius = Math.sqrt(tankVolume / (tankHeight * Math.PI))
            const response = await tankSchema_.insertOne({tankHeight,tankVolume,tankRadius})
            res.status(200).json({
                success:false,
                message:"tank dimension is successfully stored",
            })
            } catch (error) {
                if(error instanceof HttpError){
                    res.status(error.statusCode as number|| 500).json({
                        success:false,
                        message:error.message || "internal server error"
                    })
                }
            }

    }
}