
import {Schema,model} from "mongoose";

const tankSchema = new Schema(
    {
        tankVolume:{type: Number,require:true},
        tankHeight:{type:Number, required:true},
        tankRadius:{type:Number, required:true}
    },
    {timestamps:true}
)

const tankSchema_ = model("tankSchema",tankSchema)

export default tankSchema_