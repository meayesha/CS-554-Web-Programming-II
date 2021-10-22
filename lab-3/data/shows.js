const axios =require('axios');

async function getShows(){
    const { data } = await axios.get('http://api.tvmaze.com/shows');
   // const parsedData = JSON.parse(data) // parse the data from JSON into a normal JS Object
    return data ;// this will be the array of people objects
  }

  async function getShowsById(id){
    if(id == null) throw `Input paramter missing`;
    let x=id.match(/[0-9]+/);
    if(!x) throw `Id should be a number.`;
    if(id<0) throw `Id should be a positive number.`;
    //if(id>51111) throw `Id is out of range.`

    const { data } = await axios.get(`http://api.tvmaze.com/shows/${id}`);
   // const parsedData = JSON.parse(data) // parse the data from JSON into a normal JS Object
   if(data == null) throw `No tv show found with id ${id}.`
   return data ;// this will be the array of people objects
  }

  async function getShowsBySearchItem(searchTerm){
    if(searchTerm == null) throw `Input paramter missing`;
    //let x=id.match(/[0-9]+/);
    if(typeof searchTerm != 'string') throw `searchItem should be a string.`;
   // if(id<0) throw `Id should be a positive number.`;
    //if(id>51111) throw `Id is out of range.`

    const { data } = await axios.get(`http://api.tvmaze.com/search/shows?q=${searchTerm}`);
   // const parsedData = JSON.parse(data) // parse the data from JSON into a normal JS Object
   if(data == null) throw `No tv show found with id ${searchItem}.`
   return data ;// this will be the array of people objects
  }

module.exports={getShows, getShowsById, getShowsBySearchItem};