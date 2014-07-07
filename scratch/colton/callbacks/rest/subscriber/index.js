var nodemailer = require("nodemailer");

// Testing async function return

var registerSub = function(method, params, data, cb){
  
    var smtpTransport = nodemailer.createTransport("SMTP", {
           service: "Gmail",
           auth: {
               user: "flowgrammablemailer@gmail.com",
               pass: "" // insert password here
           }
    });

    var mailOptions = { from: "flog mailer", to: "coltonchojnacki@gmail.com", subject: "this is an async test", text: "just to have text"}

    smtpTransport.sendMail(mailOptions, function(err, response){
        if(err){
           smtpTransport.close();
           cb(err.name);
        } else {
            console.log("Message sent: " + response.message);
            cb(response.message);
        }
        smtpTransport.close();
    });

}

module.exports = function(){

    return {
      module: {
        noauth: {
          register : registerSub
        }
      }
    }
}

