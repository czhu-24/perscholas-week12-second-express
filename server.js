const express = require("express");

const app = express();

const movies = [ { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 }, { id: 2, title: "Interstellar", director: "Christopher Nolan", year: 2014 }, { id: 3, title: "Parasite", director: "Bong Joon-ho", year: 2019 }, { id: 4, title: "The Matrix", director: "The Wachowskis", year: 1999 } ];

app.get("/", (req, res) => {
	res.send("Welcome to the Movie API! Use /info for guidance.");
})

app.get("/info", (req, res) => {
	res.send("To fetch all movies, use GET /movies. To add a new movie, use POST /movies. To update or delete a movie, use PUT or DELETE on /movies/:id respectively");
})

app.get("/movies", (req, res) => {
	res.send(movies);
})

app.get("/movies/:id", (req, res) => {
	// Tried to use try-catch here, but trying a id that doesn't exist doesn't cause an error. it's still 200 status
	if(movies.find((movie) => movie.id == req.params.id)){
		const foundMovie = movies.filter((movie) => movie.id == req.params.id);
		res.send(foundMovie);
	}else{
		res.send("No movie at this id");
	}
})

app.delete("/movies/:id", (req, res) => {
	if(movies.find((movie) => movie.id == req.params.id)){
		const id = req.params.id;
		const index = movies.findIndex((movie) => (movie.id == id));
		movies.splice(index, 1);
		res.send("Movie deleted!");
	}else{
		res.send("No movie to be deleted at this id");
	}
})

// movie search
app.get("/search", (req, res) => {
	const title = req.query.title.toLowerCase();
	const foundMovies = movies.filter((movie) => movie.title.toLowerCase().includes(title));
	if(foundMovies.length != 0){
		res.send(foundMovies);
	}else{
		res.send("No movies by that title, try again!");
	}
})

// TODO: post

// TODO put

app.listen(3000, () => {
	console.log("server started at port 3000");
})