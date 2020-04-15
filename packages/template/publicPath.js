// dynamically set the webpack public path
// so dynamically loaded modules load
// with their website id in the url so the
// server can figure out what template the website is using
__webpack_public_path__ = window._nocodeBaseUrl
