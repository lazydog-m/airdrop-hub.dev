export const delayApi = (callback) => {
  setTimeout(callback, 100);
};

export const delay = (callback, ms = 500) => {
  setTimeout(callback, ms);
};
