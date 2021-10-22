const axios =require('axios');
const md5 = require('blueimp-md5');
const publickey = 'b3f3ae85c881c6196c303b96f1678274';
const privatekey = 'b82cf5047defc8b4ca20fd4bd5338432c0fe5739';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
async function getComics(pageNum){
    const { data } = await axios.get('https://gateway.marvel.com:443/v1/public/comics'+ '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash+'&limit=20&offset=' + (pageNum * 20).toString())
   // const parsedData = JSON.parse(data) // parse the data from JSON into a normal JS Object
    return data ;// this will be the array of people objects
  }

  async function getComicsById(id){
    if(id == null) throw `Input paramter missing`;
    let x=id.match(/[0-9]+/);
    if(!x) throw `Id should be a number.`;
    if(id<0) throw `Id should be a positive number.`;
    //if(id>51111) throw `Id is out of range.`

    const { data } = await axios.get(`https://gateway.marvel.com:443/v1/public/comics/${id}` + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash);
   // const parsedData = JSON.parse(data) // parse the data from JSON into a normal JS Object
   if(data == null) throw `No comics found with id ${id}.`
   return data ;// this will be the array of people objects
  }


module.exports={getComics, getComicsById};