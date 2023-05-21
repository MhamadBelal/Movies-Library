const express = require('express');
const cors = require('cors');

const server = express();
require('dotenv').config();
const pg = require('pg');

server.use(cors())
const PORT = process.env.PortNum || 3002;
const axios = require('axios');
const Data = require('./movieData/data.json')
const apiKey = process.env.APIKey;
const moveName='Shark Side of the Moon'

server.use(express.json())
const client = new pg.Client(process.env.DATABASE_URL)

server.get('/', HomeHandeler)
server.get('/favorite',favoriteHandeler)
server.get('/trending', trendingHandeler)
server.get('/search', searchHandeler)
server.get('/credits',creditsHandeler)
server.get('/popular',popularHandeler)
server.get('/getMovies',getMoviesHandeler)
server.post('/addMovie',addMovieHandeler)
server.get('/getMovies/:id',getSpecificMoviesHandeler)
server.put('/updateMovie/:id',updateMovieHandeler)
server.delete('/deleteMovie/:id',deleteMovieHandeler)
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

function getMoviesHandeler(req,res)
{
    const sql=`SELECT * FROM moveDatebase`
    client.query(sql)
    .then(data=>{
        res.send(data.rows);
    })
    .catch(error=>{
        errorHandler(error,req, res)
    })
}



function addMovieHandeler(req,res)
{
    const move = req.body;
    console.log(move);
    const sql = `INSERT INTO moveDatebase (name, popularity, character, original_name,comment)
    VALUES ($1, $2, $3, $4, $5);`
    const values = [move.name , move.popularity, move.character, move.original_name, move.comment]; 
    client.query(sql,values)
    .then(data=>{
        res.send("The data has been added successfully");
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}


function updateMovieHandeler(req,res)
{
    const {id} = req.params;
    const sql = `UPDATE moveDatebase
    SET name = $1, popularity=$2, character=$3, original_name=$4, comment=$5
    WHERE id = ${id};`
    const {name,popularity,character,original_name,comment} = req.body;
    const values = [name,popularity,character,original_name,comment];
    client.query(sql,values).then((data)=>{
        const sql = `SELECT * FROM moveDatebase;`;
            client.query(sql)
                .then(allData => {
                    res.send(allData.rows)
                })
                .catch((error) => {
                    errorHandler(error, req, res)
                })
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}

function deleteMovieHandeler(req,res)
{
    const id = req.params.id;
    const sql = `DELETE FROM moveDatebase WHERE id=${id};`
    client.query(sql)
    .then((data)=>{
        res.status(202).send(data)
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
}


function getSpecificMoviesHandeler(req,res)
{
    const id = req.params.id;
    console.log(id);
    const sql = `Select * FROM moveDatebase WHERE id=${id};`
    client.query(sql)
    .then((data)=>{
        res.send(data.rows)
    })
    .catch((error)=>{
        errorHandler(error,req,res)
    })
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


client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}: I'm ready`)
    })
})