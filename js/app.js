const config = {};
// Configuration options:
config.currentYear = '20202021'; // This schoolyear

// Years that are available
config.loadedYears = [
    '20202021',
];

config.defaultLanguage = 'nl'; // Default language

/*
CODE BELOW
*/

const session = {}; // Session object to store data

// Get correct year
session.year = (new URL(document.location)).searchParams.get('year');
if (session.year === null) { session.year = config.currentYear };

// Get correct language
session.language = (new URL(document.location)).searchParams.get('lang');
if (session.language === null) { session.language = config.defaultLanguage };

// Run the script
function run() {
    const table = makeTable(session.data);
    document.getElementById('table').appendChild(table);
}

// Get correct tranlation
function getTranslation(key) {
    // Check if language is available
    if (session.translation[session.language] === undefined) { return key; };

    const translation = session.translation[session.language][key];
    if (translation === undefined) {
        return key;
    }
    return translation;
};

// Make table from the data
function makeTable(data) {

    // Table
    const table = document.createElement('table');
    
    // Table header
    const header = document.createElement('thead');
    const headerHolidayType = document.createElement('th');
    const headerHolidayStart = document.createElement('th');
    const headerHolidayEnd = document.createElement('th');

    headerHolidayType.innerHTML = getTranslation('HOLIDAY_TYPE');
    headerHolidayStart.innerHTML = getTranslation('HOLIDAY_START');
    headerHolidayEnd.innerHTML = getTranslation('HOLIDAY_END');

    header.appendChild(headerHolidayType);
    header.appendChild(headerHolidayStart);
    header.appendChild(headerHolidayEnd);

    table.appendChild(header);

    // Table body
    const body = document.createElement('tbody');
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        const holidayType = document.createElement('td');
        const holidayStart = document.createElement('td');
        const holidayEnd = document.createElement('td');

        holidayType.innerHTML = getTranslation(data[i].type);
        holidayStart.innerHTML = getTranslation(data[i].start);
        holidayEnd.innerHTML = getTranslation(data[i].end);

        row.appendChild(holidayType);
        row.appendChild(holidayStart);
        row.appendChild(holidayEnd);

        body.appendChild(row);
    }

    table.appendChild(body);
    return table;

}

// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/translation.json').then(r => r.json()).then(json => session.translation = json),
    fetch(`assets/data/${session.year}.json`).then(r => r.json()).then(json => session.data = json),
];

// Run if all files are loaded
Promise.all(promises)
.then( run )
