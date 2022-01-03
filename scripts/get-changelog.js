const fs = require('fs');
const core = require('@actions/core');

class ChangelogParser {
    constructor() {
        this.changelog = null;

        this.readChangelog();
        this.parseChangelog();
        this.setOutputs();
    }

    readChangelog() {
        this.changelogFileContent = fs
            .readFileSync('./CHANGELOG.md', {encoding:'utf8'})
            .toString();
    }

    parseChangelog() {
        let output = "* no changes";
        const matchesRaw = new RegExp("(### \\[.*?)### \\[", "s").exec(this.changelogFileContent);

        if(matchesRaw && matchesRaw.length >= 1) {
            const matchesSplit = new RegExp("(### \\[.*?)(###.*)", "s").exec(matchesRaw[1]);

            if(matchesSplit && matchesSplit.length >= 2) {
                const matchesHeaderSplit = new RegExp("### \\[.*?\\((.*?)\\).*?\\((.*?)\\)", "s").exec(matchesSplit[1]);

                if(matchesHeaderSplit && matchesHeaderSplit.length >= 3) {
                    this.changelog = {
                        version: matchesHeaderSplit[1].trim(),
                        fullLink: matchesHeaderSplit[2].trim(),
                        date: matchesHeaderSplit[3].trim(),
                        body: matchesSplit[2].trim()
                    };

                    this.changelog.body = this.changelog.body ?? '* no changes'
                }
            }
        }
    };

    setOutputs() {
        core.setOutput('version', this.changelog.version);
        core.setOutput('link', this.changelog.fullLink);
        core.setOutput('date', this.changelog.date);
        core.setOutput('body', this.changelog.body);
    }
}

return new ChangelogParser();