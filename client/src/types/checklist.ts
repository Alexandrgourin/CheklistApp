export interface Checklist {
  id: string;
  title: string;
  shortName: string;
  status: 'active' | 'completed' | 'archived';
  userId: string;
  userName: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateChecklistDto {
  title: string;
  shortName: string;
}

export interface UpdateChecklistDto {
  title?: string;
  shortName?: string;
  status?: 'active' | 'completed' | 'archived';
}
