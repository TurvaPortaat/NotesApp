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
        
    // Lajittelun valinta
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    // Muistiinpanon valinta
    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setViewMode('read');
    };

    // Muistiinpanon muokkaustila
    const handleEditNote = () => {
        setViewMode('edit');
    };

    // Muistiinpanon tallennus
    const handleSaveNote = () => {
        if (!selectedNote.content.trim()) {
            alert("Note content cannot be empty!") //duh
            return;
        }
        deleteNote(selectedNote.id); // Poistaa vanhan
        addNote(selectedNote.courseId, selectedNote.title, selectedNote.content); // Lisää uuden
        setViewMode("read");
        alert("Note saved!");
    };

    // Takaisin muistiinpanolista näkymään
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