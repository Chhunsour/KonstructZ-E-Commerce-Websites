# Chatbot Knowledge & Development Guide

This guide details how the Konstructz Chat Assistant knowledge layer is structured, how to audit specs completeness, and how to update configuration values.

---

## 1. Where Chatbot Product Data Comes From
Product specs and references are sourced from two primary files in the codebase:
- `src/data/products.ts`: Houses Konstructz product catalog entries.
- `src/data/typhonProducts.ts`: Houses TYPHON Machinery product catalog entries.

These static lists are mapped, filtered, and served inside:
- `src/components/chat/knowledge.ts`: Generates structured maps like `PRODUCT_REFS`, `PRODUCT_DETAIL`, and handles the database fallback config settings load/save/reset actions.
- `src/components/chat/chatbotProductIndex.ts`: Generated automatically by `scripts/extract-product-knowledge.js` containing normalized fields for efficient UI rendering.

---

## 2. How to Update Product Aliases
Product aliases can be updated in two ways:
1. **Admin UI**: Navigate to `/sour/chatbot` (Admin Chatbot Manager), scroll to **Product Aliases**, and enter the custom map:
   ```text
   TYPHON TERROR: terror, typhon terror, terror backhoe, backhoe loader;
   TYPHON TYRANT 17: tyrant, tyrant 17, typhon tyrant, mini excavator 17;
   ```
   *Format: Model Name: alias1, alias2; next model*
2. **Code**: Modify the dynamic fallback in [knowledge.ts](file:///Users/sour/Documents/Konstructz%20Project%20Website/src/components/chat/knowledge.ts) under the default config values.

---

## 3. How to Add Product Specs
Product specs are parsed dynamically from the `specs` attribute of catalog details in `src/data/typhonProducts.ts` or `src/data/products.ts`.
To add a new spec field:
1. Open `src/data/typhonProducts.ts` or `src/data/products.ts`.
2. Locate the target product object and add a spec element to its `specs` array:
   ```typescript
   { label: "Horsepower", value: "25 HP" }
   ```
3. Run the generator script `node scripts/extract-product-knowledge.js` to rebuild the index database.

---

## 4. How to Add Attachment Fitment
Fitment mapping ensures the assistant knows exactly which attachments fit which machines:
1. Open the Admin Manager screen at `/sour/chatbot`.
2. Find the **Attachment Fitments** field.
3. Map attachments to models using the format:
   ```text
   Landscaping Skeleton Rock Bucket Attachment: STOMP 509, STOMP X1300;
   ```
   *Format: Attachment Name: Model1, Model2; next attachment*

---

## 5. How to Edit Warranty & Shipping Text
Warranty, Shipping rules, Returns, and Contact prompts can be modified on the Admin Screen at `/sour/chatbot` under their corresponding fields:
- **Warranty Text**: Default is `“1-year warranty + lifetime technical support.”`
- **Shipping Notes**: Default is `“Shipping is available in the USA. For overseas or international orders, please contact the sales team so they can confirm availability, cost, and delivery options.”`

---

## 6. How to Run the Data Quality Checker
We have two developer scripts inside the `scripts/` folder:
- **Quality Audit Checker**: Runs a detailed data structure check on missing fields and similar names:
  ```bash
  node scripts/check-data-quality.js
  ```
- **Product Knowledge Extraction**: Generates the index mapping `src/components/chat/chatbotProductIndex.ts` and missing specs markdown/json reports:
  ```bash
  node scripts/extract-product-knowledge.js
  ```

---

## 7. How to Test Chatbot Answers
Tests can be validated manually or via automated assertions on the test strings:
- **Lazy specs queries**: `“terror hp”`, `“terror engine”`, `“tyrant 17 weight”`, `“stomp 509 lift”`, `“x1300 price”`, `“vigor 2.0 weight”`, `“skoop hp”`.
- **Fuzzy comparisons**: `“Compare STOMP 509 and STOMP X1300”`, `“Compare VIGOR 1.5 and VIGOR 2.0”`.
- **Fitment compatibility**: `“Does pallet fork fit STOMP 509?”`.

---

## 8. How to Add New Welcome Screen Suggestion Buttons
Welcome suggestion rows are dynamically loaded from config options or computed depending on pathnames:
1. Open [ChatAssistant.tsx](file:///Users/sour/Documents/Konstructz%20Project%20Website/src/components/chat/ChatAssistant.tsx).
2. Locate the `currentSuggestionCards` memo hook.
3. Add a new card object with a real icon, title, subtitle, and prompt action:
   ```typescript
   {
     glyph: CardGlyphs.machine,
     title: "Custom Question Title",
     sub: "Card subtitle text here",
     q: "The question that is sent when clicked"
   }
   ```
