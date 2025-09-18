export interface NavItem {
  name: string;
  href: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}