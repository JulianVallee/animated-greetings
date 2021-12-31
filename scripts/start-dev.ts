/**
 * Handle starting and gracefully stopping the docker containers
 * and webpack-dev-server in a single command.
 * @since 1.0.2
 */

const {spawn} = require("child_process");

// Start the docker container
spawn('docker compose up -d', {stdio: "inherit", shell: true});

// Start the webpack dev server in proxy mode
const webpackDevServerProcess = spawn('node ./scripts/start-webpack-dev-server.ts', {shell: true});

webpackDevServerProcess.stdout.on('data', (chunk: any) => {
    process.stdout.write(chunk.toString().replace(/<iwets> /g, ''));
});

webpackDevServerProcess.stderr.on('data', (chunk: any) => {
    process.stderr.write(chunk.toString().replace(/<iwets> /g, ''));
});

process.on('SIGINT', () => {
    webpackDevServerProcess.kill('SIGINT');
    spawn('docker compose down', {stdio: "inherit", shell: true});
});