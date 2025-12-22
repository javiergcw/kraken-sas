/**
 * DTOs para requests de company settings
 */

export interface CompanySettingsUpdateRequestDto {
  website_name?: string;
  address?: string;
  contact?: string;
  website_url?: string;
  terms_and_conditions?: string;
  privacy_policy?: string;
  website_email?: string;
  usd_to_cop_exchange_rate?: number;
}

