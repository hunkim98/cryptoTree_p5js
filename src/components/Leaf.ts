import p5Types from "p5";
import { branchProperties } from "./DTO";
import { Stem } from "./Stem";

export class Leaf {
  p5: p5Types;
  width: number;
  stem: Stem;
  radius = 5;
  minimumWidth: number;
  maximumWidth: number;
  branchProperties: branchProperties;
  isDecreasing: boolean = false;
  constructor({
    p5,
    width,
    stem,
    branchProperties,
  }: {
    p5: p5Types;
    width: number;
    stem: Stem;
    branchProperties: branchProperties;
  }) {
    this.p5 = p5;
    this.width = width;
    this.stem = stem;
    this.minimumWidth = this.stem.width + branchProperties.branchMinHeight * 2;
    this.maximumWidth = p5.width * 0.8;
    this.branchProperties = branchProperties;
  }

  updateWidth(width: number) {
    width = Math.floor(width);
    if (this.width <= this.maximumWidth && this.width >= this.minimumWidth) {
      if (width > this.width) {
        if (this.width < this.maximumWidth) {
          this.isDecreasing = false;
          this.width++;
        }
      } else {
        if (this.width > this.minimumWidth) {
          this.isDecreasing = true;
          this.width--;
        }
      }
    }
  }

  draw() {
    const y_position = 60;
    const angle = this.stem.linearFunction.angle;
    const slope = this.stem.linearFunction.slope;
    const y_intercept = (-slope * -this.width) / 2;
    const height = slope * -this.radius + y_intercept;
    this.p5.translate(this.p5.width / 2, this.p5.height - y_position);
    if (this.isDecreasing) {
      this.p5.stroke(230, 255, 132);
    } else {
      this.p5.stroke(61, 255, 174);
    }
    this.p5.fill(214, 11, 255, 100);
    this.p5.strokeWeight(8);
    this.p5.beginShape();
    this.p5.beginShape();
    this.p5.vertex(0 - this.radius, -height);
    const widthReduceAmount = this.radius / Math.tan(angle / 2);
    this.p5.vertex(
      -this.width / 2 + widthReduceAmount * Math.cos(angle),
      -widthReduceAmount * Math.sin(angle)
    );
    const cornerTriangleHypotenuse = this.radius / Math.sin(angle / 2);
    const quadraticXDecrese =
      (cornerTriangleHypotenuse - this.radius) * Math.cos(angle / 2);
    const quadraticY =
      -(cornerTriangleHypotenuse - this.radius) * Math.sin(angle / 2);
    this.p5.quadraticVertex(
      -this.width / 2 + quadraticXDecrese,
      quadraticY,
      -this.width / 2 + widthReduceAmount,
      0
    );
    //quadraticvertex here
    this.p5.vertex(this.width / 2 - widthReduceAmount, 0);
    this.p5.quadraticVertex(
      this.width / 2 - quadraticXDecrese,
      quadraticY,
      this.width / 2 - widthReduceAmount * Math.cos(angle),
      -widthReduceAmount * Math.sin(angle)
    );
    this.p5.vertex(0 + this.radius, -height);
    this.p5.quadraticVertex(0, -height - this.radius, 0 - this.radius, -height);
    this.p5.endShape();
    //we need to reset the strokeweight to 1 again
    this.p5.strokeWeight(1);
    this.p5.resetMatrix();
  }
}

export default Leaf;
