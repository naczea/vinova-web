export interface BrandContent {
  name: string;
  tagline: string;
  logoAlt: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  badge: string;
  trustPoints: string[];
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

export interface ContactContent {
  headline: string;
  description: string;
  address: string;
  hours: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappUrl: string;
  whatsappCtaLabel: string;
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
  navigation: NavigationContent;
}

export const VINOVA_HOME_CONTENT: VinovaHomeContent = {
  brand: {
    name: "VINOVA",
    tagline: "Centro de Visión Integral",
    logoAlt: "VINOVA logo",
  },
  hero: {
    headline: "Tu visión, en manos expertas.",
    subheadline:
      "Evaluación visual completa, explicada con claridad, para que tú y tu familia vean mejor.",
    badge: "Centro de Visión Integral",
    trustPoints: [
      "Evaluación visual completa",
      "Explicación clara y atención cálida",
      "Para niños, jóvenes y adultos",
    ],
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
    description:
      "Placeholder para invitar a agendar una cita o solicitar información.",
    address: "Placeholder de dirección o ubicación.",
    hours: "Placeholder de horario de atención.",
    phoneDisplay: "096 356 5769",
    phoneE164: "593963565769",
    whatsappUrl:
      "https://wa.me/593963565769?text=Hola,%20deseo%20sacar%20una%20cita",
    whatsappCtaLabel: "Escríbenos por WhatsApp",
  },
  navigation: {
    items: [
      { label: "Inicio", fragment: "inicio" },
      { label: "Nosotros", fragment: "nosotros" },
      { label: "Servicios", fragment: "servicios" },
      { label: "Testimonios", fragment: "testimonios" },
      { label: "Contacto", fragment: "contacto" },
    ],
  },
};

export default VINOVA_HOME_CONTENT;
