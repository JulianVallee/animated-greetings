// import fs from 'fs';
// import path from 'path';
// import semver from 'semver';

// const fs = require('fs');
// const path = require('path');
// const semver = require('semver');

// console.log(process.argv);
// if(process.argv.length <= 2 || !process.argv[2]) {
//     throw new Error(`Missing version argument, please call 'ts-node bump-plugin.ts 1.2.3'`);
// }
//
// const version = process.argv[2];
//
// if(!semver.valid(version)) {
//     throw new Error(`Invalid version argument, '${version}' is not a valid semver version`);
// }
//
// const filePath = path.join(process.cwd(), '\\src\\animated-greetings.php');
// const filePathNew = path.join(process.cwd(), '\\src\\animated-greetings.bumped.php');
//
const replacements = [
    {
        file: "",
        regexes: [
            /(.*\* Version.*)([0-9]+\.[0-9]+\.[0-9]+)(.*)/g, // Version in plugin declaration PHP comment
            /(.*define\('ANIMATED_GREETINGS_VERSION', ')([0-9]+\.[0-9]+\.[0-9]+)(.*)/g, // Version in PHP constant
        ]
    }
];
//
// // Read file
// for(let replacement of replacements) {
//     if(!fs.existsSync(filePath)) {
//         throw new Error(`File '${filePath} not found`)
//     }
//
//     let fileContents = fs.readFileSync(filePath, 'utf8');
//
//     for(let regex of replacement.regexes) {
//         fileContents = fileContents.replace(regex, `$1${version}$3`);
//     }
//
//     // Write file back
//     fs.writeFile(filePathNew, fileContents, 'utf8', function (err) {
//         if (err) {
//             throw err;
//         }
//     });
// }


module.exports.readVersion = function (contents) {
    const matches = new RegExp(/.*\* Version.*([0-9]+\.[0-9]+\.[0-9]+)/g).exec(contents);

    if(matches?.length) {
        return matches[1];
    } else {
        throw new Error(`Failed to read current version`);
    }
}

module.exports.writeVersion = function (contents, version) {
    for(let regex of replacements[0].regexes) {
        contents = contents.replace(regex, `$1${version}$3`);
    }

    return contents;
}