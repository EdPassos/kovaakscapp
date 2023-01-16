
function sort(arr, sortBy, sortDir) {
    return arr.sort((a, b) => { 
        return compare(a[sortBy], b[sortBy], sortDir);
    });
}

function compare(a, b, sortOrder) {
    if( typeof a === 'string' ) {
        return compareStrings(a, b, sortOrder);
    }
    return compareNumbers(a, b, sortOrder);
}

function compareStrings(a, b, sortOrder) {
    if( sortOrder === 'desc' ) {
        return b.localeCompare(a);
    }
    return a.localeCompare(b);
}

function compareNumbers(a, b, sortOrder) {
    if( sortOrder === 'desc' ) {
        return b - a;
    }
    return a - b;
}

export { sort, compare, compareStrings, compareNumbers };