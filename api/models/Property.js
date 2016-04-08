module.exports = {

  attributes: {

  	streetAddress: {
  		type: 'string'
  	},

  	city: {
  		type: 'string'
  	},

  	state: {
  		type: 'string'
  	},

  	zip: {
  		type: 'string'
  	},

  	userID: {
  		type: 'integer'
  	},

    description: {
      type: 'text'
    },

    mmsIdentifier: {
      type: 'text'
    },

    leads: {
      type: 'integer',
      defaultsTo: '0'
    },

    photoUrl: {
      type: 'string',
      defaultsTo: ''
    },

    photos: {
      collection: 'photo',
      via: 'propertyID'
    },

    phoneNumber: {
      type: 'string'
    },

    askingPrice: {
      type: 'string'
    },

    bedrooms: {
      type: 'string'
    },

    bathrooms: {
      type: 'string'
    },

    squareFeet: {
      type: 'string'
    },

    sellerContact: {
      type: 'string'
    }
  },

  beforeCreate: function (values, next) {
    var streetAddress = values.streetAddress;
    var noPunc = streetAddress.replace(/\./g,' ');
    var mmsIdentifier = noPunc.replace(/\s+/g, '');
    values.mmsIdentifier = mmsIdentifier;
    next();
  }
};