import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableLike, BehaviorSubject } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

import { Metadata } from '../models/metadata';
import { Constants } from '../constants';


@Injectable({
  providedIn: 'root'
})

export class MetaService {

  private apiUrl: string = '../../assets/mockData/metadata';
  private metadata: BehaviorSubject<Metadata>;

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
    
  ) { 
    this.metadata = new BehaviorSubject(new Metadata());
  }

  setMetadata(val) {
    this.metadata.next(val);
  }

  getMetadata() {
    return this.metadata.asObservable();
  }

  getMetadataFromUrl(url): Observable<Metadata> {
    return this.http.get<Metadata>(this.apiUrl + url + '.json');
  }

  addMetaTags(url) {
    this.getMetadataFromUrl(url).subscribe(res => {
      let metadata = new Metadata().deserialize(res);
      this.setMetadata(metadata);
      this.titleService.setTitle(metadata.title);
      for (let i = 0; i < metadata.tags.length; i ++) {
        let tag = metadata.tags[i];
        if (tag.type == Constants.metaType.meta)
          this.metaService.addTag({ name: tag.name , content: tag.content });
        else if (tag.type == Constants.metaType.og)
          this.metaService.addTag({ property: tag.property , content: tag.content });
      }
    });
  }

  removeMetaTags() {
    this.titleService.setTitle(Constants.title);
    let metadata;
    this.getMetadata().subscribe(res => {
      metadata = res;
    });
    if (metadata.isEmpty()) return;
    for (let i = 0; i < metadata.tags.length; i ++) {
      let tag = metadata.tags[i];
      if (tag.type == Constants.metaType.meta)
        this.metaService.removeTag(`name = "${tag.name}"`);
      else if (tag.type == Constants.metaType.og)
        this.metaService.removeTag(`property = "${tag.property}"`);
    }
  }
}
