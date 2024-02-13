const fs = require('fs');

// Read input JSON file
const rawData = fs.readFileSync('heartrate.json');
const heartRateData = JSON.parse(rawData);

// Function to calculate median
function calculateMedian(arr) {
    const sortedArr = arr.slice().sort((a, b) => a - b);
    const middle = Math.floor(sortedArr.length / 2);
    return sortedArr.length % 2 === 0 ? (sortedArr[middle - 1] + sortedArr[middle]) / 2 : sortedArr[middle];
}

// Process the data
const processedData = {};
// Iterate through heart rate measurements
for (const measurement of heartRateData) {
    const startDate = new Date(measurement.timestamps.startTime);
    const date = startDate.toISOString().substring(0, 10);
    const beatsPerMinute = measurement.beatsPerMinute;

    // Update processed data for the day
    if (!processedData[date]) {
        processedData[date] = {
            date: date,
            min: beatsPerMinute,
            max: beatsPerMinute,
            beats: [beatsPerMinute],
            latestDataTimestamp: measurement.timestamps.endTime
        };
    } else {
        const data = processedData[date];
        data.min = Math.min(data.min, beatsPerMinute);
        data.max = Math.max(data.max, beatsPerMinute);
        data.beats.push(beatsPerMinute);
        data.latestDataTimestamp = measurement.timestamps.endTime;
    }
}

// Calculate median for each day
for (const date in processedData) {
    processedData[date].median = calculateMedian(processedData[date].beats);
    delete processedData[date].beats; // Remove temporary array used for median calculation
}

// Write to output JSON file
const outputData = Object.values(processedData);
const outputJson = JSON.stringify(outputData, null, 2);
fs.writeFileSync('output.json', outputJson);

console.log('Output has been written to output.json');
