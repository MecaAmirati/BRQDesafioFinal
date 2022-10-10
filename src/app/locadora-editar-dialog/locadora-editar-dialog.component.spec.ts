import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocadoraEditarDialogComponent } from './locadora-editar-dialog.component';

describe('LocadoraEditarDialogComponent', () => {
  let component: LocadoraEditarDialogComponent;
  let fixture: ComponentFixture<LocadoraEditarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocadoraEditarDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocadoraEditarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
