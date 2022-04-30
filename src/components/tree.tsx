import React from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { randomNumberInRange } from "../functions/commonFunctions";

interface treeProps {
  //Your component props
}

interface pointVector {
  x: number;
  y: number;
}

interface stemPointsInterface {
  left_top: pointVector;
  right_top: pointVector;
  left_bottom: pointVector;
  right_bottom: pointVector;
}

let canControlSize = false;
let tree: Tree;
const canvasWidth = 500;
const canvasHeight = 500;
let x = 50;

const CryptoTree: React.FC<treeProps> = (props: treeProps) => {
  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(255);
    if (!tree) {
      tree = new Tree({
        p5: p5,
        stemHeight: 200,
        stemWidth: 150,
        stemRadius: 10,
        faceTopHeight: 55,
      });
    }
    tree.draw();
    // stem.draw();

    if (x == 90) {
      canControlSize = !canControlSize;
    } else if (x == 40) {
      canControlSize = !canControlSize;
    }
    if (canControlSize) {
      x--;
    } else {
      x++;
    }
    // tree.stem.updateHeight(tree.stem.height + 1);
  };

  return <Sketch setup={setup} draw={draw} />;
};

const drawLeaf = (p5: p5Types, width: number, height: number) => {
  const y_position = 80;
  p5.translate(canvasWidth / 2, canvasHeight - y_position);
  p5.stroke(61, 255, 174);
  p5.strokeWeight(8);
  p5.beginShape();
  p5.vertex(0 - width / 2, 0);
  p5.vertex(-width / 2, 0);
};

class Branch {
  p5: p5Types;
  width: number;
  height: number;
  radius: number;
  pointToStemFrom: pointVector | undefined;
  isLeftBranch: boolean;
  face: Face;
  stem: Stem;

  constructor({
    p5,
    width,
    height,
    radius,
    isLeftBranch,
    face,
    stem,
  }: {
    p5: p5Types;
    width: number;
    height: number;
    radius: number;
    isLeftBranch: boolean;
    face: Face;
    stem: Stem;
  }) {
    this.p5 = p5;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.isLeftBranch = isLeftBranch;
    this.face = face;
    this.stem = stem;

    const maxBranchY =
      this.face.topY -
      Math.sin(this.stem.linearFunction.angle) * (this.width / 2);
    console.log("hihi");

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
    if (maxBranchY > minBranchY) {
      this.pointToStemFrom = { x: initialBranchX, y: initialBranchY };
    } else {
      this.pointToStemFrom = undefined;
    }
    console.log(this.pointToStemFrom);
  }

  updatePointToStemFrom = () => {
    if (this.pointToStemFrom) {
      console.log(this.pointToStemFrom);
      this.pointToStemFrom.y =
        this.p5.height -
        this.stem.linearFunction.returnY(this.pointToStemFrom.x);
    }
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

class LinearFunction {
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

class Face {
  p5: p5Types;
  topY: number;

  constructor({ p5, topY }: { p5: p5Types; topY: number }) {
    this.p5 = p5;
    this.topY = topY;
  }

  drawEyes = () => {
    const y_position = 45;
    const lengthBetweenEyes = 33;
    const eyeHeight = 20;
    this.p5.translate(this.p5.width / 2, this.topY);
    this.p5.fill(255, 255, 255);
    this.p5.ellipse(-lengthBetweenEyes / 2, eyeHeight / 2, 18, eyeHeight);
    this.p5.ellipse(lengthBetweenEyes / 2, eyeHeight / 2, 18, eyeHeight);
    this.p5.resetMatrix();
  };

  drawMouth = () => {
    const distanceFromEyes = 22;
    const mouseLength = 30;
    const mouseHeight = 7;
    this.p5.translate(
      this.p5.width / 2,
      this.topY + distanceFromEyes + mouseHeight
    );
    this.p5.rect(-mouseLength / 2, 0, mouseLength, mouseHeight, 5);

    this.p5.resetMatrix();
  };

  draw = () => {
    this.drawEyes();
    this.drawMouth();
  };
}
class Tree {
  p5: p5Types;
  stem: Stem;
  branches: Branch[];
  face: Face;

  constructor({
    p5,
    stemHeight,
    stemWidth,
    stemRadius,
    faceTopHeight,
  }: {
    p5: p5Types;
    stemHeight: number;
    stemWidth: number;
    stemRadius: number;
    faceTopHeight: number;
  }) {
    this.p5 = p5;
    this.branches = [];
    this.stem = new Stem({
      p5: p5,
      width: stemWidth,
      height: stemHeight,
      radius: stemRadius,
      branches: this.branches,
    });

    this.face = new Face({ p5: p5, topY: p5.height - faceTopHeight });
    this.branches.push(
      new Branch({
        p5: p5,
        width: 50,
        height: 30,
        radius: 10,
        isLeftBranch: true,
        face: this.face,
        stem: this.stem,
      })
    );
  }

  draw() {
    this.stem.draw();
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].draw();
    }
    this.face.draw();
  }
}

class Stem {
  p5: p5Types;
  stemPoints: stemPointsInterface;
  width: number;
  height: number;
  radius: number;
  linearFunction: LinearFunction;
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
  }

  updateHeight(height: number) {
    this.height = height;
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
      this.branches[i].updatePointToStemFrom();
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

export default CryptoTree;
