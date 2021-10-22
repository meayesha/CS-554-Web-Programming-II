import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pagination=({ previousClick, nextClick, pageNumber}) =>{
    // const[prevDisable, setPrevDisabled]= useState(true);
    // const[nextDisable, setNextDisabled]= useState(true);
    return (
        <div>
        <button  onClick={() =>{previousClick(pageNumber); window.location=`/shows/page/${pageNumber-1}`}}>Previous</button>
         <button  onClick={() =>{ nextClick(pageNumber); window.location=`/shows/page/${pageNumber+1}`}}>Next</button>
        </div>
    )
}

export default Pagination;