const express = require("express");
const router  = express.Router();
const axios =  require("axios");
const data = require('../data');
const showsData = data.shows;
const redis = require("redis");
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
router.post("/search", async (req, res) => {
    try {
       let showInfo=req.body;
        let title = "Shows Found";
        let search=showInfo.searchTerm;
        let sortedSearchData= {};
        if(showInfo.searchTerm == null || showInfo.searchTerm==" ")
            res.status(400).render("showresults/error", { error: { "message": "You need to enter a search Term to get show details. " } } ) ;
        if(typeof showInfo.searchTerm != 'string')
            res.status(400).render("showresults/error", { error: { "message": "You need to enter a string as a search Term " } } ) ;
        
        sortedSearchData= await client.zrangeAsync("mySearch", 0, -1, "withscores");
        console.log(sortedSearchData);
      let flag=0;
        if(sortedSearchData.length != 0)
        {
            for(let i=0;i<sortedSearchData.length;i++)
                {
                    if(sortedSearchData[i]== search)
                    {
                      sortedSearchData = await client.zincrbyAsync("mySearch", 1, search);
                      flag=1;
                        break;
                        
                    }
                    
                    
        }
          
        
    }
    if(flag == 0)
    {
        sortedSearchData = await client.zaddAsync("mySearch",1,search);
    }
         
            
        console.log(sortedSearchData);
        const cachedData = await client.hgetallAsync("search");
        console.log(cachedData);
            
            if(cachedData!=null ) 
            {
                const cachedKeys=Object.keys(cachedData);
                for(let i=0;i<cachedKeys.length;i++)
                {
                if(cachedKeys[i] == showInfo.searchTerm)
                {
                console.log("Using cached data");
                res.send(cachedData[cachedKeys[i]]);
                return;
                }
            }
                
            }
        const showsSearch = await showsData.getShowsBySearchItem(showInfo.searchTerm);
        res.render("showresults/search",{"searchTerm":showInfo.searchTerm, "title":title, "showsResult": showsSearch} , async (err, html) => {
            const saveResult=await client.hmsetAsync("search", search, html);
            console.log("New data saved", saveResult);
            res.send(html);
        });
    } catch (err) {
        res.status(400).render("showresults/error", { error: { "message": "Show not found" } } )
    }
});

module.exports = router