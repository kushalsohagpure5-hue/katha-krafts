import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your API key in Settings > Secrets.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory cache keyed by storyId + language + bedtimeMode + text hash
const ttsCache = new Map<string, { audioBase64: string; mimeType: string }>();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/tts', async (req, res) => {
    try {
      const {
        storyId = 'story',
        title = '',
        paragraphs = [],
        moral = '',
        language = 'en-IN',
        bedtimeMode = false,
      } = req.body as {
        storyId?: string;
        title?: string;
        paragraphs?: string[];
        moral?: string;
        language?: string;
        bedtimeMode?: boolean;
      };

      const cleanParagraphs = Array.isArray(paragraphs)
        ? paragraphs.map((p) => String(p).trim()).filter(Boolean)
        : [];

      if (!title && cleanParagraphs.length === 0) {
        res.status(400).json({ error: 'Story text is required for narration.' });
        return;
      }

      const fullScript = [
        title ? `${title}.` : '',
        ...cleanParagraphs,
        moral ? moral : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const cacheKey = `${storyId}::${language}::${bedtimeMode ? 'bed' : 'day'}::${fullScript.length}`;
      const cached = ttsCache.get(cacheKey);
      if (cached) {
        res.json({
          audioBase64: cached.audioBase64,
          mimeType: cached.mimeType,
          voiceName: 'Kore',
          cached: true,
        });
        return;
      }

      const ai = getGeminiClient();

      const stylePrompt = bedtimeMode
        ? 'Warm, soothing, gentle Indian woman storyteller softly reading a peaceful bedtime story to a child aged 3 to 6, unhurried calm pacing, loving lullaby cadence'
        : 'Warm, affectionate, expressive Indian woman storyteller narrating a charming cultural fable to a young child aged 3 to 6, clear articulation, gentle wonder, sole narrator voice';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: fullScript,
                speechMetadata: {
                  style: stylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Kore',
              },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || 'audio/wav';

      if (!base64Audio) {
        res.status(502).json({
          error: 'Storyteller voice audio was not returned by Gemini TTS.',
        });
        return;
      }

      // Limit in-memory cache size cleanly
      if (ttsCache.size >= 40) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, { audioBase64: base64Audio, mimeType });

      res.json({
        audioBase64: base64Audio,
        mimeType,
        voiceName: 'Kore',
        cached: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to generate lady storyteller voice.';
      const status =
        message.includes('GEMINI_API_KEY') || message.includes('API_KEY_INVALID')
          ? 400
          : message.includes('PERMISSION_DENIED')
            ? 403
            : 500;
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      plugins: [
        {
          name: 'disable-vite-client-ws',
          enforce: 'post',
          transform(code, id) {
            if (id.includes('/vite/dist/client/client.mjs')) {
              return code.replace(
                /const transport = normalizeModuleRunnerTransport\(\(\(\) => \{[\s\S]*?\}\)\(\)\);/,
                `const transport = normalizeModuleRunnerTransport({
  async connect() {},
  async disconnect() {},
  async send() {}
});`
              );
            }
          },
        },
      ],
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: process.env.DISABLE_HMR === 'true' ? null : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Katha Kraft's server running on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
