const devpla = {
  state: {
    optedCustomer: null
  },
  mutations: {
    SET_OPT_CUS: (state, customer) => {
      state.optedCustomer = customer;
    }
  },
};

export default devpla;

