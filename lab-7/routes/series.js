const express= require('express');
const router=express.Router();
const data=require('../data');
const seriesData=data.series;
const redis = require("redis");
const bluebird = require("bluebird");
const flat = require("flat");
const { join } = require('bluebird');
const unflatten = flat.unflatten;
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/page/:pageNum", async (req,res) => {
    console.log("Inside the get series functions:");
    let result=[];
    let pageNum=req.params.pageNum;
    
    const cachedData = await client.hgetAsync("seriesList", pageNum);
    if(cachedData!=null) 
        {
            
            console.log("Using cached data");
            return res.send(JSON.parse(cachedData));
          
        }
    const seriesDetails=await seriesData.getSeries(req.params.pageNum);
    for(let i=0;i<seriesDetails.data.results.length;i++)
        {
            result.push(seriesDetails.data.results[i]);
        }
        const saveResult=await client.hmsetAsync("seriesList", pageNum, JSON.stringify(result));
           console.log("New data saved", saveResult);
       return res.send(result);
    }
);

router.get('/:id', async (req, res)=>{
    try{
        let seriesInfo={};
        let id=req.params.id;
        const cachedData = await client.hgetallAsync("id");
        console.log(cachedData);
        
        if(cachedData!=null ) 
        {
            const cachedKeys=Object.keys(cachedData);
            for(let i=0;i<cachedKeys.length;i++)
            {
            if(cachedKeys[i] == id.toString())
            {
            console.log("Using cached data");
            res.send(JSON.parse(cachedData[cachedKeys[i]]));
            return;
            }
        }
            
        }
    
        const seriesId=await seriesData.getSeriesById(req.params.id);
        console.log("Retrieved the data")
       console.log(seriesId);
      seriesId.data.results.map((series, index)=>{
        seriesInfo["id"]=series.id;
        seriesInfo["title"]=series.title;
        seriesInfo["description"]= series.description;
        seriesInfo["startYear"]= series.startYear;
        seriesInfo["endYear"]= series.endYear;
        seriesInfo["resourceURI"]=series.resourceURI;
        seriesInfo["type"]=series.type;
      });
      console.log("Returning the data");
       console.log(seriesInfo);
       
           const saveResult=await client.hmsetAsync("id", id, JSON.stringify(seriesInfo));
           console.log("New data saved", saveResult);
          return  res.send(seriesInfo);
    }catch(e){
    res.status(404).send({error: 'No data found for the given id'});
    }
});

module.exports = router;