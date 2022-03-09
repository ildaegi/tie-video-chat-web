import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface RequestProps {
  data?: unknown;
  config?: AxiosRequestConfig;
}

interface _RequestProps {
  post: <T = unknown>(
    uri: string,
    param?: RequestProps,
    isCatch?: boolean
  ) => Promise<T>;
  get: <T = unknown>(
    uri: string,
    param?: RequestProps,
    isCatch?: boolean
  ) => Promise<T>;
  put: <T = unknown>(
    uri: string,
    param?: RequestProps,
    isCatch?: boolean
  ) => Promise<T>;
  delete: <T = unknown>(
    uri: string,
    param?: RequestProps,
    isCatch?: boolean
  ) => Promise<T>;
  defaultExceptions: (error: any) => void;
  convertResponse: <T>(d: any) => T;
}

export enum SuccessStatus {
  "OK" = 200,
  "CREATED" = 201,
  "ACCEPTED" = 202,
  "NO_CONTENT" = 204,
  "MOVED_PERMANENTLY" = 301,
  "FOUND" = 302,
  "SEE_OTHER" = 303,
  "NOT_MODIFIED" = 304,
  "TEMPORARY_REDIRECT" = 307,
  "PERMANENT_REDIRECT" = 308,
}

function parseResponse({ status, data }: AxiosResponse) {
  if (status in SuccessStatus) {
    if (typeof data.result === "boolean") {
      return data.data ?? data.result;
    } else {
      return data.result;
    }
  } else {
    console.log("parseResponse fail", { status, data });
    return false;
  }
}

const _Request: _RequestProps = {
  async post(uri = "", { data = {}, config = {} } = {}, isCatch = true) {
    return await Axios.post(uri, data, {
      ...config,
      headers: {
        ...{ "Cache-Control": "no-cache", Pragma: "no-cache", Expires: "0" },
        ...{
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
        },
        ...config.headers,
      },
    })
      .then(parseResponse)
      .catch((error) => {
        console.log(
          "In NewData.post, error catched",
          {
            uri,
            data,
            config,
            error: error?.response?.data,
          },
          "\nat src/util/Data.new.ts:53:11\n"
        );

        if (error.code === "ECONNABORTED") {
          alert(
            "서버와의 연결에 문제가 있습니다.\n기기의 인터넷 상태를 확인해주세요."
          );
          return;
        } else {
          if (isCatch) {
            alert(error.response?.data?.reason || error);
          } else {
            throw error;
          }
        }
      });
  },
  async get(uri = "", { data: params = {}, config = {} } = {}, isCatch = true) {
    return await Axios.get(uri, {
      params,
      ...config,
    })
      .then(parseResponse)
      .catch((error) => {
        console.log(
          "In NewData.get, error catched",
          {
            uri,
            config,
            error: error?.response?.data,
          },
          "\nat src/util/Data.new.ts:81:11\n"
        );
        if (error.code === "ECONNABORTED") {
          alert(
            "서버와의 연결에 문제가 있습니다.\n기기의 인터넷 상태를 확인해주세요."
          );
          return;
        } else {
          if (isCatch) {
            alert(error.response?.data?.reason || error);
          }
        }

        throw error;
      });
  },

  async put(uri = "", { data = {}, config = {} } = {}, isCatch = true) {
    return await Axios.put(uri, data, {
      ...config,
      headers: {
        ...{
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
        },
        ...config.headers,
      },
    })
      .then(parseResponse)
      .catch((error) => {
        console.log(
          "In NewData.put, error catched",
          {
            uri,
            data,
            config,
            error: error?.response?.data,
          },
          "\nat src/util/Data.new.ts:109:11\n"
        );
        if (error.code === "ECONNABORTED") {
          alert(
            "서버와의 연결에 문제가 있습니다.\n기기의 인터넷 상태를 확인해주세요."
          );
          return;
        } else {
          if (isCatch) {
            alert(error.response?.data?.reason || error);
          }
        }

        throw error;
      });
  },

  async delete(uri = "", { data = {}, config = {} } = {}, isCatch = true) {
    return await Axios.delete(uri, {
      data,
      ...config,
    })
      .then(parseResponse)
      .catch((error) => {
        console.log(
          "In NewData.delete, error catched",
          {
            uri,
            data,
            config,
            error: error?.response?.data,
          },
          "\nat src/util/Data.new.ts:138:11\n"
        );
        if (error.code === "ECONNABORTED") {
          alert(
            "서버와의 연결에 문제가 있습니다.\n기기의 인터넷 상태를 확인해주세요."
          );
          return;
        } else {
          if (isCatch) {
            alert(error.response?.data?.reason || error);
          }
        }

        throw error;
      });
  },

  defaultExceptions(error) {
    alert(error.response?.data?.reason || error);

    console.log(
      {
        error,
      },
      "\nat src/utils/Data.new.ts:153:3\n"
    );
  },
  convertResponse<T>(data: object | any[]): T {
    const isObject = (o: object) => {
      return o === Object(o) && !isArray(o) && typeof o !== "function";
    };

    const isArray = (a: object) => Array.isArray(a);

    const toCamel = (s: string | number): string | number => {
      if (typeof s === "string") {
        return s.replace(/([-_][a-z])/gi, ($1) => {
          return $1.toUpperCase().replace("-", "").replace("_", "");
        });
      }

      return s;
    };

    const keysToCamel = (o: object | any[]): object | any[] => {
      if (isObject(o)) {
        const obj: any = o;
        let n: any = {};

        Object.keys(obj).forEach((k) => {
          n[toCamel(k)] = keysToCamel(obj[k]);
        });

        return n;
      } else if (isArray(o)) {
        return (o as any[]).map((i) => {
          return keysToCamel(i);
        });
      }

      return o;
    };

    const convertObjectToCamelCase = (o: object | any[]) => {
      if (isObject(o)) {
        const obj: any = o;
        let n: any = {};

        Object.keys(obj).forEach((k) => {
          n[toCamel(k)] = keysToCamel(obj[k]);
        });

        return n;
      } else if (isArray(o)) {
        return (o as any[]).map((i) => {
          return keysToCamel(i);
        });
      }

      return o;
    };

    return convertObjectToCamelCase(data);
  },
};

export default _Request;
