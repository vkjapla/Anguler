import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

const App = () => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    axios.get('https://swapi.dev/api/films/')
      .then(response => setFilms(response.data.results))
      .catch(error => console.error('Error fetching films:', error));
  }, []);

  return (
    <Router>
      <div>
        <h1>Star Wars Films</h1>
        <Switch>
          <Route exact path="/">
            <FilmList films={films} />
          </Route>
          <Route path="/film/:id">
            <FilmDetails />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

const FilmList = ({ films }) => {
  return (
    <ul>
      {films.map(film => (
        <li key={film.episode_id}>
          <Link to={`/film/${film.episode_id}`}>
            {film.title} ({film.release_date})
          </Link>
        </li>
      ))}
    </ul>
  );
};

const FilmDetails = () => {
  const [film, setFilm] = useState(null);

  useEffect(() => {
    const filmId = window.location.pathname.split('/').pop();
    axios.get(`https://swapi.dev/api/films/${filmId}/`)
      .then(response => setFilm(response.data))
      .catch(error => console.error('Error fetching film details:', error));
  }, []);

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{film.title}</h2>
      <p>Director: {film.director}</p>
      <p>Producer: {film.producer}</p>
      <p>Release Date: {film.release_date}</p>
      <h3>Characters</h3>
      <ul>
        {film.characters.map(characterUrl => (
          <CharacterDetails key={characterUrl} characterUrl={characterUrl} />
        ))}
      </ul>
    </div>
  );
};

const CharacterDetails = ({ characterUrl }) => {
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    axios.get(characterUrl)
      .then(response => setCharacter(response.data))
      .catch(error => console.error('Error fetching character details:', error));
  }, [characterUrl]);

  if (!character) {
    return <li>Loading character details...</li>;
  }

  return (
    <li>{character.name} (Actor: {character.birth_year})</li>
  );
};

export default App;
