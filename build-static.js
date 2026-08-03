const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
const files = [
    'index.html',
    'styles.css',
    'game.js',
    'additional_scenes.js',
    'characters.js',
    'game_state.js'
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
    fs.copyFileSync(path.join(__dirname, file), path.join(dist, file));
}

console.log('Static site written to dist/');
