/**
 * DTOs para responses de banners
 */

export interface BannerDto {
  id: string;
  zone_id: string;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
  created_at: string;
}

export interface BannersResponseDto {
  success: boolean;
  data: BannerDto[];
}

export interface BannerResponseDto {
  success: boolean;
  message?: string;
  data: BannerDto;
}

export interface BannerDeleteResponseDto {
  success: boolean;
  message: string;
}

