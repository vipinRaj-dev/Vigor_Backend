import express from "express";
import {
  removeFromCloudinary,
  uploadToCloudinary,
} from "../imageUploadConfig/cloudinary";
import { Food } from "../models/ListOfFood";

export const addFood = async (req: express.Request, res: express.Response) => {
  // console.log("addFood");
  // console.log(req.body);
  // console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ msg: "Please upload an image" });
  }
  const {
    foodname,
    quantity,
    foodtype,
    unit,
    fat,
    carbohydrate,
    calories,
    description,
    ingredients,
    protein,
  } = req.body;

  try {
    const data = await uploadToCloudinary(req.file.path, "food-Images");
    // console.log("data:", data);

    if (data && data.url && data.public_id) {
      //   console.log("data.url:", data.url);
      //   console.log("data.public_id:", data.public_id);
      //   console.log("ingredients:", ingredients.split(","));

      const newFood = new Food({
        foodname,
        description,
        quantity,
        unit,
        nutrition: {
          calories,
          protein,
          carbs: carbohydrate,
          fat,
        },
        ingredients: ingredients
          .split(",")
          .map((ingredient) => ingredient.trim()),
        photoUrl: data.url,
        publicId: data.public_id,
        foodtype,
      });
      const savedFood = await newFood.save();
      // console.log("savedFood:", savedFood);

      res.status(200).json({ message: "Food added successfully" });
    } else {
      res.status(401).json({ msg: "Image not updated" });
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return res.status(500).json({ msg: "Error uploading image", error });
  }
};

export const getAllFood = async (  
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = parseInt(req.query.page as string) - 1 || 0;
    const limit = parseInt(req.query.limit as string) || 3;
    const search = (req.query.search as string) || "";
    const filter = (req.query.filter as string) || "";

    const query = {
      ...(search
        ? {
            $or: [
              { foodname: new RegExp(search, "i") },
              { ingredients: new RegExp(search, "i") },
            ],
          }
        : {}),
      ...(filter ? { foodtype: filter } : {}),
    };

    const totalFoodCount = await Food.countDocuments(query);

    const allFood = await Food.find(query)
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({
      allFood: allFood,
      page: page + 1,
      limit,
      totalFoodCount,
    });
  } catch (error) {
    console.error("Error getting all food:", error);
    res.status(500).json({ msg: "Error getting all food", error });
  }
};

export const getSingleFood = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const food = await Food.findById(req.params.id);

    res.status(200).json(food);
  } catch (error) {
    console.error("Error getting single food:", error);
    res.status(500).json({ msg: "Error getting single food", error });
  }
};

export const updateFood = async (
  req: express.Request,
  res: express.Response
) => {
  const {
    foodname,
    quantity,
    foodtype,
    unit,
    fat,
    carbohydrate,
    calories,
    description,
    ingredients,
    protein,
  } = req.body;

  try {
    const foodData = await Food.findById(req.params.id);
    if (!foodData) {
      return res.status(404).json({ msg: "Food not found" });
    }

    let data;
    if (req.file?.path && foodData?.publicId) {
      await removeFromCloudinary(foodData.publicId);
      await foodData.updateOne(
        { _id: req.params.id },
        { $unset: { photoUrl: "", publicId: "" } }
      );
      data = await uploadToCloudinary(req.file.path, "food-Images");
    }

    const updatedFood = {
      foodname,
      description,
      quantity,
      unit,
      nutrition: {
        calories,
        protein,
        carbs: carbohydrate,
        fat,
      },
      ingredients: ingredients
        .split(",")
        .map((ingredient) => ingredient.trim()),
      foodtype,
      ...(data && { photoUrl: data.url, publicId: data.public_id }),
    };

    const savedFood = await Food.findByIdAndUpdate(req.params.id, updatedFood, {
      new: true,
    });

    res.status(200).json({ message: "Food updated successfully", savedFood });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ msg: "Error updating food", error });
  }
};

export const deleteFood = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const foodData = await Food.findById(req.params.id);

    if (foodData?.publicId) {
      const publicId = foodData.publicId;
      await removeFromCloudinary(publicId);
      await foodData.deleteOne();
    } else {
      console.log("no public id found");
    }

    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ msg: "Error deleting food", error });
  }
};
