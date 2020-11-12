import { TestBed } from '@angular/core/testing';
import sinon from 'sinon';
import { expect } from 'chai';

import {SessionService} from '@mm-services/session.service';
import {SettingsService} from '@mm-services/settings.service';
import {StartupModalsService} from '@mm-services/startup-modals.service';
import {UpdateUserService} from '@mm-services/update-user.service';
import {UserSettingsService} from '@mm-services/user-settings.service';
import {ModalService} from '@mm-modals/mm-modal/mm-modal';
import {TourService} from "@mm-services/tour.service";


describe('StartupModalsService', () => {

  let service: StartupModalsService;
  let updateUserService;
  let sessionService;
  let modalService;
  let tourService;

  afterEach(() => {
    sinon.restore();
  });

  describe('showStartupModals', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SessionService,
            useValue: { userCtx: () => ({ name: 'no_error' }), isOnlineOnly: () => true }
          },
          { provide: SettingsService, useValue: { get: () => ({ setup_complete: true }) } },
          { provide: UserSettingsService, useValue: { get: ()=> ({ name: 'person' }) } },
          { provide: UpdateUserService, useValue: { update: sinon.stub().resolves() } },
          { provide: ModalService, useValue: { show: sinon.stub() } },
          { provide: TourService, useValue: { getTours: sinon.stub() } },
        ],
      });
      service = TestBed.inject(StartupModalsService);
      sessionService = TestBed.inject(SessionService);
      updateUserService = TestBed.inject(UpdateUserService);
      modalService = TestBed.inject(ModalService);
      tourService = TestBed.inject(TourService);
    });

    it('Tour modal should not be displayed if no tours are available', async () => {
      tourService = TestBed.inject(TourService);
      tourService.getTours.resolves([]);
      await service.showStartupModals();
      expect(modalService.show.callCount).to.equal(0);
      expect(updateUserService.update.callCount).to.equal(0);
    });

    it('Tour modal should be displayed if tours are available', async () => {
      tourService = TestBed.inject(TourService);
      tourService.getTours.resolves([{ order: 1, id: 'tasks', icon: 'fa-flag', name: 'Tasks' }]);
      await service.showStartupModals();
      expect(modalService.show.callCount).to.equal(1);
      expect(updateUserService.update.callCount).to.equal(1);
      expect(updateUserService.update.args[0]).to.deep.equal(['no_error', { known: true }]);
    });
  });
});
