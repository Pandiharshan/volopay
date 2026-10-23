# Deployment & Hosting Guide: Signal Desk

This guide provides exact, step-by-step instructions to deploy or serve **Signal Desk — Revenue Intelligence Inbox** for direct reviewer access.

---

## Privacy & Compliance Notice
> **IMPORTANT PRIVACY REQUIREMENT**: As specified in `START_HERE.md` and `DATA_CONTRACT.md`, the dataset is de-identified and adapted for assessment evaluation. Do not publish the source dataset or application to a public, unauthenticated GitHub repository or search-indexed web page. Use private repositories, password-protected previews, or direct local evaluation.

---

## Option 1: Instant Local Evaluation (Zero Setup / Zero Build)

Because Signal Desk was engineered with Vanilla HTML5, Vanilla CSS3, and standard ES6 JavaScript with zero external CDN runtime dependencies, it requires **no build step, no npm install, and no compilation**.

### Step 1: Open Directly in Any Web Browser
Simply double-click `index.html` at the project root or open `app/index.html` directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari:
```text
file:///c:/Users/shyam/Downloads/candidate-v1.0 (3)_layout_fixed (1)(2) (3)/01_Revenue_Intelligence_Inbox/index.html
```

### Step 2: Serve via Built-in Static Server (Recommended)
If you prefer running through an HTTP web server:
```bash
# Using Python (Windows, Mac, Linux):
python -m http.server 8080

# Or using Node.js:
npx serve .

# Then navigate to:
http://localhost:8080/app/index.html
```

---

## Option 2: Private Netlify Drop (One-Click Drag & Drop)

Netlify provides private, direct static hosting without publishing code to a public repository:

1. Log into your [Netlify Console](https://app.netlify.com/).
2. Navigate to the **Sites** tab and locate the **"Drag and drop your site folder here"** section.
3. Drag the entire `01_Revenue_Intelligence_Inbox` folder (or the `app/` folder) and drop it into Netlify.
4. Netlify will instantly deploy the static site in ~5 seconds and provide a private preview URL (e.g., `https://signal-desk-inbox.netlify.app`).
5. (Optional) In Netlify site settings, enable **Site Protection / Password** if required by the recruiter.

---

## Option 3: Private GitHub Pages Deployment

If sharing via GitHub with the reviewer:

1. Create a **Private** GitHub repository: `signal-desk-inbox`.
2. Add the recruiter's GitHub username as an invited collaborator (Settings -> Collaborators).
3. Push the workspace to the repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Signal Desk Revenue Intelligence Inbox submission"
   git branch -M main
   git remote add origin https://github.com/<your-username>/signal-desk-inbox.git
   git push -u origin main
   ```
4. Under **Settings -> Pages**:
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
5. GitHub will build the site and provide a private preview URL accessible to authorized collaborators.

---

## Deployment File Checklist

Ensure the following core files are included when deploying:

- `index.html` (root launcher)
- `app/index.html` (main application page)
- `app/style.css` (custom design system)
- `app/app.js` (controller logic)
- `app/data_store.js` (contract replay engine)
- `app/analyses_data.js` (pre-generated evidence analyses)
- `app/source_data.js` (embedded initial and update deliveries)
- `app/vendor/jszip.min.js` (offline export archiver)
- `data/01_initial.json` (source delivery 1)
- `data/02_update.json` (source delivery 2)
- `exports/manifest.json` (delivery manifest)
- `exports/manager-brief-2026-08-21.md` (manager brief)
- `exports/routes/` (all 66 generated markdown conversation files)
- `slides/Signal_Desk_Revenue_Intelligence.pptx` (five-slide presentation)
- `scripts/narration_script_3min.md` (spoken narration script)

The application will initialize in the complete, post-update state (Revision 2 with 18 usable transcripts) automatically upon launch.
