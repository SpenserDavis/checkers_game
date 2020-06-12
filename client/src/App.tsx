import React from "react";
import "./App.css";
import Checkers from "./components/Checkers";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "./reducers";

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

function App() {
  return (
    <div className="App">
      <div className="container">
        <Provider store={store}>
          <Checkers />
        </Provider>
      </div>
    </div>
  );
}

export default App;
