import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPorMovimientosComponent } from './final-por-movimientos.component';

describe('FinalPorMovimientosComponent', () => {
  let component: FinalPorMovimientosComponent;
  let fixture: ComponentFixture<FinalPorMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalPorMovimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalPorMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
