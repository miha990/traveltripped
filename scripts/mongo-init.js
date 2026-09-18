// MongoDB initialization script
db = db.getSiblingDB('traveltripped');

db.createCollection('users');
db.createCollection('destinations');
db.createCollection('hotels');
db.createCollection('flights');
db.createCollection('bookings');

db.users.createIndex({ email: 1 }, { unique: true });
db.bookings.createIndex({ userId: 1 });
db.bookings.createIndex({ referenceNumber: 1 }, { unique: true, sparse: true });
db.hotels.createIndex({ destinationId: 1 });
db.flights.createIndex({ originCode: 1, destinationCode: 1 });

print('TravelTripped database initialized successfully');
