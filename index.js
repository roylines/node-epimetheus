function middleware(request, response, done) {
  return done();
};

module.exports = () => {
  return middleware;
}
