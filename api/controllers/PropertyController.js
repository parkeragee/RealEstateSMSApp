module.exports = {

	index: function(req, res, next) {
		var user = req.session.User.id;
		Property.find()
		.where({userID: user})
		.sort({createdAt: 'desc'})
		.exec(function propertyFound (err, property) {
			if (err) return next(err);
			res.view({
				property: property
			});
		});
	},

	'new': function (req, res, next) {
		res.view();
	},

	create: function(req, res, next) {
		Property.create(req.params.all(), function newProperty (err, property) {
			if (err) {
				var noProperty = ['The property could not be completed.'];
						req.session.flash = {
							err: noProperty
						}
						return res.redirect('/property');
			}
			
			res.redirect('/property');
		});
	},

	show: function (req, res, next) {
		Property.findOne(req.param('id'), function foundProperty (err, property) {
			if (err) return next(err);
			res.view({
				property: property
			})
		});
	},

	edit: function (req, res, next) {
		Property.findOne(req.param('id'), function foundProperty (err, property) {
			if (err) return next(err);
			if (!property) return next('Property doesn\'t exist.');
			res.view({
				property: property
			})
		});
	},

	update: function (req, res, next) {
		Property.update(req.param('id'), req.params.all(), function propertyUpdated (err, property) {
			if (err) {
				return res.redirect('/property/edit/' + req.param('id'));
			}
			res.redirect('/property');
		});
	},

	delete: function (req, res, next) {
		Property.findOne(req.param('id'), function (err, property){
			if (err) return next(err);
			Property.destroy(req.param('id'), function (err, destroyed) {
				if (err) return next(err);
				res.redirect('/property');
			});
		});
	},
	
};

