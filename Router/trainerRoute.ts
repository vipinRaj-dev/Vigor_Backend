import express from "express";
import { tokenVerify } from "../middleware/tokenVerify";
import {
  addCertificateAndClient,
  deleteCertificateOrClient,
  getClients,
  getPayments,
  getReviews,
  trainerProfile,
  trainerProfileImageUpdate,
} from "../controllers/trainerProfileController";
import upload from "../middleware/upload";
import { allClients } from "../controllers/trainerUserController";
import { isTrainerBlocked } from "../middleware/trainerBlock";

const trainerRouter: express.Router = express.Router();

trainerRouter.get("/profile", tokenVerify, isTrainerBlocked, trainerProfile);

trainerRouter.put(
  "/profileUpdate",
  tokenVerify,
  upload.single("image"),
  trainerProfileImageUpdate
);

trainerRouter.put(
  "/addCertificate",
  tokenVerify,
  upload.single("image"),
  addCertificateAndClient
);

trainerRouter.delete(
  "/deleteCertificateOrClient",
  tokenVerify,
  deleteCertificateOrClient
);

trainerRouter.get("/allClients", tokenVerify, allClients);

trainerRouter.get("/reviews", tokenVerify, getReviews);

trainerRouter.get("/payments", tokenVerify, getPayments);

trainerRouter.get("/getClients", tokenVerify, getClients);

export default trainerRouter;
