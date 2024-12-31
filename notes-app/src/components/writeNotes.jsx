import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/writeNotes.css';

function WriteNotes({onSaveNote}) {
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [course, setCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {                             //Päivitä tänne oikeet polut!  
            const response = await fetch('API-päätepiste joka palauttaa kurssit')
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses: ', error);
        } //Täs haetaa kurssit ja napataan virhe jos sellane tulee ja printataa käyttäjälle
    };

    const handleAddNote = () => {
        if (note&&course) {
            console.log({note, date, course});
            const newNote = {id: Date.now(), title: course, date, content: note};
            onSaveNote(newNote); // muistiinpanon tallennus (duh, nimi)
            setNote('');
            setCourse('');
            alert('Note saved!');
        }
    };

    return(
        <div className="writeNotesContainer">
            <h2>Create a new note</h2>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="">Choose a course</option>
                {courses.map((courseItem) => (
                    <option key={courseItem.id} value={courseItem.name}>
                        {courseItem.name}
                    </option>
                ))}
            </select>
            <textarea value={note} onChange={(e)=> setNote(e.target.value)}
                placeholder="Start writing by clicking here..."/>
            <button onClick={handleAddNote}>Save</button>
            <button onClick={() => navigate('/')}>Back</button>    
        </div>
    );
}

export default WriteNotes;