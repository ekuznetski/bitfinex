import React, { memo } from "react";
import { useSelector } from "react-redux";
import OrderBookRow from "../orderBookRow/OrderBookRow";
import "./orderBookTable.scss";

const OrderBookTableMemo = memo(function OrderBookTable({ side, length }) {
  return (
    <div className="order-book-table">
      <OrderBookRow side={side} header={true} />
      {Array.from({ length }).map((_, i) => (
        <OrderBookRow key={i} id={i} side={side} />
      ))}
    </div>
  );
});

export default function OrderBookTable({ side }) {
  const length = useSelector((state) => state.app.length);
  return <OrderBookTableMemo length={length} side={side} />;
}
