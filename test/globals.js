const should = require('chai').should();

describe('globals', () => {
    it('should expose the internal prometheus client', () => {
        const Epimetheus = require('../');
        Epimetheus.prometheus.should.not.be.undefined;
    });
});
