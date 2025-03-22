import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🚀 Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("MongoDB Connection Failed");
  }
};

export default connectMongo;
