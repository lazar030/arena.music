import { Injectable } from '@angular/core';
import { Constants } from '../../constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuPanel: any;
  menuPanel_mylink: any;
  content: any;

  isMenuPanelHidden: BehaviorSubject<boolean>;
  isMenuPanelExpanded: BehaviorSubject<boolean>;
  isMenuPanelCanExpand: BehaviorSubject<boolean>;

  isClickMenuExpand: BehaviorSubject<boolean>;
  isClickMenuHide: BehaviorSubject<boolean>;

  constructor() {
    this.isMenuPanelHidden = new BehaviorSubject(false);
    this.isMenuPanelExpanded = new BehaviorSubject(true);
    this.isMenuPanelCanExpand = new BehaviorSubject(true);

    this.isClickMenuExpand = new BehaviorSubject(true);
    this.isClickMenuHide = new BehaviorSubject(false);
  }

  getElements() {
    this.menuPanel = document.getElementById('menuPanel');
    this.menuPanel_mylink = document.getElementById('menuPanel_mylink');
    /* Get current content */
    this.content = document.getElementById('rootContent').getElementsByClassName('content');
  }

  setActiveMenuPanel(val) {
    this.isMenuPanelHidden.next(val);
  }

  getActiveMenuPanel() {
    return this.isMenuPanelHidden.asObservable();
  }

  setExpandMenuPanel(val) {
    this.isMenuPanelExpanded.next(val);
  }

  getExpandMenuPanel() {
    return this.isMenuPanelExpanded.asObservable();
  }

  setActiveClickExpandMenuPanel(val) {
    this.isClickMenuExpand.next(val);
  }

  getActiveClickExpandMenuPanel() {
    return this.isClickMenuExpand.asObservable();
  }

  setActiveClickHideMenuPanel(val) {
    this.isClickMenuHide.next(val);
  }
  
  getActiveClickHideMenuPanel() {
    return this.isClickMenuHide.asObservable();
  }

  expandMenuPanel() {
    this.getElements();
    this.menuPanel.style.borderWidth = '1px';
    this.menuPanel.style.width = Constants.expandSideBarWidth + Constants.unitScreen;
  }

  collapseMenuPanel() {
    this.getElements();
    this.menuPanel.style.borderWidth = '1px';
    this.menuPanel.style.width = Constants.collapseSideBarWidth + Constants.unitScreen;
  }

  expandMenuPanelLink() {
    this.getElements();
    this.menuPanel_mylink.style.height = "calc(100% - " + 180 + Constants.unitScreen + ")";
    // Logo Height:           80px; 
    // Hide Button Height:    50px;
    // Theme Button Wrapper:  50px
    // 80 + 50 + 50 = 180
  }

  collapseMenuPanelLink() {
    this.getElements();
    this.menuPanel_mylink.style.height = "calc(100% - " + 260 + Constants.unitScreen + ")";
    // Logo Height:         80px;
    // Music Panel Height:  80px;
    // Hide Button Height:  50px;
    // heme Button Height:  50px;
    // 80 + 80 + 50 + 50 = 260
  }

  expandMenuPanelLink_Mobile_MusicCollapsed() { // Setup Menu Panel My link height when music panel is shown && expanded
    this.getElements();
    this.menuPanel_mylink.style.height = "calc(100% - " + 260 + Constants.unitScreen + ")";
    // Logo Height:         80px;
    // Music Panel Height:  80px;
    // Hide Button Height:  50px;
    // Theme Button Height: 50px;
    // 80 + 80 + 50 + 50 = 260
  }

  collapseMenuPanelLink_Mobile_Expanded() { // // Setup Menu Panel My link height when music panel is shown && collapsed
    this.getElements();
    this.menuPanel_mylink.style.height = "calc(100% - " + 330 + Constants.unitScreen + ")";
    // Logo Height:         80px;
    // Music Panel Height:  80px;
    // Hide Button Height:  50px;
    // Expand Music Panel:  70px;
    // Theme Button Height: 50px;
    // 80 + 80 + 50 + 50 + 50 = 310
  }
  
  hideMenuBar() {
    this.getElements();
    this.menuPanel.style.borderWidth = 0;
    this.menuPanel.style.width = 0;
  }

  showMenuBar() {
    this.getElements();
    this.menuPanel.style.borderWidth = '1px';
    this.menuPanel.style.width = Constants.expandSideBarWidth + Constants.unitScreen;
  }

  setMenuPanelCanExpand(val) {
    this.isMenuPanelCanExpand.next(val);
  }

  getMenuPanelCanExpand() {
    return this.isMenuPanelCanExpand.asObservable();
  }

  addMenuPanelSticky_Expand() {
    this.getElements();
    for(let i = 0; i < this.content.length; i ++) {
      this.content.item(i).classList.add('floatMenuExpand');
    }
  }

  addMenuPanelSticky_Collapse() {
    this.getElements();
    for(let i = 0; i < this.content.length; i ++) {
      this.content.item(i).classList.add('floatMenuCollapse');
    }
  }

  removeMenuPanelSticky() {
    this.getElements();
    for(let i = 0; i < this.content.length; i ++) {
      this.content.item(i).classList.remove('floatMenuExpand');
      this.content.item(i).classList.remove('floatMenuCollapse');
    }
  }
}
