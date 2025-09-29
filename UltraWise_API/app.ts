import { Router } from "express";
import { Express } from "express";
import express from "express"
import Controller from "./src/interface/controller.interface";
import mongoose from "mongoose";
import 'dotenv/config'
import { mqttServer } from "./lib/mqttJob";
const route = Router()
const mongoose_URL = process.env.MONGO_STRING as string
if(!mongoose_URL){console.log("mongo string not found")}
export class App {
    public app : Express
    private controllers : Controller[]
    constructor(controllers : Controller[]){
        this.controllers = controllers
        this.app = express()
        this.connectDB()
        this.initializeMiddlewares
        this.initializeRoutes
    }

    private initializeRoutes(){
        this.controllers.map((controller) => {
            this.app.use(`/api/${controller.path}`,controller.route)
        })
    }

    private initializeMiddlewares(){
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended:true}))
    }

    private async connectDB(){
        let isConnected = false
        if(isConnected) return
        try {
            await mongoose.connect(mongoose_URL)
            isConnected = true
            mqttServer()
            console.log("mongoose connected successfully")
        } catch (error) {
            console.error("MongoDB connection error:", error);
        }
    }

    public listen(port : Number){
        this.app.listen(port, () => {
            console.log(`app running on port ${port}`)
        })
    }
}