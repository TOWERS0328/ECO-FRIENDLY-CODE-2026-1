import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiHistorialPage } from './mi-historial.page';

describe('MiHistorialPage', () => {
  let component: MiHistorialPage;
  let fixture: ComponentFixture<MiHistorialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiHistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
