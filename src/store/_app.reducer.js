import {
  EOrderBookPrecision,
  OrderBookPrecisionArr,
} from "../enums/orderBookPrecision.enum";
import {
  EOrderBookLength,
} from "../enums/orderBookLength.enum";
import { EOrderBookSymbols } from "../enums/orderBookSymbols.enum";

export const initAppStore = {
  wsIsConnected: false,
  wsIsSubscribed: false,
  renderDelay: 600,
  precision: EOrderBookPrecision.p0,
  length: EOrderBookLength.l25,
  symbol: EOrderBookSymbols.btcusd,
};
export function appStoreReducer(state = initAppStore, action) {
  switch (action.type) {
    case "SET_WS_IS_SUBSCRIBED": {
      return { ...state, wsIsSubscribed: action.payload };
    }
    case "SET_WS_IS_CONNECTED": {
      return { ...state, wsIsConnected: action.payload };
    }
    case "INCREASE_RENDER_DELAY": {
      return { ...state, renderDelay: state.renderDelay + 500 };
    }
    case "DECREASE_RENDER_DELAY": {
      const newRenderDelay =
        state.renderDelay > 500 ? state.renderDelay - 500 : 100;
      return { ...state, renderDelay: newRenderDelay };
    }
    case "INCREASE_PRECISION": {
      const precInd = OrderBookPrecisionArr.findIndex(
        (e) => state.precision === e
      );
      const newPrecision =
        OrderBookPrecisionArr[precInd - 1] || OrderBookPrecisionArr[precInd];
      return { ...state, precision: newPrecision };
    }
    case "DECREASE_PRECISION": {
      const precInd = OrderBookPrecisionArr.findIndex(
        (e) => state.precision === e
      );
      const newPrecision =
        OrderBookPrecisionArr[precInd + 1] || OrderBookPrecisionArr[precInd];
      return { ...state, precision: newPrecision };
    }
    default:
      return state;
  }
}
