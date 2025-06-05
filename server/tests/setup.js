const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Setup test database before all tests
beforeAll(async () => {
  console.log("Setting up MongoDB Memory Server for tests");
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect mongoose to the test database with extra options
  await mongoose.connect(mongoUri, {
    dbName: "GymManagementTest",
    // Add these options for better compatibility
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log(`MongoDB Memory Server connected at: ${mongoUri}`);
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Set test timeout
jest.setTimeout(30000);
