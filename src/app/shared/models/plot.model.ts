export interface Plot {
  id: string;
  name: string;
  cadastralNumber: string;
  area: number;
  location: string;
  status: 'free' | 'planted' | 'harvested';
  tasks: {
    type: 'planting' | 'spraying' | 'harvesting';
    date: Date;
    inputs: {
      name: string;
      type: 'seed' | 'fertilizer' | 'agrochemical';
      quantity: number;
      unit: string;
    }[];
  }[];
  rainfall: {
    date: Date;
    millimeters: number;
  }[];
}