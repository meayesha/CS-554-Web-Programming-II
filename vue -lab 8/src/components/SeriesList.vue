<template>
<div v-if="checking">
    <router-link v-if="checking" :to="{name: 'errorPage'}">
     404 Error!!! Resource not found
     </router-link>
     </div>
    <div v-else>
    <nav>
    <router-link :to="{name: 'homePage'}">Homepage</router-link>
    </nav>
    <h1>List of Series </h1>
    <button class="btn" :disabled= "isDisablePrev" v-on:click="previousclick">Previous</button>
    <button class="btn" :disabled= "isDisableNext" v-on:click="nextclick"> Next</button>
        <ul>
      <li v-for="(item,index) in seriesData" :key="index">
        <router-link :to="{name: 'seriesInfo', params: {id: item.id}}">{{item.title}}</router-link>
      </li>
    </ul>
    </div>
</template>

<script>
import axios from "axios"
import {ts, publickey, hash} from '../marvel'

export default{
    name: "SeriesList",
    data(){
        return {
            seriesData:[]
        };
    },
    mounted(){
      this.getCharacterList()
    },
    methods:{
      getCharacterList : function(){
          var currPage = this.$route.params.page;
        axios
      .get('https://gateway.marvel.com:443/v1/public/series'+ '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash+'&limit=20&offset=' + (currPage * 20).toString())
      .then(({ data }) => {
        data.data.results.forEach(element => {
          console.log(element)
          this.seriesData.push(element);
        });
        });
    },
    previousclick :function(){
        var currPage = parseInt(this.$route.params.page);
        currPage = currPage - 1;
        this.seriesData =[];
          axios
      .get('https://gateway.marvel.com:443/v1/public/series'+ '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash+'&limit=20&offset=' + (currPage * 20).toString())
      .then(({ data }) => {
        data.data.results.forEach(element => {
          console.log(element)
          this.seriesData.push(element);
        });
        });
        this.$router.replace({path: `/series/page/${currPage}`});
    },
     nextclick : function(){
        var currPage = parseInt(this.$route.params.page);
        currPage = currPage + 1;
        this.seriesData =[];
          axios
      .get('https://gateway.marvel.com:443/v1/public/series'+ '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash+'&limit=20&offset=' + (currPage * 20).toString())
      .then(({ data }) => {
        data.data.results.forEach(element => {
          console.log(element)
          this.seriesData.push(element);
        });
        });
        this.$router.replace({path: `/series/page/${currPage}`});
    }

    },
    computed: {
    isDisableNext: function(){
       var currPage = parseInt(this.$route.params.page);
       var total = 12251
       if(((currPage +1)*20) >total)
       {
         return true;
       }
       else
       {
         return false;
       }
    },
    isDisablePrev: function(){
       var currPage = parseInt(this.$route.params.page);
        
       if(currPage == 0)
       {
         return true;
       }
       else
       {
         return false;
       }
    },

    checking: function(){
        var page = parseInt(this.$route.params.page);
        var total = 12251

        if(page<0 || page*20 > total)
        {
        return true;
        }
        else
        {
            return false;
        }
    }

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