import React from "react";
import { createBrowserHistory } from "history";
import { createApp, render } from "@lugia/lugiax-router";
import "@lugia/lugia-web/dist/css/global.css";
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
