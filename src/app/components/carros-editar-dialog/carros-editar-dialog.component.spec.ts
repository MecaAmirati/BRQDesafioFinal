import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosEditarDialogComponent } from './carros-editar-dialog.component';

describe('CarrosEditarDialogComponent', () => {
  let component: CarrosEditarDialogComponent;
  let fixture: ComponentFixture<CarrosEditarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrosEditarDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrosEditarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
