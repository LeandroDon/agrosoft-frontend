export interface ConfirmCardData {
  gender: 'male' | 'female';
  entityType: 'Empleado' | 'Maquinaria' | 'Usuario' | string;
  fields: { label: string; value: string | number }[];
  icon?: string;
  color?: string;
}