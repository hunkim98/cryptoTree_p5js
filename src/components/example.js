//
// start here
//
import { roundedPoly } from "./roundedPoly.js";

function main() {
  const canvas = document.querySelector("#canvas");
  // Initialize the GL context
  const ctx = canvas.getContext("2d");

  if (ctx === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var triangle = [
    { x: canvas.width / 2, y: canvas.height / 4 },
    { x: canvas.width / 2 - 60, y: canvas.height },
    { x: canvas.width / 2 + 60, y: canvas.height },
  ];

  let left_dy = -(triangle[0].y - triangle[1].y);
  console.log(left_dy);
  let left_dx = triangle[0].x - triangle[1].x;
  console.log(left_dx);
  let left_theta = Math.atan2(left_dy, left_dx);
  console.log(left_theta);

  let right_dy = triangle[0].y - triangle[1].y;
  let right_dx = triangle[0].x - triangle[1].x;
  let right_theta = Math.atan2(right_dy, right_dx);

  drawBranch(
    ctx,
    50,
    (triangle[0].x + triangle[1].x) / 2,
    (triangle[0].y + triangle[1].y) / 2,
    Math.PI / 2.5,
    -left_theta,
    true
  );
  drawBranch(
    ctx,
    30,
    (triangle[0].x + triangle[2].x) / 2,
    (triangle[0].y + triangle[2].y) / 2,
    Math.PI / 2.2,
    -right_theta,
    false
  );

  var cornerRadius = 10;
  ctx.lineWidth = 4;
  ctx.fillStyle = "black";

  ctx.beginPath(); // start a new path
  roundedPoly(triangle, cornerRadius, ctx);
  ctx.fill();

  // ctx.lineTo(canvas.width / 2 - 60, canvas.height);
  ctx.stroke();
  ctx.closePath();

  ctx.lineWidth = 3;
  ctx.fillStyle = "#404040";

  drawStem(ctx, canvas, 100, canvas.height / 2, 10);

  // ctx.beginPath();

  // Set clear color to black, fully opaque
  // Clear the color buffer with specified clear color
}
function drawLeaf(ctx, width, height) {}
function drawBranch(ctx, side, cx, cy, reach_ang, tilt_ang, isLeft) {
  let h = (side / 2) * Math.tan(reach_ang);
  let radius = 5;
  ctx.fillStyle = "black";
  ctx.save();
  if (isLeft) {
    ctx.translate(cx - h / 2, cy);
  } else {
    ctx.translate(cx + h / 2, cy);
  }

  ctx.rotate(tilt_ang);
  ctx.beginPath();
  ctx.moveTo(0 - radius, -h / 2);

  ctx.lineTo(-side / 2, h / 2);
  ctx.lineTo(side / 2, h / 2);
  ctx.lineTo(0 + radius, -h / 2);
  ctx.quadraticCurveTo(0, -h / 2 - radius, 0 - radius, -h / 2);
  // ctx.fillStyle = "blue";
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.restore();
  ctx.save();
}

function drawStem(ctx, canvas, width, height, radius) {
  ctx.fillStyle = "blue";
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0 - radius, -height);
  ctx.lineTo(-width / 2, height);
  ctx.lineTo(width / 2, height);
  ctx.lineTo(0 + radius, -height);
  ctx.quadraticCurveTo(0, -height - radius, 0 - radius, -height);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.restore();
  ctx.save();
}

function drawEqTriangle(ctx, side, cx, cy) {
  var h = side * (Math.sqrt(3) / 2);

  //   ctx.strokeStyle = "#ff0000";
  ctx.fillStyle = "rgba(0,0,0,200)";
  ctx.save();
  ctx.translate(cx, cy);

  ctx.beginPath();
  // ctx.rotate(Math.PI);

  ctx.moveTo(0, -h / 2); //height
  ctx.lineTo(-side / 2, h / 2); //left point
  ctx.lineTo(side / 2, h / 2); //right point
  ctx.lineTo(0, -h / 2); //upper point

  ctx.stroke();
  ctx.fill();

  ctx.closePath();
  ctx.restore();
  ctx.save();
}

window.onload = main;
