const config = {};
// Configuration options:
config.latestYear = '20202021'; // This schoolyear

config.loadedYears = [
    '20202021',
];

/*
CODE BELOW
*/

const session = {}; // Session object to store data

// Get correct year
session.year = (new URL(document.location)).searchParams.get('year');
if (session.year === null) { session.year = config.latestYear };

// Fetch the correct year's data
fetch(`assets/data/${session.year}.json`)
    .then(r => r.json())
    .then(data => { session.data = data });