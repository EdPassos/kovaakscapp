// Read Score Data from a file
const KOVAAKS_STATS_PATH = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\FPSAimTrainer\\FPSAimTrainer\\stats";

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Get the list of files in the stats directory
const files = readdirSync(KOVAAKS_STATS_PATH);

// Files are named like: "<scenario name> - Challenge - <date>-<time> Stats.csv"
// or "<scenario name> - <date>-<time> Stats.csv"
// Order by date and time
files.sort((a, b) => {
    let rx = /(\d{4}\.\d{2}\.\d{2})-(\d{2}\.\d{2}\.\d{2})/;
    let aDate = rx.exec(a)[1];
    let aTime = rx.exec(a)[2];
    let bDate = rx.exec(b)[1];
    let bTime = rx.exec(b)[2];
    return bDate.localeCompare(aDate) || bTime.localeCompare(aTime);
});

// Read the first file
import { Score } from '../models/score.js';
let score = Score.fromCSVFile(join(KOVAAKS_STATS_PATH, files[0]));
console.log(score.toString());