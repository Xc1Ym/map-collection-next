export interface Tag {
  id: number;
  name: string;
  color: string;
  sortOrder: number;
}

export interface Business {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  visited: boolean;
  rating: number | null;
  description: string | null;
  phone: string | null;
  website: string | null;
  createdAt: string;
  tags: Tag[];
}
