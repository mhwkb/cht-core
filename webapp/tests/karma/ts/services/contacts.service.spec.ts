import { TestBed } from '@angular/core/testing';
import sinon from 'sinon';
import { expect, assert } from 'chai';

import { ContactsService } from '@mm-services/contacts.service';
import { DbService } from '@mm-services/db.service';
import { CacheService } from '@mm-services/cache.service';
import { ContactTypesService } from '@mm-services/contact-types.service';


describe('Contacts Service', () => {
  let service:ContactsService;
  let dbService;
  let cacheService;
  let contactTypesService;
  let query;

  beforeEach(() => {
    query = sinon.stub();
    dbService = { get: () => ({ query }) };
    cacheService = { register: (opts) => opts.get };
    const placeTypes = [
      { id: 'district_hospital' },
      { id: 'health_center' },
      { id: 'clinic' }
    ];
    contactTypesService = { getPlaceTypes: sinon.stub().resolves(placeTypes) };

    TestBed.configureTestingModule({
      providers: [
        { provide: DbService, useValue: dbService },
        { provide: CacheService, useValue: cacheService },
        { provide: ContactTypesService, useValue: contactTypesService },
      ]
    });

    service = TestBed.inject(ContactsService);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('returns errors from request', () => {
    query.rejects('boom');
    return service
      .get(['district_hospital'])
      .then(() => assert.fail('expected error to be thrown'))
      .catch(err => {
        expect(err.name).to.equal('boom');
      });
  });

  it('returns zero when no facilities', () => {
    query.resolves({ rows: [] });
    return service.get(['district_hospital']).then(actual => {
      expect(actual).to.deep.equal([]);
    });
  });

  it('returns all clinics when no user district', () => {

    const clinicA = {
      _id: '920a7f6a-d01d-5cfe-7c9182fe6551322a',
      _rev: '2-55151d808dacc7f12fdd1513f2eddc75',
      type: 'clinic',
      name: 'Maori Hill',
      parent: {
        _id: 'a301463e-74ba-6e2a-3424d30ef5089a7f',
        _rev: '6-ef6e63875cb6322e48e3f964f460bd7a',
        type: 'health_center',
        name: 'Dunedin',
        parent: {
          _id: 'a301463e-74ba-6e2a-3424d30ef5087d1c',
          _rev: '3-42c1cfd045c5d80dd98ccc85c47f44ae',
          type: 'district_hospital',
          name: 'Otago',
          parent: {},
          contact: {
            name: 'Ralph',
            phone: '555'
          }
        },
        contact: {
          name: 'Sharon',
          phone: '556'
        }
      }
    };

    const clinicB = {
      _id: 'a301463e-74ba-6e2a-3424d30ef508a488',
      _rev: '74-30d4791ba64f13592f86023344fa9449',
      type: 'clinic',
      name: 'Andy Bay',
      contact: {
        name: 'Gareth',
        phone: '557557557'
      },
      parent: {
        _id: 'a301463e-74ba-6e2a-3424d30ef5089a7f',
        _rev: '6-ef6e63875cb6322e48e3f964f460bd7a',
        type: 'health_center',
        name: 'Dunedin',
        parent: {
          _id: 'a301463e-74ba-6e2a-3424d30ef5087d1c',
          _rev: '3-42c1cfd045c5d80dd98ccc85c47f44ae',
          type: 'district_hospital',
          name: 'Otago',
          parent: {},
          contact: {
            name: 'Ralph',
            phone: '555'
          }
        },
        contact: {
          name: 'Sharon',
          phone: '556'
        }
      },
      sent_forms: {
        R: '2014-07-10T02:10:28.776Z',
        STCK: '2014-07-09T23:28:45.949Z',
        XXXXXXX: '2014-07-01T00:46:24.362Z',
        '\u00e0\u00a4\u2014': '2014-07-02T02:06:32.270Z',
        ANCR: '2014-07-10T02:58:53.095Z'
      }
    };

    const healthCenter = {
      _id: '920a7f6a-d01d-5cfe-7c9182fe65516194',
      _rev: '4-d7d7e3ab5276fbd1bc9c9ca6b10f4ee1',
      type: 'health_center',
      name: 'Sumner',
      parent: {
        _id: '920a7f6a-d01d-5cfe-7c9182fe6551510e',
        _rev: '2-5b71b72299224c2500389db753116155',
        type: 'district_hospital',
        name: 'Christchurch',
        sent_forms: {
          R: '2014-06-30T04:08:06.657Z'
        }
      }
    };

    query
      .withArgs('medic-client/contacts_by_type', { include_docs: true, key: ['clinic'] })
      .resolves({ rows: [ { doc: clinicA }, { doc: clinicB } ] });
    query
      .withArgs('medic-client/contacts_by_type', { include_docs: true, key: ['health_center'] })
      .resolves({ rows: [ { doc: healthCenter } ] });

    return service.get(['clinic']).then(actual => {
      expect(actual).to.deep.equal([ clinicA, clinicB ]);
    });
  });
});

