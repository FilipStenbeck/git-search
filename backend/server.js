var express = require('express'),
    gitConfig = require('./gitConfig'),
    _ = require('lodash'),
    Git = require('git-wrapper'),
    git = new Git({ 'git-dir': gitConfig.getLocalGitFolder() }),
    app = express(),
    allowCrossDomain,
    handleResponse,
    createCommitList,
    portNumber= 9999;


/******************************
* Server configuration & logic
*******************************/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

createCommitList =  function (log, query, type) {
	var result = [];

	_.each(log, function(item) {
		//Clean input
		var lines = item.split('\n')
        key = lines[0] || '',
		author = lines[1] || '',
		date =  lines[2] || '',
		message = lines[4] || '',

		//Create commit object
		commitObj = {
			key : key.replace(/\s/, ''),
			author : author.replace(/Author:./, ''),
			date : date.replace(/Date:./, ''),
			message : message
		};
		
		//Add object to result if matching 
        if (query && commitObj[type].indexOf(query) > -1) {
			if (commitObj.key !== "undefined" && commitObj.author.indexOf('Merge') !== 0) {
				result.push(commitObj);	
			}
		}
	});
	return result;	
};

handleResponse = function (request, response, parameter, type) {
    var log = [];
    
    git.exec('log',  function(err, msg) {
        if (msg) {  
            log = msg.split('commit');
            response.send(createCommitList(log, parameter, type));
        } else {
            response.send([]);   
        }
    });      
    }, function (error) {
        console.error(error);
        response.send(500);
};



/************************
* REST endpoints
*************************/

//search commits by part of the message
app.get('/search/:query', function (request, response) {
    handleResponse(request, response, request.params.query, 'message');
});

//search commits by author
app.get('/author/:name', function (request, response) {
    handleResponse(request, response, request.params.name, 'author');
});

app.get('/init', function(request, response){
   
}); 

app.listen(portNumber);

console.log("");
console.log("**********************************************");
console.log('The server is listening on port', portNumber);
console.log("**********************************************");