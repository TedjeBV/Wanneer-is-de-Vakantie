// Session object to store data
const session = {}

// Main function
function main() {}

// Fetch needed files
const promises = [
    fetch('assets/translation.json').then(r => r.json()).then(json => session.translation = json),
]

Promise.all(promises).then( main )