const { response } = require("express");
const express= require("express");
const path=require("path");

const app= express();

app.use("/public", express.static(__dirname +"/public"));

app.get("/", function(req, res){
    res.sendFile(path.resolve("public/movies.html"));
});

app.use("*",(req,res)=>{
    res.status(404).sendFile(path.resolve("public/404.html"));
});

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });