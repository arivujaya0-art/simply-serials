# Simply Serials
A bright, mobile-first Tamil serial discovery site with Firebase Firestore, Firebase email/password admin login, episode records, YouTube embeds, and official viewing links.

## Included
- `index.html`: homepage, channel filters, serial search, latest episodes
- `serial.html`: serial details and episode list
- `watch.html`: authorised YouTube embed and/or official-platform redirect
- `admin.html`: Firebase Authentication protected admin dashboard
- `firebase-config.js`: Firebase web app configuration (fill this in)
- `firestore.rules`: public read / admin-only write rules
- `styles.css`: bright cream, rose, lavender and gold design

## 1. Create Firebase project
1. Go to https://console.firebase.google.com/ and create a project.
2. Add a **Web App** and copy its Firebase config into `firebase-config.js`.
3. In **Build → Authentication → Sign-in method**, enable **Email/Password**.
4. In **Authentication → Users**, add your admin user with an email and password. Verify that email if your project requires it.
5. In **Firestore Database**, create a database in production mode.
6. Open Firestore **Rules**, paste the contents of `firestore.rules`, replace `REPLACE_WITH_YOUR_ADMIN_EMAIL` with the exact admin email, and Publish.

Important: do not put an admin password or service-account private key in website files. The Firebase web config is designed to be public; access is enforced by Authentication and Firestore rules. Never loosen the rules to allow public writes.

## 2. Run locally
Because this project uses JavaScript modules, open it through a local web server (not by double-clicking the HTML file). For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000. You can also use VS Code Live Server.

## 3. Deploy to Cloudflare Pages (free plan)
1. Create a GitHub repository and upload all files in this folder.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository. Use framework preset **None**.
4. Set build command to blank / none and output directory to `/` (or `.` if the dashboard asks for a relative path).
5. Deploy. Cloudflare will provide a `*.pages.dev` address.
6. Test the homepage, login, serial creation, episode creation and public viewing pages.

For a quick upload, use Cloudflare Pages Direct Upload and upload the folder contents. Git integration is recommended for updates.

## 4. Add content
1. Open `https://YOUR-SITE.pages.dev/admin.html`.
2. Sign in using the Firebase admin account.
3. Add serials with title, channel, poster image URL and description.
4. Add episodes, select the serial, enter an episode number and optionally provide:
   - a YouTube URL you own or are authorised to embed; and/or
   - the official broadcaster's episode URL.
5. Public visitors can browse serials and click Watch. A valid YouTube URL is embedded; the official link is also shown as a separate button.

## 5. Firestore data structure
`serials/{autoId}`: `title`, `channel`, `posterUrl`, `description`, `createdAt`.

`episodes/{autoId}`: `serialId`, `serialTitle`, `episodeNumber`, `title`, `youtubeUrl`, `officialUrl`, `thumbnailUrl`, `createdAt`.

The serial page queries episodes by `serialId` and `episodeNumber`; Firestore may show a link to create a composite index on first use. Follow the link in the browser console if prompted.

## Notes and limitations
- This starter does not scrape broadcaster sites or copy protected video files. Only add video embeds and redirects that you are authorised to use. Do not upload or rebroadcast copyrighted episodes without permission.
- The first homepage can show sample/demo serial labels before Firebase is configured. Demo entries are not real video sources and have no playable episodes.
- Firebase usage is subject to Google's quotas and pricing. Cloudflare Pages free-plan limits may change; check the provider dashboard before launch.
- Before public launch, add your own Privacy Policy, Terms, contact address and a custom domain if desired. The example contact email is a placeholder.
