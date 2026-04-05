import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuertaGarajeComponent } from './puerta-garaje.component';

describe('PuertaGarajeComponent', () => {
  let component: PuertaGarajeComponent;
  let fixture: ComponentFixture<PuertaGarajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuertaGarajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuertaGarajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
