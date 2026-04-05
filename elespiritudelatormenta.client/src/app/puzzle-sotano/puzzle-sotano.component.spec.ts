import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleSotanoComponent } from './puzzle-sotano.component';

describe('PuzzleSotanoComponent', () => {
  let component: PuzzleSotanoComponent;
  let fixture: ComponentFixture<PuzzleSotanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuzzleSotanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleSotanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
