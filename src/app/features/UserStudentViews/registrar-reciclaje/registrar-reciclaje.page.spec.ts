import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarReciclajePage } from './registrar-reciclaje.page';

describe('RegistrarReciclajePage', () => {
  let component: RegistrarReciclajePage;
  let fixture: ComponentFixture<RegistrarReciclajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarReciclajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
