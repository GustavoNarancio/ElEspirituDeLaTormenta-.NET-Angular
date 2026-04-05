import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatacumbasComponent } from './catacumbas.component';

describe('CatacumbasComponent', () => {
  let component: CatacumbasComponent;
  let fixture: ComponentFixture<CatacumbasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CatacumbasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatacumbasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
