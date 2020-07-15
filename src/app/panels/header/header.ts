import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, ObservableLike } from 'rxjs';

import { Constants } from 'src/app/constants';

import { ThemeService } from 'src/app/service/theme';
import { PanelService } from 'src/app/service/panels/panel';
import { UserService } from 'src/app/service/panels/user';
import { MenuService } from 'src/app/service/panels/menu';
import { MusicService } from 'src/app/service/panels/music';
import { HeaderService } from 'src/app/service/panels/header';
import { DebugService } from 'src/app/service/debug';
import { LoadingService } from 'src/app/service/loading';

import { AppStorage, selectAuthState } from '../../storage/storage';
import { LogIn, Signup } from 'src/app/storage/actions/auth';


@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {

  selectedTheme: string;

  getAuthState: Observable<any>;
  isAuthenticated: boolean = false;
  
  userPanelState: any;
  userMenuState: any;
  curScreen: string;

  isMenuShowed: boolean;
  isMenuExpanded: boolean;

  isUserShowed: boolean;
  isUserExpanded: boolean;

  isMusicShowed: boolean;
  isMusicExpanded: boolean;

  isDebugActive: boolean;

  isClickLogin: boolean = false;

  constructor(
    private themeService: ThemeService,
    private panelService: PanelService,
    private userService: UserService,
    private menuService: MenuService,
    private musicService: MusicService,
    private headerService: HeaderService,
    private loadingService: LoadingService,
    private debugService: DebugService,
    private store: Store<AppStorage>
  ) {
    this.themeService.getActiveTheme().subscribe(res => { this.selectedTheme = res; })
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.getPanelState();
    setTimeout(() => {
      this.watchAuthState();

      this.watchMenuPanelStatus();
      this.watchMenuPanelExpanded();

      this.watchUserPanelStatus();
      this.watchUserPanelExpanded();

      this.watchMusicPanelStatus();
      this.watchMusicPanelExpanded();

      this.watchDebugActive();
    }, 30);
  }

  getPanelState() {
    this.curScreen = this.panelService.getCurrentBreakpoint(window.innerWidth).toLowerCase();
    this.panelService.getBrainRule().subscribe(res => {
      this.userMenuState = res.panels[this.curScreen].menu;
      this.userPanelState = res.panels[this.curScreen].user;
    })
  }

  openUserPanel() {
    this.getPanelState();
    if( this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.xs ||
        this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.vs ||
        this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.sm) {

      setTimeout(() => {
        this.userService.removeUserPanelSticky();
        this.userService.collapseUserPanel();
        this.userService.setActiveUserPanel(true);
        this.debugService.info('User panel is shown', Constants.FC_PANEL_HEADER_PATH + 'header.ts', '', 'openUserPanel()', this.debugService.makeDebugObject());

        if(this.userPanelState['canExpand'] == true && this.isUserExpanded == true) {
          this.userService.expandUserPanel();
          if(this.userPanelState['ifExpanded'] == Constants.panelPadding.sti) {
            this.userService.addUserPanelSticky_Expand();
          }
        } else if(this.userPanelState['ifCollapsed'] == Constants.panelPadding.sti) {
          this.userService.addUserPanelSticky_Collapse();
        }
      }, 20);

    } else {
      this.userService.removeUserPanelSticky();

      if(this.isUserExpanded) {
        this.userService.expandUserPanel();
        if(this.userPanelState['ifExpanded'] === Constants.panelPadding['sti']) { this.userService.addUserPanelSticky_Expand(); }
        if(this.panelService.isDesktop()) { this.musicService.setMusicPanel_ExpandedWidth(); }
      } else {
        this.userService.collapseUserPanel();
        if(this.userPanelState['ifCollapsed'] === Constants.panelPadding['sti']) { this.userService.addUserPanelSticky_Collapse(); }
        if(this.panelService.isDesktop()) { this.musicService.setMusicPanel_CollapsedWidth(); }
      }
      setTimeout(() => {
        this.userService.setActiveUserPanel(true);
        this.debugService.info('User panel is shown', Constants.FC_PANEL_HEADER_PATH + 'header.ts', '', 'openUserPanel()', this.debugService.makeDebugObject());
      }, 0);
    }
  }

  showMenuBar() {

    if( this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.xs ||
        this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.vs ||
        this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.sm) {

      setTimeout(() => {
        this.menuService.removeMenuPanelSticky();
        this.menuService.collapseMenuPanel();
        this.headerService.collapseHeaderPanel();
        this.menuService.setActiveMenuPanel(true);
        this.debugService.info('Menu panel is shown', Constants.FC_PANEL_HEADER_PATH + 'header.ts', '', 'showMenuBar()', this.debugService.makeDebugObject());
        
        if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.sm) {
          if(this.isMenuShowed) {
            if(this.isMenuExpanded) { this.menuService.expandMenuPanel(); this.headerService.expandHeaderPanel(); }
            else { this.headerService.collapseHeaderPanel(); }
          }
        }
        if(this.userMenuState['canExpand'] == true && this.isMenuExpanded == true) {
          this.menuService.expandMenuPanel();
          this.headerService.expandHeaderPanel();
          if(this.userMenuState['ifExpanded'] == Constants.panelPadding.sti) {
            this.menuService.addMenuPanelSticky_Expand();
          }
        } else if(this.userMenuState['ifCollapsed'] == Constants.panelPadding.sti) {
          this.menuService.addMenuPanelSticky_Collapse();
        }
      }, 20);
    } else {
      this.menuService.removeMenuPanelSticky();
      this.headerService.changeHeaderFullWidth();
      if(this.isMenuExpanded) {
        this.menuService.showMenuBar(); this.headerService.expandHeaderPanel();
        if(this.userMenuState['ifExpanded'] === Constants.panelPadding['sti']) { this.menuService.addMenuPanelSticky_Expand(); }
      } else {
        this.menuService.collapseMenuPanel(); this.headerService.collapseHeaderPanel();
        if(this.userMenuState['ifCollapsed'] === Constants.panelPadding['sti']) { this.menuService.addMenuPanelSticky_Collapse(); }
      }
      setTimeout(() => {
        this.menuService.setActiveMenuPanel(true);
        this.debugService.info('Menu panel is shown', Constants.FC_PANEL_HEADER_PATH + 'header.ts', '', 'showMenuBar()', this.debugService.makeDebugObject());
      }, 0);
    }
  }

  focusSearchInput(element) {
    element.classList.add('expand');
  }

  focusoutSearchInput(element) {
    element.classList.remove('expand');
  }  

  watchAuthState() { // Always catch user is authenticated or not ?
    this.getAuthState = this.store.select(selectAuthState);
    this.getAuthState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      if(this.isClickLogin) {
        if(state.errorMessage === null) {
          this.debugService.info('Auth api returns login success message', Constants.FC_PANEL_HEADER_PATH + 'header.ts', 'storage/actions/auth.ts', 'LogInSuccess()');
        } else {
          this.debugService.error('Auth api returns login failure message', Constants.FC_PANEL_HEADER_PATH + 'header.ts', 'storage/actions/auth.ts', 'LogInFailure()');
        }
      }
      this.loadingService.dismiss();
    })
  }

  watchMenuPanelStatus() { // Always catch menu panel is showed or hided ?
    this.menuService.getActiveMenuPanel().subscribe(val => {
      this.isMenuShowed = val;
    });
  }

  watchMenuPanelExpanded() {
    this.menuService.getExpandMenuPanel().subscribe(val => {
      this.isMenuExpanded = val;
    })
  }

  watchUserPanelStatus() {
    this.userService.getActiveUserPanel().subscribe(val => {
      this.isUserShowed = val;
    })
  }

  watchUserPanelExpanded() {
    this.userService.getExpandUserPanel().subscribe(val => {
      this.isUserExpanded = val;
    })
  }

  watchMusicPanelStatus() {
    this.musicService.getActiveMusicPanel().subscribe(val => {
      this.isMusicShowed = val;
    })
  }

  watchMusicPanelExpanded() {
    this.musicService.getExpandMusicPanel().subscribe(val => {
      this.isMusicExpanded = val;
    })
  }

  watchDebugActive() {
    this.debugService.getDebugActive().subscribe(res => this.isDebugActive = res);
  }

  showDebugWindow() {
    this.debugService.setDebugActive(!this.isDebugActive);
  }

/**
 * Login
 */

  onSubmit() {
    const payload = {
      email: 'fake@login.com',
      password: '123'
    }
    this.isClickLogin = true;
    this.loadingService.present();
    this.debugService.info('Called login api', Constants.FC_PANEL_HEADER_PATH + 'header.ts', 'service/auth.ts', 'logIn()', payload);
    this.store.dispatch(new LogIn(payload));
  }

  onSignup() {
    const payload = {
      email: 'ddd@dd.com',
      password: '123'
    }
    this.store.dispatch(new Signup(payload));
  }
}
