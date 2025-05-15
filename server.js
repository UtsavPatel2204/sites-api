const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Enables .env support
const app = express();

const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();

const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Route
app.get('/', (req, res) => {
  res.json({
    message: "API Listening",
    term: "Summer 2025",
    student: "Utsav Sureshbhai Patel"
  });
});

// POST /api/sites
app.post('/api/sites', async (req, res) => {
  try {
    const newSite = await db.addNewSite(req.body);
    res.status(201).json(newSite);
  } catch (err) {
    res.status(500).json({ message: "Error adding site", error: err.message });
  }
});

// GET /api/sites
app.get('/api/sites', async (req, res) => {
  const { page, perPage, name, region, provinceOrTerritory } = req.query;

  try {
    const sites = await db.getAllSites(page, perPage, name, region, provinceOrTerritory);
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving sites", error: err.message });
  }
});

// GET /api/sites/:id
app.get('/api/sites/:id', async (req, res) => {
  try {
    const site = await db.getSiteById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving site", error: err.message });
  }
});

// PUT /api/sites/:id
app.put('/api/sites/:id', async (req, res) => {
  try {
    const result = await db.updateSiteById(req.body, req.params.id);
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Site not found or no update made" });
    }
    res.json({ message: "Site updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating site", error: err.message });
  }
});

// DELETE /api/sites/:id
app.delete('/api/sites/:id', async (req, res) => {
  try {
    const result = await db.deleteSiteById(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Site not found" });
    }
    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ message: "Error deleting site", error: err.message });
  }
});


db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
app.listen(HTTP_PORT, ()=>{
console.log(`server listening on: ${HTTP_PORT}`);
});
}).catch((err)=>{
console.log(err);
});