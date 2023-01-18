// Read Score Data from a file
const KOVAAKS_STATS_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats";

// files.sort((a, b) => {
//     let rx = /(\d{4}\.\d{2}\.\d{2})-(\d{2}\.\d{2}\.\d{2})/;
//     let aDate = rx.exec(a)[1];
//     let aTime = rx.exec(a)[2];
//     let bDate = rx.exec(b)[1];
//     let bTime = rx.exec(b)[2];
//     return bDate.localeCompare(aDate) || bTime.localeCompare(aTime);
// });

import chokidar from 'chokidar';
import { Score } from '../models/score.js'
import { Stats } from '../models/stats.js'
import { readdirSync } from 'fs';
import { join } from 'path';
// Watch for new files
const watcher = chokidar.watch(KOVAAKS_STATS_PATH, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
    },
    ignoreInitial: true,
});

const files = readdirSync(KOVAAKS_STATS_PATH);
for (let file of files) {
    Score.fromCSVFile(join(KOVAAKS_STATS_PATH, file));
}

import { ipcMain } from 'electron';
var scenarioUpdateEvent = null
ipcMain.on('get-scenario-updates', (event) => {
    scenarioUpdateEvent = event;
});

watcher.on('add', path => {
    let score = Score.fromCSVFile(path);
    if( scenarioUpdateEvent ) {
        scenarioUpdateEvent.sender.send('scenario-updated', score.scenario);
    }
});
