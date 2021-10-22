const express= require('express');
const router=express.Router();
const data=require('../data');
const comicsData=data.comics;
const redis = require("redis");
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/page/:pageNum", async (req,res) => {
    console.log("Inside the get comics functions:");
    let result=[];
    let pageNum=req.params.pageNum;
   
    const cachedData = await client.hgetAsync("comicsList", pageNum);
    if(cachedData!=null) 
        {
            console.log("Using cached data");
            return res.send(JSON.parse(cachedData));
            
    
        }
    const comicsDetails=await comicsData.getComics(req.params.pageNum);
    
    for(let i=0;i<comicsDetails.data.results.length;i++)
        {
            result.push(comicsDetails.data.results[i]);
        }
        const saveResult=await client.hmsetAsync("comicsList", pageNum, JSON.stringify(result));
           console.log("New data saved", saveResult);
           console.log("sending the data",result);
            return (res.send(result));
    }
);

router.get('/:id', async (req, res)=>{
    try{
        let comicsInfo={};
        let id=req.params.id;
        const cachedData = await client.hgetallAsync("id");
        //console.log(cachedData);
        
        if(cachedData!=null) 
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
      
        const comicsId=await comicsData.getComicsById(req.params.id);
        console.log("Retrieved the data")
       console.log(comicsId);
      comicsId.data.results.map((comic, index)=>{
          console.log("inside the map function to get the data");
        comicsInfo["id"]=comic.id;
        comicsInfo["title"]=comic.title;
        comicsInfo["issueNumber"]=comic.issueNumber;
        comicsInfo["description"]= comic.description;
        comicsInfo["modified"]= comic.modified;
        comicsInfo["resourceURI"]= comic.resourceURI;
        comicsInfo["upc"]= comic.upc;
        comicsInfo["pageCount"]= comic.pageCount;
      });
      console.log("the comics data retrieved")
       console.log(comicsInfo);
       
           const saveResult=await client.hmsetAsync("id", id, JSON.stringify(comicsInfo));
           console.log("New data saved", saveResult);
        return (res.send(comicsInfo));
    }catch(e){
        res.status(404).send({error: 'No data found for the given id'});
    }
});

module.exports = router;