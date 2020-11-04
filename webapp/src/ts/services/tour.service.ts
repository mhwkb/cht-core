import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "./auth.service";
import {FeedbackService} from "./feedback.service";
import {AnalyticsModulesService} from "./analytics-modules.service";
import {SessionService} from "./session.service";

const _ = require('lodash/core');
import { isMobile } from '@mm-providers/responsive.provider';
import {Router} from "@angular/router";

//(<any>$.fn).tooltip.Constructor.DEFAULTS.whiteList.button = ['data-role'];

@Injectable({
  providedIn: 'root'
})
export class TourService {

  current: {
    tour: any,
    name: any
  };

  constructor(
    private analyticsModulesService: AnalyticsModulesService,
    private authService: AuthService,
    private feedbackService: FeedbackService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private router: Router,
  ) { }

  private mmScroll(container, elem) {
    container = $(container);
    if (container.length) {
      elem = container.find(elem);
      if (elem.length) {
        container.scrollTop(container.scrollTop() + elem.offset().top - 300);
      }
    }
  };

  private mmShowMessageList() {
    this.mmShow('#message-list', false);
  }

  private mmShowMessageContent() {
    this.mmShow('#message-list', true);
  }

  private mmShowTaskList() {
    this.mmShow('#tasks-list', false);
  }

  private mmShowTaskContent() {
    this.mmShow('#tasks-list', true);
  }

  private mmShowReportList() {
    this.mmShow('#reports-list', false);
  }

  private mmShowReportContent() {
    this.mmShow('#reports-list', true);
  }

  private mmShowContactList() {
    this.mmShow('#contacts-list', false);
  }

  private mmShowContactContent() {
    this.mmShow('#contacts-list', true);
  }

  private mmShow(list, showContent) {
    const showingContent = $('body').is('.show-content');
    if (showContent !== showingContent) {
      if (showContent) {
        $(list).find('li').filter(':first').find('a').trigger('click');
      } else if (isMobile()) {
        $('.navigation .filter-bar-back a').trigger('click');
      }
    }
  }

  private mmOpenDropdown(elem) {
    if (!isMobile()) {
      setTimeout(function() {
        (<any>document.querySelector(elem + ' multi-dropdown-filter a.mm-button')).click();
      }, 1);
    }
  }

  private tours = [
    {
      name: 'messages',
      route: '/messages',
      orphan: true,
      debug: true,
      steps: [
        {
          element: '#messages-tab',
          placement: 'bottom',
          title: 'tour.messages.unstructured.title',
          content: 'tour.messages.unstructured.description',
          onShow: () => this.mmShowMessageList()
        },
        {
          element: '#message-list',
          placement: 'right',
          mobilePlacement: 'orphan',
          title: 'tour.messages.list.title',
          content: 'tour.messages.list.description',
          onShow: () => this.mmShowMessageList()
        },
        {
          element: '#message-content',
          placement: 'left',
          mobilePlacement: 'orphan',
          title: 'tour.messages.exchange.title',
          content: 'tour.messages.exchange.description',
          onShow: () => this.mmShowMessageContent()
        },
        {
          element: '#message-header',
          placement: 'bottom',
          title: 'tour.messages.contact.title',
          content: 'tour.messages.contact.description',
          onShow: () => this.mmShowMessageContent()
        },
        {
          element: '#message-content .outgoing:last .message-body',
          placement: 'top',
          title: 'tour.messages.outgoing.title',
          content: 'tour.messages.outgoing.description',
          onShow: () => {
            this.mmShowMessageContent();
            this.mmScroll('#message-content', '.outgoing:last');
          }
        },
        {
          element: '#message-content .incoming:last .message-body',
          placement: 'top',
          title: 'tour.messages.incoming.title',
          content: 'tour.messages.incoming.description',
          onShow: () => {
            this.mmShowMessageContent();
            this.mmScroll('#message-content', '.incoming:last');
          }
        },
        {
          element: '#message-footer',
          placement: 'top',
          title: 'tour.messages.send.title',
          content: 'tour.messages.send.description',
          onShow: () => this.mmShowMessageContent()
        }
      ]
    },
    {
      name: 'tasks',
      route: '/tasks',
      orphan: true,
      debug: true,
      steps: [
        {
          element: '#tasks-tab',
          placement: 'bottom',
          title: 'tour.tasks.overview.title',
          content: 'tour.tasks.overview.description',
          onShow: () => this.mmShowTaskList()
        },
        {
          element: '#tasks-list',
          placement: 'right',
          mobilePlacement: 'orphan',
          title: 'tour.tasks.list.title',
          content: 'tour.tasks.list.description',
          onShow: () => this.mmShowTaskList()
        },
        {
          element: '.right-pane',
          placement: 'left',
          mobilePlacement: 'orphan',
          title: 'tour.tasks.details.title',
          content: 'tour.tasks.details.description',
          onShow: () => this.mmShowTaskContent()
        },
        {
          element: '.right-pane .next-page',
          placement: 'top',
          mobilePlacement: 'top',
          title: 'tour.tasks.next.title',
          content: 'tour.tasks.next.description',
          onShow: () => this.mmShowTaskContent()
        },
        {
          element: '.right-pane .form-footer',
          placement: 'top',
          mobilePlacement: 'top',
          title: 'tour.tasks.submit.title',
          content: 'tour.tasks.submit.description',
          onShow: () => this.mmShowTaskContent()
        },
        {
          element: '#tasks-list',
          placement: 'right',
          mobilePlacement: 'orphan',
          title: 'tour.tasks.cleared.title',
          content: 'tour.tasks.cleared.description',
          onShow: () => this.mmShowTaskContent()
        }
      ]
    },
    {
      name: 'reports',
      route: '/reports',
      orphan: true,
      debug: true,
      steps: [
        {
          element: '#reports-tab',
          placement: 'bottom',
          title: 'tour.reports.forms.title',
          content: 'tour.reports.forms.description',
          onShow: () => this.mmShowReportList()
        },
        {
          element: 'mm-form-type-filter',
          placement: 'right',
          mobilePlacement: 'bottom',
          title: 'tour.reports.types-filter.title',
          content: 'tour.reports.types-filter.description',
          onShow: () => this.mmShowReportList(),
          onShown: () => this.mmOpenDropdown('mm-form-type-filter')
        },
        {
          element: 'mm-facility-filter',
          placement: 'right',
          mobilePlacement: 'bottom',
          title: 'tour.reports.facilities-filter.title',
          content: 'tour.reports.facilities-filter.description',
          onShow: () => this.mmShowReportList(),
          onShown: () => this.mmOpenDropdown('mm-facility-filter')
        },
        {
          element: 'mm-date-filter',
          placement: 'left',
          mobilePlacement: 'bottom',
          title: 'tour.reports.date-filter.title',
          content: 'tour.reports.date-filter.description',
          onShow: () => this.mmShowReportList(),
          onShown: () => {
            if (!isMobile()) {
              $('#date-filter').trigger('click');
            }
          },
          onHide: () => {
            $('#date-filter').trigger('hide.daterangepicker');
          }
        },
        {
          element: 'mm-status-filter',
          placement: 'left',
          mobilePlacement: 'bottom',
          title: 'tour.reports.status-filter.title',
          content: 'tour.reports.status-filter.description',
          onShow: () => this.mmShowReportList(),
          onShown: () => this.mmOpenDropdown('mm-status-filter')
        },
        {
          element: '#freetext',
          mobileElement: '#mobile-search',
          placement: 'left',
          mobilePlacement: 'bottom',
          title: 'tour.reports.freetext-filter.title',
          content: 'tour.reports.freetext-filter.description',
          onShow: () => this.mmShowReportList()
        },
        {
          element: '#reports-list',
          placement: 'right',
          mobilePlacement: 'orphan',
          title: 'tour.reports.list.title',
          content: 'tour.reports.list.description',
          onShow: () => this.mmShowReportList()
        },
        {
          element: '#reports-list li:first-child .status',
          placement: 'right',
          mobilePlacement: 'bottom',
          title: 'tour.reports.status.title',
          content: 'tour.reports.status.description',
          onShow: () => this.mmShowReportList()
        },
        {
          element: '#reports-content',
          placement: 'left',
          mobilePlacement: 'orphan',
          title: 'tour.reports.details.title',
          content: 'tour.reports.details.description',
          onShow: () => this.mmShowReportContent()
        },
        {
          element: '#reports-content .item-summary',
          placement: 'left',
          mobilePlacement: 'bottom',
          title: 'tour.reports.information.title',
          content: 'tour.reports.information.description',
          onShow: () => this.mmShowReportContent()
        },
        {
          element: '#reports-content .report-body',
          placement: 'left',
          mobilePlacement: 'top',
          title: 'tour.reports.content.title',
          content: 'tour.reports.content.description',
          onShow: () => this.mmShowReportContent()
        },
        {
          element: '.detail-actions:not(.ng-hide)',
          placement: 'top',
          title: 'tour.reports.actions.title',
          content: 'tour.reports.actions.description',
          onShow: () => this.mmShowReportContent()
        }
      ]
    },
    {
      name: 'contacts',
      route: '/contacts',
      orphan: true,
      debug: true,
      steps: [
        {
          element: '#contacts-tab',
          placement: 'bottom',
          title: 'tour.contacts.overview.title',
          content: 'tour.contacts.overview.description',
          onShow: () => this.mmShowContactList()
        },
        {
          element: '#freetext',
          mobileElement: '#mobile-search',
          placement: 'bottom',
          mobilePlacement: 'bottom',
          title: 'tour.contacts.search.title',
          content: 'tour.contacts.search.description',
          onShow: () => this.mmShowContactList()
        },
        {
          element: '.general-actions:not(.ng-hide)',
          placement: 'top',
          mobilePlacement: 'top',
          title: 'tour.contacts.add.title',
          content: 'tour.contacts.add.description',
          onShow: () => this.mmShowContactList()
        },
        {
          element: '#contacts-list',
          placement: 'right',
          mobilePlacement: 'orphan',
          title: 'tour.contacts.list.title',
          content: 'tour.contacts.list.description',
          onShow: () => this.mmShowContactList()
        },
        {
          element: '.item-content .meta',
          placement: 'left',
          mobilePlacement: 'orphan',
          title: 'tour.contacts.details.title',
          content: 'tour.contacts.details.description',
          onShow: () => this.mmShowContactContent()
        },
        {
          element: '.detail-actions:not(.ng-hide)',
          placement: 'top',
          mobilePlacement: 'top',
          title: 'tour.contacts.actions.title',
          content: 'tour.contacts.actions.description',
          onShow: () => this.mmShowContactContent()
        }
      ]
    },
    {
      name: 'analytics',
      route: '/analytics',
      orphan: true,
      debug: true,
      steps: [
        {
          element: '#analytics-tab',
          placement: 'bottom',
          title: 'tour.analytics.overview.title',
          content: 'tour.analytics.overview.description'
        }
      ]
    }
  ]

  private createTemplate() {
    return  `<div class="popover tour">
              <div class="arrow"></div>
              <h3 class="popover-title"></h3>
              <div class="popover-content"></div>
              <div class="popover-navigation">
                <div class="btn-group">
                  <button class="btn btn-sm btn-default" data-role="prev">
                    &laquo;  ${this.translateService.instant('Previous')}
                  </button>
                  <button class="btn btn-sm btn-default" data-role="next">
                    ${this.translateService.instant('Next')} &raquo;
                  </button>
                </div>
                <button class="btn btn-sm btn-link" data-role="end">
                  ${this.translateService.instant('End tour')}
                </button>
              </div>
            </div>`;
  }

  private getMessagesTour() {
    return this.authService.has('can_view_messages_tab')
      .then(canView => {
        return canView && {
          order: 0,
          id: 'messages',
          icon: 'fa-envelope',
          name: 'Messages'
        };
      });
  }

  private getTasksTour() {
    if (this.sessionService.isOnlineOnly()) {
      return;
    }
    return this.authService.has('can_view_tasks_tab')
      .then(canView => {
        return canView && {
          order: 1,
          id: 'tasks',
          icon: 'fa-flag',
          name: 'Tasks'
        };
      });
  }

  getReportsTour() {
    return this.authService.has('can_view_reports_tab')
      .then(canView => {
        return canView && {
          order: 2,
          id: 'reports',
          icon: 'fa-list-alt',
          name: 'Reports'
        };
      });
  }

  private getContactsTour() {
    return this.authService.has('can_view_contacts_tab')
      .then(canView => {
        return canView && {
          order: 3,
          id: 'contacts',
          icon: 'fa-user',
          name: 'Contacts'
        };
      });
  }

  private getAnalyticsTour() {
    return Promise.all([
      this.authService.has('can_view_analytics'),
      this.analyticsModulesService.get()
    ])
      .then(([canView]) => {
        return canView && {
          order: 4,

          id: 'analytics',
          icon: 'fa-bar-chart-o',
          name: 'Analytics'
        };
      });
  };

  getTours() {
    return Promise.all([
      this.getMessagesTour(),
      this.getTasksTour(),
      this.getReportsTour(),
      this.getContactsTour(),
      this.getAnalyticsTour()
    ])
    .then(results => _.compact(results));
  }

  private getTour(name) {
    return _.find(this.tours, { name: name }) || this.tours[0];
  }

  private getSettings(name) {

    const settings = this.getTour(name);
    settings.autoscroll = false;

    if (!settings.transmogrified) {

      settings.template = this.createTemplate();

      const mobile = isMobile();
      _.forEach(settings.steps, step => {
        step.title = this.translateService.instant(step.title);
        step.content = this.translateService.instant(step.content);
        if (mobile) {
          // there's no room to show steps to the left or right on a mobile device
          if (step.mobileElement) {
            step.element = step.mobileElement;
          }
          if (step.mobilePlacement) {
            if (step.mobilePlacement === 'orphan') {
              delete step.element;
            } else {
              step.placement = step.mobilePlacement;
            }
          }
        }
      });

      settings.transmogrified = true;

    }

    return settings;
  }

  private createTour(name) {
    const settings = this.getSettings(name);
    const tour = new window.Tour(settings);
    tour.init();
    tour.restart();
    this.current = {
      tour: tour,
      name: name
    };
  };

  private endCurrent() {
    if (this.current && this.current.tour) {
      this.current.tour.end();
      // remove any popovers that have become disassociated
      $('.popover.tour-' + this.current.name).remove();
      this.current = null;
    }
  }

  start(name) {
    this.endCurrent();
    if (!name) {
      return;
    }
    const tour = this.getTour(name);
    const route = tour && tour.route;
    setTimeout(() => {
      if (this.router.isActive(route, false)) {
        this.createTour(name);
      } else {
        // navigate to the correct page
        if (route) {
          this.router.navigate([route], { queryParams: { tour: name } });
          //$state.go(route, { tour: name });
        } else {
          const message = `Attempt to navigate to an undefined state [Tour.start("${name}")]`;
          this.feedbackService.submit(message).catch(err => {
            console.error('Error saving feedback', err);
          });
        }
      }
    });
  }
}

/*angular.module('inboxServices').service('Tour',
  function(
    $log,
    $q,
    $state,
    $timeout,
    $translate,
    AnalyticsModules,
    Auth,
    Feedback,
    Session
  ) {

    'use strict';
    'ngInject';

    const mmScroll = function(container, elem) {
      container = $(container);
      if (container.length) {
        elem = container.find(elem);
        if (elem.length) {
          container.scrollTop(container.scrollTop() + elem.offset().top - 300);
        }
      }
    };

    const mmShowMessageList = function() {
      mmShow('#message-list', false);
    };

    const mmShowMessageContent = function() {
      mmShow('#message-list', true);
    };

    const mmShowTaskList = function() {
      mmShow('#tasks-list', false);
    };

    const mmShowTaskContent = function() {
      mmShow('#tasks-list', true);
    };

    const mmShowReportList = function() {
      mmShow('#reports-list', false);
    };

    const mmShowReportContent = function() {
      mmShow('#reports-list', true);
    };

    const mmShowContactList = function() {
      mmShow('#contacts-list', false);
    };

    const mmShowContactContent = function() {
      mmShow('#contacts-list', true);
    };

    const mmShow = function(list, showContent) {
      const showingContent = $('body').is('.show-content');
      if (showContent !== showingContent) {
        if (showContent) {
          $(list).find('li').filter(':first').find('a').trigger('click');
        } else if (responsive.isMobile()) {
          $('.navigation .filter-bar-back a').trigger('click');
        }
      }
    };

    const mmOpenDropdown = function(elem) {
      if (!responsive.isMobile()) {
        $timeout(function() {
          $(elem).addClass('open');
        }, 1);
      }
    };

    const tours = [
      {
        name: 'messages',
        route: 'messages.detail',
        orphan: true,
        debug: true,
        steps: [
          {
            element: '#messages-tab',
            placement: 'bottom',
            title: 'tour.messages.unstructured.title',
            content: 'tour.messages.unstructured.description',
            onShow: mmShowMessageList
          },
          {
            element: '#message-list',
            placement: 'right',
            mobilePlacement: 'orphan',
            title: 'tour.messages.list.title',
            content: 'tour.messages.list.description',
            onShow: mmShowMessageList
          },
          {
            element: '#message-content',
            placement: 'left',
            mobilePlacement: 'orphan',
            title: 'tour.messages.exchange.title',
            content: 'tour.messages.exchange.description',
            onShow: mmShowMessageContent
          },
          {
            element: '#message-header',
            placement: 'bottom',
            title: 'tour.messages.contact.title',
            content: 'tour.messages.contact.description',
            onShow: mmShowMessageContent
          },
          {
            element: '#message-content .outgoing:last .message-body',
            placement: 'top',
            title: 'tour.messages.outgoing.title',
            content: 'tour.messages.outgoing.description',
            onShow: function() {
              mmShowMessageContent();
              mmScroll('#message-content', '.outgoing:last');
            }
          },
          {
            element: '#message-content .incoming:last .message-body',
            placement: 'top',
            title: 'tour.messages.incoming.title',
            content: 'tour.messages.incoming.description',
            onShow: function() {
              mmShowMessageContent();
              mmScroll('#message-content', '.incoming:last');
            }
          },
          {
            element: '#message-footer',
            placement: 'top',
            title: 'tour.messages.send.title',
            content: 'tour.messages.send.description',
            onShow: mmShowMessageContent
          }
        ]
      },
      {
        name: 'tasks',
        route: 'tasks.detail',
        orphan: true,
        debug: true,
        steps: [
          {
            element: '#tasks-tab',
            placement: 'bottom',
            title: 'tour.tasks.overview.title',
            content: 'tour.tasks.overview.description',
            onShow: mmShowTaskList
          },
          {
            element: '#tasks-list',
            placement: 'right',
            mobilePlacement: 'orphan',
            title: 'tour.tasks.list.title',
            content: 'tour.tasks.list.description',
            onShow: mmShowTaskList
          },
          {
            element: '.right-pane',
            placement: 'left',
            mobilePlacement: 'orphan',
            title: 'tour.tasks.details.title',
            content: 'tour.tasks.details.description',
            onShow: mmShowTaskContent
          },
          {
            element: '.right-pane .next-page',
            placement: 'top',
            mobilePlacement: 'top',
            title: 'tour.tasks.next.title',
            content: 'tour.tasks.next.description',
            onShow: mmShowTaskContent
          },
          {
            element: '.right-pane .form-footer',
            placement: 'top',
            mobilePlacement: 'top',
            title: 'tour.tasks.submit.title',
            content: 'tour.tasks.submit.description',
            onShow: mmShowTaskContent
          },
          {
            element: '#tasks-list',
            placement: 'right',
            mobilePlacement: 'orphan',
            title: 'tour.tasks.cleared.title',
            content: 'tour.tasks.cleared.description',
            onShow: mmShowTaskContent
          }
        ]
      },
      {
        name: 'reports',
        route: 'reports.detail',
        orphan: true,
        debug: true,
        steps: [
          {
            element: '#reports-tab',
            placement: 'bottom',
            title: 'tour.reports.forms.title',
            content: 'tour.reports.forms.description',
            onShow: mmShowReportList
          },
          {
            element: '#formTypeDropdown',
            placement: 'right',
            mobilePlacement: 'bottom',
            title: 'tour.reports.types-filter.title',
            content: 'tour.reports.types-filter.description',
            onShow: mmShowReportList,
            onShown: function() {
              mmOpenDropdown('#formTypeDropdown');
            },
            onHide: function() {
              $('#formTypeDropdown').removeClass('open');
            }
          },
          {
            element: '#facilityDropdown',
            placement: 'right',
            mobilePlacement: 'bottom',
            title: 'tour.reports.facilities-filter.title',
            content: 'tour.reports.facilities-filter.description',
            onShow: mmShowReportList,
            onShown: function() {
              mmOpenDropdown('#facilityDropdown');
            },
            onHide: function() {
              $('#facilityDropdown').removeClass('open');
            }
          },
          {
            element: '#dateRangeDropdown',
            placement: 'left',
            mobilePlacement: 'bottom',
            title: 'tour.reports.date-filter.title',
            content: 'tour.reports.date-filter.description',
            onShow: mmShowReportList,
            onShown: function() {
              if (!responsive.isMobile()) {
                $('#date-filter').trigger('click');
              }
            },
            onHide: function() {
              $('#date-filter').trigger('hide.daterangepicker');
            }
          },
          {
            element: '#statusDropdown',
            placement: 'left',
            mobilePlacement: 'bottom',
            title: 'tour.reports.status-filter.title',
            content: 'tour.reports.status-filter.description',
            onShow: mmShowReportList,
            onShown: function() {
              mmOpenDropdown('#statusDropdown');
            },
            onHide: function() {
              $('#statusDropdown').removeClass('open');
            }
          },
          {
            element: '#freetext',
            mobileElement: '#mobile-search',
            placement: 'left',
            mobilePlacement: 'bottom',
            title: 'tour.reports.freetext-filter.title',
            content: 'tour.reports.freetext-filter.description',
            onShow: mmShowReportList
          },
          {
            element: '#reports-list',
            placement: 'right',
            mobilePlacement: 'orphan',
            title: 'tour.reports.list.title',
            content: 'tour.reports.list.description',
            onShow: mmShowReportList
          },
          {
            element: '#reports-list li:first-child .status',
            placement: 'right',
            mobilePlacement: 'bottom',
            title: 'tour.reports.status.title',
            content: 'tour.reports.status.description',
            onShow: mmShowReportList
          },
          {
            element: '#reports-content',
            placement: 'left',
            mobilePlacement: 'orphan',
            title: 'tour.reports.details.title',
            content: 'tour.reports.details.description',
            onShow: mmShowReportContent
          },
          {
            element: '#reports-content .item-summary',
            placement: 'left',
            mobilePlacement: 'bottom',
            title: 'tour.reports.information.title',
            content: 'tour.reports.information.description',
            onShow: mmShowReportContent
          },
          {
            element: '#reports-content .report-body',
            placement: 'left',
            mobilePlacement: 'top',
            title: 'tour.reports.content.title',
            content: 'tour.reports.content.description',
            onShow: mmShowReportContent
          },
          {
            element: '.detail-actions:not(.ng-hide)',
            placement: 'top',
            title: 'tour.reports.actions.title',
            content: 'tour.reports.actions.description',
            onShow: mmShowReportContent
          }
        ]
      },
      {
        name: 'contacts',
        route: 'contacts.detail',
        orphan: true,
        debug: true,
        steps: [
          {
            element: '#contacts-tab',
            placement: 'bottom',
            title: 'tour.contacts.overview.title',
            content: 'tour.contacts.overview.description',
            onShow: mmShowContactList
          },
          {
            element: '#freetext',
            mobileElement: '#mobile-search',
            placement: 'bottom',
            mobilePlacement: 'bottom',
            title: 'tour.contacts.search.title',
            content: 'tour.contacts.search.description',
            onShow: mmShowContactList
          },
          {
            element: '.general-actions:not(.ng-hide)',
            placement: 'top',
            mobilePlacement: 'top',
            title: 'tour.contacts.add.title',
            content: 'tour.contacts.add.description',
            onShow: mmShowContactList
          },
          {
            element: '#contacts-list',
            placement: 'right',
            mobilePlacement: 'orphan',
            title: 'tour.contacts.list.title',
            content: 'tour.contacts.list.description',
            onShow: mmShowContactList
          },
          {
            element: '.item-content .meta',
            placement: 'left',
            mobilePlacement: 'orphan',
            title: 'tour.contacts.details.title',
            content: 'tour.contacts.details.description',
            onShow: mmShowContactContent
          },
          {
            element: '.detail-actions:not(.ng-hide)',
            placement: 'top',
            mobilePlacement: 'top',
            title: 'tour.contacts.actions.title',
            content: 'tour.contacts.actions.description',
            onShow: mmShowContactContent
          }
        ]
      },
      {
        name: 'analytics',
        route: 'analytics',
        orphan: true,
        debug: true,
        steps: [
          {
            element: '#analytics-tab',
            placement: 'bottom',
            title: 'tour.analytics.overview.title',
            content: 'tour.analytics.overview.description'
          }
        ]
      }
    ];

    let current;

    const createTemplate = function() {
      return  '<div class="popover tour">' +
                '<div class="arrow"></div>' +
                '<h3 class="popover-title"></h3>' +
                '<div class="popover-content"></div>' +
                '<div class="popover-navigation">' +
                  '<div class="btn-group">' +
                    '<button class="btn btn-sm btn-default" data-role="prev">' +
                      '&laquo; ' + $translate.instant('Previous') +
                    '</button>' +
                    '<button class="btn btn-sm btn-default" data-role="next">' +
                      $translate.instant('Next') + ' &raquo;' +
                    '</button>' +
                  '</div>' +
                  '<button class="btn btn-sm btn-link" data-role="end">' +
                    $translate.instant('End tour') +
                  '</button>' +
                '</div>' +
              '</div>';
    };

    const getTour = function(name) {
      return _.find(tours, { name: name }) || tours[0];
    };

    const getSettings = function(name) {

      const settings = getTour(name);
      settings.autoscroll = false;

      if (!settings.transmogrified) {

        settings.template = createTemplate();

        const mobile = responsive.isMobile();
        _.forEach(settings.steps, function(step) {
          step.title = $translate.instant(step.title);
          step.content = $translate.instant(step.content);
          if (mobile) {
          // there's no room to show steps to the left or right on a mobile device
            if (step.mobileElement) {
              step.element = step.mobileElement;
            }
            if (step.mobilePlacement) {
              if (step.mobilePlacement === 'orphan') {
                delete step.element;
              } else {
                step.placement = step.mobilePlacement;
              }
            }
          }
        });

        settings.transmogrified = true;

      }

      return settings;
    };

    const createTour = function(name) {
      const settings = getSettings(name);
      const tour = new Tour(settings);
      tour.init();
      tour.restart();
      current = {
        tour: tour,
        name: name
      };
    };

    const endCurrent = function() {
      if (current && current.tour) {
        current.tour.end();
        // remove any popovers that have become disassociated
        $('.popover.tour-' + current.name).remove();
        current = null;
      }
    };

    const getMessagesTour = () => {
      return Auth.has('can_view_messages_tab')
        .then(canView => {
          return canView && {
            order: 0,
            id: 'messages',
            icon: 'fa-envelope',
            name: 'Messages'
          };
        });
    };

    const getTasksTour = () => {
      if (Session.isOnlineOnly()) {
        return;
      }
      return Auth.has('can_view_tasks_tab')
        .then(canView => {
          return canView && {
            order: 1,
            id: 'tasks',
            icon: 'fa-flag',
            name: 'Tasks'
          };
        });
    };

    const getReportsTour = () => {
      return Auth.has('can_view_reports_tab')
        .then(canView => {
          return canView && {
            order: 2,
            id: 'reports',
            icon: 'fa-list-alt',
            name: 'Reports'
          };
        });
    };

    const getContactsTour = () => {
      return Auth.has('can_view_contacts_tab')
        .then(canView => {
          return canView && {
            order: 3,
            id: 'contacts',
            icon: 'fa-user',
            name: 'Contacts'
          };
        });
    };

    const getAnalyticsTour = () => {
      return $q.all([
        Auth.has('can_view_analytics'),
        AnalyticsModules()
      ])
        .then(([canView]) => {
          return canView && {
            order: 4,

            id: 'analytics',
            icon: 'fa-bar-chart-o',
            name: 'Analytics'
          };
        });
    };

    const getTours = function() {
      return $q.all([
        getMessagesTour(),
        getTasksTour(),
        getReportsTour(),
        getContactsTour(),
        getAnalyticsTour()
      ])
        .then(function(results) {
          return _.compact(results);
        });
    };

    return {
      getTours,
      endCurrent,
      start: function(name) {
        endCurrent();
        if (!name) {
          return;
        }
        const tour = getTour(name);
        const route = tour && tour.route;
        $timeout(function() {
          if ($state.is(route)) {
            // already on required page - show tour
            $translate.onReady().then(function() {
              createTour(name);
            });
          } else {
            // navigate to the correct page
            if (route) {
              $state.go(route, { tour: name });
            } else {
              const message = `Attempt to navigate to an undefined state [Tour.start("${name}")]`;
              Feedback.submit(message).catch(err => {
                $log.error('Error saving feedback', err);
              });
            }
          }
        });
      }
    };
  }
);
*/
