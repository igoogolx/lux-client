import { nativeImage } from "electron";
import { getTray } from "./utils";

export const NotificationIcon = nativeImage.createFromPath(getTray());
