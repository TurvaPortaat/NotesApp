import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function CourseView() {
    const[courses, setCourses] = useState([]); 
    const[newCourse, setNewCourse] = useState('');
    const navigate = useNavigate();

    const API_URL = "https://luentomuistiinpano-api.netlify.app/.netlify/functions/courses"

    // Haetaan kurssit API:sta
    const fetchCourses = async () => {
        try {
            const response = await fetch(API_URL); //GET
            if (!response.ok) throw new Error ("Failed to fetch courses.");    //Virheenkäsittelyä
            const apiCourses = await response.json();
            
            const localCourses = JSON.parse(localStorage.getItem("courses")) || [];
            const combinedCourses = [...apiCourses, ...localCourses];
            //muuttujanimet selittänee tarpeeks

            setCourses(combinedCourses);
        } catch (error) {   //virheen käsittelyä
            console.error("Error fetching course: ", error);
            const localCourses = JSON.parse(localStorage.getItem("courses")) || [];
            setCourses(localCourses); //edes ne paikalliset jos ei apii tuu
        }
    };
    //Lisätään uusi kurssi
    const handleAddCourse = () => {
        if(!newCourse.trim()) { 
            alert("Course name cannot be empty!"); //virheenkäsittelyä ja käyttäjän ohjausta :)
            return;
        }
        const newCourseData = {id:Date.now(), name: newCourse, notesCount: 0};

        const updatedCourses = [...courses, newCourseData];
            setCourses(updatedCourses);
            localStorage.setItem("courses", JSON.stringify(updatedCourses));
            setNewCourse("");
        };
    

    // Poistetaa kurssi
    const handleDeleteCourse = (courseId) => {
       
            const updatedCourses = courses.filter((course) => course.id !==courseId);
            // Päivitä kun poistat
            setCourses(updatedCourses);
            localStorage.setItem("courses", JSON.stringify(updatedCourses));
            
    }; 

    // kurssit kun komponentti latautuu
    useEffect(() => {
        fetchCourses();
    }, []);



    return (
        <div className="courseViewContainer">
            <h2> View and add courses </h2>
            <input 
                type="text" 
                value={newCourse} 
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="Enter new course name here..." /> 
            <button onClick={handleAddCourse}> Add course </button>

            <ul>
                {courses.length === 0 ? (
                    <p> No courses here </p>
                ): (
                    courses.map((course) => (
                        <li key={course.id}>
                            {course.name} - {course.notesCount || 0} note{course.notesCount === 1 ? "" : "s"}
                            <button onClick={() => handleDeleteCourse(course.id)}> Delete </button>
                        </li>
                    ))
                )}
            </ul>

            <button onClick={() => navigate('/')}>Back</button>
        </div>
    );
}

export default CourseView;