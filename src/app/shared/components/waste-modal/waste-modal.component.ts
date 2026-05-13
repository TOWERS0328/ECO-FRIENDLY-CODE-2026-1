import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Waste, CreateWasteDTO, UpdateWasteDTO } from '../../../core/models/adminWaste.model';

@Component({
  selector: 'app-waste-modal',
  templateUrl: './waste-modal.component.html',
  styleUrls: ['./waste-modal.component.scss'],
  standalone: false
})
export class WasteModalComponent implements OnInit {
  @Input() waste?: Waste;
  @Input() mode: 'create' | 'edit' = 'create';

  form: FormGroup;
  categories: Waste['category'][] = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronic'];
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['Plastic', [Validators.required]],
      pointsPerKg: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      status: ['Active', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.waste && this.mode === 'edit') {
      this.form.patchValue({
        name: this.waste.name,
        description: this.waste.description,
        category: this.waste.category,
        pointsPerKg: this.waste.pointsPerKg,
        status: this.waste.status
      });
      if (this.waste.imageUrl) {
        this.imagePreview = this.waste.imageUrl;
      }
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Waste' : 'Edit Waste';
  }

  get buttonText(): string {
    return this.mode === 'create' ? 'Create Waste' : 'Save Changes';
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        console.error('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.error('Image size must be less than 5MB');
        return;
      }
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.form.patchValue({ imageUrl: null });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.value;
    if (this.imagePreview && !this.imagePreview.startsWith('assets/')) {
      formData.imageUrl = this.imagePreview;
    }
    if (this.mode === 'edit' && this.waste) {
      const updateData: UpdateWasteDTO = formData;
      this.modalCtrl.dismiss({ data: updateData, id: this.waste.id }, 'confirm');
    } else {
      const createData: CreateWasteDTO = formData;
      this.modalCtrl.dismiss({ data: createData }, 'confirm');
    }
  }
}
