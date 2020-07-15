import { Injectable } from '@angular/core';
import { Constants } from '../../constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userPanel: any;
  userPanel_mylink: any;

  content: any;

  isUserPanelHidden: BehaviorSubject<boolean>;
  isUserPanelExpanded: BehaviorSubject<boolean>;

  isClickUserExpand: BehaviorSubject<boolean>;
  isClickUserHide: BehaviorSubject<boolean>;

  isUserPanelCanExpand: BehaviorSubject<boolean>;

  constructor() {
    this.isUserPanelHidden = new BehaviorSubject(true);
    this.isUserPanelExpanded = new BehaviorSubject(true);
    this.isUserPanelCanExpand = new BehaviorSubject(true);
    this.isClickUserExpand = new BehaviorSubject(true);
    this.isClickUserHide = new BehaviorSubject(false);
  }

  getElements() {
    this.userPanel = document.getElementById('userPanel');
    this.userPanel_mylink = document.getElementById('userPanel_mylink');
    /* Get child elements */
    this.content = document.getElementById('rootContent').getElementsByClassName('content');
  }

  setActiveUserPanel(val) {
    this.isUserPanelHidden.next(val);
  }

  getActiveUserPanel() {
    return this.isUserPanelHidden.asObservable();
  }

  setExpandUserPanel(val) {
    this.isUserPanelExpanded.next(val);
  }

  getExpandUserPanel() {
    return this.isUserPanelExpanded.asObservable();
  }

  expandUserPanel() {
    this.getElements();
    this.userPanel.style.borderWidth = '1px';
    this.userPanel.style.width = Constants.expandSideBarWidth + Constants.unitScreen;
  }

  collapseUserPanel(){
    this.getElements();
    this.userPanel.style.borderWidth = '1px';
    this.userPanel.style.width = Constants.collapseSideBarWidth + Constants.unitScreen; 
  }

  expandUserPanelLink() {
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 210 + Constants.unitScreen + ")";
    // Header:              80px
    // UserInfoHeight:      80px;
    // HideButtonWrapper:   50px;
    // DebugWrapperHeight:  50px; - no
    // 80 + 80 + 50 = 210
  }

  collapseUserPanelLink() {
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 290 + Constants.unitScreen + ")";
    // Header:              80px
    // Music Panel:         80px;
    // UserInfoHeight:      80px;
    // HideButtonWrapper:   50px;
    // DebugWrapperHeight:  50px; - no
    // 80 + 80 + 80 + 50 = 290
  }

  expandUserPanelLink_OnMobile() {
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 130 + Constants.unitScreen + ")";
    // UserInfoHeight:      80px;
    // HideButtonWrapper:   50px;
    // DebugWrapperHeight:  50px; - no
    // 80 + 50 = 130
  }

  collapseUserPanelLink_OnMobile() {
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 210 + Constants.unitScreen + ")";
    // Music Panel:       80px;
    // UserInfoHeight:    80px;
    // HideButtonWrapper: 50px;
    // DebugWrapper:      50px; - no
    // 80 + 80 + 50 = 210;
  }

  expandUserPanelLink_SM() {
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 290 + Constants.unitScreen + ")";
    // HeaderPanel:       80px;
    // UserInfoHeight:    80px; 
    // HideButtonWrapper: 50px; 
    // DebugWrapper:      50px; - no
    // Music Panel:       80px;
    // 80 + 80 + 50 + 80 = 290;
  }

  collapseUserPanelLink_SM() {
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 360 + Constants.unitScreen + ")";
    // HeaderPanel:       80px;
    // UserInfoHeight:    80px; 
    // HideButtonWrapper: 50px; 
    // DebugWrapper:      50px;
    // Music Panel:       80px; - no
    // Expand MusicPanel: 70px
    // 80 + 80 + 50 + 80 + 70 = 360;
  }

  expandUserPanelLink_OnMobile_Collapse() { // When music panel is collapsed on vs mode
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 210 + Constants.unitScreen + ")";
    // Music Panel:       80px;
    // UserInfoHeight:    80px;
    // HideButtonWrapper: 50px;
    // DebugWrapper:      50px; - no
    // 80 + 80 + 50 = 210;
  }

  collapseUserPanelLink_OnMobile_Expand() { // When music panel is expanded on vs mode
    this.getElements();
    this.userPanel_mylink.style.height = "calc(100vh - " + 280 + Constants.unitScreen + ")";
    // Music Panel:       80px;
    // ExpandedWaveForm:  70px;
    // UserInfoHeight:    80px;
    // HideButtonWrapper: 50px;
    // DebugWrapper:      50px; - no
    // 80 + 80 + 50 + 70 = 310;
  }

  hideUserPanel() {
    this.getElements();
    this.userPanel.style.borderWidth = 0;
    this.userPanel.style.width = 0;
  }

  showUserPanel() {
    this.getElements();
    this.userPanel.style.borderWidth = '1px';
    this.userPanel.style.width = Constants.expandSideBarWidth + Constants.unitScreen;
  }

  setUserPanelCanExpand(val) {
    this.isUserPanelCanExpand.next(val);
  }

  getUserPanelCanExpand() {
    return this.isUserPanelCanExpand.asObservable();
  }

  /**
   * For state for click expand button or hide button
   */


  setActiveClickExpandUserPanel(val) {
    this.isClickUserExpand.next(val);
  }

  getActiveClickExpandUserPanel() {
    return this.isClickUserExpand.asObservable();
  }
  
  setActiveClickHideUserPanel(val) {
    this.isClickUserHide.next(val);
  }
  
  getActiveClickHideUserPanel() {
    return this.isClickUserHide.asObservable();
  }

  /**
   * Add float and sticky 
   */

  addUserPanelSticky_Expand() {
    this.getElements();
    for(let i = 0; i < this.content.length; i ++) {
      this.content.item(i).classList.add('floatUserExpand');
    }
  }

  addUserPanelSticky_Collapse() {
    this.getElements();
    for(let i = 0; i < this.content.length; i ++) {
      this.content.item(i).classList.add('floatUserCollapse');
    }
  }

  removeUserPanelSticky() {
    this.getElements();
    for(let i = 0; i < this.content.length; i ++) {
      this.content.item(i).classList.remove('floatUserExpand');
      this.content.item(i).classList.remove('floatUserCollapse');
    }
  }
}
