import express from "express";

import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();

import dotenv from "dotenv";
dotenv.config();

import {
  createListing,
  createMultipleListings,
  listDatabases,
  findListings,
  findOneListingByName,
  findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews,
} from "./src/crud/crud.js";

//env variables for secret keys
const pw = process.env.MONGO_PASSWORD;
const dbMongo = process.env.APP_NAME;
console.log(`${pw} ${dbMongo}`);

async function main() {
  //uri (need to url encode or have it in a hidden/dotenv file soon)
  const uri = `mongodb+srv://ben40d9:${pw}@${dbMongo}.fm7gp23.mongodb.net/?retryWrites=true&w=majority`;

  //our client
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect(() => {
      const collection = client.db("test").collection("devices");
    });

    // Make the appropriate DB calls

    await listDatabases(client);
    await findListings(client, 5);
    await findOneListingByName(client, "Lovely Loft");

    await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
      minimumNumberOfBedrooms: 4,
      minimumNumberOfBathrooms: 2,
      maximumNumberOfResults: 5,
    });

    // // Create a single new listing
    // await createListing(client, {
    //   name: "Lovely Loft",
    //   summary: "A charming loft in Paris",
    //   bedrooms: 1,
    //   bathrooms: 1,
    // });

    // await createMultipleListings(client, [
    //   {
    //     name: "Infinite Views",
    //     summary: "Modern home with infinite views from the infinity pool",
    //     property_type: "House",
    //     bedrooms: 5,
    //     bathrooms: 4.5,
    //     beds: 5,
    //   },
    //   {
    //     name: "Private room in London",
    //     property_type: "Apartment",
    //     bedrooms: 1,
    //     bathroom: 1,
    //   },
    //   {
    //     name: "Beautiful Beach House",
    //     summary:
    //       "Enjoy relaxed beach living in this house with a private beach",
    //     bedrooms: 4,
    //     bathrooms: 2.5,
    //     beds: 7,
    //     last_review: new Date(),
    //   },
    // ]);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

// //CREATE

// //function to create a new document (airBnB for now)
// async function createListing(client, newListing) {
//   const result = await client
//     .db("sample_airbnb")
//     .collection("listingsAndReviews")
//     .insertOne(newListing);
//   console.log(
//     `New listing created with the following id: ${result.insertedId}`
//   );
// }

// //function to create multiple documents
// async function createMultipleListings(client, newListings) {
//   //.insertMany will insert an array of documents into your collection
//   const result = await client
//     .db("sample_airbnb")
//     .collection("listingsAndReviews")
//     .insertMany(newListings);

//   console.log(
//     `${result.insertedCount} new listing(s) created with the following id(s):`
//   );
//   console.log(result.insertedIds);
// }

// //READ

// //function to findOne (airBnB for now)
// async function findOneListingByName(client, nameOfListing) {
//   const result = await client
//     .db("sample_airbnb")
//     .collection("listingsAndReviews")
//     .findOne({ name: nameOfListing });

//   if (result) {
//     console.log(
//       `Found a listing in the collection with the name '${nameOfListing}':`
//     );
//     console.log(result);
//   } else {
//     console.log(`No listings found with the name '${nameOfListing}'`);
//   }
// }

// //will retrieve a list of databases in our cluster and print the results in the console
// async function listDatabases(client) {
//   const databasesList = await client.db().admin().listDatabases();

//   await console.log("Databases:");
//   await databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
// }

// //function to query listings from the sample database
// async function findListings(client, resultsLimit) {
//   const cursor = client
//     .db("sample_airbnb")
//     .collection("listingsAndReviews")
//     .find()
//     .limit(resultsLimit);

//   const results = await cursor.toArray();
//   if (results.length > 0) {
//     console.log(`Found ${results.length} listing(s):`);
//     results.forEach((result, i) => {
//       const date = new Date(result.last_review).toDateString();

//       console.log();
//       console.log(`${i + 1}. name: ${result.name}`);
//       console.log(`   _id: ${result._id}`);
//       console.log(`   bedrooms: ${result.bedrooms}`);
//       console.log(`   bathrooms: ${result.bathrooms}`);
//       console.log(
//         `   most recent review date: ${new Date(
//           result.last_review
//         ).toDateString()}`
//       );
//     });
//   }
// }

app.listen(3000, () => {
  console.log("Server Started on port 3000");
});
