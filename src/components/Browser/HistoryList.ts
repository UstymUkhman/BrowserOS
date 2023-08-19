import { startUrl } from "@/components/Browser/utils";

export default class HistoryList
{
  private readonly history: Map<string, string[]> = new Map();
  private readonly cursor: Map<string, number> = new Map();

  public create (id: string): void {
    this.history.set(id, [startUrl]);
    this.cursor.set(id, 0);
  }

  public add (id: string, url: string): void {
    const history = this.history.get(id);
    const cursor = this.cursor.get(id);

    if (cursor === undefined)
      return console.error(`Cursor with id "${id}" not found.`);

    history
      ? (history.splice(cursor + 1), history.push(url))
      : console.error(`History with id "${id}" not found.`);

    this.cursor.set(id, cursor + 1);
  }

  public getLast (id: string): string | undefined {
    const history = this.history.get(id);
    return history && history[history.length - 1];
  }

  public isLast (id: string, cursor: number): boolean {
    const history = this.history.get(id);

    if (cursor === undefined || !history)
      return true;

    return !history[cursor + 1];
  }

  public getCurrent (id: string): string | undefined {
    const cursor = this.cursor.get(id);
    const history = this.history.get(id);

    if (cursor === undefined || !history) return;

    return history[cursor];
  }

  public backward (id: string): string | void {
    const cursor = this.cursor.get(id);
    const history = this.history.get(id);

    if (cursor === undefined || !history) return;

    this.cursor.set(id, cursor - 1);
    return history[cursor - 1];
  }

  public forward (id: string): string | void {
    const cursor = this.cursor.get(id);
    const history = this.history.get(id);

    if (cursor === undefined || !history) return;

    this.cursor.set(id, cursor + 1);
    return history[cursor + 1];
  }

  public remove (id: string): void {
    this.history.delete(id);
    this.cursor.delete(id);
  }

  public dispose (): void {
    this.history.clear();
    this.cursor.clear();
  }
}
