import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElEspirituDeLaTormentaComponent } from './el-espiritu-de-la-tormenta.component';

describe('ElEspirituDeLaTormentaComponent', () => {
  let component: ElEspirituDeLaTormentaComponent;
  let fixture: ComponentFixture<ElEspirituDeLaTormentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElEspirituDeLaTormentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElEspirituDeLaTormentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
