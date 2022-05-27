import p5Types from "p5";

export class Face {
  p5: p5Types;
  topY: number;
  faceStatus: "idle" | "frowning";

  constructor({ p5, topY }: { p5: p5Types; topY: number }) {
    this.p5 = p5;
    this.topY = topY;
    this.faceStatus = "idle";
  }

  drawEyes = () => {
    const lengthBetweenEyes = 33;
    const eyeHeight = 20;
    this.p5.translate(this.p5.width / 2, this.topY);
    this.p5.fill(255, 255, 255);
    this.p5.ellipse(-lengthBetweenEyes / 2, eyeHeight / 2, 18, eyeHeight);
    this.p5.ellipse(lengthBetweenEyes / 2, eyeHeight / 2, 18, eyeHeight);
    if (this.faceStatus === "frowning") {
      this.p5.stroke(68, 68, 68);
      this.p5.fill(68, 68, 68);
      this.p5.ellipse(
        -lengthBetweenEyes / 2,
        eyeHeight / 2 - 12,
        30,
        eyeHeight
      );
      this.p5.ellipse(lengthBetweenEyes / 2, eyeHeight / 2 - 12, 30, eyeHeight);
    }

    this.p5.resetMatrix();
  };
  updateFaceStatus = (faceStatus: "frowning" | "idle") => {
    this.faceStatus = faceStatus;
  };

  drawMouth = () => {
    const distanceFromEyes = 22;
    const mouseLength = 30;
    let mouseHeight = 7;
    const minMouseHeight = 2;
    const maxMouseHeight = 7;
    this.p5.fill(255, 255, 255);
    this.p5.stroke(255, 255, 255);
    this.p5.translate(
      this.p5.width / 2,
      this.topY + distanceFromEyes + mouseHeight
    );
    if (this.faceStatus === "frowning") {
      mouseHeight = 5;
    } else {
      mouseHeight = 7;
    }
    this.p5.rect(-mouseLength / 2, 0, mouseLength, mouseHeight, 5);

    this.p5.resetMatrix();
  };

  draw = () => {
    this.drawEyes();
    this.drawMouth();
  };
}
