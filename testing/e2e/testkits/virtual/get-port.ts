import * as getPortModule from 'get-port';

export const getPort = async () => {
  return await getPortModule.default({
    port: getPortModule.portNumbers(4000, 5000),
  });
};
