import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

function CourseView() {
    const[courses, setCourses] = useState([]); 
    const[newCourse, setNewCourse] = useState('');
    const navigate = useNavigate();

    const API_URL = "https:://api.example.com/courses"

    // Haetaan kurssit API:sta
    const fetchCourses = async () => {
        try {
            const response = await fetch(API_URL); //GET
            if (!response.ok) throw new Error ("Failed to fetch courses.");    //Virheenkäsittelyä
            const data = await response.json();
            setCourses(data);
        } catch (error) {   //virheen käsittelyä
            console.error("Error fetching course: ", error);
        }
    };
    //Lisätään uusi kurssi
    const handleAddCourse = async () => {
        if(!newCourse.trim()) { 
            alert("Course name cannot be empty!"); //virheenkäsittelyä ja käyttäjän ohjausta :)
            return;
        }
        const newCourseData = {id:Date.now(), name: newCourse};

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCourseData),
            });
            if (!response.ok) throw new Error("Failed to add course");  //virheenkäsittelyä

            //päivitetää React-tila uusil kursseil
            setCourses((prevCourses)=>[...prevCourses, newCourseData]);
            setNewCourse(""); // tyhjennä syöte
            } catch (error) {
                console.error("Error adding course: ", error); //nappaa virhe ja kerro
            }
    };

    // Poistetaa kurssi
    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await fetch(`${API_URL}/${courseId}`, { 
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete course."); //virheenkäsittely

            // Päivitä React kun poistat
            setCourses((prevCourses) =>
            prevCourses.filter((course) => course.id !== courseId)
            );
        } catch (error) {   //Virheenkäsittelyä 
            console.error("Error deleting course: ", error);
        }
    }; 

    // kurssit kun komponentti latautuu
    useEffect(() => {
        fetchCourses();
    }, []);

   

    /*
    Jätin tän että muistan että ei näin.
    useEffect(()=> {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try{                                //Päivitä tänne oikeet polut!
            const response = await fetch('https://api.example.com/courses')
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses: ', error);
        }
    };*/

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