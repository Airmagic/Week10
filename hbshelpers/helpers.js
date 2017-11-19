var moment = require('moment');

/* this is the infomation to change from utc to a easier reading */
function formatDate(date) {
	m= moment.utc(date);
	return m.parseZone().format('dddd,MMMM Do YYYY');
}


function length(array){
	return array.length;
}


module.exports = {
	formatDate: formatDate,
	length: length
}