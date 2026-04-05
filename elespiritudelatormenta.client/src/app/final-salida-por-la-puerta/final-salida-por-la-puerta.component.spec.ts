import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSalidaPorLaPuertaComponent } from './final-salida-por-la-puerta.component';

describe('FinalSalidaPorLaPuertaComponent', () => {
  let component: FinalSalidaPorLaPuertaComponent;
  let fixture: ComponentFixture<FinalSalidaPorLaPuertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinalSalidaPorLaPuertaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalSalidaPorLaPuertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
