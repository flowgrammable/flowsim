'use strict';

angular.module('flowsimUiApp')
  .factory('portsView', function() {

    return function(sw, rowWidth) {
      var row, rowCount, slot;
      var result;

      if(_.isUndefined(sw)) { return []; }

      rowCount = Math.floor(sw.length / rowWidth) + (sw.length%rowWidth ? 1:0);
      rowCount = rowCount % 2 !== 0 ? rowCount + 1 : rowCount;
      result = _.map(_.range(rowCount), function() { return []; });

      if(sw && sw.length <= rowWidth) {
        return [sw];
      } else if(sw) {
        row = 0;
        slot = 0;
        _.each(sw, function(port) {
          result[2*slot+row].push(port);
          row = (row + 1) % 2;
          slot = Math.floor((port.port_id+1) / (2 * rowWidth));
        });
      }
    return result;
  };

});
