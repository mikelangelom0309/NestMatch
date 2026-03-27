const { generateEmbedding } = require('./embeddingModel');

async function run() {
    try {
        const embedding = await generateEmbedding("3 bed house with backyard");
        console.log("Embedding length:", embedding[0].length || embedding.length); // Log the length of the embedding vector
        console.log("First few values:", embedding[0]?.slice?.(0, 5) || embedding.slice(0, 5)); // Log the first few values of the embedding vector
    } catch (error) {
        console.log(error);
    }
}

run();