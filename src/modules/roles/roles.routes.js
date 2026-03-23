import express from "express";
import { createRole, getAllRoles } from "./roles.controller.js";


const roleRouter = express.Router();

roleRouter.post("/create", createRole);
roleRouter.get("/", getAllRoles);

export default roleRouter;