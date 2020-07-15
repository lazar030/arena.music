import { Injectable } from '@angular/core';
import { Constants } from '../../constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private musicPanel: any;
  private content: any;
  private waveform: any;

  private isMusicPanelHidden: BehaviorSubject<boolean>;
  private isMusicPanelExpanded: BehaviorSubject<boolean>;

  private playList: BehaviorSubject<any>;
  private curPlayingSongInfo: BehaviorSubject<any>;

  constructor() {
    this.isMusicPanelHidden = new BehaviorSubject(false);
    this.isMusicPanelExpanded = new BehaviorSubject(false);

    this.playList = new BehaviorSubject({});
    this.curPlayingSongInfo = new BehaviorSubject({});
  }

  getElements() {
    this.musicPanel = document.getElementById('music');
    this.content = document.getElementById('content');
    this.waveform = document.getElementById('wave');
  }

/**
 * set variable according to music panel is shown or hidden
 * Show / Hide music panel
 * set variable accroding to music panel is expanded or collapsed
 * Expand / Collapse music panel
 */

  setActiveMusicPanel(val) {
    this.isMusicPanelHidden.next(val);
  }

  getActiveMusicPanel() {
    return this.isMusicPanelHidden.asObservable();
  }

  setExpandMusicPanel(val) {
    this.isMusicPanelExpanded.next(val);
  }

  getExpandMusicPanel() {
    return this.isMusicPanelExpanded.asObservable();
  }

  hideMusicPanel() {
    this.getElements();
    this.setExpandMusicPanel(false);
    this.musicPanel.style.borderWidth = 0;
    this.musicPanel.style.height = 0;
  }

  showMusicPanel() {
    this.getElements();
    
    if( window.innerWidth < Constants.screenMD ) {
      this.waveform.style.position = "absolute";
      this.waveform.style.opacity = "0";
    } else {
      this.waveform.style.position = "relative";
      this.waveform.style.opacity = "1";
    }
    
    this.musicPanel.style.borderWidth = '1px';
    this.musicPanel.style.height = Constants.musicPanelHeight + Constants.unitScreen;
  }

  collapseMusicPanel() {
    this.getElements();
    this.musicPanel.style.height = Constants.musicPanelHeight + Constants.unitScreen;
  }

  expandMusicPanel() {
    this.getElements();
    this.musicPanel.style.height = Constants.expandMusicPanelHeight + Constants.unitScreen;
  }

  /**
   * Adjust music panel width according to the breakpoint
   * If breakpoint is lg+, make music panel full width
   * If breakpoint is lg-, make music panel collapsed
   */
  setMusicPanel_FullWidth() {
    this.getElements();
    this.musicPanel.style.width = '100%';
  }

  setMusicPanel_CollapsedWidth() {
    this.getElements();
    this.musicPanel.style.width = "calc(100% - " + Constants.collapseSideBarWidth + Constants.unitScreen + ")";
  }

  setMusicPanel_ExpandedWidth() {
    this.getElements();
    this.musicPanel.style.width = "calc(100% - " + Constants.expandSideBarWidth + Constants.unitScreen + ")";
  }

/**
 * set and get playlists
 * set and get current playlist
 */
  setPlayList(val) {
    this.playList.next(val);
  }

  getPlayList() {
    return this.playList.asObservable();
  }

  setCurrentPlayingSongInfo(val) {
    this.curPlayingSongInfo.next(val);
  }

  getCurrentPlayingSongInfo() {
    return this.curPlayingSongInfo.asObservable();
  }

}
