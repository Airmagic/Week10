var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

/* GET home page. */
router.get('/', function(req, res, next) {
	
	Bird.find().select( { name: 1, description: 1}).sort({ name: 1})
		.then( ( docs ) => {
			console.log(docs); //not req, but useful to see what's returned
			res.render('index', {title: 'All Birds', birds: docs });
		}).catch((err) => {
			next(err)
		});
});

/* post to create New birds in collection */
router.post('/addBird', function(req, res, next){
	
	//use form data to make a new bird, then save to dbbird
	var bird = Bird(req.body);
	bird.save()
		.then( (doc) => {
			console.log(doc);
			res.redirect('/')
		})
		.catch( (err) => {
			if (err.name === 'ValidationError'){
				req.flash('error', err.message);
				res.redirect('/');
			}
			else {
				next(err);
			}
		});
});

/* get info about one bird */
router.get('/bird/:_id', function(req, res, next){
	
	Bird.findOne( {_id: req.params._id})
		.then((doc) => {
			if (doc){
				res.render('bird', {bird: doc});
			}
			else {
				res.status(404);
				next(Error('Bird not found'));
			}
		})
		.catch ((err) => {
			next(err);
		});
});

/* post to add a new sighting for a bird. bird id is expected in the body */
router.post('/addSighting', function(req, res, next){
	
	Bird.findOneAndUpdate({_id: req.body._id}, {$push : {datesSeen : req.body.date}}, {runValidators: true} )
		.then( (doc) => {
			if (doc) {
				res.redirect('/bird/' + req.body._id); //redirects to this bird's info page
			}
			else {
				res.status(404); next(Error('Attempt to add sighting to bird not in database'))
			}
		})
		.catch((err) => {
			console.log(err);
			
			if (err.name === 'CastError'){
				req.flash('error', 'Date must be in a valid date format');
				res.redirect('/bird/' + req.body_id);
			}
			else if (err.name === 'ValidationError'){
				req.flash('error', err.message);
				res.redirect('/bird/ + req.body._id');
			}
			else {
				next(err);
			}
		});
});


module.exports = router;
