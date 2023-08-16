const get_routes = [];
const post_routes = [];
const put_routes = [];
const delete_routes = [];

function hasRouted(req, res, routes) {
    for (const route of routes) {

        if (req.url === route.url) {
            route.callback(req, res);
            return true;
        }

        let route_url = route.url.replace('{id}', '');
        let pattern = `^${route_url.replaceAll('/', '\\/')}(?!$)(\\d+)$`;
        let regex = new RegExp(pattern);
        route_url += 1;

        if (regex.test(req.url) && regex.test(route_url)) {
            route.callback(req, res);
            return true;
        }
    }
    return false;
}

function getRouted(req, res) {
    return hasRouted(req, res, get_routes)
}

function postRouted(req, res) {
    return hasRouted(req, res, post_routes)
}

function putRouted(req, res) {
    return hasRouted(req, res, put_routes)
}

function deleteRouted(req, res) {
    return hasRouted(req, res, delete_routes)
}

function get(url, callback) {
    get_routes.push({ url: url, callback: callback });
}

function post(url, callback) {
    post_routes.push({ url: url, callback: callback });
}

function put(url, callback) {
    put_routes.push({ url: url, callback: callback });
}

function delet(url, callback) {
    delete_routes.push({ url: url, callback: callback });
}

module.exports = {
    get, post, put, delet, getRouted, postRouted, putRouted, deleteRouted
    /*get_routes, post_routes, put_routes, delete_routes*/, hasRouted
};