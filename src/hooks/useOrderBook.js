import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ac_setWsIsConnected,
  ac_setWsIsSubscribed,
  ac_updateOderBookData,
} from "../store/actions";
import { EOrderBookFrequency } from "../enums/orderBookFrequency.enum";
import { EOrderBookSides } from "../enums/orderBookSides.enum";

const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
export function useOrderBook() {
  const { renderDelay, length, symbol, precision } = useSelector((state) => ({
    renderDelay: state.app.renderDelay,
    length: state.app.length,
    precision: state.app.precision,
    symbol: state.app.symbol,
  }));
  const [subscriptionID, setSubscriptionID] = useState();
  const [subscriptionParams, setSubscriptionParams] = useState(
    JSON.stringify({
      event: "subscribe",
      channel: "book",
      prec: precision,
      len: length,
      freq:
        renderDelay > 2000 ? EOrderBookFrequency.F1 : EOrderBookFrequency.F0,
      symbol,
    })
  );
  const initCachedOB = {
    [EOrderBookSides.asks]: {},
    [EOrderBookSides.bids]: {},
    timestamp: new Date().getTime(),
  };
  const [cachedOB, setCachedOB] = useState(initCachedOB);
  const dispatch = useDispatch();

  function addTotalAndSlice(arr) {
    if (arr.length > length) arr = arr.slice(0, length - 1);
    let total = 0;
    arr = arr.map((e) => {
      total += e.amount;
      return { ...e, total };
    });
    return arr;
  }
  function addTotalPercentage(arr, biggestTotal) {
    return arr.map((e) => ({
      ...e,
      totalPercentage: Math.round((e.total / biggestTotal) * 100),
    }));
  }
  function convertArrayToPricePoint(arr) {
    let [price, count, amount] = arr;
    const side = amount >= 0 ? EOrderBookSides.bids : EOrderBookSides.asks;
    amount = Math.abs(amount);
    const pp = {
      price: price,
      count: count,
      amount: amount,
    };
    return [pp, side];
  }
  function dispatchOrderBook(bids, asks) {
    bids.sort((a, b) => a.price - b.price);
    asks.sort((a, b) => b.price - a.price);

    bids = addTotalAndSlice(bids);
    asks = addTotalAndSlice(asks);

    const biggestTotal = Math.max(
      bids[length - 1].total,
      asks[length - 1].total
    );
    bids = addTotalPercentage(bids, biggestTotal);
    asks = addTotalPercentage(asks, biggestTotal);

    dispatch(ac_updateOderBookData({ bids, asks }));
  }

  useEffect(() => {
    setSubscriptionParams(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        len: length,
        prec: precision,
        freq:
          renderDelay > 2000 ? EOrderBookFrequency.F1 : EOrderBookFrequency.F0,
        symbol,
      })
    );
  }, [renderDelay, length, symbol, precision]);

  useEffect(() => {
    socket.onmessage = (msg) => {
      msg = JSON.parse(msg.data);
      if (!msg.event && msg[1] !== "hb") {
        msg = msg[1];
        if (
          !Object.keys(cachedOB.bids).length &&
          !Object.keys(cachedOB.asks).length
        ) {
          // first message
          const temp = cachedOB;
          for (let i = 0; i < msg.length; i++) {
            const [pp, side] = convertArrayToPricePoint(msg[i]);
            temp[side][pp.price] = pp;
            temp.timestamp = new Date().getTime();
          }
          setCachedOB(temp);
          if (Object.values(temp.bids).length < 25) console.log(11111);
          dispatchOrderBook(Object.values(temp.bids), Object.values(temp.asks));
        } else {
          if (!Array.isArray(msg)) {
            console.error("is not ARRAY", msg);
          } else {
            const [pp, side] = convertArrayToPricePoint(msg);
            if (!Number(pp.count)) {
              setCachedOB((state) => {
                const newState = { ...state };
                delete newState[side][pp.price];
                return newState;
              });
            } else {
              setCachedOB((state) => {
                const newState = { ...state };
                newState[side][pp.price] = pp;
                return newState;
              });
            }
            let bids = Object.values(cachedOB.bids);
            let asks = Object.values(cachedOB.asks);
            if (
              new Date().getTime() - cachedOB.timestamp >= renderDelay &&
              bids.length >= length &&
              asks.length >= length
            ) {
              setCachedOB((state) => {
                return {
                  ...state,
                  timestamp: new Date().getTime(),
                };
              });
              if (bids.length < 25) console.log(2222);
              dispatchOrderBook(bids, asks);
            }
          }
        }
      } else if (msg.event) {
        if (msg.event === "subscribed") {
          dispatch(ac_setWsIsSubscribed(true));
          console.log(msg.event, msg);
          setSubscriptionID(msg.chanId);
        }
        if (msg.event === "unsubscribed" && msg.status === "OK") {
          dispatch(ac_setWsIsSubscribed(false));
          setCachedOB(initCachedOB);
          dispatch(
            ac_updateOderBookData({
              bids: initCachedOB.bids,
              asks: initCachedOB.asks,
            })
          );
          socket.send(subscriptionParams);
          console.log(msg.event, msg);
        }
      }
    };
  }, [cachedOB, renderDelay, subscriptionParams]);

  useEffect(() => {
    socket.onopen = () => {
      dispatch(ac_setWsIsConnected(true));
      socket.send(subscriptionParams);
    };
    return () => {
      console.log("close connection");
      socket.close();
      dispatch(ac_setWsIsConnected(false));
    };
  }, []);

  useEffect(() => {
    if (socket.readyState === 1) {
      const params = JSON.stringify({
        event: "unsubscribe",
        chanId: subscriptionID,
      });
      socket.send(params);
    }
  }, [subscriptionParams]);
}
