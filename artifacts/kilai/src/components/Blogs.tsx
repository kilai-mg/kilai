import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, Pin } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  teaser: string;
  tag: string;
  readTime: string;
  gradient: string;
  pinned?: boolean;
  body: React.ReactNode[];
}

// ── Pinned Guide Body ─────────────────────────────────────────────────────────

const MicrogreensGuideBody: React.ReactNode[] = [
  <p key="intro" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>
    Microgreens are seedlings harvested at the first true leaf stage — 7 to 14 days after germination.
    Gram for gram, they carry up to <em style={{ color: 'var(--kilai-cream)' }}>40 times the nutrient concentration</em> of their mature counterparts.
    At Kilai, we grow three families of microgreens. Here is what each one does for you.
  </p>,

  <div key="cat-a" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.1rem', color: 'var(--kilai-cream)' }}>
      A. The Tall Ones — 6-Inch Microgreens
    </p>
    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'rgba(168,201,138,0.6)', letterSpacing: '0.08em' }}>
      SUNFLOWER · GREEN GRAM · BLACK GRAM · HORSE GRAM
    </p>
    <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.92rem', color: 'rgba(241,236,221,0.65)', lineHeight: 1.85 }}>
      These are soaking-seed varieties — large seeds that swell before they sprout into tall, sturdy shoots.
      They tend to be the heartiest in texture and the densest in protein and minerals.
    </p>
    {[
      { name: 'Sunflower', nutrients: 'Vitamin E · Selenium · B-complex', note: 'The highest protein microgreen — roughly 28% dry weight. Vitamin E protects cells from oxidative damage; selenium is a critical antioxidant for thyroid function. Add raw to salads or blend into smoothies.' },
      { name: 'Green Gram', nutrients: 'Folate · Vitamin C · Iron', note: 'Enzyme activity surges during sprouting — making nutrients dramatically more bioavailable than in dried dal. Folate is essential for DNA synthesis and is particularly important during pregnancy.' },
      { name: 'Black Gram', nutrients: 'Calcium · Iron · Vitamin B1 (Thiamine)', note: 'One of the best plant-based calcium sources. B1 is essential for nerve conduction and energy metabolism. Builds muscle and supports bone density in growing children.' },
      { name: 'Horse Gram', nutrients: 'Protein 22–25% · Polyphenols · Dietary Fibre', note: 'Polyphenol-rich with proven anti-diabetic action — slows glucose absorption and improves insulin sensitivity. Clinical studies show benefit in dissolving kidney stones. Exceptional for weight management.' },
    ].map(v => (
      <div key={v.name} style={{ borderLeft: '2px solid rgba(168,201,138,0.15)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.92rem', color: 'var(--kilai-cream)' }}>{v.name}</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.65)', letterSpacing: '0.07em' }}>{v.nutrients}</p>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(241,236,221,0.52)', lineHeight: 1.75 }}>{v.note}</p>
      </div>
    ))}
  </div>,

  <div key="cat-b" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.1rem', color: 'var(--kilai-cream)' }}>
      B. The Compact Ones — 2 to 3-Inch Microgreens
    </p>
    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'rgba(168,201,138,0.6)', letterSpacing: '0.08em' }}>
      MUSTARD · SESAME · RADISH · FENUGREEK · CHICK PEAS · WHEAT GRASS · PEAS
    </p>
    <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.92rem', color: 'rgba(241,236,221,0.65)', lineHeight: 1.85 }}>
      Smaller seeds, more delicate shoots — but pound for pound, some of the most medicinally
      significant microgreens in the world. Several of these are rooted in Ayurvedic tradition.
    </p>
    {[
      { name: 'Mustard', nutrients: 'Glucosinolates · Vitamin A · Vitamin K', note: 'Glucosinolates are converted by the body into isothiocyanates — compounds with well-documented cancer-preventive properties. Also a powerful liver detoxifier. Use as a peppery garnish.' },
      { name: 'Sesame', nutrients: 'Calcium · Zinc · Lignans', note: 'Lignans (sesamin, sesamolin) are phytoestrogens that naturally support hormonal balance — particularly beneficial for women. Exceptional calcium-to-phosphorus ratio supports bone mineralisation.' },
      { name: 'Radish', nutrients: 'Sulforaphane · Vitamin C · Folate', note: 'Sulforaphane upregulates Nrf2 — the master switch for the body\'s own detox enzymes. Supports liver health and has shown anti-cancer effects in multiple studies.' },
      { name: 'Fenugreek', nutrients: 'Iron · Galactomannan · Magnesium', note: 'Galactomannan is a soluble fibre that forms a gel in the gut, slowing carbohydrate absorption and improving post-meal blood sugar. Traditionally used to support lactation and reduce inflammation.' },
      { name: 'Chick Peas', nutrients: 'Protein · Folate · Vitamin B6', note: 'Germination dramatically increases bioavailable iron and zinc. B6 supports neurotransmitter production (serotonin, dopamine). Ideal for growing children and athletes.' },
      { name: 'Wheat Grass', nutrients: 'Chlorophyll · Vitamins A C E K · Iron', note: 'Chlorophyll is structurally almost identical to haemoglobin — making it a powerful blood builder. Alkalises the body\'s pH, supports cellular repair and provides rapid, clean energy.' },
      { name: 'Peas', nutrients: 'Vitamin C · Lutein · Zeaxanthin', note: 'Lutein and zeaxanthin concentrate in the macula of the eye and are the primary dietary protectors against age-related macular degeneration. Also high in Vitamin K for bone protection.' },
    ].map(v => (
      <div key={v.name} style={{ borderLeft: '2px solid rgba(168,201,138,0.15)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.92rem', color: 'var(--kilai-cream)' }}>{v.name}</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(168,201,138,0.65)', letterSpacing: '0.07em' }}>{v.nutrients}</p>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(241,236,221,0.52)', lineHeight: 1.75 }}>{v.note}</p>
      </div>
    ))}
  </div>,

  <div key="cat-c" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '1.1rem', color: 'var(--kilai-cream)' }}>
      C. The Rare Ones — Premium Seeds
    </p>
    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.62rem', color: 'rgba(255,210,120,0.65)', letterSpacing: '0.08em' }}>
      CORIANDER · CARROT · CAROM (OMAM) · BLACK CUMIN · BEETROOT · BROCCOLI · RED AMARANTHUS
    </p>
    <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.92rem', color: 'rgba(241,236,221,0.65)', lineHeight: 1.85 }}>
      These are slower to germinate, harder to grow, and richer in rare phytonutrients. 
      Many are rooted in centuries of Siddha and Ayurvedic medicine. Grown in small batches.
    </p>
    {[
      { name: 'Coriander', nutrients: 'Quercetin · Vitamin K · Folate', note: 'One of the most studied heavy metal chelators in food — binds mercury and lead in the gut and aids their elimination. Quercetin is a potent anti-inflammatory flavonoid. Supports anxious minds.' },
      { name: 'Carrot', nutrients: 'Beta-carotene · Vitamin K · Lutein', note: 'Beta-carotene is the most efficient dietary precursor of Vitamin A — critical for vision, immunity and skin integrity. The microgreen form delivers this in a far more absorbable matrix than raw carrot.' },
      { name: 'Carom (Omam)', nutrients: 'Thymol · Vitamin C · Calcium', note: 'Thymol, the active compound in carom, is a natural antifungal and antimicrobial used in Siddha medicine for millennia. Activates bile and digestive enzyme secretion. Clears respiratory congestion.' },
      { name: 'Black Cumin', nutrients: 'Thymoquinone · Omega-3 · Iron', note: 'Thymoquinone may be the most researched single phytonutrient in natural medicine. Published studies show anti-inflammatory, immunomodulatory and anti-tumour effects. A true ancestral superfood.' },
      { name: 'Beetroot', nutrients: 'Betalains · Dietary Nitrates · Folate', note: 'Dietary nitrates convert to nitric oxide in the body — a vasodilator that lowers blood pressure and dramatically boosts athletic endurance. Betalains are among nature\'s most potent liver-protective pigments.' },
      { name: 'Broccoli', nutrients: 'Sulforaphane · Vitamin C · Vitamin K', note: 'Broccoli microgreens contain up to 40× more sulforaphane than mature broccoli heads — making them the most concentrated chemo-protective food known to nutritional science. A small handful daily has measurable effect.' },
      { name: 'Red Amaranthus', nutrients: 'Complete Amino Acids · Lysine · Vitamin K', note: 'One of the very few plant sources to contain all nine essential amino acids, including lysine — typically absent in cereal grains. High in calcium and iron. Its deep red pigment (betacyanin) is a potent antioxidant.' },
    ].map(v => (
      <div key={v.name} style={{ borderLeft: '2px solid rgba(255,210,120,0.15)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: '0.92rem', color: 'var(--kilai-cream)' }}>{v.name}</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(255,210,120,0.6)', letterSpacing: '0.07em' }}>{v.nutrients}</p>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.82rem', color: 'rgba(241,236,221,0.52)', lineHeight: 1.75 }}>{v.note}</p>
      </div>
    ))}
  </div>,

  <p key="close" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.92rem', color: 'rgba(241,236,221,0.55)', lineHeight: 1.9, fontStyle: 'italic' }}>
    Each tray you adopt is grown from seeds that carry centuries of nutritional wisdom — and a very modern understanding of how to unlock it. We grow them like a prayer. You eat them like medicine.
  </p>,
];

// ── Posts ─────────────────────────────────────────────────────────────────────

const POSTS: Post[] = [
  {
    id: 0,
    pinned: true,
    title: 'The Kilai Microgreens Guide: What each variety does for you',
    teaser: 'A nutritionist\'s tour through all 18 varieties we grow — what they carry, why it matters, and how your ancestors already knew.',
    tag: 'Pinned · The complete guide',
    readTime: '8 min',
    gradient: 'linear-gradient(135deg, #0e1e14 0%, #1a3a22 50%, #14442C 100%)',
    body: MicrogreensGuideBody,
  },
  {
    id: 1,
    title: 'Day 4: Why the radish smells like rain',
    teaser: 'There is a specific scent that fills the grow house on the fourth day. We never expected it. We never want it to stop.',
    tag: 'From the grow house',
    readTime: '3 min',
    gradient: 'linear-gradient(135deg, #1a3a1a 0%, #2e5c2a 100%)',
    body: [
      <p key="1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>On day four, something changes in the grow house. The radish seedlings — barely an inch tall — begin to release a scent that is half pepper, half rain on dry earth. We have no scientific explanation for why it happens precisely on day four. But it does, reliably, every cycle.</p>,
      <p key="2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>The first time we noticed it, we stood there for a while, not saying anything. There is a word in Tamil, கிளை (kilai), that means sprout, branch, the beginning of a new direction. That is how the fourth day feels — not the beginning, but the first signal that something real is happening.</p>,
      <p key="3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>Smell, we have come to believe, is the first honest feedback a tray gives you. It tells you the soil is right, the moisture is right, the light is enough. A tray that does not smell on day four needs more attention.</p>,
      <p key="4" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>This is why we will never ship a tray in a sealed bag. The moment you open your Kilai box, that smell — earthy, clean, alive — should be the first thing you notice. It means everything is as it should be.</p>,
    ],
  },
  {
    id: 2,
    title: 'What the Save Soil movement means for your plate',
    teaser: 'We joined the Save Soil movement not because it sounded right, but because we had watched soil die under plastic and called it convenience.',
    tag: 'The vow in practice',
    readTime: '4 min',
    gradient: 'linear-gradient(135deg, #1a2a10 0%, #3a4a18 100%)',
    body: [
      <p key="1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>Forty percent of the world's agricultural topsoil has degraded in the last century. We did not learn this from a documentary. We learned it from a farmer near Coimbatore who showed us his land — land his father had grown turmeric on — now cracked and pale, unable to hold water.</p>,
      <p key="2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>The Save Soil movement has one simple premise: healthy soil is not a farming concern, it is a civilisational one. The food on your plate is only as alive as the soil it came from. Most of us have been eating the memory of soil — nutrients that were once there, now absent.</p>,
      <p key="3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>We are not there yet. But we have shaken hands with three farmers near Coimbatore who farm the way their grandparents did. We are learning their land before we ask them to grow our seeds on it. That is what "direct farmer ties" means to us — not a supply chain, a relationship.</p>,
    ],
  },
  {
    id: 3,
    title: 'How to keep your Kilai tray alive after Day 9',
    teaser: 'The tray that arrives at your home is still living. Here is how to let it keep growing — for another week, quietly, on your windowsill.',
    tag: 'After the harvest',
    readTime: '3 min',
    gradient: 'linear-gradient(135deg, #0e2e22 0%, #1a4a34 100%)',
    body: [
      <p key="1" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>When your Kilai tray arrives, it has been harvested at dawn on Day 9 — but harvested does not mean finished. Microgreens, unlike cut herbs, are still rooted in their growing medium. They will continue to grow, slowly, if you give them what they need.</p>,
      <p key="2" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>In the first hour: place the tray near a window with indirect morning light. Water lightly at the base, not from above. The soil should feel like a damp sponge — not wet, not dry.</p>,
      <p key="3" style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.95rem', color: 'rgba(241,236,221,0.68)', lineHeight: 1.9 }}>Water once every two days. Harvest new growth with clean scissors as it appears. A well-kept tray will give you a second small harvest within five to seven days. When the tray finally slows, the soil and roots make excellent compost. Nothing is wasted. Kilai continues, in a small way, in your own home.</p>,
    ],
  },
];

// ── Card ──────────────────────────────────────────────────────────────────────

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      data-testid={`card-blog-${post.id}`}
      className="flex flex-col rounded-sm overflow-hidden cursor-pointer"
      style={{
        border: post.pinned ? '1px solid rgba(168,201,138,0.22)' : '1px solid rgba(168,201,138,0.1)',
        background: post.pinned ? 'rgba(20,68,44,0.32)' : 'rgba(20,68,44,0.18)',
      }}
    >
      <div style={{ height: post.pinned ? '140px' : '110px', background: post.gradient, flexShrink: 0, position: 'relative' }}>
        {post.pinned && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(10,29,20,0.55)', backdropFilter: 'blur(8px)',
            borderRadius: '3px', padding: '4px 8px',
          }}>
            <Pin size={9} color="rgba(168,201,138,0.8)" />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.55rem', color: 'rgba(168,201,138,0.8)', letterSpacing: '0.08em' }}>
              PINNED
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem',
            color: post.pinned ? 'rgba(168,201,138,0.75)' : 'rgba(168,201,138,0.55)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {post.tag}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.58rem', color: 'rgba(241,236,221,0.25)', letterSpacing: '0.08em' }}>
            {post.readTime}
          </span>
        </div>
        <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: post.pinned ? '1rem' : '0.95rem', color: 'var(--kilai-cream)', lineHeight: 1.5 }}>
          {post.title}
        </p>
        <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 300, fontSize: '0.78rem', color: 'rgba(241,236,221,0.42)', lineHeight: 1.65 }}>
          {post.teaser}
        </p>
      </div>
    </motion.div>
  );
}

// ── Reader ────────────────────────────────────────────────────────────────────

function PostReader({ post, onBack }: { post: Post; onBack: () => void }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: prefersReduced ? 0 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: prefersReduced ? 0 : -30 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="w-full h-full overflow-y-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="max-w-lg md:max-w-2xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-8">
        <button
          onClick={onBack}
          data-testid="button-blog-back"
          className="flex items-center gap-1 self-start transition-opacity hover:opacity-60"
          style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.68rem',
            color: 'rgba(241,236,221,0.4)', background: 'none', border: 'none',
            cursor: 'pointer', letterSpacing: '0.06em', padding: 0,
          }}
        >
          <ChevronLeft size={13} />
          All posts
        </button>

        <div style={{ height: '160px', background: post.gradient, borderRadius: '2px' }} />

        <div className="flex flex-col gap-2">
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem',
            color: 'rgba(168,201,138,0.65)', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {post.tag} · {post.readTime}
          </span>
          <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', color: 'var(--kilai-cream)', lineHeight: 1.4 }}>
            {post.title}
          </p>
        </div>

        <div className="flex flex-col gap-7">
          {post.body.map((node, i) => (
            <div key={i}>{node}</div>
          ))}
        </div>

        <div style={{ height: '48px' }} />
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function Blogs() {
  const prefersReduced = useReducedMotion();
  const [activePost, setActivePost] = useState<Post | null>(null);

  return (
    <div className="w-full h-full overflow-hidden" style={{ background: 'var(--kilai-bg)' }}>
      <AnimatePresence mode="wait">
        {activePost ? (
          <PostReader key="reader" post={activePost} onBack={() => setActivePost(null)} />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: prefersReduced ? 0 : -20 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="max-w-xl md:max-w-5xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.22em', color: 'rgba(241,236,221,0.28)', textTransform: 'uppercase' }}>
                  The journal
                </p>
                <p style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: 'clamp(1.2rem, 3.5vw, 1.7rem)', color: 'var(--kilai-cream)', lineHeight: 1.4 }}>
                  Notes from the grow house.
                </p>
              </div>

              <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-6">
                {POSTS.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: prefersReduced ? 0 : i * 0.1 }}
                    className={post.pinned ? 'md:col-span-2' : ''}
                  >
                    <PostCard post={post} onClick={() => setActivePost(post)} />
                  </motion.div>
                ))}
              </div>

              <div style={{ height: '24px' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
