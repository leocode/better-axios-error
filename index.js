const makeEnhancedAdapter = (adapter) => async (config) => {
  const { stack } = new Error();
  
  try {
    return await adapter(config);
  } catch (err) {
    if (err.isAxiosError) {
      /**
       * Generated stack trace will look something like that:
       * 
       *   Error:
       *     at makeEnhancedAdapter (/home/ubuntu/better-axios-error/index.js:54:21)
       *     at dispatchRequest (/home/ubuntu/better-axios-error/node_modules/axios/lib/core/dispatchRequest.js:52:10)
       *     at async c (/home/ubuntu/better-axios-error/index.js:66:3)
       *     at async b (/home/ubuntu/better-axios-error/index.js:70:3)
       *     at async a (/home/ubuntu/better-axios-error/index.js:74:3)
       * 
       * so we want do drop first 3 lines.
       */
      const cleanStack = `Thrown at:\n${stack.split('\n').slice(3).join('\n')}`;
      err.stack = `${err.stack}\n${cleanStack}`;
    }

    throw err;
  }
}

const enhanceAxios = (axiosInstance) => {
  const currentAdapter = axiosInstance.defaults.adapter;

  axiosInstance.defaults.adapter = makeEnhancedAdapter(currentAdapter);

  return axiosInstance;
}

module.exports = enhanceAxios;
