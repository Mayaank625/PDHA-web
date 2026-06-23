const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Try to load MONGODB_URI from .env.local
let mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/^MONGODB_URI\s*=\s*(.+)$/m);
      if (match) {
        mongodbUri = match[1].trim();
      }
    }
  } catch (err) {
    console.error("Error reading .env.local:", err.message);
  }
}

// Allow overriding via command line argument
if (process.argv[2]) {
  mongodbUri = process.argv[2];
}

if (!mongodbUri) {
  console.error("Error: MONGODB_URI not found.");
  console.log("Please either:");
  console.log("  1. Add MONGODB_URI to your .env.local file");
  console.log("  2. Pass the connection string as an argument: node scripts/seed-admin.js \"your-connection-string\"");
  process.exit(1);
}

// Clean connection string (remove quotes if any)
mongodbUri = mongodbUri.replace(/^['"]|['"]$/g, '');

const adminUser = {
  name: "Super Admin",
  email: "admin@pdho.org",
  passwordHash: "$2a$10$D2B4p5Q6VqYl0b9XgP8lA.RjNqKqZ8W/c4Hk9Yk8uX6f5E4D3C2B1", // password123
  role: "SuperAdmin",
  createdAt: new Date("2023-10-01T00:00:00Z")
};

async function seed() {
  console.log(`Connecting to MongoDB...`);
  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected successfully!");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Could not retrieve DB connection object");
    }
    const usersCollection = db.collection('users');

    // Check if the user already exists
    const existing = await usersCollection.findOne({ email: adminUser.email });
    if (existing) {
      console.log(`Admin user with email ${adminUser.email} already exists!`);
    } else {
      await usersCollection.insertOne(adminUser);
      console.log(`Successfully seeded Super Admin user!`);
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: password123`);
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
