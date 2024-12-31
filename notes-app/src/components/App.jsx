import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import WriteNotes from './writeNotes.jsx';
import CourseView from './courseView.jsx';
import NotesView from './notesView.jsx';
import '../styles/App.css';
import { DataProvider } from '../data/dataContext.jsx';

function App() {
  //const [view, setview] = useState('home'); Tosiaan vähä testailin :D

  return (
    <DataProvider>
      <div className="app-container">
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/writeNotes' element={<WriteNotes />}/>
            <Route path='/courseView' element={<CourseView />}/>
            <Route path='/readNotes' element={<NotesView />}/>
          </Routes>
      </div>
      </DataProvider>
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
