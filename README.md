# sass-composer-manifest

A sass-composer plug-in to `@import` your dependencies from a .json manifest

## usage

the plug-in will use the `"dependencies"` or `"sc:dependencies"` fields of the manifest to source npm packages, and `"locals"` or `"sc:locals"` for local files.

@ build time, specify the plug in before all others so that the `@import`ed files get your other plug-ins too:

```js

var composer = require('sass-composer');
var manifest = require('sass-composer-manifest');

//...

gulp.task('styles', function(){
  return composer({
    entry: 'styles.scss'
  })
    .use(manifest({
      manifest: './package.json'
    })) // always include manifest first!
    .use(composer.plugins.url({
       dir: './build',
       copy: true
    }))
    .compose()
    .pipe(vsource(name + '.css'))
    .pipe(vbuffer())
    .pipe(gulp.dest(SRC_DIRS.STYLES_BUILD))
    ;
});

```

in your package.json:

```json

{
  "name": "my-styles",
  "version": "0.0.1",
  "dependencies": {
    "foo": "^0.0.1"
  },
  "locals": [
    "bar.scss"
  ]
}

```

where `"locals"` are local files (paths relative to the manifest) to be `@import`ed. You can specify paths to find locals as well:

```json

{
  "name": "my-styles",
  "version": "0.0.1",
  "dependencies": {
    "foo": "^0.0.1"
  },
  "paths": [
    "./lib"
  ],
  "locals": [
    "bar.scss"
  ]
}

```

is the same as

```json

{
  "name": "my-styles",
  "version": "0.0.1",
  "dependencies": {
    "foo": "^0.0.1"
  },
  "locals": [
    "./lib/bar.scss"
  ]
}

```
