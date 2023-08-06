import { innerRect } from "@/components/Window/utils";

class FocusList
{
  private willClose = false;
  private readonly windows: string[] = [];

  public getLast(): HTMLElement | null {
    if (!this.willClose) return null;

    const last = this.windows[this.last];
    const window = document.getElementById(last);

    this.willClose = false;
    return window;
  }

  public remove (id: string): void {
    this.willClose = true;

    this.windows.splice(
      this.windows.findIndex(
        window => window === id
      )
    , 1.0);
  }

  public focus (id: string): void {
    const target = this.windows.findIndex(
      window => window === id
    );

    if (this.last === target) return;

    this.windows.push(
      this.windows.splice(
        target, 1.0
      )[0]
    );
  }

  public add (id: string): void {
    this.windows.push(id);
  }

  public dispose (): void {
    this.windows.length = 0.0;
    this.willClose = true;
  }

  private get last (): number {
    return this.windows.length - 1.0;
  }
}

export const offset = [25.0, 25.0];
export const focusList = new FocusList();
export const url = "https://www.google.com/";

export const screenRect = (rect = innerRect()) => ({
  x: rect.x + screenLeft,
  y: rect.y + screenTop,
  height: rect.height,
  width: rect.width
});

export const features = ({ width, height, y, x } = screenRect()) =>
  `top=${y},left=${x},width=${width},height=${height},nodeIntegration=no,popup`;
