const config = {};
// Configuration options:
config.currentYear = '20202021'; // This schoolyear

// Years that are available
config.loadedYears = [
    '20202021',
];

config.defaultLanguage = 'nl'; // Default language
config.dateOrder = 'DDMMYYYY' // How to display a date

/*
CODE BELOW
*/

const session = {}; // Session object to store data

// Get correct year
session.year = (new URL(document.location)).searchParams.get('year');
if (!config.loadedYears.includes(session.year)) {

    // Check if the year wasn't null before showing error
    if (session.year !== null) {
        console.log(config.loadedYears)
        console.error(`User tried to load ${session.year}, which does not exist`);
    }

    // Set the year to the default
    session.year = config.currentYear;

}

// Get correct language
session.language = (new URL(document.location)).searchParams.get('lang');
if (session.language === null) { session.language = config.defaultLanguage };

// Run the script
function run() {
    // Main element
    const main = document.getElementsByTagName('main')[0]

    // Format the data
    session.data = formatData(session.data);

    // Current info
    const currentInfo = getCurrentInfo(session.data);
    main.appendChild(buildCurrentInfo(currentInfo));

    // Main holiday data table
    const table = makeTable(session.data);
    main.appendChild(table);
}

// Get correct tranlation
function getTranslation(key) {
    // Check if language is available
    if (session.translation[session.language] === undefined) { return key; };

    // Split the key
    const keys = key.split('.');
    let translation = session.translation[session.language];

    // Loop through the keys to get the correct translation
    for (let i = 0; i < keys.length; i++) {
        translation = translation[keys[i]];
        if (translation === undefined) {
            console.error(`Translation for ${key} in ${session.language} not found`);
            return key
        };
        if (typeof translation !== 'object') { return translation; }
    }

    console.error(`Translation for ${key} in ${session.language} not found`);
    return key

};

// Calculate difference between two dates
function calculateDaysBetweenDates(date1, date2) {
    // Code from:
    // https://stackoverflow.com/a/3224854/14445654
    date1 = new Date(date1);
    date2 = new Date(date2);
    const diffTime = date2 - date1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays
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
    const headerHolidayDuration = document.createElement('th');
    const headerHolidayUntil = document.createElement('th');

    headerHolidayType.innerHTML = getTranslation('HOLIDAY_TYPE');
    headerHolidayStart.innerHTML = getTranslation('HOLIDAY_START');
    headerHolidayEnd.innerHTML = getTranslation('HOLIDAY_END');
    headerHolidayDuration.innerHTML = getTranslation('HOLIDAY_DURATION');
    headerHolidayUntil.innerHTML = getTranslation('HOLIDAY_UNTIL');

    header.appendChild(headerHolidayType);
    header.appendChild(headerHolidayStart);
    header.appendChild(headerHolidayEnd);
    header.appendChild(headerHolidayDuration);
    header.appendChild(headerHolidayUntil);

    table.appendChild(header);

    // Table body
    const body = document.createElement('tbody');
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        const holidayType = document.createElement('td');
        holidayType.classList.add('bold');
        const holidayStart = document.createElement('td');
        holidayStart.classList.add('center');
        const holidayEnd = document.createElement('td');
        holidayEnd.classList.add('center');
        const holidayDuration = document.createElement('td');
        const holidayUntil = document.createElement('td');
        if (data[i].status === 'OVER') {
            holidayUntil.classList.add('red');
        }

        holidayType.innerHTML = getTranslation(data[i].type);
        holidayStart.innerHTML = formatDate(data[i].start, config.dateOrder);
        holidayEnd.innerHTML = formatDate(data[i].end, config.dateOrder);
        holidayDuration.innerHTML = data[i].duration + ' ' + getTranslation('DAYS');
        if (data[i].status !== 'OVER') {
            const daysLeft = calculateDaysBetweenDates(new Date(), data[i].end);
            holidayUntil.innerText = getTranslation('STILL').charAt(0).toUpperCase() + getTranslation('STILL').slice(1)
            holidayUntil.innerText += ' ';
            if (daysLeft > 0) { holidayUntil.innerText += daysLeft }
            else { holidayUntil.innerText += data[i].until };
            holidayUntil.innerText += ' ';
            holidayUntil.innerText += (daysLeft === 1) ? getTranslation('DAY') : getTranslation('DAYS');
            holidayUntil.innerText += ' ';
            
            if (data[i].status === 'ONGOING') { holidayUntil.innerText += getTranslation('LEFT') }
            else { holidayUntil.innerText += getTranslation('TO_GO') };

        } else {
            holidayUntil.innerHTML = getTranslation('HOLIDAY_OVER');
        }

        row.appendChild(holidayType);
        row.appendChild(holidayStart);
        row.appendChild(holidayEnd);
        row.appendChild(holidayDuration);
        row.appendChild(holidayUntil);

        body.appendChild(row);
    }

    table.appendChild(body);
    return table;

}

// Get current info
function getCurrentInfo(data) {

    // Get current date
    const currentDate = new Date();

    // Variable to hold next(/current) holiday
    let result;

    data.forEach(holiday => {
        // Check if holiday already is over
        const startOver = calculateDaysBetweenDates(holiday.start, currentDate) >= 0;
        const endOver = calculateDaysBetweenDates(holiday.end, currentDate) <= 0;
        if (!endOver) {
            if (!endOver) { result = holiday }
        }
    })

    if (result === undefined) { result = { no_left: true } }

    const holiday = result;

    // Check if holiday is active
    if (holiday.start <= currentDate && holiday.end >= currentDate) { holiday.active = true };

    return holiday

};

// Build HTML for current info
function buildCurrentInfo(holiday) {

    // Container for current info
    const container = document.createElement('div');
    container.id = 'current-info';

    // If all holidays are over
    if (holiday.no_left) {
        const title = document.createElement('h2');
        title.innerHTML = getTranslation('TEXT_NO_HOLIDAYS_LEFT');

        container.appendChild(title);
        return container
    }

    // Title
    const title = document.createElement('h2');
    container.appendChild(title);

    // Number that will be displayed, might be days until or days left
    const number = document.createElement('span');

    // Check if holiday is active
    if (holiday.active === true) {
        
        title.innerText = getTranslation('TEXT_HOLIDAY_IS_ACTIVE');
        const still = getTranslation('STILL').charAt(0).toUpperCase() + getTranslation('STILL').slice(1);
        const daysLeft = calculateDaysBetweenDates(new Date(), holiday.end);
        const dayOrDays = (daysLeft === 1) ? getTranslation('DAY') : getTranslation('DAYS');
        number.innerText = `${still} ${daysLeft} ${dayOrDays} ${getTranslation('LEFT')}.`

    } else {

        title.innerText = getTranslation('TEXT_HOLIDAY_NOT_ACTIVE');
        const still = getTranslation('STILL').charAt(0).toUpperCase() + getTranslation('STILL').slice(1);
        const daysLeft = calculateDaysBetweenDates(new Date(), holiday.start);
        const dayOrDays = (daysLeft === 1) ? getTranslation('DAY') : getTranslation('DAYS');
        number.innerText = `${still} ${daysLeft} ${dayOrDays} ${getTranslation('TO_GO')}.`
    
    };

    title.innerHTML += ' ';
    title.appendChild(number);


    return container

};

// Format the data
function formatData(data) {

    const formattedData = [];

    data.forEach(holiday => {

        // Parse the dates
        holiday.start = new Date(holiday.start);
        holiday.end = new Date(holiday.end);

        holiday.duration = calculateDaysBetweenDates(holiday.start, holiday.end)

        holiday.until = calculateDaysBetweenDates(new Date(), holiday.start);

        // Get holiday status
        if (holiday.until < 0) {
            if (calculateDaysBetweenDates(new Date(), holiday.end) >= 0) {
                holiday.status = 'ONGOING'
            } else { holiday.status = 'OVER' }
        } else { holiday.status = 'UPCOMING' };

        formattedData.push(holiday);

    });

    return formattedData

};

// Format a date
function formatDate(date, order) {

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let result = '';

    switch (order) {

        case 'DDMMYYYY':
            result = `${day}-${month}-${year}`;
            break;

        case 'MMDDYYYY':
            result = `${month}-${day}-${year}`;
            break;

        case 'YYYYMMDD':
            result = `${year}-${month}-${day}`;
            break;

        case 'YYYYDDMM':
            result = `${year}-${day}-${month}`;
            break;

        default:
            console.warn('Please specify an order for the date!')
            return formatDate(date, 'DDMMYYYY')

    };

    return result

};

// Fetch all needed files and run
// Files to load
const promises = [
    fetch('assets/translation.json').then(r => r.json()).then(json => session.translation = json),
    fetch(`assets/data/${session.year}.json`).then(r => r.json()).then(json => session.data = json),
];

// Run if all files are loaded
Promise.all(promises)
.then( run )
