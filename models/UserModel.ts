import mongoose, { Schema, Document } from "mongoose";

export interface workoutType extends Document {
  _id: string;
  date: Date;
  workoutId: mongoose.Types.ObjectId;
  workoutSet: [
    {
      reps: number;
      weight: number;
    }
  ];
}

const setWorkoutSet = new Schema({
  date: { type: Date, required: true },
  workoutId: { type: mongoose.Types.ObjectId, required: true },
  workoutSet: {
    type: [
      {
        reps: Number,
        weight: Number,
      },
    ],
    required: true,
  },
});

export interface FoodTypeWithTime extends Document {
  _id?: string;
  date: Date;
  foodId: mongoose.Types.ObjectId;
  timePeriod?: string;
  time?: string;
  quantity?: number;
}

const setFoodtime = new Schema({
  date: { type: Date, required: true },
  foodId: { type: mongoose.Types.ObjectId, ref: "Food", required: true },
  timePeriod: {
    type: String,
    default: "morning",
  },
  time: { type: String, default: "00:00" },
  quantity: { type: Number, default: 0 },
});

export interface healthIssuesType extends Document {
  _id?: string;
  BloodPressure: number;
  Diabetes: number;
  cholesterol: number;
  HeartDisease: boolean;
  KidneyDisease: boolean;
  LiverDisease: boolean;
  Thyroid: boolean;
}
const HealthIssuesSchema = new Schema<healthIssuesType>({
  BloodPressure: { type: Number, default: 0 },
  Diabetes: { type: Number, default: 0 },
  cholesterol: { type: Number, default: 0 },
  HeartDisease: { type: Boolean, default: false },
  KidneyDisease: { type: Boolean, default: false },
  LiverDisease: { type: Boolean, default: false },
  Thyroid: { type: Boolean, default: false },
});

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
  healthIssues?: healthIssuesType;
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
  // latestWorkout?: [workoutType];
  latestDiet?: [FoodTypeWithTime];
  trialEndsAt: Date;
  attendanceId: mongoose.Types.ObjectId;
  isOnline : boolean;
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
    healthIssues: { type: HealthIssuesSchema, default: {} },
    isPremiumUser: { type: Boolean, default: false },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
    dueDate: Date,
    trainerPaymentDueDate: Date,
    vegetarian: Boolean,
    publicId: String,
    profileImage: String,

    subscriptionDetails: {
      type: [mongoose.Types.ObjectId],
      ref: "AdminPayment",
    },
    trainerPaymentDetails: {
      type: [mongoose.Types.ObjectId],
      ref: "TrainerPayment",
    },

    // latestWorkout: [setWorkoutSet],
    latestDiet: [setFoodtime],

    trialEndsAt: Date,
    attendanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserType>("User", UserSchema);
