module.exports = {

	index: function(req, res) {
		res.view();
	},

	receive: function (req, res, next) {
		var message = req.body.Body;
		var from = req.body.From;
		var to = req.body.To;
		var accountSid = process.env.accountSid;
		var authToken = process.env.authToken;
		var client = require('twilio')(accountSid, authToken);

		Property.find()
		.where({mmsIdentifier: message, phoneNumber: to})
		.exec(function propertyFound (err, property) {
			if (err) return (err);
			if(property.length == 0) {
				client.messages.create({
				    body: 'Sorry, we didn\'t find any properties with that ID. Please check the ID and try again. - Powered by TellMe.co',
				    to: from,
				    from: to
				}, function(err, message) {
					if (err) return (err);
				    process.stdout.write(message.sid);
				    res.ok();
				});
			}

			// IF THE PROPERTY IS FOUND, THEN PROCEED
			if(property.length > 0) {

				// GET PROPERTY INFO
				id = property[0].id;
				streetAddress = property[0].streetAddress;
				tellmeUser = property[0].userID;

				// SET URL TO SEND IN SMS
				var url = 'https://www.tellme.co/property/show/' + id;

				var userID = property[0].userID;

				// SEND SMS MESSAGE
				client.messages.create({
				    body: 'Property information for ' + streetAddress + ': ' + url,
				    to: from,
				    from: to,
				}, function(err, response) {
					if (err) {
						res.badRequest();
					}

					// CREATE A LEAD IN THE DATABASE FOR THIS MESSAGE
				   Leads.create({
						propertyCode: message,
						number: from,
						propertyID: id,
						userID: tellmeUser,
						propertyAddress: streetAddress
					})
					.exec(function (err, lead) {
						if (err) return (err);
						res.ok();
					});
				});
			}
		});
	},
};

