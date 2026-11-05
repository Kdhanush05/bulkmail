
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://myuser:g6RsMxQGaTiT_ML@cluster0.ls4okck.mongodb.net/bulkmail?retryWrites=true&w=majority", {}  )
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


app.post("/sendemail", (req, res) => {
 
    const emailContent = req.body.emailContent;
    const emailList = req.body.emailList;

    console.log("Received email content:", emailContent);

    const Credential = mongoose.models.Credential || mongoose.model("Credential", new mongoose.Schema({
        user: String,
        pass: String,   
  
    }, "emails"));

    Credential.find()
        .then((data) => {

            // Create transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: data[0].toJSON().user,
                    pass: data[0].toJSON().pass,
                },
            });

            // Send emails
            return new Promise(async (resolve, reject) => {

                try {

                    for (var a = 0; a < emailList.length; a++) {

                        await transporter.sendMail({
                            from: "dhanushk16659@gmail.com",
                            to: emailList[a],
                            subject: "Test Email",
                            text: emailContent
                        });

                    }

                    resolve("success");

                }
                catch (error) {

                    reject(error);

                }

            });

        })

        .then(() => {
            res.send(true);
        })

        .catch((err) => {
            console.log(err);
            res.status(500).send(false);
        });

});


app.listen(5000, () => {
    console.log("server is running on port 5000");
});
