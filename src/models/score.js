import { readFileSync } from 'fs';
import { Stats } from './stats.js';
console.log(Stats)

const KOVAAKS_STATS_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats";

class Score {
    constructor() {
        this.scenario = "";
        this.score = 0;
        this.kills = 0;
        this.hits = 0;
        this.missed = 0;
        this.fov = 103;
        this.fov_scale = "";
        this.damage = 0;
    }

    static fromCSV(csv) {
        let score = new Score();
        for(let line of csv.split("\n")) {
            let parts = line.split(",");
            if(parts.length < 2) continue;
            let key = parts[0];
            let value = parts[1];
            switch(key) {
                case "Scenario:":
                    score.scenario = value.replace(/\r$/, "");
                    // trim whitespace
                    score.scenario = score.scenario.replace(/^\s+|\s+$/g, '');
                    break;
                case "Score:":
                    score.score = parseFloat(value);
                    break;
                case "Kills:":
                    score.kills = parseInt(value);
                    break;
                case "Hit Count:":
                    score.hits = parseInt(value);
                    break;
                case "Miss Count:":
                    score.missed = parseInt(value);
                    break;
                case "FOV:":
                    score.fov = parseInt(value);
                    break;
                case "FOVScale:":
                    score.fov_scale = value;
                    break;
                case "Damage Done:":
                    score.damage = parseFloat(value);
                    break;
            }
        }
        Stats.addScore(score);
        return score;
    }

    static fromCSVFile(path) {
        let csv = readFileSync(path).toString()
        return Score.fromCSV(csv);
    }

    toString() {
        return `Scenario: ${this.scenario}
Score: ${this.score}
Kills: ${this.kills}
Hits: ${this.hits}
Missed: ${this.missed}
FOV: ${this.fov}
FOV Scale: ${this.fov_scale}
Damage: ${this.damage}
`;
    }

}

// Files are named like: "<scenario name> - Challenge - <date>-<time> Stats.csv"
// or "<scenario name> - <date>-<time> Stats.csv"
// Order by date and time
// files.sort((a, b) => {
//     let rx = /(\d{4}\.\d{2}\.\d{2})-(\d{2}\.\d{2}\.\d{2})/;
//     let aDate = rx.exec(a)[1];
//     let aTime = rx.exec(a)[2];
//     let bDate = rx.exec(b)[1];
//     let bTime = rx.exec(b)[2];
//     return bDate.localeCompare(aDate) || bTime.localeCompare(aTime);
// });



export { Score };