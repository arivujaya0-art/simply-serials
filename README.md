# Simply Serials — Google Sheets edition

Bright, mobile-friendly Tamil serial discovery website. There is **no public admin page**. Manage all content in a private Google Sheet; the public Cloudflare Pages website reads only rows marked `Published`.

## Package contents
- `index.html`, `serial.html`, `watch.html`, `privacy.html`: public pages
- `styles.css`: existing bright rose/cream design
- `app.js`, `serial.js`, `watch.js`: public site logic; no Firebase SDK
- `data-config.js`: paste the deployed Apps Script Web App URL here
- `apps-script/Code.gs`: read-only JSON/JSONP feed
- `_headers`: security headers

## A. Create the Google Sheet
Create a Google Spreadsheet named **Simply Serials Manager**. Create two tabs with these exact names and exact first-row headers.

### Tab 1: `Serials`
`SerialID | SerialName | Channel | PosterURL | Description | Status`

Example row:
`S001 | சிங்கப்பெண்ணே | Sun TV | https://...jpg | Tamil family drama | Published`

### Tab 2: `Episodes`
`EpisodeID | SerialID | EpisodeNumber | EpisodeTitle | ReleaseDate | VideoType | EmbedCode | VideoURL | OfficialURL | ThumbnailURL | Status`

Example row:
`E001 | S001 | 1463 | இன்றைய எபிசோடு | 08-Nov-2026 | Embed | <iframe src="https://authorised-host.example/embed/123"></iframe> | | https://official-site.example/episode | https://...jpg | Published`

Use unique IDs. `SerialID` in Episodes must exactly match a `SerialID` in Serials. `Status` must be exactly `Published` or `Draft` (case-insensitive). Draft rows are never sent to the public website. For redirect-only episodes, set `VideoType` to `Redirect`, leave EmbedCode blank, and provide OfficialURL (or VideoURL if it is an authorised destination).

For embed codes, paste the iframe code supplied by a video provider that permits embedding. The public player extracts only its `src` URL and creates its own iframe; it does not inject arbitrary HTML. Do not use scraped, pirated, or unauthorised streams.

## B. Deploy the Apps Script feed
1. In the Google Sheet, choose **Extensions → Apps Script**.
2. Replace the editor contents with `apps-script/Code.gs` from this package.
3. In `SHEET_ID`, paste the ID from the spreadsheet URL (the text between `/d/` and `/edit`).
4. Save the project.
5. Choose **Deploy → New deployment → Select type → Web app**.
6. Set **Execute as: Me** and **Who has access: Anyone**. This endpoint exposes only rows marked Published; keep the spreadsheet itself private and do not share editor access.
7. Click Deploy, authorize the script, and copy the Web App URL ending in `/exec`.
8. Test the URL in a browser. It should return JSON containing `ok: true`, `serials`, and `episodes`.

Security note: the public feed is intentionally read-only and exposes only published content. Anyone can read that published content by design. Never put credentials, tokens, or private data in the sheet. Restrict spreadsheet access to yourself and trusted editors.

## C. Connect Cloudflare Pages
1. Open `data-config.js`.
2. Replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with the `/exec` URL copied above, keeping the quotes.
3. Save and commit the file to GitHub. Cloudflare Pages should deploy automatically.
4. Open the site and hard-refresh (`Ctrl+Shift+R`).

The website refreshes its feed on page load and every **5 minutes**. A visitor who leaves a page open may see updated content on the next refresh cycle; reloading always fetches the latest feed.

## D. Publish an episode
1. Add a row to `Episodes`.
2. Fill all required fields, especially EpisodeID, SerialID, EpisodeNumber, VideoType and Status.
3. Set Status to `Draft` while preparing it.
4. Change Status to `Published` when ready. It will appear on the website within five minutes for visitors with the page open, or immediately after they reload.

## E. Video behaviour
- `Embed`: provide a permitted iframe embed code in `EmbedCode` (or an HTTPS embed URL in `VideoURL`). The site uses only the iframe `src`.
- `Redirect`: provide `OfficialURL`; the watch page displays an external link.
- A provider may block embedding even when it supplies a URL. In that case use its official redirect option.

## F. Cloudflare settings
Use the existing Cloudflare Pages Git integration. Framework preset: None; build command: blank; output directory: `/` or `.` as the dashboard requests. The website is static and does not need Firebase configuration, Firebase Authentication, or a public admin page.

## G. Troubleshooting
- `Website feed is not connected`: `data-config.js` still contains the placeholder.
- `Could not load episode feed`: verify the Apps Script URL ends in `/exec`, deployment access is Anyone, and the script is deployed as a Web App.
- Serial absent: check `Status=Published` and required SerialID/SerialName.
- Episode absent: check `Status=Published`, and that its SerialID exactly matches a published serial.
- Embed blank: provider may prohibit framing; use the official redirect instead.
