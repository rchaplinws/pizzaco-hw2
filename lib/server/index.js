/**
 * This is the entry file for the HTTPS Server.
 * 
 */

// Dependencies
const config = require('./config');
const fs = require('fs');
const https = require('https');
const router = require('./router');
const StringDecoder = require('string_decoder').StringDecoder;
const url = require('url');

let server = {};

server.init = function(){

    // Instantiate the HTTPS server
    let httpsServerOptions = {
        'key': fs.readFileSync('./.https/key.pem'),
        'cert': fs.readFileSync('./.https/cert.pem')
    };
    let httpsServer = https.createServer(httpsServerOptions,function(req,res){
        
        // Parse the url
        var parsedUrl = url.parse(req.url, true);

        // Get the path
        var path = parsedUrl.pathname;
        var trimmedPath = path.replace(/^\/+|\/+$/g, '');

        // Get the query string as an object
        var queryStringObject = parsedUrl.query;

        // Get the HTTP method
        var method = req.method.toLowerCase();

        //Get the headers as an object
        var headers = req.headers;

        // Get the payload,if any
        var decoder = new StringDecoder('utf-8');
        var dataStream = '';
        req.on('data', function(data) {
            dataStream += decoder.write(data);
        });
        req.on('end', function() {
            dataStream += decoder.end();

            // Check the router for a matching path for a controller. If one is not found, use the notFound controller instead.
            var controller = typeof(router.controllers[trimmedPath]) !== 'undefined' ? router.controllers[trimmedPath] : router.controllers.notFound;

            // Construct the data object to send to the controller
            var data = {
                'trimmedPath' : trimmedPath,
                'queryStringObject' : queryStringObject,
                'method' : method,
                'headers' : headers,
                'payload' : dataStream
            };

            // Route the request to the controller specified in the router
            controller.render(data, function(statusCode,payload){

                // Use the status code returned from the controller, or set the default status code to 200
                statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

                // Use the payload returned from the controller, or set the default payload to an empty object
                payload = typeof(payload) == 'object'? payload : {};

                // Convert the payload to a string
                var payloadString = JSON.stringify(payload);

                // Return the response
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(statusCode);
                res.end(payloadString);
                console.log("Returning this response: ", statusCode, payloadString);

            });

        });
    });
  
    // Start the HTTPS server
    httpsServer.listen(config.httpsPort,function(){
        console.log('The HTTPS server is running on port ' + config.httpsPort);
    });
}



module.exports = server;
