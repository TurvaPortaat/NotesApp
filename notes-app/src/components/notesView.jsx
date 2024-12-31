import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../data/dataContext";

function NotesView()
{
    const {notes, courses, addNote, deleteNote} = useContext(DataContext);
    console.log("Notes data:", notes); //Debugailua

    if (!notes || notes.length === 0) {
        return <p>No notes here!</p> // Ei muistiinpanoja
    }

    const navigate = useNavigate();
    const [selectedNote, setSelectedNote] = useState(null);
    const [viewMode, setViewMode] = useState("read");
    const [sortOption, setSortOption] = useState("date-descending") //default mode missä kurssien listaus näkyy

    //Lajittelufunkkari
    const sortedNotes = [...notes].sort((a, b) => {
        switch (sortOption) {
            case "date-ascending":
                return new Date(a.timestamp) - new Date(b.timestamp);
            case "date-descending":
                return new Date(b.timestamp) - new Date(a.timestamp);
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
        if (!selectedNote.text.trim()) {
            alert("Note content cannot be empty!") //duh
            return;
        }
        const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? {...note, text: selectedNote.content}:note
    );
        //päivitä muistiinpanot lol!
        deleteNote(selectedNote.id); //hus vanha?
        addNote(selectedNote.course.id, "Updated Note", selectedNote.text) //tilalle uusi!
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
                        {sortedNotes.length === 0 ? (
                            <p>No notes here</p>
                        ) : (
                            sortedNotes.map((note) => (
                                <li key={note.id}>
                                    <strong>{note.title || "Untitled Note"}</strong> ({note.timestamp||"No Date"}) -{" "}
                                    {(note.text ? note.text.substring(0,20) : "No content available")}...
                                    <button onClick={() => handleSelectNote(note)}>Open</button>
                                </li>
                            ))
                        )}
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
                    ) : (
                        <>
                            <textarea value={selectedNote.text}
                            onChange={(e) => setSelectedNote({...selectedNote, text: e.target.value})}
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