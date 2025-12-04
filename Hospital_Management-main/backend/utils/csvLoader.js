// backend/utils/csvLoader.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import Hospital from "../models/Hospital.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const importHospitalsFromCSV = async () => {
  const filePath = path.join(__dirname, "..", "data", "hospitals.csv");
  console.log("Importing hospitals from CSV:", filePath);

  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
  // beds ko safe number banao
  const beds = Number(row.beds_available);
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);

  results.push({
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    beds_available: isNaN(beds) ? 0 : beds,         // 👈 yaha default 0
    phone_number: row.phone_number,
    ambulance_available: row.ambulance_available === "true",
    latitude: isNaN(latitude) ? 0 : latitude,       // optional safety
    longitude: isNaN(longitude) ? 0 : longitude,    // optional safety
  });
})

      .on("end", async () => {
        try {
          await Hospital.deleteMany({});
          await Hospital.insertMany(results);
          console.log(`Imported ${results.length} hospitals from CSV ✔`);
          resolve();
        } catch (err) {
          console.error("Error importing hospitals:", err);
          reject(err);
        }
      })
      .on("error", (err) => {
        console.error("Error reading CSV:", err);
        reject(err);
      });
  });
};
