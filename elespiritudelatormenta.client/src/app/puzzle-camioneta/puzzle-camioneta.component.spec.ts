import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleCamionetaComponent } from './puzzle-camioneta.component';

describe('PuzzleCamionetaComponent', () => {
  let component: PuzzleCamionetaComponent;
  let fixture: ComponentFixture<PuzzleCamionetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuzzleCamionetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleCamionetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
