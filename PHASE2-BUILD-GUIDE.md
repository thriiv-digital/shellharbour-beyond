# Phase 2 Build Guide — Shellharbour & Beyond
## Self-Service Member Directory Automation

**Stack:** Tally · Stripe · Make · Airtable · GitHub API · Brevo  
**Last updated:** May 2026

---

## Build Order

Do these in sequence — each step depends on the previous.

1. Airtable base (everything references record IDs)
2. GitHub Personal Access Token
3. Tally Form 1 — Full Submission (sent after payment)
4. Tally Form 2 — Edit Request
5. Make Scenario 1 — New Member Flow
6. Make Scenario 2 — Edit Request Flow
7. Make Scenario 3 — Renewal Reminders
8. Drop URLs into apply.html

---

## Step 1 — Airtable Base Setup

Create a new base called **Shellharbour & Beyond**.

### Table 1: Members

| Field Name | Field Type | Notes |
|---|---|---|
| `id` | Single line text | Slug e.g. `four-t-solutions` — you set this on approval |
| `name` | Single line text | Business name |
| `type` | Single select | All 14 categories (see category list below) |
| `status` | Single select | `pending_payment` / `pending_review` / `active` / `expired` / `rejected` |
| `email` | Email | Primary contact email (used for renewal reminders) |
| `contact_name` | Single line text | Person who submitted |
| `phone` | Phone number | |
| `address` | Single line text | |
| `website` | URL | |
| `facebook` | URL | |
| `instagram` | URL | |
| `linkedin` | URL | |
| `description` | Long text | |
| `logo_url` | URL | Hosted URL of uploaded logo |
| `image_1_url` | URL | |
| `image_2_url` | URL | |
| `image_3_url` | URL | |
| `image_4_url` | URL | |
| `stripe_customer_id` | Single line text | From Stripe payment |
| `stripe_payment_id` | Single line text | From Stripe payment |
| `payment_date` | Date | |
| `renewal_date` | Date | Set to payment_date + 365 days |
| `tally_submission_id` | Single line text | For deduplication |
| `approved_date` | Date | |
| `notes` | Long text | Matt's internal notes |

**Single select options for `status`:**
- `pending_payment` (yellow)
- `pending_review` (orange)
- `active` (green)
- `expired` (red)
- `rejected` (grey)

**Single select options for `type`:**
Arts & Creative · Business Consulting · Finance · Government & Community · Health & Wellness · Hospitality · Marketing · NFP / Community · Professional Services · Real Estate · Retail · Technology · Trades · Other

---

### Table 2: Edit Requests

| Field Name | Field Type | Notes |
|---|---|---|
| `member` | Link to Members table | |
| `submitted_at` | Date | Auto-set by Make |
| `status` | Single select | `pending_approval` / `approved` / `rejected` |
| `submitter_email` | Email | Email they submitted with (for verification) |
| `field_changes` | Long text | JSON string of changed fields |
| `tally_submission_id` | Single line text | |
| `approved_date` | Date | |

---

## Step 2 — GitHub Personal Access Token

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Click **Generate new token**
3. Set:
   - Token name: `shellharbour-beyond-make`
   - Expiration: 1 year (set a reminder to renew)
   - Repository access: **Only select repositories** → `shellharbour-beyond`
   - Permissions → Repository permissions:
     - **Contents**: Read and write
4. Click **Generate token** — copy it immediately, you won't see it again
5. Save it somewhere safe (you'll paste it into Make's HTTP module headers)

---

## Step 3 — Tally Form 1: Full Submission Form

> This form is emailed to members AFTER payment is confirmed.
> It collects all the data needed to populate directory.json.

### Form Settings
- Form name: `Shellharbour & Beyond — Member Submission`
- Set a Thank You page message: *"Thank you! We'll review your listing and have it live within 1–2 business days."*
- Enable **Webhooks** (Settings → Integrations → Webhooks) — paste in your Make Custom Webhook URL (created in Step 5)

### Hidden Fields
Add these hidden fields (Settings → Hidden Fields). They will be pre-filled via URL parameters from Make when the form link is sent.

| Hidden Field Name | Purpose |
|---|---|
| `stripe_payment_id` | Links submission back to the Stripe payment |
| `stripe_customer_email` | Pre-verified email from payment |
| `airtable_record_id` | Links to the pending Airtable record |

### Form Blocks (in order)

**Page 1 — Welcome**
- Content block: *"Complete your listing below. All fields marked * are required. Your listing will go live once reviewed — usually within 1–2 business days."*

**Page 2 — About Your Business**
- **Input — Short Answer*** — Label: `Business Name`
- **Input — Dropdown*** — Label: `Business Category` — Options: all 14 categories (exact spelling matters — must match directory.json)
- **Input — Long Answer*** — Label: `Business Description` — Helper text: *"Describe what you do in 2–4 sentences. This appears on your directory listing."* — Max 500 characters (add character counter)
- **Input — Short Answer** — Label: `Business Address` — Placeholder: *e.g. 123 Smith St, Shellharbour NSW 2529*

**Page 3 — Contact Details**
- **Input — Email*** — Label: `Contact Email` — Helper: *"This is the email we'll use for renewal reminders."* — Pre-fill with hidden field `stripe_customer_email`
- **Input — Short Answer** — Label: `Your Name` — Placeholder: *First and last name*
- **Input — Phone Number** — Label: `Phone Number`
- **Input — Website URL** — Label: `Website` — Placeholder: *https://*
- **Input — Website URL** — Label: `Facebook Page URL`
- **Input — Website URL** — Label: `Instagram Profile URL`
- **Input — Website URL** — Label: `LinkedIn URL`

**Page 4 — Logo & Photos**
- Content block: *"Upload your logo and up to 4 photos. Images should be at least 800×800px, JPG or PNG."*
- **File Upload** — Label: `Business Logo` — Allowed types: JPG, PNG, SVG — Max size: 5MB
- **File Upload** — Label: `Photos (up to 4)` — Allowed types: JPG, PNG — Max size: 5MB each — Multiple files: ON — Max files: 4

**Page 5 — Agreement**
- Content block: Show the membership agreement terms (copy from apply.html)
- **Checkbox*** — Label: `I agree to the Shellharbour & Beyond membership terms` — Required: ON
- Content block: *"By submitting you authorise an annual charge of $50 from your payment method on file."*

**Submit button text:** `Submit My Listing`

---

## Step 4 — Tally Form 2: Edit Request Form

> Existing members use this to request changes to their listing.
> Make verifies their email against Airtable before processing.

### Form Settings
- Form name: `Shellharbour & Beyond — Update My Listing`
- Enable Webhook → paste your Make Scenario 2 Custom Webhook URL

### Form Blocks

**Page 1 — Verify Identity**
- Content block: *"Use the email address you registered with. We'll verify your membership before processing your update."*
- **Input — Email*** — Label: `Your Registered Email Address`
- **Input — Short Answer*** — Label: `Business Name`

**Page 2 — What Would You Like to Change?**
- Content block: *"Only fill in the fields you want to change — leave others blank."*
- **Input — Short Answer** — Label: `New Business Name (if changing)`
- **Input — Dropdown** — Label: `New Business Category (if changing)` — Options: 14 categories + blank/no change
- **Input — Long Answer** — Label: `New Business Description` — Max 500 chars
- **Input — Short Answer** — Label: `New Address`
- **Input — Phone Number** — Label: `New Phone Number`
- **Input — Website URL** — Label: `New Website URL`
- **Input — Website URL** — Label: `New Facebook URL`
- **Input — Website URL** — Label: `New Instagram URL`
- **Input — Website URL** — Label: `New LinkedIn URL`

**Page 3 — Logo & Photos**
- Content block: *"Upload a new logo or photos only if you want to replace your existing ones."*
- **File Upload** — Label: `New Logo (optional)` — JPG/PNG/SVG, 5MB max
- **File Upload** — Label: `New Photos (optional)` — Multiple ON, max 4, JPG/PNG, 5MB each

**Page 4 — Tell Us More**
- **Input — Long Answer** — Label: `Anything else we should know about this update?` — Not required

**Submit button text:** `Submit Update Request`

**Thank You message:** *"Thanks — we'll review your changes and update your listing within 1–2 business days."*

---

## Step 5 — Make Scenario 1: New Member Flow

> Trigger: Stripe payment confirmed → email Tally form → submission received → Airtable record created → Matt approves in Airtable → GitHub JSON updated → live

### Modules in order

---

**Module 1 — Stripe: Watch Events**
- App: **Stripe**
- Module: **Watch Events**
- Event types to watch: `checkout.session.completed` (or `payment_intent.succeeded` if using Payment Links directly)
- Make automatically registers the webhook in your Stripe dashboard
- Connect your Stripe account with your API key (Stripe Dashboard → Developers → API keys → copy Secret key)

---

**Module 2 — Stripe: Get a Customer** *(optional but recommended)*
- App: **Stripe**
- Module: **Retrieve a Customer**
- Customer ID: map `{{1.customer}}` from Module 1
- *Gives you the customer's full name and email if not in the checkout session directly*

---

**Module 3 — Airtable: Create a Record**
- App: **Airtable**
- Module: **Create a Record**
- Base: Shellharbour & Beyond
- Table: Members
- Fields to map:
  - `name`: `{{1.metadata.business_name}}` or leave blank (filled in Step 4)
  - `email`: `{{1.customer_details.email}}`
  - `status`: `pending_review`
  - `stripe_customer_id`: `{{1.customer}}`
  - `stripe_payment_id`: `{{1.payment_intent}}`
  - `payment_date`: `{{formatDate(now; "YYYY-MM-DD")}}`
  - `renewal_date`: `{{formatDate(addDays(now; 365); "YYYY-MM-DD")}}`

> **Note:** Add custom metadata fields to your Stripe Payment Link (Stripe → Payment Links → Edit → Custom fields) to collect `business_name` and `contact_name` at checkout. These come through in `{{1.metadata}}`.

---

**Module 4 — Email: Send an Email (Brevo or Gmail)**
- App: **Brevo** (or Gmail — use whichever you have set up)
- Module: **Send an Email**
- To: `{{1.customer_details.email}}`
- Subject: `Complete your Shellharbour & Beyond listing`
- Body (HTML):
```
Hi {{1.customer_details.name}},

Payment confirmed — thank you for joining Shellharbour & Beyond!

Click the link below to complete your business listing. It takes about 5 minutes.

[Complete My Listing →] https://tally.so/r/YOUR_FORM_ID?stripe_payment_id={{1.payment_intent}}&stripe_customer_email={{1.customer_details.email}}&airtable_record_id={{3.id}}

Your listing will go live within 1–2 business days once we've reviewed it.

Questions? Reply to this email.

— The Shellharbour & Beyond Team
```
> Replace `YOUR_FORM_ID` with your actual Tally form ID from Step 3.

---

**Module 5 — Custom Webhook (separate scenario — Tally submission received)**

> Create a **new scenario** for this module. In Make: New Scenario → Add module → Webhooks → Custom Webhook → Add → copy the URL → paste it into Tally Form 1's webhook settings.

- App: **Webhooks**
- Module: **Custom Webhook**
- Click **Redetermine data structure** then submit a test Tally form — Make will auto-detect all field names

---

**Module 6 — Airtable: Search Records**
- App: **Airtable**
- Module: **Search Records**
- Table: Members
- Filter formula: `{stripe_payment_id} = "{{5.data.fields.stripe_payment_id}}"`
- *Finds the Airtable record created in Module 3 using the hidden field passed from Tally*

---

**Module 7 — Airtable: Update a Record**
- App: **Airtable**
- Module: **Update a Record**
- Record ID: `{{6.id}}` (from search result)
- Fields to update:
  - `name`: `{{5.data.fields.Business_Name}}`
  - `type`: `{{5.data.fields.Business_Category}}`
  - `description`: `{{5.data.fields.Business_Description}}`
  - `address`: `{{5.data.fields.Business_Address}}`
  - `contact_name`: `{{5.data.fields.Your_Name}}`
  - `phone`: `{{5.data.fields.Phone_Number}}`
  - `website`: `{{5.data.fields.Website}}`
  - `facebook`: `{{5.data.fields.Facebook_Page_URL}}`
  - `instagram`: `{{5.data.fields.Instagram_Profile_URL}}`
  - `linkedin`: `{{5.data.fields.LinkedIn_URL}}`
  - `tally_submission_id`: `{{5.data.responseId}}`
  - `status`: `pending_review`
- *Note: File upload URLs — Tally sends hosted URLs for uploaded files in the webhook payload. Map `logo_url` and `image_1_url` etc. from the file upload fields.*

---

**Module 8 — Email: Notify Matt**
- To: your email (matt@...)
- Subject: `[Action Required] New member listing to review — {{5.data.fields.Business_Name}}`
- Body:
```
A new member listing is ready for review.

Business: {{5.data.fields.Business_Name}}
Category: {{5.data.fields.Business_Category}}
Email: {{5.data.fields.Contact_Email}}

Review in Airtable: https://airtable.com/YOUR_BASE_LINK

To approve: change the Status field to "active"
To reject: change the Status field to "rejected"
```

---

**Module 9 — Airtable: Watch Records (new scenario — approval trigger)**

> Create another **new scenario** to watch for Matt's approval.

- App: **Airtable**
- Module: **Watch Records**
- Table: Members
- Filter: Watch for records where `status` changed to `active`
- Poll interval: every 15 minutes

---

**Module 10 — HTTP: Get current directory.json from GitHub**
- App: **HTTP**
- Module: **Make a Request**
- URL: `https://api.github.com/repos/mattwilsonau/shellharbour-beyond/contents/directory.json`
- Method: `GET`
- Headers:
  - `Authorization`: `Bearer YOUR_GITHUB_PAT`
  - `Accept`: `application/vnd.github+json`
  - `X-GitHub-Api-Version`: `2022-11-28`
- Parse response: ON
- *Response gives you `content` (base64 encoded JSON) and `sha` (needed for update)*

---

**Module 11 — Tools: Base64 Decode**
- App: **Tools**
- Module: **Transform text** (or use built-in function)
- In Make, use the formula: `{{base64Decode(10.content)}}`
- This gives you the raw JSON string of directory.json

---

**Module 12 — JSON: Parse JSON**
- App: **JSON**
- Module: **Parse JSON**
- JSON string: output from Module 11
- *Now you have the array of member objects to work with*

---

**Module 13 — Tools: Build new member JSON object**
- App: **Tools**
- Module: **Set Variable** or use a **Text Aggregator**
- Build the new entry as a JSON string using data from Module 9 (Airtable record):
```json
{
  "id": "{{9.id_slug}}",
  "name": "{{9.name}}",
  "type": "{{9.type}}",
  "logo": "{{9.logo_url}}",
  "address": "{{9.address}}",
  "phone": "{{9.phone}}",
  "email": "{{9.email}}",
  "website": "{{9.website}}",
  "facebook": "{{9.facebook}}",
  "instagram": "{{9.instagram}}",
  "linkedin": "{{9.linkedin}}",
  "images": [],
  "description": "{{9.description}}",
  "member_since": "{{formatDate(now; \"YYYY\")}}"
}
```
> **id_slug**: You'll need to set this in Airtable when approving — a lowercase hyphenated version of the business name. Add a formula field in Airtable or set it manually.

---

**Module 14 — HTTP: Push updated directory.json to GitHub**
- App: **HTTP**
- Module: **Make a Request**
- URL: `https://api.github.com/repos/mattwilsonau/shellharbour-beyond/contents/directory.json`
- Method: `PUT`
- Headers:
  - `Authorization`: `Bearer YOUR_GITHUB_PAT`
  - `Accept`: `application/vnd.github+json`
  - `X-GitHub-Api-Version`: `2022-11-28`
  - `Content-Type`: `application/json`
- Body type: `Raw`
- Body:
```json
{
  "message": "Add new member: {{9.name}}",
  "content": "{{base64Encode(newJsonString)}}",
  "sha": "{{10.sha}}"
}
```
> The `content` field must be the **base64-encoded** version of the complete updated JSON array (existing entries + new entry). Use Make's `base64` function.
> The `sha` comes from Module 10 — this is mandatory; GitHub rejects the PUT without it.

---

**Module 15 — Email: Confirmation to new member**
- To: `{{9.email}}`
- Subject: `Your Shellharbour & Beyond listing is live!`
- Body:
```
Hi {{9.contact_name}},

Great news — your listing is now live on the Shellharbour & Beyond directory!

View your listing: https://mattwilsonau.github.io/shellharbour-beyond/member.html?id={{9.id}}

Your membership renews on {{formatDate(9.renewal_date; "D MMMM YYYY")}}. 
We'll send you a reminder 30 days before.

Welcome to the community!
— The Shellharbour & Beyond Team
```

---

## Step 6 — Make Scenario 2: Edit Request Flow

**Module 1 — Custom Webhook**
- New scenario → Webhooks → Custom Webhook
- Paste URL into Tally Form 2's webhook settings
- Redetermine structure via test submission

**Module 2 — Airtable: Search Records**
- Table: Members
- Formula: `AND({email} = "{{1.data.fields.Your_Registered_Email_Address}}", {status} = "active")`
- *Verifies the submitter is an active member*

**Module 3 — Router**
Add a router with two paths:

*Path A — Member found (verified):*

**Module 4A — Airtable: Create a Record (Edit Requests table)**
- `member`: link to `{{2.id}}`
- `submitted_at`: `{{now}}`
- `status`: `pending_approval`
- `submitter_email`: `{{1.data.fields.Your_Registered_Email_Address}}`
- `field_changes`: serialize all non-empty changed fields as JSON text
- `tally_submission_id`: `{{1.data.responseId}}`

**Module 5A — Email: Notify Matt**
- Subject: `[Action Required] Listing update request — {{2.name}}`
- Body: Show current values vs. proposed changes side by side
- Include Airtable link
- Instruction: *"Change Status to 'approved' to apply changes, or 'rejected' to decline."*

*Path B — Member not found:*

**Module 4B — Email: Send to submitter**
- Subject: `We couldn't verify your membership`
- Body: *"We couldn't find an active membership for [email]. Please check the email address you registered with or contact us at [your email]."*

---

**Approval watch (new scenario):**

**Module 1 — Airtable: Watch Records**
- Table: Edit Requests
- Watch for `status` changed to `approved`

**Module 2–6** — Same GitHub GET → decode → parse → update entry → PUT pattern as Scenario 1, but instead of adding a new record you find the existing entry by ID and patch only the changed fields.

**Module 7 — Email: Confirm to member**
- *"Your listing has been updated. [View your listing →]"*

---

## Step 7 — Make Scenario 3: Renewal Reminders

**Module 1 — Schedule trigger**
- App: **Scheduling**
- Runs: Daily at 9:00 AM AEST

**Module 2 — Airtable: Search Records**
- Table: Members
- Formula: `AND({status} = "active", IS_SAME({renewal_date}, DATEADD(TODAY(), 30, 'days'), 'day'))`
- *Finds all members whose renewal is exactly 30 days away*

**Module 3 — Iterator**
- Iterates over each result from Module 2

**Module 4 — Email: Renewal reminder**
- To: `{{3.email}}`
- Subject: `Your Shellharbour & Beyond membership renews in 30 days`
- Body:
```
Hi {{3.contact_name}},

Your Shellharbour & Beyond membership renews on {{formatDate(3.renewal_date; "D MMMM YYYY")}}.

To keep your listing active, click below to renew for another year ($50).

[Renew My Membership →] YOUR_STRIPE_PAYMENT_LINK

If you don't renew by {{formatDate(addDays(3.renewal_date; 14); "D MMMM YYYY")}}, 
your listing will be removed from the directory.

— The Shellharbour & Beyond Team
```

> **Run a second copy of this scenario** with `DATEADD(TODAY(), 7, 'days')` for a 7-day final reminder.

**Module 5 — Airtable: Watch Records (expired members)**
- Separate daily scenario
- Formula: `AND({status} = "active", IS_BEFORE({renewal_date}, TODAY()))`
- For each result: Update status to `expired`
- Then fire the GitHub update to remove the entry from directory.json (same GET → decode → filter out expired → PUT pattern)

---

## Step 8 — Drop URLs into apply.html

Once all external services are live, open `apply.html` and update the two constants at the bottom:

```js
const STRIPE_NEW_MEMBER_URL  = 'https://buy.stripe.com/YOUR_LINK';
const TALLY_EDIT_REQUEST_URL = 'https://tally.so/r/YOUR_EDIT_FORM_ID';
```

That's the only code change needed — everything else is already wired.

---

## Quick Reference — Module Names Cheat Sheet

| What you need | Make App | Module name |
|---|---|---|
| Stripe payment trigger | Stripe | Watch Events |
| Stripe customer lookup | Stripe | Retrieve a Customer |
| Receive Tally form | Webhooks | Custom Webhook |
| Create Airtable record | Airtable | Create a Record |
| Update Airtable record | Airtable | Update a Record |
| Search Airtable | Airtable | Search Records |
| Watch for Airtable changes | Airtable | Watch Records |
| Get GitHub file | HTTP | Make a Request (GET) |
| Push GitHub file | HTTP | Make a Request (PUT) |
| Send email | Brevo / Gmail | Send an Email |
| Loop through results | Flow control | Iterator |
| Branch logic | Flow control | Router |
| Daily schedule | Scheduling | (set on scenario trigger) |
| Encode to base64 | — | Use `base64Encode()` function in any field |
| Decode from base64 | — | Use `base64Decode()` function in any field |

---

## Tally Field Name Reference

When Make receives a Tally webhook, field names come through as the label text with spaces replaced by underscores. These are the exact names to map in Make:

**Form 1 (Submission):**
`Business_Name` · `Business_Category` · `Business_Description` · `Business_Address` · `Contact_Email` · `Your_Name` · `Phone_Number` · `Website` · `Facebook_Page_URL` · `Instagram_Profile_URL` · `LinkedIn_URL` · `Business_Logo` (file URL) · `Photos_up_to_4` (array of file URLs)

**Form 2 (Edit Request):**
`Your_Registered_Email_Address` · `Business_Name` · `New_Business_Name_if_changing` · `New_Business_Category_if_changing` · `New_Business_Description` · `New_Address` · `New_Phone_Number` · `New_Website_URL` · `New_Facebook_URL` · `New_Instagram_URL` · `New_LinkedIn_URL`

> **Tip:** Always click "Redetermine data structure" in Make's Custom Webhook module after submitting a real test form. This auto-maps all field names exactly as Tally sends them — much faster than guessing.

---

*Sources: [Make Webhooks docs](https://help.make.com/webhooks) · [Tally Hidden Fields](https://tally.so/help/hidden-fields) · [Tally Webhooks](https://tally.so/help/webhooks) · [GitHub Contents API](https://docs.github.com/en/rest/repos/contents) · [Stripe Watch Events (Make)](https://apps.make.com/stripe) · [Airtable modules (Make)](https://apps.make.com/airtable-modules)*
