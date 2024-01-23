const express=require('express');

const { Add_Lead, getAllLead ,getLeadById, deleteAllLead,
      getLeadbyagentidandwithoutstatus,getAllLeadFollowup,getLeadbyagentidandwithstatus,
      BulkLeadUpdate, getAdvanceFillter,BulkDeleteLead,UpdateLeadByLeadId,leadattechmenthistory,deleteLeadAttechmentHistory} = require('../controllers/leadController');  


const router=express.Router();
router.route("/add_lead").post(Add_Lead);
router.route("/get_all_lead").get(getAllLead);  
router.route("/getAdvanceFillter").post(getAdvanceFillter); 

router.route("/get_lead_by_id/:id").get(getLeadById); 
router.route("/delete_all_lead").delete(deleteAllLead);
router.route("/get_Leadby_agentid_status").post(getLeadbyagentidandwithoutstatus);
//  with loss and won status
router.route("/get_Leadby_agentid_with_status").post(getLeadbyagentidandwithstatus);  
router.route("/get_All_Lead_Followup").get(getAllLeadFollowup); 
router.route("/BulkLeadUpdate").put(BulkLeadUpdate);
router.route("/BulkDeleteLead").delete(BulkDeleteLead);
router.route("/UpdateLeadByLeadId/:id").put(UpdateLeadByLeadId);
router.route("/leadattechmenthistory/:id").get(leadattechmenthistory); 
router.route("/deleteLeadAttechmentHistory/:id").delete(deleteLeadAttechmentHistory);
 
// router.route("/BulkLeadUplodeExcel",upload.single('file')).post(BulkLeadUplodeExcel); 
      
module.exports=router;            