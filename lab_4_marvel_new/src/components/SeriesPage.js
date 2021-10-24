import React,{useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'
import axios from 'axios';
import ErrorPage from './ErrorPage'
import Page from './Page'

const SeriesPage = (props) =>{
    const [series, setSeries] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [ getPage, setGetPage ] = useState(0);
    let col = null;
    let page = null;
    let currPage = null;
    const md5 = require('blueimp-md5');
    const publickey = 'b3f3ae85c881c6196c303b96f1678274';
    const privatekey = 'b82cf5047defc8b4ca20fd4bd5338432c0fe5739';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);

    useEffect(()=>{
        console.log("enter useEffect");
        currPage = Number(props.match.params.page);
        async function fetchData() {
            try {
              await fetch('https://gateway.marvel.com:443/v1/public/series'+ '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash+'&limit=20&offset=' + (currPage * 20))
            .then(response => response.json())
            .then(data => setSeries(data)) 
                            setLoading(false);
                            console.log(series); 
                    }catch(e){
                        
                console.log(e);
            }
        }
        
        fetchData();
    },[getPage]);
    if(loading){
        return(
            <div>
                <h2>Loading .....</h2>
            </div>
        )
    }
    let seriesData =(<div>
        {series && series.data.results.map((item, index)=>{
            return (
                <div className="pagecontainer">
                    <a className="pagecontent" href={`/series/${item.id}`}>{item.title}</a>
                    </div>
            )
        })}
    </div>)

const pageNum = (bool) => {
    page = series.data.offset ;
   if (bool) {
       page ++;
       setGetPage(page);
   } else {
       page --;
       setGetPage(page);
   };
};
if (series && series.data.offset <= Math.floor(series.data.total)) {
    page = <Page pageNum = {[pageNum, series.data.offset/20, series.data.offset/20, 'series']} />
} else {
    page = null;
    return(
        <ErrorPage/>
    )
}

return (
    <div className="container mt-5">
            <h1 className="text-primary mb-3">Series Names</h1>
            {seriesData}
    <Container>
        <br />
        <br />
        <Row className = 'page' sm = {3} md = {3} lg = {5}>
            {col} 
        </Row>
        <br />
        <Row className = 'page'> 
            {page}
        </Row>
    </Container>
    </div>
);

};


export default SeriesPage;