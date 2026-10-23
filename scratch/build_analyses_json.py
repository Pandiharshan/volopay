import json
import os

analyses = {
  "C01": {
    "primaryRoute": "sales-coaching",
    "secondaryRoute": "customer-follow-up",
    "reviewState": "Action Required",
    "owner": "Arun",
    "whatHappened": "Arun placed a cold sales call to Pranav at Harborlight Advisory proposing an outsourced finance partnership. Pranav expressed immediate irritation at receiving an unsolicited sales pitch on his work number, stated Harborlight was already highly automated, and declined interest.",
    "whyItMatters": "Cold calling business professionals on personal or direct work lines without permission risks reputational damage and violates contact preferences. Pranav explicitly objected to the lead sourcing method.",
    "sourcePassage": 'Pranav: "I don\'t know how I ended up on your list. I didn\'t ask for this call, and I\'m not interested. This number is for my work, not for people to sell things to me... Our processes are already very automated."',
    "limitations": "The call does not reveal how Harborlight Advisory originally entered the contact database beyond Arun stating 'a professional networking outreach programme'.",
    "nextStep": "Flag phone number and Harborlight Advisory domain as 'Do Not Contact' in CRM. Coach Arun on recognizing early opt-out boundaries and avoiding defensive persistence after an explicit refusal.",
    "routeRationale": "Requires sales coaching on cold calling etiquette and contact compliance, alongside updating customer CRM status to Do Not Contact."
  },
  "C02": {
    "primaryRoute": "metadata-only",
    "secondaryRoute": "customer-follow-up",
    "reviewState": "Intake Verified",
    "owner": "Arun",
    "whatHappened": "Arun called Fernhaven Group and reached the receptionist, Kavya, requesting to speak with Leela. Kavya confirmed Leela was out of the office and transferred Arun to her voicemail.",
    "whyItMatters": "Standard administrative routing call resulting in a voicemail transfer. No substantive pitch occurred.",
    "sourcePassage": 'Kavya: "It looks as though she isn\'t in the office today. Would you like to leave a message with me, or would you prefer her voicemail? Her voicemail would be fine, thank you."',
    "limitations": "The transcript terminates at the voicemail transfer; the actual recorded voicemail message (if any) is not captured in this turn extract.",
    "nextStep": "Log voicemail attempt in CRM and schedule follow-up retry for next business day.",
    "routeRationale": "Administrative call with no business qualification; classified as Metadata Only with a routine follow-up task."
  },
  "C03": {
    "primaryRoute": "customer-follow-up",
    "secondaryRoute": "deal-next-steps",
    "reviewState": "Action Required",
    "owner": "Kiran",
    "whatHappened": "Kiran followed up with Milan regarding developer and API access after an agreed 5-week pause. Milan was travelling outdoors with poor audio connectivity, noted that price was a major internal hesitation, but agreed to receive an email proposal and reconnect on Monday/Tuesday.",
    "whyItMatters": "Demonstrates active prospect interest in SpendNest APIs, but highlights price sensitivity and the need for clear written documentation before an internal buying decision.",
    "sourcePassage": 'Milan: "We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it... Could we do this by email? Or call on Monday a bit earlier, when I\'m back indoors? ... Something like \'Developer access and event notifications — follow-up\'"',
    "limitations": "The exact budget limit Milan\'s team has is not stated; Milan was recalling a past conversation from memory while travelling.",
    "nextStep": "Kiran to send email with exact subject line 'Developer access and event notifications — follow-up' outlining tiered API pricing, and calendar a follow-up call for Monday morning.",
    "routeRationale": "Explicit customer-requested follow-up action with agreed email subject and follow-up window."
  },
  "C04": {
    "primaryRoute": "customer-follow-up",
    "secondaryRoute": "metadata-only",
    "reviewState": "Intake Verified",
    "owner": "Arun",
    "whatHappened": "Arun called Ritesh at Lanternpath Media regarding expense management software. The call went to voicemail after an automated screening prompt. Arun left a detailed message explaining that earlier materials were sent to an incorrect email, confirming the resend to the corrected address, and requesting a callback.",
    "whyItMatters": "Resolves a prior communication failure (bounced/wrong email) and keeps the deal open without pressuring the prospect.",
    "sourcePassage": 'Arun: "My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it. Please call me back to let me know where things stand."',
    "limitations": "Unilateral voicemail message; Ritesh\'s current level of interest or receipt of the corrected email cannot be confirmed.",
    "nextStep": "Set automated CRM reminder to check email open/click status and follow up in 3 business days if no callback is received.",
    "routeRationale": "Customer follow-up action required to monitor prospect response following email correction."
  },
  "C05": {
    "primaryRoute": "customer-follow-up",
    "secondaryRoute": "sales-coaching",
    "reviewState": "Action Required",
    "owner": "Meera",
    "whatHappened": "Meera conducted a cold outreach call to a multi-store retail operator. The prospect confirmed their stores already use StoreHarbor and other tools for vendor payments, cards, and instant budgets, but agreed to receive a SpendNest presentation via email (contact05@example.com) for future consideration.",
    "whyItMatters": "Identifies StoreHarbor as an incumbent competitor in the multi-location retail sector. The prospect is satisfied with current tooling, indicating a long-cycle nurture or displacement opportunity rather than an immediate deal.",
    "sourcePassage": 'Prospect: "We already have that... What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then... contact05@example.com."',
    "limitations": "The prospect agreed only to review collateral; no immediate buying intent, pain point, or evaluation timeline was expressed.",
    "nextStep": "Meera to email the multi-store retail product overview to contact05@example.com and add the company to the quarterly competitive nurture sequence.",
    "routeRationale": "Customer nurture follow-up; also useful for sales coaching on competitive differentiation against StoreHarbor."
  },
  "C06": {
    "primaryRoute": "sales-coaching",
    "secondaryRoute": "customer-follow-up",
    "reviewState": "Action Required",
    "owner": "Meera (Logged Rep) / Ravi (Spoken Rep)",
    "whatHappened": "A representative introduced as 'Ravi' placed a cold call to Mr Nikhil at a retail enterprise operating over 120 stores. Nikhil stated that automated systems and corporate cards are already fully deployed from head office. When the rep probed on cash advances vs cards, Nikhil politely reiterated that current arrangements are complete and declined further discussion.",
    "whyItMatters": "Two major insights: (1) Account discrepancy—the call record is logged under rep Meera, but the spoken caller identified as Ravi, indicating account sharing or logging mismatches. (2) High level of automation among large retail prospects requires differentiated value props beyond basic card issuance.",
    "sourcePassage": 'Ravi: "Hello? Good evening, Mr Nikhil... Ravi here. I\'ll say at the start that this is a cold call... The essential processes are automated and connected through our business management system. Head office manages it, and we have full visibility."',
    "limitations": "The dataset does not provide an internal staff directory to verify why Ravi operated under Meera\'s user account.",
    "nextStep": "Sales manager to investigate call credential/recording assignment between Meera and Ravi. Update CRM record to note 120-store enterprise with existing centralized ERP.",
    "routeRationale": "High coaching and operational priority due to rep identity mismatch and cold call qualification techniques."
  },
  "C07": {
    "primaryRoute": "partner-vendor",
    "secondaryRoute": "deal-next-steps",
    "reviewState": "Action Required",
    "owner": "Dev",
    "whatHappened": "Dev called Mr Aditya at Willowbank Advisory to discuss a partnership. Willowbank assists clients with overseas company incorporation and bank account opening. Aditya confirmed they actively refer clients for digital business accounts, requested a proposal via mobile messaging, and agreed to a follow-up call on Monday.",
    "whyItMatters": "High-potential distribution partnership. Advisory firms incorporating foreign entities represent a steady stream of pre-qualified business account applicants for SpendNest.",
    "sourcePassage": 'Aditya: "Yes, that is something we normally do... could you message me on our chat app and send whatever proposal you have? ... Once you\'ve received them, could I call on Monday to see whether you\'d like to discuss it further? Yes, that\'s fine."',
    "limitations": "Aditya requested a proposal over mobile messaging; commercial terms (revenue share, referral links) were not yet negotiated on this call.",
    "nextStep": "Dev to send partner overview and digital business account briefing via messaging app, and schedule a call for Monday morning.",
    "routeRationale": "Core channel partnership opportunity requiring partner enablement and structured follow-up."
  },
  "C08": {
    "primaryRoute": "deal-next-steps",
    "secondaryRoute": "customer-follow-up",
    "reviewState": "Action Required",
    "owner": "Meera",
    "whatHappened": "Meera contacted Mr Raghav regarding SpendNest\'s expense and vendor payments platform. Raghav explained that while he does not handle tools directly, his colleague managing People Operations handles frontline locations and has been looking into a solution. Raghav provided the direct email (contact08@example.com) and gave permission to reference his name.",
    "whyItMatters": "Warm internal referral to the key operational decision-maker with endorsement.",
    "sourcePassage": 'Raghav: "The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution... If you send him a proposal and say you spoke with me, he can take a look... contact08@example.com."',
    "limitations": "The specific operational pain points of the people operations colleague are unknown until initial contact is made.",
    "nextStep": "Meera to send tailored proposal to contact08@example.com explicitly mentioning Raghav\'s referral, and request a 15-minute discovery call.",
    "routeRationale": "Active deal progression via warm internal stakeholder referral."
  },
  "C09": {
    "primaryRoute": "sales-coaching",
    "secondaryRoute": "deal-next-steps",
    "reviewState": "Action Required",
    "owner": "Meera",
    "whatHappened": "Meera cold-called Mr Vedant at an enterprise with 130 retail locations. Vedant noted they built custom internal software for expenses and approvals, but suggested contacting their Business Head, Mr Rishabh, on LinkedIn. Crucially, when Meera asked if she could mention Vedant\'s name, Vedant explicitly commanded: 'No, please don\'t use my name.'",
    "whyItMatters": "Critical boundary and compliance requirement: Meera has a verified target contact (Rishabh), but must strictly avoid name-dropping Vedant to preserve prospect trust and professional ethics.",
    "sourcePassage": 'Vedant: "If you want to speak to somebody about it, you can find our business head, Mr Rishabh, on a professional networking site... Would it be all right if I mentioned your name when contacting him? No, please don\'t use my name."',
    "limitations": "Whether Rishabh is open to external solutions when proprietary software already exists remains unverified.",
    "nextStep": "Meera to reach out to Mr Rishabh on LinkedIn with an independent cold introduction tailored to multi-store operations, adhering strictly to the restriction not to mention Vedant.",
    "routeRationale": "Coaching on honoring explicit prospect boundaries, combined with deal prospecting."
  },
  "C10": {
    "primaryRoute": "customer-follow-up",
    "secondaryRoute": "sales-coaching",
    "reviewState": "Action Required",
    "owner": "Meera",
    "whatHappened": "Meera called Mr Aniket inquiring about Meadowbrick. Aniket clarified he had left Meadowbrick and now works in manufacturing. He asked Meera to send a brief overview via messaging app, but when Meera proposed a follow-up call on Monday/Tuesday, Aniket firmly rejected proactive calling: 'No. I said I will contact you if there is anything to discuss.'",
    "whyItMatters": "Demonstrates the importance of respecting explicit boundary conditions. Pushing for a scheduled call after the prospect already set the communication channel resulted in immediate pushback.",
    "sourcePassage": 'Aniket: "why don\'t you just send me a brief on the messaging app? I\'ll look at it and come back to you... Would a follow-up call on Monday or Tuesday next week be okay...? No. I said I will contact you if there is anything to discuss."',
    "limitations": "Prospect\'s new company name and role within manufacturing were not disclosed.",
    "nextStep": "Send concise messaging app brief on SpendNest manufacturing payables/expenses. Mark lead status as 'Awaiting Inbound / Do Not Cold Call'.",
    "routeRationale": "Follow-up via requested channel with strict adherence to contact boundary; sales coaching on avoiding premature call-booking pressure."
  },
  "M01": {
    "primaryRoute": "partner-vendor",
    "secondaryRoute": "sales-coaching",
    "reviewState": "Action Required",
    "owner": "Team member A (team06@example.com)",
    "whatHappened": "Comprehensive partnership onboarding discussion between SpendNest (Team member A) and Harborpath Advisory (Partner A). Covered commission structures ($260 activation bonus, interchange share, spend tier bonuses of $195-$390), US business qualification requirements, customer fee waiver thresholds ($2,600 card spend/mo), and agreed on a unique scalable referral link and tracking sheet.",
    "whyItMatters": "High-value affiliate/referral channel. Partner A emphasized scalability: 'It cannot depend on me manually writing every email.' Potential marketing synergies include a co-hosted podcast and partner directory listing.",
    "sourcePassage": 'Team member A (Turn 9): "The activation payment is USD 260 when a referred company gets its account approved... The cards option also has an interchange revenue share and a bonus based on customer spend." Partner A (Turn 20): "It cannot depend on me manually writing every email. This needs to scale."',
    "limitations": "Agreement is contingent on Partner A signing the memorandum and verifying that referred clients have documented US business operations.",
    "nextStep": "Send partner memorandum for signature, generate unique affiliate link, share onboarding tracking sheet, and connect marketing regarding podcast recording.",
    "routeRationale": "High-priority partner onboarding and channel management."
  },
  "M02": {
    "primaryRoute": "partner-vendor",
    "secondaryRoute": "internal-operations",
    "reviewState": "Action Required",
    "owner": "Team member A & B (team07@example.com)",
    "whatHappened": "SpendNest strategy and product leads evaluated LedgerBridge (Supplier A) as a vendor for compliant electronic invoicing in Singapore, Australia, and India for SpendNest\'s upcoming Accounts Receivable product. Discussed API integration, PDF generation vs network e-invoicing, setup fees (EUR 2,600 to 6,500), and pricing models (country licenses vs per-customer licenses).",
    "whyItMatters": "Core technical build-vs-buy decision for SpendNest\'s product roadmap. LedgerBridge can provide regulatory compliance across multiple markets without building bespoke tax integrations per country.",
    "sourcePassage": 'Team member B (Turn 3): "Electronic invoicing is the bigger opportunity... The manual part is taking that information into separate portals." Supplier A (Turn 31): "The basic setup begins at EUR 2,600; a more supported implementation starts at EUR 6,500."',
    "limitations": "Receivables issued invoice volumes are rough estimates because the module is unreleased; Q4 launch timeline is flexible and may slip to early next year.",
    "nextStep": "Complete LedgerBridge volume projection template, test developer sandbox with test key, and brief executive management before commercial negotiation call.",
    "routeRationale": "Strategic vendor evaluation and product infrastructure planning."
  },
  "M03": {
    "primaryRoute": "deal-next-steps",
    "secondaryRoute": "sales-coaching",
    "reviewState": "Action Required",
    "owner": "Team member A (team08@example.com)",
    "whatHappened": "Sales demonstration to Asterloom Systems (Customer A & B, ~65 employees) evaluating SpendNest corporate cards to replace an INR 10-13 lakh/mo employee reimbursement process. Two major friction points arose: (1) Surprise that domestic cards are prepaid rather than credit; (2) Pricing pushback when quoted price increased from INR 26,000 to INR 39,000 (rep clarified INR 13,000 is one-time setup). Customer requires CFO approval before moving forward.",
    "whyItMatters": "Significant qualified deal. Highlights market friction where prospects expect corporate credit cards but SpendNest provides prepaid cards with shared wallet funding. Demonstrates the need for crystal-clear upfront fee breakdown.",
    "sourcePassage": 'Customer A (Turn 6): "Wait, these are prepaid? I had thought about a corporate credit card." Customer A (Turn 23): "But you previously told me INR 26,000. Why has that become INR 39,000?" Rep (Turn 24): "INR 26,000 plus tax is the recurring annual subscription, and INR 13,000 is the one-time accounting integration setup."',
    "limitations": "Customer B explicitly stated they will evaluate internally with their CFO and requested no calls be scheduled until they reach out.",
    "nextStep": "Send formalized written proposal clearly separating recurring subscription (INR 26k) from one-time setup (INR 13k), including prepaid workflow summary for the CFO review.",
    "routeRationale": "Critical sales opportunity requiring commercial clarity and coaching on quoting setup fees transparently."
  },
  "M04": {
    "primaryRoute": "customer-follow-up",
    "secondaryRoute": "product-support",
    "reviewState": "Action Required",
    "owner": "Team member A (team09@example.com)",
    "whatHappened": "Account review with existing customer Cedarwave Distribution regarding a forced card migration due to acceptance issues on the existing card network. Customer pushed back strongly because replacement cards remain prepaid, whereas Cedarwave already holds an INR 1.3 crore corporate bank credit line. Team explored a hybrid model to feed bank credit transactions into SpendNest. Customer also raised an unresolved UI bug where users cannot be moved between departments.",
    "whyItMatters": "Dual risk of churn and unresolved support tickets. Customer is frustrated by ongoing prepaid limitations when they have bank credit, and annoyed that basic admin controls (moving users between departments) require manual engineering intervention.",
    "sourcePassage": 'Customer A (Turn 11): "moving from prepaid to credit is the main issue for us." Customer B (Turn 22): "We already have a corporate credit line of about INR 1.3 crore." Customer A (Turn 30): "There is also the earlier issue with moving users between departments."',
    "limitations": "Technical feasibility of feeding third-party bank-issued credit transactions into SpendNest with accounting reconciliation is not yet confirmed by the product team.",
    "nextStep": "Confirm bank transaction feed feasibility with product team. Schedule a screenshare session to manually resolve the user department hierarchy issue.",
    "routeRationale": "Multi-destination record: Requires urgent Customer Success retention follow-up AND engineering/product support ticket resolution."
  },
  "M06": {
    "primaryRoute": "deal-next-steps",
    "secondaryRoute": "product-support",
    "reviewState": "Action Required",
    "owner": "Team member A (team10@example.com)",
    "whatHappened": "Discovery conversation with local finance lead at Mapletrail Services (branch of a 65-person finance org, managing 8 clients and 260-390 monthly invoices). Explored SpendNest\'s upcoming automated Receivables product (AI collection agent, contract matching, payment reconciliation). Prospect confirmed manual reconciliation is a major pain point, but noted central finance controls systems and stressed strict payment data security.",
    "whyItMatters": "Direct enterprise market validation for the unreleased Accounts Receivable module. Highlights that data security certifications and ERP integration are non-negotiable prerequisites for enterprise adoption.",
    "sourcePassage": 'Customer A (Turn 12): "Around 65–78 customers... Initially I would estimate 260–390 invoices a month." Customer A (Turn 31): "Confidentiality is important. Payment information is sensitive. How is that protected..."',
    "limitations": "Local branch finance manager cannot make enterprise-wide purchasing decisions without main office approval.",
    "nextStep": "Send security/compliance documentation and product overview of Receivables automation; explore introductory presentation to central finance leadership.",
    "routeRationale": "Strategic enterprise pipeline qualification and product discovery feedback."
  },
  "M07": {
    "primaryRoute": "product-support",
    "secondaryRoute": "customer-follow-up",
    "reviewState": "Action Required",
    "owner": "Team member A (team09@example.com)",
    "whatHappened": "Crucial screen-share support session with existing customer Willowfield Trust. Customer demonstrated four distinct platform bugs: (1) Event-payment description edit fails to persist on display; (2) Direct document upload fails on Recreate Payment screen (workaround: Invoice Inbox -> Review); (3) Reimbursement payments stuck in 'Processing' state and cannot be selected; (4) 'Mark as paid' modal retains and displays previous transaction amount on subsequent items.",
    "whyItMatters": "Severe customer experience and accounting integrity bugs on live accounts. Sticky modal amounts and stuck processing states risk duplicate payments and data corruption. This meeting arrived in the Update batch (Revision 2) with full evidence.",
    "sourcePassage": 'Customer A (Turn 2): "I am changing this event-payment description... The field still shows the earlier wording." Customer A (Turn 22): "The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again..."',
    "limitations": "Root cause in frontend/backend services was unknown during the call; Team member A promised engineering updates within 1-2 hours.",
    "nextStep": "Engineering team to triage and patch modal state caching bug in 'Mark as paid', fix description update API sync, and unstick pending reimbursement batch.",
    "routeRationale": "Top-priority Product & Engineering Support incident; Customer Success follow-up required post-fix."
  },
  "M09": {
    "primaryRoute": "product-support",
    "secondaryRoute": "customer-follow-up",
    "reviewState": "Action Required",
    "owner": "Team member A (team11@example.com)",
    "whatHappened": "Account setup session for two entities: Northkite Equipment (active) and Brookmint Holdings (new onboarding). Customer demonstrated that fresh password reset invitations for Brookmint generate an immediate 'token has expired' error. Customer also voiced security concerns regarding shared accounts mailboxes granting unintended administrator rights to the AP officer, and asked about attachment workflows before accounting sync.",
    "whyItMatters": "Blocks onboarding of Brookmint Holdings (the larger company with most employees). Exposes authentication token TTL/invalidation bug in invite emails and highlights permission governance gaps.",
    "sourcePassage": 'Customer A (Turn 21): "It says the token has expired. This is the fresh message we just received." Customer A (Turn 15): "The accounts-payable officer already has an individual login. My concern is that they also have access to the shared mailbox, so their individual role does not stop them using the other identity."',
    "limitations": "Token expiry issue could not be fixed during the call; rep promised to investigate with dev team by end-of-day or Monday.",
    "nextStep": "Engineering to resolve invitation token generation bug for Brookmint Holdings. Advise customer on configuring granular role-based access to replace shared mailbox logins.",
    "routeRationale": "Technical support escalation for broken onboarding token and access governance guidance."
  },
  "M10": {
    "primaryRoute": "internal-operations",
    "secondaryRoute": "sales-coaching",
    "reviewState": "Intake Verified",
    "owner": "Team member A (team12@example.com)",
    "whatHappened": "Internal SpendNest operational training session led by Team member A for onboarding colleagues (Team members B and C). Covered the billing engine, subscription plans, 7-day vs end-of-month due date policies, manual vs auto invoice clearing, wallet deduction failure retry schedules (days 1, 3, 7, and freeze on day 10), and the requirement to manually advance billing dates when unfreezing accounts.",
    "whyItMatters": "Internal training record detailing SpendNest\'s operational mechanics and dunning rules. Critical for ensuring billing accuracy and customer account restoration without billing cycle errors.",
    "sourcePassage": 'Team member A (Turn 7): "The nominal due period is seven days, but we sometimes give the customer until the end of the month." Turn 18: "The customer must tell us, then operations clears the outstanding invoice and unfreezes the account. Operations also needs to adjust the next billing date manually."',
    "limitations": "Internal staff training session; does not represent a customer sales interaction or external revenue opportunity.",
    "nextStep": "Grant back-office billing simulator access to Team member B and ensure operations runbook documents the manual billing date adjustment step.",
    "routeRationale": "Purely internal operational training and billing workflow governance."
  }
}

# Fill non-text records
non_text_refs = [
  'B01','B02','B03','B04','B05','B06','B07','B08','B09','B10',
  'B11','B12','B13','B14','B15','B16','B17','B18','B19','B20',
  'M05','M08','M11','M12','M13','M14'
]

for ref in non_text_refs:
  is_meeting = ref.startswith('M')
  primary = 'metadata-only'
  secondary = None
  state = 'Intake Verified'
  what = ''
  why = 'Record captured in upstream telemetry but no conversation transcript was supplied in this assessment extract.'
  limit = 'No usable conversation transcript is available in this extract. Missing text is not evidence that the interaction did not take place.'
  next_step = 'Retain metadata record for intake reconciliation; no substantive outreach required without source transcript.'
  
  if is_meeting:
    if ref in ['M08', 'M12', 'M14']:
      primary = 'human-review'
      secondary = 'metadata-only'
      state = 'Review Pending'
      what = f'Meeting record ({ref}) scheduled in calendar but transcript was uncaptured or withheld.'
      next_step = 'Investigate bot recording status with meeting organizer to verify if recording exists upstream.'
    elif ref == 'M11':
      primary = 'internal-operations'
      secondary = 'metadata-only'
      what = 'Internal design discussion scheduled on calendar; recording was marked not_scheduled.'
    else:
      what = f'Meeting record ({ref}) has cancelled recording bot status; no transcript available.'
  else:
    what = f'Outbound phone call attempt ({ref}) logged by telephony system. No connected conversation transcript supplied in extract.'
    
  analyses[ref] = {
    "primaryRoute": primary,
    "secondaryRoute": secondary,
    "reviewState": state,
    "owner": "Calendar Organizer" if is_meeting else "Call Rep",
    "whatHappened": what,
    "whyItMatters": why,
    "sourcePassage": "No transcript text supplied in assessment delivery envelope.",
    "limitations": limit,
    "nextStep": next_step,
    "routeRationale": f"Classified as {primary} due to lack of supplied conversation audio/text."
  }

os.makedirs('app', exist_ok=True)
with open('app/analyses_data.json', 'w', encoding='utf-8') as f:
  json.dump(analyses, f, indent=2)

print(f"Successfully generated app/analyses_data.json with {len(analyses)} records.")
