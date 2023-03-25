const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay')
const nodemailer = require('nodemailer')
const port = 3000

const sendEmail = async (name, email, message) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'r.m.kavinbharathi@gmail.com',
            pass: 'txbdqstcptqymkdm',
        },
    });

    const mailOptions = {
        from: 'r.m.kavinbharathi@gmail.com',
        to: 'barathkumar.b2411@gmail.com',
        subject: `You received an email from ${name} from IT Arena`,
        text: `Name     : ${name}
               Email    : ${email}
               Message  : ${message}`
    }

    let send = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Text sent successfully.');
        }
    })

    console.log("All operations successful")
    return mailOptions.text
}

const app = express();
app.use(express.json())
app.use(cors())

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/data', (req, res) => {
    const fullName = req.body.fullName;
    const emailAddress = req.body.emailAddress;
    const msg = req.body.msg;

    console.log(fullName);
    console.log(emailAddress);
    console.log(msg);
    sendEmail(fullName, emailAddress, msg)
    res.send('Data received');
});

app.post('/payment', async (req, res) => {

    console.log("Ulla varuthu")
    let { amount } = req.body

    let instance = new Razorpay({ key_id: 'rzp_test_HBni4PPnBF3Swj', key_secret: 'CTuKUGEBUL3FtJBauO4TLTrJ' })

    let order = await instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    }).then(() => {
        console.log("Working")
    }).catch((err) => {
        console.log(err)
    })

    res.status(201).json({
        success: true,
        order,
        amount
    })
});

app.listen(3000, () => {
    console.log(`Server started on port ${port}`);
});
