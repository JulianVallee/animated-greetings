/**
 * Handle starting and gracefully stopping the docker containers
 * and webpack-dev-server in a single command.
 * @since 1.0.2
 */

const {spawn} = require("child_process");

// Start the docker container
spawn('docker compose up -d', {stdio: "inherit", shell: true});

// Start the webpack dev server in proxy mode
const webpackDevServerProcess = spawn('node ./scripts/start-webpack-dev-server.js', {shell: true});

// Filter prefixes from output (<i>, <w> etc., see webpack/lib/node/nodeConsole.js)
['stdout', 'stderr'].forEach(ioType => {
    webpackDevServerProcess[ioType].on('data', function (data) {
        process.stdout.write(data.toString().replace(/<iwets> /g, ''));
    });
});

process.on('SIGINT', () => {
    webpackDevServerProcess.kill('SIGINT');
    spawn('docker compose down', {stdio: "inherit", shell: true});
});