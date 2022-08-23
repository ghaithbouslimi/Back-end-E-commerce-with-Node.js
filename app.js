const express =require('express'); 
const app=express(); 
const morgan=require('morgan');
const mongoose =require('mongoose');
const cors =require('cors');
require('dotenv').config(); 
const authJwt =require('./helpers/jwt');


app.use(cors()); 
app.options('*',cors()); 


// midelware 
app.use(express.json()); 
app.use(morgan('tiny')); 
// we can use photos in frontend 
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// routers
const productsRouter =require('./routers/products');
const usersRouter=require('./routers/users');
const categorieRouter=require('./routers/categories');
const orderRouter=require('./routers/orders');


const api =process.env.API_Url; 

app.use(`${api}/products`,productsRouter);
app.use(`${api}/categories`,categorieRouter);
app.use(`${api}/users`,usersRouter);
app.use(`${api}/orders`,orderRouter);



 

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
  
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });     

  //server
app.listen(3000,()=> {
    
    
    console.log('server is runnig http://localhost:3000') ;
})

   
    
   