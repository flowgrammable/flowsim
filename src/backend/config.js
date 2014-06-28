
/* config.js - a simple object describing the layout of static files to serve
 *
 *  favicon - location of the site's favicon
 *  html    - html document roots
 *  css     - css document roots
 *  fonts   - fonts document roots
 *  img     - img document roots
 *  js      - javascript document roots
 */

module.exports = {
  favicon: 'img/favicon.png',
  html: [ 'html' ],
  css: [ 'css',
    'bower_components/bootstrap/dist/css'
  ],
  fonts: [ 'bower_components/bootstrap/dist/fonts' ],
  img: [ 'img' ],
  js: [ 'js',
    'bower_components/bootstrap/dist/js', 
    'bower_components/jquery/dist', 
    'bower_components/angular',
    'bower_components/angular-route',
    'bower_components/angular-ui-bootstrap/dist'
  ]
};

