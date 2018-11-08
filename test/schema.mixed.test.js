'use strict';

/**
 * Module dependencies.
 */

const assert = require('assert');
const start = require('./common');

const mongoose = new start.mongoose.Mongoose;
const Schema = mongoose.Schema;

describe('schematype mixed', function() {
  describe('empty object defaults (gh-1380)', function() {
    it('are interpreted as fns that return new empty objects', function(done) {
      const s = new Schema({mix: {type: Schema.Types.Mixed, default: {}}});
      const M = mongoose.model('M1', s);
      const m1 = new M;
      const m2 = new M;
      m1.mix.val = 3;
      assert.equal(m1.mix.val, 3);
      assert.equal(m2.mix.val, undefined);
      done();
    });
    it('can be forced to share the object between documents', function(done) {
      // silly but necessary for backwards compatibility
      const s = new Schema({mix: {type: Schema.Types.Mixed, default: {}, shared: true}});
      const M = mongoose.model('M2', s);
      const m1 = new M;
      const m2 = new M;
      m1.mix.val = 3;
      assert.equal(m1.mix.val, 3);
      assert.equal(m2.mix.val, 3);
      done();
    });
  });

  describe('mixed types with dot', function() {
    it('should enable key with dot(.) on mixed types', function(done) {
      const s = new Schema({ raw: { type: Schema.Types.Mixed } });
      const M = mongoose.model('M1', s);

      const raw = {
        '@odata.etag': 'blah',
        id: 'id',
      };

      const m1 = new M({
        raw
      }).save()
        .then(data => {
          assert.equal(data.raw).toEqual(raw);

          done();
        });
    });
  });
});
