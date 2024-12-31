import React from 'react';
//import { useState } from 'react'; jos vaa routtaa ne :D
import {Routes, Route, Link} from 'react-router-dom';
import WriteNotes from './writeNotes.jsx';
import CourseView from './courseView.jsx';
import NotesView from './notesView.jsx';
import '../styles/App.css';

function App() {
  //const [view, setview] = useState('home'); Tosiaan vähä testailin :D

  return (
    <div className="app-container">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/writeNotes' element={<WriteNotes onBack={() => setView('home')}/>}/>
          <Route path='/courseView' element={<CourseView onBack={() => setView('home')}/>}/>
          <Route path='/readNotes' element={<NotesView onBack={() => setView('home')}/>}/>
        </Routes>
    </div>
  );
}

//Etusivu :)

function Home() {
  return(
    <div>
      <h1>Welcome to Notes!</h1>
      <p>This is where you can write, read and organize all your notes</p>
      <nav>
        <Link to="/writeNotes">
          <button> Create a new note </button>
        </Link>
        <Link to="/courseView">
          <button> Organize your notes </button>
        </Link>
        <Link to="/readNotes">
          <button> Read your notes </button>
        </Link>
      </nav>
    </div>
  )
}

export default App;
