import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';
import { Reward, CreateRewardDTO, UpdateRewardDTO } from '../models/adminReward.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  private readonly apiUrl = `${environment.apiUrl}/rewards`;

  private rewardsSubject = new BehaviorSubject<Reward[]>([]);
  public rewards$ = this.rewardsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==================== API METHODS (Ready for real backend) ====================

  getRewardsFromApi(): Observable<Reward[]> {
    return this.http.get<Reward[]>(this.apiUrl).pipe(
      tap(rewards => this.rewardsSubject.next(rewards)),
      catchError(this.handleError)
    );
  }

  getRewardByIdFromApi(id: number): Observable<Reward> {
    return this.http.get<Reward>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createRewardApi(dto: CreateRewardDTO): Observable<Reward> {
    return this.http.post<Reward>(this.apiUrl, dto).pipe(
      tap(newReward => {
        const current = this.rewardsSubject.value;
        this.rewardsSubject.next([...current, newReward]);
      }),
      catchError(this.handleError)
    );
  }

  updateRewardApi(id: number, dto: UpdateRewardDTO): Observable<Reward> {
    return this.http.put<Reward>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(updatedReward => {
        const current = this.rewardsSubject.value;
        const index = current.findIndex(r => r.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedReward;
          this.rewardsSubject.next(updated);
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteRewardApi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.rewardsSubject.value;
        this.rewardsSubject.next(current.filter(r => r.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  updateStockApi(id: number, stock: number): Observable<Reward> {
    return this.http.patch<Reward>(`${this.apiUrl}/${id}/stock`, { stock }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== MOCK METHODS (For development only - NO FAKE DATA) ====================

  getRewards(): Observable<Reward[]> {
    return this.rewards$.pipe(delay(300));
  }

  getRewardById(id: number): Observable<Reward | undefined> {
    return this.rewards$.pipe(
      map(rewards => rewards.find(r => r.id === id))
    );
  }

  createReward(dto: CreateRewardDTO): Observable<Reward> {
    const newReward: Reward = {
      id: this.generateId(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const current = this.rewardsSubject.value;
    this.rewardsSubject.next([...current, newReward]);

    return of(newReward).pipe(delay(300));
  }

  updateReward(id: number, dto: UpdateRewardDTO): Observable<Reward> {
    const current = this.rewardsSubject.value;
    const index = current.findIndex(r => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Reward not found'));
    }

    const updated: Reward = {
      ...current[index],
      ...dto,
      id,
      updatedAt: new Date()
    };

    const updatedList = [...current];
    updatedList[index] = updated;
    this.rewardsSubject.next(updatedList);

    return of(updated).pipe(delay(300));
  }

  deleteReward(id: number): Observable<boolean> {
    const current = this.rewardsSubject.value;
    this.rewardsSubject.next(current.filter(r => r.id !== id));
    return of(true).pipe(delay(300));
  }

  filterRewards(term: string): Observable<Reward[]> {
    return this.rewards$.pipe(
      map(rewards =>
        rewards.filter(r =>
          r.name.toLowerCase().includes(term.toLowerCase()) ||
          r.description.toLowerCase().includes(term.toLowerCase()) ||
          r.category.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  private generateId(): number {
    const current = this.rewardsSubject.value;
    return current.length > 0 ? Math.max(...current.map(r => r.id)) + 1 : 1;
  }

  private handleError(error: any) {
    console.error('RewardService error:', error);
    return throwError(() => error);
  }
}
