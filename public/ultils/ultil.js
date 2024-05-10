function generateLinkJoin() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    let time_date = new Date().getTime().toString() + "-"
    return time_date + randomString;
}

function random4NumberDigits(){

    const randomDecimal = Math.random();

    // Multiply by 9000 (upper bound for 4-digit numbers) to get a random number between 0 and 8999.9999...
    const randomNumber = randomDecimal * 9000;
  
    // Use Math.floor to round down to the nearest integer, ensuring a whole number
    const fourDigitNumber = Math.floor(randomNumber);
  
    // Add 1000 to ensure the number starts from 1000 (4-digit range)
    return fourDigitNumber + 1000;
}

module.exports.generateLinkJoin = generateLinkJoin;

module.exports.random4NumberDigits = random4NumberDigits;