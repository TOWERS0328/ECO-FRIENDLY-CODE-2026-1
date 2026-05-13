import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';
import { RecyclingRequest, ValidateRequestDTO } from '../models/adminRecycling-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecyclingValidationService {

  private readonly apiUrl = `${environment.apiUrl}/recycling-requests`;

  private requestsSubject = new BehaviorSubject<RecyclingRequest[]>([]);
  public requests$ = this.requestsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==================== API METHODS ====================

  getRequestsFromApi(): Observable<RecyclingRequest[]> {
    return this.http.get<RecyclingRequest[]>(this.apiUrl).pipe(
      tap(requests => this.requestsSubject.next(requests)),
      catchError(this.handleError)
    );
  }

  getRequestsByStatusFromApi(status: string): Observable<RecyclingRequest[]> {
    const params = status === 'All' ? {} : { params: { status } };
    return this.http.get<RecyclingRequest[]>(this.apiUrl, params).pipe(
      catchError(this.handleError)
    );
  }

  getCountsFromApi(): Observable<{ pending: number; approved: number; rejected: number; all: number }> {
    return this.http.get<{ pending: number; approved: number; rejected: number; all: number }>(`${this.apiUrl}/counts`).pipe(
      catchError(this.handleError)
    );
  }

  validateRequestApi(id: number, dto: ValidateRequestDTO): Observable<RecyclingRequest> {
    return this.http.patch<RecyclingRequest>(`${this.apiUrl}/${id}/validate`, dto).pipe(
      tap(updatedRequest => {
        const current = this.requestsSubject.value;
        const index = current.findIndex(r => r.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedRequest;
          this.requestsSubject.next(updated);
        }
      }),
      catchError(this.handleError)
    );
  }

  // ==================== MOCK METHODS ====================

  getRequests(): Observable<RecyclingRequest[]> {
    return this.requests$.pipe(delay(300));
  }

  getRequestsByStatus(status: string): Observable<RecyclingRequest[]> {
    return this.requests$.pipe(
      map(requests =>
        status === 'All'
          ? requests
          : requests.filter(r => r.status === status)
      )
    );
  }

  getCounts(): Observable<{ pending: number; approved: number; rejected: number; all: number }> {
    return this.requests$.pipe(
      map(requests => ({
        pending: requests.filter(r => r.status === 'Pending').length,
        approved: requests.filter(r => r.status === 'Approved').length,
        rejected: requests.filter(r => r.status === 'Rejected').length,
        all: requests.length
      }))
    );
  }

  validateRequest(id: number, dto: ValidateRequestDTO): Observable<RecyclingRequest> {
    const current = this.requestsSubject.value;
    const index = current.findIndex(r => r.id === id);

    if (index === -1) {
      return throwError(() => new Error('Request not found'));
    }

    const updated: RecyclingRequest = {
      ...current[index],
      status: dto.status
    };

    const updatedList = [...current];
    updatedList[index] = updated;
    this.requestsSubject.next(updatedList);

    return of(updated).pipe(delay(300));
  }

  private handleError(error: any) {
    console.error('RecyclingValidationService error:', error);
    return throwError(() => error);
  }
}
