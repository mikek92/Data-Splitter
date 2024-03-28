const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const inputCSVPath = 'data.csv'; // Replace with your actual CSV file path
const outputDir = 'data'; // Replace with your desired output directory
const chunkSize = 200; // Number of lines per chunk file

async function createChunkedCsvFiles() {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  let fileIndex = 0;
  let records = [];
  
  // Configure CSV parser to handle fields with commas correctly
  const parser = fs.createReadStream(inputCSVPath).pipe(parse({
    bom: true,
    columns: true,
    skip_empty_lines: true
  }));
  
  // Read and parse the CSV data
  parser.on('readable', async function() {
    let record;
    while (record = parser.read()) {
      records.push(record);
      
      // Check if the current chunk reached the chunkSize limit
      if (records.length === chunkSize) {
        await saveChunkToFile(records, fileIndex);
        records = [];
        fileIndex++;
      }
    }
  });
  
  // Listen for the end of the CSV to process the last chunk
  parser.on('end', async function() {
    if (records.length > 0) {
      await saveChunkToFile(records, fileIndex);
    }
    console.log('CSV chunking process completed.');
  });

  // Handle any errors
  parser.on('error', function(err) {
    console.error('An error occurred:', err.message);
  });
}

async function saveChunkToFile(records, index) {
  const filePath = path.join(outputDir, `chunk_${index}.csv`);
  // Convert array of records back into CSV string with newline characters
  const header = Object.keys(records[0]).join(',') + '\n';
  const chunkContent = records.map(record => {
    const recordValues = Object.values(record);
    // Use the csv-stringify library if necessary to handle complex fields
    return recordValues.map(value =>
      // Quote fields that contain commas or quotes
      /[,"]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',');
  });
  // Prepend the header and join with newlines
  const finalContent = [header].concat(chunkContent).join('\n');
  await fs.promises.writeFile(filePath, finalContent, 'utf8');
}

createChunkedCsvFiles()
  .then(() => console.log('All chunks have been saved successfully.'))
  .catch(error => console.error('An error occurred:', error));