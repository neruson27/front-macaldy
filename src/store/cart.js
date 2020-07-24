export const ShoppingCartModule = {
  state: {
    cartKeys: [],
    cartItems: []
  },
  mutations: {
    cartKeys(state, keys) {
      state.cartKeys = keys;
    },
    addItem(state, newItem) {
      let found = -1;
      for (const cartIndex in state.cartItems) {
        const item = state.cartItems[cartIndex];
        let allMatch = true;
        for (const keyIndex in state.cartKeys) {
          const keyValue = state.cartKeys[keyIndex];
          if (item[keyValue] != newItem[keyValue]) {
            allMatch = false;
            break;
          }
        }
        if (allMatch == true) {
          found = cartIndex;
          break;
        }
      }
      if (found > -1) {
        state.cartItems[found].quantity += newItem.quantity || 1;
      } else {
        if (newItem["quantity"] == undefined) {
          newItem.quantity = 1;
        }
        state.cartItems.push(newItem);
      }
    },
    delItem(state, params) {
      let found = -1;
      for (const cartIndex in state.cartItems) {
        const item = state.cartItems[cartIndex];
        let allMatch = true;
        for (const keyIndex in state.cartKeys) {
          const keyValue = state.cartKeys[keyIndex];
          if (item[keyValue] != params.itemKeys[keyValue]) {
            allMatch = false;
            break;
          }
        }
        if (allMatch == true) {
          found = cartIndex;
          break;
        }
      }
      if (found > -1) {
        state.cartItems[found].quantity -= params.quantity;
        if (state.cartItems[found].quantity < 1) {
          state.cartItems.splice(found, 1);
        }
      }
    },
    empty(state) {
      state.cartItems = [];
    }
  },
  actions: {
    addItem(context, item) {
      context.commit(item);
    },
    delItem(context, params) {
      context.commit(params);
    },
    cartKeys(context, keys) {
      context.commit(keys);
    },
    empty(context) {
      context.commit();
    }
  },
  getters: {
    itemCount: state => {
      return state.cartItems.length;
    },
    cart: state => {
      return state.cartItems;
    },
    cartKeys: state => {
      return state.cartKeys;
    },
    itemKeys: state => {
      let results = [];
      for (const cartIndex in state.cartItems) {
        const item = state.cartItems[cartIndex];
        let keyRecord = { quantity: item.quantity };
        for (const keyIndex in state.cartKeys) {
          const keyValue = state.cartKeys[keyIndex];
          keyRecord[keyValue] = item[keyValue];
        }
        results.push(keyRecord);
      }
      return results;
    }
  }
};
