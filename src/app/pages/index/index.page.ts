import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { JsonService } from 'src/app/service/json';
import { NotificationService } from 'src/app/service/notification';
import { Constants } from 'src/app/constants';
import { MusicService } from 'src/app/service/panels/music';
import { DebugService } from 'src/app/service/debug';
import { ChatPageModule } from '../admin/chat/chat.module';


@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit, AfterViewInit {

  listSongs: any;
  checkPlayList: any = {};
  aryPlayList: any = [];

  currentPlaySongInfo: any;

  constructor(
    private jsonService: JsonService,
    private musicService: MusicService,
    private debugService: DebugService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.getSongsList();
  }

  ngAfterViewInit() {
    this.musicService.getCurrentPlayingSongInfo().subscribe(val => {
      this.currentPlaySongInfo = val;
    })
  }

  getSongsList() {
    this.jsonService.getSongs().subscribe(res => {
      this.listSongs = res;
    });
  }

  addToPlayList(idx) {
    this.checkPlayList[idx] = this.listSongs[idx];
    this.aryPlayList.push(this.listSongs[idx]);
    this.musicService.setPlayList(this.aryPlayList);
    this.notificationService.showSuccess(Constants.msgAddSongToPlayList);
    this.debugService.info('Song "' + this.listSongs[idx].title + '" was added successfully', Constants.FC_PAGE_PATH + 'index/index.ts', '', 'addToPlayList()');
  }

  removeFromPlayList(id, idx) {
    // if(this.currentPlaySongInfo.id === this.checkPlayList[idx].id) { // True: Now this song is playing
    //   this.notificationService.showError(Constants.msgErrorToRemovePlayList);
    // } else { //
      this.debugService.info('Song "' + this.checkPlayList[idx].title + '" was removed successfully', Constants.FC_PAGE_PATH + 'index/index.ts', '', 'addToPlayList()');
      delete this.checkPlayList[idx];
      for (let i = 0; i < this.aryPlayList.length; i++) {
        if (this.aryPlayList[i].id === id) {
          this.aryPlayList.splice(i, 1);
        }
      }
      if(this.aryPlayList.length == 0) { // initialize musicpanel state
        let wave = document.getElementById('wave');
      }
      this.musicService.setPlayList(this.aryPlayList);
      this.notificationService.showWarning(Constants.msgRemoveSongToPlayList);
    }
  // }
}
