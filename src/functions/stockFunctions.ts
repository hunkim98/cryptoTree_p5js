import regression, { DataPoint } from "regression";
import { candleInfo } from "../components/DTO";

export const calculateResistance = (array: Array<any>) => {
  let counter = 0;
  let range = [0, 0, 0, 0, 0, 0];
  let lastPivot = 0;
  const resistance = [];
  for (let i = 0; i < array.length; i++) {
    const currentMax = Math.max(...range);
    range = range.slice(1);
    range.push(array[i]);
    if (currentMax === Math.max(...range)) {
      counter++;
    } else {
      counter = 0;
    }
    if (counter === 3) {
      lastPivot = currentMax;
      resistance.push(lastPivot);
    }
  }
  return resistance;
};

export const calculateSupport = (array: Array<any>) => {
  let counter = 0;
  let range = [0, 0, 0, 0, 0, 0];
  let lastPivot = 0;
  const support = [];
  for (let i = 0; i < array.length; i++) {
    const currentMin = Math.min(...range);
    range = range.slice(1);
    range.push(array[i]);
    if (currentMin === Math.min(...range)) {
      counter++;
    } else {
      counter = 0;
    }
    if (counter === 3) {
      lastPivot = currentMin;
      if (currentMin !== 0) {
        support.push(lastPivot);
      }
    }
  }
  return support;
};

export const calculateSlope = (array: Array<any>, interval: number) => {
  const mean_array = [];
  for (let i = 0; i < array.length - (interval - 1); i++) {
    const temp_array = array.slice(i, i + (interval - 1));
    const average = temp_array.reduce((a: number, b: number) => a + b);
    mean_array.push(average);
  }
  const reordered_mean_array = mean_array.slice().reverse();
  const x_y_pair: DataPoint[] = [];
  const intervalSlopeTrend = [];
  let minShortSlope = Number.MAX_VALUE;
  let maxShortSlope = Number.MIN_VALUE;
  for (let j = 0; j < reordered_mean_array.length; j++) {
    x_y_pair.push([j + 1, reordered_mean_array[j]]);
    if (j !== 0) {
      const shortSlope = reordered_mean_array[j] - reordered_mean_array[j - 1];
      if (shortSlope < minShortSlope) {
        minShortSlope = shortSlope;
      }
      if (shortSlope > maxShortSlope) {
        maxShortSlope = shortSlope;
      }
    }
  }
  // const intervalSlopes =
  console.log(reordered_mean_array);
  const result = regression.linear(x_y_pair);
  return [result.equation[0], maxShortSlope, minShortSlope];
};

export const calculateVR = (array: candleInfo[]) => {
  let total_downward = 0;
  let total_upward = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].opening_price < array[i].trade_price) {
      total_upward += array[i].candle_acc_trade_volume;
    } else {
      total_downward += array[i].candle_acc_trade_volume;
    }
  }
  return (total_upward / total_downward) * 100;
};
