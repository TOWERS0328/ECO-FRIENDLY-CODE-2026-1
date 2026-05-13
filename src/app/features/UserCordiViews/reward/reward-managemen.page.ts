import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RewardService } from '../../../core/services/adminRewards.service';
import { Reward } from '../../../core/models/adminReward.model';
import { RewardModalComponent } from '../../../shared/components/reward-modal/reward-modal.component';

@Component({
  selector: 'app-reward-management',
  templateUrl: './reward-managemen.page.html',
  styleUrls: ['./reward-managemen.page.scss'],
  standalone: false
})
export class RewardManagementPage implements OnInit, OnDestroy {

  rewards: Reward[] = [];
  filteredRewards: Reward[] = [];
  loading = true;
  searchTerm = '';

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private rewardService: RewardService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadRewards();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRewards() {
    this.loading = true;
    this.rewardService.getRewards()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rewards) => {
          this.rewards = rewards;
          this.filteredRewards = rewards;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.showToast('Error loading rewards', 'danger');
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
        this.filteredRewards = [...this.rewards];
        return;
      }
      this.rewardService.filterRewards(term)
        .pipe(takeUntil(this.destroy$))
        .subscribe(rewards => {
          this.filteredRewards = rewards;
        });
    });
  }

  onSearch(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value);
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: RewardModalComponent,
      componentProps: { mode: 'create' },
      cssClass: 'reward-modal',
      backdropDismiss: true
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.rewardService.createReward(data.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showToast('Reward created successfully', 'success');
            this.loadRewards();
          },
          error: () => {
            this.showToast('Error creating reward', 'danger');
          }
        });
    }
  }

  async openEditModal(reward: Reward) {
    const modal = await this.modalCtrl.create({
      component: RewardModalComponent,
      componentProps: { mode: 'edit', reward },
      cssClass: 'reward-modal',
      backdropDismiss: true
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      this.rewardService.updateReward(data.id, data.data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showToast('Reward updated successfully', 'success');
            this.loadRewards();
          },
          error: () => {
            this.showToast('Error updating reward', 'danger');
          }
        });
    }
  }

  async confirmDelete(reward: Reward) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Reward?',
      message: `Are you sure you want to delete "${reward.name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'danger',
          handler: () => this.deleteReward(reward.id)
        }
      ]
    });
    await alert.present();
  }

  deleteReward(id: number) {
    this.rewardService.deleteReward(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast('Reward deleted successfully', 'success');
          this.loadRewards();
        },
        error: () => {
          this.showToast('Error deleting reward', 'danger');
        }
      });
  }

  getStatusColor(status: string): { bg: string; text: string } {
    switch (status) {
      case 'Active': return { bg: '#d1fae5', text: '#065f46' };
      case 'Inactive': return { bg: '#fee2e2', text: '#991b1b' };
      case 'OutOfStock': return { bg: '#fef3c7', text: '#92400e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
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
