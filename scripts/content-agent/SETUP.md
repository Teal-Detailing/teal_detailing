# Content agent — setup

Every Monday at 10am Eastern, the agent:

1. Reads recent completed jobs that have a **Drive folder link** in the sheet
2. Picks the newest job it hasn't written about whose folder has a photo named **before** and one named **after**
3. Drafts a case-study post from those two photos and sends it to Telegram: the photos, the full text, and buttons
4. **✅ Publish** → builds the site with the post, commits it, and Netlify deploys it (~3 min).
   The bot then sends a **Google Business Profile update** — the after photo plus a short text
   to paste into your profile's *Add update*, with a *Learn more* button linking to the post.
   (The draft preview shows this text too, so you approve both together.)
   **🔄 Different job** → skips this job and drafts from the next one
   **⏭ Skip job** → skips this job; nothing is posted this week

Send `/draft` to the bot at any time to run it without waiting for Monday.

## Choosing a job for a post

In the job's Drive folder, rename the best two photos so their names contain the word
**before** and **after** — `before.jpg`, `After.HEIC`, `IMG_4410 after.jpg` all work.
Only those two are used; the rest of the folder can hold any number of other shots.
Jobs without a named pair are simply passed over, so renaming is also how you choose
which jobs become posts.

Nothing reaches GitHub until you tap Publish — this repo is public, so rejected drafts and
their photos only ever exist in your Telegram chat.

---

Seven steps, about 30 minutes. Do them in order — later steps use values from earlier ones.

## 1. Apps Script (reads the sheet and Drive)

This is a **new, separate** script. It does not touch the `/job` bot's script.

1. Sign in to Google as the account that **owns the Completed Jobs spreadsheet**.
2. Go to <https://script.google.com> → **New project**. Name it `Teal content agent`.
3. Replace the contents of `Code.gs` with [`apps-script/Code.gs`](apps-script/Code.gs).
4. **Project Settings** (gear icon) → tick **Show "appsscript.json" manifest file** → go back to the
   editor and replace `appsscript.json` with [`apps-script/appsscript.json`](apps-script/appsscript.json).
5. **Project Settings → Script properties → Add**:
   - `SPREADSHEET_ID` — the long ID in the sheet's URL: `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`
   - `API_KEY` — a random string. Generate one in Terminal with `openssl rand -hex 32` and keep it for step 4.
   - `JOBS_SHEET_NAME` — *optional*, only if the jobs are not on the first tab that has folder links.
6. In the function menu at the top of the editor pick **authorize** → **Run** → **Review permissions** → choose the account.
   Google shows *"Google hasn't verified this app"* for any personal script: **Advanced → Go to Teal content agent → Allow**.
   The log at the bottom should list your spreadsheet and how many jobs have a photo folder.
   (Google requires full Sheets permission to open a sheet by ID; the script itself only reads.)
7. **Deploy → New deployment** → type **Web app** → Execute as **Me** → Who has access **Anyone** → **Deploy**.
8. Copy the **Web app URL** (ends in `/exec`).

**Changing the script later:** edits don't reach the live URL until you redeploy. Use
**Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy** - that keeps the same URL.
A *new* deployment gets a new URL, and the `CONTENT_SCRIPT_URL` secret would need updating.

The script only returns what a published post could safely use: vehicle type, package, add-ons,
notes, the city (only if it's a recognised South Florida city), and the two named photos.
Customer names, phone numbers, prices, and street addresses never leave the sheet.

## 2. Telegram bot

1. In Telegram, message **@BotFather** → `/newbot` → name it (e.g. *Teal Content*) → copy the **token**.
2. Open your new bot and send it `/start`.
3. Open this URL in a browser, with your token in place of `<TOKEN>`:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
   Find `"chat":{"id": 123456789` — that number is your **chat ID**.
   (To use a group instead: add the bot to the group, post a message there, and use the group's ID — it starts with `-`.)

## 3. GitHub token (lets the Telegram buttons start the agent)

1. GitHub → your avatar → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Resource owner:** `Teal-Detailing`. **Repository access:** only `teal_detailing`.
3. **Permissions → Repository → Contents: Read and write.** Nothing else.
4. Generate and copy it. If the organization requires approval for tokens, approve it under the org's settings.

## 4. GitHub secrets (for the agent itself)

Repo → **Settings → Secrets and variables → Actions → New repository secret**, five times:

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (the same one in `.env.local` works) |
| `CONTENT_BOT_TOKEN` | Bot token from step 2 |
| `CONTENT_BOT_CHAT_ID` | Chat ID from step 2 |
| `CONTENT_SCRIPT_URL` | Web app URL from step 1 |
| `CONTENT_SCRIPT_KEY` | The `API_KEY` from step 1 |

Also check **Settings → Actions → General → Workflow permissions**. If publishing later fails
with a 403 on `git push`, set this to **Read and write permissions**.

## 5. Netlify environment variables (for the webhook)

Netlify → the site → **Site configuration → Environment variables**:

| Name | Value |
|---|---|
| `CONTENT_BOT_TOKEN` | Bot token from step 2 |
| `CONTENT_BOT_CHAT_ID` | Chat ID from step 2 |
| `CONTENT_BOT_WEBHOOK_SECRET` | A new random string — `openssl rand -hex 32` |
| `GITHUB_DISPATCH_TOKEN` | GitHub token from step 3 |

Then **Deploys → Trigger deploy → Deploy site** so the function picks them up.

The webhook rejects every request until the secret and chat ID are set, so it is safe for
the code to be deployed before this step is done.

## 6. Connect Telegram to the webhook

Run this once in Terminal, with your bot token and the webhook secret from step 5:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook" -d "url=https://tealdetailing.com/api/content-bot-webhook" -d "secret_token=<WEBHOOK_SECRET>"
```

It should answer `"ok":true`.

## 7. Try it

1. In a recent job's folder, rename the best two photos to **before** and **after**.
   If the photos are on a **Shared Drive**, the account that owns the sheet must be a member of it.
2. Send `/draft` to the bot. A draft arrives in a few minutes.
3. Read it, then tap a button.

---

## When something goes wrong

The agent reports failures in the Telegram chat, with a **🔄 Try again** button. The full log is under
the repo's **Actions** tab → *Content agent*. The log is public, so it only shows stage names and
hashed job IDs, never job details.

| Message | Fix |
|---|---|
| `didn't return JSON` | The Apps Script deployment isn't set to access **Anyone** — redeploy (step 1.7) |
| `unauthorized` | `CONTENT_SCRIPT_KEY` doesn't match the script's `API_KEY` property |
| `Specified permissions are not sufficient` | Update `appsscript.json`, run **authorize** (step 1.6), then redeploy as a new version |
| `No item with the given ID could be found` | The script's Google account isn't a member of the Shared Drive holding the photos - add it under the Shared Drive's **Manage members** |
| `Sheets API returned 403` / `has not been used in project` | In the script editor, **Services (+)** → add **Google Sheets API** and **Drive API**, save, redeploy as a new version |
| `No post this week — no recent job has a photo named "before"…` | Rename two photos in a job's folder (see *Choosing a job for a post*), then tap Try again |
| `No tab contains a Drive folder link yet` | Run **findPhotoLinks** in the editor: it lists which columns hold Drive links and whether they point at folders. Check `SPREADSHEET_ID` is the sheet you add links to |
| `Folder is not linked from any job` | The link was removed from the sheet after the draft was made |
| `Could not render photo` | Drive has no preview for that file yet — wait a few minutes and try again |
| Buttons do nothing | Re-run step 6, and check the Netlify variables in step 5 |

## Changing things

- **Day or time:** the `cron` line in `.github/workflows/content-agent.yml` (it's in UTC).
- **How it writes:** the prompt in `writer.ts`.
- **A job you never want written about:** tap **⏭ Skip job** when it comes up; the choice is saved in `state.json`.
