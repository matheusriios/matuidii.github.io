const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

const app = express();  

//View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//BodyParser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.render('index');
});

app.post('/send', (req, res) => {
   const output = `
        <h2 style="text-align:center;">Contato</h2>
        <h3>Detalhes do contato<h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Sujeito: ${req.body.subject}</li>            
        </ul>         
        <h2 style="text-align:center;">Mensagem</h2>
        <p style="color: red";>${req.body.message}</p>
   `;   

   let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'matheusriosdeveloper@gmail.com', // generated ethereal user
        pass: 'familia2010' // generated ethereal password
    },
    tls:{
        rejectUnauthorized: false
    }
});

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Mr Web Developer Contato" <contato@gmail.com>', // sender address
        to: 'contato@gmail.com', // list of receivers
        subject: 'Contato Matheus', // Subject line
        text: 'Lorem ipsum', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('index', {msg: ''});
    });
});


app.listen(3009, () => console.log('Servidor rodando...'));
