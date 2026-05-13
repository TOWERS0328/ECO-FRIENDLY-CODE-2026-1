import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { Student, StudentStats } from '../../../core/models/adminStudent.model';
import { StudentsService } from '../../../core/services/adminStudents.service';
import { StudentModalComponent } from '../../../shared/components/student-modal/student-modal.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss'],
  standalone: false
})
export class StudentsPage implements OnInit, OnDestroy {

  students: Student[] = [];
  stats!: StudentStats;
  isLoading = false;
  searchCtrl = new FormControl('');

  private destroy$ = new Subject<void>();

  constructor(
    private studentsService: StudentsService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.loadStats();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Load ───────────────────────────────────────────────────────────────────

  private loadStudents(): void {
    this.isLoading = true;
    this.studentsService.getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.students = data;
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
  }

  private loadStats(): void {
    this.studentsService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats = stats);
  }

  // ─── Search ─────────────────────────────────────────────────────────────────

  private setupSearch(): void {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        term && term.trim().length > 0
          ? this.studentsService.filterStudents(term.trim())
          : this.studentsService.getStudents()
      ),
      takeUntil(this.destroy$)
    ).subscribe(data => this.students = data);
  }

  onSearchChange(event: CustomEvent): void {
    this.searchCtrl.setValue((event.detail.value as string) ?? '');
  }

  clearSearch(): void {
    this.searchCtrl.setValue('');
  }

  // ─── Modals ─────────────────────────────────────────────────────────────────

  async openDetail(student: Student): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: StudentModalComponent,
      componentProps: { student, mode: 'detail' },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      await this.handleModalAction(data);
    }
  }

  async openCreate(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: StudentModalComponent,
      componentProps: { mode: 'create' },
      breakpoints: [0, 0.9, 1],
      initialBreakpoint: 0.9
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data?.data) {
      const loading = await this.showLoading('Creating student...');
      this.studentsService.createStudent(data.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async () => {
            await loading.dismiss();
            this.showToast('Student created successfully', 'success');
          },
          error: async () => {
            await loading.dismiss();
            this.showToast('Error creating student', 'danger');
          }
        });
    }
  }

  // ─── Modal action handler ───────────────────────────────────────────────────

  private async handleModalAction(data: any): Promise<void> {
    // Edit
    if (data.id && data.data) {
      const loading = await this.showLoading('Saving changes...');
      this.studentsService.updateStudent(data.id, data.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async () => {
            await loading.dismiss();
            this.showToast('Student updated successfully', 'success');
          },
          error: async () => {
            await loading.dismiss();
            this.showToast('Error updating student', 'danger');
          }
        });
      return;
    }

    // Change status
    if (data.action === 'changeStatus') {
      const loading = await this.showLoading('Updating status...');
      this.studentsService.changeStatus(data.id, data.status)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async () => {
            await loading.dismiss();
            const msg = data.status === 'Active' ? 'Student enabled' : 'Student disabled';
            this.showToast(msg, 'warning');
          },
          error: async () => {
            await loading.dismiss();
            this.showToast('Error updating status', 'danger');
          }
        });
      return;
    }

    // Delete
    if (data.action === 'delete') {
      const loading = await this.showLoading('Deleting student...');
      this.studentsService.deleteStudent(data.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async () => {
            await loading.dismiss();
            this.showToast('Student deleted', 'danger');
          },
          error: async () => {
            await loading.dismiss();
            this.showToast('Error deleting student', 'danger');
          }
        });
      return;
    }
  }

  // ─── Direct delete from table ───────────────────────────────────────────────

  async confirmDelete(student: Student, event: Event): Promise<void> {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Delete Student',
      message: `Delete <strong>${student.firstName} ${student.lastName}</strong>?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.studentsService.deleteStudent(student.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => this.showToast('Student deleted', 'danger'));
          }
        }
      ]
    });
    await alert.present();
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({ message, spinner: 'crescent' });
    await loading.present();
    return loading;
  }

  private async showToast(message: string, color: string): Promise<void> {
    const iconMap: Record<string, string> = {
      success: 'checkmark-circle',
      danger: 'trash',
      warning: 'alert-circle'
    };
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
      icon: iconMap[color] ?? 'information-circle'
    });
    await toast.present();
  }

  trackById(_index: number, student: Student): number {
    return student.id;
  }
}
