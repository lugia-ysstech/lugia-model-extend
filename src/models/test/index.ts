import lugiax from "@lugia/lugiax";
const __LUGIAX_MODEL_DEFINE__ = "test";

type StateType = {
  counter: number;
  test: string;
};

const state: StateType = {
  counter: 0,
  test: "12343"
};

export default lugiax.register({
  model: __LUGIAX_MODEL_DEFINE__,
  state,
  mutations: {
    sync: {
      increment(state: StateType) {
        return state;
      }
    },
    async: {
      async testIncrement(state: StateType, param: any) {
        return state;
      }
    }
  }
});
