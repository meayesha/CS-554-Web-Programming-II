<template>
    <div>
    <nav>
    <router-link :to="{name: 'homePage'}">Homepage</router-link>
    </nav>
       <h1>Comics Information </h1>
       <ul>
           <li v-for="(item,index) in comics" :key="index">
               <p>id: {{item.id}}</p>
                <p>title: {{item.title}}</p>
                <p>issueNumber: {{item.issueNumber}}</p>
                <p>description: {{item.description}}</p>
             <p>modified: {{item.modified}}</p>
                <p>resourceURI: {{item.resourceURI}}</p>
                <p>upc: {{item.upc}}</p>
                 <p>pageCount: {{item.pageCount}}</p>
           </li>
       </ul>
        
    
    </div>
</template>
 
<script>
import axios from "axios"
import {ts, publickey, hash} from '../marvel'
export default {
   name: "ComicsInfo",
   data(){
        return {
            comics : []
        };
    },
    mounted(){
      this.getComicsInfo()
    },
    methods: {
    getComicsInfo: function() {
        var id= this.$route.params.id;
      axios
        .get('https://gateway.marvel.com:443/v1/public/comics/' +id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash)
        .then(({ data }) => {
        data.data.results.forEach(element => {
          console.log(element)
          this.comics.push(element);
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