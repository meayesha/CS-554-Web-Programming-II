const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
const ObjectId = require('mongodb').ObjectID;
const uuid = require("uuid");

// To create a movie
let create = async function create(title,cast,info,plot,rating){
    const movieData = await movies();
    try{
    if(!title) throw `Error:You need to provide a title.`
    if(typeof(title)!="string"){
        throw "Error: Title needs to be a string";
    }
    if(!title.replace(/\s/g, '').length) throw `Error:Title only contains whitespaces.`
    if(!cast || !Array.isArray(cast)) {
        throw `Error:Cast must be supplied and should be an array of objects.`}
        if(cast.length===0) throw `Cast should have atleast one element.`;
        cast.forEach(element => {
            if(typeof element !='object')throw `Cast should contain objects.`;
            if(!element.firstName) throw `Error: First Name of the cast should be provided`;
            if(!element.lastName) throw `Error: Last Name of the cast should be provided`;
        });
    if(typeof info !="object") throw `Input info ${info} is of the wrong type.`
    if(!info.director) throw `Director is missing`
    if(typeof info.director !="string") throw `Director is of the wrong type`
    if(!info.yearReleased) throw `YearReleased is missing.`
    if(typeof info.yearReleased !="number") throw `YearReleased is of the wrong type`
    if(info.yearReleased <1930 || info.yearReleased>2025) throw `Year cannot be less than 1930 or more than 2025.`
        
    if(!plot) throw `Error:Plot is missing.`
    if(typeof plot != "string") throw `Error:Plot should be of type string.`
    if(!plot.replace(/\s/g, '').length) throw `Error:Plot only contains whitespaces.`

    if(!rating) throw `Error:You need to provide a rating for the movie.`
    if(typeof(rating)!="number"){
        throw "Error: rating needs to be a number";
    }
    if(rating<0 || rating >10) throw `Rating needs to be within 1 to 10.`;
  }catch(e)
  {
    console.log(e);
  }
    
    let newMovie={
        title: title.trim(),
        cast: cast,
        info: info,
        plot: plot.trim(),
        rating: rating,
        comments:[]
    };

    const insertMovie = await movieData.insertOne(newMovie);
    if(insertMovie.insertedCount === 0) throw `Could not add movie`;
    const newId=insertMovie.insertedId;
    const movieGet=await this.getById(newId);
    return movieGet;
        
}
//To get all the movie details    
let getAll = async function getAll()
{
    const movieData = await movies();
   const movieAll=await movieData.find({}).toArray();
   return movieAll;
}

// To get the movie details of the specific movie
let getById = async function get(id){
    const movieData = await movies();
    try{
      
    if(!id) throw `Error: You need to supply the movie id`;
    const movie = await movieData.findOne({_id: ObjectId(id)});
    if(movie == null){
        throw `No such movie found`;
    }
    return movie;
  }catch(e)
    {
      console.log(e);
    }
    
}

// To remove the movie with the given id
// let remove = async function remove(id){
//     const movieData = await movies();
//     if(!id){
//         throw `Error: You much provide the id of the movie you want to delete.`;
//     }
//     const deleteMovie = await movieData.removeOne({_id:id});
//     if(deleteMovie.deletedCount === 0 ){
//         throw `Could not delete the movie with id ${id}`;
//     }
//     return deleteMovie;
// }

//to update the details of a movie
let update = async function update(id, updateTitle, updateCast, updateInfo, updatePlot, updateRating){
    const movieData = await movies();
  try{
    if(typeof(updateTitle) != "string"){
        throw `Error: Title must be a string`;
    }
    if(!Array.isArray(updateCast))
    {
        throw  `Error: The cast must be an array.`;
    }
    if(updateCast.length===0) throw `Cast should have atleast one element.`;
    updateCast.forEach(element => {
        if(typeof element !='object')throw `Cast should contain objects.`;
        if(!element.firstName || typeof(element.firstName) != 'string') throw `Error: First Name of the cast should be provided and it should be string`;
        if(!element.lastName || typeof(element.lastName) != 'string') throw `Error: Last Name of the cast should be provided and it should be string.`;
    });

    if(typeof updateInfo !='object') throw `Input info ${updateInfo} is of the wrong type.`
    if(!updateInfo.director) throw `Director is missing`
    if(typeof updateInfo.director !='string') throw `Director is of the wrong type`
    if(!updateInfo.yearReleased) throw `YearReleased is missing.`
    if(typeof updateInfo.yearReleased !='number') throw `YearReleased is of the wrong type`
    if(updateInfo.yearReleased <1930 || updateInfo.yearReleased>2025) throw `Year cannot be less than 1930 or more than 2025.`

    if(!updatePlot) throw `Error:Plot is missing.`
    if(typeof updatePlot != 'string') throw `Error:Plot should be of type string.`
    if(!updatePlot.replace(/\s/g, '').length) throw `Error:Plot only contains whitespaces.`

    if(!updateRating) throw `Error:You need to provide a rating for the movie.`
    if(typeof(updateRating)!="number"){
        throw "Error: rating needs to be a number";
        
    }
    if(updateRating<0 || updateRating >10) throw `Rating needs to be within 1 to 10.`;
    
    const movie = await getById(id);
    const updatedMovie = {
        title: updateTitle,
        cast: updateCast,
        info: updateInfo,
        plot: updatePlot,
        rating: updateRating,
        comments: movie.comments
    };

    const updateMovieDetails = await movieData.updateOne({_id:ObjectId(id)}, {$set: updatedMovie});
    if(updateMovieDetails.modifiedCount === 0){
        throw `Could not update movie details successfully`;
    }
    else{
     return await getById(id);
    }
  }catch(e)
  {
    console.log(e);
    
  }
}

//creating comments

let createComment = async function addComment(id, name, comment){
    const movieData = await movies();
    if(!name) throw `Error: You must provide a name.`;
    if(typeof(name) != 'string'){
        throw `Error: name must be a string`;
    }
    if(!comment) thorw `Error: You must provide a comment.`;
    if(typeof(comment) != 'string'){
        throw `Error: comment must be a string`;
    }

    let newComment ={
       _id: ObjectId(),
        name: name,
        comment: comment
    }
    const updatedInfo = await movieData.updateOne({ _id: ObjectId(id)}, {$push: { comments: newComment} });
    if (updatedInfo.modifiedCount === 0) {
    throw "could not update Comment successfully";
  }
  return await getById(id);
}

//delete comment

let removeComment = async function removeComment(movieId, commentId) {
    const movieData = await movies();
    if(!movieId) {
      throw    `Error: You need to provide the movie id`;
    }
    if(!commentId) {
      throw `Error: You need to provide the comment id.`;
    }
    const updatedInfo = await movieData.updateOne({_id: ObjectId(movieId)} , { $pull: { comments: { _id: ObjectId(commentId)} } });
    if (updatedInfo.modifiedCount === 0) {
      throw "could not update Comment successfully";
    }
    return await getById(movieId);
    }

    //update Title of the movie

let updateTitleDetails = async function updateTitleDetails(id, newTitle) {
        const movieData = await movies();
        const oldMovie = await getById(id);
        if(typeof(newTitle) != "string") {
          throw `Error: Title must be a string`;
        }
        if(!id) {
          throw `You must provide an id to search for`;
          }
        if(!newTitle) {
          throw `You must provide a name for your new title`;
          }
        const updatedTitle = {
          title: newTitle,
          cast: oldMovie.cast,
          info: oldMovie.info,
          plot: oldMovie.plot,
          rating: oldMovie.rating,
          comments: oldMovie.comments
         };
        const updatedInfo = await movieData.updateOne({ _id: ObjectId(id)}, {$set: updatedTitle});
        if (updatedInfo.modifiedCount === 0) {
          throw `could not update post successfully`;
        }
        else{
          return await getById(id);
        }
       
}

//update the cast of the movie

let updateCastDetails = async function updateCastDetails(id, newCast) {
    const movieData = await movies();
    const oldMovie = await getById(id);
    if(!Array.isArray(newCast)) {
      throw `Error: Cast must be an array`;
    }
    if(!id) {
      throw `You must provide an id to search for`;
      }
    if(newCast.length===0) throw `Cast should have atleast one element.`;
    newCast.forEach(element => {
        if(typeof element !='object')throw `Cast should contain objects.`;
        if(!element.firstName || typeof(element.firstName) != 'string') throw `Error: First Name of the cast should be provided and it should be string`;
        if(!element.lastName || typeof(element.lastName) != 'string') throw `Error: Last Name of the cast should be provided and it should be string.`;
    });
    const updatedCast = {
      title: oldMovie.title,
      cast: newCast,
      info: oldMovie.info,
      plot: oldMovie.plot,
      rating: oldMovie.rating,
      comments: oldMovie.comments
     };
    const updatedInfo = await movieData.updateOne({ _id: ObjectId(id)}, {$set: updatedCast});
    if (updatedInfo.modifiedCount === 0) {
      throw `could not update post successfully`;
    }
    else{
      return await getById(id);
    }
  }

  //update the information of the movie

  let updateInfoDetails = async function updateInfoDetails(id, newInfo) {
    const movieData = await movies();
    const oldMovie = await getById(id);
    let updatedInfo ={};
    if(typeof(newInfo) != "object") {
      throw `Error: Info must be an object.`;
    }
    if(!id) {
      throw `You must provide an id to search for`;
      }
    if(newInfo.director && newInfo.yearReleased) {
      if(typeof newInfo.director !='string' || typeof newInfo.yearReleased !='number' || newInfo.yearReleased <1930 || newInfo.yearReleased>2025) throw `Director or the yearReleased is of the wrong type and range`;
      else{
       updatedInfo= {
          director: newInfo.director,
          yearReleased: newInfo.yearReleased
         };
        }  
    }
    else if(newInfo.director) {
      if(typeof newInfo.director !='string') throw `director should be of type string`;
      updatedInfo= {
        director: newInfo.director,
        yearReleased: movie.yearReleased
       };
      }
    else if(newInfo.yearReleased) {
    if(typeof newInfo.yearReleased !='number') throw `YearReleased is of the wrong type`
    if(newInfo.yearReleased <1930 || newInfo.yearReleased>2025) throw `Year cannot be less than 1930 or more than 2025.`
    updatedInfo= {
      director: movie.director,
      yearReleased: newInfo.yearReleased
     };
    }
    const newMovie={
      title: oldMovie.title,
      cast: oldMovie.cast,
      info: updatedInfo,
      plot: oldMovie.plot,
      rating: oldMovie.rating,
      comments: oldMovie.comments
    };
    const updatedInformation = await movieData.updateOne({ _id: ObjectId(id)}, {$set: newMovie});
    if (updatedInformation.modifiedCount === 0) {
      throw `could not update post successfully`;
    }
    else{
      return await getById(id);
    }
}

//update the plot details

let updatePlotDetails = async function updatePlotDetails(id, newPlot) {
    const movieData = await movies();
    const oldMovie = await getById(id);
    if(typeof(newPlot) != "string") {
      throw `Error: Plot must be a string`;
    }
    if(!id) {
      throw `You must provide an id to search for`;
      }
    if(!newPlot) {
      throw `You must provide a plot.`;
      }
      const newMovie={
        title: oldMovie.title,
        cast: oldMovie.cast,
        info: oldMovie.info,
        plot: newPlot,
        rating: oldMovie.rating,
        comments: oldMovie.comments
      };
    const updatedInfo = await movieData.updateOne({ _id: ObjectId(id)}, {$set: newMovie});
    if (updatedInfo.modifiedCount === 0) {
      throw `could not update post successfully`;
    }
    else{
      return await getById(id);
    }
}

//update the ratings of the movie
let updateRatingDetails = async function updateRatingDetails(id, newRating) {
    const movieData = await movies();
    const oldMovie = await getById(id);
    try{
    if(typeof(newRating) != "number") {
      throw `Error: Rating must be a number`;
    }
    if(!id) {
      throw `You must provide an id to search for`;
      }
    if(!newRating) {
      throw `You must provide a rating to update.`;
      }
      if(newRating<0 || newRating >10) throw `Rating needs to be within 1 to 10.`;
    }catch(e)
    {
      console.log(e);
    }
      const newMovie={
        title: oldMovie.title,
        cast: oldMovie.cast,
        info: oldMovie.info,
        plot: oldMovie.plot,
        rating: newRating,
        comments: oldMovie.comments
      };
      try{
    const updatedInfo = await movieData.updateOne({ _id: ObjectId(id)}, {$set: newMovie});
    if (updatedInfo.modifiedCount === 0) {
      throw `could not update post successfully`;
    }
   else{
    return await getById(id);
   }}catch{
     console.log(e);
   }
}

module.exports = {
    create, getAll, getById, update, createComment, removeComment, updateTitleDetails, updateCastDetails, updateInfoDetails, updatePlotDetails, updateRatingDetails
};
