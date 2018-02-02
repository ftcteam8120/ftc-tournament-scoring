/**
 * The inline API URL variable
 */
const apiDef = "$api";
/**
 * The inline auth URL variable
 */
const authDef = "$auth";
/**
 * The inline session URL variable
 */
const sessionDef = "$session";
/**
 * The API URL from webpack
 */
declare const API_URL: string;
/**
 * The API version from webpack
 */
declare const API_VERSION: string;

/**
 * Fido is a small wrapper around the fetch API
 * that better handles errors with promises and
 * is able to extract data from the returned JSON
 * 
 * @export
 * @param {RequestInfo} input 
 * @param {RequestInit} [init] 
 * @param {boolean} [extractData] 
 * @returns {Promise<any>} 
 */
export default function fido(input: RequestInfo, init?: RequestInit, extractData?: boolean): Promise<any> {
  if (!init) init = {};
  //init.credentials = 'include';
  init.headers = {
    ...init.headers,
    'Content-Type': 'application/json',
    // Add the authorization token from the auth store
    'Authorization': 'Bearer ' + window.localStorage.token
  };
  init.body = JSON.stringify(init.body);
  if (extractData === undefined) extractData = true;
  var inputType = typeof input;
  if (inputType === "string") {
    let url = input as string;
    if (url.includes(apiDef)) {
      input = url.replace(apiDef, API_URL+"/"+API_VERSION);
    } else if (url.includes(authDef)) {
      input = url.replace(authDef, API_URL+"/"+API_VERSION+"/auth");
    } else if (url.includes(sessionDef)) {
      input = url.replace(sessionDef, API_URL+"/"+API_VERSION+"/session");
    }
  }
  return fetch(input, init).then((response) => {
    if (!response.ok) {
      return response.json().then((json) => {
        return Promise.reject(json.error);
      });
    } else {
      return Promise.resolve(response);
    }
  }).then((response) => {
    return response.json();
  }).then((json) => {
    if (extractData) {
      return json.data;
    } else {
      return json;
    }
  });
}

/**
 * Run Fido with the API URL already added
 * 
 * @export
 * @param {string} url 
 * @param {RequestInit} [init] 
 * @returns {Promise<any>} 
 */
export function fidoApi(url: string, init?: RequestInit, extractData?: boolean): Promise<any> {
  return fido(apiDef + "/" + url, init, extractData);
}

/**
 * Run Fido with the auth URL already added
 * 
 * @export
 * @param {string} url 
 * @param {RequestInit} [init] 
 * @returns {Promise<any>} 
 */
export function fidoAuth(url: string, init?: RequestInit, extractData?: boolean): Promise<any> {
  return fido(authDef + "/" + url, init, extractData);
}