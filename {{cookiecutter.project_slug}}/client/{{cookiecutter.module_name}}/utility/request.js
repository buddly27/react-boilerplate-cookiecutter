import "whatwg-fetch";


/**
 * Parses the JSON returned by a network request.
 *
 */
function parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }
    return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not.
 *
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 */
export default function request(url, options) {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON);
}
