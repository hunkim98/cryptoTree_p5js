import React from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense

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

const canvasWidth = 500;
const canvasHeight = 500;
let x = 50;
const y = 50;
const MINIMUM_STEM_LENGTH = 100;
let stemHeight = 200;
const stemWidth = 150;
const stemRadius = 10;
let stemPoints: stemPointsInterface = {
  left_top: { x: canvasWidth / 2 - stemRadius, y: canvasHeight - stemHeight },
  right_top: { x: canvasWidth / 2 + stemRadius, y: canvasHeight - stemHeight },
  left_bottom: { x: canvasWidth / 2 - stemWidth / 2, y: canvasHeight },
  right_bottom: { x: canvasWidth / 2 + stemWidth / 2, y: canvasHeight },
};
let stemDY =
  canvasHeight -
  stemPoints.left_top.y -
  (canvasHeight - stemPoints.left_bottom.y);
let stemDX = stemPoints.left_top.x - stemPoints.left_bottom.x;
let stemAngle: number = Math.atan(stemDY / stemDX);
let tempBranchWidth = 50;
let stemSlope =
  (canvasHeight -
    stemPoints.left_top.y -
    (canvasHeight - stemPoints.left_bottom.y)) /
  (stemPoints.left_top.x - stemPoints.left_bottom.x);
let tempBranchX =
  Math.random() *
    (stemPoints.left_top.x -
      Math.cos(stemAngle) * tempBranchWidth -
      (stemPoints.left_bottom.x + Math.cos(stemAngle) * tempBranchWidth)) +
  stemPoints.left_bottom.x +
  Math.cos(stemAngle) * tempBranchWidth;
let tempBranchOrigin: pointVector = {
  x: tempBranchX,
  y: canvasHeight - (tempBranchX - stemPoints.left_bottom.x) * stemSlope,
};

const Tree: React.FC<treeProps> = (props: treeProps) => {
  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.beginShape();
    p5.ellipse(x, y, 70, 70);
    // stemAngle = -p5.atan2(stemPoints.left_top.y, stemPoints.left_top.x);

    drawStem({ p5: p5, radius: 10, height: stemHeight, width: stemWidth });
    drawBranch({
      p5: p5,
      width: 50,
      pointTostemFrom: tempBranchOrigin,
      innerAngle: Math.PI / 3,
      tiltAngle: -stemAngle,
      isLeft: true,
    });
    x++;
    // stemLength++;
  };

  return <Sketch setup={setup} draw={draw} />;
};

const drawBranch = ({
  p5,
  width,
  pointTostemFrom,
  innerAngle,
  tiltAngle,
  isLeft,
}: {
  p5: p5Types;
  width: number;
  pointTostemFrom: pointVector;
  innerAngle: number;
  tiltAngle: number;
  isLeft: boolean;
}) => {
  let height = (width / 2) * Math.tan(innerAngle);
  let radius = 5;
  p5.translate(pointTostemFrom.x, pointTostemFrom.y);
  p5.rotate(tiltAngle);
  p5.beginShape();
  p5.vertex(0 - radius, -height);
  p5.vertex(-width / 2, 0);
  p5.vertex(width / 2, 0);
  p5.vertex(0 + radius, -height);
  p5.quadraticVertex(0, -height - radius, 0 - radius, -height);
  p5.endShape();
  p5.resetMatrix();
};

const drawStem = ({
  p5,
  radius,
  height,
  width,
}: {
  p5: p5Types;
  radius: number;
  height: number;
  width: number;
}) => {
  p5.translate(p5.width / 2, p5.height);
  p5.beginShape();
  p5.vertex(0 - radius, -height);
  p5.vertex(-width / 2, 0);
  p5.vertex(width / 2, 0);
  p5.vertex(0 + radius, -height);
  p5.quadraticVertex(0, -height - radius, 0 - radius, -height);
  p5.endShape();
  p5.resetMatrix();
};

export default Tree;
