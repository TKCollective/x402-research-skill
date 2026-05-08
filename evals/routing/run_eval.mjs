// run_eval.mjs — AgentOracle routing eval
//
// Runs `prompts.json` against one or more LLMs as a tool-routing test.
// Pattern follows Perplexity Skills routing eval: each case provides a user
// prompt + a tool list. The model picks one tool. We compare to `expected`.
//
// Usage:
//   node run_eval.mjs --provider openai --model gpt-5.4
//   node run_eval.mjs --provider anthropic --model claude-sonnet-4-6
//   node run_eval.mjs --provider perplexity --model sonar-large
//
// Auth (env): OPENAI_API_KEY, ANTHROPIC_API_KEY, PPLX_API_KEY
//
// Output: prints a per-case result + final scoreboard. Writes ./results-<provider>-<model>-<timestamp>.json.
//
// Defer model runs until off-hours — each full run is ~22 model calls.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsPath = path.join(__dirname, "prompts.json");
const fixture = JSON.parse(fs.readFileSync(promptsPath, "utf8"));

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, _, i, a) => {
  if (a[i].startsWith("--")) acc.push([a[i].slice(2), a[i + 1]]);
  return acc;
}, []));
const provider = args.provider || "openai";
const model = args.model || "gpt-4o-mini";

// Build the tool catalog the model will see at routing time. Each tool's
// description IS its routing trigger. This is the surface we're evaluating.
const tools = Object.entries(fixture._meta.tools).map(([name, description]) => ({
  type: "function",
  function: {
    name,
    description,
    parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  },
}));

async function callOpenAI(prompt) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a routing layer. Given a user prompt and a set of tools, you MUST call exactly one tool. Pick the single tool whose description best matches the user's intent. If none match, call model_internal_knowledge." },
        { role: "user", content: prompt },
      ],
      tools,
      tool_choice: "required",
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${JSON.stringify(j)}`);
  return j.choices?.[0]?.message?.tool_calls?.[0]?.function?.name ?? "(no_tool_call)";
}

async function callAnthropic(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model,
      max_tokens: 256,
      system: "You are a routing layer. Given a user prompt and a set of tools, you MUST call exactly one tool. Pick the single tool whose description best matches the user's intent. If none match, call model_internal_knowledge.",
      messages: [{ role: "user", content: prompt }],
      tools: tools.map((t) => ({ name: t.function.name, description: t.function.description, input_schema: t.function.parameters })),
      tool_choice: { type: "any" },
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${JSON.stringify(j)}`);
  const block = (j.content || []).find((c) => c.type === "tool_use");
  return block?.name ?? "(no_tool_call)";
}

const dispatcher = { openai: callOpenAI, anthropic: callAnthropic };
const callModel = dispatcher[provider];
if (!callModel) { console.error(`Unknown provider: ${provider}`); process.exit(1); }

const results = [];
let pass = 0;
for (const c of fixture.cases) {
  let chosen = null, error = null;
  try { chosen = await callModel(c.prompt); }
  catch (e) { error = e.message; }
  const ok = chosen === c.expected;
  if (ok) pass++;
  results.push({ id: c.id, category: c.category, prompt: c.prompt, expected: c.expected, chosen, ok, error });
  console.log(`${ok ? "✓" : "✗"} ${c.id} [${c.category}] expected=${c.expected} got=${chosen}${error ? ` (ERR: ${error})` : ""}`);
}

const total = fixture.cases.length;
const byCat = {};
for (const r of results) {
  byCat[r.category] = byCat[r.category] || { total: 0, pass: 0 };
  byCat[r.category].total++;
  if (r.ok) byCat[r.category].pass++;
}

console.log(`\n=== Routing Eval Result ===`);
console.log(`Provider: ${provider} / Model: ${model}`);
console.log(`Pass: ${pass}/${total} (${(pass / total * 100).toFixed(1)}%)`);
console.log(`By category:`);
for (const [cat, s] of Object.entries(byCat)) console.log(`  ${cat}: ${s.pass}/${s.total}`);

const ts = new Date().toISOString().replace(/[:.]/g, "-");
const outFile = path.join(__dirname, `results-${provider}-${model.replace(/[\\/]/g, "_")}-${ts}.json`);
fs.writeFileSync(outFile, JSON.stringify({ provider, model, total, pass, byCategory: byCat, results }, null, 2));
console.log(`\nWritten: ${outFile}`);
