import pg from "pg";
import { randomUUID } from "crypto";

const products = [
  { title: "Hope Blooms Tee", price: 34.99, category: "apparel", image_url: "/images/store/hope-blooms.jpg", description: "A soft, eco-friendly tee with our signature Hope Blooms design." },
  { title: "Sibling Hoodie", price: 59.99, category: "apparel", image_url: "/images/store/hoodie.jpg", description: "Stay cozy while spreading the message of belonging." },
  { title: "Mental Health Matters Tee", price: 34.99, category: "apparel", image_url: "/images/store/mental-health-tee.jpg", description: "Raise awareness with every wear." },
  { title: "True Sibling Long Sleeve", price: 44.99, category: "apparel", image_url: "/images/store/long-sleeve.jpg", description: "Comfort meets purpose." },
  { title: "Crewneck Sweatshirt", price: 64.99, category: "apparel", image_url: "/images/store/crewneck.jpg", description: "Premium heavyweight crewneck." },
  { title: "Together We Rise Tee", price: 34.99, category: "apparel", image_url: "/images/store/together-we-rise.jpg", description: "Unity in every stitch." },
  { title: "Wellness Journal", price: 18.99, category: "journals", image_url: "/images/store/wellness-journal.jpg", description: "Daily prompts for emotional well-being." },
  { title: "Gratitude Journal", price: 16.99, category: "journals", image_url: "/images/store/gratitude-journal.jpg", description: "Cultivate thankfulness daily." },
  { title: "Scented Candle - Calm", price: 24.99, category: "wellness", image_url: "/images/store/candle-calm.jpg", description: "Lavender & chamomile for peaceful moments." },
  { title: "Scented Candle - Hope", price: 24.99, category: "wellness", image_url: "/images/store/candle-hope.jpg", description: "Vanilla & sandalwood to lift your spirits." },
  { title: "Essential Oil Set", price: 32.99, category: "wellness", image_url: "/images/store/oil-set.jpg", description: "Five calming essential oils." },
  { title: "Tote Bag - Belong", price: 22.99, category: "accessories", image_url: "/images/store/tote-belong.jpg", description: "Everyday tote with our Belong message." },
  { title: "Tote Bag - Together", price: 22.99, category: "accessories", image_url: "/images/store/tote-together.jpg", description: "Carry hope wherever you go." },
  { title: "Enamel Pin Set", price: 12.99, category: "accessories", image_url: "/images/store/pin-set.jpg", description: "Four collectible enamel pins." },
  { title: "Reusable Water Bottle", price: 19.99, category: "accessories", image_url: "/images/store/water-bottle.jpg", description: "Stay hydrated while staying connected." },
  { title: "Sibling Socks (3-Pack)", price: 14.99, category: "accessories", image_url: "/images/store/socks.jpg", description: "Fun, colorful socks with hidden messages." },
  { title: "Phone Grip", price: 9.99, category: "accessories", image_url: "/images/store/phone-grip.jpg", description: "A small reminder of belonging every time you pick up your phone." },
  { title: "Gift Card - $25", price: 25.00, category: "gifts", image_url: "/images/store/gift-card.jpg", description: "Give the gift of belonging." },
  { title: "Gift Card - $50", price: 50.00, category: "gifts", image_url: "/images/store/gift-card.jpg", description: "Share hope with someone special." },
  { title: "Gift Card - $100", price: 100.00, category: "gifts", image_url: "/images/store/gift-card.jpg", description: "The perfect gift for any occasion." },
  { title: "Gift Card - $250", price: 250.00, category: "gifts", image_url: "/images/store/gift-card.jpg", description: "Make a meaningful impact." },
  { title: "Parent-Child Journal", price: 21.99, category: "journals", image_url: "/images/store/parent-child-journal.jpg", description: "Strengthen bonds through shared reflection." },
  { title: "Stress Relief Kit", price: 29.99, category: "wellness", image_url: "/images/store/stress-kit.jpg", description: "Everything you need for a calming moment." },
  { title: "Community Cookbook", price: 27.99, category: "gifts", image_url: "/images/store/cookbook.jpg", description: "Recipes and stories from siblings around the world." },
  { title: "Inspirational Poster Set", price: 15.99, category: "accessories", image_url: "/images/store/poster-set.jpg", description: "Set of 4 posters with uplifting messages." },
];

async function main() {
  const connectionString = process.env.PG_CONNECTION_STRING;

  const pool = connectionString
    ? new pg.Pool({ connectionString })
    : new pg.Pool({
        host: process.env.PG_HOST || "localhost",
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "",
        database: process.env.PG_DATABASE || "my_siblings",
        max: 1,
      });

  console.log("Seeding products...");

  for (const product of products) {
    const id = randomUUID();
    try {
      await pool.query(
        `INSERT INTO products (id, title, price, description, image_url, category, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [id, product.title, product.price, product.description, product.image_url, product.category, JSON.stringify([])]
      );
      console.log(`  + ${product.title}`);
    } catch (err) {
      console.error(`  ! ${product.title}: ${err.message}`);
    }
  }

  console.log("Seeding complete.");
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
