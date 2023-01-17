const KOVAAKS_STATS_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats";
import { Scenario } from "./scenario.js";

class StatsSingleton {
    constructor() {
        this.scenarios = {};
    }

    getScenarioScores(scenario) {
        return this.scenarios[scenario];
    }

    addScore(score) {
        if(!this.scenarios[score.scenario]) {
            this.scenarios[score.scenario] = new Scenario(score.scenario);
        }

        // Add score to scenario scores in the first position
        this.scenarios[score.scenario].addScore(score);
        // this.scenarios[score.scenario].scores.unshift(score);

        // if( this.scenarios[score.scenario].best === undefined || score.score > this.scenarios[score.scenario].best ) {
        //     this.scenarios[score.scenario].best = score.score;
        // }
        // if( this.scenarios[score.scenario].last_played_at === undefined || score.played_at > this.scenarios[score.scenario].last_played_at ) {
        //     this.scenarios[score.scenario].last_played_at = score.played_at;
        // }

    }

    sortScores() {
        for(let scenario in this.scenarios) {
            this.scenarios[scenario].scores.sort((a, b) => {
                return b.played_at - a.played_at;
            });
        }
    }
    
    calcScenarioMovingAverage(scenario, runs) {
        let scores = this.scenarios[scenario].scores;
        for(let i = 0; i < scores.length; i++) {
            let sum = 0;
            let count = 0;
            for(let j = i; j < scores.length && j < i + runs; j++) {
                sum += scores[j].score;
                count++;
            }
            scores[i].movingAverage = sum / count;
        }
    }

    calcScenarioExponentialMovingAverage(scenario, runs) {
        let scores = this.scenarios[scenario].scores;
        let alpha = 2 / (runs + 1);
        for( let i = scores.length - 1; i >= 0; i-- ) {
            if( i == scores.length - 1 ) {
                scores[i].exponentialMovingAverage = scores[i].score;
            } else {
                scores[i].exponentialMovingAverage = alpha * scores[i].score + (1 - alpha) * scores[i + 1].exponentialMovingAverage;
            }
        }
    }

    calcScenarioMovingAverages(runs) {
        for(let scenario in this.scenarios) {
            this.calcScenarioMovingAverage(scenario, runs);
            this.calcScenarioExponentialMovingAverage(scenario, runs);
        }
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
            best: Stats.scenarios[scenario].best,
            last_played_at: Stats.scenarios[scenario].last_played_at
        });
    }
    event.returnValue = stats;
});

ipcMain.on('stats-get-scenario', (event, scenario) => {
    event.returnValue = Stats.scenarios[scenario];
});


export { Stats };