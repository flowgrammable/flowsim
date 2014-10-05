function Error(module, component, method, err){

  return {
    module: module,
    component: component,
    method: method,
    err: err,
    pub: err.pub || {},
  };

}
module.exports = Error;
