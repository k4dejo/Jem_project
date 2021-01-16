import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingreportsComponent } from './sellingreports.component';

describe('SellingreportsComponent', () => {
  let component: SellingreportsComponent;
  let fixture: ComponentFixture<SellingreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
