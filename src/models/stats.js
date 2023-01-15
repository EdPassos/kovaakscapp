const KOVAAKS_STATS_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats";

import { readdirSync } from 'fs';
import { join } from 'path';
import { Score } from './score.js';

class StatsSingleton {
    constructor() {
        this.scenarios = {};
    }

    getScenarioScores(scenario) {
        return this.scenarios[scenario];
    }

    addScore(score) {
        if(!this.scenarios[score.scenario]) {
            this.scenarios[score.scenario] = [];
        }
        this.scenarios[score.scenario].push(score);
    }

}

const Stats = new StatsSingleton();

const files = readdirSync(KOVAAKS_STATS_PATH);
for (let file of files) {
    let score = Score.fromCSVFile(join(KOVAAKS_STATS_PATH, file));
    Stats.addScore(score);
}

for( let scenario in Stats.scenarios ) {
    console.log(`Scenario: ${scenario}: ${Stats.scenarios[scenario].length} scores`);
}

import { ipcMain } from 'electron';
// Register IPC listeners
ipcMain.on('stats-get-scenarios', (event, arg) => {
    console.log('stats-get-scenarios');
    event.returnValue = Object.keys(Stats.scenarios);
});