import { Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Constants } from './constants';

import { PanelService } from './service/panels/panel';
import { UserService } from './service/panels/user';
import { MenuService } from './service/panels/menu';
import { HeaderService } from './service/panels/header';
import { MusicService } from './service/panels/music';
import { DebugService } from './service/debug';
import { ThemeService } from './service/theme';
import { MetaService } from './service/meta';
import { HistoryService } from './service/history';

import { AppStorage, selectAuthState } from './storage/storage';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'arena',
  templateUrl: 'ui.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  
  getAuthState: Observable<any>;
  isAuthenticated: boolean = false;

  headerPanel: any; // variable for header element
  musicPanel: any;  // variable for header music
  menuPanel: any;   // variable for header menu
  userPanel: any;   // variable for header user

  menuPanelState: any; // json object for menu panel state (user state or default state)
  userPanelState: any; // json object for user panel state (user state or default state)
  curScreen: string;   // current screen resolution

  selectedTheme: string; // current theme (dusk or dawn)

  isMenuShowed: boolean; 
  isMenuExpanded: boolean;

  isUserShowed: boolean;
  isUserExpanded: boolean;

  isMusicShowed: boolean;
  isMusicExpanded: boolean;

  isClickMenuExpand: boolean;
  isClickUserExpand: boolean;

  isClickMenuHide: boolean;
  isClickUserHide: boolean;

  currentRoute: string;

  rtime; // Check for windows resize is done or processing
  timeout = false; // Check for windows resize is done or processing
  delta = 200; // Check for windows resize is done or processing

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private themeService: ThemeService,
    private panelService: PanelService,
    private userService: UserService,
    private menuService: MenuService,
    private musicService: MusicService,
    private headerService: HeaderService,
    private debugService: DebugService,
    private ngZone: NgZone,
    private store: Store<AppStorage>,
    private location: Location,
    private router: Router,
    private metaService: MetaService,
    private historyService: HistoryService
  ) {
    this.initializeApp();
    this.initializePanel();

    this.watchAuthState();

    this.watchMenuPanelStatus();
    this.watchMenuPanelExpanded();
    this.watchClickMenuExpand();
    this.watchClickMenuHide();
    
    this.watchUserPanelStatus();
    this.watchUserPanelExpanded();
    this.watchClickUserExpand();
    this.watchClickUserHide();

    this.watchMusicPanelStatus();
    this.watchMusicPanelExpanded();

    this.windowResize();

    this.outputDebugAppLoading();

    this.watchRouter();
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    let self = this;
    window.addEventListener('resize', this.doneResizing(function(e){
      self.outputDebugWindowResize();
    }));
  }

  doneResizing(func) {
    let timer;
    return function(event) {
      if(timer) clearTimeout(timer);
      timer = setTimeout(func, 1000, event);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.themeService.getActiveTheme().subscribe(val => this.selectedTheme = val);
      this.panelService.getCurrentBreakpoint(window.innerWidth);
      this.panelService.getCurrentResolution(window.innerWidth, window.innerHeight);
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
      this.panelService.getBrainRule().subscribe(res => {
        localStorage.setItem('brain', JSON.stringify(res));
      });
    });
  }

  initializePanel() {
    this.platform.ready().then(() => {
      this.headerPanel = document.getElementById('toolbar');
      this.musicPanel = document.getElementById('playbar');
      this.menuPanel = document.getElementById('menuPanel');
      this.userPanel = document.getElementById('userPanel');
    });
  }

  getPanelState() {
    this.curScreen = this.panelService.getCurrentBreakpoint(window.innerWidth).toLowerCase();
    let res = JSON.parse(localStorage.getItem('brain'));
    this.menuPanelState = res.panels[this.curScreen].menu;
    this.menuService.setMenuPanelCanExpand(this.menuPanelState['canExpand']);
    this.userPanelState = res.panels[this.curScreen].user;
    this.userService.setUserPanelCanExpand(this.userPanelState['canExpand']);
  }

  watchRouter() {
    this.router.events.subscribe(val => {
      if(this.currentRoute != this.location.path()) { // catch route changes
        this.currentRoute = this.location.path();
        this.debugService.info(`Navigated to '${this.currentRoute}'`, Constants.FC_PATH + 'ui.ts', '', 'watchRouter()', this.debugService.makeDebugObject());

        // Remove old meta tags and add new meta tags
        this.metaService.removeMetaTags();
        this.metaService.addMetaTags(this.currentRoute);
        // Track history
        setTimeout(() => {
          this.historyService.add(this.currentRoute);
        }, 200);
        
      }
    })
  }

  watchAuthState() {
    this.getAuthState = this.store.select(selectAuthState);
    this.getAuthState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
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

  watchUserPanelStatus() { // Always catch user panel is shown or hdden ?
    this.userService.getActiveUserPanel().subscribe(val => {
      this.isUserShowed = val;
    })
  }

  watchUserPanelExpanded() { // Always catch user panel is expanded or collapsed ?
    this.userService.getExpandUserPanel().subscribe(val => {
      this.isUserExpanded = val;
    })
  }

  watchMusicPanelStatus() { // Always catch music panel is shown or hdden ?
    this.musicService.getActiveMusicPanel().subscribe(val => {
      this.isMusicShowed = val;
    })
  }

  watchMusicPanelExpanded() { // Always catch music panel is expanded or collapsed ?
    this.musicService.getExpandMusicPanel().subscribe(val => {
      this.isMusicExpanded = val;
    })
  }

  watchClickMenuExpand() { // Always catch click expand button on menu panel ?
    this.menuService.getActiveClickExpandMenuPanel().subscribe(val => {
      this.isClickMenuExpand = val;
    })
  }

  watchClickUserExpand() { // Always catch click expand button on user panel ?
    this.userService.getActiveClickExpandUserPanel().subscribe(val => {
      this.isClickUserExpand = val;
    })
  }

  watchClickMenuHide() { // Always catch click hide button on menu panel ?
    this.menuService.getActiveClickHideMenuPanel().subscribe(val => {
      this.isClickMenuHide = val;
    })
  }

  watchClickUserHide() { // Always catch click hide button on user panel ?
    this.userService.getActiveClickHideUserPanel().subscribe(val => {
      this.isClickUserHide = val;
    })
  }
  
  windowResize() {
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.getPanelState();
        if(this.isMenuShowed) { // Manage menuPanel show && expand

          this.menuService.removeMenuPanelSticky();
          this.headerService.changeHeaderFullWidth(); 
          if(this.isMenuExpanded) {
            this.isMenuShowed = true; this.menuService.setActiveMenuPanel(true);
            if (this.userPanelState['panelInteractions']['ifCollapsing']['menu']['maxMode'] == Constants.panelMode.co || !this.menuPanelState['canExpand']) {
              this.menuService.collapseMenuPanel();
              this.isMenuExpanded = false; this.menuService.setExpandMenuPanel(false);  
              this.headerService.collapseHeaderPanel();
              if(this.menuPanelState['ifCollapsed'] === Constants.panelPadding.sti) {
                this.menuService.addMenuPanelSticky_Collapse();
              }
            } else {
              this.menuService.expandMenuPanel();
              this.isMenuExpanded = true; this.menuService.setExpandMenuPanel(true);
              this.headerService.expandHeaderPanel();
              if(this.menuPanelState['ifExpanded'] === Constants.panelPadding.sti) {
                this.menuService.addMenuPanelSticky_Expand();
              }
            }
          } else {
            this.menuService.collapseMenuPanel();
            this.isMenuShowed = true; this.menuService.setActiveMenuPanel(true);
            this.isMenuExpanded = false; this.menuService.setExpandMenuPanel(false);
            this.headerService.collapseHeaderPanel();
            if(this.menuPanelState['ifCollapsed'] === Constants.panelPadding.sti) {
              this.menuService.addMenuPanelSticky_Collapse();
            }
          }
        }

        if(this.isUserShowed) {  // Manage userPanel show && expand
          this.userService.removeUserPanelSticky()
          this.isUserShowed = true; this.userService.setActiveUserPanel(true);
          if(this.isUserExpanded) {
            if (this.menuPanelState['panelInteractions'][this.isMenuExpanded ? 'ifExpanding' : 'ifCollapsing']['user']['maxMode'] == Constants.panelMode.co || !this.userPanelState['canExpand']) {
              this.userService.collapseUserPanel();
              this.isUserExpanded = false; this.userService.setExpandUserPanel(false);
              if(this.userPanelState['ifCollapsed'] === Constants.panelPadding.sti) {
                this.userService.addUserPanelSticky_Collapse();
              }
            } else {
              this.userService.expandUserPanel();
              this.isUserExpanded = true; this.userService.setExpandUserPanel(true);
              if(this.userPanelState['ifExpanded'] === Constants.panelPadding.sti) {
                this.userService.addUserPanelSticky_Expand();
              }
            }
          } else {
            this.userService.collapseUserPanel();
            this.isUserShowed = true; this.userService.setActiveUserPanel(true);
            this.isUserExpanded = false; this.userService.setExpandUserPanel(false);
            if(this.userPanelState['ifCollapsed'] === Constants.panelPadding.sti) {
              this.userService.addUserPanelSticky_Collapse();
            }
          }
        }
        
        if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['xs'] || // Manage music panel show && expand || menuPanel and userPanel's mylink height
           this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['vs']) {
          if(this.isMusicShowed) {
            this.userService.collapseUserPanelLink_OnMobile();
            if(this.isMusicExpanded) this.musicService.expandMusicPanel();
            else this.musicService.collapseMusicPanel();
          } else {
            this.userService.expandUserPanelLink_OnMobile();
          }
          let wave = document.getElementById('wave');
          if(!this.isMusicExpanded) {
            wave.style.opacity = "0";
            wave.style.position = "absolute";
          }
          this.musicService.setExpandMusicPanel(this.isMusicExpanded);
        } else if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['sm']) {
          if(this.isMusicShowed) {
            
            if(this.isMusicExpanded) {
              this.userService.collapseUserPanelLink_SM();
              this.menuService.collapseMenuPanelLink_Mobile_Expanded();
              this.musicService.expandMusicPanel();
            } else {
              this.userService.expandUserPanelLink_SM();
              this.menuService.expandMenuPanelLink_Mobile_MusicCollapsed();
              this.musicService.collapseMusicPanel();
            }
          } else {
            this.userService.expandUserPanelLink();
            this.menuService.expandMenuPanelLink();
          }
          let wave = document.getElementById('wave');
          if(!this.isMusicExpanded) {
            wave.style.opacity = "0";
            wave.style.position = "absolute";
          }
          this.musicService.setExpandMusicPanel(this.isMusicExpanded);
        } else if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['md'] ||
                  this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['lg'] ||
                  this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['vl'] ||
                  this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['xl']) 
        {
          if(this.isMusicShowed) {
            this.userService.collapseUserPanelLink();
            this.menuService.collapseMenuPanelLink();
            this.musicService.collapseMusicPanel();
          } else {
            this.userService.expandUserPanelLink();
            this.menuService.expandMenuPanelLink();
          }
          let wave = document.getElementById('wave');
          wave.style.opacity = "1";
          wave.style.position = "relative";
          // this.musicService.setExpandMusicPanel(false);

          if(this.panelService.isDesktop()) {
            this.userService.expandUserPanelLink();
          }
        }

        if(this.panelService.isDesktop()) {  // Manage musicPanel width according to the userPanel status
          if(this.isUserShowed) {
            if(this.isUserExpanded) {
              this.musicService.setMusicPanel_ExpandedWidth();
            } else {
              this.musicService.setMusicPanel_CollapsedWidth();
            }
          } else {
            this.musicService.setMusicPanel_FullWidth();
          }
        } else {
          this.musicService.setMusicPanel_FullWidth();
        }
        
        this.panelService.getCurrentBreakpoint(window.innerWidth);
        this.panelService.getCurrentResolution(window.innerWidth, window.innerHeight);
      });
    }
  }

  outputDebugAppLoading() {
    let device = '';
    if(this.panelService.isMobile()) { device = 'Mobile'; }
    else if(this.panelService.isTablet()) { device = 'Tablet'; }
    else if(this.panelService.isDesktop()) { device = 'Desktop' ; }
    let breakpoint = this.panelService.getCurrentBreakpoint(window.innerWidth);
    this.debugService.info('Arena Music started in ' + device + ' version(' + breakpoint + ')', Constants.FC_PATH + 'ui.ts', '', '');
  }

  outputDebugWindowResize() {
    let device = '';
    if(this.panelService.isMobile()) { device = 'Mobile'; }
    else if(this.panelService.isTablet()) { device = 'Tablet'; }
    else if(this.panelService.isDesktop()) { device = 'Desktop'; }
    let breakpoint = this.panelService.getCurrentBreakpoint(window.innerWidth);
    let resolution = window.innerWidth + ' * ' + window.innerHeight;
    this.debugService.info('Window size changed to ' + device + ' version(' + breakpoint + ')[' + resolution + ']', Constants.FC_PATH + 'ui.ts', 'ui.ts', 'resize()');
  }

}
