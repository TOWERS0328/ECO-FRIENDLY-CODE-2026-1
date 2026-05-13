import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student, CreateStudentDTO, UpdateStudentDTO } from '../../../core/models/adminStudent.model';

@Component({
  selector: 'app-student-modal',
  templateUrl: './student-modal.component.html',
  styleUrls: ['./student-modal.component.scss'],
  standalone: false
})
export class StudentModalComponent implements OnInit {

  @Input() student?: Student;
  @Input() mode: 'create' | 'edit' | 'detail' = 'detail';

  form: FormGroup;

  majors = [
    'Environmental Engineering',
    'Systems Engineering',
    'Biology',
    'Chemistry',
    'Graphic Design',
    'Business Administration',
    'Medicine',
    'Law'
  ];

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      email:     ['', [Validators.required, Validators.email]],
      code:      ['', [Validators.required]],
      phone:     [''],
      major:     [''],
      semester:  [1, [Validators.min(1), Validators.max(12)]],
      status:    ['Active']
    });
  }

  ngOnInit(): void {
    if (this.student && (this.mode === 'edit' || this.mode === 'detail')) {
      this.form.patchValue({
        firstName: this.student.firstName,
        lastName:  this.student.lastName,
        email:     this.student.email,
        code:      this.student.code,
        phone:     this.student.phone,
        major:     this.student.major,
        semester:  this.student.semester,
        status:    this.student.status
      });

      if (this.mode === 'detail') {
        this.form.disable();
      }
    }
  }

  // ─── Getters ────────────────────────────────────────────────────────────────

  get title(): string {
    const titles: Record<typeof this.mode, string> = {
      create: 'New Student',
      edit:   'Edit Student',
      detail: 'Student Details'
    };
    return titles[this.mode];
  }

  get submitLabel(): string {
    return this.mode === 'create' ? 'Create Student' : 'Save Changes';
  }

  get isDetail(): boolean {
    return this.mode === 'detail';
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  /** Switch detail → edit in-place */
  openEdit(): void {
    this.mode = 'edit';
    this.form.enable();
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    if (this.mode === 'edit' && this.student) {
      const payload: UpdateStudentDTO = formData;
      this.modalCtrl.dismiss({ data: payload, id: this.student.id }, 'confirm');
    } else if (this.mode === 'create') {
      const payload: CreateStudentDTO = formData;
      this.modalCtrl.dismiss({ data: payload }, 'confirm');
    }
  }

  toggleStatus(): void {
    if (this.student) {
      const newStatus: 'Active' | 'Inactive' =
        this.student.status === 'Active' ? 'Inactive' : 'Active';
      this.modalCtrl.dismiss({
        action: 'changeStatus',
        id: this.student.id,
        status: newStatus
      }, 'confirm');
    }
  }

  async delete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete Student',
      message: `Are you sure you want to delete <strong>${this.student?.firstName} ${this.student?.lastName}</strong>? This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: 'alert-danger',
          handler: () => {
            this.modalCtrl.dismiss({ action: 'delete', id: this.student!.id }, 'confirm');
          }
        }
      ]
    });
    await alert.present();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
