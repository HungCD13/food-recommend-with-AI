"use strict";

window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2"
const /**{String}  */ APP_ID = "3f53d4ef";
const /**{String}  */ API_KEY = "7187a8522e5d918f3e04ca8363cbdcba";
const /**{String}  */ TYPE = "public";

/**
 * @param {*} queries Query array
 * @param {*} successCallback Success Callback Function
 */


export const fetchData = async function (queries, successCallback) {
    const /**{String}  */ query = queries?.join("&")
     .replace(/,/g, "=")
     .replace(/ /g, "%20")
     .replace(/\+/g, "%28");
    const /**{String} */ url = `${ACCESS_POINT}?app_id=${APP_ID}&app_key=${API_KEY}&type=${TYPE}${query ? `&${query}` : ""}`;

    const /**{Object} */ response = await fetch(url);

    if (response.ok) {
        const data = await response.json();
        successCallback(data)
    }
}  