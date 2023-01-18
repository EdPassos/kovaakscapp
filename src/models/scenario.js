
class Scenario {
    constructor(name) {
        this.name = name;
        this.scores = [];
        this.simpleMovingAverages = [];
        this.exponentialMovingAverages = [];
        this.last_played_at = null;
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

export { Scenario }