import fs from 'fs';
import core from '@actions/core';

import VarParser from './var-parser';

const CHANGELOG_PATH = './CHANGELOG.md';

const readChangelog = (parser: VarParser) => {
    try {
        const changelogFileContents = fs.readFileSync(CHANGELOG_PATH, {encoding:'utf8'});
        const matchesRaw = new RegExp("(###? \\[?.*?)###? \\[?\\d", "s").exec(changelogFileContents);
        /* @ts-ignore */
        if(matchesRaw && matchesRaw.length >= 1) {

            const matchesSplit = new RegExp("(###? \\[?.*?)(###.*)", "s").exec(matchesRaw[1]);
            if(matchesSplit && matchesSplit.length >= 2) {
                return matchesSplit[2].trim();

            }

        }
    }
    catch(err) {
        core.setFailed(`Action failed: ${err}`);
    }

    return '* no changes';
};

const buildReleaseBody = (parser: VarParser) => {
    return `## What's Changed\n\n${parser.outputs.changelog}`;
}

new VarParser()
    .set('changelog', readChangelog)
    .set('body', buildReleaseBody);
