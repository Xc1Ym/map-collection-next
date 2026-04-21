export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Business {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  phone: string | null;
  website: string | null;
  createdAt: string;
  tags: Tag[];
}
