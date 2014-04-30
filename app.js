// Module dependencies

var express    = require('express'),
    mysql      = require('mysql'),
    http       = require('http'),
    path       = require('path'),
    connect    = require('connect');

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'abrownlie',
        password : '3820042',
    });
    
var app = express();
var server = http.createServer(app);

connection.query('DROP DATABASE IF EXISTS test', function(err) {
	if (err) throw err;
	connection.query('CREATE DATABASE IF NOT EXISTS test', function (err) {
	    if (err) throw err;
	    connection.query('USE test', function (err) {
	        if (err) throw err;
        	connection.query('CREATE TABLE IF NOT EXISTS users('
	            + 'id INT NOT NULL AUTO_INCREMENT,'
	            + 'PRIMARY KEY(id),'
        	    + 'username VARCHAR(30),'
		    + 'password VARCHAR(30)'
	            +  ')', function (err) {
        	        if (err) throw err;
	            });
	    });
	});
});
	
// Configuration

app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static(__dirname + '/public'));
//app.use(express.static('images'));

// Main route sends our HTML file
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/createuser', function(req, res) {
  res.sendfile(__dirname + '/createuser.html');
});

app.get('/getuser', function(req, res) {
  res.sendfile(__dirname + '/getuser.html');
});

//POST

app.post('/getuser', function (req, res) {
    console.log(req.body);
            connection.query('select username, password from users where username = ?', req.body.username, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
  	              res.send('Account: ' + result[0].username + '<br />' +
		  	       'Password: ' + result[0].password
		      );
                    }
                    else
                      res.send('User does not exist.');
		});
        
    });

app.post('/createuser', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO users SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            connection.query('select username, password from users where username = ?', req.body.username, 
		function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
  	              res.send('Account: ' + result[0].username + '<br />' +
		  	       'Password: ' + result[0].password
		      );
                    }
                    else
                      res.send('User was not inserted.');
		});
        }
    );
});

// Static Content Directory

app.use(express.static(path.join(__dirname, 'public')));


// Begin listening
server.listen(8001);
console.log("Express server listening on port %s", server.address().port);
