import {Schema,model} from "mongoose"

const consumption = new Schema({
    waterConsumedDay : {type: Number, required:true  },

},
    {timestamps:true}
)

const consumptionSchema = model("consumptionSchema", consumption)

export default consumptionSchema