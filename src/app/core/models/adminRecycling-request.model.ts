export interface RecyclingMaterial {
  name: string;
  category: string;
  weightKg: number;
  points: number;
}

export interface RecyclingRequest {
  id: number;
  student: {
    name: string;
    code: string;
    avatar?: string;
  };
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  materials: RecyclingMaterial[];
  totalPoints: number;
}

export interface ValidateRequestDTO {
  status: 'Approved' | 'Rejected';
  observation?: string;
}
