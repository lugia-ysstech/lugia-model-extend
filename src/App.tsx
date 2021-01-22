import React from "react";
import { connect } from "@lugia/lugiax";
import test from "./models/test";

const Demo = (props: any) => {
  return <div>{...props}</div>;
};
const DemoComponent = connect(
  test,
  (state: any) => state.toJS(),
  (mutations: any) => mutations
)(Demo);

export default () => {
  return <DemoComponent />;
};
