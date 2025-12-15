// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'salonData.json');

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Functions ---

// Function to read the data file
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data file:", error.message);
        // FIX: Ensure all four arrays expected by the frontend are returned on failure
        return {
            appointments: [],
            clients: [],
            staff: [],
            services: []
        };
    }
}

// Function to write data to the file
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log("Data successfully written to file.");
    } catch (error) {
        console.error("Error writing data file:", error.message);
    }
}

// --- API Endpoints (GET and POST for all four data types) ---

// STAFF
app.get('/api/staff', (req, res) => {
    res.json(readData().staff);
});
app.post('/api/staff', (req, res) => {
    const newStaff = req.body;
    const data = readData();
    const newId = data.staff.length > 0 ? Math.max(...data.staff.map(s => s.id)) + 1 : 1;
    newStaff.id = newId;
    data.staff.push(newStaff);
    writeData(data);
    res.status(201).json(newStaff);
});

// SERVICES
app.get('/api/services', (req, res) => {
    res.json(readData().services);
});
app.post('/api/services', (req, res) => {
    const newService = req.body;
    const data = readData();
    const newId = data.services.length > 0 ? Math.max(...data.services.map(s => s.id)) + 1 : 1;
    newService.id = newId;
    data.services.push(newService);
    writeData(data);
    res.status(201).json(newService);
});

// ⚡️ NEW: PUT (Edit) Service Endpoint ⚡️
app.put('/api/services/:id', (req, res) => {
    const serviceId = parseInt(req.params.id);
    const updatedServiceData = req.body;
    const data = readData();

    const index = data.services.findIndex(s => s.id === serviceId);

    if (index !== -1) {
        // Preserve the original ID and merge the rest of the data
        data.services[index] = { ...data.services[index], ...updatedServiceData, id: serviceId };
        writeData(data);
        res.json(data.services[index]);
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
});

// ⚡️ NEW: DELETE Service Endpoint ⚡️
app.delete('/api/services/:id', (req, res) => {
    const serviceId = parseInt(req.params.id);
    const data = readData();

    const initialLength = data.services.length;
    data.services = data.services.filter(s => s.id !== serviceId);

    if (data.services.length < initialLength) {
        writeData(data);
        res.status(204).send(); // 204 No Content for successful deletion
    } else {
        res.status(404).json({ message: 'Service not found' });
    }
});

// APPOINTMENTS (GET is now correctly implemented)
app.get('/api/appointments', (req, res) => {
    res.json(readData().appointments);
});
// CLIENTS (GET is now correctly implemented)
app.get('/api/clients', (req, res) => {
    res.json(readData().clients);
});

// Start Server
app.listen(PORT, () => {
    console.log(`JSON Database Server running at http://localhost:${PORT}`);
    console.log('Ensure salonData.json is in the root directory.');
});