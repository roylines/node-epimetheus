function parse (path) {
  var ret = {
    path: path,
    cardinality: 'many'
  };

  if (path[path.length - 1] != '/') {
    ret.cardinality = 'one'
  };

  return ret
}

module.exports = {
  parse: parse
}
