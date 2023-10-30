const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("mongoose started");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await Listing.deleteMany({});
    data.data = data.data.map((obj) => ({
      ...obj,
      owner: "6535d219cd9ce1bb9e0e31e4",
    }));
    await Listing.insertMany(data.data);
    console.log("data was initialized");
  };
  

initDB();