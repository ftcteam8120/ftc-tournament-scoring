var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: './dist/**',
    platforms: ['osx64', 'win32', 'win64'],
    version: '0.27.5',
    buildDir: './build'
});

// Log stuff you want
nw.on('log',  console.log);

nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});