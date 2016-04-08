module.exports = {
	index: function(req, res, next) {
		var userID = req.session.User.id;
		Leads.find()
		.where({userID: userID})
		.exec(function (err, leads) {
			if (err) {
				console.log(err);
				return res.redirect('back');
			} else {
				console.log(leads[0]);
				res.view({
					leads: leads
				});
			}
		});
	}
};

