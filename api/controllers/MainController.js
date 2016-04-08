module.exports = {

	index: function (req, res, next) {
		res.view();
	},

	admin: function(req, res, next) {
		User.find()
		.exec(function(err, users) {
			res.view({
				users: users
			});
		});	
	},

	'delete-all-leads': function(req, res, next) {
		Leads.destroy()
		.exec(function(err, destroyed) {
			if (err) return(err);
		})
	},

	email: function (req, res) {
		var emailAddress = req.param('email');
		var message = req.param('message');

		var nodemailer = require("nodemailer");
      var smtpTransport = nodemailer.createTransport("SMTP",{
          service: "Gmail",
          auth: {
              user: process.env.myEmail,
              pass: process.env.nodemailerPassword
          }
      });

      var mailOptions = {
          from: emailAddress, // sender address
          to: '#', // list of receivers
          subject: "TellMe More Info #info-request", // Subject line
          text: message, // plaintext body
          html: "<p>" + message + "</p>"
      }

      // send mail with defined transport object
      smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              console.log('Success');
          }

          // if you don't want to use this transport object anymore, uncomment following line
          //smtpTransport.close(); // shut down the connection pool, no more messages
      });
	}
  
};
