"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDiet = exports.getClientFoodDetails = exports.decreasePerFoodQuantity = exports.addFoodToLatestDiet = exports.getAllFood = exports.deletePerFood = exports.setTimeDetails = exports.clientDetailsAndLatestFood = void 0;
const UserModel_1 = require("../models/UserModel");
const ListOfFood_1 = require("../models/ListOfFood");
const AttendanceModel_1 = require("../models/AttendanceModel");
const FoodLogModel_1 = require("../models/FoodLogModel");
const clientDetailsAndLatestFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.id;
        // console.log('clientid' , clientId)
        const client = yield UserModel_1.User.findById(clientId).populate("latestDiet.foodId");
        // console.log(client.latestDiet);
        res.status(200).json(client);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "server error",
        });
    }
});
exports.clientDetailsAndLatestFood = clientDetailsAndLatestFood;
const setTimeDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.clientId;
        const foodDocId = req.params.foodDocId;
        const client = yield UserModel_1.User.findById(clientId);
        const AddTimeDetails = {
            time: req.body.time,
            timePeriod: req.body.timePeriod,
            quantity: req.body.quantity,
        };
        // console.log(AddTimeDetails);
        const clientFood = client.latestDiet.find((food) => food._id == foodDocId);
        if (clientFood) {
            clientFood.time = AddTimeDetails.time;
            clientFood.timePeriod = AddTimeDetails.timePeriod;
            clientFood.quantity = AddTimeDetails.quantity;
            yield client.save();
        }
        res.status(200).json({ msg: "time set succesfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "server error" });
    }
});
exports.setTimeDetails = setTimeDetails;
const deletePerFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.clientId;
        const foodDocId = req.params.foodDocId;
        // console.log(clientId, foodDocId);
        const ans = yield UserModel_1.User.updateOne({ _id: clientId }, { $pull: { latestDiet: { _id: foodDocId } } });
        // console.log(ans);
        res.status(200).json({ msg: "food removed" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "server error" });
    }
});
exports.deletePerFood = deletePerFood;
const getAllFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 3;
        const search = req.query.search || "";
        const filter = req.query.filter || "";
        const query = Object.assign(Object.assign({}, (search
            ? {
                $or: [
                    { foodname: new RegExp(search, "i") },
                    { ingredients: new RegExp(search, "i") },
                ],
            }
            : {})), (filter ? { foodtype: filter } : {}));
        const totalFoodCount = yield ListOfFood_1.Food.countDocuments(query);
        const clientId = req.params.id;
        // console.log("clientid ", clientId);
        const allFood = yield ListOfFood_1.Food.find(query)
            .skip(page * limit)
            .limit(limit);
        const user = yield UserModel_1.User.findById({ _id: clientId });
        const listOfFood = user === null || user === void 0 ? void 0 : user.latestDiet;
        const foodIds = listOfFood ? listOfFood.map((food) => food.foodId) : [];
        res.status(200).json({
            allFood: allFood,
            listOfFood: foodIds,
            page: page + 1,
            limit,
            totalFoodCount,
        });
    }
    catch (error) {
        console.error("Error getting all food:", error);
        res.status(500).json({ msg: "Error getting all food", error });
    }
});
exports.getAllFood = getAllFood;
const addFoodToLatestDiet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.id;
        const { foodId } = req.body;
        // console.log(foodId, clientId);
        const food = yield ListOfFood_1.Food.findById(foodId);
        // console.log(food._id);
        const foodToAdd = {
            date: new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })),
            foodId: food._id,
        };
        const client = yield UserModel_1.User.findById(clientId);
        // console.log(client.latestDiet);
        const ans = yield UserModel_1.User.updateOne({ _id: clientId }, { $push: { latestDiet: foodToAdd } });
        // console.log(ans);
        res.status(200).json({ msg: "food added", foodId: food._id });
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({
            msg: "server error",
        });
    }
});
exports.addFoodToLatestDiet = addFoodToLatestDiet;
const decreasePerFoodQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = req.params.clientId;
        const foodId = req.params.foodId;
        // console.log(foodId);
        const client = yield UserModel_1.User.findById(clientId);
        const findFood = client.latestDiet.find((food) => {
            // console.log(food);
            return food.foodId.toString() === foodId;
        });
        // console.log("findFood" , findFood);
        const ans = yield UserModel_1.User.updateOne({ _id: clientId }, { $pull: { latestDiet: { _id: findFood._id } } });
        // console.log(ans);
        res.status(200).json({ msg: "food removed" });
    }
    catch (error) {
        console.error(error);
    }
});
exports.decreasePerFoodQuantity = decreasePerFoodQuantity;
const getClientFoodDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, date } = req.params;
        // console.log(userId, date);
        // const userDate = new Date(req.params.date);
        // const startOfUserDate = new Date(userDate.setHours(0, 0, 0, 0));
        // const endOfTheDay = new Date(userDate.setHours(23, 59, 59, 999));
        const today = new Date(new Date(req.params.date).toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
        }));
        today.setHours(0, 0, 0, 0);
        const attandanceData = yield AttendanceModel_1.Attendance.findOne({
            userId: userId,
            date: today,
        })
            .populate({
            path: "foodLogs",
            populate: {
                path: "foodId",
            },
        })
            .populate({
            path: "workOutLogs",
            populate: {
                path: "workOuts.workoutId",
            },
        });
        // console.log("attandanceData", attandanceData.workOutLogs);
        res.status(200).json({ msg: "attandanceData", attandanceData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "server error" });
    }
});
exports.getClientFoodDetails = getClientFoodDetails;
const UpdateDiet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("inside the  update diet controller");
        // const requstedUser: string | string[] | any = req.headers["user"];
        // const id = requstedUser.userId;
        const id = req.body.client_Id;
        // console.log("userId of the requested one", id);
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        today.setHours(0, 0, 0, 0);
        const deleteExistingFoodLogs = yield FoodLogModel_1.FoodLog.deleteMany({
            userId: id,
            date: today,
        });
        // console.log("deleted the existing food logs", deleteExistingFoodLogs);
        const user = yield UserModel_1.User.findById(id);
        const attandanceData = yield AttendanceModel_1.Attendance.updateOne({ _id: user.attendanceId }, { $set: { foodLogs: [] } });
        // console.log("attendanceData deleted", attandanceData);
        const foodLogsIds = yield Promise.all(user === null || user === void 0 ? void 0 : user.latestDiet.map((food) => __awaiter(void 0, void 0, void 0, function* () {
            const foodLogData = new FoodLogModel_1.FoodLog({
                date: today,
                userId: user === null || user === void 0 ? void 0 : user._id,
                foodId: food.foodId,
                status: false,
                timePeriod: food.timePeriod,
                time: food.time,
                quantity: food.quantity,
            });
            const foodLogId = yield foodLogData.save();
            return foodLogId._id;
        })));
        const ans = yield AttendanceModel_1.Attendance.updateOne({ _id: user.attendanceId }, { $set: { foodLogs: foodLogsIds } });
        // console.log("updated succesfully", ans);
        res.status(200).json("updated successfully");
    }
    catch (error) {
        console.log("error in the update existing diet");
        console.log(error);
    }
});
exports.UpdateDiet = UpdateDiet;
