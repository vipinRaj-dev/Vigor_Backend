import mongoose, { Schema, Document } from "mongoose";

import { Attendance, AttendanceType } from "./AttendanceModel";

export interface WorkoutTypeFromTrainer extends Document {
  _id?: string;
  date: Date;
  workoutId: mongoose.Types.ObjectId;
  workoutSet: [[number, number]];
}
 
const SetWorkoutFromTrainer = new Schema(
  {
    date: { type: Date, required: true },
    workoutId: { type: mongoose.Types.ObjectId, required: true },
    workoutSet: { type: [[Number, Number]], required: true },
  },
  { _id: false }
);

export interface FoodTypeFromTrainer extends Document {
  _id?: string;
  date: Date;
  foodId: mongoose.Types.ObjectId;
  timePeriod: "morning" | "afternoon" | "evening";
  time: string;
  quantity: string;
}

const SetFoodFromTrainer = new Schema(
  {
    date: { type: Date, required: true },
    foodId: { type: mongoose.Types.ObjectId, required: true },
    timePeriod: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    time: { type: String, required: true },
    quantity: { type: String, required: true },
  },
  { _id: false }
);

export interface UserType extends Document {
  _id?: string;
  admissionNumber?: number;
  name: string;
  email: string;
  mobileNumber?: number;
  password: string;
  weight?: number;
  height?: number;
  role: string;
  userBlocked: boolean;
  healthIssues?: string[];
  isPremiumUser?: boolean;
  trainerId?: mongoose.Types.ObjectId;
  dueDate?: Date;
  trainerPaymentDueDate?: Date; 
  vegetarian?: boolean;
  profileImage?: string;
  publicId?: string;
  // attendance?: [AttendanceType];
  subscriptionDetails?: mongoose.Types.ObjectId[];
  trainerPaymentDetails?: mongoose.Types.ObjectId[];
  latestWorkoutByTrainer?: [WorkoutTypeFromTrainer];
  latestFoodByTrainer?: [FoodTypeFromTrainer];
  trialEndsAt: Date,
  createdAt?: Date;
  updatedAt?: Date;
}

// schema design
const UserSchema: Schema<UserType> = new Schema(
  {
    admissionNumber: Number,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: Number,
    password: { type: String, required: true },
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    role: { type: String, default: "user" }, 
    userBlocked: { type: Boolean, default: false },
    healthIssues: { type: [String], default: [] },
    isPremiumUser: { type: Boolean, default: false },
    trainerId: mongoose.Types.ObjectId,
    dueDate: Date,
    trainerPaymentDueDate: Date,
    vegetarian: Boolean,
    publicId: String,
    profileImage: String,

    subscriptionDetails: { type: [mongoose.Types.ObjectId], ref: "AdminPayment" },
    trainerPaymentDetails: {
      type: [mongoose.Types.ObjectId],
      ref: "TrainerPayment",
    },

    latestWorkoutByTrainer: [SetWorkoutFromTrainer],
    latestFoodByTrainer: [SetFoodFromTrainer],

    trialEndsAt: Date,
    
    // attendance: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: Attendance,
    //   },
    // ],
  },
  { timestamps: true }
);

export const User = mongoose.model<UserType>("User", UserSchema);
