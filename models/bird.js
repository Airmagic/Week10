var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/*information about a birds species, and the dates thsi bird was seen*/

var birdSchema = new mongoose.Schema({
	name: { type: String,
	required: [true, 'Bird name is required.'],
	unique: true,
	iniqueCaseInsensitive: true,
	validate: {
		validator: function(n) {
			return n.length >= 2;
		},
		message: '{VALUE} is not valid, bird name must be at least 2 letters'
		}
	}, //species name
	description: String,  //Describing the bird that was seen*/
averageEggs: {type: Number, min:[1, 'Should be more than 1 egg.'], max: [40,'Should not be more than 40']}, // number of eggs that was found in nest
	endangered: {type: Boolean, default: false }, // Is the bird becoming extincted?
	datesSeen: [{ type: Date, required: true, 
	/* validate: {
		validator: function(d) {
			if (!d) {return false;}
			return d.getTime() <= Date.now();
		},
		message: 'Date must be a valid date and before the current time.'
	} */
	}] // An array of dates a bird of this species was seen
});

var Bird = mongoose.model('Bird', birdSchema);
birdSchema.plugin(uniqueValidator);

module.exports = Bird;