import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbAuthSimpleToken, NbPasswordAuthStrategy, NbPasswordAuthStrategyOptions } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';
import { HttpResponse } from '@angular/common/http';
import { getDeepFromObject } from '../helpers/helpers';
import { URL_BASE_REST } from '../app.config';

// const socialLinks = [
//   {
//     url: 'https://github.com/akveo/nebular',
//     target: '_blank',
//     icon: 'socicon-github',
//   },
//   {
//     url: 'https://www.facebook.com/akveo/',
//     target: '_blank',
//     icon: 'socicon-facebook',
//   },
//   {
//     url: 'https://twitter.com/akveo_inc',
//     target: '_blank',
//     icon: 'socicon-twitter',
//   },
// ];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({

    strategies: [
      // NbDummyAuthStrategy.setup({
      //   name: 'email',
      //   delay: 3000,
      // }),
      NbPasswordAuthStrategy.setup({
        name: 'email',
        baseEndpoint: URL_BASE_REST,
        token: {
          class: NbAuthSimpleToken,
          key: 'success', // this parameter tells where to look for the token
          // getter: (module: string, res: HttpResponse<Object>, options: NbPasswordAuthStrategyOptions) => 
          // //console.log(res),
          // getDeepFromObject(
          //   res.body,
          //   options.token.key,
          // ),
        },
        login: {
          endpoint: 'login',
          method: 'post',
        },
      }),
    ],
    forms: {
      login: {
        // socialLinks: socialLinks,
        redirectDelay: 0,
        showMessages: {
          success: true,
        },
      },
      // register: {
      //   // socialLinks: socialLinks,
      // },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
        // view: 'auth',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
