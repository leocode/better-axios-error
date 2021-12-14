import Axios, { AxiosInstance, AxiosAdapter } from 'axios';

const makeEnhancedAdapter = (adapter: AxiosAdapter): AxiosAdapter => async (config) => {
  const { stack } = new Error();
  
  try {
    return await adapter(config);
  } catch (err: any) {
    if (err && err.isAxiosError) {
      /**
       * Generated stack trace will look something like that:
       * 
       *   Error:
       *     at makeEnhancedAdapter (/home/ubuntu/better-axios-error/index.js:54:21)
       *     at dispatchRequest (/home/ubuntu/better-axios-error/node_modules/axios/lib/core/dispatchRequest.js:52:10)
       *     at c (/home/ubuntu/better-axios-error/index.js:66:3)
       *     at b (/home/ubuntu/better-axios-error/index.js:70:3)
       *     at a (/home/ubuntu/better-axios-error/index.js:74:3)
       * 
       * so we want do drop first 3 lines.
       */
      const formattedStack = stack ? stack.split('\n').slice(3).join('\n') : 'unknown stack';
      err.stack += `\nThrown at:\n${formattedStack}`;
    }

    throw err;
  }
}

const enhanceAxios = (axiosInstance: AxiosInstance) => {
  const currentAdapter = axiosInstance.defaults.adapter;

  if (!currentAdapter) {
    /** @INFO maybe an error should be thrown here? */
    return axiosInstance;
  }

  axiosInstance.defaults.adapter = makeEnhancedAdapter(currentAdapter);

  return axiosInstance;
}

const axios = enhanceAxios(Axios.create());

export {
  enhanceAxios,
  axios
}
