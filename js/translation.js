// Get correct tranlation
function getTranslation(key, withCapital) {
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
        if (typeof translation !== 'object') {
            if (withCapital) {
                return capitalizeFirstLetter(translation);
            } else {
                return translation;
            }
        }
    }

    console.error(`Translation for ${key} in ${session.language} not found`);
    return key

};

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}