const express=require('express')
const app =express();
var cors = require('cors')

require('dotenv').config()
const userRouter=require('./routes/user.js');
const companyRouter=require("./routes/company");



app.use(express.json());
app.use(cors())


// user router entry point

app.use('/users',userRouter);

//company router entry point
app.use('/company',companyRouter);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is Started on port ${port}`)
})