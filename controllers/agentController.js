const Agent = require("../models/agentModel");
const AgentAddress = require("../models/agentAddressModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const LoginHistory = require("../models/LoginHistory");
const bcrypt = require('bcryptjs');
const useragent = require('express-useragent');
const { messaging } = require("firebase-admin");
const nodemailer = require('nodemailer');
const { generateMessage1 } = require('./messageGenerator'); 
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//       user: 'myles9@ethereal.email',
//       pass: 'ekGav56KwBgt1Re8cD'
//   }
// });

// Set up the nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact@decasys.in', 
    pass: 'vsks gpzi uhjc ilnx'    // Your Gmail password or app password if 2FA is enabled
  }
});

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
  const user_id = req.params.id;

  const agentAddress = await AgentAddress.find({ user_id });
  res.status(201).json({
    success: true,
    agentAddress,

  });
})





function generateOtp() {
  return Math.floor(Math.random() * 900000) + 100000;
}

// Function to generate the HTML message containing the OTP
function generateMessage(otp) {
  return `<span>Your OTP is ${otp}. Do not share it with anyone.</span>`;
}
////////  forgotpassword for otp
exports.forgotPasswordOtp = catchAsyncErrors(async (req, res, next) => {
  const { agent_email } = req.body;
  
  const agent = await Agent.findOne({ agent_email });
    
  if (agent) {
    const otp = generateOtp();
    const message1 = generateMessage(otp);

    const mailOptions = {
      from: 'contact@decasys.in',
      to: agent_email,
      subject: 'Your Password Reset OTP',
      html: message1
    };
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error occurred while sending email:', error);
        return res.status(401).json({
          success: false,
          message: "There was a problem sending the email",
        });
      } else {
        // console.log('Email sent:', info.response);
        return res.status(200).json({
          success: true,
          message: "OTP sent to your email address",
          otp
        });
      }
    });
  } else {
    return next(new ErrorHander("Please enter a registered email address", 404));
  }
});


//////// send data on email 
exports.sendData=catchAsyncErrors(async (req,res,next)=>{
  const { firstname,lastname,email,phone,message } = req.body;
  const message1 = generateMessage1(firstname,lastname,email,phone,message);
  const mailOptions = {
    from: email,
    to: 'contact@decasys.in',
    subject: 'Enquery',
    html: message1
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred while sending email:', error);
      return res.status(200).json({
        success: false,
        message: "There was a problem sending the email",
      });
    } else {
      // console.log('Email sent:', info.response);
      return res.status(200).json({
        success: true,
        message: "Enquery Submit Successfully",
      });
    }
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
  const { agent_email, newpassword, confirmdpassword } = req.body;
  const agent = await Agent.find({ agent_email });
  if (agent.length === 0) {
    return next(new ErrorHander("Email Id is not Registered", 400));
  }
  if (newpassword !== confirmdpassword) {
    return next(new ErrorHander("New password and confirmed password are not the same", 400));
  }
  const hashedPassword = await bcrypt.hash(newpassword, 10);
  const updateAgent = await Agent.updateOne(
    { agent_email },
    { agent_password: hashedPassword },
    { new: true, runValidators: true, useFindAndModify: false }
  );
      
  res.status(200).json({
    success: true,
    message:"Password Update Successfully",
    updateAgent,
  });

});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { agent_email, oldpass, newpass } = req.body;
 
  if (!agent_email || !oldpass || !newpass) {
    return next(new ErrorHander("Please provide all required fields: agent_email, oldpass, newpass", 400));
  }
  const agent = await Agent.findOne({ agent_email }).select("agent_password");
  if (!agent) {
    return next(new ErrorHander("Email Id is not Registered", 400));
  }
  
  const isPasswordMatched = await bcrypt.compare(oldpass, agent.agent_password);
  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }
  const hashedPassword = await bcrypt.hash(newpass, 10);

  const updateAgent = await Agent.updateOne(
    { agent_email },
    { agent_password: hashedPassword },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  

  res.status(200).json({
    success: true,
    message: "Password updated successfully"
  });
});




