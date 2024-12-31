import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../data/dataContext";

function NotesView()
{
    const {notes, courses, addNote, deleteNote} = useContext(DataContext);
    const navigate = useNavigate();
    const [selectedNote, setSelectedNote] = useState(null);
    const [viewMode, setViewMode] = useState("read");
    const [sortOption, setSortOption] = useState("date-descending") //default mode missä kurssien listaus näkyy

    //Lajittelufunkkari
    const sortedNotes = [...notes].sort((a, b) => {
        switch (sortOption) {
            case "date-ascending":
                return new Date(a.date) - new Date(b.date);
            case " date-descending":
                return new Date(b.date) - new Date(a.date);
            case "course":
                const courseA = courses.find((course)=> course.id === a.courseId)?.name || "";
                const courseB = courses.find((course)=> course.id === b.courseId)?.name || "";
                return courseA.localeCompare(courseB);
            case "last-modified":
                return b.id - a.id; //oletus uusin ensin
            default:
                return 0;
        }
    });
        
    //Lajittelun käsittelyä

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setViewMode('read');
    };

    const handleEditNote = () => {
        setViewMode('edit');
    };

    const handleSaveNote = () => {
        setNotes((prevNotes) =>
            prevNotes.map((note)=>
                note.id === selectedNote.id ? selectedNote : note)
    );
        setViewMode('read');
        alert('Note saved!');
    };

    const handleBackToList = () => {
        setSelectedNote(null);
        setViewMode('read')
    }

    return (
        <div className="notesViewContainer">
            {!selectedNote ? ( 
                <>
                    <h2>View notes</h2>
                    <label> Sort by: </label>
                    <select 
                    value={sortOption} 
                    onChange={handleSortChange}>
                        <option value="date-descending"> Date (Newest first) </option>
                        <option value="date-ascending"> Date (Oldest first) </option>
                        <option value="course"> Course (A-Z) </option>
                        <option calue="last-modified"> Last Modified </option>
                    </select>


                    <ul>
                        {notes.map((note) => (
                            <li key={note.id} onClick={() => handleSelectNote(note)}>
                               <strong>{note.title}</strong> ({note.date}) - {note.content.substring(0, 20)}...
                               <button onClick={() => handleSelectNote(note)}> Open </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={(() => navigate('/'))}> Back </button>
                </>
            ) : (
                <div>
                    <h2>{selectedNote.title}</h2>
                    <p>Date: {selectedNote.date}</p>
                    {viewMode === 'read' ?(
                        <>
                        <p>{selectedNote.content}</p>
                        <button onClick={handleEditNote}> Edit </button>
                        </>
                    ): (
                        <>
                        <textarea value={selectedNote.content}
                        onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})}
                        />
                        <button onClick={handleSaveNote}> Save </button>
                        </>
                    )}
                    <button onClick={handleBackToList}> Back to list </button>
                </div>
            )}
        </div>
    );
}

export default NotesView;