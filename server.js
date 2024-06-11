const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Server and Port 
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://admin:adminpass@cluster0.yv7njjb.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const employeeSchema = new mongoose.Schema({
  employee_id: String,
  full_name: String,
  email: String,
  hashed_password: String,
});

const projectSchema = new mongoose.Schema({
  project_code: String,
  project_name: String,
  project_description: String,
});

const projectAssignmentSchema = new mongoose.Schema({
  employee_id: String,
  project_code: String,
  start_date: Date,
});

const Employee = mongoose.model('Employee', employeeSchema);
const Project = mongoose.model('Project', projectSchema);
const ProjectAssignment = mongoose.model('ProjectAssignment', projectAssignmentSchema);

// API Endpoints
app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/project_assignments', async (req, res) => {
  try {
    const assignment = new ProjectAssignment(req.body);
    await assignment.save();
    res.status(201).send(assignment);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/project_assignments', async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find().lean();
    
    const populatedAssignments = await Promise.all(assignments.map(async assignment => {
      const employee = await Employee.findOne({ employee_id: assignment.employee_id });
      const project = await Project.findOne({ project_code: assignment.project_code });
      
      return {
        ...assignment,
        full_name: employee ? employee.full_name : 'Unknown',
        project_name: project ? project.project_name : 'Unknown',
      };
    }));

    res.send(populatedAssignments);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
