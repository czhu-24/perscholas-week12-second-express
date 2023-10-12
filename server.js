// TYPE CHECKS?
// BEST WAY OF ERROR HANDLING?
// WHAT IF REQ PARAM ID DOESN'T MATCH THAT OF REQ BODY?
	// i mean you could just do bad request for that. it's nonsensical, right?

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
	// Tried to use try-catch here, but getting a movie with id that doesn't exist doesn't cause an error. it's still 200 status
	const id = req.params.id;
	// movie is the matching movie object or undefined
	const movie = movies.find((movie) => movie.id == id);
	if(movies.find((movie) => movie.id == req.params.id)){
		const foundMovie = movies.filter((movie) => movie.id == req.params.id);
		res.send(foundMovie);
	}else{
		// 404: NOT FOUND
		res.status(404).send("No movie at this id");
	}
})

app.delete("/movies/:id", (req, res) => {
	const id = req.params.id;
	const movie = movies.find((movie) => movie.id == id);
	if(movie){
		const id = req.params.id;
		const index = movies.findIndex((movie) => (movie.id == id));
		movies.splice(index, 1);
		res.send("Movie deleted!");
	}else{
		res.status(404).send("No movie to be deleted at this id");
	}
})

// movie search
app.get("/search", (req, res) => {
	const title = req.query.title.toLowerCase();
	const foundMovies = movies.filter((movie) => movie.title.toLowerCase().includes(title));

	if(foundMovies.length != 0){
		res.send(foundMovies);
	}else{
		res.status(404).send("No movies by that title, try again!");
	}
})

// post
// additional line, not sure exactly what this does...
app.use(express.json());

app.post("/movies", (req, res) => {
	// TODO: probably should do type checks
	const newMovie = req.body;
	const newId = newMovie.id;
	// either an object or undefined
	const existingMovie = movies.find((movie) => movie.id == newId);
	// check to see if newMovie has keys we expect / isn't malformed
	const movieCheck = newMovie.id && newMovie.title && newMovie.director && newMovie.year;
	if (existingMovie) { // movie at that id already exists
		if (movieCheck) { // check req body
		  res.status(400).send("Can't add new movie. Object with this id already exists.");
		} else {
		  res.status(400).send("Can't add new movie. Object with this id already exists. Request body is also malformed.");
		}
	} else {
		if (movieCheck) {
		  movies.push(newMovie);
		  res.send("New movie added!");
		} else {
		  res.status(400).send("Your request body is malformed.");
		}
	}
})

// put
// QUESTION: what if the req's param id doesn't match the id in the req body?

app.put("/movies/:id", (req, res) => {
	const id = req.params.id;
	const newMovie = req.body;
	const movieCheck = newMovie.id && newMovie.title && newMovie.director && newMovie.year;
	const index = movies.findIndex((movie) => movie.id == id);

	if(id != newMovie.id){
		res.status(404).send("Your request's param's id doesn't match the id inside your request body. Try again!");
	}else if(index > -1 && movieCheck){
		movies[index] = newMovie;
		res.send("Changed movie successfully!");
	}else if(index > -1 && !movieCheck){
		res.status(400).send("Request body is malformed");
	}else if(index == -1 && movieCheck){
		res.status(404).send("No movie of that id to change");
	}else if(index == -1 && !movieCheck){
		res.status(400).send("No movie of that id to change. Request body also malformed");
	}
})
app.listen(3000, () => {
	console.log("server started at port 3000");
})