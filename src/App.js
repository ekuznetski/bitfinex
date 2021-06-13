import OrderBook from "./components/orderBook/OrderBook";
import { Provider } from "react-redux";
import { store } from "./store";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <OrderBook />
    </Provider>
  );
}

export default App;
