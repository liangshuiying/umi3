declare module '*.png';

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module '*.less';

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare const __DEV__: string;
declare const DEBUG: boolean;
declare const API_ENV: string;

// NOTE: 包含一些全局的属性的注入的定义
interface BaseProps {
  location: Location;
}

// global module connect type
/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
type Dispatch = <R = any, P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => R;

type DispatchProps<K extends string, P, R> = {
  [key in K]: unknown extends P[key] ? () => Promise<R[key]> : (args: P[key]) => Promise<R[key]>;
};

enum ResponseStatus {
  FAIL,
  SUCCESS,
}

interface ResponsePage<T> {
  data: T[];
  total: number;
}

type ErrorObject = {
  code: string;
  message: string;
};

interface ResponseDTO<T = any> {
  status: ResponseStatus;
  error?: ErrorObject;
  data: T;
}

interface ResponseListDTO<T = any> extends Omit<ResponseDTO<ResponsePage<T>>, 'data'> {
  pageData: ResponsePage<T>;
}
