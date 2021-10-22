const express = require('express');
const app = express();
const configRoutes = require('./routes');

app.use(express.json());
//Logging middleware


// let count=0;
// app.use(function(req,res,next){
//   count++;
//   if(next){
//       next();
//   }
  
// });
// console.log("Total number of request to the server: " + count);
//Log all request, as well as the url path they are requesting and the http verb thery are using to make the request

let urlRequests = {};
let reqCount =0;

app.use (function (req, res,next){
  reqCount++;
  if(!(req.originalUrl in urlRequests)){
    urlRequests[req.originalUrl] =1;
  }else{
    urlRequests[req.originalUrl] += 1;
  }
  console.log(`----------
  Total Number of Requests to the server #${reqCount}:
  HTTP Verb: ${req.method}
  URL: ${req.originalUrl}
  Request Body:
  `);
  console.log(req.body);
  next();
})
// app.use(function(req,res, next){
//   console.log("Recieved HTTP " + req.method +  "request for: " + req.originalUrl + " with body: " + JSON.stringify(req.body));
//   next();
// });

//keeping track of how many times a particular url has been requested, updating and logging with each request
let urlCount= {}
app.use(function(req, res, next){
  console.log(`\tThis URL ${req.originalUrl} has been requested ${urlRequests[req.originalUrl]} times`);
  next();
});
configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});