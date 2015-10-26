// expose module as a sass-composer plug-in
module.exports = function(options){
  return function(composer){
    composer.importer(require('./lib/manifest')(options));
  };
};
