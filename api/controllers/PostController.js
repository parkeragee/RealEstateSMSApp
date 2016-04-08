
module.exports = {
    
	index: function (req, res) {
		res.view();
	},

	'new': function (req, res, next) {
		Post.create(req.params.all(), function newPost (err, post) {
			if (err) {
				var noPost = ['The post could not be completed.'];
						req.session.flash = {
							err: noPost
						}
						return res.redirect('/post');
			}
			var stripe = require('stripe')(process.env.stripeKey);
			var stripeToken = req.param('stripeToken');

			var charge = stripe.charges.create({
				amount: 9900,
				currency: "usd",
				card: stripeToken,
				description: "TellMe.co"
			}, function(err, charge) {
			if (err && err.type === 'StripeCardError') {
				res.redirect('/post');
			}
			  res.redirect('/');
			});
		res.redirect('/');
		});
	},

	all: function (req, res, next) {
		var user = req.session.User.id;
		Post.find()
		.where({userID: user})
		.sort({createdAt: 'desc'})
		.exec(function postsFound (err, posts) {
			if (err) return next(err);
			res.view({
				posts: posts
			});
		});
	},

	show: function (req, res, next) {
		Post.findOne(req.param('id'), function foundpost (err, post) {
			if (err) return next(err);
			if (!post) return next();
			res.view({
				post: post
			})
		});
	},

	edit: function (req, res, next) {
		Post.findOne(req.param('id'), function foundPost (err, post) {
			if (err) return next(err);
			if (!post) return next('Post doesn\'t exist.');
			res.view({
				post: post
			})
		});
	},

	update: function (req, res, next) {
		Post.update(req.param('id'), req.params.all(), function postUpdated (err, post) {
			if (err) {
				return res.redirect('/post/edit/' + req.param('id'));
			}
			res.redirect('/post/all');
		});
	},

	delete: function (req, res, next) {
		Post.findOne(req.param('id'), function (err, post){
			if (err) return next(err);
			Post.destroy(req.param('id'), function (err, destroyed) {
				if (err) return next(err);
				res.redirect('/post/all');
			});
		});
	},
  
};
