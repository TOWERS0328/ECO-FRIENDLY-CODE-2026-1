import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reward, CreateRewardDTO, UpdateRewardDTO } from '../../../core/models/adminReward.model';

@Component({
  selector: 'app-reward-modal',
  templateUrl: './reward-modal.component.html',
  styleUrls: ['./reward-modal.component.scss'],
  standalone: false
})
export class RewardModalComponent implements OnInit {
  @Input() reward?: Reward;
  @Input() mode: 'create' | 'edit' = 'create';

  form: FormGroup;
  categories: Reward['category'][] = ['Products', 'Coupons', 'Plants', 'Discounts'];
  icons = [
    { name: 'water-outline', label: 'Water' },
    { name: 'bag-outline', label: 'Bag' },
    { name: 'restaurant-outline', label: 'Food' },
    { name: 'ticket-outline', label: 'Ticket' },
    { name: 'leaf-outline', label: 'Leaf' },
    { name: 'gift-outline', label: 'Gift' }
  ];
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      points: [100, [Validators.required, Validators.min(1), Validators.max(10000)]],
      stock: [10, [Validators.required, Validators.min(0), Validators.max(10000)]],
      category: ['Products', [Validators.required]],
      status: ['Active', [Validators.required]],
      icon: ['gift-outline']
    });
  }

  ngOnInit() {
    if (this.reward && this.mode === 'edit') {
      this.form.patchValue({
        name: this.reward.name,
        description: this.reward.description,
        points: this.reward.points,
        stock: this.reward.stock,
        category: this.reward.category,
        status: this.reward.status,
        icon: this.reward.icon || 'gift-outline'
      });

      if (this.reward.imageUrl) {
        this.imagePreview = this.reward.imageUrl;
      }
    }
  }

  get title(): string {
    return this.mode === 'create' ? 'Create New Reward' : 'Edit Reward';
  }

  get buttonText(): string {
    return this.mode === 'create' ? 'Create Reward' : 'Save Changes';
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

    if (this.mode === 'edit' && this.reward) {
      const updateData: UpdateRewardDTO = formData;
      this.modalCtrl.dismiss({ data: updateData, id: this.reward.id }, 'confirm');
    } else {
      const createData: CreateRewardDTO = formData;
      this.modalCtrl.dismiss({ data: createData }, 'confirm');
    }
  }
}
