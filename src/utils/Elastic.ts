import { DELTA_FRAME } from "@/utils/Number";

export default class ElasticNumber
{
  private current: number;
  private target: number;
  public speed = 10.0;

  public constructor (value: number) {
    this.target = this.current = value;
  }

  public update (delta: number = DELTA_FRAME): void {
    const dist = this.target - this.current;
    this.current += dist * (this.speed * delta);
  }

  public set (target: number): void {
    this.target = target;
  }

  public get value (): number {
    return this.current;
  }
}
