// routes/projects.js
const express = require('express');
var Project = require('../models/project');
var User = require('../models/user');
var authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

// Kreiranje novog projekta
router.post('/projects', (req, res) => {
  const project = new Project(req.body);
  project.save((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(project);
  });
});

// Dohvaćanje projekata
router.get('/projects', (req, res) => {
  Project.find({}, (err, projects) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(projects);
  });
});

// Dohvaćanje projekta po id-u
router.get('/projects/:id', (req, res) => {
  Project.findById(req.params.id, (err, project) => {
    if (err) return res.status(500).send(err);
    if (!project) return res.status(404).send('Project not found');
    res.status(200).send(project);
  });
});

// Ažuriranje projekta po id-u
router.put('/projects/:id', (req, res) => {
  Project.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, project) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(project);
  });
});

// Brisanje projekta po id-u
router.delete('/projects/:id', (req, res) => {
  Project.findByIdAndRemove(req.params.id, (err, project) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Project deleted');
  });

});

// Dodavanje člana timu
router.post('/:id/team', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.projectManager.toString() !== req.user.userId) {
      return res.status(403).send('Access denied');
    }
    const user = await User.findById(req.body.userId);
    if (user) {
      project.teamMembers.push(user);
      await project.save();
      res.status(200).send('Team member added');
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Projekti gdje je korisnik voditelj
router.get('/managed', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ projectManager: req.user.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Projekti gdje je korisnik član
router.get('/member', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ teamMembers: req.user.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Arhiviranje projekta
router.put('/:id/archive', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.projectManager.toString() !== req.user.userId) {
      return res.status(403).send('Access denied');
    }
    project.archived = true;
    await project.save();
    res.status(200).send('Project archived');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Ažuriranje atributa obavljeni_poslovi za članove
router.put('/:id/tasksCompleted', authenticateJWT, async (req, res) => {
  try {
      const project = await Project.findById(req.params.id);
      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }
      if (!project.members.includes(req.user.id)) {
          return res.status(403).json({ message: 'Access denied' });
      }
      project.tasksCompleted = req.body.tasksCompleted;
      await project.save();
      res.status(200).json(project);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Dohvati arhivirane projekte
router.get('/archived', authenticateToken, async (req, res) => {
  try {
    const managedProjects = await Project.find({ projectManager: req.user.userId, archived: true });
    const memberProjects = await Project.find({ teamMembers: req.user.userId, archived: true });
    res.json({ managedProjects, memberProjects });
  } catch (err) {
    res.status(500).send(err.message);
  }
});



module.exports = router;

