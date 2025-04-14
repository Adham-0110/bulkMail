import express from "express"
import cors from "cors"
import nodemailer from "nodemailer"
import mongoose from "mongoose"

const app = express()

app.use(express.json())
app.use(cors())


mongoose.connect("mongodb+srv://mailinadham:88GMbFP19KHYiXgO@cluster0.cipq4mk.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("Connected to Db")
}).catch(function(){
    console.log("Failed to connect DB")
})

const credential = mongoose.model("credential",{},"bulkmail")


app.post("/sendmail",function(req,res){
    let msg = req.body.msg
    let emailList = req.body.emailList
  
    credential.find().then(function(data){
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
              user: data[0].toJSON().user,
              pass: data[0].toJSON().pass,
            },
          });
    
          new Promise(async function(resolve,reject){
            try{ 
                for(let i=0;i<emailList.length;i++){
                   await transporter.sendMail({
                        from:"mailinadham@gmail.com",
                        to:emailList[i],
                        subject:"A message from Bulk Mail App",
                        text:msg
                    })
                    console.log("Email sent to:"+emailList[i])
                  }
                resolve("Success")
              }
              catch(error){
                reject("Failed")
              }
          }).then(function(){
            res.send(true)
          }).catch(function(){
            res.send(false)
          })
         
     }).catch(function(error){
        console.log(error)
     })


  
 

})




app.listen(5000,function(){
    console.log("Server Started...")
})