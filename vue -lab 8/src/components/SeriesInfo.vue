<template>
    <div>
    <nav>
    <router-link :to="{name: 'homePage'}">Homepage</router-link>
    </nav>
       <h1>Series Information </h1>
       <ul>
           <li v-for="(item,index) in series" :key="index">
               <p>id: {{item.id}}</p>
                <p>title: {{item.title}}</p>
                <p>description: {{item.description}}</p>
             <p>startYear: {{item.startYear}}</p>
              <p>endYear: {{item.endYear}}</p>
                <p>resourceURI: {{item.resourceURI}}</p>
                 <p>type: {{item.type}}</p>
           </li>
       </ul>
        
    
    </div>
</template>
 
<script>
import axios from "axios"
import {ts, publickey, hash} from '../marvel'
export default {
   name: "SeriesInfo",
   data(){
        return {
            series : []
        };
    },
    mounted(){
      this.getSeriesInfo()
    },
    methods: {
    getSeriesInfo: function() {
        var id= this.$route.params.id;
      axios
        .get('https://gateway.marvel.com:443/v1/public/series/' +id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash)
        .then(({ data }) => {
        data.data.results.forEach(element => {
          console.log(element)
          this.series.push(element);
        })
    }).catch((error) =>{
        console.log(error);
    })
  },
  
}
}
</script>
<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
ul li {
  padding: 20px;
  font-size: 1.3em;
  background-color: #e0edf4;
  border-left: 5px solid #3eb3f6;
  margin-bottom: 2px;
  color: #3e5252;
}
p {
  text-align: center;
  padding: 30px 0;
  color: black;
}
.btn:disabled {
	color: black;
}
</style>