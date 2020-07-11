const _observer = () => {
  let callbacks = [];
  const setCallback = (func) => {
    callbacks.push(func);
  };
  const setValue = (value) => {
    subscribe(value);
  };
  const subscribe = (value) => {
    callbacks.map((callback) => {
      callback(value);
    });
  };
  return {
    setCallback,
    setValue
  };
};
export const observer = _observer();
