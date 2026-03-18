import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavaderoComponent } from './lavadero.component';

describe('LavaderoComponent', () => {
  let component: LavaderoComponent;
  let fixture: ComponentFixture<LavaderoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LavaderoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LavaderoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
