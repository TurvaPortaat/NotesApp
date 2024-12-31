import React, {createContext, useState, useEffect} from "react";

export const DataContext = createContext();

export const DataProvider = ({ children}) => { //muistakaa lapset, muistakaa!
    // Ladataa kurssit ja muistiinpanot
    const [courses, setCourses] = useState([]); // alustetaa kurssit
    const [notes, setNotes] = useState([]); //alustetaa muistiinpanot
    const [activeSession, setActiveSession] = useState(null); //Sessio opintojaksoille

    const [loading, setLoading] = useState(true); //lataustila

    //Noudetaan oj:t
    const COURSES_API = "https://luentomuistiinpano-api.netlify.app/.netlify/functions/courses"; 
    //Noudetaan muistiinpanot
    const NOTES_API = "https://luentomuistiinpano-api.netlify.app/.netlify/functions/notes"; 
    
    // lataa data REST API:sta ja tallenna paikallisesti
    useEffect(() => {
        const fetchData = async () => {
            try 
            {
                const [coursesResponse, notesResponse] = await Promise.all([
                    fetch(COURSES_API),
                    fetch(NOTES_API),
                ]);
                // Jos ei toimi, heitä virhe
                if (!coursesResponse.ok || !notesResponse.ok)
                {
                    throw new Error("Failed to fetch data from API.");
                }

                const coursesData = await coursesResponse.json();
                const notesData = await notesResponse.json();

                const processedCourses = coursesData.map((course) => ({
                    ...course, 
                    id: course.id || 0, //id must be int
                    name: course.name ||"Unnamed Course", //Ei mitään undefined arvoja. 
                }));


                const processedNotes = notesData.map((note) => ({
                    ...note,
                    id: note.id ||0,
                    text: note.text || "Empty Note",
                    timestamp: note.timestamp ||new Date().toISOString(),
                    course: note.course
                    ? {
                        id: note.course.id ||0,
                        name: note.course.name || "Unknown Course",
                    }
                    : {id: 0, name: "Unknown Course"},
                }));

                //Päivitä 
                setCourses(processedCourses);
                setNotes(processedNotes);

                localStorage.setItem("courses", JSON.stringify(processedCourses));
                localStorage.setItem("notes", JSON.stringify(processedNotes));

                console.log("Fetched courses from API:", processedCourses);
                console.log("Fetched notes from API:", processedNotes);
            } catch (error) 
            {   //virheenkäsittely palikka
                console.error("Error fetching data from API: ", error) 

                // Lataa varmuuskopiodata localStoragesta
                const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
                const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
                setCourses(savedCourses);
                setNotes(savedNotes);

                console.log("Loaded courses from localStorage not API.");
                console.log("Loaded notes from localStorage not API.");
            } finally 
            {
                setLoading(false); // lopeta lataus
            }
        };

        fetchData();
    }, []);

    //uuden kurssin lisäämisen funkkari
    const addCourse = (courseName) => {
        const newCourse = 
            {   id: Date.now(), 
                name: courseName, 
                notesCount: 0
            };
        setCourses((prevCourses)=>[...prevCourses, newCourse]);
        localStorage.setItem("courses", JSON.stringify([...courses, newCourse]));
    };

    //tällä palikalla poistetaa kursseja
    const deleteCourse = (courseId) => {
        const updatedCourses = courses.filter((course) => course.id !== courseId);
        const updatedNotes = notes.filter((note) => note.courseId !== courseId);
        setCourses(updatedCourses);
        setNotes(updatedNotes);
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
    };

    //uuden muistiinpanon lisäämisen funkkari
    const addNote = (courseId, title, content) => {
        // Ei tyhjiä muistiinpanoja viesti
        if(!content.trim())
        {
            alert("Note content cannot be empty!")
            return;
        }
    
        const newNote = 
        {id: Date.now(), 
            courseId, 
            title, 
            date: new Date().toISOString().split("T")[0],
             content,};

        setNotes((prevNotes)=>[...prevNotes, newNote]);

        //päivitetää notesCountit, mitä ei pyydetty, mutta halusin ne ite lisätä lol.
        const updatedCourses =courses.map((course) =>  
            course.id === courseId
            ? {...course, notesCount: (course.notesCount || 0) +1 }
            : course
        );
        setCourses(updatedCourses);

        //Päivitetää
        localStorage.setItem("notes", JSON.stringify([...notes, newNote]));
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
    };
    //tällä palikalla poistetaa muistiinpanoja (local)
    const deleteNote = (noteId) => {
        const noteToDelete = notes.find((note) => note.id === noteId);
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);

        //päivitä myös notesCount
        if(noteToDelete) {
            const updatedCourses = courses.map((course)=>
                course.id === noteToDelete.courseId
                        ? {...course, notesCount: Math.max((course.notesCount||1)-1,0) } //jos tuolta pois ni täältä kans
                        : course
                );
                setCourses(updatedCourses);

                // Muista päivittää myös tää
                localStorage.setItem("courses", JSON.stringify(updatedCourses));
        }
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
    };
    
        //Sessiot
        const activateSession = (courseId) => setActiveSession(courseId);
        const deactivateSession = () => setActiveSession(null);

        //latausviesti käyttäjälle
        if (loading) {
            return <p> Loading data... </p>
        }
    
    return (
        <DataContext.Provider 
            value={{
            courses, 
            notes, 
            activeSession,
            addCourse, 
            addNote,
            deleteCourse,
            deleteNote,
            activateSession,
            deactivateSession,
            }}
        >
            {children} {/*Muistakaa lapset, muistakaa!*/}
        </DataContext.Provider>
    );
    
};
    