const replacements = [
    /(.*\* Version.*)([0-9]+\.[0-9]+\.[0-9]+)(.*)/g, // Version in plugin declaration PHP comment
    /(.*define\('ANIMATED_GREETINGS_VERSION', ')([0-9]+\.[0-9]+\.[0-9]+)(.*)/g, // Version in PHP constant
];

module.exports.readVersion = function (contents) {
    const matches = new RegExp(/.*\* Version.*([0-9]+\.[0-9]+\.[0-9]+)/g).exec(contents);

    if(matches?.length) {
        return matches[1];
    } else {
        throw new Error(`Failed to read current version`);
    }
}

module.exports.writeVersion = function (contents, version) {
    for(let regex of replacements) {
        contents = contents.replace(regex, `$1${version}$3`);
    }

    return contents;
}