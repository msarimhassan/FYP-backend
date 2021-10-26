const express=require('express')
const app =express();
require('dotenv').config()
const userRouter=require('./routes/user.js');



app.use(express.json());
app.use('/users',userRouter);
const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is Started on port ${port}`)
})