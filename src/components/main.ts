export const drawTree = () => {
  const canvas: HTMLCanvasElement = document.querySelector(
    "#canvas"
  ) as HTMLCanvasElement;
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
  drawEqTriangle(ctx, canvas, canvas.width / 2, canvas.height / 2, 100);
  drawStem(ctx, canvas, 100, 100);
  // Set clear color to black, fully opaque
  // Clear the color buffer with specified clear color
};

function drawEqTriangle(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  cx: number,
  cy: number,
  side: number
) {
  var h = side * (Math.sqrt(3) / 2);
  //   ctx.strokeStyle = "#ff0000";
  ctx.fillStyle = "rgba(0,0,0,200)";
  ctx.save();
  ctx.translate(cx, cy);

  ctx.beginPath();

  ctx.moveTo(0, -h / 2);
  ctx.lineTo(-side / 2, h / 2);
  ctx.lineTo(side / 2, h / 2);
  ctx.lineTo(0, -h / 2);

  ctx.stroke();
  ctx.fill();

  ctx.closePath();
  ctx.save();
}

function drawStem(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  ctx.fillStyle = "rgb(255,0,0)";
  ctx.translate(canvas.width / 2, 0);
  ctx.beginPath();
  ctx.moveTo(0, height / 2);

  ctx.lineTo(-width / 2, height / 2);
  ctx.lineTo(width / 2, height / 2);
  ctx.lineTo(0, -height / 2);

  ctx.closePath();

  ctx.fill();
}
