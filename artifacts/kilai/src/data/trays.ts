export interface Tray {
  id: number;
  variety: string;
  character: string;
  category: 'tall' | 'short' | 'premium';
  nutrients: string[];         // 3 key nutrient pills
  nutrientNote: string;        // one-line nutritionist insight
  day: number;
  totalDays: number;
  price: number;
  status: 'available' | 'adopted';
  adoptedBy?: string;
}

export const VARIETY_DATA = [
  // ── A. 6-Inch Growing (soaking seeds) ───────────────────────────────────
  {
    name: 'Sunflower',
    category: 'tall' as const,
    character: 'Nutty, rich, and satisfying',
    price: 1800,
    nutrients: ['Vitamin E', 'Selenium', 'B-complex'],
    nutrientNote: 'Highest protein of all microgreens (~28% DW). Anti-inflammatory; heals skin and nerves.',
  },
  {
    name: 'Green Gram',
    category: 'tall' as const,
    character: 'Light, clean, and enzyme-rich',
    price: 1200,
    nutrients: ['Folate', 'Vitamin C', 'Iron'],
    nutrientNote: 'Enzyme-rich when sprouted. Regulates blood sugar and lowers LDL cholesterol.',
  },
  {
    name: 'Black Gram',
    category: 'tall' as const,
    character: 'Earthy, dense, deeply fortifying',
    price: 1200,
    nutrients: ['Calcium', 'Iron', 'Vitamin B1'],
    nutrientNote: 'High protein + calcium. Supports bone density, muscles and the nervous system.',
  },
  {
    name: 'Horse Gram',
    category: 'tall' as const,
    character: 'Robust and quietly bitter',
    price: 1300,
    nutrients: ['Protein 25%', 'Polyphenols', 'Dietary Fibre'],
    nutrientNote: 'Anti-diabetic. Helps prevent kidney stones. Excellent for weight management.',
  },

  // ── B. 2–3 Inch Growing (soaking seeds) ─────────────────────────────────
  {
    name: 'Mustard',
    category: 'short' as const,
    character: 'Warm and sharp, like a whisper of heat',
    price: 1000,
    nutrients: ['Glucosinolates', 'Vitamin A', 'Vitamin K'],
    nutrientNote: 'Glucosinolates have proven cancer-preventive properties. Supports liver detox.',
  },
  {
    name: 'Sesame',
    category: 'short' as const,
    character: 'Toasty, gentle and deeply nourishing',
    price: 1100,
    nutrients: ['Calcium', 'Zinc', 'Lignans'],
    nutrientNote: 'Lignans balance hormones. Exceptional bone and heart support. Rich in zinc.',
  },
  {
    name: 'Radish',
    category: 'short' as const,
    character: 'A clean, peppery bite',
    price: 1000,
    nutrients: ['Sulforaphane', 'Vitamin C', 'Folate'],
    nutrientNote: 'Sulforaphane activates the body\'s own detox enzymes. Powerful liver support.',
  },
  {
    name: 'Fenugreek',
    category: 'short' as const,
    character: 'Aromatic, slightly bitter, deeply warming',
    price: 1100,
    nutrients: ['Iron', 'Galactomannan', 'Magnesium'],
    nutrientNote: 'Galactomannan fibre slows sugar absorption. Excellent for lactating mothers.',
  },
  {
    name: 'Chick Peas',
    category: 'short' as const,
    character: 'Mild, hearty, subtly sweet',
    price: 1200,
    nutrients: ['Protein', 'Folate', 'Vitamin B6'],
    nutrientNote: 'High bioavailable protein and folate. Ideal for muscle building and heart health.',
  },
  {
    name: 'Wheat Grass',
    category: 'short' as const,
    character: 'Intensely green and alive',
    price: 1400,
    nutrients: ['Chlorophyll', 'Vitamin A+C+E', 'Iron'],
    nutrientNote: 'Chlorophyll acts as a blood purifier. Alkalises the body. Powerful energy boost.',
  },
  {
    name: 'Peas',
    category: 'short' as const,
    character: 'Sweet, tender, and fresh as morning',
    price: 1300,
    nutrients: ['Vitamin C', 'Lutein', 'Vitamin K'],
    nutrientNote: 'Lutein and zeaxanthin protect eye health. Strong immune and anti-inflammatory action.',
  },

  // ── C. Premium Seeds ──────────────────────────────────────────────────────
  {
    name: 'Coriander',
    category: 'premium' as const,
    character: 'Bright, citrusy, unmistakable',
    price: 2200,
    nutrients: ['Quercetin', 'Vitamin K', 'Folate'],
    nutrientNote: 'Chelates heavy metals from the body. Calms anxiety. Supports digestive health.',
  },
  {
    name: 'Carrot',
    category: 'premium' as const,
    character: 'Delicate with a hint of root sweetness',
    price: 2400,
    nutrients: ['Beta-carotene', 'Vitamin K', 'Lutein'],
    nutrientNote: 'Beta-carotene converts to Vitamin A — critical for eye, skin and immune function.',
  },
  {
    name: 'Carom (Omam)',
    category: 'premium' as const,
    character: 'Medicinal, warm, a kitchen elder',
    price: 2600,
    nutrients: ['Thymol', 'Vitamin C', 'Calcium'],
    nutrientNote: 'Thymol is a natural antimicrobial. Activates digestive enzymes. Clears congestion.',
  },
  {
    name: 'Black Cumin',
    category: 'premium' as const,
    character: 'Mysterious, pungent, ancestral',
    price: 2800,
    nutrients: ['Thymoquinone', 'Omega-3', 'Iron'],
    nutrientNote: 'Thymoquinone is one of nature\'s most researched anti-inflammatories. Immune modulator.',
  },
  {
    name: 'Beetroot',
    category: 'premium' as const,
    character: 'Earthy, sweet, with a blush of colour',
    price: 2000,
    nutrients: ['Betalains', 'Nitrates', 'Folate'],
    nutrientNote: 'Nitrates lower blood pressure and boost athletic stamina. Betalains protect the liver.',
  },
  {
    name: 'Broccoli',
    category: 'premium' as const,
    character: 'Mild, fresh, a quiet green vitality',
    price: 2200,
    nutrients: ['Sulforaphane', 'Vitamin C', 'Vitamin K'],
    nutrientNote: 'Contains 40× more sulforaphane than mature broccoli. The most studied chemo-protective food.',
  },
  {
    name: 'Red Amaranthus',
    category: 'premium' as const,
    character: 'Delicate crimson leaves, subtly sweet',
    price: 2000,
    nutrients: ['Complete Amino Acids', 'Lysine', 'Vitamin K'],
    nutrientNote: 'One of few plants with all essential amino acids. Exceptional for immunity and bones.',
  },
];

const categoryGradients: Record<string, string> = {
  tall:    'linear-gradient(135deg, #0e2e1a 0%, #1a4a2e 60%, #2a5a3a 100%)',
  short:   'linear-gradient(135deg, #1a3a1a 0%, #2e5c2a 60%, #3a6a30 100%)',
  premium: 'linear-gradient(135deg, #1e1a0e 0%, #3a3010 60%, #4a3c14 100%)',
};

export const varietyGradient = (category: string) =>
  categoryGradients[category] || categoryGradients['short'];

const adoptedByNames = [
  'the Sharma family, Indiranagar', 'Meera, Koramangala', 'the Rajan family, Jayanagar',
  'Priya, HSR Layout', 'the Nair family, Whitefield', 'Anand, Malleshwaram',
  'the Patel family, Electronic City', 'Kavitha, JP Nagar',
];

export const TRAYS: Tray[] = Array.from({ length: 40 }, (_, i) => {
  const v = VARIETY_DATA[i % VARIETY_DATA.length];
  const isAdopted = [1, 3, 7, 11, 15, 18, 22, 26, 30, 34, 37].includes(i);
  return {
    id: 214 + i,
    variety: v.name,
    category: v.category,
    character: v.character,
    nutrients: v.nutrients,
    nutrientNote: v.nutrientNote,
    day: (i % 9) + 1,
    totalDays: 9,
    price: v.price + (i % 3) * 100,
    status: isAdopted ? 'adopted' : 'available',
    adoptedBy: isAdopted ? adoptedByNames[i % adoptedByNames.length] : undefined,
  };
});
