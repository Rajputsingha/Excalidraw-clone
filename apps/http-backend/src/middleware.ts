import {NextFunction,Request,Response} from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-comman/config";

 export interface AuthenticatedRequest extends Request{
    userId?: string;
}
export function authmiddleware(
    req:AuthenticatedRequest,
    res:Response,
    next:NextFunction){
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Authorization header missing or invalid" });
            return;
        }
        const token = authHeader.slice(7); // remove "Bearer " prefix
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

          req.userId = decoded.userId;
          next();

    } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    return;
  }
}