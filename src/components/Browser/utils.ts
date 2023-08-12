import HistoryList from "@/components/Browser/HistoryList";
import FocusList from "@/components/Browser/FocusList";
import { innerRect } from "@/components/Window/utils";

export const features = ({ width, height, y, x } = screenRect()) =>
  `top=${y},left=${x},width=${width},height=${height},nodeIntegration=no,popup`;

export const screenRect = (rect = innerRect(false, undefined, innerOffset)) =>
({
  x: rect.x + screenLeft,
  y: rect.y + screenTop,

  height: rect.height,
  width: rect.width
});

export const innerOffset = { height: 26, width: 0, y: 26, x: 0 };

export const rectOffset = (rect: Rectangle) =>
  screenRect(innerRect(false, { ...rect }, innerOffset));

export const startUrl = "https://www.google.com/";
export const historyList = new HistoryList();
export const focusList = new FocusList();
export const windowOffset = [25, 25];
