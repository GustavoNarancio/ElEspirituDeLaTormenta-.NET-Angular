import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormitorioComponent } from './dormitorio.component';

describe('DormitorioComponent', () => {
  let component: DormitorioComponent;
  let fixture: ComponentFixture<DormitorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DormitorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DormitorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
