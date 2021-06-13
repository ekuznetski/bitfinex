import React from "react";
import { useSelector } from "react-redux";
import "./orderBookRow.scss";
import classNames from "classnames";
import { EOrderBookKeys } from "../../../enums/orderBookKeys.enum";
import { EOrderBookSides } from "../../../enums/orderBookSides.enum";

function round(num) {
  if (num < 0.0001) {
    const firstNonZero = num
      .toString()
      .split("")
      .findIndex((e) => e !== "0" && e !== ".");
    return num.toFixed(firstNonZero - 2);
  }
  return num.toFixed(4);
}

function OrderBookRowMemo({ rowData }) {
  return (
    <div
      className={classNames(
        "order-book-row",
        rowData.side,
        rowData.header && "header"
      )}
    >
      <div className="order-book-cell">{rowData.count}</div>
      <div className="order-book-cell">{rowData.amount}</div>
      <div className="order-book-cell">{rowData.total}</div>
      <div className="order-book-cell">{rowData.price}</div>
      {!rowData.header && (
        <div
          className="order-book-cell depth"
          style={{ width: `${rowData.totalPercentage}%` }}
        />
      )}
    </div>
  );
}

export default function OrderBookRow({ id, side, header = false }) {
  if (header) id = 0;
  const orderBookData = useSelector((state) => ({
    asks: state.data[EOrderBookSides.asks],
    bids: state.data[EOrderBookSides.bids],
  }));
  const rowData = {
    side,
    header,
  };
  if (header) {
    Object.assign(rowData, {
      ...orderBookData[side][id],
      ...EOrderBookKeys,
    });
  } else {
    Object.assign(rowData, {
      ...orderBookData[side][id],
      amount: round(orderBookData[side][id].amount),
      total: round(orderBookData[side][id].total),
    });
  }
  return <OrderBookRowMemo rowData={rowData} />;
}
