const express= require('express');
const router=express.Router();
const data=require('../data');
const showsData=data.shows;
const redis = require("redis");
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



router.get('/:id', async (req, res)=>{
    try{
        let checkShows={};
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
            res.send(cachedData[cachedKeys[i]]);
            return;
            }
        }
            
        }
    
        const showsId=await showsData.getShowsById(req.params.id);
      // console.log(showsId);
      checkShows["id"]=showsId.id;
       checkShows["title"]=showsId.name;
       checkShows["name"]=showsId.name;
       if(showsId.language === null)
       {
       checkShows["language"]="";}
       else{
       checkShows["language"]=showsId.language;}
       if(showsId.image === null || showsId.image.medium === null ){
       checkShows["image"]="";}
       else{
       checkShows["images"]=showsId.image.medium;}
       if(showsId.network === null || showsId.network.name===null  ){
       checkShows["network"]="";}
       else{
       checkShows["network"]=showsId.network.name;}
       if(showsId.summary === null){
       checkShows["summary"]="";}
       else{
       checkShows["summary"]=showsId.summary;}
       checkShows.summary= checkShows.summary.replace(/<[^>]*>?/gm, '');
       //console.log(checkShows);
       res.render("showresults/shows", {"title": checkShows.title,"name": checkShows.name, "id":checkShows.id, "language":checkShows.language, "image":checkShows.images, "genres": showsId.genres, "rating" : checkShows.rating, "network":checkShows.network, "summary":checkShows.summary}, async (err, html) => {
           const saveResult=await client.hmsetAsync("id", id, html);
           console.log("New data saved", saveResult);
           res.send(html);
       });
    }catch(e){
        res.status(404).render("showresults/error", { "error": { "status": 404, "message": "Sorry no shows found" } } );
    }
});

module.exports = router;