# GLB-Calculation-StepByStep

A step-by-step cost calculator for importing vehicles from US auctions, built with **Nuxt 4** and **Vue 3**. The user goes through four steps, and the app shows the estimated total cost: vehicle, shipping, auction fees and customs.

## Features

- **4-step form** with a sidebar stepper and Next / Back navigation
- **Vehicle** – choose Car, Auto Parts or Moto and a sub-category
- **Shipping** – accordion selects for auction, location, exit port and destination port; delivery price depends on the location and vehicle type
- **Auction Fee** – Copart buyer fee, live bid fee and gate fee, calculated from the official fee tables for Clean and Non-Clean titles
- **Customs Fee** – import duty, VAT (18%) and fixed customs charges (AZN converted to USD at 1.7)
- **Result page** – estimated total cost with a full breakdown
- A step can't be skipped until its required fields are filled
- Full-screen layout (100vh, no page scroll) that scales with the window

## Tech stack

- [Nuxt 4](https://nuxt.com) / Vue 3 (`<script setup>`, TypeScript)
- Plain scoped CSS, no UI library

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
app/
  pages/index.vue                 page state, step navigation, shared `calc` object
  types/calc.ts                   type of the shared data
  assets/css/main.css             colors, fonts, scale variable (--s)
  components/calculator/
    CalcFrame.vue                 header, Lot search and sidebar stepper
    CalcNav.vue                   Back Step / Next Step buttons
    CalcResult.vue                result page and total
    steps/
      StepVehicle.vue             step 1
      StepShipping.vue            step 2
      StepAuction.vue             step 3
      StepCustoms.vue             step 4
    ui/
      OptionCard.vue              selectable card
      CalcAccordionSelect.vue     accordion select
      CalcIcon.vue                SVG icons
public/images/vehicles/           vehicle images
```

## How it works

`pages/index.vue` creates one reactive `calc` object and shares it with `provide('calc', calc)`. Each step reads it with `inject('calc')`, writes its own result into it and sets `calc.valid[n]` when the step is complete. The result page reads the same object:

```
Total = sub-category price + delivery + bid + auction fees + customs
```

## Editing data

All data is kept inside the step components:

| What | Where |
| --- | --- |
| Sub-categories and prices | `StepVehicle.vue` → `categories` |
| Auction locations and delivery prices | `StepShipping.vue` → `locations` |
| Copart fee tables | `StepAuction.vue` → `fees` |
| Customs fees, VAT, exchange rate | `StepCustoms.vue` → `feesAzn`, `VAT`, `AZN_PER_USD` |

## Not implemented yet

- Lot / Stock number search (the event is emitted, no API connected)
- Fee tables for auctions other than Copart
