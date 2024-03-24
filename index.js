const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require("cloudinary");

// Handling uncaught error
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to handling uncaught error');
  process.exit(1); // Fix the typo here
});
const PORT = process.env.PORT || 4001;
connectDatabase();

 
 
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`); 
}); 

// Unhandled promise rejection 
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to unhandled promise rejection');
  process.exit(1); // Fix the typo here
});   
