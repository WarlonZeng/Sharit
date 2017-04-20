var request = require('request');
var express = require('express');
var router = express.Router();

// REQUIRES: 
// username
// thread_id
// rating
router.get('/vote_thread/NYU/:thread_id/:rating', function(req, res) {
	if (req.session.data == null) {
		res.redirect('/login');
	}

	else if (req.session.data != null) {
		request.post({ // because fkn hui made a native XMLHttpRequest in GET
            url: api + '/vote_thread/NYU',
            json: true,
            form: {
            	username: req.session.data.username,
            	thread_id: req.params.thread_id,
            	rating: req.params.rating
            }
        }, function(error, response, body) {
        	console.log(response.body);
        	 res.json(response.body);
        });
	}
});

// REQUIRES: 
// username
// comment_id
// rating
router.get('/vote_comment/NYU/:comment_id/:rating', function(req, res) {
	if (req.session.data == null) {
		res.redirect('/login');
	}

	else if (req.session.data != null) {
		request.post({ // because fkn hui made a native XMLHttpRequest in GET
            url: api + '/vote_comment/NYU',
            json: true,
            form: {
            	username: req.session.data.username,
            	thread_id: req.params.comment_id,
            	rating: req.params.rating
            }
        }, function(error, response, body) {
        	console.log(response.body);
        	 res.json(response.body);
        });
	}
});


module.exports = router;