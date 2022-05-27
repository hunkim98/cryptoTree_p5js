import p5Types from "p5";
import { randomNumberInRange } from "../functions/commonFunctions";
import { branchProperties, pointVector } from "./DTO";
import { Face } from "./Face";
import { Stem } from "./Stem";
import regression from "regression";

export class Branch {
  p5: p5Types;
  width: number;
  height: number;
  radius: number;
  pointToStemFrom: pointVector;
  isLeftBranch: boolean;
  face: Face;
  stem: Stem;
  maxWidth = 50;
  minWidth = 25;
  maxRadius = 10;
  minRadius = 4;
  maxHeight: number;
  minHeight: number;
  branchProperties: branchProperties;

  constructor({
    p5,
    width,
    height,
    radius,
    isLeftBranch,
    face,
    stem,
    branchProperties,
  }: {
    p5: p5Types;
    width: number;
    height: number;
    radius: number;
    isLeftBranch: boolean;
    face: Face;
    stem: Stem;
    branchProperties: branchProperties;
  }) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.isLeftBranch = isLeftBranch;
    this.face = face;
    this.stem = stem;
    this.maxHeight = branchProperties.branchMaxHeight;
    this.minHeight = branchProperties.branchMinHeight;
    this.branchProperties = branchProperties;

    const maxBranchY =
      this.face.topY -
      Math.sin(this.stem.linearFunction.angle) * (this.width / 2) -
      20;

    const minBranchY =
      this.stem.stemPoints.left_top.y +
      Math.sin(this.stem.linearFunction.angle) * (this.width / 2);
    const initialBranchY = randomNumberInRange(minBranchY, maxBranchY);
    const initialBranchX = this.stem.linearFunction.returnX(
      p5.height - initialBranchY
    );
    console.log(
      this.p5.height - this.stem.linearFunction.returnY(initialBranchX)
    );
    this.pointToStemFrom = {
      x: this.isLeftBranch ? initialBranchX : this.p5.width - initialBranchX,
      y: initialBranchY,
    };
    // if (maxBranchY > minBranchY) {
    //   this.pointToStemFrom = { x: initialBranchX, y: initialBranchY };
    // } else {
    //   this.pointToStemFrom = undefined;
    // }
    console.log(this.pointToStemFrom);
  }
  updateBranchLength = (height: number) => {
    height = Math.floor(height);
    if (height < this.maxHeight && height > this.minHeight) {
      if (height > this.height) {
        if (this.height < this.maxHeight) {
          this.height++;
        }
      } else {
        if (this.height > this.minHeight) {
          this.height--;
        }
      }
    }
  };

  updateBranchAttributes = () => {
    // if (this.pointToStemFrom) {
    if (
      this.pointToStemFrom.y +
        Math.sin(this.stem.linearFunction.angle) * (this.maxWidth / 2) >
      this.face.topY
    ) {
      this.pointToStemFrom.y =
        this.face.topY -
        Math.sin(this.stem.linearFunction.angle) * (this.maxWidth / 2) +
        1;
      const newPointX = this.stem.linearFunction.returnX(
        this.p5.height - this.pointToStemFrom.y
      );
      if (this.isLeftBranch) {
        this.pointToStemFrom.x = newPointX;
      } else {
        this.pointToStemFrom.x = this.p5.width - newPointX;
      }
      //   Math.sin(this.stem.linearFunction.angle) * (this.width / 2);
    } else {
      if (this.isLeftBranch) {
        this.pointToStemFrom.y =
          this.p5.height -
          this.stem.linearFunction.returnY(this.pointToStemFrom.x);
      } else {
        this.pointToStemFrom.y =
          this.p5.height -
          this.stem.linearFunction.returnY(
            this.p5.width - this.pointToStemFrom.x
          );
      }
    }

    //   this.width;
    const [gradient, y_intercept] = regression.linear([
      [this.stem.minHeightRatio, this.minWidth],
      [this.stem.maxHeightRatio, this.maxWidth],
    ]).equation;
    const [radius_gradient, radius_y_intercept] = regression.linear([
      [this.stem.minHeightRatio, this.minRadius],
      [this.stem.maxHeightRatio, this.maxRadius],
    ]).equation;
    this.radius =
      (this.stem.height / this.p5.height) * radius_gradient +
      radius_y_intercept;
    this.width = (this.stem.height / this.p5.height) * gradient + y_intercept;
    // }
  };

  draw = () => {
    if (this.pointToStemFrom) {
      this.p5.stroke(68, 68, 68);
      this.p5.fill(68, 68, 68);
      this.p5.translate(this.pointToStemFrom.x, this.pointToStemFrom.y);
      this.p5.rotate(
        this.isLeftBranch
          ? -this.stem.linearFunction.angle
          : this.stem.linearFunction.angle
      );
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
  };
}
