const KOVAAKS_STATS_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats";

// import { readdirSync } from 'fs';
// import { join } from 'path';
// import { Score } from './score.js';

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
        if(!this.scenarios[score.scenario].scores) {
            this.scenarios[score.scenario].scores = [];
        }
        this.scenarios[score.scenario].scores.push(score);
    }

}

const Stats = new StatsSingleton();

import { ipcMain } from 'electron';
// Register IPC listeners
ipcMain.on('stats-get-scenarios', (event, arg) => {
    let scenarios = Object.keys(Stats.scenarios);
    let stats = [];
    for (let scenario of scenarios) {
        stats.push({
            name: scenario,
            plays: Stats.scenarios[scenario].scores.length,
            best: Stats.scenarios[scenario].scores.reduce((best, score) => {
                return score.score > best ? score.score : best;
            }, 0)
        });
    }
    event.returnValue = stats;
});


export { Stats };