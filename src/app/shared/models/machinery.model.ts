export interface Machinery {
  id: string;
  name: string;
  brand: string;
  model: string;
  status: 'active' | 'maintenance' | 'retired';
  hoursUsed: number;
  purchaseDate: Date;
  assignedTasks: string[];
}