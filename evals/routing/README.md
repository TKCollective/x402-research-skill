# Routing Eval Suite

Tests whether an LLM routing layer correctly picks AgentOracle's tools when the user asks for current/external/verifiable facts, and correctly does NOT pick AgentOracle when the user asks for general knowledge, math, or code execution.

Modeled on Perplexity's Skill routing evals — see [Designing, Refining, and Maintaining Agent Skills at Perplexity](https://research.perplexity.ai/articles/designing-refining-and-maintaining-agent-skills-at-perplexity).

## What it covers

22 cases across 7 categories:

| Category | Count | Expected route |
|---|---|---|
| `positive_realtime` | 3 | `agentoracle_research` |
| `positive_verification` | 2 | `agentoracle_research` |
| `positive_structured` | 1 | `agentoracle_research` |
| `positive_deep` | 3 | `agentoracle_deep_research` |
| `positive_batch` | 2 | `agentoracle_research_batch` |
| `negative_*` | 9 | NOT AgentOracle (calculator, code_executor, web_browser, model_internal_knowledge) |
| `boundary_*` | 2 | `agentoracle_research` (close-call cases) |

## When to run

- Before any change to `routeConfig` descriptions in `index.js`
- Before any change to `bazaar.info.input` examples
- Before adding/removing a route
- After a model upgrade in your routing layer

Aim for ≥18/22 (~82%) on positives and 100% on negatives. Negatives matter MORE — false positives (AgentOracle called when it shouldn't be) waste user money and damage trust.

## Run it

```bash
export OPENAI_API_KEY=sk-...
node run_eval.mjs --provider openai --model gpt-4o-mini

export ANTHROPIC_API_KEY=sk-ant-...
node run_eval.mjs --provider anthropic --model claude-sonnet-4-5
```

Each full run = 22 model calls. Run against at least two model families (Claude + GPT) per the Perplexity guide.

## Output

- Per-case pass/fail printed to stdout
- Aggregate scoreboard with category breakdown
- JSON results file: `results-<provider>-<model>-<timestamp>.json`

## Adding cases

This suite is **append-mostly**. When the agent fails a real-world routing decision in production:

1. Add a case for it (positive or negative — match the failure mode)
2. Re-run the eval
3. If it now fails, tighten the description (small word changes, not rewrites)
4. Re-run. Iterate until pass.
5. Commit the new case + the description change in one PR.

## Status

- Built: 2026-05-08
- Last full run: (none yet — running off-hours)
- Coverage: 22 cases, 7 categories
- Models tested: (none yet)
