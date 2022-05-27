import p5Types from "p5";
import { pointVector } from "./DTO";

export class LinearFunction {
  p5: p5Types;
  slope: number;
  y_coordinate: number;
  angle: number;

  constructor(p5: p5Types, point1: pointVector, point2: pointVector) {
    this.p5 = p5;
    this.slope =
      (p5.height - point2.y - (p5.height - point1.y)) / (point2.x - point1.x);
    this.y_coordinate = p5.height - point1.y - this.slope * point1.x;
    this.angle = Math.atan(this.slope);
  }

  updateAttributes(point1: pointVector, point2: pointVector) {
    this.slope =
      (this.p5.height - point2.y - (this.p5.height - point1.y)) /
      (point2.x - point1.x);
    this.y_coordinate = this.p5.height - point1.y - this.slope * point1.x;
    this.angle = Math.atan(this.slope);
  }

  returnY(x: number) {
    return this.slope * x + this.y_coordinate;
  }

  returnX(y: number) {
    return (y - this.y_coordinate) / this.slope;
  }
}
