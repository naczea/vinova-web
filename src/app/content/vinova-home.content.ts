export interface BrandContent {
  name: string;
  tagline: string;
  logoAlt: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  //badge: string;
  //trustPoints: string[];
  image: {
    src: string;
    alt: string;
  };
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  ctaBtnWhatsappLabel: string;
}

export interface AboutContent {
  headline: string;
  description: string;
  highlights: string[];
}

export interface ServiceItem {
  title: string;
  description: string;
  iconKey: string;
}

export interface ServicesContent {
  headline: string;
  description: string;
  items: ServiceItem[];
}

export interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
}

export interface TestimonialsContent {
  headline: string;
  description: string;
  items: TestimonialItem[];
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ContactContent {
  headline: string;
  description: string;
  address: string;
  addressUrl: string;
  geo: GeoCoordinates;
  hours: string;
  email: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappUrl: string;
  whatsappCtaLabel: string;
}

export interface SocialContent {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface NavigationItem {
  label: string;
  fragment: string;
}

export interface NavigationContent {
  items: NavigationItem[];
}

export interface VinovaHomeContent {
  brand: BrandContent;
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  testimonials: TestimonialsContent;
  contact: ContactContent;
  social: SocialContent;
  navigation: NavigationContent;
}

export const VINOVA_HOME_CONTENT: VinovaHomeContent = {
  brand: {
    name: "VINOVA",
    tagline: "Centro de Visión Integral",
    logoAlt: "VINOVA logo",
  },
  hero: {
    headline: "Tu visión merece más que un examen rápido.",
    subheadline:
      "En Vinova evaluamos tu salud visual con tiempo, claridad y acompañamiento real.",
    //badge: "Centro de Visión Integral",
    //trustPoints: [
    //  "Evaluación visual completa",
    //  "Explicación clara y atención cálida",
    //  "Para niños, jóvenes y adultos",
    //],
    image: {
      src: "assets/images/home/hero/hero-karolina.jpg",
      alt: "Especialista de VINOVA - Centro de Visión Integral",
    },
    ctaPrimaryLabel: "Ver servicios",
    ctaSecondaryLabel: "Ubicación y horarios",
    ctaBtnWhatsappLabel: "Agendar cita",
  },
  about: {
    headline: "Nosotros",
    description:
      "Placeholder para el texto de presentación de la marca y su propósito.",
    highlights: [
      "Placeholder de fortaleza o diferenciador 1.",
      "Placeholder de fortaleza o diferenciador 2.",
      "Placeholder de fortaleza o diferenciador 3.",
    ],
  },
  services: {
    headline: "Servicios",
    description:
      "Placeholder para describir el enfoque general de los servicios.",
    items: [
      {
        title: "Servicio 1",
        description: "Placeholder de descripción breve del servicio 1.",
        iconKey: "service-1",
      },
      {
        title: "Servicio 2",
        description: "Placeholder de descripción breve del servicio 2.",
        iconKey: "service-2",
      },
      {
        title: "Servicio 3",
        description: "Placeholder de descripción breve del servicio 3.",
        iconKey: "service-3",
      },
      {
        title: "Servicio 4",
        description: "Placeholder de descripción breve del servicio 4.",
        iconKey: "service-4",
      },
      {
        title: "Servicio 5",
        description: "Placeholder de descripción breve del servicio 5.",
        iconKey: "service-5",
      },
      {
        title: "Servicio 6",
        description: "Placeholder de descripción breve del servicio 6.",
        iconKey: "service-6",
      },
    ],
  },
  testimonials: {
    headline: "Testimonios",
    description:
      "Placeholder para una línea que introduzca las opiniones de clientes.",
    items: [
      {
        name: "Nombre Apellido",
        text: "Placeholder de testimonio corto 1.",
        rating: 5,
      },
      {
        name: "Nombre Apellido",
        text: "Placeholder de testimonio corto 2.",
        rating: 5,
      },
      {
        name: "Nombre Apellido",
        text: "Placeholder de testimonio corto 3.",
        rating: 4,
      },
    ],
  },
  contact: {
    headline: "Contacto",
    description: "Escríbenos por WhatsApp o visítanos en el consultorio.",
    address: "Av. de las Palmeras y De los Tulipanes, Quito",
    addressUrl: "https://maps.app.goo.gl/YVreB3QJfK4fqn1Y6",
    geo: { latitude: -0.1613916, longitude: -78.473923 },
    hours: "Lunes a viernes: 10:00 a 18:30. Sábados: 10:00 a 14:00.",
    email: "info@vinova.ec",
    phoneDisplay: "096 356 5769",
    phoneE164: "593963565769",
    whatsappUrl:
      "https://wa.me/593963565769?text=Hola%20Vinova,%20deseo%20agendar%20una%20cita",
    whatsappCtaLabel: "Escríbenos por WhatsApp",
  },
  social: {
    facebook: "https://www.facebook.com/share/1ED16qQCTq/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/vinovaec?igsh=ZWM5a3VvanVrYWNn",
    tiktok: "https://www.tiktok.com/@vinovaec?_r=1&_t=ZS-93lPTlFKUkr",
  },
  navigation: {
    items: [
      { label: "Inicio", fragment: "inicio" },
      { label: "Nosotros", fragment: "nosotros" },
      { label: "Servicios", fragment: "servicios" },
      { label: "Contacto", fragment: "contacto" },
    ],
  },
};

export default VINOVA_HOME_CONTENT;
