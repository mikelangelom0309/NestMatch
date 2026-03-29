//Run the Python script from Node.js backend
const { exec } = require('child_process');
const path = require('path');

//Generate embedding using Python script
// function generateEmbedding(query) {
//     return new Promise((resolve, reject) => {
//         exec(`python ./backend/embeddingModel.py "${query}"`, (error, stdout, stderr) => {
//             if (error) {
//                 reject(`Error generating embedding: ${stderr}`);
//             } else {
//                 const embedding = JSON.parse(stdout); // Parse the JSON output from Python
//                 resolve(embedding);  // Return the embedding
//             }
//         });
//     });
// }

// module.exports = { generateEmbedding };

function generateEmbedding(query) {
    return new Promise((resolve, reject) => {
        // __dirname is already inside /backend, so just reference the file directly
        const scriptPath = path.join(__dirname, 'embeddingModel.py');
        const command = `python "${scriptPath}" "${query}"`;
        console.log("Running command:", command);
        
        exec(command, (error, stdout, stderr) => {
            console.log("stdout:", stdout);
            console.log("stderr:", stderr);
            console.log("error:", error);
            
            if (error) {
                reject(`Error generating embedding: ${stderr}`);
            } else {
                try {
                    const embedding = JSON.parse(stdout);
                    console.log("Parsed embedding length:", embedding.length);
                    resolve(embedding);
                } catch(parseError) {
                    console.error("JSON parse failed:", parseError);
                    reject(`Parse error: ${parseError}`);
                }
            }
        });
    });
}

module.exports = { generateEmbedding };