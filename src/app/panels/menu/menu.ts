import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Constants } from '../../constants';
import { ThemeService } from 'src/app/service/theme';

import { PanelService } from 'src/app/service/panels/panel';
import { UserService } from 'src/app/service/panels/user';
import { MenuService } from 'src/app/service/panels/menu';
import { MusicService } from 'src/app/service/panels/music';
import { HeaderService } from 'src/app/service/panels/header';

import { Observable } from 'rxjs';
import { DebugService } from 'src/app/service/debug';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
})
export class MenuComponent implements OnInit, AfterViewInit {

  menuPanelState: Observable<any>;
  curScreen: string;
  canExpand: boolean;

  selectedTheme: string;
  isDuskTheme: boolean = true;
  nameTheme: string;
  currentUrlTitle: string = 'home';

  isExpanded: boolean;
  isShowed: boolean;

  isUserShowed: boolean;
  isUserExpanded: boolean;

  isMusicShowed: boolean;
  isMusicExpanded: boolean;

  isClickedHamburger: boolean;

  isLoaded = false; // window is loaded or not

  public appBrowserPages = [
    { title: 'Home', url: '/home', icon: 'fal fa-home' },
    { title: 'Recommendations', url: '/home/recommendations', icon: 'fal fa-book-reader' },
    { title: 'New Release', url: '/home/new-release', icon: 'fal fa-calendar-minus' },
    { title: 'Radio', url: '/home/radio', icon: 'fa fa-signal-stream' },
    { title: 'Feed', url: '/home/feed', icon: 'fa fa-book-open' }    
  ]

  public appYourPages = [
    { title: 'Your Arena', url: '/home/your-arena', icon: 'fal fa-plus' },
    { title: 'History', url: '/home/history', icon: 'fal fa-history' },
  ]

  public appArtistPages = [
    { title: 'Your Stats', url: '/home/your-stats', icon: 'fal fa-signal' },
  ]
  constructor(
    private themeService: ThemeService,
    private panelService: PanelService,
    private userService: UserService,
    private menuService: MenuService,
    private musicService: MusicService,
    private headerService: HeaderService,
    private debugService: DebugService
  ) {
    
  }

  ngOnInit() {
    this.initializeNavigation();
  }

  ngAfterViewInit() {
    this.checkCurrentResolution();

    this.watchMenuPanelStatus();
    this.watchMenuPanelExpanded();
    this.watchMenuPanelCanExpand();

    this.watchMusicPanelStatus();
    this.watchMusicPanelExpanded();

    this.watchUserPanelStatus();
    this.watchUserPanelExpanded();    
  }

  initializeNavigation() {
    this.themeService.getActiveTheme().subscribe(val => {
      this.selectedTheme = val
      if (val === Constants.duskTheme) { this.nameTheme = Constants.tooltipDawnTheme; }
      else { this.nameTheme = Constants.tooltipDuskTheme; }

      if(!this.isLoaded) { this.isLoaded = true; this.debugService.info('Arena music is loaded with ' + val, Constants.FC_PANEL_MENU_PATH + 'menu.ts', '', ''); }
      else { this.debugService.info('Arena music theme is changed into ' + val, Constants.FC_PANEL_MENU_PATH + 'menu.ts', '', ''); }
    });
  }

  navigate(title: any) {
    this.currentUrlTitle = title;
  }

  getPanelState() {
    this.curScreen = this.panelService.getCurrentBreakpoint(window.innerWidth).toLowerCase();
    let res = JSON.parse(localStorage.getItem('brain'));
    this.menuPanelState = res.panels[this.curScreen].menu;
    this.canExpand = this.menuPanelState['canExpand'];
    this.menuService.setMenuPanelCanExpand(this.canExpand);
  }

  checkCurrentResolution() {
    this.getPanelState();
    setTimeout(() => {
      this.menuService.removeMenuPanelSticky();
      this.headerService.changeHeaderFullWidth();
      if(this.menuPanelState['defaultMode'] === Constants.panelMode['ex']) {
        this.menuService.expandMenuPanel();
        this.isShowed = true; this.isExpanded = true;
        this.menuService.setActiveMenuPanel(true); this.menuService.setExpandMenuPanel(true);
        this.headerService.expandHeaderPanel();
        if (this.menuPanelState['defaultState'] === Constants.panelPadding.sti) {
          this.menuService.addMenuPanelSticky_Expand();
        }
      } else if(this.menuPanelState['defaultMode'] === Constants.panelMode['co']) {
        this.menuService.collapseMenuPanel();
        this.isShowed = true; this.isExpanded = false;
        this.menuService.setActiveMenuPanel(true); this.menuService.setExpandMenuPanel(false);
        this.headerService.collapseHeaderPanel();
        if (this.menuPanelState['defaultState'] === Constants.panelPadding.sti) {
          this.menuService.addMenuPanelSticky_Collapse();
        }
      } else if(this.menuPanelState['defaultMode'] === Constants.panelMode['hd']) {
        this.menuService.hideMenuBar();
        this.isShowed = false; this.isExpanded = false;
        this.menuService.setActiveMenuPanel(false); this.menuService.setExpandMenuPanel(false);
        this.headerService.changeHeaderFullWidth();
      }
    }, 350);
  }

  watchMenuPanelStatus() { // Always catch menu panel is showed or hided ?
    this.menuService.getActiveMenuPanel().subscribe(val => {
      this.isShowed = val;
    })
  }

  watchMenuPanelExpanded() { // Always catch menu panel is expaned or collapsed ?
    this.menuService.getExpandMenuPanel().subscribe(val => {
      this.isExpanded = val;
    })
  }

  watchMenuPanelCanExpand() {
    this.menuService.getMenuPanelCanExpand().subscribe(val => {
      this.canExpand = val;
    })
  }

  watchMusicPanelStatus() { // Always catch music panel is showed or hided ?
    this.musicService.getActiveMusicPanel().subscribe(val => {
      this.isMusicShowed = val;
      if(val) {
        this.menuService.collapseMenuPanelLink();
      } else {
        if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['xs'] || this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['vs']) {
          this.userService.expandUserPanelLink_OnMobile();
        } else {
          this.menuService.expandMenuPanelLink();
        }
      }
    })
  }

  watchMusicPanelExpanded() { // Always catch music panel is expanded or collapsed ?
    this.musicService.getExpandMusicPanel().subscribe(val => {
      this.isMusicExpanded = val;
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

  setMenuScaling() { // Set menu panel to expand or collpase
    this.getPanelState();
    setTimeout(() => {
      this.menuService.removeMenuPanelSticky();
      this.headerService.expandHeaderPanel();
      if(this.isExpanded) {
        this.menuService.collapseMenuPanel(); this.headerService.collapseHeaderPanel();
        if(this.menuPanelState['ifCollapsed'] === Constants.panelPadding['sti']) { this.menuService.addMenuPanelSticky_Collapse(); }
      } else {
        let interactionState = this.menuPanelState['panelInteractions']['ifExpanding']['user'];
        this.menuService.expandMenuPanel(); this.headerService.expandHeaderPanel();
        if(this.menuPanelState['ifExpanded'] === Constants.panelPadding['sti']) { this.menuService.addMenuPanelSticky_Expand();}

        if(interactionState['maxMode'] === Constants.panelMode['co']) {
          if(this.isUserShowed) {
            this.userService.collapseUserPanel();
            this.userService.setExpandUserPanel(false);

            if(interactionState['maxState'] === Constants.panelPadding['sti']) { this.userService.removeUserPanelSticky(); this.userService.addUserPanelSticky_Collapse(); }
            else if(interactionState['maxState'] === Constants.panelPadding['flt']) { this.userService.removeUserPanelSticky(); }
          }
        }

        if(this.menuPanelState['ifExpanded'] === Constants.panelPadding['sti']) { this.menuService.addMenuPanelSticky_Expand(); }
      }
      
      this.menuService.setActiveClickExpandMenuPanel(!this.isExpanded);
      setTimeout(() => {
        this.menuService.setExpandMenuPanel(!this.isExpanded);
        this.debugService.info(this.isExpanded ? 'Menu panel is expanded' : 'Menu panel is collapsed', Constants.FC_PANEL_MENU_PATH + 'menu.ts', '', 'setMenuScaling()', this.debugService.makeDebugObject());
      }, 20);
    }, 20);
  }

  setMenuHide() { // Set menu panel to show or hide
    this.menuService.hideMenuBar();
    this.headerService.changeHeaderFullWidth();
    this.menuService.setActiveMenuPanel(false);
    this.menuService.removeMenuPanelSticky();
    this.menuService.setActiveClickHideMenuPanel(true);
    this.debugService.info('Menu panel is hidden', Constants.FC_PANEL_MENU_PATH + 'menu.ts', '', 'setMenuHiding()', this.debugService.makeDebugObject());
  }

  clickOutside() {
    if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['xs'] ||
      this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['vs'] ||
      this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['sm']) {

      this.menuService.hideMenuBar();
      setTimeout(() => {
        this.menuService.setActiveMenuPanel(false);
        this.debugService.info('Menu panel is hidden', Constants.FC_PANEL_MENU_PATH + 'menu.ts', '', 'clickOutside()', this.debugService.makeDebugObject());
      }, 10);
      this.menuService.removeMenuPanelSticky();
      this.headerService.changeHeaderFullWidth(); 

      // if(this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints['sm']) {
      //   this.headerService.changeHeaderFullWidth(); 
      //   // this.userService.removeUserPanelSticky(); this.menuService.removeMenuPanelSticky();
      // }
    }
  }

  toggleAppTheme() {
    this.debugService.info('Call change window theme function', Constants.FC_PANEL_MENU_PATH + 'menu.ts', Constants.FC_SERVICE_PATH + 'theme.ts', 'setActiveTheme()');
    if (this.isDuskTheme) {
      this.themeService.setActiveTheme(Constants.dawnTheme);
    } else {
      this.themeService.setActiveTheme(Constants.duskTheme);
    }
    this.isDuskTheme = !this.isDuskTheme;
  }

}
