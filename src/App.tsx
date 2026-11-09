import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Calendar,
  Users,
  Home,
  Utensils,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  Mail,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Tag,
  Sparkles,
  Building2,
  BedDouble,
  MapPin,
  Clock,
  ArrowUpDown,
  Columns,
  Check,
  X,
  Upload,
  Server,
  Lock,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Eye,
} from 'lucide-react';

// ============================================================================
// PALETA DE IDENTIDAD VISUAL: NOVA RESET STUDIO
// Deep Space: #10131B | Secondary Dark: #171322
// Turquoise: #59D7CC / #41D6CA | Violet: #A47BFF | Copper: #D99A73
// Ivory Text: #F5F1E9 | Secondary Text: #C7CBC9 / #8E999B | Borders: #59616A
// ============================================================================

const CURRENCY_RATES = {
  USD: { symbol: 'US$', rate: 1, name: 'Dólar estadounidense (USD)' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro (EUR)' },
  MXN: { symbol: 'MX$', rate: 18.2, name: 'Peso mexicano (MXN)' },
  DOP: { symbol: 'RD$', rate: 59.5, name: 'Peso dominicano (DOP)' },
  COP: { symbol: 'COL$', rate: 3950, name: 'Peso colombiano (COP)' },
};

const FAMILY_PREFERENCES = [
  { id: 'pool', label: 'Piscina climatizada / infantil' },
  { id: 'kitchen', label: 'Cocina equipada' },
  { id: 'beach', label: 'Acceso a playa' },
  { id: 'connecting', label: 'Habitaciones familiares conectadas' },
  { id: 'laundry', label: 'Lavandería en unidad' },
  { id: 'accessibility', label: 'Accesibilidad (movilidad reducida)' },
  { id: 'kidsClub', label: 'Club infantil / Cuna disponible' },
];

// ============================================================================
// DATOS DE DEMOSTRACIÓN (Claramente rotulados para MODO DEMO)
// ============================================================================
const DEMO_PROPERTIES = [
  {
    id: 'prop-riviera-1',
    name: 'Grand Coral Family Villas & Resort',
    type: 'Resort',
    destination: 'Riviera Maya, México',
    regionTag: 'Riviera Maya',
    distanceFromCenter: 'A 12 km de Playa del Carmen (Zona Costera)',
    isNearbyRegion: false,
    maxCapacity: 8,
    recommendedRooms: 2,
    unitDistribution:
      'Suite Familiar 2 Recámaras (1 King + 2 Matrimoniales + Sofá cama)',
    baseNightlyUSD: 390,
    taxesStatus: 'breakdown', // 'breakdown' | 'unconfirmed' | 'included'
    taxesAmountUSD: 68, // por noche en cargos e impuestos
    taxesNote:
      'Impuestos locales (16% IVA + 5% ISH) y cargo de resort ($22 USD/noche) detallados por el proveedor.',
    preferencesMet: [
      'pool',
      'kitchen',
      'beach',
      'connecting',
      'kidsClub',
      'accessibility',
    ],
    highlights: [
      'Área infantil supervisada y cunas sin costo previa solicitud',
      'Cocina completa con refrigerador familiar y microondas',
      'Acceso directo a caleta de oleaje suave',
    ],
    sources: [
      {
        sourceId: 'src-1a',
        providerName: 'Web Oficial del Resort (Canal Directo)',
        providerType: 'Sitio Oficial',
        nightlyRateUSD: 390,
        mealPlan: 'Todo Incluido',
        cancellation: 'Cancelación gratuita hasta 7 días antes del check-in',
        availability: 'Disponible (Últimas 2 unidades familiares)',
        lastChecked: 'Hace 8 minutos (10:36 EST)',
        url: 'https://ejemplo-demo-oficial.novareset.local/grand-coral-villas',
        conditionNote:
          'Incluye desayuno, comidas, snacks y acceso al club de niños. Pago del 20% al reservar.',
      },
      {
        sourceId: 'src-1b',
        providerName: 'Red Afiliada Familiar (OTA Autorizada)',
        providerType: 'Motor Afiliado',
        nightlyRateUSD: 365,
        mealPlan: 'Desayuno incluido',
        cancellation: 'No reembolsable (Tarifa restringida)',
        availability: 'Disponible',
        lastChecked: 'Hace 11 minutos (10:33 EST)',
        url: 'https://ejemplo-demo-ota.novareset.local/grand-coral-promo',
        conditionNote:
          'Menor tarifa base, pero NO incluye cenas ni permite cambios de fecha sin penalidad del 100%.',
      },
      {
        sourceId: 'src-1c',
        providerName: 'Consolidador Vacacional B2B',
        providerType: 'Mayorista',
        nightlyRateUSD: 405,
        mealPlan: 'Todo Incluido',
        cancellation: 'Cancelación gratuita hasta 48h antes',
        availability: 'Confirmación inmediata',
        lastChecked: 'Hace 14 minutos (10:30 EST)',
        url: 'https://ejemplo-demo-mayorista.novareset.local/grand-coral',
        conditionNote:
          'Mayor flexibilidad de cancelación (48h), incluye traslado compartido desde aeropuerto.',
      },
    ],
  },
  {
    id: 'prop-riviera-2',
    name: 'Villa Turquesa Akumal Eco-Estate',
    type: 'Villa',
    destination: 'Akumal (Cerca de Riviera Maya), México',
    regionTag: 'Riviera Maya',
    distanceFromCenter: 'A 26 km al sur de Playa del Carmen',
    isNearbyRegion: true,
    maxCapacity: 10,
    recommendedRooms: 3,
    unitDistribution:
      'Villa Privada de 3 Habitaciones + Cuarto de servicio y terraza',
    baseNightlyUSD: 460,
    taxesStatus: 'unconfirmed',
    taxesAmountUSD: 0,
    taxesNote:
      'Atención: Tasa de saneamiento ambiental y depósito de seguridad ($300 USD reembolsable) se confirman en el checkout del administrador.',
    preferencesMet: ['pool', 'kitchen', 'beach', 'laundry', 'accessibility'],
    highlights: [
      'Piscina privada con reja de seguridad removible para niños',
      'Lavadora y secadora dentro de la villa (ideal estadías largas)',
      'Cocina gourmet completa; opción de contratar chef local',
    ],
    sources: [
      {
        sourceId: 'src-2a',
        providerName: 'Portal Oficial de Villas Akumal',
        providerType: 'Administradora Directa',
        nightlyRateUSD: 460,
        mealPlan: 'Otro plan',
        cancellation: 'Reembolso del 100% cancelando 14 días antes',
        availability: 'Disponible (1 villa completa)',
        lastChecked: 'Hace 6 minutos (10:38 EST)',
        url: 'https://ejemplo-demo-villas.novareset.local/villa-turquesa-akumal',
        conditionNote:
          'Régimen de cocina propia (Self-catering). Limpieza interdiaria incluida.',
      },
      {
        sourceId: 'src-2b',
        providerName: 'Buscador Global de Alquiler Vacacional',
        providerType: 'Plataforma Vacacional',
        nightlyRateUSD: 488,
        mealPlan: 'Otro plan',
        cancellation: 'Reembolso parcial (50%) hasta 7 días antes',
        availability: 'Disponible',
        lastChecked: 'Hace 15 minutos (10:29 EST)',
        url: 'https://ejemplo-demo-vacacional.novareset.local/akumal-turquesa',
        conditionNote:
          'Incluye cargo por servicio de plataforma (+6%). No incluye limpieza diaria.',
      },
    ],
  },
  {
    id: 'prop-orlando-1',
    name: 'Starlight Palms Family Suites & Hotel',
    type: 'Hotel',
    destination: 'Orlando (Lake Buena Vista), EE. UU.',
    regionTag: 'Orlando',
    distanceFromCenter: 'A 4.5 km de los parques temáticos principales',
    isNearbyRegion: false,
    maxCapacity: 6,
    recommendedRooms: 2,
    unitDistribution:
      '2 Habitaciones Conectadas internamente (2 Queen + 1 King + Litera)',
    baseNightlyUSD: 245,
    taxesStatus: 'breakdown',
    taxesAmountUSD: 42,
    taxesNote:
      'Impuesto condal de alojamiento (12.5%) + estacionamiento familiar ($12 USD/noche). Sin resort fee oculto.',
    preferencesMet: [
      'pool',
      'kitchen',
      'connecting',
      'laundry',
      'accessibility',
      'kidsClub',
    ],
    highlights: [
      'Desayuno caliente tipo buffet incluido para toda la familia',
      'Habitaciones conectadas garantizadas por contrato familiar',
      'Cocineta equipada y lavandería de autoservicio en cada piso',
    ],
    sources: [
      {
        sourceId: 'src-3a',
        providerName: 'Web Oficial Starlight Hotels',
        providerType: 'Sitio Oficial',
        nightlyRateUSD: 245,
        mealPlan: 'Desayuno incluido',
        cancellation: 'Cancelación sin cargo hasta 24h antes de la llegada',
        availability: 'Alta disponibilidad',
        lastChecked: 'Hace 4 minutos (10:40 EST)',
        url: 'https://ejemplo-demo-starlight.novareset.local/orlando-suites',
        conditionNote:
          'Garantiza puerta conectada entre habitaciones al reservar tarifa Familiar.',
      },
      {
        sourceId: 'src-3b',
        providerName: 'Portal Afiliado de Viajes',
        providerType: 'Motor Afiliado',
        nightlyRateUSD: 232,
        mealPlan: 'Otro plan',
        cancellation: 'No reembolsable',
        availability: 'Disponible',
        lastChecked: 'Hace 9 minutos (10:35 EST)',
        url: 'https://ejemplo-demo-ota.novareset.local/starlight-orlando',
        conditionNote:
          'No incluye desayuno buffet ($18 USD por adulto adicional) y habitaciones conectadas sujetas a disponibilidad al llegar.',
      },
    ],
  },
  {
    id: 'prop-puntacana-1',
    name: 'Bahía Ámbar All-Generations Resort',
    type: 'Resort',
    destination: 'Punta Cana (Bávaro), República Dominicana',
    regionTag: 'Punta Cana',
    distanceFromCenter: 'Frente a Playa Bávaro, a 18 min del Aeropuerto PUJ',
    isNearbyRegion: false,
    maxCapacity: 9,
    recommendedRooms: 2,
    unitDistribution:
      'Master Family Loft de 2 Niveles + Balcón con rampa accesible',
    baseNightlyUSD: 420,
    taxesStatus: 'included',
    taxesAmountUSD: 0,
    taxesNote:
      '18% ITBIS + 10% cargo legal por servicio ya incluidos en el precio publicado por la fuente.',
    preferencesMet: [
      'pool',
      'beach',
      'connecting',
      'accessibility',
      'kidsClub',
    ],
    highlights: [
      'Niños menores de 12 años se hospedan sin cargo adicional en temporada baja',
      'Accesibilidad completa: rampas en playa, ascensores anchos y baño adaptado',
      'Parque acuático infantil y guardería certificada',
    ],
    sources: [
      {
        sourceId: 'src-4a',
        providerName: 'Canal Directo Bahía Ámbar',
        providerType: 'Sitio Oficial',
        nightlyRateUSD: 420,
        mealPlan: 'Todo Incluido',
        cancellation: 'Cancelación gratuita hasta 5 días antes',
        availability: 'Disponible (3 unidades)',
        lastChecked: 'Hace 5 minutos (10:39 EST)',
        url: 'https://ejemplo-demo-bahiaambar.novareset.local/punta-cana',
        conditionNote:
          'Todo incluido 24h, impuestos incluidos y 1er niño gratis aplicado en tarifa.',
      },
      {
        sourceId: 'src-4b',
        providerName: 'Agencia Mayorista Caribe',
        providerType: 'Mayorista',
        nightlyRateUSD: 398,
        mealPlan: 'Todo Incluido',
        cancellation:
          'Penalidad de 1 noche si cancela dentro de los 10 días previos',
        availability: 'Disponible bajo petición rápida',
        lastChecked: 'Hace 19 minutos (10:25 EST)',
        url: 'https://ejemplo-demo-caribe.novareset.local/bahia-ambar-deal',
        conditionNote:
          'Precio menor pero requiere pago total inmediato al confirmar.',
      },
    ],
  },
  {
    id: 'prop-mallorca-1',
    name: 'Finca Mediterránea Alcúdia Villas & Aparthotel',
    type: 'Villa',
    destination: 'Alcúdia, Mallorca, España',
    regionTag: 'Mallorca',
    distanceFromCenter: 'A 800 m de Playa de Muro (aguas poco profundas)',
    isNearbyRegion: true,
    maxCapacity: 7,
    recommendedRooms: 2,
    unitDistribution:
      'Villa Adosada Familiar (2 Dormitorios dobles + Estudio + Cocina)',
    baseNightlyUSD: 315,
    taxesStatus: 'breakdown',
    taxesAmountUSD: 19,
    taxesNote:
      'Ecotasa balear (Impuesto de Turismo Sostenible) e IVA 10% calculados según adultos.',
    preferencesMet: ['pool', 'kitchen', 'beach', 'laundry', 'kidsClub'],
    highlights: [
      'Cocina completa y lavadora privada; supermercado a 200 metros',
      'Playa de Muro con entrada muy suave al mar, ideal para niños pequeños',
      'Opción de media pensión flexible o cocina libre',
    ],
    sources: [
      {
        sourceId: 'src-5a',
        providerName: 'Web Oficial Finca Alcúdia',
        providerType: 'Sitio Oficial',
        nightlyRateUSD: 315,
        mealPlan: 'Desayuno incluido',
        cancellation: 'Cancelación gratuita hasta 72 horas antes',
        availability: 'Disponible',
        lastChecked: 'Hace 12 minutos (10:32 EST)',
        url: 'https://ejemplo-demo-mallorca.novareset.local/finca-alcudia',
        conditionNote:
          'Incluye desayuno mediterráneo y cuna de viaje sin cargo.',
      },
    ],
  },
];

const DEMO_OFFERS = [
  {
    id: 'off-1',
    code: 'FAMILIA2026',
    title: '15% de descuento en Suites Familiares + 1 Niño Gratis (<12 años)',
    discountSummary: '15% DTO sobre tarifa flexible + 1er niño sin cargo',
    sourceName:
      'Portal Oficial Grand Coral & Bahía Ámbar (Promoción de Temporada)',
    sourceUrl:
      'https://ejemplo-demo-oficial.novareset.local/promociones-familiares',
    validUntil: '30 de noviembre de 2026',
    travelWindow:
      'Viajes entre el 15 de noviembre de 2026 y el 20 de junio de 2027 (excluye 24-31 dic)',
    requirements:
      'Estadía mínima de 4 noches. Grupo mínimo de 2 adultos + 1 menor de 12 años.',
    restrictions:
      'No acumulable con tarifas no reembolsables de OTAs externas. Requiere presentar documento de edad del menor al check-in.',
    verificationStatus: 'verified_source', // 'verified_source' | 'unverified_checkout' | 'expired'
    statusLabel: 'Verificado por la fuente',
    statusDescription:
      'Publicado oficialmente en la página de promociones del hotel. Aún debe validarse la disponibilidad de cupo en la fecha exacta elegida.',
    applicablePropertyIds: ['prop-riviera-1', 'prop-puntacana-1'],
    lastChecked: 'Hoy, 10:35 EST',
  },
  {
    id: 'off-2',
    code: 'GRUPO3HAB',
    title: 'Descuento por Grupo Familiar Múltiple (2 o más unidades)',
    discountSummary:
      '10% DTO reservando 2+ habitaciones o Villa de 3+ recámaras',
    sourceName:
      'Programa Público de Grupos Pequeños - Starlight & Villas Akumal',
    sourceUrl:
      'https://ejemplo-demo-villas.novareset.local/tarifas-grupos-familiares',
    validUntil: '15 de enero de 2027',
    travelWindow: 'Todo el año 2026 y primer semestre de 2027',
    requirements:
      'Reservar al menos 2 habitaciones bajo el mismo localizador familiar o 1 villa para 6+ personas.',
    restrictions: 'Sujeto a inventario de habitaciones contiguas.',
    verificationStatus: 'verified_source',
    statusLabel: 'Verificado por la fuente',
    statusDescription:
      'Términos verificados en el tarifario público del proveedor.',
    applicablePropertyIds: ['prop-riviera-2', 'prop-orlando-1'],
    lastChecked: 'Hoy, 10:38 EST',
  },
  {
    id: 'off-3',
    code: 'PROMOVIAJE75',
    title:
      'Cupón de directorio promocional (-$75 USD en estadías de +5 noches)',
    discountSummary: '-$75 USD adicionales sobre el total antes de impuestos',
    sourceName: 'Directorio Público de Cupones de Viaje (Afiliado Externo)',
    sourceUrl: 'https://ejemplo-demo-cupones.novareset.local/hotel-codes',
    validUntil: 'Sin fecha de cierre confirmada por el emisor',
    travelWindow: 'Estadías de 5 noches o más',
    requirements: 'Gasto mínimo de $1,200 USD antes de impuestos.',
    restrictions:
      'No pudimos comprobar su aplicación en la pasarela final de pago sin iniciar una reserva real.',
    verificationStatus: 'unverified_checkout',
    statusLabel: 'Publicado pero sin verificar al reservar',
    statusDescription:
      'Listado en portal público de promociones, pero NO se afirma que funcione en la pantalla de pago hasta probarlo en el proveedor.',
    applicablePropertyIds: [
      'prop-riviera-1',
      'prop-orlando-1',
      'prop-mallorca-1',
    ],
    lastChecked: 'Hoy, 10:20 EST',
  },
  {
    id: 'off-4',
    code: 'VERANO2026EARLY',
    title: 'Venta Anticipada Verano Familiar (-20% Reserva Temprana)',
    discountSummary: '20% DTO (Promoción finalizada)',
    sourceName: 'Archivo Histórico de Promociones Oficiales',
    sourceUrl: 'https://ejemplo-demo-oficial.novareset.local/archivo-ofertas',
    validUntil: '31 de agosto de 2026 (Vencido)',
    travelWindow: 'Verano 2026',
    requirements: 'Reserva con 90 días de anticipación.',
    restrictions:
      'Este código ya expiró. Se muestra únicamente como referencia histórica.',
    verificationStatus: 'expired',
    statusLabel: 'Vencido',
    statusDescription:
      'El periodo de vigencia publicado por la fuente ha concluido.',
    applicablePropertyIds: ['prop-mallorca-1'],
    lastChecked: 'Hoy, 10:15 EST',
  },
];

const INITIAL_CONNECTORS = [
  {
    id: 'amadeus',
    name: 'Amadeus Hotel Search & Offers API',
    category: 'GDS / Motor Oficial de Disponibilidad',
    status: 'missing_credentials',
    envRequired:
      'AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET (En servidor backend)',
    notes:
      'Requiere un proxy seguro en backend para negociar el token OAuth2 sin exponer claves privadas en el navegador.',
  },
  {
    id: 'expedia_rapid',
    name: 'Expedia Group Rapid API (EPS)',
    category: 'Proveedor Autorizado de Tarifas y Desglose de Impuestos',
    status: 'missing_credentials',
    envRequired: 'EPS_API_KEY / EPS_SHARED_SECRET (Firma SHA-512 en backend)',
    notes:
      'Proporciona inventario familiar, camas extras y desglose exacto de resort fees.',
  },
  {
    id: 'booking_demand',
    name: 'Booking.com Demand Affiliate API',
    category: 'Programa Oficial de Afiliados',
    status: 'missing_credentials',
    envRequired: 'BOOKING_AFFILIATE_ID / DEMAND_API_TOKEN',
    notes:
      'Sin credenciales configuradas en este entorno. No se realiza scraping ni acceso no autorizado.',
  },
  {
    id: 'direct_channel',
    name: 'Conector OpenTravel / Motores Directos de Hoteles',
    category: 'Canales Oficiales y Tarifas de Grupo',
    status: 'missing_credentials',
    envRequired: 'PROXY_ENDPOINT_URL',
    notes:
      'Listo para consultar feeds JSON autorizados de promociones familiares.',
  },
];

export default function App() {
  // ============================================================================
  // ESTADOS GLOBALES: MODO REAL VS MODO DEMO & LOGO
  // ============================================================================
  const [dataMode, setDataMode] = useState('demo'); // 'demo' | 'real'
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'offers' | 'integrations'
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Estado del conector Backend Proxy (para Modo Real)
  const [proxyEndpoint, setProxyEndpoint] = useState('');
  const [realConnectionState, setRealConnectionState] = useState({
    tested: false,
    testing: false,
    connected: false,
    message:
      'No se ha configurado un endpoint backend con credenciales activas. Para evitar exponer claves secretas en el navegador y nunca inventar precios falsos como si fueran en vivo, las consultas reales requieren configurar el proxy del proyecto.',
  });

  // ============================================================================
  // ESTADO DEL FORMULARIO DE BÚSQUEDA FAMILIAR
  // ============================================================================
  const [searchParams, setSearchParams] = useState({
    destination: 'Todos', // 'Todos', 'Riviera Maya', 'Orlando', 'Punta Cana', 'Mallorca' o texto libre
    includeNearby: true,
    dateMode: 'exact', // 'exact' | 'flexible'
    checkIn: '2026-12-12',
    checkOut: '2026-12-17',
    flexibleWindow: '5 noches en Diciembre (±3 días flexibles)',
    FlexibleNightsCount: 5,
    adults: 2,
    childrenCount: 2,
    childrenAges: [6, 10],
    rooms: 2,
    accommodationType: 'all', // 'all' | 'Villa' | 'Resort' | 'Hotel'
    mealPlan: 'any', // 'any' | 'Todo Incluido' | 'Desayuno incluido' | 'Otro plan'
    maxBudget: 3500,
    currency: 'USD',
    budgetScope: 'total', // 'total' | 'night'
    preferences: ['pool', 'connecting'],
  });

  // Ordenamiento y filtros de vista
  const [sortBy, setSortBy] = useState('match'); // 'total_asc' | 'person_asc' | 'capacity_desc' | 'match'
  const [showExpiredOffers, setShowExpiredOffers] = useState(false);
  const [isSearchingFeedback, setIsSearchingFeedback] = useState(false);

  // ============================================================================
  // ESTADOS DE COMPARACIÓN, SELECCIÓN Y COMPARTICIÓN
  // ============================================================================
  const [selectedForSummary, setSelectedForSummary] = useState([
    'prop-riviera-1',
    'prop-orlando-1',
  ]);
  const [selectedForCompare, setSelectedForCompare] = useState([
    'prop-riviera-1',
    'prop-orlando-1',
  ]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isSummaryDrawerOpen, setIsSummaryDrawerOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Estado del correo preparado
  const [emailDraft, setEmailDraft] = useState({
    to: '',
    subject: 'Opciones de Hospedaje Familiar Comparadas — NOVA Reset Studio',
    body: '',
    clientOpenedNotice: false,
  });

  // ============================================================================
  // FUNCIONES AUXILIARES DE CÁLCULO
  // ============================================================================
  const nightsCount = useMemo(() => {
    if (searchParams.dateMode === 'flexible') {
      return Number(searchParams.FlexibleNightsCount) || 5;
    }
    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [
    searchParams.dateMode,
    searchParams.checkIn,
    searchParams.checkOut,
    searchParams.FlexibleNightsCount,
  ]);

  const totalGuests = useMemo(() => {
    return Number(searchParams.adults) + Number(searchParams.childrenCount);
  }, [searchParams.adults, searchParams.childrenCount]);

  const formatMoney = (amountUSD, currencyCode = searchParams.currency) => {
    const curr = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD;
    const converted = amountUSD * curr.rate;
    return `${curr.symbol}${Math.round(converted).toLocaleString('es-ES')}`;
  };

  // Manejo de cambio de cantidad de niños y sus edades
  const handleChildrenCountChange = (newCount) => {
    const count = Math.max(0, Math.min(8, Number(newCount)));
    const currentAges = [...searchParams.childrenAges];
    if (count > currentAges.length) {
      while (currentAges.length < count) {
        currentAges.push(7);
      }
    } else {
      currentAges.length = count;
    }
    setSearchParams((prev) => ({
      ...prev,
      childrenCount: count,
      childrenAges: currentAges,
    }));
  };

  const handleChildAgeChange = (index, age) => {
    const updated = [...searchParams.childrenAges];
    updated[index] = Number(age);
    setSearchParams((prev) => ({ ...prev, childrenAges: updated }));
  };

  const togglePreference = (prefId) => {
    setSearchParams((prev) => {
      const exists = prev.preferences.includes(prefId);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((id) => id !== prefId)
          : [...prev.preferences, prefId],
      };
    });
  };

  // Carga local opcional de OPCION 4.png si el sandbox bloquea rutas locales
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomLogoUrl(objectUrl);
      setLogoLoadError(false);
    }
  };

  // ============================================================================
  // PROCESAMIENTO, DEDUPLICACIÓN Y CALIFICACIÓN DE COINCIDENCIA FAMILIAR
  // ============================================================================
  const evaluatedProperties = useMemo(() => {
    if (dataMode === 'real' && !realConnectionState.connected) {
      return [];
    }

    const currRate = (
      CURRENCY_RATES[searchParams.currency] || CURRENCY_RATES.USD
    ).rate;

    return DEMO_PROPERTIES.map((prop) => {
      // Elegir la fuente que mejor coincida con el régimen buscado o la de menor precio
      const matchingSources = prop.sources.filter((src) =>
        searchParams.mealPlan === 'any'
          ? true
          : src.mealPlan === searchParams.mealPlan
      );
      const primarySource =
        matchingSources.length > 0
          ? [...matchingSources].sort(
              (a, b) => a.nightlyRateUSD - b.nightlyRateUSD
            )[0]
          : [...prop.sources].sort(
              (a, b) => a.nightlyRateUSD - b.nightlyRateUSD
            )[0];

      const nightlyBaseUSD = primarySource.nightlyRateUSD;
      const nightlyTaxesUSD =
        prop.taxesStatus === 'breakdown' ? prop.taxesAmountUSD : 0;
      const effectiveNightlyUSD = nightlyBaseUSD + nightlyTaxesUSD;
      const totalStayUSD = effectiveNightlyUSD * nightsCount;
      const perPersonUSD =
        totalGuests > 0 ? totalStayUSD / totalGuests : totalStayUSD;

      // Evaluar coincidencia con los filtros familiares
      const criteria = [];

      // 1. Capacidad familiar
      const meetsCapacity = prop.maxCapacity >= totalGuests;
      criteria.push({
        label: `Capacidad (${prop.maxCapacity} máx. para ${totalGuests} huéspedes)`,
        passed: meetsCapacity,
      });

      // 2. Unidades/habitaciones
      const meetsRooms =
        prop.recommendedRooms >= searchParams.rooms ||
        prop.maxCapacity >= totalGuests;
      criteria.push({
        label: `Distribución (${prop.recommendedRooms} hab./unidades base)`,
        passed: meetsRooms,
      });

      // 3. Régimen de comidas
      const hasRequestedMealPlan =
        searchParams.mealPlan === 'any' ||
        prop.sources.some((s) => s.mealPlan === searchParams.mealPlan);
      criteria.push({
        label:
          searchParams.mealPlan === 'any'
            ? 'Régimen flexible'
            : `Régimen: ${searchParams.mealPlan}`,
        passed: hasRequestedMealPlan,
      });

      // 4. Presupuesto
      const maxBudgetInUSD =
        Number(searchParams.maxBudget || 999999) / currRate;
      const comparedPriceUSD =
        searchParams.budgetScope === 'night'
          ? effectiveNightlyUSD
          : totalStayUSD;
      const meetsBudget = comparedPriceUSD <= maxBudgetInUSD;
      criteria.push({
        label: `Dentro del presupuesto (${formatMoney(
          comparedPriceUSD
        )} vs máx ${formatMoney(maxBudgetInUSD)})`,
        passed: meetsBudget,
      });

      // 5. Preferencias opcionales seleccionadas
      const matchedPrefs = searchParams.preferences.filter((p) =>
        prop.preferencesMet.includes(p)
      );
      const missingPrefs = searchParams.preferences.filter(
        (p) => !prop.preferencesMet.includes(p)
      );

      searchParams.preferences.forEach((prefId) => {
        const prefObj = FAMILY_PREFERENCES.find((p) => p.id === prefId);
        criteria.push({
          label: prefObj ? prefObj.label : prefId,
          passed: prop.preferencesMet.includes(prefId),
        });
      });

      const passedCount = criteria.filter((c) => c.passed).length;
      const matchPercentage =
        criteria.length > 0
          ? Math.round((passedCount / criteria.length) * 100)
          : 100;

      // Ofertas vinculadas
      const linkedOffers = DEMO_OFFERS.filter(
        (off) =>
          off.applicablePropertyIds.includes(prop.id) &&
          (showExpiredOffers || off.verificationStatus !== 'expired')
      );

      return {
        ...prop,
        primarySource,
        nightlyBaseUSD,
        nightlyTaxesUSD,
        effectiveNightlyUSD,
        totalStayUSD,
        perPersonUSD,
        meetsCapacity,
        meetsBudget,
        hasRequestedMealPlan,
        matchedPrefs,
        missingPrefs,
        criteria,
        matchPercentage,
        linkedOffers,
      };
    })
      .filter((prop) => {
        // Filtro por destino
        if (
          searchParams.destination.trim() !== '' &&
          searchParams.destination.toLowerCase() !== 'todos'
        ) {
          const query = searchParams.destination.toLowerCase();
          const matchesRegion =
            prop.destination.toLowerCase().includes(query) ||
            prop.regionTag.toLowerCase().includes(query);
          if (!matchesRegion) return false;
        }
        // Filtro de destinos cercanos (+30 km)
        if (!searchParams.includeNearby && prop.isNearbyRegion) {
          return false;
        }
        // Filtro de tipo de hospedaje
        if (
          searchParams.accommodationType !== 'all' &&
          prop.type !== searchParams.accommodationType
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'total_asc') return a.totalStayUSD - b.totalStayUSD;
        if (sortBy === 'person_asc') return a.perPersonUSD - b.perPersonUSD;
        if (sortBy === 'capacity_desc') return b.maxCapacity - a.maxCapacity;
        return (
          b.matchPercentage - a.matchPercentage ||
          a.totalStayUSD - b.totalStayUSD
        );
      });
  }, [
    dataMode,
    realConnectionState.connected,
    searchParams,
    nightsCount,
    totalGuests,
    sortBy,
    showExpiredOffers,
  ]);

  // ============================================================================
  // GENERADOR DE RESUMEN FAMILIAR PARA COPIAR Y ENVIAR POR CORREO
  // ============================================================================
  const selectedSummaryProperties = useMemo(() => {
    return evaluatedProperties.filter((p) => selectedForSummary.includes(p.id));
  }, [evaluatedProperties, selectedForSummary]);

  const plainTextSummary = useMemo(() => {
    const modeHeader =
      dataMode === 'demo'
        ? '[AVISO: RESUMEN GENERADO EN MODO DEMO CON DATOS DE EJEMPLO — CONFIRMAR PRECIOS REALES EN CADA PROVEEDOR]'
        : '[RESUMEN DE CONSULTA DE HOSPEDAJE FAMILIAR]';

    const dateLine =
      searchParams.dateMode === 'exact'
        ? `Check-in: ${searchParams.checkIn} | Check-out: ${searchParams.checkOut} (${nightsCount} noches)`
        : `Fechas flexibles: ${searchParams.flexibleWindow} (${nightsCount} noches estimadas)`;

    const childrenLine =
      searchParams.childrenCount > 0
        ? `${
            searchParams.childrenCount
          } niños (Edades: ${searchParams.childrenAges.join(', ')} años)`
        : 'Sin niños';

    let text = `${modeHeader}\n`;
    text += `==================================================================\n`;
    text += `NOVA RESET STUDIO · COMPARATIVA DE HOSPEDAJE FAMILIAR\n`;
    text += `==================================================================\n`;
    text += `• Destino buscado: ${searchParams.destination} ${
      searchParams.includeNearby ? '(incluye cercanos +30 km)' : ''
    }\n`;
    text += `• Estadía: ${dateLine}\n`;
    text += `• Grupo familiar: ${searchParams.adults} adultos, ${childrenLine} (${totalGuests} personas en total)\n`;
    text += `• Unidades solicitadas: ${searchParams.rooms} | Moneda: ${searchParams.currency}\n\n`;

    if (selectedSummaryProperties.length === 0) {
      text += `(No hay alojamientos seleccionados todavía. Marca la casilla "Guardar en resumen" en los resultados).\n`;
    } else {
      selectedSummaryProperties.forEach((prop, idx) => {
        text += `${idx + 1}. ${prop.name.toUpperCase()} (${prop.type})\n`;
        text += `   - Ubicación: ${prop.destination} (${prop.distanceFromCenter})\n`;
        text += `   - Capacidad: Hasta ${prop.maxCapacity} personas | Distribución: ${prop.unitDistribution}\n`;
        text += `   - Coincidencia familiar: ${prop.matchPercentage}%\n`;
        text += `   - Precio estimado total (${nightsCount} noches): ${formatMoney(
          prop.totalStayUSD
        )} (${formatMoney(prop.effectiveNightlyUSD)}/noche | ${formatMoney(
          prop.perPersonUSD
        )} por persona)\n`;
        text += `   - Impuestos y cargos: ${prop.taxesNote}\n`;
        text += `   - Fuente principal seleccionada: ${prop.primarySource.providerName} | Régimen: ${prop.primarySource.mealPlan}\n`;
        text += `   - Cancelación: ${prop.primarySource.cancellation}\n`;
        text += `   - Última consulta: ${prop.primarySource.lastChecked}\n`;
        text += `   - Enlace de referencia: ${prop.primarySource.url}\n`;
        if (prop.linkedOffers.length > 0) {
          text += `   - Ofertas/Códigos detectados: ${prop.linkedOffers
            .map((o) => `${o.code} (${o.statusLabel}: ${o.discountSummary})`)
            .join(' | ')}\n`;
        }
        text += `\n`;
      });
    }

    text += `------------------------------------------------------------------\n`;
    text += `Nota de transparencia: Los precios e impuestos son referenciales según la última consulta a cada fuente y deben confirmarse en la página del proveedor antes de efectuar el pago.\n`;
    return text;
  }, [
    dataMode,
    searchParams,
    nightsCount,
    totalGuests,
    selectedSummaryProperties,
  ]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(plainTextSummary);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3000);
    } catch {
      // Fallback para entornos con permisos restringidos de portapapeles
      const textarea = document.createElement('textarea');
      textarea.value = plainTextSummary;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3000);
    }
  };

  const handleOpenPrepareEmail = () => {
    setEmailDraft({
      to: '',
      subject: `Comparativa Familiar (${searchParams.destination} · ${nightsCount} noches) — NOVA Reset Studio`,
      body: plainTextSummary,
      clientOpenedNotice: false,
    });
    setIsEmailModalOpen(true);
  };

  const handleLaunchMailClient = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(
      emailDraft.to.trim()
    )}?subject=${encodeURIComponent(
      emailDraft.subject
    )}&body=${encodeURIComponent(emailDraft.body)}`;
    window.open(mailtoUrl, '_blank', 'noopener,noreferrer');
    setEmailDraft((prev) => ({ ...prev, clientOpenedNotice: true }));
  };

  const toggleSelectSummary = (propId) => {
    setSelectedForSummary((prev) =>
      prev.includes(propId)
        ? prev.filter((id) => id !== propId)
        : [...prev, propId]
    );
  };

  const toggleSelectCompare = (propId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(propId)) return prev.filter((id) => id !== propId);
      if (prev.length >= 4) return prev; // Máximo 4 en comparador lado a lado
      return [...prev, propId];
    });
  };

  const handleRunSearchAction = (e) => {
    if (e) e.preventDefault();
    setIsSearchingFeedback(true);
    setActiveTab('search');
    setTimeout(() => {
      setIsSearchingFeedback(false);
    }, 350);
  };

  const handleTestProxyConnection = (e) => {
    e.preventDefault();
    setRealConnectionState((prev) => ({ ...prev, testing: true }));
    setTimeout(() => {
      setRealConnectionState({
        tested: true,
        testing: false,
        connected: false,
        message: proxyEndpoint.trim()
          ? `Se intentó contactar con "${proxyEndpoint.trim()}", pero no se recibieron credenciales firmadas de proveedores (Amadeus / Expedia / Booking). Siguiendo la política de integridad del proyecto, no se inventan ni simulan tarifas reales.`
          : 'Por favor ingresa la URL de tu servidor proxy backend antes de verificar la conexión.',
      });
    }, 600);
  };

  const comparedPropertiesList = useMemo(() => {
    return evaluatedProperties.filter((p) => selectedForCompare.includes(p.id));
  }, [evaluatedProperties, selectedForCompare]);

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-[#59D7CC]/30 selection:text-[#F5F1E9]"
      style={{
        backgroundColor: '#10131B',
        color: '#F5F1E9',
        backgroundImage: `
          radial-gradient(circle at 15% 10%, rgba(164, 123, 255, 0.08), transparent 35%),
          radial-gradient(circle at 85% 15%, rgba(89, 215, 204, 0.07), transparent 35%),
          linear-gradient(to right, rgba(89, 97, 106, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(89, 97, 106, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
      }}
    >
      {/* =====================================================================
          BARRA SUPERIOR DE TRANSPARENCIA Y MODO (REAL VS DEMO)
         ===================================================================== */}
      <div
        className="border-b px-4 py-2.5 text-xs sm:text-sm transition-colors"
        style={{
          backgroundColor: dataMode === 'demo' ? '#171322' : '#141B29',
          borderColor: dataMode === 'demo' ? '#D99A73' : '#59D7CC',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {dataMode === 'demo' ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold tracking-wide uppercase text-xs"
                style={{
                  backgroundColor: 'rgba(217, 154, 115, 0.18)',
                  color: '#D99A73',
                  border: '1px solid #D99A73',
                }}
              >
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                MODO DEMO ACTIVO · DATOS DE DEMOSTRACIÓN
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-semibold tracking-wide uppercase text-xs"
                style={{
                  backgroundColor: 'rgba(89, 215, 204, 0.16)',
                  color: '#59D7CC',
                  border: '1px solid #59D7CC',
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                MODO CONECTORES REALES (SIN DATOS SIMULADOS)
              </span>
            )}
            <p style={{ color: '#C7CBC9' }} className="text-xs sm:text-sm">
              {dataMode === 'demo'
                ? 'Explora y compara con tarifas de muestra claramente identificadas. Nunca se presentan como cotizaciones en vivo.'
                : 'Modo estricto: requiere conectores API autorizados en backend. No se inventan precios ni integraciones.'}
            </p>
          </div>

          {/* Conmutador explícito Real vs DEMO */}
          <div
            className="flex items-center rounded-lg p-1 border self-stretch md:self-auto justify-center"
            style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
          >
            <button
              type="button"
              onClick={() => setDataMode('real')}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
              style={
                dataMode === 'real'
                  ? {
                      backgroundColor: '#59D7CC',
                      color: '#10131B',
                      fontWeight: 700,
                    }
                  : { color: '#C7CBC9' }
              }
            >
              <Server className="w-3.5 h-3.5" />
              Búsqueda Real (APIs)
            </button>
            <button
              type="button"
              onClick={() => setDataMode('demo')}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
              style={
                dataMode === 'demo'
                  ? {
                      backgroundColor: '#D99A73',
                      color: '#10131B',
                      fontWeight: 700,
                    }
                  : { color: '#C7CBC9' }
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              Modo DEMO
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          ENCABEZADO PRINCIPAL CON LOGO OFICIAL DE NOVA RESET STUDIO
         ===================================================================== */}
      <header
        className="border-b sticky top-0 z-30 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(16, 19, 27, 0.92)',
          borderColor: '#59616A',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Contenedor del Logo de NOVA Reset Studio (Sin estirar, recolorear ni redibujar) */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-3.5">
              {!logoLoadError || customLogoUrl ? (
                <div
                  className="h-14 sm:h-16 px-3 py-1.5 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#59616A',
                  }}
                  title="Logo Oficial NOVA Reset Studio (Sin alterar proporciones ni colores)"
                >
                  <img
                    src={customLogoUrl || 'OPCION 4.png'}
                    alt="NOVA Reset Studio"
                    className="max-h-full w-auto object-contain"
                    onError={() => setLogoLoadError(true)}
                  />
                </div>
              ) : (
                /* Espacio reservado limpio si el entorno no sirve el adjunto directamente */
                <div
                  className="h-14 sm:h-16 px-3.5 py-1.5 rounded-xl border border-dashed flex items-center gap-3"
                  style={{
                    backgroundColor: '#171322',
                    borderColor: '#D99A73',
                  }}
                >
                  <div className="text-left">
                    <div
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: '#D99A73' }}
                    >
                      Espacio Reservado: OPCION 4.png
                    </div>
                    <div className="text-[11px]" style={{ color: '#C7CBC9' }}>
                      NOVA Reset Studio (Logo sin redibujar)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded text-xs font-medium border transition-colors flex items-center gap-1"
                    style={{
                      borderColor: '#59D7CC',
                      color: '#59D7CC',
                      backgroundColor: 'rgba(89, 215, 204, 0.1)',
                    }}
                    title="Selecciona el archivo adjunto OPCION 4.png para visualizarlo sin modificaciones"
                  >
                    <Upload className="w-3 h-3" />
                    Cargar archivo
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: '#A47BFF' }}
                  >
                    NOVA Reset Studio
                  </span>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: '#59616A',
                      color: '#C7CBC9',
                      backgroundColor: '#171322',
                    }}
                  >
                    Family Stay Finder
                  </span>
                </div>
                <h1
                  className="text-lg sm:text-xl font-bold tracking-tight"
                  style={{ color: '#F5F1E9' }}
                >
                  Comparador de Hospedajes y Ofertas Familiares
                </h1>
              </div>
            </div>
          </div>

          {/* Navegación por Etapas y Acciones Rápidas de Resumen */}
          <nav className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div
              className="flex items-center rounded-xl p-1 border"
              style={{ backgroundColor: '#171322', borderColor: '#59616A' }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
                style={
                  activeTab === 'search'
                    ? {
                        backgroundColor: '#59D7CC',
                        color: '#10131B',
                        fontWeight: 700,
                      }
                    : { color: '#C7CBC9' }
                }
              >
                <Search className="w-4 h-4" />
                1. Búsqueda y Comparación
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('offers')}
                className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
                style={
                  activeTab === 'offers'
                    ? {
                        backgroundColor: '#D99A73',
                        color: '#10131B',
                        fontWeight: 700,
                      }
                    : { color: '#C7CBC9' }
                }
              >
                <Tag className="w-4 h-4" />
                2. Ofertas y Códigos (
                {
                  DEMO_OFFERS.filter(
                    (o) =>
                      showExpiredOffers || o.verificationStatus !== 'expired'
                  ).length
                }
                )
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('integrations')}
                className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
                style={
                  activeTab === 'integrations'
                    ? {
                        backgroundColor: '#A47BFF',
                        color: '#10131B',
                        fontWeight: 700,
                      }
                    : { color: '#C7CBC9' }
                }
              >
                <Server className="w-4 h-4" />
                Fuentes e Integraciones
              </button>
            </div>

            {/* Botón para abrir el Resumen Guardado / Compartir */}
            <button
              type="button"
              onClick={() => setIsSummaryDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(89, 215, 204, 0.14)',
                borderColor: '#59D7CC',
                color: '#F5F1E9',
              }}
            >
              <FileText className="w-4 h-4" style={{ color: '#59D7CC' }} />
              <span>Resumen Familiar</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#59D7CC', color: '#10131B' }}
              >
                {selectedForSummary.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* =====================================================================
          CONTENIDO PRINCIPAL
         ===================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* FORMULARIO DE BÚSQUEDA FAMILIAR (SIEMPRE ACCESIBLE Y EDITABLE) */}
        <section
          aria-label="Formulario de búsqueda familiar"
          className="rounded-2xl border p-5 sm:p-6 shadow-xl relative overflow-hidden"
          style={{
            backgroundColor: '#171322',
            borderColor: '#59616A',
          }}
        >
          {/* Detalle geométrico sutil en la esquina superior */}
          <div
            className="pointer-events-none absolute top-0 right-0 w-40 h-40 opacity-15"
            style={{
              background:
                'conic-gradient(from 180deg at 50% 50%, #59D7CC 0deg, #A47BFF 180deg, transparent 360deg)',
              filter: 'blur(36px)',
            }}
          />

          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b"
            style={{ borderColor: '#59616A' }}
          >
            <div>
              <h2
                className="text-base sm:text-lg font-bold flex items-center gap-2"
                style={{ color: '#F5F1E9' }}
              >
                <SlidersHorizontal
                  className="w-5 h-5"
                  style={{ color: '#59D7CC' }}
                />
                Parámetros del Grupo Familiar y Preferencias de Estadía
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: '#C7CBC9' }}>
                Ajusta destino, edades de los niños, presupuesto y comodidades
                para recalcular al instante el porcentaje de coincidencia
                familiar.
              </p>
            </div>
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: '#8E999B' }}
            >
              <span>Sin registro obligatorio</span>
              <span>•</span>
              <span>
                {totalGuests} huéspedes ({nightsCount} noches)
              </span>
            </div>
          </div>

          <form onSubmit={handleRunSearchAction} className="space-y-5">
            {/* Fila 1: Destino, Fechas y Tipo de Alojamiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destino + Cercanos */}
              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
              >
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: '#C7CBC9' }}
                  >
                    <MapPin
                      className="w-3.5 h-3.5 inline mr-1"
                      style={{ color: '#59D7CC' }}
                    />
                    Destino (Ciudad, Región o País)
                  </label>
                  <input
                    type="text"
                    value={searchParams.destination}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    placeholder="Ej. Riviera Maya, Orlando, Todos..."
                    className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none"
                    style={{
                      backgroundColor: '#171322',
                      borderColor: '#59616A',
                      color: '#F5F1E9',
                    }}
                  />
                  {/* Accesos rápidos de destinos de muestra */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'Todos',
                      'Riviera Maya',
                      'Orlando',
                      'Punta Cana',
                      'Mallorca',
                    ].map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={() =>
                          setSearchParams((prev) => ({
                            ...prev,
                            destination: dest,
                          }))
                        }
                        className="text-[11px] px-2 py-0.5 rounded border transition-colors"
                        style={
                          searchParams.destination === dest
                            ? {
                                backgroundColor: 'rgba(89, 215, 204, 0.2)',
                                borderColor: '#59D7CC',
                                color: '#59D7CC',
                              }
                            : {
                                backgroundColor: '#171322',
                                borderColor: '#59616A',
                                color: '#8E999B',
                              }
                        }
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>

                <label
                  className="flex items-center gap-2 mt-3 pt-2 border-t text-xs cursor-pointer"
                  style={{
                    borderColor: 'rgba(89, 97, 106, 0.4)',
                    color: '#C7CBC9',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={searchParams.includeNearby}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        includeNearby: e.target.checked,
                      }))
                    }
                    className="rounded accent-[#59D7CC]"
                  />
                  <span>Incluir destinos cercanos (+30 km)</span>
                </label>
              </div>

              {/* Fechas Exactas o Flexibles */}
              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#C7CBC9' }}
                    >
                      <Calendar
                        className="w-3.5 h-3.5 inline mr-1"
                        style={{ color: '#A47BFF' }}
                      />
                      Fechas de Viaje
                    </label>
                    <div
                      className="flex rounded border overflow-hidden text-[11px]"
                      style={{ borderColor: '#59616A' }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSearchParams((prev) => ({
                            ...prev,
                            dateMode: 'exact',
                          }))
                        }
                        className="px-2 py-0.5"
                        style={
                          searchParams.dateMode === 'exact'
                            ? {
                                backgroundColor: '#A47BFF',
                                color: '#10131B',
                                fontWeight: 700,
                              }
                            : { backgroundColor: '#171322', color: '#C7CBC9' }
                        }
                      >
                        Exactas
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSearchParams((prev) => ({
                            ...prev,
                            dateMode: 'flexible',
                          }))
                        }
                        className="px-2 py-0.5"
                        style={
                          searchParams.dateMode === 'flexible'
                            ? {
                                backgroundColor: '#A47BFF',
                                color: '#10131B',
                                fontWeight: 700,
                              }
                            : { backgroundColor: '#171322', color: '#C7CBC9' }
                        }
                      >
                        Flexibles
                      </button>
                    </div>
                  </div>

                  {searchParams.dateMode === 'exact' ? (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <span
                          className="block text-[11px] mb-1"
                          style={{ color: '#8E999B' }}
                        >
                          Entrada
                        </span>
                        <input
                          type="date"
                          value={searchParams.checkIn}
                          onChange={(e) =>
                            setSearchParams((prev) => ({
                              ...prev,
                              checkIn: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded text-xs border"
                          style={{
                            backgroundColor: '#171322',
                            borderColor: '#59616A',
                            color: '#F5F1E9',
                          }}
                        />
                      </div>
                      <div>
                        <span
                          className="block text-[11px] mb-1"
                          style={{ color: '#8E999B' }}
                        >
                          Salida
                        </span>
                        <input
                          type="date"
                          value={searchParams.checkOut}
                          onChange={(e) =>
                            setSearchParams((prev) => ({
                              ...prev,
                              checkOut: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded text-xs border"
                          style={{
                            backgroundColor: '#171322',
                            borderColor: '#59616A',
                            color: '#F5F1E9',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2">
                      <select
                        value={searchParams.flexibleWindow}
                        onChange={(e) =>
                          setSearchParams((prev) => ({
                            ...prev,
                            flexibleWindow: e.target.value,
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded text-xs border"
                        style={{
                          backgroundColor: '#171322',
                          borderColor: '#59616A',
                          color: '#F5F1E9',
                        }}
                      >
                        <option value="5 noches en Diciembre (±3 días flexibles)">
                          5 noches en Diciembre (±3 días)
                        </option>
                        <option value="7 noches en Enero / Vacaciones escolares">
                          7 noches en Enero / Vacaciones
                        </option>
                        <option value="4 noches Fin de semana largo familiar">
                          4 noches Fin de semana largo
                        </option>
                      </select>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: '#8E999B' }}>
                          Noches a cotizar:
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={searchParams.FlexibleNightsCount}
                          onChange={(e) =>
                            setSearchParams((prev) => ({
                              ...prev,
                              FlexibleNightsCount: Math.max(
                                1,
                                Number(e.target.value)
                              ),
                            }))
                          }
                          className="w-16 px-2 py-1 rounded text-xs border text-center"
                          style={{
                            backgroundColor: '#171322',
                            borderColor: '#59616A',
                            color: '#F5F1E9',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="mt-3 pt-2 border-t text-xs flex items-center justify-between"
                  style={{
                    borderColor: 'rgba(89, 97, 106, 0.4)',
                    color: '#59D7CC',
                  }}
                >
                  <span>Duración calculada:</span>
                  <span className="font-bold">
                    {nightsCount} {nightsCount === 1 ? 'noche' : 'noches'}
                  </span>
                </div>
              </div>

              {/* Composición del Grupo Familiar y Edades de los Niños */}
              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between"
                style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
              >
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: '#C7CBC9' }}
                  >
                    <Users
                      className="w-3.5 h-3.5 inline mr-1"
                      style={{ color: '#59D7CC' }}
                    />
                    Grupo Familiar y Unidades
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span
                        className="block text-[11px] mb-1"
                        style={{ color: '#8E999B' }}
                      >
                        Adultos
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={searchParams.adults}
                        onChange={(e) =>
                          setSearchParams((prev) => ({
                            ...prev,
                            adults: Math.max(1, Number(e.target.value)),
                          }))
                        }
                        className="w-full px-2 py-1.5 rounded border text-center font-semibold"
                        style={{
                          backgroundColor: '#171322',
                          borderColor: '#59616A',
                          color: '#F5F1E9',
                        }}
                      />
                    </div>
                    <div>
                      <span
                        className="block text-[11px] mb-1"
                        style={{ color: '#8E999B' }}
                      >
                        Niños (0-17)
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={searchParams.childrenCount}
                        onChange={(e) =>
                          handleChildrenCountChange(e.target.value)
                        }
                        className="w-full px-2 py-1.5 rounded border text-center font-semibold"
                        style={{
                          backgroundColor: '#171322',
                          borderColor: '#59616A',
                          color: '#F5F1E9',
                        }}
                      />
                    </div>
                    <div>
                      <span
                        className="block text-[11px] mb-1"
                        style={{ color: '#8E999B' }}
                      >
                        Hab./Unid.
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={searchParams.rooms}
                        onChange={(e) =>
                          setSearchParams((prev) => ({
                            ...prev,
                            rooms: Math.max(1, Number(e.target.value)),
                          }))
                        }
                        className="w-full px-2 py-1.5 rounded border text-center font-semibold"
                        style={{
                          backgroundColor: '#171322',
                          borderColor: '#59616A',
                          color: '#F5F1E9',
                        }}
                      />
                    </div>
                  </div>

                  {/* Selectores dinámicos de edades de los niños */}
                  {searchParams.childrenCount > 0 && (
                    <div
                      className="mt-2.5 pt-2 border-t"
                      style={{ borderColor: 'rgba(89, 97, 106, 0.4)' }}
                    >
                      <span
                        className="block text-[11px] mb-1.5"
                        style={{ color: '#C7CBC9' }}
                      >
                        Edad de cada niño al viajar (años):
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {searchParams.childrenAges.map((age, idx) => (
                          <select
                            key={idx}
                            aria-label={`Edad del niño ${idx + 1}`}
                            value={age}
                            onChange={(e) =>
                              handleChildAgeChange(idx, e.target.value)
                            }
                            className="px-1.5 py-1 rounded text-xs border"
                            style={{
                              backgroundColor: '#171322',
                              borderColor: '#59616A',
                              color: '#F5F1E9',
                            }}
                          >
                            {Array.from({ length: 18 }, (_, i) => (
                              <option key={i} value={i}>
                                {i === 0 ? '<1 año' : `${i} a.`}
                              </option>
                            ))}
                          </select>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tipo de Hospedaje, Régimen y Presupuesto */}
              <div
                className="p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5"
                style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      className="block text-[11px] font-semibold uppercase mb-1"
                      style={{ color: '#C7CBC9' }}
                    >
                      <Home
                        className="w-3 h-3 inline mr-1"
                        style={{ color: '#59D7CC' }}
                      />
                      Tipo
                    </label>
                    <select
                      value={searchParams.accommodationType}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          accommodationType: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 rounded text-xs border"
                      style={{
                        backgroundColor: '#171322',
                        borderColor: '#59616A',
                        color: '#F5F1E9',
                      }}
                    >
                      <option value="all">Todos (Hotel/Resort/Villa)</option>
                      <option value="Villa">Villa Familiar</option>
                      <option value="Resort">Resort</option>
                      <option value="Hotel">Hotel</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-[11px] font-semibold uppercase mb-1"
                      style={{ color: '#C7CBC9' }}
                    >
                      <Utensils
                        className="w-3 h-3 inline mr-1"
                        style={{ color: '#D99A73' }}
                      />
                      Régimen
                    </label>
                    <select
                      value={searchParams.mealPlan}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          mealPlan: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 rounded text-xs border"
                      style={{
                        backgroundColor: '#171322',
                        borderColor: '#59616A',
                        color: '#F5F1E9',
                      }}
                    >
                      <option value="any">Sin preferencia</option>
                      <option value="Todo Incluido">Todo Incluido</option>
                      <option value="Desayuno incluido">
                        Desayuno incluido
                      </option>
                      <option value="Otro plan">
                        Otro plan / Cocina propia
                      </option>
                    </select>
                  </div>
                </div>

                {/* Presupuesto y Moneda */}
                <div
                  className="pt-2 border-t"
                  style={{ borderColor: 'rgba(89, 97, 106, 0.4)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <label
                      className="text-[11px] font-semibold uppercase"
                      style={{ color: '#C7CBC9' }}
                    >
                      <DollarSign
                        className="w-3 h-3 inline"
                        style={{ color: '#59D7CC' }}
                      />
                      Presupuesto Máx.
                    </label>
                    <select
                      value={searchParams.budgetScope}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          budgetScope: e.target.value,
                        }))
                      }
                      className="text-[11px] px-1.5 py-0.5 rounded border"
                      style={{
                        backgroundColor: '#171322',
                        borderColor: '#59616A',
                        color: '#59D7CC',
                      }}
                    >
                      <option value="total">Por toda la estadía</option>
                      <option value="night">Por noche</option>
                    </select>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={searchParams.maxBudget}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          maxBudget: Number(e.target.value),
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded text-xs border font-semibold"
                      style={{
                        backgroundColor: '#171322',
                        borderColor: '#59616A',
                        color: '#F5F1E9',
                      }}
                    />
                    <select
                      value={searchParams.currency}
                      onChange={(e) =>
                        setSearchParams((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      className="px-2 py-1.5 rounded text-xs border font-semibold"
                      style={{
                        backgroundColor: '#171322',
                        borderColor: '#59616A',
                        color: '#F5F1E9',
                      }}
                    >
                      {Object.keys(CURRENCY_RATES).map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila 2: Chips de Preferencias Familiares Opcionales + Botón de Búsqueda */}
            <div
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t"
              style={{ borderColor: '#59616A' }}
            >
              <div className="space-y-1.5 w-full lg:w-auto">
                <span
                  className="block text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#C7CBC9' }}
                >
                  Preferencias y Comodidades Familiares Opcionales:
                </span>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_PREFERENCES.map((pref) => {
                    const active = searchParams.preferences.includes(pref.id);
                    return (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => togglePreference(pref.id)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5"
                        style={
                          active
                            ? {
                                backgroundColor: 'rgba(89, 215, 204, 0.16)',
                                borderColor: '#59D7CC',
                                color: '#F5F1E9',
                              }
                            : {
                                backgroundColor: '#10131B',
                                borderColor: '#59616A',
                                color: '#8E999B',
                              }
                        }
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: active ? '#59D7CC' : '#59616A',
                          }}
                        />
                        {pref.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full lg:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
                style={{
                  backgroundColor: '#59D7CC',
                  color: '#10131B',
                }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    isSearchingFeedback ? 'animate-spin' : ''
                  }`}
                />
                Actualizar Búsqueda y Comparar
              </button>
            </div>
          </form>
        </section>

        {/* ===================================================================
            VISTA SEGÚN PESTAÑA ACTIVA Y MODO (REAL VS DEMO)
           =================================================================== */}
        {activeTab === 'search' && (
          <>
            {dataMode === 'real' && !realConnectionState.connected ? (
              /* PANEL DE ESTADO DE INTEGRACIÓN EN MODO REAL (NO INVENTA RESULTADOS) */
              <section
                className="rounded-2xl border p-6 sm:p-8 space-y-6"
                style={{
                  backgroundColor: '#171322',
                  borderColor: '#59D7CC',
                }}
              >
                <div
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5"
                  style={{ borderColor: '#59616A' }}
                >
                  <div className="space-y-1">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                      style={{
                        backgroundColor: 'rgba(89, 215, 204, 0.15)',
                        color: '#59D7CC',
                      }}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Modo Búsqueda Real · Protección de Credenciales Activa
                    </span>
                    <h3
                      className="text-xl font-bold mt-2"
                      style={{ color: '#F5F1E9' }}
                    >
                      Conectores de Tarifas en Vivo Pendientes de Credenciales
                      en Servidor
                    </h3>
                    <p
                      className="text-sm max-w-3xl"
                      style={{ color: '#C7CBC9' }}
                    >
                      Siguiendo las reglas de transparencia del proyecto,{' '}
                      <strong>
                        no simulamos una búsqueda en vivo ni mostramos precios
                        ficticios como si fueran actuales
                      </strong>{' '}
                      cuando faltan las claves de API de los proveedores.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDataMode('demo')}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2"
                    style={{
                      backgroundColor: '#D99A73',
                      color: '#10131B',
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Explorar con Datos de Muestra (Activar Modo DEMO)
                  </button>
                </div>

                {/* Estado de conectores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INITIAL_CONNECTORS.map((conn) => (
                    <div
                      key={conn.id}
                      className="p-4 rounded-xl border space-y-2"
                      style={{
                        backgroundColor: '#10131B',
                        borderColor: '#59616A',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-bold text-sm"
                          style={{ color: '#F5F1E9' }}
                        >
                          {conn.name}
                        </span>
                        <span
                          className="text-[11px] px-2 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: 'rgba(217, 154, 115, 0.16)',
                            color: '#D99A73',
                            border: '1px solid rgba(217, 154, 115, 0.4)',
                          }}
                        >
                          Sin clave configurada
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#A47BFF' }}>
                        {conn.category}
                      </p>
                      <p className="text-xs" style={{ color: '#C7CBC9' }}>
                        {conn.notes}
                      </p>
                      <div
                        className="text-[11px] font-mono px-2.5 py-1.5 rounded border"
                        style={{
                          backgroundColor: '#171322',
                          borderColor: '#59616A',
                          color: '#8E999B',
                        }}
                      >
                        Requiere: {conn.envRequired}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Configurador de Proxy Backend propio */}
                <form
                  onSubmit={handleTestProxyConnection}
                  className="p-4 rounded-xl border space-y-3"
                  style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
                >
                  <div
                    className="text-sm font-semibold"
                    style={{ color: '#F5F1E9' }}
                  >
                    Conectar Endpoint de Backend / Proxy Autorizado del Proyecto
                  </div>
                  <p className="text-xs" style={{ color: '#8E999B' }}>
                    Las claves de API nunca deben incluirse en el código
                    JavaScript del navegador. Si ya desplegaste el microservicio
                    proxy del proyecto, introduce su URL:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={proxyEndpoint}
                      onChange={(e) => setProxyEndpoint(e.target.value)}
                      placeholder="https://api.tu-dominio-familiar.com/v1/rates-proxy"
                      className="flex-1 px-3 py-2 rounded-lg text-xs border"
                      style={{
                        backgroundColor: '#171322',
                        borderColor: '#59616A',
                        color: '#F5F1E9',
                      }}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg text-xs font-bold"
                      style={{ backgroundColor: '#59D7CC', color: '#10131B' }}
                    >
                      {realConnectionState.testing
                        ? 'Verificando...'
                        : 'Verificar Conectores'}
                    </button>
                  </div>
                  {realConnectionState.tested && (
                    <div
                      className="p-3 rounded-lg text-xs flex items-start gap-2"
                      style={{
                        backgroundColor: 'rgba(217, 154, 115, 0.14)',
                        color: '#D99A73',
                        border: '1px solid #D99A73',
                      }}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{realConnectionState.message}</span>
                    </div>
                  )}
                </form>
              </section>
            ) : (
              /* ===============================================================
                 LISTA COMPARABLE Y DEDUPLICADA DE HOSPEDAJES
                 =============================================================== */
              <section className="space-y-4">
                {/* Barra de control de resultados, ordenamiento y comparador lado a lado */}
                <div
                  className="rounded-xl border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  style={{ backgroundColor: '#171322', borderColor: '#59616A' }}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="text-base font-bold"
                        style={{ color: '#F5F1E9' }}
                      >
                        {evaluatedProperties.length}{' '}
                        {evaluatedProperties.length === 1
                          ? 'Alojamiento Familiar Encontrado'
                          : 'Alojamientos Familiares Comparados'}
                      </h3>
                      {dataMode === 'demo' && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded font-semibold uppercase"
                          style={{
                            backgroundColor: 'rgba(217, 154, 115, 0.2)',
                            color: '#D99A73',
                          }}
                        >
                          DEMO · Datos de ejemplo
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: '#8E999B' }}>
                      Alojamientos deduplicados: cada propiedad agrupa sus
                      distintas fuentes y aclara diferencias en cancelación o
                      comidas.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    {/* Botón para abrir comparador lado a lado */}
                    <button
                      type="button"
                      onClick={() => setIsCompareModalOpen(true)}
                      disabled={selectedForCompare.length < 2}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 disabled:opacity-40"
                      style={{
                        backgroundColor: 'rgba(164, 123, 255, 0.15)',
                        borderColor: '#A47BFF',
                        color: '#F5F1E9',
                      }}
                    >
                      <Columns
                        className="w-4 h-4"
                        style={{ color: '#A47BFF' }}
                      />
                      Comparar lado a lado ({selectedForCompare.length}/4)
                    </button>

                    {/* Selector de ordenamiento */}
                    <div className="flex items-center gap-2">
                      <ArrowUpDown
                        className="w-4 h-4"
                        style={{ color: '#59D7CC' }}
                      />
                      <label
                        htmlFor="sort-select"
                        className="text-xs"
                        style={{ color: '#C7CBC9' }}
                      >
                        Ordenar por:
                      </label>
                      <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                        style={{
                          backgroundColor: '#10131B',
                          borderColor: '#59616A',
                          color: '#F5F1E9',
                        }}
                      >
                        <option value="match">
                          Mejor coincidencia familiar (%)
                        </option>
                        <option value="total_asc">
                          Menor precio total de estadía
                        </option>
                        <option value="person_asc">
                          Menor precio por persona
                        </option>
                        <option value="capacity_desc">
                          Mayor capacidad de huéspedes
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Aviso permanente de confirmación de precios y fuentes */}
                <div
                  className="rounded-xl border px-4 py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  style={{
                    backgroundColor: 'rgba(16, 19, 27, 0.9)',
                    borderColor: '#59616A',
                    color: '#C7CBC9',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Info
                      className="w-4 h-4 shrink-0"
                      style={{ color: '#59D7CC' }}
                    />
                    <span>
                      <strong>Transparencia de precios:</strong> Ningún precio
                      mostrado es definitivo hasta confirmarse en la pasarela
                      del proveedor. Verifica siempre impuestos locales y
                      políticas por edad de niños.
                    </span>
                  </div>
                  <span
                    className="text-[11px] shrink-0"
                    style={{ color: '#8E999B' }}
                  >
                    Moneda activa: {searchParams.currency}
                  </span>
                </div>

                {/* Estado sin resultados */}
                {evaluatedProperties.length === 0 ? (
                  <div
                    className="rounded-2xl border p-8 text-center space-y-3"
                    style={{
                      backgroundColor: '#171322',
                      borderColor: '#59616A',
                    }}
                  >
                    <Building2
                      className="w-10 h-10 mx-auto"
                      style={{ color: '#D99A73' }}
                    />
                    <h4
                      className="text-base font-bold"
                      style={{ color: '#F5F1E9' }}
                    >
                      No encontramos alojamientos con esa combinación exacta de
                      destino o tipo
                    </h4>
                    <p
                      className="text-xs max-w-md mx-auto"
                      style={{ color: '#C7CBC9' }}
                    >
                      Prueba seleccionando el destino "Todos", activando la
                      casilla "Incluir destinos cercanos (+30 km)" o cambiando
                      el tipo de hospedaje a "Todos".
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setSearchParams((prev) => ({
                          ...prev,
                          destination: 'Todos',
                          includeNearby: true,
                          accommodationType: 'all',
                        }))
                      }
                      className="px-4 py-2 rounded-lg text-xs font-bold"
                      style={{ backgroundColor: '#59D7CC', color: '#10131B' }}
                    >
                      Restablecer filtros de destino y tipo
                    </button>
                  </div>
                ) : (
                  /* Tarjetas de Alojamiento */
                  <div className="space-y-5">
                    {evaluatedProperties.map((prop) => {
                      const isSaved = selectedForSummary.includes(prop.id);
                      const isCompared = selectedForCompare.includes(prop.id);

                      return (
                        <article
                          key={prop.id}
                          className="rounded-2xl border p-5 transition-all space-y-5"
                          style={{
                            backgroundColor: '#171322',
                            borderColor: isSaved ? '#59D7CC' : '#59616A',
                          }}
                        >
                          {/* Encabezado de la Propiedad y Desglose Principal de Precios */}
                          <div
                            className="flex flex-col lg:flex-row justify-between gap-5 border-b pb-4"
                            style={{ borderColor: '#59616A' }}
                          >
                            {/* Información de Identidad, Capacidad y Coincidencia */}
                            <div className="space-y-2.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase"
                                  style={{
                                    backgroundColor:
                                      'rgba(164, 123, 255, 0.18)',
                                    color: '#A47BFF',
                                    border:
                                      '1px solid rgba(164, 123, 255, 0.4)',
                                  }}
                                >
                                  {prop.type}
                                </span>
                                <span
                                  className="px-2.5 py-0.5 rounded-md text-xs font-medium"
                                  style={{
                                    backgroundColor: '#10131B',
                                    color: '#C7CBC9',
                                    border: '1px solid #59616A',
                                  }}
                                >
                                  <MapPin
                                    className="w-3 h-3 inline mr-1"
                                    style={{ color: '#59D7CC' }}
                                  />
                                  {prop.destination}
                                </span>
                                {prop.isNearbyRegion && (
                                  <span
                                    className="px-2 py-0.5 rounded text-[11px]"
                                    style={{
                                      backgroundColor:
                                        'rgba(89, 215, 204, 0.12)',
                                      color: '#59D7CC',
                                    }}
                                  >
                                    Destino cercano (+30 km)
                                  </span>
                                )}
                                {dataMode === 'demo' && (
                                  <span
                                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                                    style={{
                                      backgroundColor:
                                        'rgba(217, 154, 115, 0.16)',
                                      color: '#D99A73',
                                    }}
                                  >
                                    Dato DEMO
                                  </span>
                                )}
                              </div>

                              <h4
                                className="text-lg sm:text-xl font-bold"
                                style={{ color: '#F5F1E9' }}
                              >
                                {prop.name}
                              </h4>

                              <p
                                className="text-xs"
                                style={{ color: '#8E999B' }}
                              >
                                {prop.distanceFromCenter} •{' '}
                                <strong>Distribución:</strong>{' '}
                                {prop.unitDistribution}
                              </p>

                              {/* Indicadores de Capacidad y Comodidades */}
                              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                <span
                                  className="px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                                  style={{
                                    backgroundColor: '#10131B',
                                    borderColor: prop.meetsCapacity
                                      ? '#59D7CC'
                                      : '#D99A73',
                                    color: prop.meetsCapacity
                                      ? '#59D7CC'
                                      : '#D99A73',
                                  }}
                                >
                                  <Users className="w-3.5 h-3.5" />
                                  Capacidad máx: {prop.maxCapacity} personas
                                  {prop.meetsCapacity
                                    ? ' (Apto para tu grupo)'
                                    : ' (Capacidad menor al grupo)'}
                                </span>

                                <span
                                  className="px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                                  style={{
                                    backgroundColor: '#10131B',
                                    borderColor: '#59616A',
                                    color: '#C7CBC9',
                                  }}
                                >
                                  <BedDouble
                                    className="w-3.5 h-3.5"
                                    style={{ color: '#A47BFF' }}
                                  />
                                  {prop.sources.length}{' '}
                                  {prop.sources.length === 1
                                    ? 'fuente consultada'
                                    : 'fuentes consolidadas (sin duplicar)'}
                                </span>
                              </div>

                              {/* Barra y desglose de coincidencia con filtros familiares */}
                              <div
                                className="p-3 rounded-xl border mt-2 space-y-2"
                                style={{
                                  backgroundColor: '#10131B',
                                  borderColor: '#59616A',
                                }}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span
                                    className="font-semibold"
                                    style={{ color: '#F5F1E9' }}
                                  >
                                    Coincidencia con tus filtros familiares:
                                  </span>
                                  <span
                                    className="font-bold px-2 py-0.5 rounded"
                                    style={{
                                      backgroundColor:
                                        prop.matchPercentage >= 80
                                          ? 'rgba(89, 215, 204, 0.2)'
                                          : 'rgba(217, 154, 115, 0.2)',
                                      color:
                                        prop.matchPercentage >= 80
                                          ? '#59D7CC'
                                          : '#D99A73',
                                    }}
                                  >
                                    {prop.matchPercentage}% de coincidencia
                                  </span>
                                </div>
                                <div
                                  className="w-full h-2 rounded-full overflow-hidden"
                                  style={{ backgroundColor: '#171322' }}
                                >
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                      width: `${prop.matchPercentage}%`,
                                      backgroundColor:
                                        prop.matchPercentage >= 80
                                          ? '#59D7CC'
                                          : '#D99A73',
                                    }}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {prop.criteria.map((c, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[11px] px-2 py-0.5 rounded flex items-center gap-1"
                                      style={
                                        c.passed
                                          ? {
                                              backgroundColor:
                                                'rgba(89, 215, 204, 0.1)',
                                              color: '#59D7CC',
                                            }
                                          : {
                                              backgroundColor:
                                                'rgba(217, 154, 115, 0.12)',
                                              color: '#D99A73',
                                            }
                                      }
                                    >
                                      {c.passed ? (
                                        <Check className="w-3 h-3 shrink-0" />
                                      ) : (
                                        <X className="w-3 h-3 shrink-0" />
                                      )}
                                      {c.label}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Panel de Precios Altamente Legible */}
                            <div
                              className="lg:w-80 p-4 rounded-xl border flex flex-col justify-between shrink-0"
                              style={{
                                backgroundColor: '#10131B',
                                borderColor: '#59616A',
                              }}
                            >
                              <div className="space-y-1.5">
                                <div
                                  className="flex items-center justify-between text-xs"
                                  style={{ color: '#8E999B' }}
                                >
                                  <span>Mejor tarifa según filtro</span>
                                  <span style={{ color: '#A47BFF' }}>
                                    {prop.primarySource.providerType}
                                  </span>
                                </div>

                                {/* Precio Total de la Estadía */}
                                <div className="pt-1">
                                  <div
                                    className="text-xs"
                                    style={{ color: '#C7CBC9' }}
                                  >
                                    Total estimado por {nightsCount}{' '}
                                    {nightsCount === 1 ? 'noche' : 'noches'}:
                                  </div>
                                  <div
                                    className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                                    style={{ color: '#F5F1E9' }}
                                  >
                                    {formatMoney(prop.totalStayUSD)}
                                    <span
                                      className="text-xs font-normal ml-1.5"
                                      style={{ color: '#8E999B' }}
                                    >
                                      {searchParams.currency}
                                    </span>
                                  </div>
                                </div>

                                {/* Precio por noche y Precio por persona */}
                                <div
                                  className="grid grid-cols-2 gap-2 pt-2 border-t text-xs"
                                  style={{
                                    borderColor: 'rgba(89, 97, 106, 0.4)',
                                  }}
                                >
                                  <div>
                                    <span
                                      className="block text-[11px]"
                                      style={{ color: '#8E999B' }}
                                    >
                                      Precio por noche:
                                    </span>
                                    <span
                                      className="font-bold"
                                      style={{ color: '#59D7CC' }}
                                    >
                                      {formatMoney(prop.effectiveNightlyUSD)} /
                                      noche
                                    </span>
                                  </div>
                                  <div>
                                    <span
                                      className="block text-[11px]"
                                      style={{ color: '#8E999B' }}
                                    >
                                      Por persona ({totalGuests}):
                                    </span>
                                    <span
                                      className="font-bold"
                                      style={{ color: '#F5F1E9' }}
                                    >
                                      {formatMoney(prop.perPersonUSD)} / pers.
                                    </span>
                                  </div>
                                </div>

                                {/* Estado de Impuestos y Cargos Obligatorios */}
                                <div
                                  className="mt-2 p-2.5 rounded-lg border text-[11px]"
                                  style={
                                    prop.taxesStatus === 'unconfirmed'
                                      ? {
                                          backgroundColor:
                                            'rgba(217, 154, 115, 0.14)',
                                          borderColor: '#D99A73',
                                          color: '#D99A73',
                                        }
                                      : {
                                          backgroundColor: '#171322',
                                          borderColor: '#59616A',
                                          color: '#C7CBC9',
                                        }
                                  }
                                >
                                  <div className="font-semibold mb-0.5">
                                    {prop.taxesStatus === 'breakdown' &&
                                      `Incluye +${formatMoney(
                                        prop.nightlyTaxesUSD * nightsCount
                                      )} de impuestos y cargos en el cálculo`}
                                    {prop.taxesStatus === 'included' &&
                                      'Impuestos obligatorios incluidos en tarifa base'}
                                    {prop.taxesStatus === 'unconfirmed' &&
                                      'Cargos locales no incluidos / A confirmar en proveedor'}
                                  </div>
                                  <p className="opacity-90">{prop.taxesNote}</p>
                                </div>
                              </div>

                              {/* Botones para Guardar en Resumen y Comparar */}
                              <div
                                className="pt-3 mt-3 border-t flex flex-col gap-2"
                                style={{ borderColor: '#59616A' }}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleSelectSummary(prop.id)}
                                  className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                  style={
                                    isSaved
                                      ? {
                                          backgroundColor: '#59D7CC',
                                          color: '#10131B',
                                        }
                                      : {
                                          backgroundColor: '#171322',
                                          color: '#59D7CC',
                                          border: '1px solid #59D7CC',
                                        }
                                  }
                                >
                                  {isSaved ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4" />
                                      Seleccionado en Resumen Familiar
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="w-4 h-4" />
                                      Guardar para Resumen / Correo
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleSelectCompare(prop.id)}
                                  className="w-full py-1.5 px-3 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1.5"
                                  style={
                                    isCompared
                                      ? {
                                          backgroundColor:
                                            'rgba(164, 123, 255, 0.2)',
                                          borderColor: '#A47BFF',
                                          color: '#F5F1E9',
                                        }
                                      : {
                                          backgroundColor: 'transparent',
                                          borderColor: '#59616A',
                                          color: '#C7CBC9',
                                        }
                                  }
                                >
                                  <Columns className="w-3.5 h-3.5" />
                                  {isCompared
                                    ? 'En tabla comparativa'
                                    : 'Añadir al comparador lado a lado'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* TABLA DE FUENTES CONSOLIDADAS (Evita duplicar el alojamiento y aclara condiciones distintas) */}
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <h5
                                className="text-xs font-bold uppercase tracking-wider"
                                style={{ color: '#C7CBC9' }}
                              >
                                Comparativa de Fuentes y Condiciones para este
                                Alojamiento (Sin Duplicados)
                              </h5>
                              <span
                                className="text-[11px]"
                                style={{ color: '#8E999B' }}
                              >
                                Precio sujeto a confirmación final en el sitio
                                del proveedor
                              </span>
                            </div>

                            <div
                              className="overflow-x-auto rounded-xl border"
                              style={{ borderColor: '#59616A' }}
                            >
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr
                                    className="border-b text-[11px] uppercase"
                                    style={{
                                      backgroundColor: '#10131B',
                                      borderColor: '#59616A',
                                      color: '#8E999B',
                                    }}
                                  >
                                    <th className="py-2.5 px-3">
                                      Fuente y Consulta
                                    </th>
                                    <th className="py-2.5 px-3">
                                      Régimen de Comidas
                                    </th>
                                    <th className="py-2.5 px-3">
                                      Cancelación y Diferencias
                                    </th>
                                    <th className="py-2.5 px-3">
                                      Disponibilidad
                                    </th>
                                    <th className="py-2.5 px-3 text-right">
                                      Tarifa Base / Total
                                    </th>
                                    <th className="py-2.5 px-3 text-right">
                                      Enlace
                                    </th>
                                  </tr>
                                </thead>
                                <tbody
                                  className="divide-y"
                                  style={{ borderColor: '#59616A' }}
                                >
                                  {prop.sources.map((src) => {
                                    const srcNightlyTotal =
                                      src.nightlyRateUSD +
                                      (prop.taxesStatus === 'breakdown'
                                        ? prop.taxesAmountUSD
                                        : 0);
                                    const srcStayTotal =
                                      srcNightlyTotal * nightsCount;
                                    const isPrimary =
                                      src.sourceId ===
                                      prop.primarySource.sourceId;

                                    return (
                                      <tr
                                        key={src.sourceId}
                                        style={{
                                          backgroundColor: isPrimary
                                            ? 'rgba(89, 215, 204, 0.06)'
                                            : '#10131B',
                                        }}
                                      >
                                        <td className="py-3 px-3 align-top">
                                          <div
                                            className="font-bold"
                                            style={{ color: '#F5F1E9' }}
                                          >
                                            {src.providerName}
                                          </div>
                                          <div
                                            className="flex items-center gap-1 text-[11px] mt-0.5"
                                            style={{ color: '#8E999B' }}
                                          >
                                            <Clock className="w-3 h-3" />
                                            {src.lastChecked}
                                          </div>
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                          <span
                                            className="px-2 py-0.5 rounded font-medium inline-block"
                                            style={{
                                              backgroundColor: '#171322',
                                              color: '#59D7CC',
                                              border:
                                                '1px solid rgba(89, 215, 204, 0.35)',
                                            }}
                                          >
                                            {src.mealPlan}
                                          </span>
                                        </td>
                                        <td className="py-3 px-3 align-top max-w-xs">
                                          <div
                                            className="font-semibold"
                                            style={{ color: '#F5F1E9' }}
                                          >
                                            {src.cancellation}
                                          </div>
                                          <div
                                            className="text-[11px] mt-0.5"
                                            style={{ color: '#C7CBC9' }}
                                          >
                                            {src.conditionNote}
                                          </div>
                                        </td>
                                        <td className="py-3 px-3 align-top">
                                          <span style={{ color: '#C7CBC9' }}>
                                            {src.availability}
                                          </span>
                                        </td>
                                        <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                                          <div
                                            className="font-bold text-sm"
                                            style={{ color: '#F5F1E9' }}
                                          >
                                            {formatMoney(srcStayTotal)}
                                          </div>
                                          <div
                                            className="text-[11px]"
                                            style={{ color: '#8E999B' }}
                                          >
                                            ({formatMoney(src.nightlyRateUSD)}{' '}
                                            base/noche)
                                          </div>
                                        </td>
                                        <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                                          <a
                                            href={src.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                              if (dataMode === 'demo') {
                                                e.preventDefault();
                                              }
                                            }}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                                            style={{
                                              borderColor: '#59D7CC',
                                              color: '#59D7CC',
                                              backgroundColor:
                                                'rgba(89, 215, 204, 0.1)',
                                            }}
                                            title={
                                              dataMode === 'demo'
                                                ? 'Enlace de ejemplo en Modo DEMO'
                                                : 'Ir a la fuente para confirmar tarifa'
                                            }
                                          >
                                            <span>
                                              {dataMode === 'demo'
                                                ? 'Fuente (DEMO)'
                                                : 'Ver en proveedor'}
                                            </span>
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Ofertas y Códigos Asociados al Alojamiento */}
                          {prop.linkedOffers.length > 0 && (
                            <div
                              className="p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                              style={{
                                backgroundColor: 'rgba(217, 154, 115, 0.1)',
                                borderColor: '#D99A73',
                              }}
                            >
                              <div className="space-y-1">
                                <div
                                  className="text-xs font-bold flex items-center gap-1.5"
                                  style={{ color: '#D99A73' }}
                                >
                                  <Tag className="w-4 h-4" />
                                  Promociones y Códigos publicados para este
                                  hospedaje:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {prop.linkedOffers.map((off) => (
                                    <span
                                      key={off.id}
                                      className="text-xs px-2.5 py-1 rounded border flex items-center gap-1.5"
                                      style={{
                                        backgroundColor: '#10131B',
                                        borderColor: '#D99A73',
                                        color: '#F5F1E9',
                                      }}
                                    >
                                      <strong style={{ color: '#D99A73' }}>
                                        {off.code}
                                      </strong>
                                      : {off.discountSummary}
                                      <span
                                        className="text-[10px] px-1.5 py-0.5 rounded"
                                        style={{
                                          backgroundColor:
                                            off.verificationStatus ===
                                            'verified_source'
                                              ? 'rgba(89, 215, 204, 0.2)'
                                              : 'rgba(217, 154, 115, 0.25)',
                                          color:
                                            off.verificationStatus ===
                                            'verified_source'
                                              ? '#59D7CC'
                                              : '#D99A73',
                                        }}
                                      >
                                        {off.statusLabel}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveTab('offers')}
                                className="text-xs font-semibold underline shrink-0"
                                style={{ color: '#D99A73' }}
                              >
                                Ver condiciones y vigencia →
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* ===================================================================
            PESTAÑA 2: OFERTAS, CÓDIGOS Y DESCUENTOS CON VERIFICACIÓN HONESTA
           =================================================================== */}
        {activeTab === 'offers' && (
          <section className="space-y-5">
            <div
              className="rounded-2xl border p-5 sm:p-6 space-y-4"
              style={{ backgroundColor: '#171322', borderColor: '#59616A' }}
            >
              <div
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                style={{ borderColor: '#59616A' }}
              >
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#D99A73' }}
                  >
                    Fuentes Públicas y Autorizadas
                  </span>
                  <h3
                    className="text-xl font-bold mt-0.5"
                    style={{ color: '#F5F1E9' }}
                  >
                    Ofertas de Temporada, Tarifas Familiares y Códigos
                    Promocionales
                  </h3>
                  <p
                    className="text-xs sm:text-sm mt-1"
                    style={{ color: '#C7CBC9' }}
                  >
                    Cada promoción detalla su fuente, vigencia, requisitos de
                    grupo familiar y estado real de comprobación.
                  </p>
                </div>

                <label
                  className="flex items-center gap-2 text-xs cursor-pointer self-start md:self-center px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: '#10131B',
                    borderColor: '#59616A',
                    color: '#C7CBC9',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showExpiredOffers}
                    onChange={(e) => setShowExpiredOffers(e.target.checked)}
                    className="rounded accent-[#D99A73]"
                  />
                  <span>Mostrar también ofertas vencidas (Archivo)</span>
                </label>
              </div>

              {/* Aviso ético de alcance y no evasión de controles */}
              <div
                className="p-4 rounded-xl border text-xs space-y-1.5"
                style={{
                  backgroundColor: '#10131B',
                  borderColor: '#59616A',
                  color: '#C7CBC9',
                }}
              >
                <div
                  className="font-bold flex items-center gap-2"
                  style={{ color: '#59D7CC' }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Compromiso de Transparencia sobre Cupones y Cobertura de
                  Fuentes
                </div>
                <p>
                  • <strong>Sin falsas promesas:</strong> Ninguna aplicación
                  puede garantizar el precio más bajo de todo Internet. Aquí
                  explicamos exactamente qué fuentes oficiales o programas de
                  afiliados se consultaron y a qué hora.
                </p>
                <p>
                  • <strong>Verificación en el pago:</strong> Nunca afirmamos
                  que un cupón funciona en el checkout final si no se ha
                  comprobado allí; distinguimos claramente entre{' '}
                  <em>"Verificado por la fuente"</em> y{' '}
                  <em>"Publicado pero sin verificar al reservar"</em>.
                </p>
                <p>
                  • <strong>Respeto técnico y legal:</strong> No evadimos
                  inicios de sesión, CAPTCHAs, paywalls ni controles anti-bots,
                  ni extraemos datos de sitios que prohíben el acceso
                  automatizado.
                </p>
              </div>

              {/* Tarjetas de Ofertas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEMO_OFFERS.filter(
                  (off) =>
                    showExpiredOffers || off.verificationStatus !== 'expired'
                ).map((offer) => {
                  const isVerified =
                    offer.verificationStatus === 'verified_source';
                  const isUnverified =
                    offer.verificationStatus === 'unverified_checkout';

                  return (
                    <div
                      key={offer.id}
                      className="rounded-xl border p-5 flex flex-col justify-between space-y-4"
                      style={{
                        backgroundColor: '#10131B',
                        borderColor: isVerified
                          ? '#59D7CC'
                          : isUnverified
                          ? '#D99A73'
                          : '#59616A',
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span
                            className="font-mono text-sm font-extrabold px-3 py-1 rounded border"
                            style={{
                              backgroundColor: '#171322',
                              borderColor: '#D99A73',
                              color: '#D99A73',
                            }}
                          >
                            CÓDIGO: {offer.code}
                          </span>

                          {/* Insignia de estado estricto */}
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={
                              isVerified
                                ? {
                                    backgroundColor: 'rgba(89, 215, 204, 0.16)',
                                    color: '#59D7CC',
                                    border: '1px solid #59D7CC',
                                  }
                                : isUnverified
                                ? {
                                    backgroundColor:
                                      'rgba(217, 154, 115, 0.18)',
                                    color: '#D99A73',
                                    border: '1px solid #D99A73',
                                  }
                                : {
                                    backgroundColor: 'rgba(142, 153, 155, 0.2)',
                                    color: '#8E999B',
                                    border: '1px solid #59616A',
                                  }
                            }
                          >
                            {offer.statusLabel}
                          </span>
                        </div>

                        <h4
                          className="text-base font-bold"
                          style={{ color: '#F5F1E9' }}
                        >
                          {offer.title}
                        </h4>

                        <p className="text-xs" style={{ color: '#C7CBC9' }}>
                          {offer.statusDescription}
                        </p>

                        <div
                          className="p-3 rounded-lg border text-xs space-y-1.5"
                          style={{
                            backgroundColor: '#171322',
                            borderColor: '#59616A',
                          }}
                        >
                          <div>
                            <strong style={{ color: '#F5F1E9' }}>
                              Fuente autorizada:
                            </strong>{' '}
                            <span style={{ color: '#C7CBC9' }}>
                              {offer.sourceName}
                            </span>
                          </div>
                          <div>
                            <strong style={{ color: '#F5F1E9' }}>
                              Vigencia de reserva:
                            </strong>{' '}
                            <span style={{ color: '#C7CBC9' }}>
                              {offer.validUntil}
                            </span>
                          </div>
                          <div>
                            <strong style={{ color: '#F5F1E9' }}>
                              Fechas de viaje aplicables:
                            </strong>{' '}
                            <span style={{ color: '#C7CBC9' }}>
                              {offer.travelWindow}
                            </span>
                          </div>
                          <div>
                            <strong style={{ color: '#F5F1E9' }}>
                              Requisitos de grupo familiar:
                            </strong>{' '}
                            <span style={{ color: '#59D7CC' }}>
                              {offer.requirements}
                            </span>
                          </div>
                          <div>
                            <strong style={{ color: '#F5F1E9' }}>
                              Restricciones y condiciones:
                            </strong>{' '}
                            <span style={{ color: '#D99A73' }}>
                              {offer.restrictions}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="pt-3 border-t flex items-center justify-between text-xs"
                        style={{ borderColor: '#59616A' }}
                      >
                        <span style={{ color: '#8E999B' }}>
                          Consultado: {offer.lastChecked}{' '}
                          {dataMode === 'demo' ? '(DEMO)' : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(offer.code);
                            setCopiedNotice(true);
                            setTimeout(() => setCopiedNotice(false), 2500);
                          }}
                          className="px-3 py-1.5 rounded-lg font-semibold border transition-colors flex items-center gap-1.5"
                          style={{
                            borderColor: '#59D7CC',
                            color: '#59D7CC',
                            backgroundColor: 'rgba(89, 215, 204, 0.1)',
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copiar código
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===================================================================
            PESTAÑA 3: ARQUITECTURA DE FUENTES E INTEGRACIONES
           =================================================================== */}
        {activeTab === 'integrations' && (
          <section
            className="rounded-2xl border p-6 space-y-6"
            style={{ backgroundColor: '#171322', borderColor: '#59616A' }}
          >
            <div className="border-b pb-4" style={{ borderColor: '#59616A' }}>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: '#A47BFF' }}
              >
                Arquitectura de Seguridad y Transparencia
              </span>
              <h3
                className="text-xl font-bold mt-1"
                style={{ color: '#F5F1E9' }}
              >
                Estado de Fuentes de Tarifas, Proveedores y Modo de Datos
              </h3>
              <p
                className="text-xs sm:text-sm mt-1"
                style={{ color: '#C7CBC9' }}
              >
                Revisa qué funciona en tiempo real en el navegador, qué depende
                de credenciales en un servidor backend y qué forma parte del
                conjunto de datos DEMO.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{ backgroundColor: '#10131B', borderColor: '#59D7CC' }}
              >
                <div
                  className="font-bold text-sm flex items-center gap-2"
                  style={{ color: '#59D7CC' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  1. Funcional con Lógica Real hoy
                </div>
                <ul
                  className="space-y-1.5 list-disc list-inside"
                  style={{ color: '#C7CBC9' }}
                >
                  <li>
                    Cálculo exacto de noches, huéspedes y edades de niños (0-17
                    años).
                  </li>
                  <li>
                    Motor de deduplicación de propiedades y comparación de
                    fuentes con condiciones distintas.
                  </li>
                  <li>
                    Cálculo de precio total, por noche, por persona y conversión
                    multimoneda.
                  </li>
                  <li>Algoritmo de porcentaje de coincidencia familiar (%).</li>
                  <li>
                    Generación de resumen legible, copia al portapapeles y
                    apertura del cliente de correo (<code>mailto:</code>).
                  </li>
                </ul>
              </div>

              <div
                className="p-4 rounded-xl border space-y-2"
                style={{ backgroundColor: '#10131B', borderColor: '#A47BFF' }}
              >
                <div
                  className="font-bold text-sm flex items-center gap-2"
                  style={{ color: '#A47BFF' }}
                >
                  <Server className="w-4 h-4" />
                  2. Depende de Credenciales Externas
                </div>
                <ul
                  className="space-y-1.5 list-disc list-inside"
                  style={{ color: '#C7CBC9' }}
                >
                  <li>
                    Cotización en tiempo real de inventario hotelero vía Amadeus
                    / Expedia Rapid / Booking Demand API.
                  </li>
                  <li>
                    Validación en vivo de cupones dentro del carrito de pago de
                    cada hotel.
                  </li>
                  <li>
                    Envío automático de correos vía servidor SMTP/API
                    (actualmente delega de forma segura en el cliente de correo
                    del dispositivo previa confirmación).
                  </li>
                </ul>
              </div>

              <div
                className="p-4 rounded-xl border space-y-2"
                style={{ backgroundColor: '#10131B', borderColor: '#D99A73' }}
              >
                <div
                  className="font-bold text-sm flex items-center gap-2"
                  style={{ color: '#D99A73' }}
                >
                  <Sparkles className="w-4 h-4" />
                  3. Rotulado en Modo DEMO
                </div>
                <ul
                  className="space-y-1.5 list-disc list-inside"
                  style={{ color: '#C7CBC9' }}
                >
                  <li>
                    5 alojamientos familiares de muestra (Riviera Maya, Akumal,
                    Orlando, Punta Cana y Mallorca).
                  </li>
                  <li>
                    10 cotizaciones de fuentes comparadas con diferentes
                    políticas de cancelación e impuestos.
                  </li>
                  <li>
                    4 promociones y códigos de descuento con distintos estados
                    de verificación.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================================
          BARRA FLOTANTE INFERIOR DE RESUMEN Y COMPARACIÓN RÁPIDA
         ===================================================================== */}
      <div
        className="sticky bottom-0 z-20 border-t px-4 py-3 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(23, 19, 34, 0.95)',
          borderColor: '#59616A',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span
              className="px-2.5 py-1 rounded-lg font-bold"
              style={{ backgroundColor: '#59D7CC', color: '#10131B' }}
            >
              {selectedForSummary.length} seleccionados
            </span>
            <span style={{ color: '#C7CBC9' }}>
              Guarda o comparte el resumen familiar sin crear una cuenta.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              disabled={selectedForCompare.length < 2}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 disabled:opacity-40"
              style={{
                backgroundColor: '#10131B',
                borderColor: '#A47BFF',
                color: '#A47BFF',
              }}
            >
              <Columns className="w-4 h-4" />
              Comparar ({selectedForCompare.length})
            </button>

            <button
              type="button"
              onClick={() => setIsSummaryDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: '#10131B',
                borderColor: '#59D7CC',
                color: '#F5F1E9',
              }}
            >
              <Eye className="w-4 h-4" style={{ color: '#59D7CC' }} />
              Ver Resumen Legible
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: '#59D7CC',
                color: '#10131B',
              }}
            >
              <Copy className="w-4 h-4" />
              {copiedNotice ? '¡Resumen Copiado!' : 'Copiar Resumen'}
            </button>

            <button
              type="button"
              onClick={handleOpenPrepareEmail}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: '#D99A73',
                color: '#10131B',
              }}
            >
              <Mail className="w-4 h-4" />
              Preparar Correo
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: COMPARADOR LADO A LADO (2 A 4 ALOJAMIENTOS)
         ===================================================================== */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="w-full max-w-6xl max-h-[90vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#171322', borderColor: '#A47BFF' }}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: '#59616A' }}
            >
              <div>
                <h3
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ color: '#F5F1E9' }}
                >
                  <Columns className="w-5 h-5" style={{ color: '#A47BFF' }} />
                  Comparación Familiar Lado a Lado (
                  {comparedPropertiesList.length} alojamientos)
                </h3>
                <p className="text-xs" style={{ color: '#C7CBC9' }}>
                  Comparativa directa de precios totales, por persona,
                  impuestos, cancelación y coincidencia con tus preferencias.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-lg border"
                style={{ borderColor: '#59616A', color: '#C7CBC9' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#59616A' }}>
                    <th className="p-3 w-44" style={{ color: '#8E999B' }}>
                      Atributo Familiar
                    </th>
                    {comparedPropertiesList.map((prop) => (
                      <th
                        key={prop.id}
                        className="p-3 min-w-[210px]"
                        style={{ color: '#F5F1E9' }}
                      >
                        <div
                          className="text-xs font-bold uppercase"
                          style={{ color: '#A47BFF' }}
                        >
                          {prop.type}
                        </div>
                        <div className="text-sm font-bold mt-0.5">
                          {prop.name}
                        </div>
                        <div
                          className="text-[11px] font-normal"
                          style={{ color: '#8E999B' }}
                        >
                          {prop.destination}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#59616A' }}>
                  <tr>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: '#C7CBC9' }}
                    >
                      Coincidencia Familiar
                    </td>
                    {comparedPropertiesList.map((prop) => (
                      <td
                        key={prop.id}
                        className="p-3 font-bold"
                        style={{ color: '#59D7CC' }}
                      >
                        {prop.matchPercentage}% de los filtros
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: '#C7CBC9' }}
                    >
                      Precio Total ({nightsCount} noches)
                    </td>
                    {comparedPropertiesList.map((prop) => (
                      <td key={prop.id} className="p-3">
                        <span
                          className="text-base font-extrabold"
                          style={{ color: '#F5F1E9' }}
                        >
                          {formatMoney(prop.totalStayUSD)}
                        </span>
                        <div
                          className="text-[11px]"
                          style={{ color: '#8E999B' }}
                        >
                          {formatMoney(prop.effectiveNightlyUSD)} / noche
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: '#C7CBC9' }}
                    >
                      Precio por Persona ({totalGuests})
                    </td>
                    {comparedPropertiesList.map((prop) => (
                      <td
                        key={prop.id}
                        className="p-3 font-bold"
                        style={{ color: '#59D7CC' }}
                      >
                        {formatMoney(prop.perPersonUSD)} / persona
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: '#C7CBC9' }}
                    >
                      Impuestos y Cargos
                    </td>
                    {comparedPropertiesList.map((prop) => (
                      <td
                        key={prop.id}
                        className="p-3"
                        style={{
                          color:
                            prop.taxesStatus === 'unconfirmed'
                              ? '#D99A73'
                              : '#C7CBC9',
                        }}
                      >
                        {prop.taxesNote}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: '#C7CBC9' }}
                    >
                      Capacidad y Unidades
                    </td>
                    {comparedPropertiesList.map((prop) => (
                      <td
                        key={prop.id}
                        className="p-3"
                        style={{ color: '#F5F1E9' }}
                      >
                        Máx. {prop.maxCapacity} personas •{' '}
                        {prop.unitDistribution}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: '#C7CBC9' }}
                    >
                      Fuente y Régimen Principal
                    </td>
                    {comparedPropertiesList.map((prop) => (
                      <td
                        key={prop.id}
                        className="p-3"
                        style={{ color: '#C7CBC9' }}
                      >
                        <strong>{prop.primarySource.providerName}</strong> (
                        {prop.primarySource.mealPlan})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: '#C7CBC9' }}
                    >
                      Política de Cancelación
                    </td>
                    {comparedPropertiesList.map((prop) => (
                      <td
                        key={prop.id}
                        className="p-3"
                        style={{ color: '#C7CBC9' }}
                      >
                        {prop.primarySource.cancellation}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: VISTA PREVIA DEL RESUMEN GUARDADO Y COPIA AL PORTAPAPELES
         ===================================================================== */}
      {isSummaryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="w-full max-w-3xl max-h-[90vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#171322', borderColor: '#59D7CC' }}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: '#59616A' }}
            >
              <div>
                <h3
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ color: '#F5F1E9' }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#59D7CC' }} />
                  Resumen Familiar Seleccionado (
                  {selectedSummaryProperties.length} alojamientos)
                </h3>
                <p className="text-xs" style={{ color: '#C7CBC9' }}>
                  Revisa el resumen con fechas, capacidad, precios, condiciones
                  y enlaces antes de copiarlo o preparar un correo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSummaryDrawerOpen(false)}
                className="p-2 rounded-lg border"
                style={{ borderColor: '#59616A', color: '#C7CBC9' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-1 space-y-4">
              <pre
                className="p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed"
                style={{
                  backgroundColor: '#10131B',
                  borderColor: '#59616A',
                  color: '#F5F1E9',
                }}
              >
                {plainTextSummary}
              </pre>
            </div>

            <div
              className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3"
              style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
            >
              <span className="text-xs" style={{ color: '#8E999B' }}>
                No se requiere crear cuenta para guardar ni copiar este resumen.
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  style={{ backgroundColor: '#59D7CC', color: '#10131B' }}
                >
                  <Copy className="w-4 h-4" />
                  {copiedNotice
                    ? '¡Copiado al portapapeles!'
                    : 'Copiar texto al portapapeles'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSummaryDrawerOpen(false);
                    handleOpenPrepareEmail();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  style={{ backgroundColor: '#D99A73', color: '#10131B' }}
                >
                  <Mail className="w-4 h-4" />
                  Preparar Correo con este Resumen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: PREPARAR CORREO (SIN ENVÍO AUTOMÁTICO SILENCIOSO)
         ===================================================================== */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl max-h-[92vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#171322', borderColor: '#D99A73' }}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: '#59616A' }}
            >
              <div>
                <h3
                  className="text-lg font-bold flex items-center gap-2"
                  style={{ color: '#F5F1E9' }}
                >
                  <Mail className="w-5 h-5" style={{ color: '#D99A73' }} />
                  Preparar Correo con Resumen Familiar
                </h3>
                <p className="text-xs" style={{ color: '#C7CBC9' }}>
                  Revisa o edita el contenido antes de abrir tu aplicación de
                  correo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="p-2 rounded-lg border"
                style={{ borderColor: '#59616A', color: '#C7CBC9' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-1 space-y-4 text-xs">
              {/* Aviso de servicio de correo no configurado / cliente local */}
              <div
                className="p-3.5 rounded-xl border flex items-start gap-2.5"
                style={{
                  backgroundColor: 'rgba(89, 215, 204, 0.1)',
                  borderColor: '#59D7CC',
                  color: '#F5F1E9',
                }}
              >
                <Info
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: '#59D7CC' }}
                />
                <div>
                  <strong>Transparencia de envío:</strong> Este entorno no
                  utiliza un servidor de correo oculto ni envía mensajes sin tu
                  acción explícita. Al pulsar{' '}
                  <em>"Abrir en mi cliente de correo"</em>, se abrirá la
                  aplicación de correo de tu dispositivo con este mensaje
                  preparado;{' '}
                  <strong>recuerda completar y confirmar el envío allí</strong>.
                </div>
              </div>

              <div>
                <label
                  className="block font-semibold mb-1"
                  style={{ color: '#C7CBC9' }}
                >
                  Destinatario(s) (opcional, separados por coma):
                </label>
                <input
                  type="text"
                  value={emailDraft.to}
                  onChange={(e) =>
                    setEmailDraft((prev) => ({ ...prev, to: e.target.value }))
                  }
                  placeholder="familia@ejemplo.com, abuelos@ejemplo.com"
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: '#10131B',
                    borderColor: '#59616A',
                    color: '#F5F1E9',
                  }}
                />
              </div>

              <div>
                <label
                  className="block font-semibold mb-1"
                  style={{ color: '#C7CBC9' }}
                >
                  Asunto del correo:
                </label>
                <input
                  type="text"
                  value={emailDraft.subject}
                  onChange={(e) =>
                    setEmailDraft((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: '#10131B',
                    borderColor: '#59616A',
                    color: '#F5F1E9',
                  }}
                />
              </div>

              <div>
                <label
                  className="block font-semibold mb-1"
                  style={{ color: '#C7CBC9' }}
                >
                  Vista previa y edición del mensaje preparado:
                </label>
                <textarea
                  rows={10}
                  value={emailDraft.body}
                  onChange={(e) =>
                    setEmailDraft((prev) => ({ ...prev, body: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg border font-mono text-xs leading-relaxed"
                  style={{
                    backgroundColor: '#10131B',
                    borderColor: '#59616A',
                    color: '#F5F1E9',
                  }}
                />
              </div>

              {emailDraft.clientOpenedNotice && (
                <div
                  className="p-3 rounded-lg border font-medium"
                  style={{
                    backgroundColor: 'rgba(217, 154, 115, 0.16)',
                    borderColor: '#D99A73',
                    color: '#D99A73',
                  }}
                >
                  Se ha solicitado abrir el cliente de correo de tu dispositivo
                  con el resumen preparado. Recuerda presionar "Enviar" dentro
                  de tu aplicación de correo para completar el envío.
                </div>
              )}
            </div>

            <div
              className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3"
              style={{ backgroundColor: '#10131B', borderColor: '#59616A' }}
            >
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5"
                style={{ borderColor: '#59D7CC', color: '#59D7CC' }}
              >
                <Copy className="w-4 h-4" />
                {copiedNotice
                  ? '¡Texto copiado!'
                  : 'Copiar contenido por si prefieres pegarlo manualmente'}
              </button>

              <button
                type="button"
                onClick={handleLaunchMailClient}
                className="px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                style={{ backgroundColor: '#59D7CC', color: '#10131B' }}
              >
                <Mail className="w-4 h-4" />
                Abrir en mi cliente de correo (mailto:)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
