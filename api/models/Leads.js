module.exports = {

  attributes: {

  	number: {
  		type: 'string'
  	},

  	propertyCode: {
  		type: 'string'
  	},

  	propertyID: {
  		type: 'string'
  	},

  	userID: {
  		type: 'string'
  	},

    propertyAddress: {
      type: 'string'
    }

  },

	afterCreate: function (values, next) {
		var id = values.propertyID;
		Property.findOne(id)
		.exec(function (err, property) {
			var leads = property.leads;
			var newCount = ++leads;
			property.leads = newCount;
			property.save(function (err) {
				if (err) return next(err);
			});
		});
	}

};