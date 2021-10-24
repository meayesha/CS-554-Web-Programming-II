import React from 'react'
import './App.css';
import CharacterPage from './components/CharactersPage';
import SeriesPage from './components/SeriesPage';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ComicsPage from './components/ComicsPage';
import CharacterInfo from './components/CharacterInfo';
import HomePage from './components/Homepage';
import SeriesInfo from './components/SeriesInfo';
import ComicsInfo from './components/ComicsInfo';
import ErrorPage from './components/ErrorPage';

function App(){
  return (
    <Router>
      <div className="App">
        <div className="App-header">
          <Link className="showLink" to= "/characters/page/0">Characters</Link>
          <Link className="showLink" to= "/series/page/0">Series</Link>
          <Link className="showLink" to= "/comics/page/0">Comics</Link>
        </div>
        <div className="App-body">
          <Switch>
        <Route exact path="/"  component={HomePage}  />
        <Route exact path='/characters/page/:page' component={CharacterPage} />
        <Route exact path='/series/page/:page' component={SeriesPage} />
        <Route exact path='/comics/page/:page' component={ComicsPage} />
        <Route exact path='/characters/:id' component={CharacterInfo} />
        <Route exact path='/series/:id' component={SeriesInfo} />
        <Route exact path='/comics/:id' component={ComicsInfo} />
        <Route exact path='*'  component={ErrorPage} status={404} />
        </Switch>
        
        </div>
      </div>
    </Router>
  );
}
export default App;
