import VarParser from './var-parser';
 
new VarParser()
    .set('version', (parser) => require('./../../package.json').version)
    .set('tag', (parser) => 'v' + parser.outputs.version);