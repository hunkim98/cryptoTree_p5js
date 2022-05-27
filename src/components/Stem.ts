import p5Types from "p5";
import { Branch } from "./Branch";
import { stemPointsInterface } from "./DTO";
import { LinearFunction } from "./LinearFunction";

export class Stem {
  p5: p5Types;
  stemPoints: stemPointsInterface;
  width: number;
  height: number;
  radius: number;
  linearFunction: LinearFunction;
  maxHeightRatio = 0.6;
  minHeightRatio = 0.2;
  maximumHeight: number;
  minimumHeight: number;
  branches: Branch[];

  constructor({
    p5,
    width,
    height,
    radius,
    branches,
  }: {
    p5: p5Types;
    width: number;
    height: number;
    radius: number;
    branches: Branch[];
  }) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.branches = branches;
    this.stemPoints = {
      left_top: {
        x: p5.width / 2 - this.radius,
        y: p5.height - this.height,
      },
      right_top: {
        x: p5.width / 2 + this.radius,
        y: p5.height - this.height,
      },
      left_bottom: { x: p5.width / 2 - this.width / 2, y: p5.height },
      right_bottom: { x: p5.width / 2 + this.width / 2, y: p5.height },
    };
    this.linearFunction = new LinearFunction(
      p5,
      this.stemPoints.left_bottom,
      this.stemPoints.left_top
    );
    this.maximumHeight = this.p5.height * this.maxHeightRatio;
    this.minimumHeight = this.p5.height * this.minHeightRatio;
  }

  updateHeight(height: number) {
    if (height < this.maximumHeight && height > this.minimumHeight) {
      if (height > this.height) {
        if (this.height < this.maximumHeight) {
          this.height++;
        }
      } else {
        if (this.height > this.minimumHeight) {
          this.height--;
        }
      }
    }
    // this.height = height;
    this.stemPoints.left_top = {
      x: this.p5.width / 2 - this.radius,
      y: this.p5.height - this.height,
    };
    this.stemPoints.right_top = {
      x: this.p5.width / 2 + this.radius,
      y: this.p5.height - this.height,
    };
    this.linearFunction.updateAttributes(
      this.stemPoints.left_bottom,
      this.stemPoints.left_top
    );
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].updateBranchAttributes();
    }
  }

  draw() {
    this.p5.translate(this.p5.width / 2, this.p5.height);
    this.p5.stroke(68, 68, 68);
    this.p5.fill(68, 68, 68);
    this.p5.beginShape();
    this.p5.vertex(0 - this.radius, -this.height);
    this.p5.vertex(-this.width / 2, 0);
    this.p5.vertex(this.width / 2, 0);
    this.p5.vertex(0 + this.radius, -this.height);
    this.p5.quadraticVertex(
      0,
      -this.height - this.radius,
      0 - this.radius,
      -this.height
    );
    this.p5.endShape();
    this.p5.resetMatrix();
  }
}
