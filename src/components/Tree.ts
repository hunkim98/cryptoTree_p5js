import p5Types from "p5";
import { Branch } from "./Branch";
import { branchProperties } from "./DTO";
import { Face } from "./Face";
import Leaf from "./Leaf";
import { Stem } from "./Stem";

export class Tree {
  p5: p5Types;
  stem: Stem;
  branches: Branch[];
  face: Face;
  leaf: Leaf;
  branchProperties: branchProperties = {
    branchMinHeight: 20,
    branchMaxHeight: 80,
    branchLength: 25,
  };

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
        branchProperties: this.branchProperties,
      })
    );
    this.leaf = new Leaf({
      p5: p5,
      width: 190,
      stem: this.stem,
      branchProperties: this.branchProperties,
    });
  }

  createNewBranch() {
    const recentBranch = this.branches[this.branches.length - 1];
    const newBranch = new Branch({
      p5: this.p5,
      width: recentBranch.width,
      height: recentBranch.height,
      radius: recentBranch.radius,
      isLeftBranch: !recentBranch.isLeftBranch,
      face: this.face,
      stem: this.stem,
      branchProperties: this.branchProperties,
    });
    this.branches.push(newBranch);
  }

  removeBranch() {
    this.branches.pop();
  }

  draw() {
    this.stem.draw();
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].draw();
    }
    this.face.draw();
    this.leaf.draw();
  }
}
