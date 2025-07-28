let ioInstance;

export const setSocketIO = (io) => {
  ioInstance = io;
};

export const getSocketIO = () => ioInstance;
