export function createEventManager<T>() {
  let listeners: Array<(data: T) => void> = [];
  const on = (cb: (data: T) => void) => {
    listeners.push(cb);
  };
  const emit = (data: T) => {
    listeners.forEach((listener) => {
      listener(data);
    });
  };
  const remove = () => {
    listeners = [];
  };
  return { on, emit, remove };
}
