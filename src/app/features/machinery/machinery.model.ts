export type MachineryStatus = 'active' | 'maintenance' | 'retired';

export interface Machinery {
  id: string;
  name: string;
  brand: string;
  model: string;
  status: MachineryStatus;
  hours_used: number;
  purchase_date: Date;
}