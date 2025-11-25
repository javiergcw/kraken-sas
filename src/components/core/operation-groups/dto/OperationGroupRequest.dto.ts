/**
 * DTOs para requests de operation groups (grupos dentro de operaciones)
 */

export interface OperationGroupCreateRequestDto {
  environment: 'OCEAN' | 'POOL'; // requerido
  label?: string; // opcional: nombre de la sección (Buzos, Piscina…)
  start_time?: string; // opcional, formato HH:MM (24h)
  end_time?: string; // opcional
  comments?: string; // opcional
}

export interface OperationGroupUpdateRequestDto {
  environment?: 'OCEAN' | 'POOL';
  label?: string;
  start_time?: string;
  end_time?: string;
  comments?: string;
}

