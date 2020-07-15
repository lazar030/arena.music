import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LyricsPage } from './lyrics.page';

describe('LyricsPage', () => {
  let component: LyricsPage;
  let fixture: ComponentFixture<LyricsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LyricsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LyricsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
