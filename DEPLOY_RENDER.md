# Deploying OpenFreeOCR on Render

OpenFreeOCR is a full Next.js app because `/api/ocr` relays OCR requests to NVIDIA. Deploy it as a Render Web Service, not a Static Site.

## Blueprint Deploy

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Render, choose **New** > **Blueprint**.
3. Select this repository and use the root `render.yaml`.
4. When Render prompts for secret values, set:

   ```text
   NVIDIA_API_KEY=<your NVIDIA API key>
   ```

5. Apply the Blueprint and wait for the first deploy.
6. In Render's custom domain setup for `openfreeocr.online`, copy the DNS records Render gives you into your domain registrar.

The Blueprint disables the public `*.onrender.com` service URL, so the app is intended to be reachable only from `openfreeocr.online`.

## Manual Web Service Settings

If you deploy manually instead of using the Blueprint:

```text
Language / Runtime: Node
Build Command: bun install --frozen-lockfile && bun run build
Start Command: bun run start -- -H 0.0.0.0 -p $PORT
Environment Variables:
  NODE_VERSION=22
  BUN_VERSION=1.3.10
  NEXT_TELEMETRY_DISABLED=1
  NVIDIA_API_KEY=<secret, set in Render only>
```

Do not commit real API keys to the repository. Use `.env.example` only as a template.
