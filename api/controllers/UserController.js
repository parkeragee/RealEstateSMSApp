module.exports = {
    
  basic: function (req, res) {
  	res.view();
  },

  plus: function (req, res) {
    res.view();
  },

// CREATE NEW USERS
  create: function (req, res, next) {
      var customerEmail = req.param('email');
      var stripeToken = req.param('stripeToken');
      var encryptedPassword = req.param('encryptedPassword');
      var monthlyPlan = req.param('monthlyPlan');
      var areaCode = req.param('areaCode');
      var couponCode = req.param('couponCode');
      console.log('Coupon code: ' + couponCode);
      var stripe = require("stripe")(process.env.stripeKey);

      // CREATE CUSTOMER IN STRIPE DATABASE FOR BILLING
      console.log('Stripe token: ' + stripeToken);
      stripe.customers.create({
          email: customerEmail,
          card: stripeToken // obtained with Stripe.js
      }, function(err, customer) {
          if (err) {
              var stripeCustomerCreationError = ['There was a problem proccessing your payment information. Please try again.'];
              req.session.flash = {
                  err: stripeCustomerCreationError
              }
              return res.redirect('back');
          } else {
              var customerID = customer.id;
              if(req.param('couponCode').length == 0) {
                stripe.customers.createSubscription(customerID, {plan: monthlyPlan}, function (err, subscription) {
                    if (err && err.param != 'coupon') {
                        console.log(err);
                        var stripeSubscriptionCreationError = ['There was a problem proccessing your subscription. Please try again.'];
                        req.session.flash = {
                            err: stripeSubscriptionCreationError
                        }
                        return res.redirect('back');
                    } else if (err && err.param == 'coupon') {
                        console.log(err);
                        var noCoupon = ['That is an invalid coupon code'];
                        req.session.flash = {
                            err: noCoupon
                        }
                        return res.redirect('back');
                    } else {
                        // PRODUCTION CREDENTIALS
                        var accountSid = process.env.accountSid;
                        var authToken = process.env.authToken;
                        var client = require('twilio')(accountSid, authToken);

                        client.availablePhoneNumbers("US").local.list({ areaCode: areaCode, MmsEnabled: "true", SmsEnabled: "true" }, function(err, numbers) {
                            var this_number = numbers.available_phone_numbers[0];
                            client.incomingPhoneNumbers.create({
                                SmsUrl: 'http://tellme-app.herokuapp.com/message/receive',
                                phoneNumber: this_number.phone_number
                            }, function(err, purchasedNumber) {
                                if (err) {
                                    var twilioError = ['There was a problem proccessing your phone number. Please try again.'];
                                    req.session.flash = {
                                        err: twilioError
                                    }
                                    return res.redirect('back');
                                } else {
                                    console.log(purchasedNumber);
                                    var numberSID =  purchasedNumber.sid;
                                    console.log('Number SID from successful purchase: ' + numberSID);
                                    var readableNumber =  purchasedNumber.friendlyName;
                                    var number =  purchasedNumber.phoneNumber;    
                                    // IF SUCCESS THROUGH STRIPE, CREATE THE USER IN OUR DATABASE

                                    User.create({
                                        email: customerEmail,
                                        billingInfo: true,
                                        encryptedPassword: encryptedPassword,
                                        stripeID: customerID,
                                        monthlyPlan: monthlyPlan,
                                        areaCode: areaCode,
                                        readableNumber: readableNumber,
                                        phoneNumber: number,
                                        numberSID: numberSID
                                    }).exec(function userCreated (err, user) {
                                        if (err) {
                                            var createFail = ['Please make sure you have entered all fields properly'];
                                            req.session.flash = {
                                                err: createFail
                                            }
                                            return res.redirect('back');
                                        } else {
                                            req.session.authenticated = true;
                                            req.session.User = user;
                                            res.redirect('/property');
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
              } else {
                stripe.customers.createSubscription(customerID, {plan: monthlyPlan, coupon: couponCode}, function (err, subscription) {
                    if (err && err.param != 'coupon') {
                        console.log(err);
                        var stripeSubscriptionCreationError = ['There was a problem proccessing your subscription. Please try again.'];
                        req.session.flash = {
                            err: stripeSubscriptionCreationError
                        }
                        return res.redirect('back');
                    } else if (err && err.param == 'coupon') {
                        console.log(err);
                        var noCoupon = ['That is an invalid coupon code'];
                        req.session.flash = {
                            err: noCoupon
                        }
                        return res.redirect('back');
                    } else {
                        // PRODUCTION CREDENTIALS
                        var accountSid = process.env.accountSid;
                        var authToken = process.env.authToken;
                        var client = require('twilio')(accountSid, authToken);

                        client.availablePhoneNumbers("US").local.list({ areaCode: areaCode, MmsEnabled: "true", SmsEnabled: "true" }, function(err, numbers) {
                            var this_number = numbers.available_phone_numbers[0];
                            client.incomingPhoneNumbers.create({
                                SmsUrl: 'https://www.tellme.co/message/receive',
                                phoneNumber: this_number.phone_number
                            }, function(err, purchasedNumber) {
                                if (err) {
                                    var twilioError = ['There was a problem proccessing your phone number. Please try again.'];
                                    req.session.flash = {
                                        err: twilioError
                                    }
                                    return res.redirect('back');
                                } else {
                                    console.log(purchasedNumber);
                                    var numberSID =  purchasedNumber.sid;
                                    console.log('Number SID from successful purchase: ' + numberSID);
                                    var readableNumber =  purchasedNumber.friendlyName;
                                    var number =  purchasedNumber.phoneNumber;    
                                    // IF SUCCESS THROUGH STRIPE, CREATE THE USER IN OUR DATABASE

                                    User.create({
                                        email: customerEmail,
                                        billingInfo: true,
                                        encryptedPassword: encryptedPassword,
                                        stripeID: customerID,
                                        monthlyPlan: monthlyPlan,
                                        areaCode: areaCode,
                                        readableNumber: readableNumber,
                                        phoneNumber: number,
                                        numberSID: numberSID
                                    }).exec(function userCreated (err, user) {
                                        if (err) {
                                            var createFail = ['Please make sure you have entered all fields properly'];
                                            req.session.flash = {
                                                err: createFail
                                            }
                                            return res.redirect('back');
                                        } else {
                                            req.session.authenticated = true;
                                            req.session.User = user;
                                            res.redirect('/property');
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
              }
          } 
      }); 
  }, 

// SHOW USERS PROFILE
  show: function (req, res, next) {
  	User.findOne(req.param('id'), function foundUser (err, user) {
  		if (err) return next(err);
  		// if (!user) return next();
  		res.view({
  			user: user
  		})
  	});
  },

// SHOW USERS PROFILE
  edit: function (req, res, next) {
  	User.findOne(req.param('id'), function foundUser (err, user) {
  		if (err) return next(err);
  		if (!user) return next('User doesn\'t exist.');
  		res.view({
  			user: user
  		})
  	});
  },

 // SHOW USERS PROFILE
  update: function (req, res, next) {
  	User.update(req.param('id'), req.params.all(), function userUpdated (err, user) {
  		if (err) {
  			return res.redirect('/user/edit/' + req.param('id'));
  		}
  		res.redirect('/user/show/' + req.param('id'));
  	});
  },

// DELETE USER
  delete: function (req, res, next) {

    // FIND USER

  	User.findOne(req.param('id'), function foundUser (err, user) {
  		if (err) return next(err);
  		if (!user) return next('User doesn\'t exist.');
      var stripeID = user.stripeID;
      var userID = user.id;
      var twilioSID = user.numberSID;

      /* 
        ***********
        WE NEED TO CHECK AND SEE IF THEY HAVE A REMAINING BALANCE... IF SO, BILL THEM
        ***********
      */

      // DESTROY FROM OUR DATABASE

      // PRODUCTION CREDENTIALS
      var accountSid = process.env.accountSid;
      var authToken = process.env.authToken;
      var client = require('twilio')(accountSid, authToken);

      client.incomingPhoneNumbers(twilioSID).delete(function(err, deleted) {
        if (err){
          console.log(err);
          console.log('Error at deleting Twilio number');
        } else {
          console.log('Deleted from Twilio: ' + deleted);
        }
      });

  		User.destroy(req.param('id'), function userDestroyed(err) {
  			if (err) {
          return next(err)
        } else {
          console.log('Deleted from our database');
          var stripe = require("stripe")(process.env.stripeKey);

          // DESTROY FROM STRIPE DATABASE

          stripe.customers.del(
            stripeID,
            function(err, confirmation) {
              if (err) return(err);
              if(confirmation) {
                console.log('Deleted from Stripe');
              }
            }
          );

          // DESTROY ALL PROPERTIES RELATED TO USER IN OUR DATABASE

          Property.destroy()
          .where({userID: userID})
          .exec(function(err, destroyed) {
            if (err) return(err);
            if(destroyed) {console.log('Deleted all users properties')}
            res.redirect('/main/admin');
          });
        }
  		});
  	});
  },

// USER LIST
	index: function (req, res, next) {
		// Get an array of all users in the User collection
		User.find(function foundUsers (err, users) {
			if (err) return next(err);
			// pass the array down to the /views/index.ejs page
			res.view({
				users: users
			});
		});
	},

  // CHARGE THE CUSTOMER

  charge: function (req, res, next) {
    // find all of the customers
    User.find(function foundUsers (err, users) {
      if (err) return next(err);
      // setup Stripe
      var stripe = require("stripe")(process.env.stripeKey);
      for (i = 0; i < users.length; i++) {
      (function(i){
        var amount = users[i].monthlyAmount * '.99';
        var roundedAmount = Math.round(amount*100);
        var baseAmount = users[i].monthlyPlan;
        var stripeID = users[i].stripeID;
        var accountID =  users[i].id;
        // if the amount charged is greater than 0, charge the customer the correct amount
        if(amount == '0') {
          if(baseAmount == 'basic') {
            var chargeThisPrice = roundedAmount+1900;
          }
          if(baseAmount == 'plus') {
            var chargeThisPrice = roundedAmount+2900;
          }
          stripe.charges.create({
            amount: chargeThisPrice,
            currency: "usd",
            customer: stripeID, 
            description: "Monthly charge"
            }, function(err, charge) {
            if (err) return (err);
            // if there are no errors with charging the customer, proceed to reset the monthly amount
            if(!err) {
              User.find()
              .where({id: accountID})
              .exec(function(err, account) {
                account[0].monthlyAmount = '0';
                account[0].save();
              });
            }
          });
        }

        if(amount != '0') {
          if(baseAmount == 'basic') {
            var chargeThisPrice = roundedAmount+1900;
          }
          if(baseAmount == 'plus') {
            var chargeThisPrice = roundedAmount+2900;
          }
          // stripe function to charge customer
          stripe.charges.create({
            amount: chargeThisPrice,
            currency: "usd",
            customer: stripeID, 
            description: "Monthly charge"
            }, function(err, charge) {
            if (err) return (err);
            // if there are no errors with charging the customer, proceed to reset the monthly amount
            if(!err) {
              User.find()
              .where({id: accountID})
              .exec(function(err, account) {
                account[0].monthlyAmount = '0';
                account[0].save();
              });
            }
          });
        }

      }(i))
      }      
    });
  },

  'cancel-membership': function(req, res) {
    var id = req.param('id');
    User.findOne()
    .where({id: id})
    .exec(function (err, user) {
      if(err){console.log(err)}
      var nodemailer = require("nodemailer");
      var smtpTransport = nodemailer.createTransport("SMTP",{
          service: "Gmail",
          auth: {
              user: process.env.myEmail,
              pass: process.env.nodemailerPassword
          }
      });

      var mailOptions = {
          from: "#", // sender address
          to: '#', // list of receivers
          subject: "TellMe Account Cancellation #cancellation", // Subject line
          text: "User ID: " + user.id + ", User email: " + user.email + ", Stripe ID: " + user.stripeID, // plaintext body
          html: "<p>User ID: " + user.id + "</p><p>User email: " + user.email + "</p><p>Stripe ID: " + user.stripeID + "</p>"
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
    });
  }

  
};