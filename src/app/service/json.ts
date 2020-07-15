import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableLike } from 'rxjs';

import { Metadata } from '../models/metadata';
export interface Avatar {
  id: number,
  avatar: string,
  name: string
}

export interface Song {
  id: number,
  src: string,
  artist: string,
  title: string,
  album: string,
  preload: string,
  date: any
}

@Injectable({
  providedIn: 'root'
})

export class JsonService {

  private dataUrl: string = '../../assets/mockData/avatar/avatar.json';
  private recommendUrl: string = '../../assets/mockData/avatar/avatar-recommend.json';
  private songUrl: string = '../../assets/mockData/songs/songs.json';

  constructor(
    private http: HttpClient
  ) { }

  getData(): Observable<Avatar[]> {
    return this.http.get<Avatar[]>(this.dataUrl);
  }

  getRecommended(): Observable<Avatar[]> {
    return this.http.get<Avatar[]>(this.recommendUrl);
  }

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.songUrl);
  }

}
