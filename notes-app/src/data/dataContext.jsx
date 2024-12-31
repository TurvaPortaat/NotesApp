import js from "@eslint/js";
import React, {createContext, useState, useEffect} from "react";

//Alustetaan esimerkit
/*
const examplelCourses = [
    {id: 1, name: "Engineering Mathematics 1", notesCount: 0},
    {id: 2, name: "Engineering Physics 1", notesCount: 0},
    {id: 3, name: "Statistics", notesCount: 0},
];

const exampleNotes = [
    {id: 1, courseId: 1, title: "Linear solutions", date:"2024-06-11", content: "This is an example note. :)"},
    {id: 2, courseId: 2, title: "Physics Stuff", date:"2024-06-11", content: "This is an example note. :)"},
    {id: 3, courseId: 3, title: "Conditional distributions", date:"2024-06-11", content: "This is an example note. :)"},
]; 
Ei tehä sittenkää näitä ku pitää olla tyhjäki että tulee error viesti.
*/
export const DataContext = createContext();

export const DataProvider = ({ children}) => { //muistakaa lapset, muistakaa!
    // Ladataa kurssit ja muistiinpanot
    const [courses, setCourses] = useState([]); // alustetaa kurssit
    const [notes, setNotes] = useState([]); //alustetaa muistiinpanot
    const [activeSession, setActiveSession] = useState(null); //Sessio opintojaksoille

    const [loading, setLoading] = useState(true); //lataustila

    //Noudetaan oj:t
    const COURSES_API = "https://luentomuistiinpanoapi.netlify.app/.netlify/functions/courses";
    //Noudetaan muistiinpanot
    const NOTES_API = "https://luentomuistiinpanoapi.netlify.app/.netlify/functions/notes";
    
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

                //Päivitä React ja localStorage
                setCourses(coursesData);
                setNotes(notesData);
                localStorage.setItem("courses", JSON.stringify(coursesData));
                localStorage.setItem("notes", JSON.stringify(notesData));
            } catch (error) 
            {   //virheenkäsittely palikka
                console.error("Error fetching data from API: ", error) 
            } finally 
            {
                setLoading(false); // lopeta lataus
            }
        };

        fetchData();
    }, []);

    
    // jos ei oo haettu dataa API:sta, hae se localStoragesta
    useEffect(() => {
        const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
        const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
        if (courses.length === 0) setCourses (savedCourses);
        if (notes.length === 0) setNotes (savedNotes);
    }, []);

    //uuden kurssin lisäämisen funkkari (local)
    const addCourse = (courseName) => {
        const newCourse = 
            {   id: Date.now(), 
                name: courseName, 
                notesCount: 0
            };
        setCourses((prevCourses)=>[...prevCourses, newCourse]);
        localStorage.setItem("courses", JSON.stringify([...courses, newCourse]));
    };

    //tällä palikalla poistetaa kursseja (local)
    const deleteCourse = (courseId) => {
        const updatedCourses = courses.filter((course) => course.id !== courseId);
        const updatedNotes = notes.filter((note) => note.courseId !== courseId);
        setCourses(updatedCourses);
        setNotes(updatedNotes);
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
    };

    //uuden muistiinpanon lisäämisen funkkari (local)
    const addNote = (courseId, title, content) => {
        // Ei tyhjiä muistiinpanoja viesti
        if(!content.trim())
        {
            alert("Note content cannot be empty!")
            return;
        }
        // Mä laitan näihi sen titlen vaikkei pyydetty, koska haluan >:) JA koska ärsyttää T diipadaapa stampissa ni leikkailen vähä
        const newNote = 
        {id: Date.now(), 
            courseId, 
            title, 
            date: new Date().toISOString().split("T")[0],
             content};

        setNotes((prevNotes)=>[...prevNotes, newNote]);

        //päivitetää notesCountit, mitä ei myöskään pyydetty, mutta halusin ne ite lisätä.
        const updatedCourses =courses.map((course) =>  
            course.id === courseId
            ? {...course, notesCount: (course.notesCount || 0) +1 }
            : course
        );
        setCourses(updatedCourses);

        //Päivitetää local
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

                // Muista päivittää myös local
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
    