export default class FocusList
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
    this.willClose = false;
  }

  private get last (): number {
    return this.windows.length - 1.0;
  }
}
