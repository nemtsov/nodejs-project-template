task('default', function () {
  jake.Task['docs'].invoke();
});

desc('Runs the docs.');
task('docs', function () {
  runDox();
});

desc('Runs the tests.');
task('test', function () {
  runMocha();
});

function runDox(options) {
  var doxRunner = new DoxRunner(options);
  doxRunner.getDocs(function (err, docs) {
    docs.forEach(function (doc) {
      var render = doxRunner.renderDoc(doc.doc);
      console.log(render);
    });
  });
}

function runMocha() {
  var spawn = require('child_process').spawn;
  var mocha = spawn('./node_modules/mocha/bin/mocha', [], {customFds: [0,1,2]});
  //mocha.stdout.on('data', process.stdout);
}


//-------------

var fs = require('fs')
  , glob = require('glob')
  , dox = require('dox')
  , hogan = require('hogan');

function DoxRunner(opts) {
  this._opts = opts || {};
  this._libGlob = 'lib/**/*.js';
}

DoxRunner.prototype.getDocs = function (cb) {
  var self = this
    , fileDox = [];

  glob(this._libGlob, function (err, files) {
    if (err) return cb(err);

    var isCbFired = false;
    files.forEach(function (file, i) {
      fs.readFile(file, function (err, data) {
        // error out on the first err
        if (err) { cb(err); isCbFired = true; }
        if (isCbFired) return;

        var doc = dox.parseComments(data.toString(), self._opts);
        fileDox.push({name: file, doc: doc});

        // when done, return all files & dox
        if (i === (files.length - 1)) {
          cb(null, fileDox);
        }
      });
    });
  });
};

DoxRunner.prototype.renderDoc = function (doc) {
  var tplFile = fs.readFileSync('./support/docs.html', 'utf-8')
    , template = hogan.compile(tplFile);

  function title(comment) {
    if (!comment.ctx) return;
    if (~comment.ctx.string.indexOf('module.exports')) return '';
    if (~comment.ctx.string.indexOf('prototype')) {
      return comment.ctx.string.replace('.prototype.', '#');
    } else {
      return comment.ctx.string;
    }
  }

  function id(comment) {
    if (!comment.ctx) return '';
    return comment.ctx.string
      .replace('()', '');
  }

  function ignore(comment) {
    return Boolean(comment.ignore
      || (comment.ctx && ~comment.ctx.string.indexOf('__proto__'))
      || ~comment.description.full.indexOf('Module dependencies'));
  }

  // massage the dox comments
  var comments = doc.filter(function (comment) {
    return !ignore(comment);
  });

  comments = comments.map(function (comment) {
    comment.id = id(comment);
    comment.title = title(comment);
    comment.hasTags = (comment.tags.length > 0);
    comment.tags.forEach(function (tag) {
      // type regonition
      tag.isParam = ('param' === tag.type);
      tag.isReturn = ('return' === tag.type);
      tag.isApi = ('api' === tag.type);

      tag.hasTypes = (tag.types && tag.types.length > 0);
      if (tag.types) {
        tag.combinedTypes = tag.types.join(' | ');
      }
      if ('string' !== typeof tag.description) {
        tag.description = '';
      }
    });

    return comment;
  });

  var comments = comments.filter(function (elm) {
    return ('undefined' !== typeof elm);
  });

  //console.dir(comments);

  return template.render({
    comments: comments
  });
};
