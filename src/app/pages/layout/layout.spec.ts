import { ComponentFixture, TestBed } from '@angular/core/testing';

import { layout } from './layout';

describe('layout', () => {
  let component: layout;
  let fixture: ComponentFixture<layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [layout],
    }).compileComponents();

    fixture = TestBed.createComponent(layout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
