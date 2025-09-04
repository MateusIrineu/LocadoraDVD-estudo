import DvdController from "./dvd.controller.js";

import express from "express";

const router = express.Router();

router.post("/create", DvdController.createDvd);
router.get("/list", DvdController.listDvds);
router.get("/list/:id", DvdController.getDvdById);
router.put("/update/:id", DvdController.updateDvd);
router.delete("/delete/:id", DvdController.deleteDvd);

export default router;