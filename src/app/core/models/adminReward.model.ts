export interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  stock: number;
  category: 'Products' | 'Coupons' | 'Plants' | 'Discounts';
  status: 'Active' | 'Inactive' | 'OutOfStock';
  imageUrl?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRewardDTO {
  name: string;
  description: string;
  points: number;
  stock: number;
  category: Reward['category'];
  status: Reward['status'];
  imageUrl?: string;
  icon?: string;
}

export interface UpdateRewardDTO extends Partial<CreateRewardDTO> {}
