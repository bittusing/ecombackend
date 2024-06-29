const express=require('express');

const { createAgent,getAllAgent,getAgentDetails
    ,deleteAgent, loginAgent, updateClientAccess,
    EditAgentDetails,AddAgentAddress,getAgentAddress
    ,deleteAgentAddress ,forgotPassword,EditAgentAddress
,forgotPasswordOtp,sendData, resetPassword} = require('../controllers/agentController');

const router=express.Router();
//// send mail
router.route("/sendData").post(sendData);   
router.route("/add_agent").post(createAgent); 
router.route("/get_all_agent").get(getAllAgent);
router.route("/get_agent_details/:id").get(getAgentDetails);

router.route("/agent_delete/:id").delete(deleteAgent);
router.route("/agent_login").post(loginAgent);
router.route("/update_agent_access/:id").put(updateClientAccess);


router.route("/resetPassword").put(resetPassword);




router.route("/getAgentAddress/:id").get(getAgentAddress);  
router.route("/AddAgentAddress").post(AddAgentAddress); 
router.route("/EditAgentDetails/:id").put(EditAgentDetails);
router.route("/EditAgentAddress/:id").put(EditAgentAddress);
router.route("/deleteAgentAddress/:id").delete(deleteAgentAddress); 

router.route("/forgotPasswordOtp").post(forgotPasswordOtp); 
router.route("/forgotPassword").post(forgotPassword); 
module.exports=router;      