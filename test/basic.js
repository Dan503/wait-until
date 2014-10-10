var waitUntil = require('../index'),
    mocha     = require('mocha'),
    must      = require('must');

describe('Basic operation', function() {
    var ready,
        calls;

    beforeEach(function() {
        ready = false;
        calls = 0;
    });

    function check() {
        calls++;
        return ready;
    }

    function markReady() {
        ready = true;
    }

    it('uses the function interface', function(done) {
        waitUntil(50, 20, check, function(ok) {
            ok.must.equal(true);
            calls.must.equal(6);
            done();
        });

        setTimeout(markReady, 275);
    });

    it('uses the partial fluent interface', function(done) {
        waitUntil()
            .interval(50)
            .times(10)
            .condition(check, function(ok) {
                ok.must.equal(true);
                calls.must.equal(2);
                done();
            });

        setTimeout(markReady, 75);
    });

    it('uses the full fluent interface', function(done) {
        waitUntil()
            .interval(50)
            .times(10)
            .condition(check)
            .done(function(ok) {
                ok.must.equal(true);
                calls.must.equal(3);
                done();
            });

        setTimeout(markReady, 125);
    });

    it('allows async check functions', function(done) {
        waitUntil()
            .interval(40)
            .times(10)
            .condition(function(cb) {
                setTimeout(function() {
                    cb(check());
                }, 10);
                return false;
            })
            .done(function(ok) {
                ok.must.equal(true);
                calls.must.equal(3);
                done();
            });

        setTimeout(markReady, 125);
    });

    it('allows infinite times', function(done) {
        waitUntil()
            .interval(10)
            .times(Infinity)
            .condition(check)
            .done(function(ok) {
                ok.must.equal(true);
                done();
            });

        setTimeout(markReady, 500);
    });

    it('expires', function(done) {
        var expired = false;

        waitUntil()
            .interval(10)
            .times(5)
            .condition(check)
            .done(function(ok) {
                ok.must.equal(false);
                calls.must.equal(5);
                expired = true;
            });

        setTimeout(function() {
            markReady();
            expired.must.equal(true);
            done();
        }, 150);
    });
});
