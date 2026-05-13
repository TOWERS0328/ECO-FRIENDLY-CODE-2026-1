import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Student, StudentStats, CreateStudentDTO, UpdateStudentDTO } from '../models/adminStudent.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  // ─── Mock data ─────────────────────────────────────────────────────────────
  // TODO: Remove when real API is connected. Replace methods with HttpClient calls.
  private mockStudents: Student[] = [
    {
      id: 1,
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@universidad.edu',
      code: 'EST-2024-0456',
      phone: '3001234567',
      major: 'Ingeniería Ambiental',
      semester: 5,
      totalPoints: 1250,
      recycledKg: 45.5,
      totalRecyclings: 23,
      status: 'Active',
      registrationDate: '2024-01-14T08:00:00',
      lastActivity: '2026-03-17T10:30:00'
    },
   
  ];

  private studentsSubject = new BehaviorSubject<Student[]>(this.mockStudents);
  public students$ = this.studentsSubject.asObservable();

  constructor() {}

  // ─── Read ───────────────────────────────────────────────────────────────────

  // TODO: Replace with → return this.http.get<Student[]>(`${API_URL}/students`);
  getStudents(): Observable<Student[]> {
    return this.students$.pipe(delay(300));
  }

  // TODO: Replace with → return this.http.get<Student>(`${API_URL}/students/${id}`);
  getStudentById(id: number): Observable<Student | undefined> {
    return this.students$.pipe(
      map(list => list.find(s => s.id === id))
    );
  }

  // TODO: Replace with → return this.http.get<StudentStats>(`${API_URL}/students/stats`);
  getStats(): Observable<StudentStats> {
    return this.students$.pipe(
      map(list => ({
        totalStudents: list.length,
        active: list.filter(s => s.status === 'Active').length,
        inactive: list.filter(s => s.status === 'Inactive').length,
        totalPoints: list.reduce((sum, s) => sum + s.totalPoints, 0),
        totalKg: list.reduce((sum, s) => sum + s.recycledKg, 0)
      }))
    );
  }

  // TODO: Replace with → return this.http.get<Student[]>(`${API_URL}/students?search=${term}`);
  filterStudents(term: string): Observable<Student[]> {
    const lower = term.toLowerCase();
    return this.students$.pipe(
      map(list => list.filter(s =>
        s.firstName.toLowerCase().includes(lower) ||
        s.lastName.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower) ||
        s.code.toLowerCase().includes(lower)
      ))
    );
  }

  // ─── Write ──────────────────────────────────────────────────────────────────

  // TODO: Replace with → return this.http.post<Student>(`${API_URL}/students`, dto);
  createStudent(dto: CreateStudentDTO): Observable<Student> {
    const newStudent: Student = {
      id: this.generateId(),
      ...dto,
      totalPoints: 0,
      recycledKg: 0,
      totalRecyclings: 0,
      status: dto.status ?? 'Active',
      registrationDate: new Date().toISOString()
    };
    const current = this.studentsSubject.value;
    this.studentsSubject.next([...current, newStudent]);
    return of(newStudent).pipe(delay(300));
  }

  // TODO: Replace with → return this.http.patch<Student>(`${API_URL}/students/${id}`, dto);
  updateStudent(id: number, dto: UpdateStudentDTO): Observable<Student> {
    const current = this.studentsSubject.value;
    const index = current.findIndex(s => s.id === id);
    if (index === -1) throw new Error(`Student with id ${id} not found`);

    const updated: Student = { ...current[index], ...dto, id };
    const list = [...current];
    list[index] = updated;
    this.studentsSubject.next(list);
    return of(updated).pipe(delay(300));
  }

  // TODO: Replace with → return this.http.patch<Student>(`${API_URL}/students/${id}/status`, { status });
  changeStatus(id: number, status: 'Active' | 'Inactive'): Observable<Student> {
    return this.updateStudent(id, { status });
  }

  // TODO: Replace with → return this.http.delete<void>(`${API_URL}/students/${id}`).pipe(map(() => true));
  deleteStudent(id: number): Observable<boolean> {
    const filtered = this.studentsSubject.value.filter(s => s.id !== id);
    this.studentsSubject.next(filtered);
    return of(true).pipe(delay(300));
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private generateId(): number {
    const current = this.studentsSubject.value;
    return current.length > 0 ? Math.max(...current.map(s => s.id)) + 1 : 1;
  }
}
