/**
 * DTOs para requests de banners
 */

export interface BannerCreateRequestDto {
  zone_id: string;
  title: string;
  subtitles?: string;
  image_url: string;
  link_url: string;
  active: boolean;
}

export interface BannerUpdateRequestDto {
  zone_id: string;
  title: string;
  subtitles?: string;
  image_url: string;
  link_url: string;
  active: boolean;
}

