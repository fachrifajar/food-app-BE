require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PWD,
  },
})

const mailOptions = {
  from: process.env.EMAIL,
  to: process.env.EMAIL2,
  subject: 'Sending Email using Nodejs',
  text: 'That was easy!',
}

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log('error')
  } else {
    console.log('Email sent: ' + info)
  }
})
