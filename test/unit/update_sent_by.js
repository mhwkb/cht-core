var fakedb = require('../fake-db'),
    gently = global.GENTLY = new (require('gently')),
    transition = require('../../transitions/update_sent_by'),
    phone = '+34567890123';

exports.setUp = function(callback) {
    process.env.TEST_ENV = true;
    callback();
}

exports['updates sent_by to contact name if both available'] = function(test) {
    var doc = {
        from: '+34567890123'
    };

    transition.onMatch({
        doc: doc
    }, fakedb, function(err, complete) {
        test.ok(complete);
        test.equal(doc.sent_by, 'CCN');
        test.done();
    });
}

exports['updates sent_by to clinic name if contact name not available'] = function(test) {
    var doc = {
        from: '+34567890123'
    };

    gently.expect(fakedb, 'view', 1, function(design, view, params, callback) {
        callback(null, {
            rows: [
                {
                    doc: {
                        "name": "Clinic",
                    }
                }
            ]
        });
    });

    transition.onMatch({
        doc: doc
    }, fakedb, function(err, complete) {
        test.ok(complete);
        test.equal(doc.sent_by, 'Clinic');
        test.done();
    });
}

exports['sent_by untouched if nothing available'] = function(test) {
    var doc = {
        from: 'unknown number'
    };

    transition.onMatch({
        doc: doc
    }, fakedb, function(err, complete) {
        test.equals(complete, false);
        test.strictEqual(doc.sent_by, undefined);
        test.done();
    });
}

exports['is repeatable'] = function(test) {
    test.equals(transition.repeatable, true);
    test.done();
}
