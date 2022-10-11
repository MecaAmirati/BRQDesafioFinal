import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosReservarDialogComponent } from './carros-reservar-dialog.component';

describe('CarrosReservarDialogComponent', () => {
  let component: CarrosReservarDialogComponent;
  let fixture: ComponentFixture<CarrosReservarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrosReservarDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrosReservarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
