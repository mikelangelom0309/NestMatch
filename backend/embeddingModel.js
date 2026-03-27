//Run the Python script from Node.js backend
const { exec } = require('child_process');

//Generate embedding using Python script
function generateEmbedding(query) {
    return new Promise((resolve, reject) => {
        exec(`python ./backend/embeddingModel.py "${query}"`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error generating embedding: ${stderr}`);
            } else {
                const embedding = JSON.parse(stdout); // Parse the JSON output from Python
                resolve(embedding);  // Return the embedding
            }
        });
    });
}

module.exports = { generateEmbedding };