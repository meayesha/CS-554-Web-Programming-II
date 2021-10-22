const express= require('express');
const router=express.Router();
const data=require('../data');
const charactersData=data.characters;
const redis = require("redis");
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/page/:pageNum", async (req,res) => {
    console.log("Inside the get characters functions:");
    let result=[];
    let pageNum=req.params.pageNum;
    //console.log("pagenum is ", pageNum);
    const cachedData = await client.hgetAsync("characterList",pageNum);
    if(cachedData!=null) 
        {
            
            console.log("Using cached data");
            return  res.send(JSON.parse(cachedData));
      
        }
    const characterDetails=await charactersData.getCharacters(req.params.pageNum);
    for(let i=0;i<characterDetails.data.results.length;i++)
        {
            result.push(characterDetails.data.results[i]);
        }
        const saveResult=await client.hmsetAsync("characterList",pageNum, JSON.stringify(result));
           console.log("New data saved", saveResult);
          return  res.send(result);
    }
);

router.get('/:id', async (req, res)=>{
    console.log("Inside the get characters.")
    try{
        let characterInfo={};
        let id=req.params.id;
        console.log("the id is ", id);
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
            return res.send(JSON.parse(cachedData[cachedKeys[i]]));
            
            }
        }
            
        }
    
        const charactersId=await charactersData.getCharactersById(req.params.id);
        console.log("Retrieved the data")
      console.log(charactersId);
      charactersId.data.results.map((character, index)=>{
        characterInfo["id"]=character.id;
        characterInfo["name"]=character.name;
        characterInfo["description"]= character.description;
        characterInfo["modified"]= character.modified;
        characterInfo["resourceURI"]= character.resourceURI;
      });
      console.log("returning the data")
            console.log(characterInfo);
      
           const saveResult=await client.hmsetAsync("id", id, JSON.stringify(characterInfo));
           console.log("New data saved", saveResult);
          return res.send(characterInfo);
    }catch(e){
        res.status(404).send({error: 'No data found for the given id' });
    }
});

module.exports = router;