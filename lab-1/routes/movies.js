const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const data = require("../data");
const movieData = data.movies;

// GET movie by ID
router.get("/movies/:id", async (req, res) => {
    try {
      const movie = await movieData.getById(req.params.id);
      res.status(200).json(movie);
    } catch (e) {
      res.status(404).json({ message: "Movie not found" });
      console.log(e);
      return;
    }
  });
  // GET ALL Movies
  router.get("/movies", async (req, res) => {
    try {
      const movieList = await movieData.getAll();
      let displayList = [];
      // let start = 0;
      // let end = 20;
      if(req.query.skip) {
       displayList = movieList.slice(parseInt(req.query.skip,10), parseInt(req.query.skip,10)+20);
       
      }
      else if(req.query.take) {
        if(req.query.take < 100) {
          displayList = movieList.slice(0, parseInt(req.query.take,10));
        }
        else{
          displayList = movieList.slice(0, 99);
        }
      }
      else {
        displayList = movieList.slice(0,20);
         }
      res.status(200).json(displayList);
    } catch (e) {
      res.status(404).json({ message: "No Movies found" });
      console.log(e);
      return;
    }
  });

    // POST a movie
  router.post("/movies",async (req,res)=> {
    const body = req.body;
    if(!body)
    {
        res.status(404).json({error:"No data found"});
        return;
    }
    if(!body.title){
        res.status(404).json({error:"No data found for title"});
        return;
    }
    if(!body.cast){
        res.status(404).json({error: "No data found for cast"});
        return;
    }
    if(!body.info){
        res.status(404).json({error:"No data found for info"});
        return;
    }
    if(!body.plot){
        res.status(404).json({error:"No data found for plot"});
        return;
    }
    if(!body.rating){
        res.status(404).json({error:"No data found for rating"});
        return;
    }
    try{
    if(typeof(body.title)!="string"){
        throw `Error: Title needs to be a string`;
    }
    if(!body.title.replace(/\s/g, '').length) throw `Error:Title only contains whitespaces.`
    if(!Array.isArray(body.cast)) {
        throw `Error:Cast must be supplied and should be an array of objects.`}
        if(body.cast.length===0) throw `Cast should have atleast one element.`;
        body.cast.forEach(element => {
            if(typeof element !='object')throw `Cast should contain objects.`;
            if(!element.firstName) throw `Error: First Name of the cast should be provided`;
            if(!element.lastName) throw `Error: Last Name of the cast should be provided`;
        });
    if(typeof body.info !="object") throw `Input info ${body.info} is of the wrong type.`
    if(!body.info.director) throw `Director is missing`
    if(typeof body.info.director !="string") throw `Director is of the wrong type`
    if(typeof body.info.yearReleased !="number") throw `YearReleased is of the wrong type`
    if(body.info.yearReleased <1930 || body.info.yearReleased>2025) throw `Year cannot be less than 1930 or more than 2025.`
    if(typeof body.plot != "string") throw `Error:Plot should be of type string.`
    if(!body.plot.replace(/\s/g, '').length) throw `Error:Plot only contains whitespaces.`
    if(typeof(body.rating)!="number"){
        throw `Error: rating needs to be a number`;
    }
    if(body.rating<0 || body.rating >10) throw `Rating needs to be within 1 to 10.`;
  }catch(e)
  {
    res.status(400).json({error:e});
    console.log(e);
    return;
  }

    try{
        const newMovie = await movieData.create(body.title,body.cast,body.info,body.plot,body.rating);
        res.status(200).json(newMovie);
    }catch(e)
    {
        res.sendStatus(500);
        console.log(e);
    } 
  });

  // PATCH route
  router.patch("/movies/:id", async (req,res) =>{
    const body = req.body;
    const id=req.params.id;
    const oldMovie = await movieData.getById(id);
    let count=0;
    try{
    if(!body)
    {
        throw `Error: Must provide some parameters.`;
    }
  }catch(e)
  {
    res.status(404).json({error:"You must provide some parameters.."});
    console.log(e);
  }
       try{
    //updating fields
    if(body.title)
    {
      if(typeof(body.title) != "string")
      {
        throw `Title needs to be a string.`
      }
    if(body.title !== oldMovie.title)
    {
        let movie = await movieData.updateTitleDetails(id, body.title);
        count= count+1;
        res.status(200).json(movie);
    }
  }
    if(body.plot){
      if(typeof(body.plot) != "string")
      {
        throw `Plot needs to be a string.`
      }
     if(body.plot !== oldMovie.plot)
    {
        let movie = await movieData.updatePlotDetails(id, body.plot);
        count= count+1;
        res.status(200).json(movie);
    }
  }
    if(body.rating )
    {
      if(typeof(body.rating) != "number")
      {
        throw `Rating needs to be a number.`
      }
      if(body.rating<0 || body.rating >10) 
      {
        throw `Rating needs to be withing 1 to 10.`;
      }
     if(body.rating !== oldMovie.rating)
    {
        let movie = await movieData.updateRatingDetails(id, body.rating);
        count= count+1;
        res.status(200).json(movie);
    }
  }
    if(body.info){
      if(typeof(body.info.director) !="string")
      {
        throw `Director needs to be a string.`
      }
      if(typeof(body.info.yearReleased) !="number")
      {
        throw `yearReleased needs to be a number.`
      }
    if((body.info.director && body.info.director !== oldMovie.info.director) || (body.info.yearReleased && body.info.yearReleased !== oldMovie.info.yearReleased))
    {
        let movie = await movieData.updateInfoDetails(id, body.info);
        count= count+1;
        res.status(200).json(movie);
    }
  }
  if(body.cast)
  {
    if(!Array.isArray(body.cast)) {
      throw `Error: Cast must be an array`;
    }
    if(body.cast.length===0) throw `Cast should have atleast one element.`;
    body.cast.forEach(element => {
      if(typeof element !='object')throw `Cast should contain objects.`;
      if(!element.firstName || typeof(element.firstName) != 'string') throw `Error: First Name of the cast should be provided and it should be string`;
      if(!element.lastName || typeof(element.lastName) != 'string') throw `Error: Last Name of the cast should be provided and it should be string.`;
  });
  
    let movie = await movieData.updateCastDetails(id, body.cast);
    count = count+1;
    res.status(200).json(movie);
  }
  if(body.comments)
  {
    throw `You cannot update comments here....`
  }
  if(count===0) throw `Atleast one field must be updated..`;
}catch(e)
{
  console.log(e);
  res.status(400).json({error:e})
}
  });
  // PUT route
  router.put("/movies/:id", async (req, res) =>{
    const id = req.params.id;
    const body = req.body;
    
    try{
    if(!body) {
    throw `No data found`;
     
  }
  if(!body.title) {
    throw `You need to provide title.`;
  }
  if(!body.cast) {
    throw `You need to provide to the cast of the movie.`;
  }
  if(!body.info) {
    throw `You need to provid the info.`;
  }
  if(!body.plot) {
    throw   `You need to provide the plot.`;
  }
  if(!body.rating) {
    throw `You need to provide the rating.`;
  }
  if(body.comments)
    {
      throw `You cannot update comments here`;
    }
  }catch(e)
  {
    res.status(404).json({error:e});
    return;
  }
try{
    if(typeof(body.title) != "string"){
      throw `Error: Title must be a string`;
  }
  if(!Array.isArray(body.cast))
  {
      throw  `Error: The cast must be an array.`;
  }
  if(body.cast.length===0) throw `Cast should have atleast one element.`;
  body.cast.forEach(element => {
      if(typeof element !='object')throw `Cast should contain objects.`;
      if(!element.firstName || typeof(element.firstName) != 'string') throw `Error: First Name of the cast should be provided and it should be string`;
      if(!element.lastName || typeof(element.lastName) != 'string') throw `Error: Last Name of the cast should be provided and it should be string.`;
  });

  if(typeof body.info !='object') throw `Input info ${body.info} is of the wrong type.`
  if(!body.info.director) throw `Director is missing`
  if(typeof body.info.director !='string') throw `Director is of the wrong type`
  if(!body.info.yearReleased) throw `YearReleased is missing.`
  if(typeof body.info.yearReleased !='number') throw `YearReleased is of the wrong type`
  if(body.info.yearReleased <1930 || body.info.yearReleased>2025) throw `Year cannot be less than 1930 or more than 2025.`
  if(typeof body.plot != 'string') throw `Error:Plot should be of type string.`
  if(!body.plot.replace(/\s/g, '').length) throw `Error:Plot only contains whitespaces.`

  if(!body.rating) throw `Error:You need to provide a rating for the movie.`
  if(typeof(body.rating)!="number"){
      throw `Error: rating needs to be a number`;
  }
  if(body.rating<0 || body.rating >10) throw `Rating needs to be within 1 to 10.`;
  }catch(e)
  {
    res.status(400).json({error:e});
    console.log(e);
    return;
  }
  try {
    await movieData.getById(id);
  }
  catch(e) {
    res.status(404).json({error: "No movie with the given id was found"});
    console.log(e);
    return;
  }
  try {
    let movie = await movieData.update(id, body.title, body.cast, body.info, body.plot, body.rating)
    res.status(200).json(movie);
  } catch(e) {
    res.sendStatus(500);
    console.log(e);
    return;
  }
});
//Post a comment
router.post("/movies/:id/comments", async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try{
    if(!id) {
      throw `Error: Need a movie id to create a comment`;
    }
    if(!body.name) {
      throw `Error: Comment needs a name`;
    }
    if(!body.comment) {
      throw `Error: Need a description of the comment`;
    }
  }catch(e)
  {
      res.status(400).json({error:e.message});
      console.log(e);
      return;
  }
    try {
      await movieData.getById(id);
    }
    catch(e) {
      res.status(404).json({error: "Movie not found"});
      return;
    }
    try {
      let postComment = await movieData.createComment(id, body.name, body.comment);
      res.status(200).json(postComment);
    } catch(e) {
      res.sendStatus(500).json({error:e});
      console.log(e);
      return;
    } 
  });
//Delete a comment
  router.delete("/movies/:movieId/:commentId", async (req,res )=> {
    const movieId = req.params.movieId;
    const commentId = req.params.commentId;
    try {
    if(!movieId) {
      throw `Error: need to provide the movie Id to remove comment`;
    }
    if(!commentId) {
      throw `Error: need to provide the commentId to remove comment`;
    }
  }catch(e)
  {
    res.status(404).json({error:e});
    return;
  }
    try{
      let removeComment = await movieData.removeComment(movieId, commentId);
      res.status(200).json(removeComment);
    } catch(e) {
      console.log(e);
      res.sendStatus(500);
      return;
    }
  });

  module.exports = router;