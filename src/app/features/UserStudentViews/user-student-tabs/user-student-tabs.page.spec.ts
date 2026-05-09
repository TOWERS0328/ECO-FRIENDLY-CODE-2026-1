import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserStudentTabsPage } from './user-student-tabs.page';

describe('UserStudentTabsPage', () => {
  let component: UserStudentTabsPage;
  let fixture: ComponentFixture<UserStudentTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStudentTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
