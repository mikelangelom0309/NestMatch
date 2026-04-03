console.log("Seed database script started...");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { connectDatabase } = require('./database/connections');
const { generateEmbedding } = require('./embeddingModel');
const Home = require('./models/home');
require('dotenv').config();

async function seedDatabase() {
    try {
        // Connect Mongoose directly instead of using connectDatabase()
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://mikelangelom0309_db_user:YayoYaya2113@nestmatch.meuxx7w.mongodb.net/?appName=NestMatch";
        await mongoose.connect(mongoURI, { dbName: "nestmatch" });
        console.log("Mongoose connected to MongoDB");

        // Clear existing homes
        await Home.deleteMany({});
        console.log("Cleared existing homes");

        // Read CSV file
        const csvPath = path.join(__dirname, 'data', 'zillow-listings.csv');
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        console.log(`Found ${records.length} listings. Generating embeddings...`);

        for (let i = 0; i < records.length; i++) {
            const record = records[i];

            if (!record.Address || !record.Rent || !record.Beds) {
                console.log(`Skipping record ${i + 1} - missing fields`);
                continue;
            }

            const description = `${record.Beds} bedroom ${record.Baths} bathroom 
                ${record['Property Type']} in ${record.City}, ${record.State}. 
                Rent is $${record.Rent} per month. 
                ${record.Sqft !== 'n/a' ? `${record.Sqft} square feet.` : ''}
                Located at ${record.Address}.`;

            try {
                console.log(`[${i + 1}/${records.length}] Embedding: ${record.Address}`);
                const embedding = await generateEmbedding(description);

                const home = new Home({
                    id: record['Uniq Id'],
                    address: record.Address,
                    price: parseFloat(record.Rent) || 0,
                    bedrooms: parseFloat(record.Beds) || 0,
                    bathrooms: parseFloat(record.Baths) || 0,
                    sqft: parseFloat(record.Sqft) || 0,
                    city: record.City,
                    state: record.State,
                    zipCode: record.Zip,
                    description: description,
                    latitude: parseFloat(record.Latitude) || 0,
                    longitude: parseFloat(record.Longitude) || 0,
                    propertyType: record['Property Type'],
                    propertyURL: record['Property Url'],
                    embedding: embedding
                });

                await home.save();
                console.log(`✓ Saved: ${record.Address}`);

            } catch (err) {
                console.error(`✗ Failed on ${record.Address}:`, err);
            }
        }

        console.log("Seeding complete!");
        mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seedDatabase();