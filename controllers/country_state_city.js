const Country=require('country-state-city').Country;
const State=require('country-state-city').State;
// const City=require('country-state-city').City;
 


const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const ErrorHander = require("../utils/errorhander");

const Country1=require('../models/countryModel');
const State1=require('../models/stateModel');   



exports.getAllCountry=catchAsyncErrors(async (req,res,next)=>{
  var country=Country.getAllCountries();
  res.status(200).json({
    success:true,  
    country,
  })
});


///  get All State 

exports.getAllState=catchAsyncErrors(async (req,res,next)=>{

});


///  get  State by country

exports.getStateByCountry=catchAsyncErrors(async (req,res,next)=>{
const { short_name } = req.body;
const { State } = require('country-state-city');

// Fetch all states
const allStates = await State.getAllStates();

// Filter states by the provided country code
const state = allStates.filter(state => state.countryCode === short_name);

if (!state || state.length === 0) { 
  return next(new ErrorHander("No states available for this country code", 400));
}

res.status(200).json({
  success: true,
  state,
});
});



    
