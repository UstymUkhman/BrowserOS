import { innerRect } from "@/components/Window/utils";

export const offset = [25.0, 25.0];
export const url = "https://www.google.com/";

export const screenRect = (rect = innerRect()) => ({
  x: rect.x + screenLeft,
  y: rect.y + screenTop,
  height: rect.height,
  width: rect.width
});

export const features = ({ width, height, y, x } = screenRect()) =>
  `top=${y},left=${x},width=${width},height=${height},nodeIntegration=no,popup`;
