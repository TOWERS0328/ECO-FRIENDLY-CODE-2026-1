import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, delay, catchError, tap } from 'rxjs/operators';
import { Waste, CreateWasteDTO, UpdateWasteDTO } from '../models/adminWaste.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WasteService {

  private readonly apiUrl = `${environment.apiUrl}/waste`;

  private wastesSubject = new BehaviorSubject<Waste[]>([]);
  public wastes$ = this.wastesSubject.asObservable();

  private mockWastes: Waste[] = [
    {
      id: 1,
      name: 'PET Plastic',
      description: 'Beverage bottles',
      category: 'Plastic',
      pointsPerKg: 10,
      status: 'Active',
      imageUrl: 'assets/images/pet.jpg'
    },
    {
      id: 2,
      name: 'HDPE Plastic',
      description: 'Cleaning containers',
      category: 'Plastic',
      pointsPerKg: 8,
      status: 'Active',
      imageUrl: 'assets/images/hdpe.jpg'
    },
    {
      id: 3,
      name: 'White Paper',
      description: 'Printer sheets',
      category: 'Paper',
      pointsPerKg: 5,
      status: 'Active',
      imageUrl: 'assets/images/paper.jpg'
    },
    {
      id: 4,
      name: 'Cardboard',
      description: 'Boxes and packaging',
      category: 'Paper',
      pointsPerKg: 4,
      status: 'Active',
      imageUrl: 'assets/images/cardboard.jpg'
    },
    {
      id: 5,
      name: 'Clear Glass',
      description: 'Glass bottles',
      category: 'Glass',
      pointsPerKg: 6,
      status: 'Active',
      imageUrl: 'assets/images/glass.jpg'
    },
    {
      id: 6,
      name: 'Aluminum Cans',
      description: 'Beverage cans',
      category: 'Metal',
      pointsPerKg: 15,
      status: 'Active',
      imageUrl: 'assets/images/aluminum.jpg'
    }
  ];

  constructor(private http: HttpClient) {
    this.wastesSubject.next([...this.mockWastes]);
  }

  // ==================== API METHODS (Ready for real backend) ====================

  getWastesFromApi(): Observable<Waste[]> {
    return this.http.get<Waste[]>(this.apiUrl).pipe(
      tap(wastes => this.wastesSubject.next(wastes)),
      catchError(this.handleError)
    );
  }

  getWasteByIdFromApi(id: number): Observable<Waste> {
    return this.http.get<Waste>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createWasteApi(dto: CreateWasteDTO): Observable<Waste> {
    return this.http.post<Waste>(this.apiUrl, dto).pipe(
      tap(newWaste => {
        const current = this.wastesSubject.value;
        this.wastesSubject.next([...current, newWaste]);
      }),
      catchError(this.handleError)
    );
  }

  updateWasteApi(id: number, dto: UpdateWasteDTO): Observable<Waste> {
    return this.http.put<Waste>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(updatedWaste => {
        const current = this.wastesSubject.value;
        const index = current.findIndex(w => w.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedWaste;
          this.wastesSubject.next(updated);
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteWasteApi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.wastesSubject.value;
        this.wastesSubject.next(current.filter(w => w.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  deactivateWasteApi(id: number): Observable<Waste> {
    return this.http.patch<Waste>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== MOCK METHODS (For development only) ====================

  getWastes(): Observable<Waste[]> {
    return this.wastes$.pipe(delay(300));
  }

  getWasteById(id: number): Observable<Waste | undefined> {
    return this.wastes$.pipe(
      map(wastes => wastes.find(w => w.id === id))
    );
  }

  createWaste(dto: CreateWasteDTO): Observable<Waste> {
    const newWaste: Waste = {
      id: this.generateId(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const current = this.wastesSubject.value;
    this.wastesSubject.next([...current, newWaste]);
    return of(newWaste).pipe(delay(300));
  }

  updateWaste(id: number, dto: UpdateWasteDTO): Observable<Waste> {
    const current = this.wastesSubject.value;
    const index = current.findIndex(w => w.id === id);
    if (index === -1) {
      return throwError(() => new Error('Waste not found'));
    }
    const updated: Waste = {
      ...current[index],
      ...dto,
      id,
      updatedAt: new Date()
    };
    const updatedList = [...current];
    updatedList[index] = updated;
    this.wastesSubject.next(updatedList);
    return of(updated).pipe(delay(300));
  }

  deleteWaste(id: number): Observable<boolean> {
    return this.updateWaste(id, { status: 'Inactive' }).pipe(
      map(() => true)
    );
  }

  permanentDelete(id: number): Observable<boolean> {
    const current = this.wastesSubject.value;
    this.wastesSubject.next(current.filter(w => w.id !== id));
    return of(true).pipe(delay(300));
  }

  filterWastes(term: string): Observable<Waste[]> {
    return this.wastes$.pipe(
      map(wastes =>
        wastes.filter(w =>
          w.name.toLowerCase().includes(term.toLowerCase()) ||
          w.description.toLowerCase().includes(term.toLowerCase()) ||
          w.category.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  private generateId(): number {
    const current = this.wastesSubject.value;
    return current.length > 0 ? Math.max(...current.map(w => w.id)) + 1 : 1;
  }

  private handleError(error: any) {
    console.error('WasteService error:', error);
    return throwError(() => error);
  }
}
