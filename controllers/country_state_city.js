  // const Country=require('country-state-city').Country;
  // const State=require('country-state-city').State;
  // const City=require('country-state-city').City;
   


  const catchAsyncErrors=require('../middleware/catchAsyncErrors');
  const ErrorHander = require("../utils/errorhander");

  const Country=require('../models/countryModel');
  const State=require('../models/stateModel');   

// var countries=Country.getAllCountries();
// var state=State.getAllStates();

// countries.forEach(conn=>{  
//   con.insertMany({ name:conn.name,short_name:conn.isoCode});     
// })

// state.forEach(state1=>{     
//   stat.insertMany({ name:state1.name,country_short_name:state1.countryCode});     
// })

  
    //// get All Country  

  exports.getAllCountry=catchAsyncErrors(async (req,res,next)=>{
    const country= await Country.find();
    //const count=country.length;
    res.status(200).json({
      success:true,  
      country,
    })
});

///  get All State 

exports.getAllState=catchAsyncErrors(async (req,res,next)=>{
  const state= await State.find();
  //const count=country.length;
  res.status(200).json({
    success:true,  
    state, 
  })
});


///  get  State by country

exports.getStateByCountry=catchAsyncErrors(async (req,res,next)=>{

  const { short_name } = req.body;
  const state= await State.find({country_short_name:short_name});

  if(!state){
    return next(new ErrorHander("On This Country State Is Not Avilavle", 400));
  }
  //const count=state.length;
  res.status(200).json({
    success:true,  
    state, 
  })
});


 
      
