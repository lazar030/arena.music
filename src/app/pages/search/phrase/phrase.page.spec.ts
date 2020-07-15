import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhrasePage } from './phrase.page';

describe('PhrasePage', () => {
  let component: PhrasePage;
  let fixture: ComponentFixture<PhrasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhrasePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhrasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
