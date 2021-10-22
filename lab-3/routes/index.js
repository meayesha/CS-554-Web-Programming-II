//const home = require("./main")
const express = require("express");
const data = require("../data");
const showsList = data.shows;
const searchResults = require("./searchResult")
const showsData = require("./shows")
const redis = require("redis");
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const constructorMethod = app => { 

    app.get("/", async (req,res) => {
        let title = "Show Finder";
        let result=[];
        const showDetails=await showsList.getShows();
        for(let i=0;i<showDetails.length;i++)
            {
                result.push(showDetails[i]);
            }
        res.render("showresults/mainpage", { "title": title, "showsList": result });
        }
    );
        app.get("/popularsearches", async(req,res)=>{
            let listSearch =[];
             listSearch =  await client.zrangeAsync("mySearch", -11, -1);
             listSearch=listSearch.reverse();
            console.log(listSearch);
            let title ="Most Popular Searches"
            if(listSearch == null)
            {
                res.status(404).render("showresults/error", { "error": { "status": 404, "message": "Page Cannot Be Found" } } );
            }
            else
            {
                res.render("showresults/popularSearches", { "title": title, "showsList": listSearch });
            }
        })
    app.post("/search", searchResults)
    app.use("/shows", showsData)
    
    app.use("*",(req,res)=>{
        res.status(404).render("showresults/error", { "error": { "status": 404, "message": "Page Cannot Be Found" } } );
    })
}

module.exports = constructorMethod;