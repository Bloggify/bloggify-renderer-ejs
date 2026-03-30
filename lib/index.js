"use strict";

import ejs from "ejs";

let disableCache = false;

/*!
 * init
 *
 * @name init
 * @function
 * @param {Object} config The configuration object:
 *
 *  - `disableCache` (Boolean): If `true`, the cache will be disabled.
 */
export const init = function (config) {
    disableCache = !!config.disableCache;
    Bloggify.renderer.registerRenderer("ejs", render);
};

/*!
 * factory
 * Returns a HTTP request handler.
 *
 * @name factory
 * @function
 * @param {Function} cb The callback function.
 * @returns {Function} The request handler.
 */
export const factory = cb => {
    return function (ctx) {
        return cb((path, data, cb) => {
            return render(ctx, path, data, cb);
        }, ctx);
    };
};

/*!
 * render
 * Renders the file.
 *
 * @name render
 * @function
 * @param {ctx} ctx The context.
 * @param {String} path The file path.
 * @param {Object} data The template data.
 * @returns {Promise} The promise.
 */
export const render = async (ctx, data, tmpl) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(tmpl.path, data, { cache: !disableCache }, function (err, html) {
            if (err) { return reject(err); }

            data.statusCode = data.statusCode || (data.error && data.error.statusCode || 200);

            ctx.end(html, data.statusCode);
            resolve(html);
        });
    });
};
