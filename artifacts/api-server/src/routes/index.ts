import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import teamRouter from "./team";
import galleryRouter from "./gallery";
import bookingsRouter from "./bookings";
import messagesRouter from "./messages";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(teamRouter);
router.use(galleryRouter);
router.use(bookingsRouter);
router.use(messagesRouter);
router.use(settingsRouter);

export default router;
