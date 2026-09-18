export const REGIONS_DATA = [
  {
    id: "emea",
    index: "03",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/d511ece48_generated_e23d89db.jpg",
    label: "EMEA",
    title: { en: "Europe, Middle East & Africa", es: "Europa, Oriente Medio y África" },
    tagline: {
      en: "Primary delivery hub. London and Frankfurt operations centres.",
      es: "Centro de entrega principal. Centros de operaciones en Londres y Frankfurt.",
    },
    overview: {
      en: "Our primary delivery hub. iberix runs operations centres in London and Frankfurt, with in-country field engineering across 52 countries spanning Europe, the Middle East and Africa. The zone leads data centre commissioning and cross-border network rollouts for system integrators and operators.",
      es: "Nuestro centro de entrega principal. iberix opera centros en Londres y Frankfurt, con ingeniería de campo local en 52 países de Europa, Oriente Medio y África. La zona lidera la puesta en marcha de centros de datos y despliegues de red transfronterizos para integradores y operadores.",
    },
    stats: [
      { k: { en: "Engineers active", es: "Ingenieros activos" }, v: "1,130+" },
      { k: { en: "Countries covered", es: "Países cubiertos" }, v: "52" },
      { k: { en: "Locations", es: "Ubicaciones" }, v: "200" },
      { k: { en: "Operations centres", es: "Centros de operaciones" }, v: "2" },
    ],
    hubs: [
      { city: "London", role: { en: "Operations Centre", es: "Centro de operaciones" } },
      { city: "Frankfurt", role: { en: "Data Centre Coordination", es: "Coordinación de centros de datos" } },
      { city: "Dubai", role: { en: "MENA Field Hub", es: "Nodo de campo MENA" } },
      { city: "Madrid", role: { en: "Iberia Network Node", es: "Nodo de red Iberia" } },
    ],
    coverage: ["datacentre", "network", "field", "dedicated"],
  },
  {
    id: "apac",
    index: "03",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/6455a70d6_generated_b67c6955.jpg",
    label: "APAC",
    title: { en: "Asia Pacific", es: "Asia Pacífico" },
    tagline: {
      en: "Singapore coordination node. High-growth network rollout zone.",
      es: "Nodo de coordinación en Singapur. Zona de despliegue de red de alto crecimiento.",
    },
    overview: {
      en: "A high-growth network rollout zone. iberix coordinates APAC delivery from Singapore, mobilising in-country engineering teams across 23 countries for fibre, RAN and transport rollouts and data centre commissioning.",
      es: "Una zona de despliegue de red de alto crecimiento. iberix coordina la entrega en APAC desde Singapur, movilizando equipos locales en 23 países para despliegues de fibra, RAN y transporte y puesta en marcha de centros de datos.",
    },
    stats: [
      { k: { en: "Engineers active", es: "Ingenieros activos" }, v: "549" },
      { k: { en: "Countries covered", es: "Países cubiertos" }, v: "23" },
      { k: { en: "Locations", es: "Ubicaciones" }, v: "58" },
      { k: { en: "Coordination node", es: "Nodo de coordinación" }, v: "SG" },
    ],
    hubs: [
      { city: "Singapore", role: { en: "Coordination Node", es: "Nodo de coordinación" } },
      { city: "Sydney", role: { en: "Field Support Base", es: "Base de soporte de campo" } },
      { city: "Tokyo", role: { en: "Network Rollout", es: "Despliegue de red" } },
      { city: "Mumbai", role: { en: "Data Centre Hub", es: "Centro de datos" } },
    ],
    coverage: ["datacentre", "network", "field", "dedicated"],
  },
  {
    id: "americas",
    index: "03",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/3cd71edaf_generated_f79545e1.jpg",
    label: "Americas",
    title: { en: "Americas", es: "América" },
    tagline: {
      en: "New York dispatch. Data centre commissioning at scale.",
      es: "Dispatch desde Nueva York. Puesta en marcha de centros de datos a escala.",
    },
    overview: {
      en: "New York dispatch across North and South America. iberix delivers data centre commissioning at scale and multi-country network rollouts, with in-country engineering teams across 12 countries and a single accountable SPOC.",
      es: "Dispatch desde Nueva York en Norte y Sudamérica. iberix ofrece puesta en marcha de centros de datos a escala y despliegues de red en varios países, con equipos locales en 12 países y un único interlocutor responsable.",
    },
    stats: [
      { k: { en: "Engineers active", es: "Ingenieros activos" }, v: "500+" },
      { k: { en: "Countries covered", es: "Países cubiertos" }, v: "12" },
      { k: { en: "Locations", es: "Ubicaciones" }, v: "71" },
      { k: { en: "Dispatch centre", es: "Centro de dispatch" }, v: "NYC" },
    ],
    hubs: [
      { city: "New York", role: { en: "Dispatch Centre", es: "Centro de dispatch" } },
      { city: "Toronto", role: { en: "Network Coordination", es: "Coordinación de red" } },
      { city: "São Paulo", role: { en: "LATAM Field Hub", es: "Nodo de campo LATAM" } },
      { city: "Mexico City", role: { en: "Network Node", es: "Nodo de red" } },
    ],
    coverage: ["datacentre", "network", "field", "dedicated"],
  },
  {
    id: "global",
    index: "03",
    image: "https://media.base44.com/images/public/6aa29ba3af67530c8741feb5/ce9b6bc0a_generated_8c8e82bd.jpg",
    label: "Global",
    title: { en: "Global Coordination", es: "Coordinación global" },
    tagline: {
      en: "One coordination layer across seven regions.",
      es: "Una capa de coordinación en siete regiones.",
    },
    overview: {
      en: "A single coordination layer spanning every region. iberix unifies delivery across seven regions under one accountable SPOC, with real-time dispatch, documented handover and consistent governance across 89 countries.",
      es: "Una sola capa de coordinación en todas las regiones. iberix unifica la entrega en siete regiones bajo un único interlocutor responsable, con dispatch en tiempo real, entrega documentada y gobernanza consistente en 89 países.",
    },
    stats: [
      { k: { en: "Engineers active", es: "Ingenieros activos" }, v: "2,100+" },
      { k: { en: "Countries covered", es: "Países cubiertos" }, v: "89" },
      { k: { en: "Locations", es: "Ubicaciones" }, v: "332" },
      { k: { en: "Coordination regions", es: "Regiones de coordinación" }, v: "7" },
    ],
    hubs: [
      { city: "London", role: { en: "EMEA Coordination", es: "Coordinación EMEA" } },
      { city: "Singapore", role: { en: "APAC Coordination", es: "Coordinación APAC" } },
      { city: "New York", role: { en: "Americas Coordination", es: "Coordinación América" } },
    ],
    coverage: ["datacentre", "network", "field", "dedicated"],
  },
];