import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { LayoutService } from '../../../@core/data/layout.service';

import { NbAuthSimpleToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;
  t: any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              private layoutService: LayoutService,
              private authService: NbAuthService) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthSimpleToken) => {
        if (token.isValid()) {
          // this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable 
          this.t = token.getValue();
          this.user = this.t.user;
        }
        //console.log(this.user);

      });
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => {
        // this.user = users.nick;
        this.user.picture = "assets/images/camila.jpg";
        //console.log(this.user);
      }
      );
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
