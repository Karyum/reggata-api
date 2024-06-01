import { Req, Res } from '@/types'
import catchAsync from '@/utils/catchAsync'
import generalService from './general.services'
import emailTransporter from '@/utils/email'

const testSocket = catchAsync(async (req: Req, res: Res) => {
  res.send({ a: 'test' })
})

const contact = catchAsync(async (req: Req, res: Res) => {
  const { name, subject, email, message, phone, prefix } = req.body

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'sobheya.dokhan.3@gmail.com',
    subject: 'Sunflower - Contact Us',
    template: 'contact',
    context: {
      name,
      subject,
      email,
      message,
      phone,
      prefix
    }
  }

  emailTransporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
      res.status(500).send({ message: 'Error' })
    } else {
      res.send({ success: true })
    }
  })
})

export default {
  testSocket,
  contact
}
