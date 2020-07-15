import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { History } from 'src/app/models/history';
import { Constants } from '../constants';

import { DebugService } from '../service/debug';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private history: BehaviorSubject<History[]>;

  constructor(
    private titleService: Title,
    private debugService: DebugService
  ) {
    this.history = new BehaviorSubject([]);
  }

  public setHistory(val) {
    this.history.next(val);
  }

  public getHistory() {
    return this.history.asObservable();
  }

  public add(url) {
    const currentValue = this.history.value;
    const date = new Date();
    let data = new History();
    data = {
      title: this.titleService.getTitle(),
      url,
      time: date,
    };
    const updatedValue = [...currentValue, data];
    this.setHistory(updatedValue);

    this.debugService.info(`History`, Constants.FC_SERVICE_PATH + 'history.ts', '', 'add()', this.parseHistoryData());
  }

  public filterDate(curDate: Date) {
    const month = (curDate.getMonth() + 1) < 10 ? '0' + (curDate.getMonth() + 1) : (curDate.getMonth() + 1);
    const date = curDate.getDate() < 10 ? '0' + curDate.getDate() : curDate.getDate();
    const hour = (curDate.getHours() - 1) % 12;
    const min = curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes();
    const halfday = curDate.getHours() <= 12 ? 'AM' : 'PM';

    return `${month}-${date} ${hour}:${min} ${halfday}`;
  }

  public parseHistoryData() {
    const history = this.history.value;
    const parsedData = [];
    history.forEach(item => {
      const date = new Date(item.time);
      parsedData.push(`${this.filterDate(date)}         ${item.title}       ${item.url}`);
    });
    return parsedData;
  }

}
