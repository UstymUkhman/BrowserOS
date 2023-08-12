import HistoryList from "@/components/Browser/HistoryList";
import FocusList from "@/components/Browser/FocusList";
import { innerRect } from "@/components/Window/utils";

export const offset = [25.0, 25.0];
export const focusList = new FocusList();
export const historyList = new HistoryList();
export const url = "https://www.google.com/";

export const rectOffset = (rect: Rectangle) =>
  screenRect(innerRect(false, { ...rect }));

export const screenRect = (rect = innerRect()) => ({
  x: rect.x + screenLeft,
  y: rect.y + screenTop,
  height: rect.height,
  width: rect.width
});

export const features = ({ width, height, y, x } = screenRect()) =>
  `top=${y},left=${x},width=${width},height=${height},nodeIntegration=no,popup`;
