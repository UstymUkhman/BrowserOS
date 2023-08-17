import { MinRect } from "@/components/Window/utils";

export default class RectList
{
  private readonly windows: Map<string, Rectangle> = new Map();

  public add (id: string, rect: Rectangle): void {
    this.windows.set(id, { ...rect });
  }

  public update (id: string, rect: Rectangle): void {
    const window = this.windows.get(id);

    window
      ? Object.assign(window, rect)
      : console.error(`Window with id "${id}" not found.`);
  }

  public get (id: string): Rectangle {
    return this.windows.get(id) ?? MinRect;
  }

  public remove (id: string): void {
    this.windows.delete(id);
  }

  public dispose (): void {
    this.windows.clear();
  }
}
