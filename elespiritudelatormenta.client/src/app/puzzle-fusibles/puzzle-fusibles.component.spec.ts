import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleFusiblesComponent } from './puzzle-fusibles.component';

describe('PuzzleFusiblesComponent', () => {
  let component: PuzzleFusiblesComponent;
  let fixture: ComponentFixture<PuzzleFusiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuzzleFusiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleFusiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
