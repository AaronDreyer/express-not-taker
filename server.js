const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const allNotesMain = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(allNotesMain.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

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

app.post('/api/notes', (req, res) => {
    const note = createNote(req.body, allNotesMain);
    res.json(note);
});

function deleteNote(id, allNotesArray) {
    for (let i = 0; i < allNotesArray.length; i++) {
        let note = allNotesArray[i];

        if (note.id == id) {
            allNotesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(allNotesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotesMain);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});