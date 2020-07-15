import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Constants } from 'src/app/constants';
import { DebugService } from 'src/app/service/debug';
import { PanelService } from 'src/app/service/panels/panel';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.html',
  styleUrls: ['./debug.scss'],
})
export class DebugComponent implements OnInit, AfterViewInit {

  debugDatas: any[];
  debugFilters: any[];

  debugActive = false;
  breakpoint: string;
  resolutionWid: string;
  resolutionHei: string;

  inBounds = true;
  edge = {
    top: false,
    bottom: true,
    left: true,
    right: true
  };

  myBounds: any;
  debugPanel: any;

  verbosity: string = 'all';
  filterString: string = '';

  expanded: any = [];

  constructor(
    private panelService: PanelService,
    private debugService: DebugService
  ) {
    this.panelService.getActiveBreakpoint().subscribe(res => {
      this.breakpoint = res;
    });
    this.panelService.getActiveResolution().subscribe(res => {
      this.resolutionWid = res.split('*')[0];
      this.resolutionHei = res.split('*')[1];
    })
  }

  ngOnInit() {
    this.watchDebugActive();
  }

  ngAfterViewInit() {
    this.myBounds = document.getElementById('myBounds');
    this.myBounds.style.height = window.innerHeight + Constants.unitScreen;
    this.watchDebugDatas();
  }

  watchDebugActive() {
    this.debugService.getDebugActive().subscribe(res => {
      this.debugActive = res;
    })
  }

  watchDebugDatas() {
    this.debugService.outputDebug().subscribe(res => {
      this.debugDatas = res;
      this.changeVerbosity();
      if(this.debugActive) {
        setTimeout(() => {
          this.debugPanel = document.getElementById('debugPanel');
          this.debugPanel.scrollTop = this.debugPanel.scrollHeight;
        }, 0);
      }
    })
  }

  closeDebugWindow() {
    this.debugService.setDebugActive(false);
    this.changeVerbosity();
  }

  checkEdge(event) {
    this.edge = event;
  }

  changeVerbosity() {
    if(this.verbosity === 'all') { this.debugFilters = this.debugDatas; }
    else { this.debugFilters = this.debugDatas.filter(debug => debug.verbosity === this.verbosity); }
    
    this.expanded = [];
    for (let i = 0; i < this.debugFilters.length; i++) {
      this.expanded.push(false);
    }
  }

  filterDebugs(keyCode) {
    if(keyCode.key === 'Backspace') {
      this.filterString = this.filterString.substring(0, this.filterString.length - 1);
    } else {
      this.filterString = this.filterString + keyCode.key;
    }
    let self = this;
    this.debugFilters = this.debugDatas.filter(function(item) {
      if(item.message.includes(self.filterString) || item.generated.origin.includes(self.filterString)) {
        return true;
      }
      return false;
    });
  }

  expandObjectPane(idx) {
    const obj = JSON.stringify(this.debugFilters[idx].object, null, '\t');
    this.expanded[idx] = true;
    let pre = document.getElementById('pre' + idx);
    pre.innerHTML = obj;
    pre.style.height = '100%';
  }

  collapseObjectPane(idx) {
    this.expanded[idx] = false;
    let pre = document.getElementById('pre' + idx);
    pre.innerHTML = "";
    pre.style.height = '0px';
  }

  clearDebug() {
    this.debugService.clear();
  }

}
