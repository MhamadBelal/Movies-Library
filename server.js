const express = require('express');

const server = express();

const PORT = 3000;

const Data= require('./Movie Data/data.json')

const movie =new Movie(Data.title,Data.poster_path,Data.overview)

function Movie(title,poster_path,overview)
{
        this.title=title
        this.poster_path=poster_path
        this.overview=overview     
}


server.get('/',(req,res)=>{
    res.json(movie)
})


server.get('/favorite',(req,res)=>{
    let str = "Welcome to Favorite Page"
    res.send(str)
})


server.get('*', (req,res)=>{
    res.status(404).send("page not found error")
})


server.use(( req, res) => {
    res.status(500).json({
        status: 500,
        responseText: "Sorry, something went wrong"
      })
    });

server.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}: I'm ready`)
})