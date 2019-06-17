let environment, bucketURL;
const hostname = window && window.location && window.location.hostname;


console.log(hostname);
if (hostname === 'localhost') {
    environment = 'local';
} else if (hostname === 'bob-panel-dev.herokuapp.com') {
    environment = 'dev';
} else if (hostname === 'bob-panel-stag.herokuapp.com') {
    environment = 'stag';
} else if (hostname === 'bob-panel.herokuapp.com') {
    environment = 'prod';
}else {
    environment = process.env.NODE_ENV;
}


export const API_ROOT = `${environment}`;
export const BUCKET_ROOT = `${bucketURL}`;