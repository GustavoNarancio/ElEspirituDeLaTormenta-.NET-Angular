import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuertaSotanoComponent } from './puerta-sotano.component';

describe('PuertaSotanoComponent', () => {
  let component: PuertaSotanoComponent;
  let fixture: ComponentFixture<PuertaSotanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuertaSotanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuertaSotanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
