import express from "express"
import cors from "cors"
import nodemailer from "nodemailer"
import mongoose from "mongoose"

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://mailinadham_db_user:WzjWLGFxHH3LpnZz@cluster0.x7op6na.mongodb.net/passkey?appName=Cluster0").then(function () {
  console.log("Connected to Db")
}).catch(function () {
  console.log("Failed to connect DB")
})


const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
})

const credential = mongoose.model("credential", credentialSchema, "bulkmail")

app.post("/sendmail", function (req, res) {
  let msg = req.body.msg
  let emailList = req.body.emailList

  credential.find().then(function (data) {
    console.log("CREDENTIALS FOUND:", data.length)

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    return new Promise(async function (resolve, reject) {
      try {
        for (let i = 0; i < emailList.length; i++) {
          await transporter.sendMail({
            from: data[0].toJSON().user,
            to: emailList[i],
            subject: "A message from Bulk Mail App",
            text: msg
          })
          console.log("Email sent to: " + emailList[i])
        }
        resolve("Success")
      } catch (error) {
        console.log("MAIL ERROR:", error.message)
        reject(error)
      }
    });

  }).then(function () {
    res.send(true)
  }).catch(function (error) {
    console.log("CAUGHT ERROR:", error.message)
    res.send(false)
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, function () {
  console.log("Server Started on port " + PORT)
})