import mongoose from "mongoose";
import { Blog } from "../models/Blog.model.js";
import { v2 as cloudinary } from "cloudinary";
export const createBlog = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog Image is Required" });
    }
    const { blogImage } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg and png are allowed",
      });
    }
    const { title, category, about } = req.body;
    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: "Title , Category and About are required Field" });
    }
    const adminName = req?.user?.name;
    const adminPhoto = req?.user?.photo;
    const createdBy = req?.user?._id;
    const uploadResult = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );
    if (!uploadResult || uploadResult.error) {
      console.log(uploadResult.error);
    }
    const blogData = {
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      },
    };
    const blog = await Blog.create(blogData);

    res.status(400).json({
      message: "blog created successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server" });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(403).json({ error: "Blog not found" });
  }
  await blog.deleteOne();
  res.status(200).json({ message: "Blog deleted Successfully" });
};

export const getAllBlog = async (req, res) => {
  const allBlog = await Blog.find();
  res.status(200).json(allBlog);
};

export const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(403).json({ error: "Blog not found" });
  }
  res.status(200).json(blog);
};

export const myBlog = async (req, res) => {
  const createdBy = req.user._id;
  const myBlogs = await Blog.find({ createdBy });
  res.status(200).json(myBlogs);
};
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.status(200).json(updatedBlog);
};
