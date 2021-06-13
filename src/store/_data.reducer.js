import { EOrderBookSides } from "../enums/orderBookSides.enum";

export const initDataStore = {
  [EOrderBookSides.bids]: [],
  [EOrderBookSides.asks]: [],
};

export function dataStoreReducer(state = initDataStore, action) {
  switch (action.type) {
    case "UPDATE_ORDER_BOOK_DATA": {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}
