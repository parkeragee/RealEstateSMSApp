module.exports.policies = {

  file: {
    '*': 'isAuthenticated'
  },

  PropertyController: {

  		show: true,

  		'*': 'isAuthenticated'
  },

  MainController: {

    'email': true,
    
    '*': 'admin'

  },

  UserController: {

    charge: 'admin',

    'delete': 'admin',

    basic: 'flash',

    plus: 'flash',

    create: true,

    '*': 'isAuthenticated'

  },

  SettingsController: {
    '*': 'isAuthenticated'
  },

  SessionController: {
    '*': 'flash'
  },

  LeadsController: {
    '*': 'isAuthenticated'
  }

};
