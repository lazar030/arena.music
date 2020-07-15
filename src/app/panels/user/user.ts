import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppStorage, selectAuthState } from '../../storage/storage';

import { PanelService } from 'src/app/service/panels/panel';
import { UserService } from 'src/app/service/panels/user';
import { MenuService } from 'src/app/service/panels/menu';
import { MusicService } from 'src/app/service/panels/music';
import { HeaderService } from 'src/app/service/panels/header';

import { Constants } from 'src/app/constants';
import { NbWindowService } from '@nebular/theme';
import { DebugService } from 'src/app/service/debug';

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  styleUrls: ['./user.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {

  @ViewChild('debugTemplate', {static: true}) debugTemplate: TemplateRef<any>;

  userPanel: any; // Variable for get element of userPanel
  curUrlTitle: string; // Current HTML title

  getAuthState: Observable<any>; // Watch authenticate state
  isAuthenticated: boolean = false; // Variable for current user is authenticated or not
  userPanelState: Observable<any>; // Data for userPanel of brain.json according current breakpoint
  menuPanelState: Observable<any>; // Data for menuPanel of brain.json according current breakpoint
  curScreen: string;  // Current display breakpoint

  isExpanded: boolean; // is userPanel expanded or not
  isShowed: boolean; // is userPanel hidden or not
  canExpand: boolean; // is userPanel can be expanded or not in current breakpoint

  isMenuShowed: boolean; // is menuPanel hidden or not
  isMenuExpanded: boolean; // is menuPanel expanded or not

  isMusicShowed: boolean; // is musicPanel hidden or not
  isMusicExpanded: boolean;  // is musicPanel hidden or not

  constructor(
    private store: Store<AppStorage>,
    private panelService: PanelService,
    private userService: UserService,
    private menuService: MenuService,
    private musicService: MusicService,
    private headerService: HeaderService,
    private debugService: DebugService,
    private windowService: NbWindowService
  ) {
   
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.watchAuthState();

    this.watchUserPanelStatus();
    this.watchUserPanelExpanded();
    this.watchUserPanelCanExpand();

    this.watchMusicPanelStatus();
    this.watchMusicPanelExpanded();

    this.watchMenuPanelStatus();
    this.watchMenuPanelExpanded();
  }

  closeUserPanel() {
    console.log('closeuserpanel');
    this.userService.hideUserPanel();
    this.userService.setActiveUserPanel(false);
    this.userService.removeUserPanelSticky();
    this.userService.setActiveClickHideUserPanel(false);
    this.musicService.setMusicPanel_FullWidth();
  }

  navigate(url: string) {
    this.curUrlTitle = url;
    setTimeout(() => {
      this.getPanelState();
      this.menuService.removeMenuPanelSticky();
      this.userService.removeUserPanelSticky();
      if(this.isMenuExpanded) {
        if(this.menuPanelState['ifExpanded'] === Constants.panelPadding.sti) {
          this.menuService.addMenuPanelSticky_Expand();
        }
      } else if(this.isMenuShowed) {
        if(this.menuPanelState['ifCollapsed'] === Constants.panelPadding.sti) {
          this.menuService.addMenuPanelSticky_Collapse();
        }
      }
      if(this.isExpanded) {
        if(this.userPanelState['ifExpanded'] === Constants.panelPadding.sti) {
          this.userService.addUserPanelSticky_Expand();
        }
      } else if(this.isShowed) {
        if(this.userPanelState['ifCollapsed'] === Constants.panelPadding.sti) {
          this.userService.addUserPanelSticky_Collapse();
        }
      }
    }, 100);
  }

  getPanelState() {
    this.curScreen = this.panelService.getCurrentBreakpoint(window.innerWidth).toLowerCase();
    let res = JSON.parse(localStorage.getItem('brain'));
    this.userPanelState = res.panels[this.curScreen].user;
    this.canExpand = this.userPanelState['canExpand'];
    this.userService.setUserPanelCanExpand(this.canExpand);

    this.menuPanelState = res.panels[this.curScreen].menu;
    this.menuService.setMenuPanelCanExpand(this.menuPanelState['canExpand']);
  }
  
  checkCurrentResolution() {
    this.getPanelState();
    setTimeout(() => {
      if(this.isAuthenticated) {
        if(this.userPanelState['defaultMode'] === Constants.panelMode['ex']) {
          this.userService.expandUserPanel();
          this.isShowed = true; this.isExpanded = true;
          this.userService.setActiveUserPanel(true); this.userService.setExpandUserPanel(true);
          this.userService.removeUserPanelSticky(); 
          if(this.userPanelState['defaultState'] === Constants.panelPadding.sti) {
            this.userService.addUserPanelSticky_Expand();
          }
          if(this.panelService.isDesktop()) { this.musicService.setMusicPanel_ExpandedWidth(); }
        } else if(this.userPanelState['defaultMode'] === Constants.panelMode['co']) {
          this.userService.collapseUserPanel();
          this.isShowed = true; this.isExpanded = false;
          this.userService.setActiveUserPanel(true); this.userService.setExpandUserPanel(false);
          this.userService.removeUserPanelSticky();
          if(this.userPanelState['defaultState'] === Constants.panelPadding.sti) {
            this.userService.addUserPanelSticky_Collapse();
          }
          if(this.panelService.isDesktop()) { this.musicService.setMusicPanel_CollapsedWidth(); }
        } else if(this.userPanelState['defaultMode'] === Constants.panelMode['hd']) {
          this.userService.hideUserPanel();
          this.isShowed = false; this.isExpanded = false;
          this.userService.setActiveUserPanel(false); this.userService.setExpandUserPanel(false);
          
          if(this.panelService.isDesktop()) { this.musicService.setMusicPanel_FullWidth(); }
        }
        this.debugService.info(this.isExpanded ? 'User panel is expanded' : 'User panel is collapsed', Constants.FC_PANEL_USER_PATH + 'user.ts', '', 'checkCurrentResolution()', this.debugService.makeDebugObject());
      } else {
        this.userService.hideUserPanel();
        this.userService.setActiveUserPanel(false);
      }
    }, 350);
  }

  watchAuthState() {
    this.getAuthState = this.store.select(selectAuthState);
    this.getAuthState.subscribe((state) => {
      console.log('AuthState: ', state);
      this.isAuthenticated = state.isAuthenticated;
      this.checkCurrentResolution();
    })
  }

  watchUserPanelStatus() {
    this.userService.getActiveUserPanel().subscribe(val => {
      this.isShowed = val;
    })
  }

  watchUserPanelExpanded() {
    this.userService.getExpandUserPanel().subscribe(val => {
      this.isExpanded = val;
    })
  }

  watchUserPanelCanExpand() {
    this.userService.getUserPanelCanExpand().subscribe(val => {
      this.canExpand = val;
    })
  }

  watchMenuPanelStatus() { // Always catch menu panel is shown or hdden ?
    this.menuService.getActiveMenuPanel().subscribe(val => {
      this.isMenuShowed = val;
    })
  }

  watchMenuPanelExpanded() { // Always catch menu panel is expanded or collapsed ?
    this.menuService.getExpandMenuPanel().subscribe(val => {
      this.isMenuExpanded = val;
    })
  }

  watchMusicPanelStatus() {
    this.musicService.getActiveMusicPanel().subscribe(val => {
      this.isMusicShowed = val;
      if(val) {
        if(this.panelService.isMobile()) {
          this.userService.collapseUserPanelLink_OnMobile();
        } else {
          if(this.panelService.isDesktop()) {
            this.userService.expandUserPanelLink();
          } else {
            this.userService.collapseUserPanelLink();
          }
        }
      } else {
        if(this.panelService.isMobile()) {
          this.userService.expandUserPanelLink_OnMobile();
        } else {
          this.userService.expandUserPanelLink();
        }
      }
    });
  }

  watchMusicPanelExpanded() {
    this.musicService.getExpandMusicPanel().subscribe(val => {
      this.isMusicExpanded = val;
    })
  }

  setUserPanelScaling() {
    this.getPanelState();
    console.log('removeUser Panel sticky :: setUserPanelScaling()');
    this.userService.removeUserPanelSticky();
    if(this.isExpanded) {
      this.userService.collapseUserPanel();
      console.log('setUserpanel scaling: ', this.userPanelState['ifCollapsed']);
      if(this.userPanelState['ifCollapsed'] === Constants.panelPadding.sti) { this.userService.addUserPanelSticky_Collapse(); }
      if(this.panelService.isDesktop()) { this.musicService.setMusicPanel_CollapsedWidth(); }
    } else {
      this.userService.expandUserPanel();
      if(this.userPanelState['ifExpanded'] === Constants.panelPadding['sti']) { this.userService.addUserPanelSticky_Expand(); }
      
      let interactionState = this.userPanelState['panelInteractions']['ifExpanding']['menu'];
      if(interactionState['maxMode'] === Constants.panelMode['co']) {
        if(this.isMenuShowed) {
          this.menuService.collapseMenuPanel();
          this.menuService.setExpandMenuPanel(false);
          this.menuService.removeMenuPanelSticky();
          this.headerService.collapseHeaderPanel();

          if(interactionState['maxState'] === Constants.panelPadding['sti']) {this.menuService.addMenuPanelSticky_Collapse();}
        }
      }

      if(this.userPanelState['ifExpanded'] === Constants.panelPadding['sti']) { this.userService.addUserPanelSticky_Expand(); }
      if(this.panelService.isDesktop()) { this.musicService.setMusicPanel_ExpandedWidth(); }
    }
    
    this.userService.setActiveClickExpandUserPanel(!this.isExpanded);
    setTimeout(() => {
      
      this.userService.setExpandUserPanel(!this.isExpanded);
      this.debugService.info(this.isExpanded ? 'User panel is expanded' : 'User panel is collapsed', Constants.FC_PANEL_USER_PATH + 'user.ts', '', 'setUserPanelScaling()', this.debugService.makeDebugObject());
        
    }, 0);
  }

  clickOutside() {
    if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.xs || 
      this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.vs ||
      this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.sm) {

        this.userService.hideUserPanel();
        setTimeout(() => {
          this.userService.setActiveUserPanel(false);
          this.debugService.info('User panel is hidden', Constants.FC_PANEL_USER_PATH + 'user.ts', '', 'clickOutside()', this.debugService.makeDebugObject());
        }, 10);

        if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['sm'] || this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['vs']) {
          this.headerService.changeHeaderFullWidth(); this.userService.removeUserPanelSticky(); this.menuService.removeMenuPanelSticky();
        }
    }
  }
}
