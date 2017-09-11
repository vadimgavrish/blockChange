var request = require('request');
const settings = require('./settings')
var nodemailer = require('nodemailer');

const knex = require('knex') ({
  client : 'pg',
  connection : {
    user : settings.user,
    password : settings.password,
    database : settings.database,
    host: settings.hostname,
    port: settings.port,
    ssl: settings.ssl
  }
});

function setFinalPrice(){
  request('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=BTC,CAD,USD,EUR&extraParams=your_app_name', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('making an api call every 10 seconds')
      var json = JSON.parse(body);
      let canadianCurrency = json['CAD']
      console.log(canadianCurrency)

      knex('priceChangeTable')
      .update({final_value: canadianCurrency})
      .where(function(){
        this.where('id', 1)
      })
      .catch(function(err) {
        console.error(err);
      })
    }
  })
}
setFinalPrice()


function queryPrice(){
  knex('priceChangeTable')
  .where(function(){
    this.where('id', 1)
  })
  .then(function(res) {

    console.log(res[0])

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bhavdip.dev@gmail.com',
        pass: '!3Hj.e.n'
      }
    });

    var mailOptions = {
      from: 'bhavdip.dev@gmail.com',
      to: `${res[0].user_email}`,
      subject: `${res[0].coin} Update!`,
      text: `The value of ${res[0].coin} has changed from ${res[0].current_value}
      to ${res[0].final_value} since you set your notification price`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email set: ' + info.response)
      }
    })
  })
  .catch(function(err){
    console.log(err);
  })
}
queryPrice()

//add in a set timeout function over here.
