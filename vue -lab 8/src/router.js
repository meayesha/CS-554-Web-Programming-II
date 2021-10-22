import Vue from 'vue';
import Router from "vue-router";

import CharacterList from "./components/CharacterList.vue"
import CharacterInfo from "./components/CharacterInfo"
import SeriesInfo from "./components/SeriesInfo"
import SeriesList from "./components/SeriesList"
import ComicsInfo from "./components/ComicsInfo"
import ComicsList from "./components/ComicsList"
import ErrorPage from "./components/ErrorPage"
import HomePage from "./components/HomePage"
Vue.use(Router)

export default new Router ({
    routes:[
        {
            path: '/',
            name: 'homePage',
            component: HomePage
        },
        {
            path: '*',
            name: 'errorPage',
            component: ErrorPage
           
        },
        {
            path: '/characters/page/:page',
            name: 'characterList',
            component: CharacterList
        },
        {
            path: '/characters/:id',
            name: 'characterInfo',
            component: CharacterInfo
        },
        {
            path: '/series/page/:page',
            name: 'seriesList',
            component: SeriesList
        },
        {
            path: '/series/:id',
            name: 'seriesInfo',
            component: SeriesInfo
        },
        {
            path: '/comics/page/:page',
            name: 'comicsList',
            component: ComicsList
        },
        {
            path: '/comics/:id',
            name: 'comicsInfo',
            component: ComicsInfo
        },
    ]
});