# better-axios-errors

Enhance your axios errors in a simple way

Typical axios error looks like this:

```
Error: Request failed with status code 404
  at createError (/home/leocode/Leocode/better-axios-error/node_modules/axios/lib/core/createError.js:16:15)
  at settle (/home/leocode/Leocode/better-axios-error/node_modules/axios/lib/core/settle.js:17:12)
  at IncomingMessage.handleStreamEnd (/home/leocode/Leocode/better-axios-error/node_modules/axios/lib/adapters/http.js:244:11)
  at IncomingMessage.emit (events.js:327:22)
  at endReadableNT (internal/streams/readable.js:1327:12)
  at processTicksAndRejections (internal/process/task_queues.js:80:21)
```

Without any useful information about where in the code the error happened.

After adding simple

```
const axios = enhanceAxios(Axios.create())
```

Calling axios with errors results in

```
Error: Request failed with status code 404
    at createError (/home/leocode/Leocode/better-axios-error/node_modules/axios/lib/core/createError.js:16:15)
    at settle (/home/leocode/Leocode/better-axios-error/node_modules/axios/lib/core/settle.js:17:12)
    at IncomingMessage.handleStreamEnd (/home/leocode/Leocode/better-axios-error/node_modules/axios/lib/adapters/http.js:244:11)
    at IncomingMessage.emit (events.js:327:22)
    at endReadableNT (internal/streams/readable.js:1327:12)
    at processTicksAndRejections (internal/process/task_queues.js:80:21)
Thrown at:
    at async hahaNobodyWillSeeMe (/home/leocode/Leocode/better-axios-error/tests/test.js:6:3)
    at async /home/leocode/Leocode/better-axios-error/tests/test.js:16:3
```

So the stack trace of code that caused a problem is included, and we see that `hahaNobodyWillSeeMe` method was responsible!

## Installation

`yarn add @leocode/better-axios-errors axios`

or

`npm install --save @leocode/better-axios-errors axios`

## Usage

Instead of importing axios directly from library,
create a file, that will export enhanced one!

```js
import axios from 'axios';
import { enhanceAxios } from '@leocode/better-axios-errors';

export const enhancedAxios = enhanceAxios(axios.create());
```

Now you can use `enhancedAxios` as normal axios instance.

Also, if you want to import enhanced axios instance, you can do it directly:

```js
import { axios } from '@leocode/better-axios-errors';
```


