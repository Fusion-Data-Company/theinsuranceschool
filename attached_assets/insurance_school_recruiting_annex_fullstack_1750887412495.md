
# 🚀 INSURANCE SCHOOL RECRUITING ANNEX – FULL STACK CYBERPUNK CRM

**Project Objective:**  
Spin up a futuristic, mechanical, animated, cyberpunk CRM for TheInsuranceSchool.com that runs dual ElevenLabs voice agents, captures every call, lead, payment, and analytic in a local Postgres DB, with a dashboard so slick it looks like Stark Industries made it. This is for high-energy, fully-automated insurance student enrollment, with OpenRouter and webhook-powered agent logic.

---

## 1. DEPENDENCIES & STACK

- **Frontend:** React 18, Vite, Tailwind CSS, DaisyUI, Framer Motion, @splinetool/react-spline
- **Backend:** FastAPI, SQLAlchemy (async), asyncpg, Pydantic, httpx, OpenRouter, ElevenLabs
- **Database:** PostgreSQL 16
- **DevOps:** Docker Compose
- **UX:** Spline 3D, animated SVGs, shimmer/glassmorphism, titanium/metallic/cyberpunk FANG visuals

---

## 2. FILE & FOLDER STRUCTURE

/frontend
  /src
    /components
      HeroCore.jsx    # <-- Your existing hero section here
    /sections
      Hero.jsx
    index.css
    tailwind.config.js
    App.jsx
    main.jsx
  package.json

/backend
  /app
    main.py
    /core
      database.py
      config.py
    /models
      lead.py
      call_record.py
      payment.py
      enrollment.py
      webhook_log.py
      agent_metric.py
    /schemas
      lead.py
      call.py
      payment.py
      enrollment.py
      webhook_log.py
      agent_metric.py
    /crud
      lead.py
      call.py
      payment.py
      enrollment.py
      webhook_log.py
      agent_metric.py
    /api/v1/endpoints
      webhook.py
      leads.py
      analytics.py
    /agents
      jason_ai.py
  requirements.txt

docker-compose.yml  
.env  
README.md

---

## 3. FRONTEND CONFIG

### 3.1 Install & Configure

- Run:
  - npx create-vite@latest recruiting-annex --template react
  - cd recruiting-annex
  - pnpm install -D tailwindcss postcss autoprefixer @tailwindcss/typography daisyui
  - pnpm install framer-motion @splinetool/react-spline react-icons classnames

### 3.2 Tailwind Config (glass, cyberpunk, metallics, shimmer)

```js
// tailwind.config.js
module.exports = {
  content: [ "./index.html", "./src/**/*.{js,jsx,ts,tsx}" ],
  theme: {
    extend: {
      colors: {
        ink: "rgba(15,17,26,0.85)",
        titanium: "#9ea7b8",
        neon: "#00ffff",
        fuchsia: "#ff00e6",
      },
      backgroundImage: {
        grid: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        }
      }
    }
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: { themes: ["cyberpunk"] }
};
```

### 3.3 index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.glass {
  @apply bg-ink/50 backdrop-blur-md border border-white/20 rounded-xl shadow-lg;
}

.btn-glass {
  @apply glass px-6 py-3 font-semibold tracking-wide text-neon hover:bg-ink/70 transition;
  animation: shimmer 2.8s linear infinite;
  background-size: 1400px 100%;
}
```

### 3.4 Hero Section

Hero section leverages your existing HeroCore.jsx component and overlays a Spline 3D scene (from `/assets/enrollmentRig.spline`).

```jsx
import HeroCore from "../components/HeroCore";
import Spline from "@splinetool/react-spline";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Spline scene="/assets/enrollmentRig.spline" className="absolute inset-0" />
      <div className="glass relative z-10 max-w-4xl p-10 text-center">
        <HeroCore />
        <a href="#enroll" className="btn-glass mt-8 inline-block">
          Start Your iPower Move
        </a>
      </div>
    </section>
  );
}
```

### 3.5 Dashboard

- `/dashboard`, `/leads/:id`, `/analytics`, `/settings`
- DaisyUI `menu`, `tabs`, and `stats` for live KPIs
- Framer Motion for slide-in, fade, and metallic sheen effects
- SVG gears/animated widgets in header bar

---

## 4. BACKEND CONFIG

### 4.1 Install & Structure

- python -m venv .venv && source .venv/bin/activate
- pip install fastapi uvicorn[standard] sqlalchemy[asyncio] asyncpg pydantic-settings
- pip install httpx python-dotenv openrouter tiktoken

### 4.2 SQLAlchemy ORM Schema

- **Lead:** id, first_name, last_name, phone, email, license_goal (2-15/2-40/2-14), source, created_at
- **CallRecord:** id, lead_id, call_sid, transcript, sentiment, duration_sec, intent (interested/undecided/opt-out), created_at
- **PaymentPlan:** id, lead_id, plan_chosen (full/199-down/affirm/afterpay/klarna), status, link_sent, updated_at
- **Enrollment:** id, lead_id, course, cohort (day/evening), start_date, status
- **WebhookLog:** id, endpoint, payload (JSONB), received_at
- **AgentMetric:** id, call_record_id, confidence, response_time_ms, avg_pause_ms

- Add indexes for phone, intent, and time for optimized queries.

### 4.3 FastAPI Entrypoint

- main.py sets up FastAPI, DB, and includes routers for `/webhooks`, `/leads`, `/analytics`.

### 4.4 Webhooks

- **POST `/webhooks/elevenlabs-call`**  
  Upsert lead, insert call record & metrics, send payment link if info present

- **POST `/webhooks/internal-query`**  
  Accepts natural language queries, routes to OpenRouter (GPT-4o), returns structured JSON and text

### 4.5 Internal Agent Wrapper

- Agents/jason_ai.py:  
  Function-calling to hit DB CRUD, embedded system prompt: “You are Jason-Analytics, speak as Jason…”

---

## 5. DATA FLOW

1. Caller ➜ ElevenLabs Voice ➔ `/webhooks/elevenlabs-call`
2. FastAPI persists Lead & CallRecord
3. Background triggers payment link (Twilio / SendGrid)
4. React dashboard gets live stats (WebSocket)
5. Internal queries (“How many undecided leads?”) go to `/internal-query`, GPT-4o answers using DB context

---

## 6. DOCKER COMPOSE

version: "3.9"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: annex
      POSTGRES_PASSWORD: annexpwd
      POSTGRES_DB: recruiting
    volumes: [ "db_data:/var/lib/postgresql/data" ]
    ports: [ "5432:5432" ]
  backend:
    build: ./backend
    env_file: .env
    depends_on: [ db ]
    ports: [ "8000:8000" ]
    command: ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
  frontend:
    build: ./frontend
    ports: [ "5173:5173" ]
    command: ["pnpm","run","dev","--","--host"]
volumes:
  db_data:

---

## 7. ENV VARIABLES (.env)

OPENROUTER_API_KEY=sk-...
ELEVENLABS_API_KEY=el-...
DATABASE_URL=postgresql+asyncpg://annex:annexpwd@db:5432/recruiting
SENDGRID_API_KEY=sg-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
PAYMENT_LINK_BASE=https://theinsuranceschool.com/pay

---

## 8. RUN INSTRUCTIONS

pnpm install --frozen-lockfile         # frontend
cd backend && pip install -r requirements.txt
docker compose up -d db               # start Postgres first
pnpm --filter frontend dev &          # port 5173
uvicorn app.main:app --reload         # port 8000

> Smoke test: POST /webhooks/elevenlabs-call with test payload, confirm lead appears on /dashboard.

---

## 9. VISUAL & UX POLISH

- Mechanical dashboard: Animated SVG gears, neon lines, ambient glows, titanium card faces with conic gradients
- All buttons: Glassmorphic, shimmer, and animated on hover
- All transitions: Framer Motion fade-in/fade-out, page animate
- Mobile responsive, enterprise FANG styling
- No placeholders or incomplete components

---

## 10. FINAL NOTES

- Every field in the schema is mapped to either a database value or an analytics/stat in the CRM UI.
- Both webhooks are live, handle all lead/call/enrollment/payment data, and are tested.
- The dashboard is immediately usable, visually elite, and can be white-labeled for other insurance schools with minor tweaks.
- Any sensitive credentials go in .env ONLY.
- If the builder or dev hits an error, all logs should be sent to /backend/app/logs/errors.log for troubleshooting.

---

# DELIVERABLE:  
A full-stack, enterprise, animated, FANG-level CRM for The Insurance School with all code, styling, schema, and deployment configs in a single file—no splitting, no windows, just one mega-prompt.

END OF PROMPT
