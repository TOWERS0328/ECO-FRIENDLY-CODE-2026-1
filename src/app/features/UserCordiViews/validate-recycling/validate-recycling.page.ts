import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecyclingValidationService } from '../../../core/services/adminValidate-recycling.service';
import { RecyclingRequest, ValidateRequestDTO } from '../../../core/models/adminRecycling-request.model';

type TabStatus = 'Pending' | 'Approved' | 'Rejected' | 'All';
type CountKey = 'pending' | 'approved' | 'rejected' | 'all';

interface TabConfig {
  label: string;
  status: TabStatus;
  countKey: CountKey;
}

@Component({
  selector: 'app-validate-recycling',
  templateUrl: './validate-recycling.page.html',
  styleUrls: ['./validate-recycling.page.scss'],
  standalone: false
})
export class ValidateRecyclingPage implements OnInit, OnDestroy {

  requests: RecyclingRequest[] = [];
  filteredRequests: RecyclingRequest[] = [];
  loading = true;
  activeTab: TabStatus = 'Pending';

  counts = {
    pending: 0,
    approved: 0,
    rejected: 0,
    all: 0
  };

  tabs: TabConfig[] = [
    { label: 'Pending', status: 'Pending', countKey: 'pending' },
    { label: 'Approved', status: 'Approved', countKey: 'approved' },
    { label: 'Rejected', status: 'Rejected', countKey: 'rejected' },
    { label: 'All', status: 'All', countKey: 'all' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private validationService: RecyclingValidationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadRequests();
    this.loadCounts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRequests() {
    this.loading = true;
    this.validationService.getRequestsByStatus(this.activeTab)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.filteredRequests = requests;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.showToast('Error loading requests', 'danger');
        }
      });
  }

  loadCounts() {
    this.validationService.getCounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (counts) => {
          this.counts = counts;
        }
      });
  }

  changeTab(status: TabStatus) {
    this.activeTab = status;
    this.loadRequests();
  }

  getTabCount(countKey: CountKey): number {
    return this.counts[countKey];
  }

  async approveRequest(request: RecyclingRequest) {
    const alert = await this.alertCtrl.create({
      header: 'Approve Request?',
      message: `Do you confirm you want to approve the request from ${request.student.name}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Approve',
          role: 'confirm',
          handler: () => this.executeValidation(request.id, 'Approved')
        }
      ]
    });
    await alert.present();
  }

  async rejectRequest(request: RecyclingRequest) {
    const alert = await this.alertCtrl.create({
      header: 'Reject Request?',
      message: `Do you confirm you want to reject the request from ${request.student.name}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Reject',
          role: 'confirm',
          cssClass: 'danger',
          handler: () => this.executeValidation(request.id, 'Rejected')
        }
      ]
    });
    await alert.present();
  }

  executeValidation(id: number, status: 'Approved' | 'Rejected') {
    const dto: ValidateRequestDTO = { status };

    this.validationService.validateRequest(id, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast(`Request ${status.toLowerCase()} successfully`, 'success');
          this.loadRequests();
          this.loadCounts();
        },
        error: () => {
          this.showToast('Error processing the request', 'danger');
        }
      });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
