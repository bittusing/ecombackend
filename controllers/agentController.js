const Agent = require("../models/agentModel");
const AgentAddress = require("../models/agentAddressModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const LoginHistory = require("../models/LoginHistory");
const bcrypt = require('bcryptjs');
const useragent = require('express-useragent');

exports.createAgent = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.create(req.body);
  res.status(201).json({
    success: true,
    agent,
    message: "Agent Added Successfully...."
  });
});

///// Addresss Add    
exports.AddAgentAddress = catchAsyncErrors(async (req, res, next) => {
  const agentAddress = await AgentAddress.create(req.body);
  res.status(201).json({
    success: true,
    agentAddress,
    message: "Address Added Successfully...."
  });
})

///// get  address detail
exports.getAgentAddress = catchAsyncErrors(async (req, res, next) => {
  const user_id =req.params.id;
  
  const agentAddress = await AgentAddress.find({user_id});
  res.status(201).json({
    success: true,
    agentAddress,
   
  });
})




/////// Delete Address

exports.deleteAgentAddress = catchAsyncErrors(async (req, res, next) => {
  const agent = await AgentAddress.findById(req.params.id);
  if (!agent) {
    return next(new ErrorHander("Agent Not Found", 404));
  }
  await agent.deleteOne();
  res.status(200).json({
    success: true,
    message: "Address Delete Successfully",
    agent,
  });
});

//////////  EditAgentAddress
exports.EditAgentAddress = catchAsyncErrors(async (req, res, next) => {
  const agentAddress = await AgentAddress.findById(req.params.id);
  if (!agentAddress) {
    return next(new ErrorHander("Agent Address is not", 400));
  } 
  const updateagent = await AgentAddress.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
  res.status(200).json({
    success: true,
    updateagent,
    message: "Address Update Successfully...."
  });
});

// Delete Agent --admin

exports.deleteAgent = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(new ErrorHander("Agent Not Found", 404));
  }
  await agent.deleteOne();

  res.status(200).json({
    success: true,
    message: "Agent Delete Successfully",
    agent,
  });
});

// get all agent --admin

exports.getAllAgent = catchAsyncErrors(async (req, res, next) => {

  // const agent = await Agent.find({role:"user"});
  const agent = await Agent.find();


  res.status(201).json({
    success: true,
    agent,

  });
});


// get Agent  details

exports.getAgentDetails = catchAsyncErrors(async (req, res, next) => {

  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    return next(new ErrorHander("Agent Not Found", 404));
  }

  res.status(201).json({
    success: true,
    agent,
  });
});

// login Agent

exports.loginAgent = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHander("Plz Enter Email And Password", 400));
  }
  const agent = await Agent.findOne({ agent_email: email }).select(
    "+agent_password"
  );
  if (!agent) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }
  const isPasswordMatched = await agent.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }
  const userAgent = req.useragent;


  const token = agent.getJWTToken();

  sendToken(agent, 200, res);


});
/// update Client Access
exports.updateClientAccess = catchAsyncErrors(async (req, res, next) => {
  ///const  {client_access}=req.body;
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }


  const agent_access = await agent.client_access;

  if (agent_access === 'yes') {
    const agent = await Agent.updateOne({ _id: req.params.id }, { $set: { client_access: "no" } });
  }
  if (agent_access === 'no') {
    const agent = await Agent.updateOne({ _id: req.params.id }, { $set: { client_access: "yes" } });

  }
  res.status(201).json({
    success: true,
    agent,

  });
});


exports.EditAgentDetails = catchAsyncErrors(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id).select(
    "+agent_password"
  );
  if (!agent) {
    return next(new ErrorHander("Invalid email Or password", 400));
  }
  if (!req.body.agent_password) {
    const updateagent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })

    res.status(200).json({
      success: true,
      updateagent,
    });
  } else {

    const isPasswordMatched = await agent.comparePassword(req.body.agent_password);
    if (!isPasswordMatched) {

      const convertohashpass = await bcrypt.hash(req.body.agent_password, 10);
      const { agent_password, ...newAaa } = await req.body;
      const updatekrnewaladata = await { ...newAaa, agent_password: convertohashpass };
      const updateagent = await Agent.findByIdAndUpdate(req.params.id, updatekrnewaladata, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      })

      res.status(200).json({
        success: true,
        updateagent,
      });
    } else {
      const updateagent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      })

      res.status(200).json({
        success: true,
        updateagent,
      });
    }

  }




})



exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //    const {email,new_password}=req.body;

});




