module.exports = {

  schema: true,

  attributes: {

    name: {
      type: 'string'
    },
  	
  	email: {
  		type: 'string',
  		email: true,
  		required: true,
  		unique: true
  	},

    billingInfo: {
      type: 'string',
      defaultsTo: false
    },

    propertyCount: {
      type: 'integer',
      defaultsTo: '0'
    },

  	encryptedPassword: {
  		type: 'string'
  	},

    stripeID: {
      type: 'string',
      required: true
    },

    monthlyAmount: {
      type: 'integer',
      defaultsTo: '0'
    },

    monthlyPlan: {
      type: 'string',
      required: true
    },

    monthlyLeads: {
      type: 'integer',
      defaultsTo: '0'
    },

    readableNumber: {
      type: 'string'
    },

    phoneNumber: {
      type: 'string'
    },

    numberSID: {
      type: 'string'
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    areaCode: {
      type: 'integer'
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }
    
  },

  beforeCreate: function (values, next) {

      var bcrypt = require('bcryptjs');
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(values.encryptedPassword, salt, function hashCreated (err, encryptedPassword) {
              if (err) return next(err);
              values.encryptedPassword = encryptedPassword;
              next();
          });
      });
  },

};