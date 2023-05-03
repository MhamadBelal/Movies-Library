const express = require('express');
const cors = require('cors');

const server = express();
require('dotenv').config();

server.use(cors())
const PORT = 3000;
const axios = require('axios');
const Data = require('./movieData/data.json')
const apiKey = process.env.APIKey;
const moveName='Shark Side of the Moon'

server.get('/', HomeHandeler)
server.get('/favorite',favoriteHandeler)
server.get('/trending', trendingHandeler)
server.get('/search', searchHandeler)
server.get('/credits',creditsHandeler)
server.get('/popular',popularHandeler)
server.get('*',pageNotFoundHanderler)
server.use(errorHandler)

function HomeHandeler(req,res)
{
    let movie = new Movie(Data.title, Data.poster_path, Data.overview)
    res.json(movie)
}

function favoriteHandeler(req,res)
{
    let str = "Welcome to Favorite Page"
    res.send(str)
}

function pageNotFoundHanderler(req,res)
{
    res.status(404).send("page not found error")
}


function trendingHandeler(req, res) {
    
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;

    try{
        axios.get(url)
        .then(result => {
            let mapResult = result.data.results.map(item => {
                let trendingMovie = new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview)
                return trendingMovie;
            })
            res.send(mapResult)
        })
        .catch((error) => {
            console.log('sorry you have something error', error)
            res.status(500).send(error);
        })
    }
    catch(error){
        errorHandler(error,req,res)
    }
    
}

function searchHandeler(req,res)
{
    const url=`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=The&page=2`

    try{
        axios.get(url)
        .then(result => {
            let mapResult = result.data.results.filter(i => i.title==moveName).map(item=> {
                let trendingMovie = new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview)
                return trendingMovie;
            })
            res.send(mapResult)
        })
        .catch((error) => {
            console.log('sorry you have something error', error)
            res.status(500).send(error);
        })
    }
    catch(error){
        errorHandler(error,req,res)
    }
}


function creditsHandeler(req,res)
{
    const url=`https://api.themoviedb.org/3/movie/634649/credits?api_key=${apiKey}&language=en-US`
    try{
        axios.get(url)
        .then(result => {
            let mapResult = result.data.cast.map(item => {
                let trendingMovie = new Trending(item.id, item.name, item.original_name, item.character, item.popularity)
                return trendingMovie;
            })
            res.send(mapResult)
        })
        .catch((error) => {
            console.log('sorry you have something error', error)
            res.status(500).send(error);
        })
    }
    catch(error){
        errorHandler(error,req,res)
    }
}


function popularHandeler(req,res)
{
    const url= `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`

    try{
        axios.get(url)
        .then(result => {
            let mapResult = result.data.results.map(item => {
                let trendingMovie = new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview)
                return trendingMovie;
            })
            res.send(mapResult)
        })
        .catch((error) => {
            console.log('sorry you have something error', error)
            res.status(500).send(error);
        })
    }
    catch(error){
        errorHandler(error,req,res)
    }
}


function errorHandler(error,req, res)  {
    res.status(500).json({
        status: 500,
        responseText: "Sorry, something went wrong"
    })
}






function Movie(title, poster_path, overview) {
    this.title = title
    this.poster_path = poster_path
    this.overview = overview
}


function Trending(id, title, release_date, poster_path, overview) {
    this.id = id
    this.title = title
    this.release_date = release_date
    this.poster_path = poster_path
    this.overview = overview
}

function Trending(id, name, original_name, character, popularity) {
    this.id = id
    this.name = name
    this.original_name = original_name
    this.character = character
    this.popularity = popularity
}



server.listen(PORT, () => {
    console.log(`Listening on ${PORT}: I'm ready`)
})