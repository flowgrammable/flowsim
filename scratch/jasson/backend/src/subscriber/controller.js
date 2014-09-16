
var msg = require('./msg');
var adapter = require('./adapter');

module.exports = function(db) {

var database = adapter(db);

function _createSubscriber(dispatch) {
}

function _verifySubscriber(dispatch) {
}

function _resetSubscriber(dispatch) {
}

function _updateSubscriber(dispatch) {
}

function _loginSubscriber(dispatch) {
}

function _logoutSubscriber(dispatch) {
}

return {
  createSubscriber: _createSubscriber,
  verifySubscriber: _verifySubscriber,
  resetSubscriber: _resetSubscriber,
  updateSubscriber: _updateSubscriber,
  loginSubscriber: _loginSubscriber,
  logoutSubscriber: _logoutSubscriber
};

};

