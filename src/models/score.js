import { readFileSync } from 'fs';

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
                    score.scenario = value;
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

export { Score };