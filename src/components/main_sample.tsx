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
  const finalHoursUrl = minuteUrl + `&count=${count}`;
  const day_data = (await axios.get(finalDayUrl)).data;
  const minute_data = (await axios.get(finalHoursUrl)).data;
  currentPrice = minute_data[minute_data.length - 1].trade_price;
  //item.high_price, item.low_price
  const price = day_data.map((item: any) => item.trade_price);
  const day_high = day_data.map((item: any) => item.high_price);
  const day_low = day_data.map((item: any) => item.low_price);
  const resistance = calculateResistance(day_high);
  const support = calculateSupport(day_low);
  const volumeRatio = calculateVR(day_data);
  //if there is no resistance then it means it is keep upgoing
  if (resistance.length !== 0) {
    recentResistance = resistance[resistance.length - 1];
  }
  if (support.length !== 0) {
    recentSupport = support[support.length - 1];
  }
  const [gradient, maxShortSlope, minShortSlope] = calculateSlope(price, 5);
  cryptoSlope = gradient;
};

const getDataFromSample = (dayInterval: number) => {
  const days = daySample.slice().reverse();
  const hours = hourSample.slice().reverse();
  console.log(hours[0]);
  let hourDate = new Date(hours[0].candle_date_time_kst).toDateString();
  const dayInfo: {
    date: string;
    slope: number;
    price: number;
    minSlope: number;
    maxSlope: number;
    resistance: number;
    support: number;
    volumeRatio: number;
  }[] = [];
  for (let i = 0; i + dayInterval < days.length; i++) {
    const dayArray = days.slice(i, i + dayInterval);
    const dayDate = new Date(
      days[i + dayInterval].candle_date_time_kst
    ).toDateString();
    const dayPrice = dayArray.map((item) => item.trade_price);
    const dayHigh = dayArray.map((item) => item.high_price);
    const dayLow = dayArray.map((item) => item.low_price);
    const [slope, maxShortSlope, minShortSlope] = calculateSlope(dayPrice, 5);
    //update slopes
    console.log(slope);
    const resistance = calculateResistance(dayHigh);
    const support = calculateSupport(dayLow);
    const volumeRatio = calculateVR(dayArray);
    dayInfo.push({
      date: dayDate,
      price: days[i + dayInterval].trade_price,
      minSlope: minShortSlope,
      maxSlope: maxShortSlope,
      slope: slope,
      resistance: resistance[resistance.length - 1],
      support: support[support.length - 1],
      volumeRatio: volumeRatio,
    });
  }
  daySampleGroup = dayInfo;
  const dayDates = dayInfo.map((item) => item.date);
  let dayCount = 0;
  let previousDate = dayDates[0];
  const hourInfo = hours
    .map((item) => {
      if (dayCount < dayDates.length) {
        let hourDate = new Date(item.candle_date_time_kst).toDateString();
        if (dayCount < dayDates.length - 1) {
          while (previousDate !== hourDate) {
            dayCount += 1;
            previousDate = dayDates[dayCount];
          }
          if (previousDate === hourDate) {
            return {
              date: new Date(item.candle_date_time_kst),
              price: item.trade_price,
              slope: dayInfo[dayCount].slope,
              resistance: dayInfo[dayCount].resistance,
              support: dayInfo[dayCount].support,
            };
          }
        }
      }
    })
    .filter((element) => element !== undefined);
  sample = hourInfo as {
    date: Date;
    slope: number;
    price: number;
    resistance: number;
    support: number;
  }[];
  console.log("hi", hourInfo);
};

let sampleIndex = 0;
const CryptoTree: React.FC<treeProps> = (props: treeProps) => {
  useEffect(() => {
    getDataFromSample(20);
    // const fetchData = async () => {
    //   const daysUrl = "https://api.upbit.com/v1/candles/days/?market=KRW-BTC";
    //   const minuteUrl =
    //     "https://api.upbit.com/v1/candles/minutes/5?market=KRW-BTC";

    //   const finalDayUrl = daysUrl + `&count=${30}`;
    //   const finalHoursUrl = minuteUrl + `&count=${10}`;
    //   const day_data = (await axios.get(finalDayUrl)).data;
    //   const minute_data = (await axios.get(finalHoursUrl)).data;
    // };
    // fetchData();
  }, []);
  //See annotations in JS for more information
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    if (p5.frameCount % 30 === 0) {
      if (sampleIndex < daySampleGroup.length - 1) {
        console.log(
          daySampleGroup[sampleIndex].price,
          daySampleGroup[sampleIndex].slope,
          (recentResistance = daySampleGroup[sampleIndex].resistance)
        );
        date = daySampleGroup[sampleIndex].date;
        cryptoSlope = daySampleGroup[sampleIndex].slope;
        currentPrice = daySampleGroup[sampleIndex].price;
        recentResistance = daySampleGroup[sampleIndex].resistance;
        recentSupport = daySampleGroup[sampleIndex].support;
        volumeRatio = daySampleGroup[sampleIndex].volumeRatio;
        minSlope = daySampleGroup[sampleIndex].minSlope;
        maxSlope = daySampleGroup[sampleIndex].maxSlope;
        sampleIndex += 1;
      }
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
          console.log("created new branch");
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
      const maxWidth = tree.leaf.maximumWidth;
      const minWidth = tree.leaf.minimumWidth;
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
      const branches = tree.branches;
      branches.map((element) => {
        element.updateBranchLength(properWidth);
      });

      if (currentLeafWidth > newLeafWidth) {
        tree.face.updateFaceStatus("frowning");
      } else {
        tree.face.updateFaceStatus("idle");
      }
    }
    p5.noStroke();
    p5.fill(0);
    p5.text(`Date: ${date}`, 20, 20);
    p5.text(`Volume Ratio: ${volumeRatio}`, 20, 40);
    p5.text(
      `Slope: ${cryptoSlope}, Max slope: ${maxSlope}, Min slope: ${minSlope}`,
      20,
      60
    );
    p5.text(
      `Price: ${currentPrice}, Support: ${recentSupport}, Resistance: ${recentResistance}`,
      20,
      80
    );
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default CryptoTree;
