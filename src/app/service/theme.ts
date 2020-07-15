import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private theme: BehaviorSubject<string>;
  private platform: BehaviorSubject<string>;

  constructor(
  ) {
    this.theme = new BehaviorSubject(Constants.duskTheme);
  }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }
  
}