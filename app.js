const express = require('express');
const cookieParser = require("cookie-parser");
const useragent = require('express-useragent');
const app = express();
var cors = require('cors');
const errorMiddleware=require("./middleware/error");




app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cookieParser());  
app.use(express.static('public'));

const agent =require('./routes/agentRoute');
const slider=require('./routes/sliderRoute');
const category=require('./routes/categoryRoute')
const product=require('./routes/productRoute');
const cart=require('./routes/cartRoute');
const payment=require('./routes/paymentRoutes');
const countrystate=require('./routes/country_stateRoute');

app.use(cors());   
app.use("/api/v1/",agent);
app.use("/",slider); 
app.use("/api/v1/",category);
app.use("/",product);
app.use("/api/v1/",cart);  
app.use("/api/v1/",payment);
app.use("/api/v1/",countrystate);

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

app.get('/', function (req, res) { 
    
     try {  
        res.status(200).send(
          { 
          "success":true, 
           "massage":"Backend Get  Product"   
          }
        );   
          
        } catch (error) { 
          res.status(500).send(error);  
        }  
  }); 


// Middleware for Error
app.use(errorMiddleware);     
 
module.exports = app;  