import React, { memo } from "react";
import OrderBookTable from "./orderBookTable/OrderBookTable";
import { useOrderBook } from "../../hooks/useOrderBook";
import { useSelector } from "react-redux";
import OrderBookSettings from "./orderBookSettings/OrderBookSettings";
import { EOrderBookSides } from "../../enums/orderBookSides.enum";
import "./orderBook.scss";

const OrderBookMemoized = memo(function OrderBook() {
  return (
    <>
      <div className="order-book">
        <OrderBookTable side={EOrderBookSides.bids} />
        <OrderBookTable side={EOrderBookSides.asks} />
      </div>
    </>
  );
});

export default function OrderBook() {
  useOrderBook();
  const { asks, bids } = useSelector((state) => ({
    asks: state.data[EOrderBookSides.asks],
    bids: state.data[EOrderBookSides.bids],
  }));
  return (
    <>
      <OrderBookSettings />
      {Object.keys(asks).length && Object.keys(bids).length ? (
        <OrderBookMemoized />
      ) : (
        <div className="loading">
          <div className="loader" />
          Loading
        </div>
      )}
    </>
  );
}
