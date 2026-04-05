import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscapeFinalComponent } from './escape-final.component';

describe('EscapeFinalComponent', () => {
  let component: EscapeFinalComponent;
  let fixture: ComponentFixture<EscapeFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EscapeFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscapeFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
