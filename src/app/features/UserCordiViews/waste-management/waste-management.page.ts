import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WasteService } from '../../../core/services/adminWaste.service';
import { Waste } from '../../../core/models/adminWaste.model';
import { WasteModalComponent } from '../../../shared/components/waste-modal/waste-modal.component';

@Component({
  selector: 'app-waste-management',
  templateUrl: './waste-management.page.html',
  styleUrls: ['./waste-management.page.scss'],
  standalone: false
})
export class WasteManagementPage implements OnInit, OnDestroy {

  wastes: Waste[] = [];
  filteredWastes: Waste[] = [];
  loading = true;
  searchTerm = '';

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  private categoryColors: { [key: string]: { bg: string; text: string; avatar: string } } = {
    'Plastic': { bg: '#dbeafe', text: '#1e40af', avatar: '#3b82f6' },
    'Paper': { bg: '#fef3c7', text: '#92400e', avatar: '#f59e0b' },
    'Glass': { bg: '#d1fae5', text: '#065f46', avatar: '#10b981' },
    'Metal': { bg: '#e0e7ff', text: '#3730a3', avatar: '#6366f1' },
    'Organic': { bg: '#dcfce7', text: '#166534', avatar: '#22c55e' },
    'Electronic': { bg: '#f3e8ff', text: '#6b21a8', avatar: '#a855f7' }
  };

  private categoryIcons: { [key: string]: string } = {
    'Plastic': 'cube-outline',
    'Paper': 'newspaper-outline',
    'Glass': 'wine-outline',
    'Metal': 'fitness-outline',
    'Organic': 'leaf-outline',
    'Electronic': 'hardware-chip-outline'
  };

  constructor(
    private wasteService: WasteService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadWastes();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWastes() {
    this.loading = true;
    this.wasteService.getWastes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wastes) => {
          this.wastes = wastes.filter(w => w.status === 'Active');
          this.filteredWastes = [...this.wastes];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading wastes:', err);
          this.loading = false;
          this.showToast('Error loading wastes', 'danger');
        }
      });
  }

  setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      if (!term.trim()) {
        this.filteredWastes = [...this.wastes];
        return;
      }
      const lower = term.toLowerCase();
      this.filteredWastes = this.wastes.filter(w =>
        w.name.toLowerCase().includes(lower) ||
        w.description.toLowerCase().includes(lower) ||
        w.category.toLowerCase().includes(lower)
      );
    });
  }

  onSearch(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value);
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: WasteModalComponent,
      componentProps: { mode: 'create' },
      cssClass: 'waste-modal',
      backdropDismiss: true
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.wasteService.createWaste(data.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showToast('Waste created successfully', 'success');
            this.loadWastes();
          },
          error: () => this.showToast('Error creating waste', 'danger')
        });
    }
  }

  async openEditModal(waste: Waste) {
    const modal = await this.modalCtrl.create({
      component: WasteModalComponent,
      componentProps: { mode: 'edit', waste: waste },
      cssClass: 'waste-modal',
      backdropDismiss: true
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.wasteService.updateWaste(data.id, data.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showToast('Waste updated successfully', 'success');
            this.loadWastes();
          },
          error: () => this.showToast('Error updating waste', 'danger')
        });
    }
  }

  async confirmDelete(waste: Waste) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Waste?',
      message: `Are you sure you want to delete "${waste.name}"? This action cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        { text: 'Delete', role: 'confirm', cssClass: 'danger', handler: () => this.deleteWaste(waste.id) }
      ]
    });
    await alert.present();
  }

  deleteWaste(id: number) {
    this.wasteService.permanentDelete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast('Waste deleted successfully', 'success');
          this.loadWastes();
        },
        error: () => this.showToast('Error deleting waste', 'danger')
      });
  }

  getCategoryColor(category: string): string {
    return this.categoryColors[category]?.avatar || '#6b7280';
  }

  getCategoryBg(category: string): string {
    return this.categoryColors[category]?.bg || '#f3f4f6';
  }

  getCategoryTextColor(category: string): string {
    return this.categoryColors[category]?.text || '#374151';
  }

  getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || 'cube-outline';
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [{ icon: 'close-outline', role: 'cancel' }]
    });
    await toast.present();
  }
}
