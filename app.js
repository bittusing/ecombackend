const express = require('express');
const cookieParser = require("cookie-parser");
const useragent = require('express-useragent');
const app = express();
var cors = require('cors');
const errorMiddleware=require("./middleware/error");



app.use(useragent.express());
app.use(express.json());
app.use(cookieParser());  
app.use(express.static('public'));

const agent =require('./routes/agentRoute');
const slider=require('./routes/sliderRoute');
const category=require('./routes/categoryRoute')
const product=require('./routes/productRoute');


app.use(cors());
app.use("/api/v1/",agent);
app.use("/",slider); 
app.use("/api/v1/",category);
app.use("/",product);



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