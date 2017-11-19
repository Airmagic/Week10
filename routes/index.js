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
	
	//form data can only be in key value pairs. adding the nesting material and location
	bird.nest = {
		location: req.body.nestLocation,
		materials: req.body.nestMaterials
	};
	
	//adding key value pair for the hight of the bird
	bird.height = {
		height: req.body.birdHeight
	};
	
	
	//saves new bird infomation in the db
	bird.save()
		.then( (doc) => {
			//if you want a printout in your db runner terminal
			/* console.log(doc); */
			res.redirect('/')
		})
		.catch( (err) => {
			if (err.name === 'ValidationError'){
				// checks for validation errors
				//if more than one error all will be combined
				req.flash('error', err.message);
				res.redirect('/');
			}
			else {
				//passes a generic error
				next(err);
			}
		});
});

/* get info about one bird */
router.get('/bird/:_id', function(req, res, next){
	
	Bird.findOne( {_id: req.params._id})
		.then((doc) => {
			//decided to go with sorting the array
			if (doc){
				/*doc.datesSeen = doc.datesSeen.sort(function(a, b){
					if (a && b){
						return a.getTime() - b.getTime();
					}
				}); */
				res.render('bird', {bird: doc});
			}
			else {
				res.status(404);
				next(Error('Bird not found'));//error handleEvent
			}
		})
		.catch ((err) => {
			next(err);
		});
});

/* post to add a new sighting for a bird. bird id is expected in the body */
router.post('/addSighting', function(req, res, next){
	
	
	Bird.findOneAndUpdate({_id: req.body._id}, {$push : {datesSeen : { $each : [req.body.date], $sort: 1} }}, {runValidators: true} )
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


/* post to change description for a bird. bird id is expected in the body */
router.post('/changeDescription', function(req, res, next){
	
	
	Bird.findOneAndUpdate({_id: req.body._id}, {description :[req.body.description] } )
		.then( (doc) => {
			if (doc) {
				res.redirect('/bird/' + req.body._id); //redirects to this bird's info page
			}
			else {
				res.status(404); next(Error('Attempt to change description of a bird not in database'))
			}
		})
		.catch((err) => {
			console.log(err);			
			if (err.name === 'CastError'){
				req.flash('error', 'Sorry, something happened in your description');
				res.redirect('/bird/' + req.body._id);
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

/* post to average eggs for a bird. bird id is expected in the body */
router.post('/changeAverageEggs', function(req, res, next){
	
	
	Bird.findOneAndUpdate({_id: req.body._id}, {averageEggs :[req.body.averageEggs] } )
		.then( (doc) => {
			if (doc) {
				res.redirect('/bird/' + req.body._id); //redirects to this bird's info page
			}
			else {
				res.status(404); next(Error('Attempt to change the average eggs of a bird not in database'))
			}
		})
		.catch((err) => {
			console.log(err);			
			if (err.name === 'CastError'){
				req.flash('error', 'Sorry, something happened to average eggs');
				res.redirect('/bird/' + req.body._id);
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



/* Post task to delete a bird */
router.post('/delete', function(req, res, next){
	
	Bird.deleteOne({_id : req.body._id })
		.then((result) => {
			if (result.deleteCount === 1) {
				res.redirect('/');
			}
			else {
				res.redirect('/');
				res.status(404).send('Error deleting bird: not found');
				
			}
		})
      .catch((err) => {
        next(err);
      });
	
});

module.exports = router;
