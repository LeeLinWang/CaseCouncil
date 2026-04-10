import { useState } from 'react'

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function PromptCard({ title, body }) {
  const [copied, setCopied] = useState(false)

  const preview = body.split('\n').slice(0, 3).join('\n')

  function handleCopy() {
    navigator.clipboard.writeText(body).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="rounded-xl p-4 space-y-2"
      style={{ backgroundColor: 'var(--cc-card)', border: '1px solid var(--cc-border)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold" style={{ color: 'var(--cc-tx1)' }}>{title}</h4>
        <button
          onClick={handleCopy}
          title="Copy full prompt to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors"
          style={
            copied
              ? { backgroundColor: 'var(--cc-tx1)', color: 'var(--cc-bg)' }
              : { backgroundColor: 'var(--cc-subtle)', color: 'var(--cc-tx2)', border: '1px solid var(--cc-border)' }
          }
        >
          {copied ? <IconCheck /> : <IconCopy />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="text-xs whitespace-pre-wrap leading-relaxed"
        style={{ color: 'var(--cc-tx3)', fontFamily: 'inherit' }}
      >
        {preview}
      </pre>
    </div>
  )
}

// ── Prompt data ───────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'situational',
    label: 'Situational Analysis',
    prompts: [
      {
        title: 'Case Summary',
        body: `Read the case booklet. Output a clean, sharp case summary.
Slide-ready. No fluff.

---

## 📋 CASE SUMMARY

**Organisation:** [Name]
**Industry:** [Industry]
**Business Model:** [1 line — how they make money or create value]

**Situation:**
[2–3 sentences. What is happening, what do they have,
what has recently changed?]

**Mandate:**
[1–2 sentences. What have they asked you to solve?]

**Key Events:**
- [Year] — [Event + why it matters]
- [Year] — [Event + why it matters]
- [Year] — [Event + why it matters]

**Key Constraints:**
- [Financial / Cultural / Regulatory / Timeline] — [constraint]
- [constraint]

---

### CASE ASKS
Every explicit ask from the case. Flag priority and type.

| # | Case Ask | Priority | Type |
|---|----------|----------|------|
| 1 | [ask] | 🔴 Must / ⚠️ Should | Financial / Strategic / Operational / Social |
| 2 | [ask] | 🔴 / ⚠️ | [type] |
| 3 | [ask] | 🔴 / ⚠️ | [type] |

**The ask that wins the case:**
"[The single most important ask — the one judges score hardest]"

---

### WHAT THE JUDGES WANT
Who: [1 line — likely seniority, function, company background]
They want to see: "[The outcome or vision they are hoping someone delivers]"
They are tired of: "[The safe predictable answer every team gives]"
Hidden priority: "[What matters to them beyond the stated case ask]"

---`,
      },
      {
        title: 'Case Direction',
        body: `## CASE DIRECTION

---

### 1. CASE TYPE & PANEL EXPECTATION
Diagnose what kind of case this is and what the panel wants.
Choose the primary and secondary case type:

Primary: [Creative / Analytical / Financial / Storytelling /
          Operational / Strategic Growth / Turnaround]
Secondary: [second dominant type]

What this means for your approach:
- [1 line on what the panel is primarily evaluating]
- [1 line on the balance between analysis depth vs big ideas]
- [1 line on where your team should spend the most energy]

---

### 2. WHAT JUDGES MUST SEE
Three tiers — be explicit and case-specific.

**Must Have** (lose marks without these):
- [non-negotiable 1]
- [non-negotiable 2]
- [non-negotiable 3]

**Stand Out** (separates good from great):
- [differentiator 1]
- [differentiator 2]

**Win The Case** (the one thing that puts you first):
- [single most impressive move for this specific case]

---

### 3. NORTH STAR
The single strategic positioning that anchors your whole case.

**Before Vision:**
"[1 line — current painful state, specific to this case]"

**Proposed Vision:**
"[1 catchy, inspiring, specific line — the future you are building]"

**North Star Statement:**
"[Bold 1-liner that captures the transformation.
Should feel like a case theme, not a textbook answer.
e.g. 'From landlord to legacy-builder' or
'Turning land rights into lasting community wealth']"

---

### 4. CASE BUCKETS
Break all case asks into 2–3 mutually exclusive buckets.
Each bucket should:
- Group related case asks together
- Have a big, catchy, memorable name
- Flow logically into the next bucket
- Connect back to the North Star

**Bucket 1: [Catchy Name]**
Covers: [which case asks this addresses]
Focus: [1 line on what analysis and strategy lives here]
Leads to: [what question or tension this sets up for Bucket 2]

**Bucket 2: [Catchy Name]**
Covers: [which case asks this addresses]
Focus: [1 line on what analysis and strategy lives here]
Leads to: [what question or tension this sets up for Bucket 3]

**Bucket 3: [Catchy Name — only if needed]**
Covers: [which case asks this addresses]
Focus: [1 line on what analysis and strategy lives here]
Leads to: [how this closes the loop on the North Star]

**Bucket Flow:**
[Bucket 1 Name] → [Bucket 2 Name] → [Bucket 3 Name]
"[1 sentence narrative connecting all 3 buckets to the
North Star — this becomes your case spine]"

---

After output pause and ask:
"✅ Case Direction done. Do the buckets and north star
feel right? Confirm or adjust before Step 3 —
Deep Dive Analysis per Bucket"`,
      },
      {
        title: 'Sit Flow',
        body: `TRIGGER: "analyse bucket [X]: [Bucket Name]"

Run one bucket at a time. Each bucket contains 2 fully developed
analyses. Each analysis produces 1 key insight. The 2 insights
feed into each other and together produce 1 key question.
Insights must compound — the second analysis uses the conclusion
of the first as its input. No observations. No generic outputs.

---

## 🔍 BUCKET [X]: [BUCKET NAME]

---

### ANALYSIS 1: [Name of Analysis]

**Method:** [Name the specific analytical method used]
e.g. Options Evaluation / Market Sizing / Root Cause Analysis /
Competitive Benchmarking / Customer Segmentation /
Stakeholder Trade-off / Trend & Gap / Jobs-to-be-Done

**What this analysis is solving:**
[1 line — the specific question this analysis answers within
this bucket. Frame as a choice or diagnosis.]

**Full Development:**
Develop this analysis completely using the chosen method.
Pull all facts from the case booklet. Use industry benchmarks
where case data is absent. Show the working — not just the
conclusion. This must be detailed enough to put on a slide.

[For Options Evaluation — build options table + ranked criteria]
[For Segmentation — build segment table + scoring]
[For Root Cause — build cause chain]
[For Benchmarking — build comparison table]
[For Market Sizing — build TAM/SAM/SOM with logic]
[For Consumer Journey — map stages + pain points]
Choose and fully develop the right one. Do not template-dump
all methods. Only use what fits.

**What this analysis reveals:**
[2–3 lines. What does the fully developed analysis tell us
that we could not see before running it?]

**Prioritized:** [what rises to the top and why]
**Deprioritized:** [what gets cut and why — be explicit]

---

💡 KEY INSIGHT 1:
"[Sharp strategic conclusion derived from Analysis 1.
Must be slide-headline ready. Must have an ALPHA —
a non-obvious angle a generic team would miss.]"

Alpha: [1 line — the specific non-obvious edge of this insight]

---

### ANALYSIS 2: [Name of Analysis]

**Builds on Insight 1:** [1 line — explicitly state how this
analysis takes the conclusion of Insight 1 as its starting
point and goes one level deeper into it]

**Method:** [Different method from Analysis 1]

**What this analysis is solving:**
[1 line — the next specific question that Insight 1 opened up.
This must be a question that could not have been asked without
first running Analysis 1.]

**Full Development:**
Develop this analysis completely.
The input to this analysis is the prioritized output of
Analysis 1 — not the full original option set.
Narrow the lens. Go deeper, not broader.

[Apply the appropriate method fully as above]

**What this analysis reveals:**
[2–3 lines. What does this deeper analysis tell us that
Insight 1 alone could not tell us?]

**Prioritized:** [what rises to the top and why]
**Deprioritized:** [what gets cut and why]

---

💡 KEY INSIGHT 2:
"[Sharp strategic conclusion derived from Analysis 2.
Must build on and sharpen Insight 1 — not repeat it.
Must have its own ALPHA that is distinct from Insight 1.]"

Alpha: [1 line — what is the additional non-obvious edge here]

---

### KEY QUESTION
Derived from Insight 1 + Insight 2 combined.
This is the single most important unresolved question
that these two insights together surface.
Must:
- Be unanswerable within this bucket alone
- Set up the next bucket or strategy directly
- Reflect the compounded conclusion of both insights
- Be sharp enough to feel like a case pivot moment

❓ "[Key Question]"

---

After output pause and ask:
"✅ Bucket [X] done. Does Analysis 2 build sharply on
Insight 1? Are both alphas distinct? Is the key question
a natural compound of both insights? Confirm or adjust
before Bucket [X+1]."`,
      },
      {
        title: 'Sit Flow Checker',
        body: `TRIGGER: "check SIT"

Read the full SIT as a non-technical judge would.
You care about 4 things only: story, flow, reasoning, insight.
Be direct. Be brief. Every issue gets one fix.

---

## 👹 SIT CHECK

---

### 1. STORY TEST
Does this SIT tell one clear compelling story?
Or does it feel like analysis for the sake of analysis?

Verdict: [1 line — brutally honest]
Fix if needed: "[How to reframe as a story in 1 line]"

---

### 2. FLOW TEST
Read bucket to bucket out loud in your head.
Does each part earn its place and lead naturally to the next?

[Bucket 1] → [Bucket 2] → [Bucket 3]
Verdict: ✅ Natural / ⚠️ Slightly forced / 🔴 Disconnected

Fix if needed: "[Reordering or reframing that flows better]"

---

### 3. INSIGHT TEST
Would a judge remember any of these insights 10 mins later?
Are they surprising, specific, and earned — or predictable?

| Insight | Verdict | Sharper Version |
|---------|---------|-----------------|
| B1 I1 | ✅/⚠️/🔴 | "[only if needed]" |
| B1 I2 | ✅/⚠️/🔴 | "[only if needed]" |
| B2 I1 | ✅/⚠️/🔴 | "[only if needed]" |
| B2 I2 | ✅/⚠️/🔴 | "[only if needed]" |

---

### 4. THE ONE FIX
"[Single most important change to make this land better
with a non-technical judge. Specific. No softening.]"

---`,
      },
    ],
  },
  {
    id: 'strategy',
    label: 'Strategy',
    prompts: [
      {
        title: 'Strategy Maker',
        body: `TRIGGER: "build strategy [bucket X]"

Using the key question, key insights, and case asks from
Bucket [X] — develop one winning strategy. This must be
creative enough to stand out in a Canadian business case
competition while remaining defensible and feasible.
No generic consulting answers. No textbook strategies.

---

## 🏆 STRATEGY [X]: [NAME]

---

### ANSWERS KEY QUESTION:
"[Key question from Bucket X verbatim]"

### GROUNDED IN INSIGHTS:
- [Insight 1 from Bucket X in 1 line]
- [Insight 2 from Bucket X in 1 line]

---

### 1. THE BIG IDEA
[2–3 lines. What is the core strategy in plain language?
It must be immediately exciting, clear, and specific to this
case. No jargon. A non-technical judge must get it instantly.
Should feel inevitable given the insights — not random.]

**Strategy Headline:**
"[One catchy memorable line that captures the big idea.
This becomes the slide title. Make it inspiring.]"

---

### 2. WHAT JUDGES MUST SEE
2–3 specific features, slides, or pieces of information
that sell this idea and make it land with judges.
Each one must serve a purpose: impact, defensibility,
creativity, or feasibility.

**① [Feature/Slide Name]**
What it shows: [1 line]
Why it wins: [1 line — what this proves to a judge]

**② [Feature/Slide Name]**
What it shows: [1 line]
Why it wins: [1 line]

**③ [Feature/Slide Name — only if needed]**
What it shows: [1 line]
Why it wins: [1 line]

---

### 3. CASE STUDY
One real-world example of an organisation that executed
a similar strategy successfully. Must be:
- Specific and named — no vague references
- Relevant to the industry or context of this case
- Used as proof that this works, not just inspiration

**Organisation:** [Name]
**What they did:** [1–2 lines]
**Result:** [specific outcome — number or clear impact]
**Why it applies here:** [1 line connecting it to this case]

---

### 4. RIGHT TO WIN
What gives THIS client the unique right to execute this
strategy better than anyone else?
Ground this in the case booklet — assets, position,
relationships, timing, or mandate.
This is not generic. It must be specific to this client.

- [Unique asset or advantage 1]
- [Unique asset or advantage 2]
- [Why the timing is right — specific to the case context]

---

### BALANCE CHECK
Before finalising, confirm this strategy scores across all 4:

| Dimension | Rating | Reason |
|-----------|--------|--------|
| Impact | ✅/⚠️/🔴 | [1 line] |
| Defensibility | ✅/⚠️/🔴 | [1 line] |
| Creativity | ✅/⚠️/🔴 | [1 line] |
| Feasibility | ✅/⚠️/🔴 | [1 line] |

If any dimension is ⚠️ or 🔴 — fix it before output.`,
      },
      {
        title: 'Strategy Checker',
        body: `Re-read the case booklet and the full strategy for Bucket [X].
You are a strict judge who has seen 50 teams today.
What makes this strategy stop you? What makes you forget it?
Be brutal. Be specific. Every issue gets one fix.

---

## 🔍 STRATEGY [X] CHECK

---

### 1. FIRST IMPRESSION TEST
A judge hears the big idea for the first time.
Do they lean in or tune out?

Verdict: [1 line — is it instantly compelling or forgettable?]
Fix if needed: "[Reframed big idea or headline that lands harder]"

---

### 2. BLIND SPOTS
What has this strategy missed from the case booklet,
the bucket insights, or the competitive landscape?
Max 3. Only flag if it materially weakens the strategy.

- [Blind spot] → Fix: [specific addition or reframe]
- [Blind spot] → Fix: [specific addition or reframe]
- [Blind spot] → Fix: [specific addition or reframe]

---

### 3. STORYTELLING TEST
Does the strategy tell a clear before → after story?
Does the right to win feel earned or generic?
Does the case study make you believe this works?

| Element | Verdict | Fix |
|---------|---------|-----|
| Before → After narrative | ✅/⚠️/🔴 | "[fix or none]" |
| Right to win | ✅/⚠️/🔴 | "[fix or none]" |
| Case study relevance | ✅/⚠️/🔴 | "[fix or none]" |

---

### 4. JUDGE APPEAL
Would this strategy stand out in a thailand business
case competition or blend in with every other team?

Verdict: ✅ Memorable / ⚠️ Solid but safe / 🔴 Generic

What makes it unique: "[1 line or none]"
What makes it blend in: "[1 line or none]"
Fix: "[The specific angle or reframe that makes it stand out]"

---

### 5. THE ONE FIX
"[Single most important change to make this strategy
more appealing, intuitive, and competition-winning.
Specific to this bucket and this case. No softening.]"

---

After output ask:
"✅ Done. Action the fix before moving to
Strategy [X+1] or financials."`,
      },
    ],
  },
  {
    id: 'financials',
    label: 'Financials',
    prompts: [
      {
        title: 'Implementation Timeline',
        body: `Using the fixed strategy and case context, build the implementation
timeline output. Everything must be copy-paste ready for a slide.
No fluff.

---

First, detect the number of strategies from my fixed strategy:
- 2 strategies → 5 parts for Strategy 1, 5 parts for Strategy 2
- 1 strategy → 8 parts total
- 3 strategies → 3 parts for Strategy 1, 3 for Strategy 2,
  2 for Strategy 3

Use the case timeline as the projection window. If unstated,
default to 5 years.

---

## 📋 IMPLEMENTATION TIMELINE OUTPUT

---

### STRATEGY 1: [Name]

**Operational Parts**
These are the actual workstreams executed to implement the strategy.
Evaluation points are SEPARATE and not counted as operational parts.
Format: "[Verb] + [object]" — max 5 words, professional and specific.
Examples of correct format:
- "Developing financial and legal requirements"
- "Training sales team on new product"
- "Piloting launch in key market"
- "Scaling rollout across remaining markets"
- "Integrating systems and operations"

1. [Operational part]
2. [Operational part]
3. [Operational part]
4. [Operational part]
5. [Operational part]

Each part labeled as: ▷ Preparation | ▶ Execution

**Evaluation Point:**
Place ONE evaluation point at a logical midpoint in the timeline.
Format: "Evaluate [X] by tracking [Y metric] across [Z scope]"

**KPI:**
The single metric that DRIVES revenue for this strategy.
Must be a volume, count, rate, or utilization metric — NEVER raw
revenue. Examples of correct KPIs:
- "No. of leases signed" not "Total lease revenue"
- "No. of visitors" not "Total tourism revenue"
- "Occupancy rate (%)" not "Rental income"
- "No. of active tenants" not "Annual rent collected"

KPI: [metric name — volume/count/rate driver]

**KPI Milestones:**
| Checkpoint | Value | Justification |
|------------|-------|---------------|
| Year 1 (post-launch) | [X] | [one line — case data or benchmark] |
| Year 2 | [X] | [one line] |
| End of period (Year [X]) | [X] | [one line] |

Flag each as: 🟢 Case data / 🟡 Industry benchmark / 🔴 Assumption

---

### STRATEGY 2: [Name] (if applicable)

**Operational Parts:**
1. [Operational part]
2. [Operational part]
3. [Operational part]
4. [Operational part]
5. [Operational part]

Each part labeled as: ▷ Preparation | ▶ Execution

**Evaluation Point:**
"Evaluate [X] by tracking [Y] across [Z]"

**KPI:** [volume/count/rate driver — never raw revenue]

**KPI Milestones:**
| Checkpoint | Value | Justification |
|------------|-------|---------------|
| Year 1 (post-launch) | [X] | [one line] |
| Year 2 | [X] | [one line] |
| End of period (Year [X]) | [X] | [one line] |

Flag each as: 🟢 / 🟡 / 🔴

---

### STRATEGY 3: [Name] (if applicable)

**Operational Parts:**
1. [Operational part]
2. [Operational part]

Each part labeled as: ▷ Preparation | ▶ Execution

**Evaluation Point:**
"Evaluate [X] by tracking [Y] across [Z]"

**KPI:** [volume/count/rate driver — never raw revenue]

**KPI Milestones:**
| Checkpoint | Value | Justification |
|------------|-------|---------------|
| Year 1 (post-launch) | [X] | [one line] |
| Year 2 | [X] | [one line] |
| End of period (Year [X]) | [X] | [one line] |

Flag each as: 🟢 / 🟡 / 🔴

---

### ⚡ IMMEDIATE NEXT STEPS
Concrete actions for C-suite immediately post-presentation.
1. [Who does what with whom — 1 line]
2. [Who does what with whom — 1 line]
3. [Who does what with whom — 1 line]`,
      },
      {
        title: 'Risk and Mitigants',
        body: `Using the fixed strategy and case context, generate exactly 3 risks
and mitigations. Always one of each: Company, Consumer, Regulatory.

RULES:
- Specific to THIS strategy and THIS case — never generic
- Nuanced but not case-breaking
- No numbers, percentages, or financial figures
- Each risk: 1 short sharp sentence
- Each mitigation: 1 short sharp sentence
- No excessive detail — clear and clean only
- Order: Company → Consumer → Regulatory

---

## ⚠️ RISKS & MITIGANTS

**01**
Company risk: [short, specific, nuanced]
Mitigation: [short, concrete action]

**02**
Consumer risk: [short, specific, nuanced]
Mitigation: [short, concrete action]

**03**
Regulatory risk: [short, specific, nuanced]
Mitigation: [short, concrete action]

---`,
      },
      {
        title: 'Costs',
        body: `You are a management consulting financial analyst building a competition-grade cost model in Excel for a business case competition.

=== CASE BOOKLET ===
[PASTE FULL CASE BOOKLET TEXT HERE]

=== MY PROPOSED STRATEGIES ===

Strategy 1: [NAME]
[Describe: what it is, how it works, what resources/infrastructure it requires, target market, scale]

Strategy 2: [NAME]
[Describe: what it is, how it works, what resources/infrastructure it requires, target market, scale]

[Add/remove strategies as needed]

=== IMPLEMENTATION TIMELINE ===
- Strategy 1 launches: [e.g., Year 1]
- Strategy 2 launches: [e.g., Year 2]
- Model horizon: [e.g., 5 years — default to 5 if case doesn't specify]

=== INSTRUCTIONS ===

STEP 1 — EXTRACT CASE CONTEXT

Re-read the case booklet. Extract and internalize:
- All financial constraints (budget caps, funding, debt limits)
- All cost figures or benchmarks explicitly given
- Business model and how costs flow (fixed vs. variable, recurring vs. one-time)
- Timeline, phasing, and milestone requirements
- Industry, geography, and regulatory context affecting costs
- Current cost structure if the company already exists

STEP 2 — RESEARCH ASSUMPTIONS

For every cost line item you plan to model, you need a defensible assumption. Use web search to find current, market-accurate benchmarks for any assumption you are not highly confident in. Prioritize:
- Industry-specific unit costs (e.g., cost per sq ft for retail buildout, cloud hosting per user, average salary by role and market)
- Vendor/supplier pricing benchmarks
- Regulatory or compliance cost ranges
- Marketing/acquisition cost benchmarks for the relevant industry
- Inflation rates, currency considerations if applicable

Do not guess. Research it. Every assumption must be traceable to either (a) the case booklet or (b) a real-world benchmark you found.

STEP 3 — BUILD THE COST MODEL

Create an Excel sheet named "Cost_Model" with the following structure:

ROW 1-3: Title block
- Model name, case name, date, currency

SECTION: KEY ASSUMPTIONS
- Clean reference table listing every assumption used in the model
- Columns: Assumption | Value | Unit | Source (case booklet / web research / industry standard)
- All model calculations below MUST reference these assumption cells — no hardcoded numbers in the model body

SECTION: STRATEGY 1 — [NAME] — COST BREAKDOWN
- Subsection: Capital Expenditures
  - Every one-time or phased capital cost on its own row (equipment, technology, infrastructure, buildout, initial inventory, etc.)
  - Subtotal: Total CapEx
- Subsection: Operating Expenditures
  - Every recurring cost on its own row, broken into logical categories:
    - People (salaries, benefits, contractors — by role where possible)
    - Technology & Infrastructure (hosting, software licenses, maintenance)
    - Marketing & Customer Acquisition
    - Facilities (rent, utilities, insurance)
    - Operations (logistics, supplies, COGS if applicable)
    - Regulatory & Compliance
    - General & Administrative (legal, accounting, misc.)
  - Subtotal: Total OpEx
- TOTAL COST — Strategy 1 (CapEx + OpEx)
- Columns: Description | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Total

SECTION: STRATEGY 2 — [NAME] — COST BREAKDOWN
- Same structure as Strategy 1
- Phased to implementation timeline (e.g., if launching Year 2, Year 1 shows $0 or only pre-launch/setup costs)

[Repeat for additional strategies]

SECTION: COMBINED COST SUMMARY
- Strategy 1 total cost per year
- Strategy 2 total cost per year
- [Additional strategies if applicable]
- Combined total per year (reflecting actual launch phasing)
- Cumulative combined cost
- % of total by strategy per year

SECTION: SENSITIVITY ANALYSIS (separate summary table below main model)
- Three scenarios: Base Case | Best Case | Worst Case
- State the sensitivity drivers and % adjustments clearly (e.g., "Best Case: −15% on OpEx, CapEx flat" — adjust % based on what makes sense for the case)
- Total cost per year per scenario
- Variance from base case row

FORMATTING:
- All numbers use formulas referencing the assumptions section
- Consistent number formatting (thousands with commas, no unnecessary decimals)
- Bold all subtotal and total rows
- Light shading to differentiate sections and header rows
- Column A wide enough for descriptive line-item labels
- Include cost growth rate assumptions where costs scale year-over-year (inflation, headcount growth, volume-driven variable costs)
- Every line item should be granular enough that a judge can challenge any single number and you can defend it with the assumption source`,
      },
      {
        title: 'Impact',
        body: `You are a management consulting financial analyst building a competition-grade revenue model in Excel for a business case competition.

=== CASE BOOKLET ===
[PASTE FULL CASE BOOKLET TEXT HERE]

=== MY PROPOSED STRATEGIES ===

Strategy 1: [NAME]
[Describe: what it is, how it generates revenue or creates value, target customer segment, pricing approach, distribution/sales channel, expected scale]

Strategy 2: [NAME]
[Describe: what it is, how it generates revenue or creates value, target customer segment, pricing approach, distribution/sales channel, expected scale]

[Add/remove strategies as needed]

=== IMPLEMENTATION TIMELINE ===
- Strategy 1 launches: [e.g., Year 1]
- Strategy 2 launches: [e.g., Year 2]
- Model horizon: [same as Cost_Model]

=== REFERENCE: COST MODEL ===
The cost model has already been built in a sheet named "Cost_Model" in this workbook. You MUST:
- Read it before building. Align on shared assumptions (timeline, market size, headcount, scale milestones) so the two models are internally consistent.
- Reference Cost_Model directly for any cost-related inputs needed here (e.g., marketing spend for CAC-based revenue logic, headcount for capacity-constrained revenue).
- Use the same currency, timeline, and formatting conventions.
- Do NOT duplicate or recreate cost figures — only pull what is needed for revenue driver calculations.

=== INSTRUCTIONS ===

STEP 1 — EXTRACT CASE CONTEXT

Re-read the case booklet. Extract and internalize:
- All revenue figures, growth rates, or pricing benchmarks explicitly given
- Current revenue model and streams if the company already exists
- Market size data: TAM, SAM, SOM or any market sizing hints
- Customer segments, willingness to pay, purchasing behaviour
- Pricing structures mentioned or implied (subscription, per-unit, tiered, freemium, licensing, ad-based, etc.)
- Competitive pricing context
- Seasonality, cyclicality, or demand volatility
- Regulatory or market constraints on pricing or revenue capture

STEP 2 — RESEARCH ASSUMPTIONS

Use web search to find current, market-accurate benchmarks for every revenue assumption you are not highly confident in. Prioritize:
- Industry-specific pricing benchmarks (e.g., average SaaS ARPU, retail price per unit, ad CPM rates)
- Market size and growth rate data for the relevant industry and geography
- Conversion rate benchmarks (free-to-paid, lead-to-customer, website-to-purchase)
- Churn / retention rate benchmarks for the relevant business model
- Customer acquisition volume benchmarks relative to marketing spend in Cost_Model
- Adoption curves and realistic ramp-up rates for comparable products/services

Do not guess. Research it. Every assumption must be traceable to either (a) the case booklet, (b) the Cost_Model sheet, or (c) a real-world benchmark you found.

STEP 3 — BUILD THE REVENUE MODEL

Create an Excel sheet named "Revenue_Model" with the following structure:

ROW 1-3: Title block
- Model name, case name, date, currency (match Cost_Model)

SECTION: KEY ASSUMPTIONS
- Clean reference table listing every revenue assumption
- Columns: Assumption | Value | Unit | Source (case booklet / Cost_Model / web research)
- All model calculations below MUST reference these cells — no hardcoded numbers in the model body
- Where an assumption is shared with Cost_Model (e.g., market size, headcount), reference the Cost_Model cell directly using a cross-sheet formula (e.g., =Cost_Model!B8) rather than restating the number

SECTION: STRATEGY 1 — [NAME] — REVENUE BREAKDOWN

- Subsection: Revenue Drivers
  Build the bottom-up logic that feeds into revenue. Every driver on its own row:
  - Market size (TAM → SAM → SOM or equivalent scoping)
  - Customer acquisition funnel (addressable audience → leads → conversion → paying customers)
  - Customer count per year (new + retained − churned)
  - Pricing / ARPU / revenue per unit
  - Volume or usage metrics if applicable
  - Retention / churn rate
  - Upsell / cross-sell rates if applicable
  - Any capacity constraints (e.g., max customers your headcount or infrastructure can serve — reference Cost_Model where relevant)

  Each driver row should show the year-by-year progression and the growth logic should be transparent (e.g., "Year 2 customers = Year 1 retained + Year 2 new acquisitions")

- Subsection: Revenue Streams
  Each distinct revenue line on its own row, calculated from the drivers above:
  - Stream 1: [e.g., Subscription revenue = Customers × ARPU × 12]
  - Stream 2: [e.g., Transaction revenue = Transactions × Avg transaction value]
  - Stream 3: [e.g., Licensing, advertising, services, etc.]
  - Subtotal per stream
- TOTAL REVENUE — Strategy 1
- Columns: Description | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 | Total

SECTION: STRATEGY 2 — [NAME] — REVENUE BREAKDOWN
- Same structure as Strategy 1
- Phased to implementation timeline (e.g., if launching Year 2, Year 1 shows $0 or only pilot/pre-launch revenue)
- Driver logic independent from Strategy 1 unless strategies share customers (in which case, call out the overlap and avoid double-counting)

[Repeat for additional strategies]

SECTION: COMBINED REVENUE SUMMARY
- Strategy 1 total revenue per year
- Strategy 2 total revenue per year
- [Additional strategies if applicable]
- Combined total revenue per year (reflecting actual launch phasing)
- Cumulative combined revenue
- % of total by strategy per year
- Year-over-year growth rate (%)

SECTION: PROFITABILITY BRIDGE (references Cost_Model)
- Combined total revenue per year (from above)
- Combined total cost per year (=Cost_Model![relevant cell])
- Gross profit per year (Revenue − Cost)
- Gross margin % per year
- Cumulative profit / (loss)
- Breakeven year identification (label the first year cumulative profit turns positive)

FORMATTING:
- All numbers use formulas referencing the assumptions section or Cost_Model
- Driver rows visually distinct from revenue total rows (lighter font or indented labels)
- Consistent number formatting matching Cost_Model (thousands with commas, no unnecessary decimals)
- Bold all subtotal and total rows
- Light shading to differentiate sections and header rows
- Column A wide enough for descriptive labels
- Revenue growth assumptions should be explicit and visible (not buried in formulas)
- Include a "Revenue per Customer" sanity-check row at the bottom of each strategy to verify the numbers pass a reasonableness test
- Include a "Revenue vs. Cost_Model Marketing Spend" check — show implied CAC (marketing spend / new customers) to verify acquisition economics make sense`,
      },
    ],
  },
  {
    id: 'selling',
    label: 'Selling',
    prompts: [
      {
        title: 'Storyline',
        body: `TRIGGER: "build storyline"

Read the full case — booklet, SIT, both strategies, north star,
and bucket names. Your job is to write the emotional spine of
the entire presentation. This is not analysis. This is the
human thread that makes judges remember your team above all others.

Short. Memorable. Impactful. Personal where it earns it.

---

## 🎯 CASE STORYLINE

---

### 1. OPENING
The first thing the team says when they step in front of judges.
Must:
- Hook the room in 2–3 sentences
- Ground the case in a human truth or tension
- Make the problem feel urgent and real — not academic
- Lead naturally into the north star and bucket flow
- Be personal or emotionally resonant if the case allows it

"[Opening — 2–3 lines max]"

Bridge into case:
"[1 line that transitions from the opening into the
north star and sets up Bucket 1 naturally]"

---

### 2. BUCKET RELEVANCE
How each bucket connects to the storyline thread.
The buckets must feel like chapters of the same story —
not separate analysis sections.

**Bucket 1: [Name]**
Its role in the story: [1 line — what tension does it resolve?]
Story beat: "[How to introduce this bucket in 1 compelling line]"

**Bucket 2: [Name]**
Its role in the story: [1 line — how does it build on Bucket 1?]
Story beat: "[How to introduce this bucket in 1 compelling line]"

**Bucket 3: [Name — if applicable]**
Its role in the story: [1 line — how does it close the loop?]
Story beat: "[How to introduce this bucket in 1 compelling line]"

---

### 3. FULL CIRCLE ENDING
The last thing the team says.
Must:
- Echo the opening directly — same image, tension, or language
- Show the transformation from before to after
- Land on the north star vision
- Leave the room with one lasting feeling or image
- Be 2–3 lines max — no summary, no recap

"[Ending — 2–3 lines max]"

---

### 4. STORYLINE SPINE
The complete thread in one view.
Use this as the emotional backbone of the entire presentation.

Opening: "[First line of opening]"
     ↓
Bucket 1: "[Story beat]"
     ↓
Bucket 2: "[Story beat]"
     ↓
[Bucket 3 if applicable]
     ↓
Ending: "[Last line of closing]"`,
      },
    ],
  },
]

// ── Overlay ───────────────────────────────────────────────────────────────────

export default function CasingPromptsOverlay({ onClose }) {
  const [activeSection, setActiveSection] = useState('situational')
  const section = SECTIONS.find((s) => s.id === activeSection)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: 'min(80vw, 1000px)',
          height: 'min(85vh, 800px)',
          backgroundColor: 'var(--cc-bg)',
          border: '1px solid var(--cc-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--cc-border)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--cc-tx1)' }}>
            Casing Prompts
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ color: 'var(--cc-tx2)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <IconClose />
          </button>
        </div>

        {/* Section tabs */}
        <div
          className="flex items-center gap-1 px-6 py-3 flex-shrink-0 flex-wrap"
          style={{ borderBottom: '1px solid var(--cc-border)' }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={
                activeSection === s.id
                  ? { backgroundColor: 'var(--cc-tx1)', color: 'var(--cc-bg)' }
                  : { color: 'var(--cc-tx2)' }
              }
              onMouseEnter={(e) => {
                if (activeSection !== s.id) e.currentTarget.style.backgroundColor = 'var(--cc-hover)'
              }}
              onMouseLeave={(e) => {
                if (activeSection !== s.id) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {section.prompts.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--cc-tx3)' }}>
              No prompts yet in this section.
            </p>
          ) : (
            section.prompts.map((p) => (
              <PromptCard key={p.title} title={p.title} body={p.body} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
