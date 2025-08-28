import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import compression from "compression";
import Stripe from "stripe";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(compression()); // gzip compression for responses

// serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// fake DB for leads + pricing
let leads = [];
const pricing = [
  { plan: "Basic", price: 80, features: ["1–3 pages", "2 revisions", "Hosting setup"] },
  { plan: "Standard", price: 250, features: ["Up to 5 pages", "Forms & plugins", "Speed optimization"] },
  { plan: "Premium", price: 500, features: ["7–10 pages", "Full e-commerce", "SEO & integrations"] }
];

// contact form endpoint
app.post("/api/contact", (req, res) => {
  const { name, email, details } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });

  const newLead = { id: leads.length + 1, name, email, details, date: new Date() };
  leads.push(newLead);

  console.log("📩 New Lead:", newLead);
  res.json({ message: "Thanks! I'll get back to you soon." });
});

// pricing endpoint
app.get("/api/pricing", (req, res) => {
  res.json(pricing);
});

// admin view leads (demo only, no auth)
app.get("/api/leads", (req, res) => {
  res.json(leads);
});

// Stripe Checkout
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

app.post("/api/checkout", async (req, res) => {
  try {
    const { plan } = req.body;

    const planMap = {
      Basic: { name: "Basic Website Package", amount: 8000 },
      Standard: { name: "Standard Website Package", amount: 25000 },
      Premium: { name: "Premium Website Package", amount: 50000 },
    };

    const product = planMap[plan];
    if (!product) return res.status(400).json({ error: "Invalid plan" });

    // In case no STRIPE_SECRET_KEY is provided, return a mock URL for demo
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.json({ url: "https://example.com/mock-checkout" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: product.amount,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Payment setup failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
