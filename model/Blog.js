import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Profile", 
      required: true 
    }, // Reference to Profile model

    title: { 
      type: String, 
      required: [true, "Title is required"], 
      trim: true 
    },

    description: { 
      type: String, 
      required: [true, "Description is required"], 
      trim: true 
    },

    content: { 
      type: String, 
      required: [true, "Content is required"] 
    },

    category: { 
      type: String, 
      required: [true, "Category is required"], 
      trim: true 
    },

    scheduleDate: { 
      type: Date, 
      required: [true, "Schedule date is required"] 
    },

    status: { 
      type: String, 
      enum: ["draft", "published"], 
      default: "draft", 
      required: true 
    },

    imageUrl: { 
      type: String, 
      required: [true, "Image URL is required"] 
    }
  }, 
  { timestamps: true } // Adds createdAt and updatedAt timestamps automatically
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blog;
