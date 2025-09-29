import mongoose,{Schema,model,models} from "mongoose";

const ultraSonicSchema = new Schema(
    {
        height:{type: Number, required: true},
        Timestamp:{type:Date,required:true}
    },
    {timestamps:true}
)

const ultraSonic= model("ultraSonic",ultraSonicSchema)
export default ultraSonic