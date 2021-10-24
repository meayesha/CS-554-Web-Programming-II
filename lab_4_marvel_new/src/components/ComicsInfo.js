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
const ComicsInfo = (props) => {
    const md5 = require('blueimp-md5');
    const publickey = 'b3f3ae85c881c6196c303b96f1678274';
    const privatekey = 'b82cf5047defc8b4ca20fd4bd5338432c0fe5739';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const [comicsId, setComicsId] = useState(undefined);
    const [comicsInfo, setComicsInfo] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {

            setComicsId(parseInt(props.match.params.id));
            async function fetchData() {
                try {
                    const { data } = await axios.get(`https://gateway.marvel.com:443/v1/public/comics/${props.match.params.id}` + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash);
                    setComicsInfo(data);
                    setLoading(false);
                    console.log('param is' + comicsId);
                    console.log(data);
                } catch (e) {
                    console.log(e);
                }

            }
            fetchData();
        }, [props.match.params.id]
    );

    let comicsData =(
        
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="span">
            <dl>
    <div>
        {comicsInfo && comicsInfo.data.results.map((comicdata, index)=>{
            return (
                <div>
                <p>id: {comicdata.id}</p>
                <p>digitalid: {comicdata.digitalId}</p>
                <p>title: {comicdata.title}</p>
                <p>issueNumber: {comicdata.issueNumber}</p>
                <p>variantDescription: {comicdata.variantDescription}</p>
                <p>description: {comicdata.description}</p>
                <p>modified: {comicdata.modified}</p>
                <p>isbn: {comicdata.isbn}</p>
                <p>upc: {comicdata.upc}</p>
                <p>diamondCode: {comicdata.diamondCode}</p>
                <p>ean: {comicdata.ean}</p>
                <p>format: {comicdata.format}</p>
                <p>pageCount: {comicdata.pageCount}</p>
                <p>resourceURI: {comicdata.resourceURI}</p>
                <p><dt className="urls">URLS</dt>
                
                    {comicdata.urls.map((item , index)=>{
                        return(
                        <a>
                        <dd>type: {item.type}</dd>
                        <dd>url: {item.url}</dd>
                        </a>
                        )})}
                        
                </p>
                <p> <dt className="series">Series</dt>
                    <a>
                    <dd> resourceURI: {comicdata.series.resourceURI}</dd>
                    <dd> name: {comicdata.series.name}</dd>
                    </a>
                        
                </p>
                <p><dt className="variants">Variants</dt>
                
                    {comicdata.variants.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        </a>
                        )})}
                        
                </p>
                <p><dt className="dates">Dates</dt>
                
                    {comicdata.dates.map((item , index)=>{
                        return(
                        <a>
                        <dd>type: {item.type}</dd>
                        <dd>date: {item.date}</dd>
                        </a>
                        )})}
                        
                </p>
                <p><dt className="prices">Prices</dt>
                
                {comicdata.prices.map((item , index)=>{
                    return(
                    <a>
                    <dd>type: {item.type}</dd>
                    <dd>price: {item.price}</dd>
                    </a>
                    )})}
                    
            </p>
            <p>
                    <dt className="thumbnail">Thumbnail</dt>
                    <a>
                    <dd> path: {comicdata.thumbnail.path}</dd>
                    <dd> extension: {comicdata.thumbnail.extension}</dd>
                    </a>
                </p>
                <p><dt className="creators">Creators</dt>
                <a>
                    <dd> available: {comicdata.creators.available}</dd>
                    <dd> collectionURI: {comicdata.creators.collectionURI}</dd>
                    </a>
                    {comicdata.creators.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        <dd>role: {item.role}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {comicdata.creators.returned}</dd></p>
                <p><dt className="characters">Characters</dt>
                    <dd> available: {comicdata.characters.available}</dd>
                    <dd> collectionURI: {comicdata.characters.collectionURI}</dd>
                    
                    {/* {comic.stories.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        <dd>type: {item.type}</dd>
                        </a>
                        )})} */}
                        
                        <dd>returned: {comicdata.characters.returned}</dd></p>
                    <p><dt className="stories">Stories</dt>
                    <dd> available: {comicdata.stories.available}</dd>
                    <dd> collectionURI: {comicdata.stories.collectionURI}</dd>
                    
                    {comicdata.stories.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        <dd>type: {item.type}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {comicdata.characters.returned}</dd></p>
                <p><dt className="events">Events</dt>
                <a>
                    <dd> available: {comicdata.events.available}</dd>
                    <dd> collectionURI: {comicdata.events.collectionURI}</dd>
                    </a>
                    {/* {comic.events.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        </a>
                        )})} */}
                        
                        <dd>returned: {comicdata.stories.returned}</dd>
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
                    {comicsData}
                </div>
                </Card>
            )
        }
    }
    
    export default ComicsInfo;
