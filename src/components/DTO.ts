export interface pointVector {
  x: number;
  y: number;
}

export interface stemPointsInterface {
  left_top: pointVector;
  right_top: pointVector;
  left_bottom: pointVector;
  right_bottom: pointVector;
}

export interface branchProperties {
  branchMinHeight: number;
  branchMaxHeight: number;
  branchLength: number;
}

export interface candleInfo {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  prev_closing_price: number;
  change_price: number;
  change_rate: number;
}
