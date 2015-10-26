var json = require('jsonfile');
var fs   = require('fs');
var path = require('path');

module.exports = function(options){

  var manifest = json.readFileSync(options.manifest);

  return function(ctx, done){

    if (ctx.parent) {
      return done(null, ctx);
    }

    if (!ctx.contents) {
      return done(new Error('File contents must be loaded.'), null);
    }

    ctx.contents = [
      module.exports.toSassString(manifest),
      ctx.contents
    ].join('\n');

    done(null, ctx);

  }

};

module.exports.toSassString = function(manifest){
  return []
    .concat(npmDependencies(manifest))
    //.concat(localDependencies(manifest))
    .join('\n')
    ;
};

function npmDependencies(manifest){
  var deps = manifest.dependencies || manifest['sc:dependencies'] || {};
  return Object.keys(deps).map(function(key){
    return '@import "' + key + '"'
  });
}


// TODO compute local dependency paths correctly
//function localDependencies(manifest){
//  var deps = manifest.locals || manifest['sc:locals'] || [];
//  return deps.map(function(key){
//    // if the user specifies a path array, use it
//    var paths = manifest.paths;
//    if(paths){
//      var found, match;
//      paths.forEach(function(pathMatch){
//        match = path.relative(pathMatch + '/' + key);
//        if(fs.existsSync(match)){
//          found = match;
//        }
//      });
//      if(found === undefined){
//        throw new Error('unable to find local dependency "' + key + '";');
//      }
//      return '@import "' + found + key + '";';
//    }
//    else {
//      // else assume they're using the right path
//      return '@import "' + key + '";'
//    }
//  });
//}

