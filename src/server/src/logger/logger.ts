type CusColorsT = {
  error: string,
  warn: string,
  info: string,
  verbose: string,
  debug: string
};

const cusColors = <CusColorsT>{
  error: '\x1b[31m',  //'red',
  warn: '\x1b[43m"', //'yellow', 
  info: '\x1b[32m', //'green', 
  verbose: '\x1b[36m',  //'cyan', 
  debug: '\x1b[34m',  //'blue',
};

var logger = function (ctxt: keyof typeof cusColors) {
  // const l = m[ctxt];
  return (s: string) => {
    console.log(`${cusColors[ctxt] || '\x1b[0m'}${ctxt}\x1b[0m: ${s}`);    //eslint-disable-line no-console
  };
};

export const debug = logger('debug');
export const info = logger('info');
export const error = logger('error');
