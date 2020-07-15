import { Injectable } from '@angular/core';
import { Constants } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  headerPanel: any;

  constructor() { }

  getElements() {
    this.headerPanel = document.getElementById('header');
  }

  expandHeaderPanel() { // When menu panel is icon-view mode.
    this.getElements();
    this.headerPanel.style.width = "calc(100% - " + Constants.expandSideBarWidth + Constants.unitScreen + ")";
  }

  collapseHeaderPanel() { // When menu panel is full-view mode.
    this.getElements();
    this.headerPanel.style.width = "calc(100% - " + Constants.collapseSideBarWidth + Constants.unitScreen + ")";
  }

  changeHeaderFullWidth() { // When user isn't logged: isAuthenticated = false
    this.getElements();
    this.headerPanel.style.width = '100%';
  }
}
