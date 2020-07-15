import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

import { Constants } from 'src/app/constants';
import { Debug } from 'src/app/models/debug';
import { PanelService } from './panels/panel';
import { UserService } from './panels/user';
import { MenuService } from './panels/menu';
import { MusicService } from './panels/music';
import { HeaderService } from './panels/header';
@Injectable({
  providedIn: 'root'
})
export class DebugService { 

  private debugOutput: BehaviorSubject<Debug[]>;
  private debugActive: BehaviorSubject<boolean>;

  isMenuShowed: boolean;
  isMenuExpanded: boolean;

  isUserShowed: boolean;
  isUserExpanded: boolean;

  isMusicShowed: boolean;
  isMusicExpanded: boolean;

  menuPanelState: any;
  userPanelState: any;

  constructor(
    private panelService: PanelService,
    private userService: UserService,
    private menuService: MenuService,
    private musicService: MusicService,
    private headerService: HeaderService
  ) {
    this.debugOutput = new BehaviorSubject([]);
    this.debugActive = new BehaviorSubject(false);
  }

  setDebugActive(val) {
    this.debugActive.next(val);
  }

  getDebugActive() {
    return this.debugActive.asObservable();
  }

  private receive(data: Debug) {
    if(environment.debug) {
      const currentValue = this.debugOutput.value;
      const updatedValue = [...currentValue, data];
      this.debugOutput.next(updatedValue);
    }
  }

  public filterDate() {
    let curDate = new Date();
    const month = (curDate.getMonth() + 1) < 10 ? '0' + (curDate.getMonth() + 1) : (curDate.getMonth() + 1);
    const date = curDate.getDate() < 10 ? '0' + curDate.getDate() : curDate.getDate();
    const hour = curDate.getHours() < 10 ? '0' + curDate.getHours() : curDate.getHours();
    const min = curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes();
    const sec = curDate.getSeconds() < 10 ? '0' + curDate.getSeconds() : curDate.getSeconds();
    const msec = curDate.getMilliseconds();

    return month + '-' + date + ' ' + hour + ':' + min + ':' + sec + '.' + msec;
  }

  public info(message: string, generated: string, funcFilePath: string, funcName: string, object?: object) {
    const obj = {
      message: message,
      generated: {
        funcFilePath: funcFilePath,
        funcName: funcName,
        created: this.filterDate() + ' Arena music debug output:',
        origin: generated
      },
      object: object,
      verbosity: 'info'
    }
    this.receive(obj);
  }

  public error(message: string, generated: string, funcFilePath: string, funcName: string, object?: object) {
    const obj = {
      message: message,
      generated: {
        funcFilePath: funcFilePath,
        funcName: funcName,
        created: this.filterDate() + ' Arena music debug output:',
        origin: generated
      },
      object: object,
      verbosity: 'error'
    }
    this.receive(obj);
  }

  public warning(message: string, generated: string, funcFilePath: string, funcName: string, object?: object) {
    const obj = {
      message: message,
      generated: {
        funcFilePath: funcFilePath,
        funcName: funcName,
        created: this.filterDate() + ' Arena music debug output:',
        origin: generated
      },
      object: object,
      verbosity: 'warning'
    }
    this.receive(obj);
  }

  public clear() {
    if(environment.debug) {
      this.debugOutput.next([]);
    }
  }

  public outputDebug() {
    return this.debugOutput.asObservable();
  }

  watchMenuStatus() {
    this.menuService.getActiveMenuPanel().subscribe(res => this.isMenuShowed = res);
  }

  watchMenuExpanded() {
    this.menuService.getExpandMenuPanel().subscribe(res => this.isMenuExpanded = res);
  }

  watchUserStatus() {
    this.userService.getActiveUserPanel().subscribe(res => this.isUserShowed = res);
  }

  watchUserExpanded() {
    this.userService.getExpandUserPanel().subscribe(res => this.isUserExpanded = res);
  }

  watchMusicStatus() {
    this.musicService.getActiveMusicPanel().subscribe(res => this.isMusicShowed = res);
  }

  watchMusicExpanded() {
    this.musicService.getExpandMusicPanel().subscribe(res => this.isMusicExpanded = res);
  }

  getPanelsState() {
    let breakpoint = this.panelService.getCurrentBreakpoint(window.innerWidth);
    let res = JSON.parse(localStorage.getItem('brain'));
    this.menuPanelState = res.panels[breakpoint.toLowerCase()].menu;
    this.userPanelState = res.panels[breakpoint.toLowerCase()].user;
  }

  setNecessarySettingForDebug() {
    this.watchMenuStatus();
    this.watchMenuExpanded();
    this.watchUserStatus();
    this.watchUserExpanded();
    this.watchMusicStatus();
    this.watchMusicExpanded();
    this.getPanelsState();
  }

  makeDebugObject() {
    this.setNecessarySettingForDebug();
    let obj = {
      panels: {
        header: {
          mode: this.isMenuShowed ? this.isMenuExpanded ? 'Collapseed' : 'Expanded' : 'Full'          
        },
        user: {
          mode: this.isUserShowed ? this.isUserExpanded ? 'Expanded' : 'Collapsed' : 'Hidden',
          state: this.isUserShowed ? this.isUserExpanded ? this.userPanelState['ifExpanded'] : this.menuPanelState['ifCollapsed'] : 'Float'
        },
        music: {
          mode: this.isMusicShowed ? this.isMusicExpanded ? 'Expanded' : 'Collapsed' : 'Hidden'
        },
        menu: {
          mode: this.isMenuShowed ? this.isMenuExpanded ? 'Expanded' : 'Collapsed' : 'Hidden',
          state: this.isMenuShowed ? this.isMenuExpanded ? this.menuPanelState['ifExpanded'] : this.menuPanelState['ifCollapsed'] : 'Float'
        },
      }
    }
    return obj;
  }
}