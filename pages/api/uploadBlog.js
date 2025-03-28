import connectMongo from "@/database/conn";
import Blog from "@/model/Blog";
import { Users } from "@/model/Schema";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Enhanced Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 120000 // 120 seconds timeout
});

// Configure multer with file size limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Connect to MongoDB
  try {
    await connectMongo();
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ error: "Database connection failed" });
  }

  // Process file upload
  let fileProcessed = false;
  try {
    await new Promise((resolve, reject) => {
      upload.single('image')(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return reject(new Error('File size too large (max 10MB)'));
          }
          return reject(err);
        }
        fileProcessed = true;
        resolve();
      });
    });
  } catch (uploadError) {
    return res.status(400).json({ 
      error: "File upload error",
      details: uploadError.message
    });
  }

  const { email, title, description, content, scheduleDate, status, category } = req.body;

  // Validate required fields
  if (!email || !title || !description || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Find user
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let imageUrl = null;
    let imagePublicId = null;
    let uploadResult = null;

    // Process image if file was uploaded
    if (fileProcessed && req.file) {
      try {
        // Prepare for upload
        const buffer = req.file.buffer;
        const base64Image = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;

        // Upload with progress tracking
        console.log('Starting Cloudinary upload...');
        uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "blog_images",
              resource_type: "auto",
              chunk_size: 6000000, // 6MB chunks
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(new Error('Image upload failed: ' + error.message));
              } else {
                console.log('Upload completed:', result.public_id);
                resolve(result);
              }
            }
          );

          // Set timeout
          const timeout = setTimeout(() => {
            uploadStream.destroy(new Error('Upload timeout after 2 minutes'));
          }, 120000);

          uploadStream.on('finish', () => clearTimeout(timeout));
          uploadStream.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });

          // Start upload
          uploadStream.write(base64Image);
          uploadStream.end();
        });

        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Image processing failed:', uploadError);
        return res.status(500).json({ 
          error: "Image processing failed",
          details: uploadError.message
        });
      }
    }

    // Create blog post
    const blog = new Blog({
      userId: user._id,
      title,
      description,
      content,
      scheduleDate: scheduleDate || new Date(),
      status: status || "draft",
      category: category || "Uncategorized",
      imageUrl,
      imagePublicId
    });

    await blog.save();

    return res.status(201).json({ 
      success: true,
      message: "Blog uploaded successfully",
      blogId: blog._id,
      imageUrl
    });

  } catch (error) {
    console.error("Blog creation error:", error);
    
    // Cleanup uploaded image if something failed
    if (uploadResult?.public_id) {
      try {
        console.log('Attempting to cleanup uploaded image...');
        await cloudinary.uploader.destroy(uploadResult.public_id);
        console.log('Cleanup successful');
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }
    }

    return res.status(500).json({ 
      error: "Blog creation failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}