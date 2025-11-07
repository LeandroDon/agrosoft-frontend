export interface Employee {
  id: string;
  fullName: string;
  role: string;
  seniority: number;
  availableHours: number;
  salary: number;
  overtimeHours: number;
  performanceScore: number;
  assignedTasks: string[];
}