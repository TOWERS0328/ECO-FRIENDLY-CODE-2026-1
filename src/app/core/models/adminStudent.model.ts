export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  phone?: string;
  major?: string;
  semester?: number;
  totalPoints: number;
  recycledKg: number;
  totalRecyclings: number;
  status: 'Active' | 'Inactive';
  registrationDate: string; // ISO
  lastActivity?: string;
  avatar?: string;
}

export interface StudentStats {
  totalStudents: number;
  active: number;
  inactive: number;
  totalPoints: number;
  totalKg: number;
}

export interface CreateStudentDTO {
  firstName: string;
  lastName: string;
  email: string;
  code: string;
  phone?: string;
  major?: string;
  semester?: number;
  status?: 'Active' | 'Inactive';
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {}
