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
const CharacterInfo = (props) => {
    const md5 = require('blueimp-md5');
    const publickey = 'b3f3ae85c881c6196c303b96f1678274';
    const privatekey = 'b82cf5047defc8b4ca20fd4bd5338432c0fe5739';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const [characterId, setCharacterId] = useState(undefined);
    const [characterInfo, setCharacterInfo] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {

            setCharacterId(parseInt(props.match.params.id));
            async function fetchData() {
                try {
                    const { data } = await axios.get(`https://gateway.marvel.com:443/v1/public/characters/${props.match.params.id}` + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash);
                    setCharacterInfo(data);
                    setLoading(false);
                    console.log('param is' + characterId);
                    console.log(data);
                } catch (e) {
                    console.log(e);
                }

            }
            fetchData();
        }, [props.match.params.id]
    );

    let characterData =(
        
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="span">
            <dl>
    <div>
        {characterInfo && characterInfo.data.results.map((character, index)=>{
            return (
                <div>
                <p>id: {character.id}</p>
                <p>name: {character.name}</p>
                <p>description: {character.description}</p>
                <p>modified: {character.modified}</p>
                <p>
                    <dt className="thumbnail">Thumbnail</dt>
                    <a>
                    <dd> path: {character.thumbnail.path}</dd> 
                    <dd> extension: {character.thumbnail.extension}</dd>
                    </a>
                </p>
                <p>resourceURI: {character.resourceURI}</p>
                <p><dt className="comics">Comics</dt>
                <a>
                    <dd> available: {character.comics.available}</dd>
                    <dd> collectionURI: {character.comics.collectionURI}</dd>
                    </a>
                    {character.comics.items.map((item , index)=>{
                        return(
                       <a> 
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {character.comics.returned}</dd>
                    </p>
                <p><dt className="series">Series</dt>
                <a>
                    <dd> available: {character.series.available}</dd>
                    <dd> collectionURI: {character.series.collectionURI}</dd>
                    </a>
                    {character.series.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {character.series.returned}</dd></p>
                <p><dt className="stories">Stories</dt>
                    <dd> available: {character.stories.available}</dd>
                    <dd> collectionURI: {character.stories.collectionURI}</dd>
                    
                    {character.stories.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        <dd>type: {item.type}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {character.stories.returned}</dd></p>
                <p><dt className="events">Events</dt>
                <a>
                    <dd> available: {character.events.available}</dd>
                    <dd> collectionURI: {character.events.collectionURI}</dd>
                    </a>
                    {character.events.items.map((item , index)=>{
                        return(
                        <a>
                        <dd>resourceURI: {item.resourceURI}</dd>
                        <dd>name: {item.name}</dd>
                        </a>
                        )})}
                        
                        <dd>returned: {character.stories.returned}</dd>
                        </p>
                <p><dt className="urls">URLS</dt>
                
                    {character.urls.map((item , index)=>{
                        return(
                        <a>
                        <dd>type: {item.type}</dd>
                        <dd>url: {item.url}</dd>
                        </a>
                        )})}
                        
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
                <div>
                    {characterData}
                </div>
            )
        }
    }
    
    export default CharacterInfo;
