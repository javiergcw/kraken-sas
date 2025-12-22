/**
 * DTOs para responses de company settings
 */

export interface CompanyDto {
  ID: string;
  Name: string;
  Logo: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
  Categories: null;
  Products: null;
  Zones: null;
  CompanyAccounts: null;
  CompanyCredentials: null;
  CompanySettings: null;
  BookingCapacity: null;
  LicenseKeys: null;
}

export interface CompanySettingsDto {
  id: string;
  company_id: string;
  website_name: string;
  address: string;
  contact: string;
  website_url: string;
  terms_and_conditions: string;
  privacy_policy: string;
  website_email: string;
  usd_to_cop_exchange_rate: number;
  created_at: string;
  updated_at: string;
}

export interface CompanySettingsResponseDto {
  success: boolean;
  message?: string;
  data: CompanySettingsDto;
}

