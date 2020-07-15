import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
 
  currentScreenSize: BehaviorSubject<string>;
  currentScreenViewport: BehaviorSubject<string>;
  
  constructor(
    private http: HttpClient
  ) {
    this.currentScreenSize = new BehaviorSubject(Constants.screenBreakpoints['lg']);
    this.currentScreenViewport = new BehaviorSubject('0 * 0');
  }

/**
 * Call api url
 */

  getBrainRule(): Observable<any> {
    let url = '../../assets/brain.json';
    return this.http.get(url);
  }

  isMobile() {
    if (window.innerWidth <= Constants.screenSM) { return true; }
    else { return false; }
  }

  isTablet() {
    if (window.innerWidth > Constants.screenSM && window.innerWidth < Constants.screenLG )  { return true; }
    else { return false; }
  }

  isDesktop() {
    if(window.innerWidth >= Constants.screenLG) { return true; }
    else { return false; }
  }

/**
 * Set & Get current screen resolution state
 */

  setActiveBreakpoint(val) {
    this.currentScreenSize.next(val);
  }

  getActiveBreakpoint() {
    return this.currentScreenSize.asObservable();
  }

  setActiveResolution(val) {
    this.currentScreenViewport.next(val);
  }

  getActiveResolution() {
    return this.currentScreenViewport.asObservable();
  }

/**
 * Return current screen breakpoints => result: (xs/vs/sm/md/lg/vl/xl)
 * Return current screen dimensions => 1920 * 1080
 */

  getCurrentBreakpoint(screenWidth: number): string {
    let res = '';
    if(screenWidth > 0 && screenWidth < Constants.screenVS) {
      res = Constants.screenBreakpoints['xs'];
    } else if(screenWidth >= Constants.screenVS && screenWidth < Constants.screenSM) {
      res = Constants.screenBreakpoints['vs'];
    } else if(screenWidth >= Constants.screenSM && screenWidth < Constants.screenMD) {
      res = Constants.screenBreakpoints['sm'];
    } else if(screenWidth >= Constants.screenMD && screenWidth < Constants.screenLG) {
      res = Constants.screenBreakpoints['md'];
    } else if(screenWidth >= Constants.screenLG && screenWidth < Constants.screenVL) {
      res = Constants.screenBreakpoints['lg'];
    } else if(screenWidth >= Constants.screenVL && screenWidth < Constants.screenXL) {
      res = Constants.screenBreakpoints['vl'];
    } else if(screenWidth >= Constants.screenXL) {
      res = Constants.screenBreakpoints['xl'];
    }
    this.setActiveBreakpoint(res);
    return res;
  }

  getCurrentResolution(width: number, height:number) {
    this.setActiveResolution(width.toString() + ' * ' + height.toString());
  }
}