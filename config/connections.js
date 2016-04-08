module.exports.connections = {
  someMongodbServer: {
    adapter: 'sails-mongo',
    url: process.env.mongoUrl
  }
};
