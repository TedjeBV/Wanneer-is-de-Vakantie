// Session object to store data
const session = {}

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

// Holiday class
class Holiday {

    constructor({type, start, end}) {

        this.type = type;
        this.start = start;
        this.end = end;
        this.duration = calculateDaysBetweenDates(start, end);
        
    }

}
// Process the data
function processData(data) {}

// Main function
function main() {}

// Fetch needed files
const promises = [
    fetch('assets/translation.json').then(r => r.json()).then(json => session.translation = json),
]

Promise.all(promises).then( main )