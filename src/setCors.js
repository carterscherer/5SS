const { Storage } = require('@google-cloud/storage');

// Replace with your bucket name
const BUCKET_NAME = 'fivess-d8683.appspot.com';

// Initialize the Google Cloud Storage client
const storage = new Storage();

async function setCorsPolicy() {
    try {
        // Define the CORS configuration
        const corsConfig = [
            {
                origin: ['http://localhost:3000'], // Add your origin(s)
                responseHeader: ['Content-Type'],
                method: ['GET', 'POST', 'PUT', 'DELETE'],
                maxAgeSeconds: 3600,
            },
        ];

        // Set CORS policy for the bucket
        await storage.bucket(BUCKET_NAME).setCorsConfiguration(corsConfig);

        console.log(`CORS policy updated for bucket: ${BUCKET_NAME}`);
    } catch (err) {
        console.error('Error setting CORS policy:', err);
    }
}

setCorsPolicy();
