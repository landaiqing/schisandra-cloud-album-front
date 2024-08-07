/** @format */

import Request from "./request";

const web: Request = new Request({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 5000,
});

export default web;
