import RectList from "@/components/Browser/RectList";
import { innerRect } from "@/components/Window/utils";
import FocusList from "@/components/Browser/FocusList";
import HistoryList from "@/components/Browser/HistoryList";

export const features = ({ width, height, y, x } = screenRect()) =>
  `top=${y},left=${x},width=${width},height=${height},nodeIntegration=no,popup`;

export const screenRect = (rect = innerRect(false, undefined, innerOffset)) =>
({
  x: rect.x + screenLeft,
  y: rect.y + screenTop,

  height: rect.height,
  width: rect.width
});

export const rectOffset = (rect: Rectangle, screen: boolean) => {
  const inner = innerRect(false, { ...rect }, innerOffset);
  return screen ? screenRect(inner) : inner;
};

export const innerOffset = { height: 26, width: 0, y: 26, x: 0 };
export const startUrl = "https://www.google.com/";

export const historyList = new HistoryList();
export const focusList = new FocusList();
export const rectList = new RectList();

export const windowOffset = [25, 25];
