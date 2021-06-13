import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ac_decreasePrecision,
  ac_decreaseRenderDelay,
  ac_increasePrecision,
  ac_increaseRenderDelay,
} from "../../../store/actions";
import { EOrderBookPrecision } from "../../../enums/orderBookPrecision.enum";
import "./orderBookSettings.scss";

function OrderBookSettingsMemo({ params }) {
  const dispatch = useDispatch();
  const pair = `${params.symbol.slice(0, 3)}/${params.symbol.slice(3)}`;
  const increaseRenderDelay = () => dispatch(ac_increaseRenderDelay());
  const decreaseRenderDelay = () => dispatch(ac_decreaseRenderDelay());
  const increasePrecision = () => {
    dispatch(ac_increasePrecision());
  };
  const decreasePrecision = () => {
    dispatch(ac_decreasePrecision());
  };
  return (
    <div className="orderBookSettings">
      <ul>
        <li>Order Book {pair}</li>
        <li>
          <button
            onClick={() => decreasePrecision()}
            disabled={
              !params.wsIsSubscribed ||
              params.precision === EOrderBookPrecision.r0
            }
          >
            -
          </button>
          Precision
          <button
            onClick={() => increasePrecision()}
            disabled={
              !params.wsIsSubscribed ||
              params.precision === EOrderBookPrecision.p0
            }
          >
            +
          </button>
        </li>
        <li>
          <button
            onClick={() => decreaseRenderDelay()}
            disabled={params.renderDelay === 100}
          >
            -
          </button>
          Throttling
          <button onClick={() => increaseRenderDelay()}>+</button>
        </li>
      </ul>
    </div>
  );
}

export default function OrderBookSettings() {
  const appState = useSelector((state) => state.app);
  return (
    <OrderBookSettingsMemo
      params={{
        wsIsSubscribed: appState.wsIsSubscribed,
        renderDelay: appState.renderDelay,
        precision: appState.precision,
        length: appState.length,
        symbol: appState.symbol,
      }}
    />
  );
}
