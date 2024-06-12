import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import ProjectTables from './components/ProjectTable';

function App() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/project_assignments');
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAssignments();
    const interval = setInterval(fetchAssignments, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

 //Last 5 Assignments only Shown
  const recentAssignments = assignments.slice(-5);

  return (
    <div className="App">
      <ProjectTables assignments={recentAssignments} />
    </div>
  );
}

export default App;
