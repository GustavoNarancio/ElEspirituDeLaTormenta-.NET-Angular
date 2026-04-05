import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleCajaComponent } from './puzzle-caja.component';

describe('PuzzleCajaComponent', () => {
  let component: PuzzleCajaComponent;
  let fixture: ComponentFixture<PuzzleCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuzzleCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
