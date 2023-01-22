import categories from './categories';

var SCENARIOS = {}

class Scenario {
    constructor(data) {
        this.categories = [];
        for(let i = 0; i < data.categories.length; i++) {
            this.categories.push(categories[data.categories[i]]);
        }
        this.hash = data.hash;
        this.name = data.name;
        this.scores = [];
        this.simpleMovingAverages = [];
        this.exponentialMovingAverages = [];
        this.last_played_at = null;
        for( let category of this.categories ) {
            category.scenarios.push(this);
        }
        SCENARIOS[this.hash] = this;
    }

    static getByName(name) {
        let scenario = Object.values(SCENARIOS).find((scenario) => { return scenario.name == name; });
        if( scenario == null ) {
            console.error("Scenario not found: " + name);
            return new Scenario({name: name, categories: []});
        }
        return scenario;
    }

    addScore(score) {
        if( this.scores.length > 0 && this.scores[this.scores.length - 1].played_at > score.played_at) {
            console.error("Trying to add a score with a played_at date older than the last score");
            return false;
        }
        this.scores.push(score);
        this.simpleMovingAverages.push(this.calcSimpleMovingAverage(10));
        this.exponentialMovingAverages.push(this.calcExponentialMovingAverage(10));
        this.last_played_at = score.played_at;
        return true;
    }

    calcSimpleMovingAverage(runs) {
        let lastIndex = this.scores.length - 1;
        let sum = 0;
        let count = 0;
        for(let i = lastIndex; i >= 0 && i > lastIndex - runs; i--) {
            sum += this.scores[i].score;
            count++;
        }
        return sum / count;
    }

    calcExponentialMovingAverage(runs) {
        let lastIndex = this.scores.length - 1;
        let alpha = 2 / (runs + 1);
        if( lastIndex == 0 ) {
            return this.scores[0].score;
        }
        return alpha * this.scores[lastIndex].score + (1 - alpha) * this.exponentialMovingAverages[lastIndex - 1];
    }
}

// Read scenarios from config file
import scenarios from '../config/scenarios.json';

// Create scenario objects
let scenarioObjects = [];
for(let i = 0; i < scenarios.length; i++) {
    let newScenario = new Scenario(scenarios[i]);
    console.log(newScenario)
    scenarioObjects.push(newScenario);
}

export { Scenario }