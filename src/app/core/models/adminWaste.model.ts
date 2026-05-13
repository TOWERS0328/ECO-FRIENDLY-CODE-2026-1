export interface Waste {
  id: number;
  name: string;
  description: string;
  category: 'Plastic' | 'Paper' | 'Glass' | 'Metal' | 'Organic' | 'Electronic';
  pointsPerKg: number;
  status: 'Active' | 'Inactive';
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateWasteDTO {
  name: string;
  description: string;
  category: Waste['category'];
  pointsPerKg: number;
  status: Waste['status'];
  imageUrl?: string;
}

export interface UpdateWasteDTO extends Partial<CreateWasteDTO> {}
