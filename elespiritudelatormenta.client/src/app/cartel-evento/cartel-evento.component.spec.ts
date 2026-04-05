import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartelEventoComponent } from './cartel-evento.component';

describe('CartelEventoComponent', () => {
  let component: CartelEventoComponent;
  let fixture: ComponentFixture<CartelEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartelEventoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartelEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
