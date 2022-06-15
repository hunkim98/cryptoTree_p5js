import React, { useEffect } from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { randomNumberInRange } from "../functions/commonFunctions";
import axios from "axios";
import regression, { DataPoint } from "regression";
import { Tree } from "./Tree";
import {
  calculateResistance,
  calculateSlope,
  calculateSupport,
  calculateVR,
} from "../functions/stockFunctions";
import daySample from "../data/300day.json";
import hourSample from "../data/300dayHour.json";
import { Branch } from "./Branch";

interface treeProps {
  //Your component props
}

let canControlSize = false;
let tree: Tree;
let date: Date;
const canvasWidth = 500;
const canvasHeight = 500;
let cryptoSlope = 250;
let minSlope: number;
let maxSlope: number;
let recentResistance = 0;
let recentSupport = 0;
let currentPrice = 0;
let volumeRatio: number;
let sample: {
  date: Date;
  slope: number;
  resistance: number;
  support: number;
  price: number;
}[] = [];
let x = 50;
let daySampleGroup: any;
const getDatafromUpbit = async (count: number) => {
  const daysUrl = "https://api.upbit.com/v1/candles/days/?market=KRW-BTC";
  const minuteUrl = "https://api.upbit.com/v1/candles/minutes/5?market=KRW-BTC";

  const finalDayUrl = daysUrl + `&count=${count}`;
  const finalMinuteUrl = minuteUrl + `&count=${200}`;
  const day_data = (await axios.get(finalDayUrl)).data;
  const minute_data = (await axios.get(finalMinuteUrl)).data;
  day_data.reverse();
  minute_data.reverse();
  //item.high_price, item.low_price
  const price = day_data.map((item: any) => item.trade_price);
  currentPrice = minute_data[minute_data.length - 1].trade_price;
  date = minute_data[minute_data.length - 1].candle_date_time_kst;
  const minute_high = minute_data.map((item: any) => item.high_price);
  const minute_low = minute_data.map((item: any) => item.low_price);
  const resistance = calculateResistance(minute_high);
  const support = calculateSupport(minute_low);
  if (resistance.length !== 0) {
    recentResistance = resistance[resistance.length - 1];
  }
  if (support.length !== 0) {
    recentSupport = support[support.length - 1];
  }
  volumeRatio = calculateVR(day_data);
  //if there is no resistance then it means it is keep upgoing
  if (resistance.length !== 0) {
    recentResistance = resistance[resistance.length - 1];
  }
  if (support.length !== 0) {
    recentSupport = support[support.length - 1];
  }
  const [gradient, maxShortSlope, minShortSlope] = calculateSlope(price, 5);
  cryptoSlope = gradient;
  maxSlope = maxShortSlope;
  minSlope = minShortSlope;
};

const CryptoTree: React.FC<treeProps> = (props: treeProps) => {
  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    if (p5.frameCount % 30 === 0) {
      getDatafromUpbit(20);
    }
    p5.background(248, 250, 253);
    if (!tree) {
      tree = new Tree({
        p5: p5,
        stemHeight: 200,
        stemWidth: 150,
        stemRadius: 10,
        faceTopHeight: 50,
      });
    }
    if (p5.frameCount % 100 === 0) {
      // getDatafromUpbit(30);
    }

    if (volumeRatio) {
      const branchCount = Math.floor(p5.map(volumeRatio, 70, 300, 1, 5));
      if (branchCount > tree.branches.length) {
        if (tree.branches.length < 5) {
          tree.createNewBranch();
        }
      } else if (branchCount < tree.branches.length) {
        if (tree.branches.length > 1) {
          tree.removeBranch();
        }
      }
    }

    tree.draw();
    if (minSlope && maxSlope && cryptoSlope) {
      const properStemHeight = p5.map(
        cryptoSlope,
        minSlope,
        maxSlope,
        tree.stem.minimumHeight,
        tree.stem.maximumHeight
      );
      tree.stem.updateHeight(properStemHeight);
    }

    if (recentResistance !== 0 && recentSupport !== 0 && currentPrice !== 0) {
      const properWidth = p5.map(
        currentPrice,
        recentSupport,
        recentResistance,
        tree.branchProperties.branchMinHeight,
        tree.branchProperties.branchMaxHeight
      );
      const newLeafWidth = properWidth * 2 + tree.stem.width;
      const currentLeafWidth = tree.leaf.width;
      tree.leaf.updateWidth(properWidth * 2 + tree.stem.width);
      tree.branches.map((element) => {
        element.updateBranchLength(properWidth);
      });

      if (currentLeafWidth > newLeafWidth) {
        tree.face.updateFaceStatus("frowning");
      } else {
        tree.face.updateFaceStatus("idle");
      }
    }
  };
  const setupText = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, 200).parent(canvasParentRef);
  };

  const drawText = (p5: p5Types) => {
    p5.background(248, 250, 253);
    p5.noStroke();
    p5.fill(0);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.ellipseMode("center");
    let slopeCircleLocation = p5.map(
      cryptoSlope,
      minSlope,
      maxSlope,
      120,
      p5.width - 80
    );
    slopeCircleLocation =
      slopeCircleLocation < minSlope
        ? 120
        : slopeCircleLocation > maxSlope
        ? p5.width - 80
        : slopeCircleLocation;
    p5.circle(slopeCircleLocation, 40, 10);
    let priceCircleLocation = p5.map(
      currentPrice,
      recentSupport,
      recentResistance,
      120,
      p5.width - 80
    );
    priceCircleLocation =
      priceCircleLocation < recentSupport
        ? 120
        : priceCircleLocation > recentResistance
        ? p5.width - 80
        : priceCircleLocation;
    p5.circle(priceCircleLocation, 100, 10);
    let volumeCircleLocation = p5.map(volumeRatio, 70, 300, 120, p5.width - 80);
    volumeCircleLocation =
      volumeCircleLocation < 70
        ? 120
        : volumeCircleLocation > 300
        ? p5.width - 80
        : volumeCircleLocation;
    p5.circle(volumeCircleLocation, 160, 10);
    p5.line(120, 40, p5.width - 80, 40);
    p5.line(120, 100, p5.width - 80, 100);
    p5.line(120, 160, p5.width - 80, 160);
    p5.textAlign("center");
    p5.noStroke();
    p5.textSize(15);
    p5.text("Stem(Slope)", 60, 45);
    p5.text("Leaf(Price)", 60, 105);
    p5.text("Branch(VR)", 60, 165);

    p5.textSize(10);
    p5.text("min", 120, 60);
    p5.text("max", p5.width - 80, 60);
    p5.text("min", 120, 120);
    p5.text("max", p5.width - 80, 120);
    p5.text("min", 120, 180);
    p5.text("max", p5.width - 80, 180);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Sketch setup={setup} draw={draw} />
      <Sketch setup={setupText} draw={drawText} />
    </div>
  );
};

export default CryptoTree;
