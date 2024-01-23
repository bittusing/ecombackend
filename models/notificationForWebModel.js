const mongoose=require('mongoose');

  const webnotificationSchema= new mongoose.Schema({
       
    user_id:{
        type:String,
        required:true
    },
    token:{
        type:String, 
        required:true 
    }

  });

  module.exports=mongoose.model("crm_web_notification",webnotificationSchema);