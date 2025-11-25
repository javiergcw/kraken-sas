/**
 * DTOs para responses de operation groups (grupos dentro de operaciones)
 */

export interface OperationGroupDto {
  id: string;
  daily_operation_id: string;
  environment: 'OCEAN' | 'POOL';
  label?: string;
  start_time?: string;
  end_time?: string;
  comments?: string;
  created_at: string;
  updated_at: string;
}

export interface OperationGroupResponseDto {
  success: boolean;
  message?: string;
  data: OperationGroupDto;
}

export interface OperationGroupListResponseDto {
  success: boolean;
  data: OperationGroupDto[];
}

