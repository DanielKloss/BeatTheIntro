import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyPage } from './spotify.page';

describe('SpotifyPage', () => {
  let component: SpotifyPage;
  let fixture: ComponentFixture<SpotifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotifyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
