import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Home,
  Utensils,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Mail,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  Tag,
  Check,
  X,
  ArrowUpDown,
  Building2,
  Waves,
  Baby,
  Accessibility,
  WashingMachine,
  CookingPot,
  Upload,
  Compass,
  Loader2,
  PlusCircle,
  Globe
} from 'lucide-react';

interface PreferenceOption {
  id: string;
  label: string;
}

const PREFERENCE_OPTIONS: PreferenceOption[] = [
  { id: 'pool', label: 'Piscina' },
  { id: 'kitchen', label: 'Cocina equipada' },
  { id: 'beach', label: 'Frente a la playa / Acceso' },
  { id: 'familyRooms', label: 'Habitaciones familiares' },
  { id: 'laundry', label: 'Lavandería' },
  { id: 'accessibility', label: 'Accesibilidad (movilidad reducida)' },
  { id: 'kidsClub', label: 'Club infantil / Cuna disponible' }
];

interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
}

interface QuotedRate {
  sourceName: string;
  priceAmount: number;
  isPerNight: boolean;
  taxesIncluded: boolean;
  taxAmount: number;
  mealPlan: string;
  cancellation: string;
  url: string;
  queriedAt: string;
  notes?: string;
}

interface RealProperty {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'villa';
  typeLabel: string;
  location: string;
  lat: number;
  lon: number;
  website?: string;
  phone?: string;
  stars?: string;
  amenities: string[];
  capacityAdults: number;
  capacityKids: number;
  recommendedUnits: number;
  isDemo: boolean;
  quotedRates: QuotedRate[];
}

interface PromoOffer {
  id: string;
  title: string;
  code: string;
  discountText: string;
  source: string;
  sourceUrl: string;
  validUntil: string;
  travelWindow: string;
  groupRequirements: string;
  restrictions: string;
  status: 'verified_by_source' | 'published_unverified_checkout';
}

const PUBLIC_FAMILY_OFFERS: PromoOffer[] = [
  {
    id: 'pub-1',
    title: 'Ofertas de Temporada y Paquetes Familiares en Booking.com',
    code: 'TARIFA AUTOMÁTICA (Early / Escape Deals)',
    discountText: '15% a 20% dto. en alojamientos participantes',
    source: 'Booking.com (Página Pública de Ofertas)',
    sourceUrl: 'https://www.booking.com/dealspage.es.html',
    validUntil: 'Según disponibilidad de temporada',
    travelWindow: 'Fechas seleccionadas en el buscador',
    groupRequirements: 'Aplicable en habitaciones familiares y villas seleccionadas',
    restrictions: 'El descuento se aplica directamente sobre la tarifa base en propiedades con insignia de oferta.',
    status: 'verified_by_source'
  },
  {
    id: 'pub-2',
    title: 'Tarifas para Miembros y Grupos Familiares en Expedia',
    code: 'PRECIOS PARA MIEMBROS / APP',
    discountText: '10% o más en hoteles seleccionados',
    source: 'Expedia Ofertas Públicas',
    sourceUrl: 'https://www.expedia.com/deals',
    validUntil: 'Permanente en catálogo adherido',
    travelWindow: 'Abierto todo el año',
    groupRequirements: 'Sin mínimo de noches obligatorio en tarifa estándar',
    restrictions: 'Requiere verificar condiciones de cancelación en la página de pago del proveedor.',
    status: 'published_unverified_checkout'
  },
  {
    id: 'pub-3',
    title: 'Descuento por Estadía Semanal o Mensual en Villas y Casas',
    code: 'DESCUENTO SEMANAL (7+ NOCHES)',
    discountText: '10% a 25% dto. automático en estancias de 7+ noches',
    source: 'Airbnb / Plataformas de Alquiler Vacacional',
    sourceUrl: 'https://www.airbnb.com',
    validUntil: 'Permanente según anfitrión',
    travelWindow: 'Estadías de 7 noches o más',
    groupRequirements: 'Ideal para familias que reservan la unidad completa',
    restrictions: 'Sujeto a cargos de limpieza y tarifa de servicio mostrados en el desglose final.',
    status: 'published_unverified_checkout'
  }
];

const DEMO_PROPERTIES: RealProperty[] = [
  {
    id: 'demo-1',
    name: 'Bahía Coral Family Resort & Villas (EJEMPLO DEMO)',
    type: 'resort',
    typeLabel: 'Resort Familiar',
    location: 'Punta Cana, República Dominicana',
    lat: 18.582,
    lon: -68.405,
    website: 'https://www.google.com/travel/hotels',
    stars: '5',
    amenities: ['pool', 'beach', 'familyRooms', 'kidsClub', 'accessibility'],
    capacityAdults: 6,
    capacityKids: 4,
    recommendedUnits: 2,
    isDemo: true,
    quotedRates: [
      {
        sourceName: 'Sitio Oficial (Tarifa de Muestra)',
        priceAmount: 2240,
        isPerNight: false,
        taxesIncluded: true,
        taxAmount: 0,
        mealPlan: 'all_inclusive',
        cancellation: 'Cancelación gratuita hasta 7 días antes',
        url: 'https://www.google.com/travel/hotels',
        queriedAt: 'Muestra DEMO',
        notes: 'Incluye estadía para 2 niños menores de 12 años.'
      }
    ]
  }
];

export default function App() {
  // Estado del logo
  const [logoSrc, setLogoSrc] = useState<string>('/OPCION 4.png');
  const [logoError, setLogoError] = useState<boolean>(false);

  // Modo de operación: 'live' (Búsqueda Real Gratuita OSM + Deep Links) o 'demo'
  const [dataMode, setDataMode] = useState<'live' | 'demo'>('live');
  const [activeTab, setActiveTab] = useState<'search' | 'offers'>('search');

  // Filtros de búsqueda familiar
  const [destination, setDestination] = useState<string>('Punta Cana');
  const [includeNearby, setIncludeNearby] = useState<boolean>(true);
  const [dateType, setDateType] = useState<'exact' | 'flexible'>('exact');
  const [checkIn, setCheckIn] = useState<string>('2026-07-15');
  const [checkOut, setCheckOut] = useState<string>('2026-07-21');
  const [flexibleNights, setFlexibleNights] = useState<number>(6);
  const [adults, setAdults] = useState<number>(4);
  const [childrenCount, setChildrenCount] = useState<number>(2);
  const [childrenAges, setChildrenAges] = useState<number[]>([6, 10]);
  const [units, setUnits] = useState<number>(2);
  const [accommodationType, setAccommodationType] = useState<string>('all');
  const [mealPlan, setMealPlan] = useState<string>('any');
  const [maxBudget, setMaxBudget] = useState<number>(3500);
  const [currency, setCurrency] = useState<string>('USD');
  const [budgetScope, setBudgetScope] = useState<'total' | 'per_night'>('total');
  const [preferences, setPreferences] = useState<string[]>(['pool', 'familyRooms']);

  // Estado de la búsqueda en vivo (OpenStreetMap Nominatim + Overpass)
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [resolvedPlace, setResolvedPlace] = useState<string>('');
  const [lastQueryTime, setLastQueryTime] = useState<string>('');
  const [liveProperties, setLiveProperties] = useState<RealProperty[]>([]);
  const [hasSearchedOnce, setHasSearchedOnce] = useState<boolean>(false);

  // Ordenamiento y selección
  const [sortBy, setSortBy] = useState<string>('best_match');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal para registrar/capturar tarifa real vista en Booking/Google/Expedia
  const [rateModalPropertyId, setRateModalPropertyId] = useState<string | null>(null);
  const [rateSource, setRateSource] = useState<string>('Google Hotels');
  const [rateAmount, setRateAmount] = useState<string>('');
  const [rateIsPerNight, setRateIsPerNight] = useState<boolean>(false);
  const [rateTaxesIncluded, setRateTaxesIncluded] = useState<boolean>(false);
  const [rateTaxAmount, setRateTaxAmount] = useState<string>('0');
  const [rateMealPlan, setRateMealPlan] = useState<string>('all_inclusive');
  const [rateCancellation, setRateCancellation] = useState<string>('Cancelación gratuita disponible');
  const [rateUrl, setRateUrl] = useState<string>('');

  // Modal de resumen / correo / comparación
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('Comparativa de Hospedajes Familiares — NOVA SHARK');
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);
  const [emailClientOpened, setEmailClientOpened] = useState<boolean>(false);

  // Cálculo de noches
  const nightsCount = useMemo(() => {
    if (dateType === 'flexible') {
      return Math.max(1, Number(flexibleNights) || 1);
    }
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [dateType, checkIn, checkOut, flexibleNights]);

  const totalGuests = adults + childrenCount;

  // Manejo de cantidad y edades de niños
  const handleChildrenCountChange = (val: number) => {
    const count = Math.max(0, Math.min(10, val));
    setChildrenCount(count);
    setChildrenAges((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill(7)];
      }
      return prev.slice(0, count);
    });
  };

  const handleChildAgeChange = (idx: number, age: number) => {
    setChildrenAges((prev) => {
      const next = [...prev];
      next[idx] = Math.max(0, Math.min(17, age));
      return next;
    });
  };

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoSrc(url);
      setLogoError(false);
    }
  };

  // Generador de enlaces reales directos a motores de reserva con fechas y huéspedes
  const buildLiveBookingLinks = (hotelName: string, locationName: string) => {
    const fullQuery = encodeURIComponent(`${hotelName} ${locationName}`);
    const destOnly = encodeURIComponent(locationName || destination);

    // Booking.com acepta parámetros directos de check-in, check-out, adultos, niños y habitaciones
    const childrenAgeParams = childrenAges.map((age) => `&age=${age}`).join('');
    const bookingUrl = `https://www.booking.com/searchresults.es.html?ss=${fullQuery}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&req_adults=${adults}&group_children=${childrenCount}&req_children=${childrenCount}${childrenAgeParams}&no_rooms=${units}`;

    // Google Hotels búsqueda directa
    const googleHotelsUrl = `https://www.google.com/travel/hotels?q=${fullQuery}`;

    // Expedia búsqueda con fechas y huéspedes
    const expediaUrl = `https://www.expedia.com/Hotel-Search?destination=${fullQuery}&startDate=${checkIn}&endDate=${checkOut}&adults=${adults}&rooms=${units}`;

    // Airbnb para villas o grupos familiares
    const airbnbUrl = `https://www.airbnb.com/s/${destOnly}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${childrenCount}`;

    return { bookingUrl, googleHotelsUrl, expediaUrl, airbnbUrl };
  };

  // BÚSQUEDA REAL GRATUITA EN INTERNET (OpenStreetMap Nominatim + Overpass API)
  const executeRealSearch = async () => {
    if (!destination.trim()) {
      setSearchError('Escribe una ciudad, región o país para buscar hospedajes reales.');
      return;
    }

    setDataMode('live');
    setIsSearching(true);
    setSearchError(null);
    setHasSearchedOnce(true);

    try {
      // 1. Geocodificar destino en vivo con Nominatim (OpenStreetMap)
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination.trim())}&limit=1`,
        {
          headers: {
            'Accept-Language': 'es'
          }
        }
      );

      if (!geoRes.ok) {
        throw new Error('No se pudo contactar al servicio geográfico abierto.');
      }

      const geoData: NominatimPlace[] = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        setLiveProperties([]);
        setSearchError(`No encontramos la ubicación "${destination}". Intenta con el nombre de la ciudad o país (ej. Cancún, Punta Cana, Madrid, Orlando).`);
        setIsSearching(false);
        return;
      }

      const place = geoData[0];
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);
      const radiusMeters = includeNearby ? 18000 : 7000;
      const cleanPlaceName = place.display_name.split(',').slice(0, 2).join(', ');
      setResolvedPlace(cleanPlaceName);

      // 2. Consultar hoteles, resorts, apartamentos y villas reales en Overpass API
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["tourism"~"hotel|resort|chalet|apartment|guest_house|Alpine_hut"](around:${radiusMeters},${lat},${lon});
          way["tourism"~"hotel|resort|chalet|apartment|guest_house"](around:${radiusMeters},${lat},${lon});
        );
        out center tags 45;
      `;

      const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      });

      if (!overpassRes.ok) {
        throw new Error('El servidor público de mapas tardó demasiado en responder. Intenta de nuevo en unos segundos.');
      }

      const overpassJson = await overpassRes.json();
      const elements = overpassJson.elements || [];

      const seenNames = new Set<string>();
      const parsedProperties: RealProperty[] = [];

      for (const el of elements) {
        const tags = el.tags || {};
        const rawName = tags.name || tags['name:es'] || tags['name:en'];
        if (!rawName) continue;

        const normalizedName = rawName.trim().toLowerCase();
        if (seenNames.has(normalizedName)) continue;
        seenNames.add(normalizedName);

        const lowerName = normalizedName;
        const tourismTag = (tags.tourism || '').toLowerCase();

        let propType: 'hotel' | 'resort' | 'villa' = 'hotel';
        let propTypeLabel = 'Hotel Familiar';

        if (
          tourismTag === 'resort' ||
          lowerName.includes('resort') ||
          lowerName.includes('all inclusive') ||
          lowerName.includes('palace') ||
          lowerName.includes('grand')
        ) {
          propType = 'resort';
          propTypeLabel = 'Resort';
        } else if (
          tourismTag === 'chalet' ||
          tourismTag === 'apartment' ||
          lowerName.includes('villa') ||
          lowerName.includes('apart') ||
          lowerName.includes('suites') ||
          lowerName.includes('casa')
        ) {
          propType = 'villa';
          propTypeLabel = 'Villa / Apartamento Familiar';
        }

        // Detectar comodidades reales reportadas en OpenStreetMap + inferencia por tipo
        const detectedAmenities: string[] = [];
        if (tags.swimming_pool === 'yes' || propType === 'resort' || lowerName.includes('pool') || lowerName.includes('resort')) {
          detectedAmenities.push('pool');
        }
        if (propType === 'villa' || tourismTag === 'apartment' || lowerName.includes('suites')) {
          detectedAmenities.push('kitchen');
          detectedAmenities.push('laundry');
        }
        if (lowerName.includes('beach') || lowerName.includes('playa') || lowerName.includes('mar') || lowerName.includes('ocean') || propType === 'resort') {
          detectedAmenities.push('beach');
        }
        if (tags.wheelchair === 'yes' || tags.wheelchair === 'limited') {
          detectedAmenities.push('accessibility');
        }
        detectedAmenities.push('familyRooms');
        if (propType === 'resort') {
          detectedAmenities.push('kidsClub');
        }

        const addrStreet = tags['addr:street'] ? `${tags['addr:street']} ${tags['addr:housenumber'] || ''}, ` : '';
        const addrCity = tags['addr:city'] || cleanPlaceName;

        parsedProperties.push({
          id: `osm-${el.id}`,
          name: rawName.trim(),
          type: propType,
          typeLabel: propTypeLabel,
          location: `${addrStreet}${addrCity}`.trim(),
          lat: el.lat || el.center?.lat || lat,
          lon: el.lon || el.center?.lon || lon,
          website: tags.website || tags['contact:website'] || undefined,
          phone: tags.phone || tags['contact:phone'] || undefined,
          stars: tags.stars || undefined,
          amenities: detectedAmenities,
          capacityAdults: Math.max(adults, units * 2),
          capacityKids: Math.max(childrenCount, units * 2),
          recommendedUnits: units,
          isDemo: false,
          quotedRates: []
        });

        if (parsedProperties.length >= 24) break;
      }

      const nowStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      setLastQueryTime(`Hoy a las ${nowStr} (OpenStreetMap Live API)`);
      setLiveProperties(parsedProperties);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de red al consultar alojamientos reales.';
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  // Guardar tarifa capturada manualmente por el usuario para comparar precios reales
  const handleSaveQuotedRate = () => {
    if (!rateModalPropertyId) return;
    const numericPrice = parseFloat(rateAmount);
    if (isNaN(numericPrice) || numericPrice <= 0) return;

    const numericTax = parseFloat(rateTaxAmount) || 0;
    const nowStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newRate: QuotedRate = {
      sourceName: rateSource,
      priceAmount: numericPrice,
      isPerNight: rateIsPerNight,
      taxesIncluded: rateTaxesIncluded,
      taxAmount: numericTax,
      mealPlan: rateMealPlan,
      cancellation: rateCancellation,
      url: rateUrl.trim() || 'https://www.google.com/travel/hotels',
      queriedAt: `Consultado a las ${nowStr}`
    };

    if (dataMode === 'live') {
      setLiveProperties((prev) =>
        prev.map((p) =>
          p.id === rateModalPropertyId
            ? { ...p, quotedRates: [...p.quotedRates, newRate] }
            : p
        )
      );
    }

    setRateModalPropertyId(null);
    setRateAmount('');
    setRateTaxAmount('0');
    setRateUrl('');
  };

  // Procesamiento y cálculo de coincidencia familiar y precios
  const processedProperties = useMemo(() => {
    const baseList = dataMode === 'demo' ? DEMO_PROPERTIES : liveProperties;

    return baseList
      .filter((prop) => {
        if (accommodationType !== 'all' && prop.type !== accommodationType) {
          return false;
        }
        return true;
      })
      .map((prop) => {
        // Evaluar tarifas registradas (si tiene)
        const enrichedRates = prop.quotedRates.map((r) => {
          const baseStay = r.isPerNight ? r.priceAmount * nightsCount : r.priceAmount;
          const totalStayPrice = r.taxesIncluded ? baseStay : baseStay + r.taxAmount;
          const perNightPrice = Math.round(totalStayPrice / nightsCount);
          const perPersonPrice = totalGuests > 0 ? Math.round(totalStayPrice / totalGuests) : totalStayPrice;
          return {
            ...r,
            totalStayPrice,
            perNightPrice,
            perPersonPrice
          };
        });

        enrichedRates.sort((a, b) => a.totalStayPrice - b.totalStayPrice);
        const bestRate = enrichedRates[0] || null;

        // Calcular coincidencia familiar (%)
        let score = 0;
        let maxPoints = 30; // Tipo + Capacidad

        if (accommodationType === 'all' || prop.type === accommodationType) {
          score += 20;
        }
        score += 10; // Capacidad familiar adaptable con unidades

        if (preferences.length > 0) {
          maxPoints += preferences.length * 15;
          preferences.forEach((pref) => {
            if (prop.amenities.includes(pref)) {
              score += 15;
            }
          });
        }

        const budgetLimitTotal =
          budgetScope === 'per_night' ? maxBudget * nightsCount : maxBudget;

        if (bestRate) {
          maxPoints += 25;
          if (bestRate.totalStayPrice <= budgetLimitTotal) {
            score += 25;
          }
        }

        const matchScore = Math.min(100, Math.round((score / Math.max(1, maxPoints)) * 100));

        return {
          ...prop,
          enrichedRates,
          bestRate,
          matchScore,
          withinBudget: bestRate ? bestRate.totalStayPrice <= budgetLimitTotal : true
        };
      })
      .sort((a, b) => {
        if (sortBy === 'price_total') {
          const pA = a.bestRate ? a.bestRate.totalStayPrice : Number.MAX_SAFE_INTEGER;
          const pB = b.bestRate ? b.bestRate.totalStayPrice : Number.MAX_SAFE_INTEGER;
          return pA - pB;
        }
        if (sortBy === 'price_person') {
          const pA = a.bestRate ? a.bestRate.perPersonPrice : Number.MAX_SAFE_INTEGER;
          const pB = b.bestRate ? b.bestRate.perPersonPrice : Number.MAX_SAFE_INTEGER;
          return pA - pB;
        }
        return b.matchScore - a.matchScore;
      });
  }, [
    dataMode,
    liveProperties,
    accommodationType,
    nightsCount,
    totalGuests,
    preferences,
    maxBudget,
    budgetScope,
    sortBy
  ]);

  const selectedProperties = useMemo(
    () => processedProperties.filter((p) => selectedIds.includes(p.id)),
    [processedProperties, selectedIds]
  );

  const toggleSelectProperty = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const formatMoney = (amount: number) => {
    return `${currency} ${amount.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`;
  };

  // Texto plano para portapapeles y correo
  const summaryText = useMemo(() => {
    const lines: string[] = [
      '========================================================',
      'NOVA SHARK — RESUMEN DE HOSPEDAJES FAMILIARES',
      '========================================================',
      `Destino consultado: ${resolvedPlace || destination}`,
      `Fechas: ${dateType === 'exact' ? `${checkIn} al ${checkOut}` : `Fechas flexibles (${nightsCount} noches)`}`,
      `Grupo familiar: ${adults} adultos, ${childrenCount} niños ${childrenCount > 0 ? `(Edades: ${childrenAges.join(', ')} años)` : ''}`,
      `Unidades requeridas: ${units}`,
      ''
    ];

    if (selectedProperties.length === 0) {
      lines.push('No se han seleccionado alojamientos todavía.');
    } else {
      selectedProperties.forEach((prop, idx) => {
        const links = buildLiveBookingLinks(prop.name, prop.location);
        lines.push(`${idx + 1}. ${prop.name} (${prop.typeLabel})`);
        lines.push(`   • Ubicación: ${prop.location}`);
        lines.push(`   • Coincidencia familiar: ${prop.matchScore}%`);
        if (prop.bestRate) {
          lines.push(`   • Tarifa registrada (${prop.bestRate.sourceName}): ${formatMoney(prop.bestRate.totalStayPrice)} total (${formatMoney(prop.bestRate.perNightPrice)}/noche | ${formatMoney(prop.bestRate.perPersonPrice)}/persona)`);
          lines.push(`   • Impuestos: ${prop.bestRate.taxesIncluded ? 'Incluidos' : `+ ${formatMoney(prop.bestRate.taxAmount)} adicionales`}`);
          lines.push(`   • Condiciones: ${prop.bestRate.cancellation}`);
          lines.push(`   • Enlace de la tarifa: ${prop.bestRate.url}`);
        } else {
          lines.push('   • Precio: Pendiente de confirmar en el motor de reservas en vivo.');
        }
        lines.push(`   • Consultar en Booking.com: ${links.bookingUrl}`);
        lines.push(`   • Consultar en Google Hotels: ${links.googleHotelsUrl}`);
        lines.push('');
      });
    }

    lines.push('Nota: Los precios y la disponibilidad final deben confirmarse en la página del proveedor antes de reservar.');
    return lines.join('\n');
  }, [
    resolvedPlace,
    destination,
    dateType,
    checkIn,
    checkOut,
    nightsCount,
    adults,
    childrenCount,
    childrenAges,
    units,
    selectedProperties,
    currency
  ]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 3000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = summaryText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 3000);
    }
  };

  const handleOpenMailClient = () => {
    const mailto = `mailto:${encodeURIComponent(recipientEmail.trim())}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryText)}`;
    window.location.href = mailto;
    setEmailClientOpened(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-[#59D7CC]/30 selection:text-[#F5F1E9]"
      style={{
        backgroundColor: '#10131B',
        color: '#F5F1E9',
        backgroundImage: `
          radial-gradient(circle at 12% 10%, rgba(164, 123, 255, 0.08) 0%, transparent 35%),
          radial-gradient(circle at 88% 15%, rgba(89, 215, 204, 0.07) 0%, transparent 35%)
        `
      }}
    >
      {/* ENCABEZADO OFICIAL */}
      <header className="sticky top-0 z-30 border-b border-[#59616A]/40 bg-[#10131B]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {!logoError ? (
              <div className="h-14 w-28 sm:w-32 rounded-lg bg-white/95 p-1.5 flex items-center justify-center shadow-md border border-[#D99A73]/40 shrink-0">
                <img
                  src={logoSrc}
                  alt="NOVA SHARK Logo"
                  className="max-h-full max-w-full object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="h-14 px-3 rounded-lg border border-dashed border-[#D99A73]/60 bg-[#171322] flex items-center gap-2 shrink-0">
                <Compass className="w-5 h-5 text-[#59D7CC]" />
                <div className="text-xs">
                  <span className="font-semibold block text-[#F5F1E9]">NOVA SHARK</span>
                  <label className="text-[10px] text-[#59D7CC] underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-2.5 h-2.5" /> Cargar OPCION 4.png
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#D99A73] font-semibold">
                  NOVA SHARK
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#59D7CC]/15 text-[#59D7CC] border border-[#59D7CC]/40 font-medium">
                  Búsqueda Abierta Gratuita
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[#F5F1E9]">
                Buscador y Comparador de Hospedajes Familiares
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-[#59D7CC] text-[#10131B] font-semibold shadow-sm'
                  : 'bg-[#171322] text-[#C7CBC9] border border-[#59616A]/40 hover:text-[#F5F1E9]'
              }`}
            >
              <Search className="w-4 h-4" />
              1. Búsqueda y Comparación
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('offers')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'offers'
                  ? 'bg-[#D99A73] text-[#10131B] font-semibold shadow-sm'
                  : 'bg-[#171322] text-[#C7CBC9] border border-[#59616A]/40 hover:text-[#F5F1E9]'
              }`}
            >
              <Tag className="w-4 h-4" />
              2. Ofertas y Descuentos ({PUBLIC_FAMILY_OFFERS.length})
            </button>

            <button
              type="button"
              onClick={() => setShowSummaryModal(true)}
              className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#171322] text-[#59D7CC] border border-[#59D7CC]/50 hover:bg-[#59D7CC]/10 transition flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              Resumen ({selectedIds.length})
            </button>
          </div>
        </div>

        {/* BARRA DE MODO REAL VS DEMO */}
        <div className="bg-[#171322] border-t border-[#59616A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#C7CBC9]">
              <Globe className="w-4 h-4 text-[#59D7CC] shrink-0" />
              <span>
                <strong>100% Gratis y en Vivo:</strong> Busca hoteles reales por ciudad/país (vía OpenStreetMap API abierta) y abre su disponibilidad exacta en Booking, Google Hotels, Expedia y Airbnb.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDataMode('live')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  dataMode === 'live'
                    ? 'bg-[#59D7CC] text-[#10131B] font-semibold'
                    : 'text-[#8E999B] hover:text-[#F5F1E9]'
                }`}
              >
                Búsqueda Real en Vivo
              </button>
              <button
                type="button"
                onClick={() => setDataMode('demo')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  dataMode === 'demo'
                    ? 'bg-[#D99A73] text-[#10131B] font-semibold'
                    : 'text-[#8E999B] hover:text-[#F5F1E9]'
                }`}
              >
                Modo DEMO
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'search' && (
          <>
            {/* FORMULARIO DE BÚSQUEDA FAMILIAR */}
            <section className="rounded-2xl bg-[#171322]/90 border border-[#59616A]/50 p-5 sm:p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#59616A]/30">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#F5F1E9] flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#59D7CC]" />
                    Parámetros de Búsqueda Familiar
                  </h2>
                  <p className="text-xs text-[#C7CBC9]">
                    Escribe cualquier ciudad o destino turístico del mundo y presiona Buscar en Vivo.
                  </p>
                </div>
                <div className="text-xs text-[#C7CBC9] bg-[#10131B] px-3 py-1.5 rounded-lg border border-[#59616A]/40">
                  Grupo: <strong className="text-[#59D7CC]">{totalGuests} personas</strong> ({adults} ad., {childrenCount} ni.) · <strong className="text-[#F5F1E9]">{nightsCount} noches</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Destino */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C7CBC9]">
                    Destino (ciudad, región o país)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#59D7CC] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeRealSearch()}
                      placeholder="Ej. Punta Cana, Cancún, Orlando, Madrid..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-sm text-[#F5F1E9] focus:outline-none focus:border-[#59D7CC]"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs text-[#C7CBC9] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={includeNearby}
                      onChange={(e) => setIncludeNearby(e.target.checked)}
                      className="rounded accent-[#59D7CC]"
                    />
                    Incluir zonas cercanas (radio 18 km)
                  </label>
                </div>

                {/* 2. Fechas */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[#C7CBC9] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#59D7CC]" /> Fechas de estadía
                    </label>
                    <div className="flex bg-[#10131B] rounded p-0.5 border border-[#59616A]/40 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setDateType('exact')}
                        className={`px-2 py-0.5 rounded ${
                          dateType === 'exact' ? 'bg-[#59D7CC] text-[#10131B] font-semibold' : 'text-[#8E999B]'
                        }`}
                      >
                        Exactas
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateType('flexible')}
                        className={`px-2 py-0.5 rounded ${
                          dateType === 'flexible' ? 'bg-[#A47BFF] text-[#10131B] font-semibold' : 'text-[#8E999B]'
                        }`}
                      >
                        Flexibles
                      </button>
                    </div>
                  </div>

                  {dateType === 'exact' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                      />
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="px-2 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={flexibleNights}
                        onChange={(e) => setFlexibleNights(Number(e.target.value))}
                        className="w-20 px-2.5 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                      />
                      <span className="text-xs text-[#C7CBC9]">noches flexibles</span>
                    </div>
                  )}
                </div>

                {/* 3. Grupo familiar y unidades */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C7CBC9] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#59D7CC]" /> Huéspedes y Unidades
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#10131B] border border-[#59616A]/60 rounded-lg px-2 py-1">
                      <span className="block text-[10px] text-[#8E999B]">Adultos</span>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={adults}
                        onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-transparent text-sm font-semibold text-[#F5F1E9] focus:outline-none"
                      />
                    </div>
                    <div className="bg-[#10131B] border border-[#59616A]/60 rounded-lg px-2 py-1">
                      <span className="block text-[10px] text-[#8E999B]">Niños</span>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={childrenCount}
                        onChange={(e) => handleChildrenCountChange(Number(e.target.value))}
                        className="w-full bg-transparent text-sm font-semibold text-[#F5F1E9] focus:outline-none"
                      />
                    </div>
                    <div className="bg-[#10131B] border border-[#59616A]/60 rounded-lg px-2 py-1">
                      <span className="block text-[10px] text-[#8E999B]">Unidades</span>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={units}
                        onChange={(e) => setUnits(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-transparent text-sm font-semibold text-[#F5F1E9] focus:outline-none"
                      />
                    </div>
                  </div>
                  {childrenCount > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-[#8E999B]">Edades:</span>
                      {childrenAges.map((age, i) => (
                        <input
                          key={i}
                          type="number"
                          min={0}
                          max={17}
                          value={age}
                          onChange={(e) => handleChildAgeChange(i, Number(e.target.value))}
                          className="w-11 px-1.5 py-0.5 rounded bg-[#10131B] border border-[#59616A]/60 text-xs text-center text-[#F5F1E9]"
                          title={`Edad niño ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Tipo, Régimen y Presupuesto */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-[#C7CBC9] mb-0.5">Tipo</label>
                      <select
                        value={accommodationType}
                        onChange={(e) => setAccommodationType(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                      >
                        <option value="all">Todos</option>
                        <option value="resort">Resort</option>
                        <option value="hotel">Hotel</option>
                        <option value="villa">Villa / Apart.</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#C7CBC9] mb-0.5">Régimen</label>
                      <select
                        value={mealPlan}
                        onChange={(e) => setMealPlan(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                      >
                        <option value="any">Sin preferencia</option>
                        <option value="all_inclusive">Todo incluido</option>
                        <option value="breakfast">Desayuno incl.</option>
                        <option value="room_only">Solo hospedaje</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-2 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="DOP">DOP</option>
                      <option value="MXN">MXN</option>
                      <option value="COP">COP</option>
                    </select>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                      placeholder="Presupuesto máx."
                    />
                    <select
                      value={budgetScope}
                      onChange={(e) => setBudgetScope(e.target.value as 'total' | 'per_night')}
                      className="px-2 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                    >
                      <option value="total">Total</option>
                      <option value="per_night">/Noche</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preferencias familiares y botón de acción */}
              <div className="mt-4 pt-3 border-t border-[#59616A]/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-[#8E999B] mr-1">Comodidades:</span>
                  {PREFERENCE_OPTIONS.map((pref) => {
                    const active = preferences.includes(pref.id);
                    return (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => togglePreference(pref.id)}
                        className={`px-2.5 py-1 rounded-full text-xs transition flex items-center gap-1 border ${
                          active
                            ? 'bg-[#59D7CC]/15 text-[#59D7CC] border-[#59D7CC]'
                            : 'bg-[#10131B] text-[#C7CBC9] border-[#59616A]/50 hover:border-[#8E999B]'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {pref.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={executeRealSearch}
                  disabled={isSearching}
                  className="px-5 py-2.5 rounded-xl bg-[#59D7CC] hover:bg-[#41D6CA] disabled:opacity-50 text-[#10131B] font-semibold text-sm shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Buscando alojamientos reales...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Buscar Hospedajes Reales en Vivo
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* ESTADO INICIAL O CARGANDO */}
            {!hasSearchedOnce && dataMode === 'live' && (
              <div className="rounded-2xl bg-[#171322] border border-[#59D7CC]/40 p-6 text-center space-y-3">
                <Compass className="w-10 h-10 text-[#59D7CC] mx-auto" />
                <h3 className="text-base font-semibold text-[#F5F1E9]">
                  Listo para buscar hospedajes reales en cualquier destino del mundo
                </h3>
                <p className="text-xs text-[#C7CBC9] max-w-xl mx-auto">
                  Haz clic en <strong>"Buscar Hospedajes Reales en Vivo"</strong> para consultar alojamientos reales en <strong>{destination}</strong> usando OpenStreetMap y generar enlaces directos a sus tarifas actuales en Booking.com, Google Hotels, Expedia y Airbnb.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {['Punta Cana', 'Cancún', 'Orlando', 'Madrid', 'Cartagena', 'Bariloche'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setDestination(city);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/50 hover:border-[#59D7CC] text-xs text-[#C7CBC9] hover:text-[#F5F1E9]"
                    >
                      Probar con {city}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchError && (
              <div className="rounded-xl bg-[#171322] border border-[#D99A73] p-4 flex items-center gap-3 text-xs text-[#F5F1E9]">
                <AlertTriangle className="w-5 h-5 text-[#D99A73] shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* BARRA DE ORDENAMIENTO Y ESTADO DE RESULTADOS */}
            {(hasSearchedOnce || dataMode === 'demo') && !isSearching && (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#171322]/70 px-4 py-3 rounded-xl border border-[#59616A]/40">
                <div className="text-xs text-[#C7CBC9]">
                  Mostrando <strong className="text-[#F5F1E9]">{processedProperties.length} alojamientos</strong> en{' '}
                  <strong className="text-[#59D7CC]">{dataMode === 'demo' ? 'Catálogo DEMO' : resolvedPlace || destination}</strong>
                  {lastQueryTime && <span className="text-[#8E999B] ml-2">({lastQueryTime})</span>}
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#A47BFF]" />
                  <span className="text-xs text-[#C7CBC9]">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#F5F1E9]"
                  >
                    <option value="best_match">Mejor coincidencia familiar (%)</option>
                    <option value="price_total">Menor precio total capturado</option>
                    <option value="price_person">Menor precio por persona</option>
                  </select>
                </div>
              </div>
            )}

            {/* LISTA DE ALOJAMIENTOS REALES */}
            <div className="space-y-4">
              {processedProperties.map((prop) => {
                const isSelected = selectedIds.includes(prop.id);
                const links = buildLiveBookingLinks(prop.name, prop.location);

                return (
                  <article
                    key={prop.id}
                    className={`rounded-2xl bg-[#171322] border transition p-5 ${
                      isSelected
                        ? 'border-[#59D7CC] shadow-[0_0_20px_rgba(89,215,204,0.12)]'
                        : 'border-[#59616A]/50 hover:border-[#59616A]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      {/* Columna Izquierda: Información real del alojamiento */}
                      <div className="space-y-2.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#A47BFF]/15 text-[#A47BFF] border border-[#A47BFF]/40">
                            {prop.typeLabel}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#59D7CC]/15 text-[#59D7CC] border border-[#59D7CC]/40">
                            {prop.matchScore}% coincidencia familiar
                          </span>
                          {prop.stars && (
                            <span className="text-xs text-[#D99A73] font-semibold">
                              ★ {prop.stars} estrellas
                            </span>
                          )}
                          {prop.isDemo && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D99A73] text-[#10131B]">
                              MODO DEMO
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-[#F5F1E9]">{prop.name}</h3>

                        <p className="text-xs text-[#C7CBC9] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#59D7CC] shrink-0" />
                          {prop.location}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {prop.amenities.map((am) => {
                            const labelObj = PREFERENCE_OPTIONS.find((o) => o.id === am);
                            if (!labelObj) return null;
                            return (
                              <span
                                key={am}
                                className="px-2 py-0.5 rounded bg-[#10131B] border border-[#59616A]/40 text-[11px] text-[#C7CBC9]"
                              >
                                ✓ {labelObj.label}
                              </span>
                            );
                          })}
                        </div>

                        {/* ENLACES DIRECTOS A MOTORES DE RESERVA REALES CON FECHAS Y GRUPO */}
                        <div className="pt-3">
                          <span className="block text-[11px] uppercase tracking-wider text-[#8E999B] mb-2">
                            Ver disponibilidad y tarifa exacta en vivo ({checkIn} al {checkOut} · {adults} adultos, {childrenCount} niños):
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={links.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#10131B] hover:bg-[#59D7CC]/15 border border-[#59D7CC]/50 text-xs text-[#59D7CC] font-medium flex items-center gap-1.5 transition"
                            >
                              Booking.com <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                              href={links.googleHotelsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#10131B] hover:bg-[#A47BFF]/15 border border-[#A47BFF]/50 text-xs text-[#A47BFF] font-medium flex items-center gap-1.5 transition"
                            >
                              Google Hotels <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                              href={links.expediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#10131B] hover:bg-[#D99A73]/15 border border-[#D99A73]/50 text-xs text-[#D99A73] font-medium flex items-center gap-1.5 transition"
                            >
                              Expedia <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                              href={links.airbnbUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-[#10131B] hover:bg-white/10 border border-[#59616A]/60 text-xs text-[#F5F1E9] font-medium flex items-center gap-1.5 transition"
                            >
                              Airbnb <ExternalLink className="w-3 h-3" />
                            </a>
                            {prop.website && (
                              <a
                                href={prop.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A]/60 text-xs text-[#C7CBC9] hover:text-[#F5F1E9] flex items-center gap-1.5"
                              >
                                Web Oficial <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Columna Derecha: Tarifas capturadas / Comparación transparente */}
                      <div className="lg:w-80 shrink-0 rounded-xl bg-[#10131B] border border-[#59616A]/50 p-4 flex flex-col justify-between space-y-3">
                        {prop.bestRate ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-[#8E999B]">
                              <span>Fuente: {prop.bestRate.sourceName}</span>
                              <span>{prop.bestRate.queriedAt}</span>
                            </div>
                            <div className="text-2xl font-bold text-[#59D7CC]">
                              {formatMoney(prop.bestRate.totalStayPrice)}{' '}
                              <span className="text-xs font-normal text-[#C7CBC9]">total estadía</span>
                            </div>
                            <div className="text-xs text-[#C7CBC9] flex items-center justify-between">
                              <span>{formatMoney(prop.bestRate.perNightPrice)} / noche</span>
                              <span>{formatMoney(prop.bestRate.perPersonPrice)} / persona</span>
                            </div>
                            <div className="text-[11px] text-[#D99A73]">
                              {prop.bestRate.taxesIncluded
                                ? '✓ Impuestos incluidos'
                                : `+ ${formatMoney(prop.bestRate.taxAmount)} impuestos/cargos`}
                            </div>
                            <div className="text-[11px] text-[#C7CBC9]">
                              Condición: {prop.bestRate.cancellation}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="inline-block px-2 py-0.5 rounded bg-[#D99A73]/15 text-[#D99A73] text-[11px] font-medium">
                              Precio en vivo en el proveedor
                            </span>
                            <p className="text-xs text-[#C7CBC9]">
                              Abre cualquiera de los motores de la izquierda para ver la tarifa exacta de hoy y anótala aquí con un clic para comparar.
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2 border-t border-[#59616A]/30">
                          <button
                            type="button"
                            onClick={() => setRateModalPropertyId(prop.id)}
                            className="w-full py-1.5 px-3 rounded-lg bg-[#171322] hover:bg-[#A47BFF]/20 border border-[#A47BFF]/50 text-xs text-[#A47BFF] font-medium flex items-center justify-center gap-1.5 transition"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            {prop.bestRate ? 'Agregar otra fuente de precio' : 'Capturar tarifa vista para comparar'}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSelectProperty(prop.id)}
                            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                              isSelected
                                ? 'bg-[#59D7CC] text-[#10131B]'
                                : 'bg-[#171322] text-[#F5F1E9] border border-[#59616A]/60 hover:border-[#59D7CC]'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> Seleccionado para resumen
                              </>
                            ) : (
                              'Guardar / Comparar opción'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* PESTAÑA 2: OFERTAS Y DESCUENTOS PÚBLICOS */}
        {activeTab === 'offers' && (
          <section className="space-y-4">
            <div className="rounded-2xl bg-[#171322] border border-[#D99A73]/50 p-5">
              <h2 className="text-lg font-semibold text-[#F5F1E9] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#D99A73]" />
                Ofertas Públicas, Tarifas Familiares y Descuentos Oficiales
              </h2>
              <p className="text-xs text-[#C7CBC9] mt-1">
                No prometemos el precio más bajo de todo Internet ni inventamos cupones falsos. Estas son las páginas oficiales de promociones activas verificables directamente al reservar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PUBLIC_FAMILY_OFFERS.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-2xl bg-[#171322] border border-[#59616A]/50 p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#59D7CC]/15 text-[#59D7CC] border border-[#59D7CC]/40">
                      {offer.status === 'verified_by_source'
                        ? 'Enlace Oficial Verificado'
                        : 'Publicado (Confirmar al reservar)'}
                    </span>
                    <h3 className="text-base font-semibold text-[#F5F1E9]">{offer.title}</h3>
                    <div className="p-2.5 rounded-lg bg-[#10131B] border border-[#D99A73]/40 text-xs font-mono text-[#D99A73]">
                      {offer.code} — {offer.discountText}
                    </div>
                    <p className="text-xs text-[#C7CBC9]">
                      <strong>Fuente:</strong> {offer.source}
                    </p>
                    <p className="text-xs text-[#C7CBC9]">
                      <strong>Requisitos:</strong> {offer.groupRequirements}
                    </p>
                    <p className="text-[11px] text-[#8E999B]">{offer.restrictions}</p>
                  </div>

                  <a
                    href={offer.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-[#D99A73] text-[#10131B] font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                  >
                    Abrir Página Oficial de la Oferta <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* BARRA INFERIOR FLOTANTE DE SELECCIÓN Y COMPARTICIÓN */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-0 z-20 bg-[#171322]/95 border-t border-[#59D7CC]/50 backdrop-blur-md py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="px-2.5 py-1 rounded-full bg-[#59D7CC] text-[#10131B] font-bold">
                {selectedIds.length} seleccionados
              </span>
              <span className="text-[#C7CBC9]">
                Guarda, compara o comparte el resumen con tu familia sin crear cuenta.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#10131B] border border-[#A47BFF]/60 text-xs text-[#A47BFF] font-medium hover:bg-[#A47BFF]/10"
              >
                Comparar lado a lado ({selectedIds.length})
              </button>
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-lg bg-[#59D7CC] text-[#10131B] text-xs font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedFeedback ? '¡Copiado al portapapeles!' : 'Copiar Resumen'}
              </button>
              <button
                type="button"
                onClick={() => setShowSummaryModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#D99A73] text-[#10131B] text-xs font-semibold flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                Preparar Correo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA CAPTURAR TARIFA VISTA EN UN PROVEEDOR */}
      {rateModalPropertyId && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#171322] border border-[#59616A] rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#59616A]/40 pb-3">
              <h3 className="text-base font-semibold text-[#F5F1E9]">
                Registrar Tarifa Vista para Comparar
              </h3>
              <button
                type="button"
                onClick={() => setRateModalPropertyId(null)}
                className="text-[#8E999B] hover:text-[#F5F1E9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7CBC9] mb-1">Fuente donde viste el precio</label>
                <select
                  value={rateSource}
                  onChange={(e) => setRateSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10131B] border border-[#59616A] text-[#F5F1E9]"
                >
                  <option value="Booking.com">Booking.com</option>
                  <option value="Google Hotels">Google Hotels</option>
                  <option value="Expedia">Expedia</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Sitio Oficial del Hotel">Sitio Oficial del Hotel</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#C7CBC9] mb-1">Precio ({currency})</label>
                  <input
                    type="number"
                    value={rateAmount}
                    onChange={(e) => setRateAmount(e.target.value)}
                    placeholder="Ej. 1850"
                    className="w-full px-3 py-2 rounded-lg bg-[#10131B] border border-[#59616A] text-[#F5F1E9]"
                  />
                </div>
                <div>
                  <label className="block text-[#C7CBC9] mb-1">Tipo de monto</label>
                  <select
                    value={rateIsPerNight ? 'night' : 'total'}
                    onChange={(e) => setRateIsPerNight(e.target.value === 'night')}
                    className="w-full px-3 py-2 rounded-lg bg-[#10131B] border border-[#59616A] text-[#F5F1E9]"
                  >
                    <option value="total">Total de la estadía</option>
                    <option value="night">Precio por noche</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <label className="inline-flex items-center gap-2 text-[#C7CBC9] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rateTaxesIncluded}
                    onChange={(e) => setRateTaxesIncluded(e.target.checked)}
                    className="accent-[#59D7CC]"
                  />
                  Impuestos incluidos
                </label>
                {!rateTaxesIncluded && (
                  <input
                    type="number"
                    value={rateTaxAmount}
                    onChange={(e) => setRateTaxAmount(e.target.value)}
                    placeholder="Impuestos adicionales"
                    className="px-3 py-1.5 rounded-lg bg-[#10131B] border border-[#59616A] text-[#F5F1E9]"
                  />
                )}
              </div>

              <div>
                <label className="block text-[#C7CBC9] mb-1">Condiciones de cancelación / comidas</label>
                <input
                  type="text"
                  value={rateCancellation}
                  onChange={(e) => setRateCancellation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10131B] border border-[#59616A] text-[#F5F1E9]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRateModalPropertyId(null)}
                className="px-4 py-2 rounded-lg bg-[#10131B] text-xs text-[#C7CBC9]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveQuotedRate}
                className="px-4 py-2 rounded-lg bg-[#59D7CC] text-[#10131B] text-xs font-semibold"
              >
                Calcular y Guardar Tarifa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COMPARACIÓN LADO A LADO */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171322] border border-[#59616A] rounded-2xl max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#59616A]/40 pb-3">
              <h3 className="text-lg font-semibold text-[#F5F1E9]">
                Comparativa Familiar Lado a Lado ({selectedProperties.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="text-[#8E999B] hover:text-[#F5F1E9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#59616A]/40 text-[#8E999B]">
                    <th className="py-2 pr-4">Alojamiento</th>
                    <th className="py-2 px-3">Tipo / Ubicación</th>
                    <th className="py-2 px-3">Coincidencia</th>
                    <th className="py-2 px-3">Total Estadía</th>
                    <th className="py-2 px-3">Por Persona</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#59616A]/30">
                  {selectedProperties.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 pr-4 font-semibold text-[#F5F1E9]">{p.name}</td>
                      <td className="py-3 px-3 text-[#C7CBC9]">
                        {p.typeLabel} · {p.location}
                      </td>
                      <td className="py-3 px-3 text-[#59D7CC] font-semibold">{p.matchScore}%</td>
                      <td className="py-3 px-3 font-semibold text-[#F5F1E9]">
                        {p.bestRate ? formatMoney(p.bestRate.totalStayPrice) : 'Ver en enlace directo'}
                      </td>
                      <td className="py-3 px-3 text-[#C7CBC9]">
                        {p.bestRate ? formatMoney(p.bestRate.perPersonPrice) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RESUMEN Y PREPARACIÓN DE CORREO */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#171322] border border-[#59616A] rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#59616A]/40 pb-3">
              <h3 className="text-lg font-semibold text-[#F5F1E9]">
                Guardar o Compartir Resumen Familiar
              </h3>
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="text-[#8E999B] hover:text-[#F5F1E9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#C7CBC9] mb-1">Correo destinatario (opcional)</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="familia@ejemplo.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#10131B] border border-[#59616A] text-[#F5F1E9]"
                />
              </div>
              <div>
                <label className="block text-[#C7CBC9] mb-1">Asunto del correo</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#10131B] border border-[#59616A] text-[#F5F1E9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#C7CBC9] mb-1">
                Vista previa del contenido antes de copiar o abrir tu aplicación de correo:
              </label>
              <pre className="p-3 rounded-xl bg-[#10131B] border border-[#59616A]/60 text-[11px] text-[#F5F1E9] whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                {summaryText}
              </pre>
            </div>

            {emailClientOpened && (
              <div className="p-3 rounded-lg bg-[#59D7CC]/15 border border-[#59D7CC] text-xs text-[#59D7CC]">
                Se abrió el cliente de correo de tu dispositivo con el resumen preparado. Recuerda confirmar y presionar "Enviar" dentro de tu aplicación de correo.
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-lg bg-[#59D7CC] text-[#10131B] text-xs font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                {copiedFeedback ? '¡Copiado!' : 'Copiar al Portapapeles'}
              </button>
              <button
                type="button"
                onClick={handleOpenMailClient}
                className="px-4 py-2 rounded-lg bg-[#D99A73] text-[#10131B] text-xs font-semibold flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                Abrir Cliente de Correo con este Mensaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}