import { startUrl } from "@/components/Browser/utils";

export default class HistoryList
{
  private readonly cursor: Map<string, number> = new Map();
  private readonly urls: Map<string, string[]> = new Map();

  public add (id: string, url: string): void {
    const cursor = this.cursor.get(id) ?? 0;
    this.cursor.set(id, cursor + 1);
    this.urls.get(id)?.push(url);
  }

  public backward (id: string): boolean {
    return !!this.cursor.get(id);
  }

  public forward (id: string): boolean {
    const cursor = this.cursor.get(id);

    return !!(cursor &&
      this.urls.get(id)?.[cursor + 1]
    );
  }

  public current (id: string): string {
    const cursor = this.cursor.get(id);
    return this.urls.get(id)?.[cursor ?? 0] ?? "";
  }

  public create (id: string): void {
    this.urls.set(id, [startUrl]);
    this.cursor.set(id, 0);
  }

  public remove (id: string): void {
    this.cursor.delete(id);
    this.urls.delete(id);
  }

  public dispose (): void {
    this.cursor.clear();
    this.urls.clear();
  }
}
