export default function combineSpreadingReducers(
  reducers,
  spreadingReducersKeys
) {
  const initialStates = {};
  const reducerKeys = Object.keys(reducers);

  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      let previousStateForKey;
      if (
        spreadingReducersKeys.indexOf(key) !== -1 &&
        initialStates.hasOwnProperty(key)
      ) {
        previousStateForKey = {};
        for (const stateKey of Object.keys(initialStates[key])) {
          previousStateForKey[stateKey] = state[stateKey];
        }
      } else {
        previousStateForKey = state[key];
      }
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        throw new Error(
          `One of the reducers returned undefined. key: ${key}, action: ${action}`
        );
      }
      if (!initialStates.hasOwnProperty(key)) {
        initialStates[key] = nextStateForKey;
      }
      if (spreadingReducersKeys.indexOf(key) !== -1) {
        Object.assign(nextState, nextStateForKey);
      } else {
        nextState[key] = nextStateForKey;
      }
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
