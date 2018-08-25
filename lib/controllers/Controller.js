/**
 * This is the base controller class that all controllers should extend from.
 */

class Controller {
  constructor() {
    this.allowedMethods = ['post','get','put','delete'];
  }

  _methodNotImplemented(method, callback) {
    console.log('\x1b[31m%s\x1b[0m\x1b[33m%s\x1b[0m\x1b[31m%s\x1b[0m','The method : ', method, ' needs to be implemented in the child of the Controller Class.');
    callback(500);
  }
  DELETEMethod(data, callback) {
    this._methodNotImplemented('DELETEMethod', callback);
  }

  GETMethod(data, callback) {
    this._methodNotImplemented('GETMethod', callback);
  }

  POSTMethod(data, callback) {
    this._methodNotImplemented('POSTMethod', callback);
  }

  PUTMethod(data, callback) {
    this._methodNotImplemented('PUTMethod', callback);
  }

  render(data,callback) {
    if(this.allowedMethods.indexOf(data.method) > -1){
      let method = data.method.toUpperCase() + 'Method';
      this[method](data,callback);
    } else {
      callback(405);
    }
  }
}

 module.exports = Controller;