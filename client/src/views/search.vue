<template>
    <div class="container">
    <div class="innerContainer">
        <h2 style="font-size: 18px;">Search results</h2>
        <div class="results">    
            <div class="result" @click="setVideo(searchResults[index])" v-for="(object,index) in searchResults" v-bind:key="index">
                <img class="image" v-bind:src="searchResults[index].snippet.thumbnails.default.url">
                <button class="nBtn">{{ index+1 }}</button>
                <button v-on:click.stop @click="addToList(searchResults[index])" class="oBtn">+</button>
                <p class="title">{{ searchResults[index].snippet.title }}</p>
            </div>
            <button v-if="searchResults.length > 0" id="loadBtn" @click="loadMore">Load more</button>
        </div>
    </div>
    </div>
</template>

<script>
import searchYoutube from 'youtube-api-v3-search';
//import axios from 'axios';
import { mapMutations, mapState } from 'vuex';

export default {
    name: "search",
    components: {
        
    },
    data() {
        return {
            searchTerm: "",
            searchResults: [],
            nextPage: "",
            apiKey: "",
            demo : Boolean
        }
    },
    methods: {
        init: async function() {
            if(this.$cookie.get('public_key') == "true") {
                    this.apiKey = process.env.VUE_APP_APIKEY;
            } else {
                if(this.$cookie.get('api_key') && this.$cookie.get('api_key')!="") {
                    this.apiKey = this.$cookie.get('api_key');
                } else {
                    alert("You need to setup YouTube API key from the settings!");
                }
            }
            if(this.$cookie.get('loggedin')) {
                this.demo = false;
            } else {
                this.demo = true;
            }
            this.searchTerm = this.$route.query.q;
            if(this.searchTerm != "") {
                this.search();
            }
        },
        search: async function() {
            var options = {
                q:this.searchTerm,
                part:'snippet',
                type:'video',
                topicId:'/m/04rlf',
                maxResults: 10,
                pageToken: ''
            }
            var results = await searchYoutube(this.apiKey, options);
            this.searchResults = results.items;
            this.nextPage = results.nextPageToken;
            console.log(results.items);
        },
        loadMore: async function() {
            var options = {
                q:this.searchTerm,
                part:'snippet',
                type:'video',
                topicId:'/m/04rlf',
                maxResults: 10,
                pageToken: this.nextPage
            }
            var results = await searchYoutube(this.apiKey, options);
            this.searchResults = this.searchResults.concat(results.items);
            this.nextPage = results.nextPageToken;
        },
        setVideo: function(video) {
            if(this.shuffle) {
                this.CLEAR_VIDEO();
                this.SET_SHUFFLE(false);
            }
            this.SET_LIST("");
            this.SET_VIDEO(video);
        },
        addToList: function(video) {
            this.LIST_ADDER(video);
        },
        ...mapMutations([
            'SET_VIDEO',
            'SET_LIST',
            'CLEAR_VIDEO',
            'SET_SHUFFLE',
            'LIST_ADDER'
        ])
    },
    computed: {
        ...mapState([
            'shuffle'
        ])
    },
    mounted() {
        this.init();
    },
    watch: {
        $route() {
            this.init();
        }
    }
}
</script>

<style scoped>
.container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    margin-top: 55px;
    margin-bottom: 90px;
}
.innerContainer {
    margin-left: 10vw;
    margin-right: 10vw;
}
#loadBtn {
    background-color: rgb(168, 61, 61);
    border: none;
    color: white;
    cursor: pointer;
    display: block;
    margin: 20px auto 20px auto;
    padding: 10px 30px 10px 30px;
    border-radius: 20px;
    font-size: 15px;
}
.results {
    
}
.result {
    background-color: rgb(30, 30, 30);
    margin: 5px auto 5px auto;
    height: 50px;
    width: 100%;
    display: flex;
    border-radius: 5px;
    align-items: center;
    cursor: pointer;
}
.result:hover {
    background-color: rgb(27, 27, 27);
}
.image {
    height: 100%;
    border-radius: 5px 0 0 5px;
}
.title {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px 0 0px;
}
.nBtn {
    background-color: rgb(30, 30, 30);
    border: none;
    color: rgb(196, 196, 196);
    height: 100%;
    min-width: 40px;
    font-size: 13px;
}
.result:hover .nBtn {
    display: none;
}
.result:hover .oBtn {
    display: block;
}
.oBtn {
    background-color: rgb(27, 27, 27);
    border: none;
    color: rgb(196, 196, 196);
    height: 100%;
    min-width: 40px;
    font-size: 18px;
    cursor: pointer;
    display: none;
}
.oBtn:hover {
    color: white;
}
</style>