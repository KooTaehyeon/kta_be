declare module 'node-fetch' {
  import { Request, Response, Headers, FetchError } from 'node-fetch';

  export default function fetch(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response>;
  export { Request, Response, Headers, FetchError };
}
