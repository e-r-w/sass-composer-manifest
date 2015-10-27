var json = require('jsonfile');
var fs   = require('fs');
var path = require('path');

module.exports = function(options){

  return function(ctx, done){

    if (ctx.parent) {
      return done(null, ctx);
    }

    if (!ctx.contents) {
      return done(new Error('File contents must be loaded.'), null);
    }

    json.readFile(options.manifest, function(err, manifest){

      if(err) return done(err, null);

      ctx.manifestDir = path.dirname(options.manifest);

      ctx.contents = [
        module.exports.toSassString(manifest, ctx),
        ctx.contents
      ].join('\n');

      done(null, ctx);

    });

  }

};

module.exports.toSassString = function(manifest, ctx){
  return []
    .concat(npmDependencies(manifest))
    .concat(localDependencies(manifest, ctx))
    .join('\n')
    ;
};

function npmDependencies(manifest){
  var deps = manifest.dependencies || manifest['sc:dependencies'] || {};
  return Object.keys(deps).map(function(key){
    return '@import "' + key + '";'
  });
}


function localDependencies(manifest, ctx){
  return (manifest.locals || manifest['sc:locals'] || []).map(function(dep){
    // if the user specifies a path array, use it
    var paths = manifest.paths;
    if(paths){
      var found;
      paths.forEach(function(pathMatch){
        var match = path.resolve(ctx.manifestDir, pathMatch + '/' + dep);
        if(fs.existsSync(match)){
          found = pathMatch;
        }
      });
      if(!found){
        throw new Error('unable to find local dependency "' + dep + '" of ' + ctx.file);
      }
      return '@import "' + path.relative(ctx.manifestDir, found + '/' + dep).replace(/\\/g, '/') + '";';
    }
    else {
      // else assume they're using the right path, relative to the manifest
      return '@import "' + path.relative(ctx.manifestDir, dep).replace(/\\/g, '/') + '";'
    }
  });
}

