import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import {PipesModule} from '../pipes/pipes.module';

import {AboutComponent} from './about/about.component';
import {ErrorComponent} from './error/error.component';
import {AnalyticsComponent} from './analytics/analytics.component';
import {ReportsComponent} from './reports/reports.component';
import {ReportsContentComponent} from './reports/reports-content.component';
import {ComponentsModule} from '../components/components.module';

@NgModule({
  declarations: [
    AboutComponent,
    ErrorComponent,
    AnalyticsComponent,
    ReportsComponent,
    ReportsContentComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    RouterModule,
    ComponentsModule,
  ],
  exports: [
    AboutComponent,
    ErrorComponent,
    AnalyticsComponent,
    ReportsComponent,
    ReportsContentComponent,
  ]
})
export class ModulesModule { }
