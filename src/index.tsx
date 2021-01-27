import React from "react";
import { createBrowserHistory } from "history";
import { createApp, render } from "@lugia/lugiax-router";
import Demo from "./App";

const history = createBrowserHistory();

const App = createApp(
  {
    "/": {
      component: Demo
    }
  },
  history
);

render(() => {
  return <App />;
}, "root");
