
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
  favicon: '../frontend/img/favicon.png',
  html: [ '../frontend/html', 
		'../frontend/main',
		'../frontend/subscriber',
		'../frontend/profile',
		'../frontend/packet',
		'../frontend/switch'  
	],
  css: [ '../frontend/css',
    '../frontend/bower_components/bootstrap/dist/css'
  ],
  fonts: [ '../frontend/bower_components/bootstrap/dist/fonts' ],
  img: [ '../frontend/img' ],
  js: [ '../frontend/js',
    '../frontend/bower_components/bootstrap/dist/js', 
    '../frontend/bower_components/jquery/dist', 
    '../frontend/bower_components/angular',
    '../frontend/bower_components/angular-route',
    '../frontend/bower_components/angular-ui-bootstrap/dist',
		'../frontend/bower_components/angular-cookies'
  ],
	subscriber: [ '../frontend/subscriber' ],
	profile: [ '../frontend/profile' ],
	main: [ '../frontend/main' ],
	packet: [ '../frontend/packet' ],
	switch: [ '../frontend/switch' ]
};

