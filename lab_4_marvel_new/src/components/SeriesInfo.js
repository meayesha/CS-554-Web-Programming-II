import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    makeStyles,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardHeader
  } from '@material-ui/core';
  import '../App.css';
  const useStyles = makeStyles({
    card: {
      maxWidth: 550,
      height: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 5,
      border: '1px solid #1e8678',
      boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
      borderBottom: '1px solid #1e8678',
      fontWeight: 'bold'
    },
    grid: {
      flexGrow: 1,
      flexDirection: 'row'
    },
    media: {
      height: '100%',
      width: '100%'
    },
    button: {
      color: '#1e8678',
      fontWeight: 'bold',
      fontSize: 12
    }
  });
const SeriesInfo = (props) => {
    const md5 = require('blueimp-md5');
    const publickey = 'b3f3ae85c881c6196c303b96f1678274';
    const privatekey = 'b82cf5047defc8b4ca20fd4bd5338432c0fe5739';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const [seriesId, setSeriesId] = useState(undefined);
    const [seriesInfo, setSeriesInfo] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {

            setSeriesId(parseInt(props.match.params.id));
            async function fetchData() {
                try {
                    const { data } = await axios.get(`https://gateway.marvel.com:443/v1/public/series/${props.match.params.id}` + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash);
                    setSeriesInfo(data);
                    setLoading(false);
                    console.log('param is' + seriesId);
                    console.log(data);
                } catch (e) {
                    console.log(e);
                }

            }
            fetchData();
        }, [props.match.params.id]
    );

    let seriesData =(
        
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="span">
            <dl>
    <div>
        {seriesInfo && seriesInfo.data.results.map((seriesdata, index)=>{
            return (
                <div>
                <p>id: {seriesdata.id}</p>
                <p>title: {seriesdata.title}</p>
                <p>description: {seriesdata.description}</p>
                <p>resourceURI: {seriesdata.resourceURI}</p>
                <p><dt className="urls">URLS</dt>
                
                    {seriesdata.urls.map((item , index)=>{
                        return(
                        <a>
                        <dd>type: {item.type}</dd>
                        <dd>url: {item.url}</dd>
                        </a>
                        )})}
                        
                </p>
                <p>startYear: {seriesdata.startYear}</p>
                <p>endYear: {seriesdata.endYear}</p>
                <p>rating: {seriesdata.rating}</p>
                <p>type: {seriesdata.type}</p>
                <p>modified: {seriesdata.modified}</p>
                <p>
                    <dt className="thumbnail">Thumbnail</dt>
                    <a>
                    <dd> path: {seriesdata.thumbnail.path}</dd>
                    <dd> extension: {seriesdata.thumbnail.extension}</dd>
                    </a>
                </p>
                <p><dt className="creators">Creators</dt>
                <a>
                    <dd> available: {seriesdata.creators.available}</dd>
                    <dd> collectionURI: {seriesdata.creators.collectionURI}</dd>
                    </a>
                    {seriesdata.creators.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        <dd>role: {item.role}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {seriesdata.creators.returned}</dd></p>
                <p><dt className="characters">Characters</dt>
                    <dd> available: {seriesdata.characters.available}</dd>
                    <dd> collectionURI: {seriesdata.characters.collectionURI}</dd>
                    
                    {/* {comic.stories.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        <dd>type: {item.type}</dd>
                        </a>
                        )})} */}
                        
                        <dd>returned: {seriesdata.characters.returned}</dd></p>
                    <p><dt className="stories">Stories</dt>
                    <dd> available: {seriesdata.stories.available}</dd>
                    <dd> collectionURI: {seriesdata.stories.collectionURI}</dd>
                    
                    {seriesdata.stories.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        <dd>type: {item.type}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {seriesdata.characters.returned}</dd></p>
                        <p><dt className="comics">Comics</dt>
                    <dd> available: {seriesdata.comics.available}</dd>
                    <dd> collectionURI: {seriesdata.comics.collectionURI}</dd>
                    
                    {seriesdata.comics.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {seriesdata.comics.returned}</dd></p>
                <p><dt className="events">Events</dt>
                <a>
                    <dd> available: {seriesdata.events.available}</dd>
                    <dd> collectionURI: {seriesdata.events.collectionURI}</dd>
                    </a>
                    {/* {comic.events.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        </a>
                        )})} */}
                        
                        <dd>returned: {seriesdata.stories.returned}</dd>
                        </p>
                
                 </div>
            )
        })}
        </div>
        </dl>
        </Typography>
        </CardContent>
      
        )
        if(loading){
            return(
                <div>
                    <h2>Loading .....</h2>
                </div>
            )
        }
        else{
            return(
                <Card>
                <div>
                    {seriesData}
                </div>
                </Card>
            )
        }
    }
    
    export default SeriesInfo;
