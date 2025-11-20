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
  ID: string;
  CompanyID: string;
  WebsiteName: string;
  Address: string;
  Contact: string;
  WebsiteURL: string;
  TermsAndConditions: string;
  PrivacyPolicy: string;
  WebsiteEmail: string;
  CreatedAt: string;
  UpdatedAt: string;
  Company: CompanyDto;
}

export interface CompanySettingsResponseDto {
  success: boolean;
  message?: string;
  data: CompanySettingsDto;
}

