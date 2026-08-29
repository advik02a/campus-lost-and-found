import "../config/env.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const email = process.argv[2];

if (!email) {
  console.log("Usage: node scripts/makeAdmin.js someone@example.com");
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log(`No user found with email: ${email}`);
    } else {
      console.log(`${user.name} (${user.email}) is now an admin.`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();