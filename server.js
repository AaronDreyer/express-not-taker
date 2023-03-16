// Importing node module 'express'
const express = require('express');
// This line of code creates a new instance of the 'express' application by calling it as a function and assigning the returned value to the variable 'app'.
const app = express();

// Importing node module file system
const fs = require('fs');
// Importing node module path
const path = require('path');

// This line of code is to set the port to 3001 if the environment variable is not set
const PORT = process.env.PORT || 3001;

// This line imports the db.json file, which is used to store and retrieve notes.
const allNotesMain = require('./db/db.json');

// Middleware

// The 'urlencoded' middleware is a built-in middleware in Express that parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));
// The 'json' middleware is a built-in middleware in Express that parses incoming requests with JSON payloads
app.use(express.json());
// The 'static' middleware is a built-in middleware function in Express. It serves static files and is based on serve-static.
app.use(express.static('public'));

// Routes Handlers

// Responds to GET requests to the /api/notes endpoint and sends back a JSON representation of all notes
// The slice() removes the first element of the array which is 0 and returns the rest of the array
// The first element of the array is 1 because the first element of the array is used to store the next id number
app.get('/api/notes', (req, res) => {
    res.json(allNotesMain.slice(1));
});

// Responds to GET requests to the / endpoint and sends back the index.html file from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Responds to GET requests to the /notes endpoint and sends back the notes.html file from the public directory
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Responds to all other GEt requests and serves the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// This function creates a new note object from the body parameter, sets its ID to the first value (1) in the allNotesArray, increments the first value in the allNotesArray by 1, adds the new note to the end of the array, writes the updated array to the JSON file using fs and returns the new note object
function createNote(body, allNotesArray) {
    const note = body;

    if (!Array.isArray(allNotesArray)) {
        allNotesArray = [];
    }
    if (allNotesArray.length === 0) {
        allNotesArray.push(0);
    }

    body.id = allNotesArray[0];
    allNotesArray[0]++;

    allNotesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(allNotesArray, null, 2)
    );
    return note;
}

// Route Handler

// Responds to POST requests to the /api/notes endpoint and sends back the new note object
app.post('/api/notes', (req, res) => {
    const note = createNote(req.body, allNotesMain);
    res.json(note);
});

// This function takes in an ID and the notes array, loops through each note in the array, and if the note's ID matches the ID passed in, the note is removed from the array, the updated array is written to the JSON file using fs, and the function returns
function deleteNote(id, allNotesArray) {
    for (let i = 0; i < allNotesArray.length; i++) {
        let note = allNotesArray[i];

        if (note.id == id) {
            allNotesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(allNotesArray, null, 2)
            );

            return;
        }
    }
}

// Route Handler

// Responds with a DELETE request to the /api/notes/:id endpoint and sends back the deleted note object
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotesMain);
    res.json(true);
});

// This code sets up the express app to listen on a specified port and logs the message that it is listening
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});