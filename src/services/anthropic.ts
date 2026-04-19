import Anthropic from '@anthropic-ai/sdk';
import { StructuredSummary } from '../types';

const SYSTEM_PROMPT = `You are a voice memo summarizer. The user has dictated notes using voice recognition, so the text may have minor transcription errors, missing punctuation, or run-on sentences. Extract meaning intelligently — do not flag transcription artifacts as errors.

Return ONLY valid JSON with this exact shape, no preamble, no markdown fences:
{
  "title": "brief 5-8 word title",
  "keyPoints": ["concise point 1", "concise point 2"],
  "actionItems": ["verb-first action 1"],
  "entities": {
    "names": ["person name 1"],
    "places": ["place name 1"],
    "dates": ["date or time 1"]
  }
}

Rules:
- keyPoints: 2–5 bullets distilling main ideas
- actionItems: 0–4 items, only if text implies tasks; omit field or use [] if none
- entities: extract named people, places, dates/times if present; omit sub-arrays if empty
- Output ONLY valid JSON. Nothing else.`;

function buildUserPrompt(transcript: string): string {
  return `Summarize the following voice transcript:\n\n<transcript>\n${transcript}\n</transcript>`;
}

function parseJsonResponse(raw: string): StructuredSummary {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned) as StructuredSummary;
}

export async function summarizeTranscript(
  transcript: string,
  apiKey: string,
  onStream?: (text: string) => void
): Promise<StructuredSummary> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  let accumulated = '';

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(transcript) }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      accumulated += chunk.delta.text;
      onStream?.(accumulated);
    }
  }

  return parseJsonResponse(accumulated);
}
