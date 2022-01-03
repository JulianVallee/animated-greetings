const fs = require('fs');
const core = require('@actions/core');

class ChangelogParser {
    constructor() {
        this.output = '* no changes';

        this.readChangelog();
        this.parseChangelog();
        this.setOutputs();
    }

    readChangelog() {
        try {
            this.changelogFileContent = fs
                .readFileSync('./CHANGELOG.md', {encoding:'utf8'})
                .toString();
        }
        catch(err) {
            core.setFailed(`Action failed: ${err}`);
        }
    }

    parseChangelog() {
        const regExp1 = new RegExp("(### \\[.*?)### \\[", "s");
        const regExp2 = new RegExp("(### \\[.*?)(###.*)", "s");
        const regExp3 = new RegExp("### \\[(.*?)\\]\\((.*?)\\).*?\\((.*?)\\)", "s");

        const matchesRaw = regExp1.exec(this.changelogFileContent);

        if(matchesRaw && matchesRaw.length >= 1) {
            const matchesSplit = regExp2.exec(matchesRaw[1]);

            if(matchesSplit && matchesSplit.length >= 2) {
                const matchesHeaderSplit = regExp3.exec(matchesSplit[1]);

                if(matchesHeaderSplit && matchesHeaderSplit.length >= 3) {
                    // this.outputs = {
                    //     version: matchesHeaderSplit[1].trim(),
                    //     link: matchesHeaderSplit[2].trim(),
                    //     date: matchesHeaderSplit[3].trim(),
                    //     body: matchesSplit[2].trim()
                    // };
                    //
                    // this.outputs.body = this.outputs.body ?? '* no changes'

                    this.output = `## What's Changed\n\n${matchesSplit[2].trim()}`;

                } else {
                    // core.setFailed(`Action failed: failed to split the changelog header`);

                }

            } else {
                // core.setFailed(`Action failed: failed to split the changelog entry`);

            }

        } else {
            // core.setFailed(`Action failed: failed to find the changelog entry`);

        }

        // for(let key in this.outputs) {
        //     if(!this.outputs[key]) {
        //         core.setFailed(`Action failed: output ${key} was empty`);
        //     }
        // }
    };

    setOutputs() {
        // core.setOutput('version', this.outputs.version);
        // core.setOutput('link', this.outputs.link);
        // core.setOutput('date', this.outputs.date);
        // core.setOutput('body', this.outputs.body);
        core.setOutput('release', this.outputs.release);
    }
}

return new ChangelogParser();