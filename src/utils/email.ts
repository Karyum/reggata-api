import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      layoutsDir: path.resolve(__dirname, '../views/layouts'),
      partialsDir: path.resolve(__dirname, '../views/partials'),
      defaultLayout: 'main.hbs'
    },
    viewPath: path.resolve(__dirname, '../views'),
    extName: '.hbs'
  })
)

export default transporter
