const {ApolloServer, gql} =require('apollo-server');
const lodash = require('lodash');
const uuid = require('uuid');
const fetch = require("node-fetch");
const redis = require("redis");
const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const client = redis.createClient();
const express= require('express');
const { default: axios } = require('axios');
const router=express.Router();
const { BaseRedisCache } = require('apollo-server-cache-redis');
//const Redis = require("ioredis");
const e = require('express');
const { xorBy } = require('lodash');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// const redis = new Redis({
//     port: process.env.redisPort,
//     host: process.env.redisEndpoint,
//     username: process.env.redisUsername,
//     password: process.env.redisPW,
//   });

const typeDefs = gql`
type  Query{
    unsplashImages :[ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
}
type ImagePost {
    id: ID
    url: String
    posterName: String
    description: String
    userPosted: Boolean
    binned: Boolean
}
type Mutation {
    uploadImage(url: String!, description: String, posterName: String): ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean) : ImagePost
    deleteImage(id: ID!) : ImagePost
}
`;

const resolvers= {
    Query:{
        unsplashImages:async (_,__) =>{ 
            let fetcheddata=[];
            let postDetails={};
            const  {data} = await axios.get('https://api.unsplash.com/photos/?page=2&client_id=WMSTTzpP40KpDxJxUuz6huwgaExwGqrq4dvHKsc05_Y'); 
           //const parsedData = JSON.parse(data) // parse the data from JSON into a normal JS Object
          // console.log(parsedData)
          data.forEach(element => {
             postDetails={
                "id":element.id,
                "url": element.urls.regular,
                "posterName": element.user.username,
                "description": element.user.bio,
                "userPosted": true,
                "binned": false
            }
            fetcheddata.push(postDetails);
            postDetails={};
          });

          const cachedData = fetcheddata.map(x=> JSON.stringify(x));
           await client.lpush("listcaching", ...cachedData);
            return fetcheddata ;// this will be the array of people objects
          },

        binnedImages:async (_,__) =>{
            const data = (await client.lrange("binnedData", 0, -1)||[]);
            return data.map((x) =>JSON.parse(x));
        } ,
        userPostedImages:async (_,__) =>{
            const data = (await client.lrange("userPostedData", 0, -1) || []);
            return data.userPostedImages.map((x) =>JSON.parse(x));
        } ,
     },
     Mutation: {
         uploadImage: async (_, args) =>{
             const newPost = {
                 id: uuid.v4(),
                 url: args.url,
                 posterName: args.posterName,
                 description: args.description,
                 userPosted:  true,
                 binned: false
             }
             const cachedData = JSON.stringify(newPost);
           await client.lpush("userPostedData", ...cachedData);
            return newPost ;
         },
         updateImage: async (_, args) =>{
            let binnedData = (await client.lrange("binnedData", 0, -1)||[]);
            let userPostData = (await client.lrange("userPostedData", 0, -1) || []);
            let newImagePost;
                binnedData.map((x) =>{
                    if(x.id === args.id){
                        if(args.description){
                            xorBy.description = args.description;
                        }
                        if(args.posterName){
                            x.posterName = args.posterName;
                        }
                        if(args.binned === true)
                        {
                            x.binned = true;
                            
                        }
                        newImagePost = x ;
                        return x;
                    }
                    return x;
                })
                userPostData.map((y) =>{
                    if(y.id === args.id){
                        if(args.description){
                            xorBy.description = args.description;
                        }
                        if(args.posterName){
                            y.posterName = args.posterName;
                        }
                        if(args.userPosted === true)
                        {
                            y.userPosted = true;
                            
                        }
                        newImagePost = y ;
                        return y;
                    }
                    return y;
                })
                let cachedData = JSON.stringify(newImagePost);
                await client.lpush("binnedData", ...cachedData);
                cachedData = JSON.stringify(newImagePost);
                await client.lpush("userPostedData", ...cachedData);
                return newImagePost ;
         },

        deleteImage: async(_, args) =>{
            const cachedData = await client.hgetallAsync("args.id");
            return lodash.remove(cachedData, (x) => x.id === args.id);
        }
     }
};

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    cache: new BaseRedisCache({
        client: redis.createClient({
            port: 6379 // Redis port
            // Redis host
        }),
      }),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} 🚀 `);
});