
class Scenario {
    constructor(name) {
        this.name = name;
        this.scores = [];
        this.simpleMovingAverages = [];
    }

    addScore(score) {
        if( this.scores.length > 0 && this.scores[this.scores.length - 1].played_at > score.played_at) {
            console.error("Trying to add a score with a played_at date older than the last score");
            return false;
        }
        this.scores.push(score);
        this.calcSimpleMovingAverage(10);
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
        this.simpleMovingAverages.push(sum / count);
    }
}

export { Scenario }