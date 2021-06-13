export function ac_updateOderBookData(payload) {
  return {
    type: "UPDATE_ORDER_BOOK_DATA",
    payload,
  };
}

export function ac_setWsIsConnected(payload) {
  return {
    type: "SET_WS_IS_CONNECTED",
    payload,
  };
}

export function ac_setWsIsSubscribed(payload) {
  return {
    type: "SET_WS_IS_SUBSCRIBED",
    payload,
  };
}

export function ac_increaseRenderDelay() {
  return {
    type: "INCREASE_RENDER_DELAY",
  };
}

export function ac_decreaseRenderDelay() {
  return {
    type: "DECREASE_RENDER_DELAY",
  };
}

export function ac_increasePrecision(payload) {
  return {
    type: "INCREASE_PRECISION",
    payload,
  };
}

export function ac_decreasePrecision(payload) {
  return {
    type: "DECREASE_PRECISION",
    payload,
  };
}
