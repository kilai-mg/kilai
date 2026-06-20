import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { varietiesTable, traysTable } from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const VARIETIES = [
  // ── A. 6-Inch Tall Grows ─────────────────────────────────────────────
  { name: "Sunflower",  category: "tall",    character: "Nutty, rich, and satisfying",                     priceBase: 1800, nutrients: ["Vitamin E", "Selenium", "B-complex"],             nutrientNote: "Highest protein of all microgreens (~28% DW). Anti-inflammatory; heals skin and nerves." },
  { name: "Green Gram", category: "tall",    character: "Light, clean, and enzyme-rich",                   priceBase: 1200, nutrients: ["Folate", "Vitamin C", "Iron"],                    nutrientNote: "Enzyme-rich when sprouted. Regulates blood sugar and lowers LDL cholesterol." },
  { name: "Black Gram", category: "tall",    character: "Earthy, dense, deeply fortifying",                priceBase: 1200, nutrients: ["Calcium", "Iron", "Vitamin B1"],                  nutrientNote: "High protein + calcium. Supports bone density, muscles and the nervous system." },
  { name: "Horse Gram", category: "tall",    character: "Robust and quietly bitter",                       priceBase: 1300, nutrients: ["Protein 25%", "Polyphenols", "Dietary Fibre"],   nutrientNote: "Anti-diabetic. Helps prevent kidney stones. Excellent for weight management." },
  // ── B. 2–3 Inch Short Grows ──────────────────────────────────────────
  { name: "Mustard",    category: "short",   character: "Warm and sharp, like a whisper of heat",          priceBase: 1000, nutrients: ["Glucosinolates", "Vitamin A", "Vitamin K"],       nutrientNote: "Glucosinolates have proven cancer-preventive properties. Supports liver detox." },
  { name: "Sesame",     category: "short",   character: "Toasty, gentle and deeply nourishing",            priceBase: 1100, nutrients: ["Calcium", "Zinc", "Lignans"],                    nutrientNote: "Lignans balance hormones. Exceptional bone and heart support. Rich in zinc." },
  { name: "Radish",     category: "short",   character: "A clean, peppery bite",                           priceBase: 1000, nutrients: ["Sulforaphane", "Vitamin C", "Folate"],           nutrientNote: "Sulforaphane activates the body's own detox enzymes. Powerful liver support." },
  { name: "Fenugreek",  category: "short",   character: "Aromatic, slightly bitter, deeply warming",       priceBase: 1100, nutrients: ["Iron", "Galactomannan", "Magnesium"],            nutrientNote: "Galactomannan fibre slows sugar absorption. Excellent for lactating mothers." },
  { name: "Chick Peas", category: "short",   character: "Mild, hearty, subtly sweet",                     priceBase: 1200, nutrients: ["Protein", "Folate", "Vitamin B6"],               nutrientNote: "High bioavailable protein and folate. Ideal for muscle building and heart health." },
  { name: "Wheat Grass",category: "short",   character: "Intensely green and alive",                       priceBase: 1400, nutrients: ["Chlorophyll", "Vitamin A+C+E", "Iron"],          nutrientNote: "Chlorophyll acts as a blood purifier. Alkalises the body. Powerful energy boost." },
  { name: "Peas",       category: "short",   character: "Sweet, tender, and fresh as morning",             priceBase: 1300, nutrients: ["Vitamin C", "Lutein", "Vitamin K"],              nutrientNote: "Lutein and zeaxanthin protect eye health. Strong immune and anti-inflammatory action." },
  // ── C. Premium Seeds ─────────────────────────────────────────────────
  { name: "Coriander",       category: "premium", character: "Bright, citrusy, unmistakable",                   priceBase: 2200, nutrients: ["Quercetin", "Vitamin K", "Folate"],          nutrientNote: "Chelates heavy metals from the body. Calms anxiety. Supports digestive health." },
  { name: "Carrot",          category: "premium", character: "Delicate with a hint of root sweetness",          priceBase: 2400, nutrients: ["Beta-carotene", "Vitamin K", "Lutein"],      nutrientNote: "Beta-carotene converts to Vitamin A — critical for eye, skin and immune function." },
  { name: "Carom (Omam)",    category: "premium", character: "Medicinal, warm, a kitchen elder",               priceBase: 2600, nutrients: ["Thymol", "Vitamin C", "Calcium"],             nutrientNote: "Thymol is a natural antimicrobial. Activates digestive enzymes. Clears congestion." },
  { name: "Black Cumin",     category: "premium", character: "Mysterious, pungent, ancestral",                  priceBase: 2800, nutrients: ["Thymoquinone", "Omega-3", "Iron"],           nutrientNote: "Thymoquinone is one of nature's most researched anti-inflammatories. Immune modulator." },
  { name: "Beetroot",        category: "premium", character: "Earthy, sweet, with a blush of colour",          priceBase: 2000, nutrients: ["Betalains", "Nitrates", "Folate"],            nutrientNote: "Nitrates lower blood pressure and boost athletic stamina. Betalains protect the liver." },
  { name: "Broccoli",        category: "premium", character: "Mild, fresh, a quiet green vitality",            priceBase: 2200, nutrients: ["Sulforaphane", "Vitamin C", "Vitamin K"],     nutrientNote: "Contains 40× more sulforaphane than mature broccoli. The most studied chemo-protective food." },
  { name: "Red Amaranthus",  category: "premium", character: "Delicate crimson leaves, subtly sweet",          priceBase: 2000, nutrients: ["Complete Amino Acids", "Lysine", "Vitamin K"], nutrientNote: "One of few plants with all essential amino acids. Exceptional for immunity and bones." },
] as const;

const ADOPTED_INDICES = new Set([1, 3, 7, 11, 15, 18, 22, 26, 30, 34, 37]);
const ADOPTED_NAMES = [
  "the Sharma family, Indiranagar", "Meera, Koramangala", "the Rajan family, Jayanagar",
  "Priya, HSR Layout", "the Nair family, Whitefield", "Anand, Malleshwaram",
  "the Patel family, Electronic City", "Kavitha, JP Nagar",
];

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log("Seeding varieties…");
  const insertedVarieties: Array<{ id: number; name: string }> = [];
  for (const v of VARIETIES) {
    const [row] = await db
      .insert(varietiesTable)
      .values({ name: v.name, category: v.category, character: v.character, priceBase: v.priceBase, nutrients: [...v.nutrients], nutrientNote: v.nutrientNote })
      .onConflictDoUpdate({
        target: varietiesTable.name,
        set: { category: v.category, character: v.character, priceBase: v.priceBase, nutrients: [...v.nutrients], nutrientNote: v.nutrientNote },
      })
      .returning({ id: varietiesTable.id, name: varietiesTable.name });
    insertedVarieties.push(row);
    console.log(`  ✓ ${row.name} (id=${row.id})`);
  }

  console.log("\nSeeding trays…");
  for (let i = 0; i < 40; i++) {
    const v = VARIETIES[i % VARIETIES.length];
    const variety = insertedVarieties.find((r) => r.name === v.name)!;
    const isAdopted = ADOPTED_INDICES.has(i);
    const trayId = 214 + i;
    const day = (i % 9) + 1;
    const price = v.priceBase + (i % 3) * 100;
    const adoptedBy = isAdopted ? ADOPTED_NAMES[i % ADOPTED_NAMES.length] : null;
    const status = isAdopted ? "adopted" : "available";

    const [existing] = await db.select({ id: traysTable.id }).from(traysTable).where(eq(traysTable.id, trayId)).limit(1);
    if (existing) {
      console.log(`  ~ tray #${trayId} already exists, skipping`);
      continue;
    }

    await db.insert(traysTable).values({ id: trayId, varietyId: variety.id, day, totalDays: 9, price, status, adoptedBy });
    console.log(`  ✓ tray #${trayId} ${v.name} day ${day}/${9} ${status}`);
  }

  console.log("\nSeed complete.");
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
