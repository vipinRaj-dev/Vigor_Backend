"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const tokenVerify_1 = require("../middleware/tokenVerify");
const isPremiumUser_1 = require("../middleware/isPremiumUser");
const userProfileController_1 = require("../controllers/userProfileController");
const upload_1 = __importDefault(require("../middleware/upload"));
const userTrainerController_1 = require("../controllers/userTrainerController");
const paymentController_1 = require("../controllers/paymentController");
const isUserBlocked_1 = require("../middleware/isUserBlocked");
const userRouter = express_1.default.Router();
userRouter.get("/homePage", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, isPremiumUser_1.isPremiumUser, userProfileController_1.userHomePage);
userRouter.get("/getGraphs", tokenVerify_1.tokenVerify, userProfileController_1.getGraphDataUser);
userRouter.get("/profile", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, isPremiumUser_1.isPremiumUser, userProfileController_1.userProfile);
userRouter.put("/profileUpdate", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, upload_1.default.single("image"), userProfileController_1.userProfileImageUpdate);
userRouter.post("/create-checkout-session", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, paymentController_1.createCheckoutSession);
userRouter.post("/webhook", express_1.default.raw({ type: "application/json" }), paymentController_1.handleWebhook);
userRouter.get("/getAllTrainers", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, userTrainerController_1.getAllTrainers);
userRouter.get("/getTrainer/:id", tokenVerify_1.tokenVerify, isPremiumUser_1.isPremiumUser, isUserBlocked_1.IsUserBlocked, userTrainerController_1.getSingleTrainer);
userRouter.put("/addFoodLog", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, userProfileController_1.addFoodLog);
userRouter.get("/getDate/:date", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, userProfileController_1.getDay);
userRouter.post("/rating", tokenVerify_1.tokenVerify, isUserBlocked_1.IsUserBlocked, userProfileController_1.setRating);
userRouter.get("/getTrainerOnlineStatus/:trainerId/:userId", tokenVerify_1.tokenVerify, userProfileController_1.trainerOnlineStatus);
userRouter.get("/getUser", tokenVerify_1.tokenVerify, userProfileController_1.getUserName);
userRouter.post("/applyReason", tokenVerify_1.tokenVerify, userProfileController_1.applyReason);
// userRouter.get("/attandance", attendance);
exports.default = userRouter;
