export interface Plot {
  id: string;
  name: string;
  cadastralNumber: string;
  area: number;
  location: string;
  status: 'free' | 'planted' | 'harvested';
  tasks: Task[];
  rainfall: Rainfall[];
}

export interface Task {
  type: 'planting' | 'spraying' | 'harvesting';
  date: Date;
  inputs: Input[];
}

export interface Input {
  name: string;
  type: 'seed' | 'fertilizer' | 'agrochemical';
  quantity: number;
  unit: string;
}

export interface Rainfall {
  date: Date;
  millimeters: number;
}