const fs = require('fs');

module.exports = ({github, context}) => {
    const changelogFileContent = fs.readFileSync('./CHANGELOG.md', {encoding:'utf8'});
    const matchesRaw = new RegExp("(### \\[.*?)### \\[", "s").exec(changelogFileContent);

    if(matchesRaw && matchesRaw.length >= 1) {
        const matchesSplit = new RegExp("(### \\[.*?)(###.*)", "s").exec(matchesRaw[1]);

        if(matchesSplit && matchesSplit.length >= 2) {
            return matchesSplit[2].trim();
        }
    }

    return "* no changes";
}