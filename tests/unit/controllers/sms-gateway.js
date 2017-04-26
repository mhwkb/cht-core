var controller = require('../../../controllers/sms-gateway'),
    messageUtils = require('../../../controllers/message-utils'),
    recordUtils = require('../../../controllers/record-utils'),
    sinon = require('sinon').sandbox.create();

exports.tearDown = function (callback) {
  sinon.restore();
  callback();
};

exports['get() should report sms-gateway compatibility'] = function(test) {
  test.expect(2);
  controller.get(function(err, results) {
    test.equals(err, null);
    test.equals(results['medic-gateway'], true);
    test.done();
  });
};

exports['post() should save WT messages to DB'] = function(test) {
  test.expect(6);
  // given
  var createRecord = sinon.stub(recordUtils, 'createByForm').callsArgWith(1, null, { success:true, id:'some-id' });
  var getMessages = sinon.stub(messageUtils, 'getMessages').callsArgWith(1, null, []);

  var req = { body: {
    messages: [
      { id:'1', from:'+1', content:'one'   },
      { id:'2', from:'+2', content:'two'   },
      { id:'3', from:'+3', content:'three' },
    ]
  } };

  // when
  controller.post(req, function(err) {
    // then
    test.equals(err, null);
    test.equals(getMessages.callCount, 1);
    test.equals(createRecord.callCount, 3);
    test.equals(createRecord.withArgs({ gateway_ref:'1', from:'+1', message:'one'   }).callCount, 1);
    test.equals(createRecord.withArgs({ gateway_ref:'2', from:'+2', message:'two'   }).callCount, 1);
    test.equals(createRecord.withArgs({ gateway_ref:'3', from:'+3', message:'three' }).callCount, 1);
    test.done();
  });
};

exports['post() should update statuses supplied in request'] = function(test) {
  // given
  var updateMessage = sinon.stub(messageUtils, 'updateMessage');
  updateMessage.callsArgWith(2, null, {});

  sinon.stub(messageUtils, 'getMessages').callsArgWith(1, null, []);

  var req = { body: {
    updates: [
      { id:'1', status:'UNSENT' },
      { id:'2', status:'PENDING' },
      { id:'3', status:'SENT' },
      { id:'4', status:'DELIVERED' },
      { id:'5', status:'FAILED', reason:'bad' },
    ],
  } };

  // when
  controller.post(req, function(err) {
    // then
    test.equals(err, null);
    test.equals(updateMessage.callCount, 5);
    test.equals(updateMessage.withArgs('1', { state:'received-by-gateway' }).callCount, 1);
    test.equals(updateMessage.withArgs('2', { state:'forwarded-by-gateway' }).callCount, 1);
    test.equals(updateMessage.withArgs('3', { state:'sent' }).callCount, 1);
    test.equals(updateMessage.withArgs('4', { state:'delivered' }).callCount, 1);
    test.equals(updateMessage.withArgs('5', { state:'failed', details:{ reason:'bad' } }).callCount, 1);
    test.done();
  });
};

exports['post() should persist unknown statuses'] = function(test) {
  // given
  var updateMessage = sinon.stub(messageUtils, 'updateMessage');
  updateMessage.callsArgWith(2, null, {});

  sinon.stub(messageUtils, 'getMessages').callsArgWith(1, null, []);

  var req = { body: {
    updates: [
      { id:'1', status:'INVENTED-1' },
      { id:'2', status:'INVENTED-2' },
    ],
  } };

  // when
  controller.post(req, function(err) {
    // then
    test.equals(err, null);
    test.equals(updateMessage.callCount, 2);
    test.equals(updateMessage.withArgs('1', { state:'unrecognised', details:{ gateway_status:'INVENTED-1' } }).callCount, 1);
    test.equals(updateMessage.withArgs('2', { state:'unrecognised', details:{ gateway_status:'INVENTED-2' } }).callCount, 1);
    test.done();
  });
};

exports['post() should provide WO messages in response'] = function(test) {
  // given
  sinon.stub(messageUtils, 'getMessages').callsArgWith(1, null, [
    { id:'1', to:'+1', message:'one' },
    { id:'2', to:'+2', message:'two' },
    { id:'3', to:'+3', message:'three' },
  ]);
  var updateMessage = sinon.stub(messageUtils, 'updateMessage');
  updateMessage.callsArgWith(2);

  var req = { body: {} };

  // when
  controller.post(req, function(err, res) {
    // then
    test.equals(err, null);
    test.deepEqual(res, {
      messages: [
        { id:'1', to:'+1', content:'one' },
        { id:'2', to:'+2', content:'two' },
        { id:'3', to:'+3', content:'three' },
      ],
    });
    test.equals(updateMessage.callCount, 3);
    test.equals(updateMessage.withArgs('1', { state:'forwarded-to-gateway' }).callCount, 1);
    test.equals(updateMessage.withArgs('2', { state:'forwarded-to-gateway' }).callCount, 1);
    test.equals(updateMessage.withArgs('3', { state:'forwarded-to-gateway' }).callCount, 1);
    test.done();
  });
};

exports['post() should continue processing other stuff if saving a wt message fails' ] = function(test) {
  // given
  var createRecord = sinon.stub(recordUtils, 'createByForm');
  createRecord.callsArgWith(1, new Error('testing recordUtils.create failure'));

  var updateMessage = sinon.stub(messageUtils, 'updateMessage');
  updateMessage.callsArgWith(2, null, {});

  sinon.stub(messageUtils, 'getMessages').callsArgWith(1, null, [
    { id:'wo', to:'+WO', message:'wo message' },
  ]);

  var req = { body: {
    messages: [
      { id:'wt', from:'+WT', content:'wt message' },
    ],
    updates: [
      { id:'wt_status_changed', status:'SENT' },
    ],
  } };

  // when
  controller.post(req, function(err, res) {
    // then
    test.equals(err, null);
    test.equals(createRecord.callCount, 1);
    test.equals(createRecord.withArgs({ gateway_ref:'wt', from:'+WT', message:'wt message' }).callCount, 1);

    test.equals(updateMessage.callCount, 2);
    test.equals(updateMessage.withArgs('wo', { state:'forwarded-to-gateway' }).callCount, 1);
    test.equals(updateMessage.withArgs('wt_status_changed', { state:'sent' }).callCount, 1);

    test.deepEqual(res, {
      messages: [
        { id:'wo', to:'+WO', content:'wo message' },
      ],
    });
    test.done();
  });
};

exports['post() should continue processing other stuff if updating a status fails' ] = function(test) {
  // given
  var createRecord = sinon.stub(recordUtils, 'createByForm');
  createRecord.callsArgWith(1, null, { success:true, id:'some-id' });

  var updateMessage = sinon.stub(messageUtils, 'updateMessage');
  updateMessage.callsArgWith(2, new Error('testing updateMessage failure'));

  sinon.stub(messageUtils, 'getMessages').callsArgWith(1, null, [
    { id:'wo', to:'+WO', message:'wo message' },
  ]);

  var req = { body: {
    messages: [
      { id:'wt', from:'+WT', content:'wt message' },
    ],
    updates: [
      { id:'wt_status_changed', status:'SENT' },
    ],
  } };

  // when
  controller.post(req, function(err, res) {
    // then
    test.equals(err, null);
    test.equals(createRecord.callCount, 1);
    test.equals(createRecord.withArgs({ gateway_ref:'wt', from:'+WT', message:'wt message' }).callCount, 1);

    test.equals(updateMessage.callCount, 2);
    test.equals(updateMessage.withArgs('wo', { state:'forwarded-to-gateway' }).callCount, 1);
    test.equals(updateMessage.withArgs('wt_status_changed', { state:'sent' }).callCount, 1);

    test.deepEqual(res, {
      messages: [
        { id:'wo', to:'+WO', content:'wo message' },
      ],
    });
    test.done();
  });
};

exports['post() should continue processing other stuff if getting WO messages fails' ] = function(test) {
  // given
  var createRecord = sinon.stub(recordUtils, 'createByForm');
  createRecord.callsArgWith(1, null, { success:true, id:'some-id' });

  var updateMessage = sinon.stub(messageUtils, 'updateMessage');
  updateMessage.callsArgWith(2, null, {});

  var getMessages = sinon.stub(messageUtils, 'getMessages');
  getMessages.callsArgWith(1, new Error('testing getMessages failure'));

  var req = { body: {
    messages: [
      { id:'wt', from:'+WT', content:'wt message' },
    ],
    updates: [
      { id:'status', status:'SENT' },
    ],
  } };

  // when
  controller.post(req, function(err, res) {
    // then
    test.equals(err, null);
    test.equals(createRecord.callCount, 1);
    test.equals(createRecord.withArgs({ gateway_ref:'wt', from:'+WT', message:'wt message' }).callCount, 1);
    test.equals(updateMessage.callCount, 1);
    test.equals(updateMessage.withArgs('status', { state:'sent' }).callCount, 1);
    test.deepEqual(res, { messages:[] });
    test.done();
  });
};
