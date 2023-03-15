const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
