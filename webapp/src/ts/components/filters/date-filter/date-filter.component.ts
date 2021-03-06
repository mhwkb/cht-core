import { Component, EventEmitter, OnDestroy, Output, Input, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'bootstrap-daterangepicker';
import * as moment from 'moment';
// the default declaration of moment doesn't include _week property
interface LocaleWithWeekSpec extends moment.Locale {
  _week: moment.WeekSpec;
}

import { GlobalActions } from '@mm-actions/global';
import { AbstractFilter } from '@mm-components/filters/abstract-filter';
import { ResponsiveService } from '@mm-services/responsive.service';

@Component({
  selector: 'mm-date-filter',
  templateUrl: './date-filter.component.html'
})
export class DateFilterComponent implements OnDestroy, AbstractFilter, AfterViewInit {
  private globalActions;

  date = {
    from: undefined,
    to: undefined,
  };

  @Input() disabled;
  @Output() search: EventEmitter<any> = new EventEmitter();

  constructor(
    private store: Store,
    private responsiveService:ResponsiveService,
  ) {
    this.globalActions = new GlobalActions(store);
  }

  applyFilter() {
    this.globalActions.setFilter({ date: this.date });
    this.search.emit();
  }

  ngAfterViewInit() {
    const datepicker = (<any>$('#date-filter')).daterangepicker(
      {
        startDate: moment().subtract(1, 'months'),
        endDate: moment(),
        maxDate: moment(),
        opens: 'center',
        autoApply: true,
        locale: {
          daysOfWeek: moment.weekdaysMin(),
          monthNames: moment.monthsShort(),
          firstDay: (<LocaleWithWeekSpec>moment.localeData())._week.dow
        }
      },
      (from, to) => {
        this.date = { from, to };
        this.applyFilter();
      }
    );

    // todo TOUR needs to show and hide this datepicker!
    datepicker.on('show.daterangepicker', (e, picker) => {
      setTimeout(() => {
        if ($('#dateRangeDropdown').is('.disabled')) {
          picker.hide();
        }
      });
    });

    datepicker.on('mm.dateSelected.daterangepicker', (e, picker) => {
      if (this.responsiveService.isMobile()) {
        // mobile version - only show one calendar at a time
        if (picker.container.is('.show-from')) {
          picker.container.removeClass('show-from').addClass('show-to');
        } else {
          picker.container.removeClass('show-to').addClass('show-from');
        }
      }
    });

    $('.daterangepicker').addClass('filter-daterangepicker mm-dropdown-menu show-from');
  }

  ngOnDestroy() {
    const datePicker = (<any>$('#date-filter')).data('daterangepicker');

    if (datePicker) {
      // avoid dom-nodes leaks
      datePicker.remove();
    }
  }

  clear() {
    this.date = {
      from: undefined,
      to: undefined,
    };
  }
}
