<template>
<div>
<nav>
<ul>
  <li> <router-link :to="{name: 'characterList', params: {page: 0}}">Characters</router-link></li>
  <li> <router-link :to="{name: 'seriesList', params: {page: 0}}">Series</router-link></li>
  <li>  <router-link :to="{name: 'comicsList', params: {page: 0}}">Comics</router-link></li>
  </ul>
</nav>
<h1>HomePage </h1>
 <p>Welcome to the Marvel API... All the Marvel data you'll ever need in one place! Get details about the characters and comics along with the series!!!.</p>
        </div>
</template>

<script>

export default{
    name: "homePage"
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