import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Set different timeouts based on the endpoint
    const isUploadEndpoint = req.path.includes("/upload");
    const isVideoUpload = req.path.includes("/upload/video");

    if (isVideoUpload) {
      // 15 minutes timeout for video uploads
      req.setTimeout(900000);
      res.setTimeout(900000);
    } else if (isUploadEndpoint) {
      // 10 minutes timeout for regular uploads
      req.setTimeout(600000);
      res.setTimeout(600000);
    }

    next();
  }
}
