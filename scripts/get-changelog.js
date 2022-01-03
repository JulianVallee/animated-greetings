const fs = require('fs');

const changelogFileContent = fs.readFileSync('./CHANGELOG.md', {encoding:'utf8'});

// Display the file data
const matchesRaw = new RegExp("(### \\[.*?)### \\[", "s").exec(changelogFileContent);

if(matchesRaw && matchesRaw.length >= 1) {
    const matchesSplit = new RegExp("(### \\[.*?)(###.*)", "s").exec(matchesRaw[1]);

    if(matchesSplit && matchesSplit.length >= 2) {
        console.log(matchesSplit[2].trim());
        return;
    }
}

console.log("* no changes");