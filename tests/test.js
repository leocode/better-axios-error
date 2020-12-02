const test = require('tape');
const Axios = require('axios').default;
const enhanceAxios = require('../index');

const a = async (axiosInstance) => {
  await axiosInstance.get('https://google.com/i-dont-exist');
}

const b = async (axiosInstance) => {
  await a(axiosInstance);
}

test('error enhancement', async (t) => {
  t.plan(2);

  // given
  const enhancedAxios = enhanceAxios(Axios.create());

  // when
  const enhancedErrorStack = await b(enhancedAxios).catch(err => {
    return err.stack;
  })

  // then
  t.match(enhancedErrorStack, /at async a /, 'found line with inner function');
  t.match(enhancedErrorStack, /at async b /, 'found line with outer function');
});

test('Axios instance scope', async (t) => {
  t.plan(4);

  // given
  const plainAxios = Axios.create();
  const enhancedAxios = enhanceAxios(Axios.create());

  // when
  const enhancedErrorStack = await b(enhancedAxios).catch(err => {
    return err.stack;
  })

  const plainAxiosError = await b(plainAxios).catch(err => {
    return err.stack;
  })

  // then
  t.match(enhancedErrorStack, /at async a /, 'found line with inner function');
  t.match(enhancedErrorStack, /at async b /, 'found line with outer function');

  t.doesNotMatch(plainAxiosError, /at async a /, 'not found line with inner function');
  t.doesNotMatch(plainAxiosError, /at async b /, 'not found line with outer function');
});
