---
title: Muse Spark 1.3 is the asking model
description: Meta's Sept 2 Muse Spark 1.3 launch sharpens long-horizon coding and agentic work while asking more and wasting less.
date: 2026-09-03
taxonomies:
  tags: [ai, meta, coding, agents]
draft: false
---

Meta shipped [Muse Spark 1.3](https://research.meta.ai/blog/introducing-muse-spark-1-3) on September 2, rolling out in [Muse Code](https://developer.meta.com/ai/products/muse-code) and the Meta Model API. Meta calls it the largest single jump yet for coding and agentic work. The part I care about is smaller: it asks before it acts.

If you've run an agent on a long task, you've lived this failure: it charges ahead on an ambiguous prompt, burns twenty tool calls, and returns something confident, wrong, and hard to reverse. 1.3 is trained to do the unfashionable thing — ask a clarifying question, confirm before a consequential action, and keep track of what it learned across a messy single thread.

## What actually changed

**Longer horizon, less waste.** Trained on more long-horizon coding tasks across diverse harnesses. Meta reports ~20% fewer tool calls and ~25% fewer tokens than 1.2 in engineering comparisons, with cleaner, less verbose coding style.

**Multitasking in one thread.** Better at mapping an interruption or steering nudge to the right task instead of smearing context across workflows.

**Knows what it doesn't know.** Better calibration on capability limits and irreversible actions, plus stronger resistance to prompt injection. Max reasoning mode is held back until safety testing finishes — reasonable for an agent that can act.

## The scorecard

Benchmark chart from Meta's official [1.3 announcement](https://research.meta.ai/blog/introducing-muse-spark-1-3) (see [evaluation methodology](https://research.meta.ai/blog/introducing-muse-spark-1-3) for details):

![Benchmark scorecard comparing Muse Spark 1.3 (max), Muse Spark 1.2 (xhigh), GPT 5.6 Sol (max), and Opus 5 (max) across agent, coding, instruction-following, and long-context evaluations. Source: Meta.](/images/muse-spark-1-3-benchmarks.webp)

Three numbers that matter for everyday work: DeepSWE v1.1 at 75.4 (long-horizon agentic coding), Terminal-Bench 2.1 at 88.8 (tied top), and MRCR 512K–1M at 98.1 (1M-token retrieval where others degrade). It still trails Opus 5 on OSWorld-style desktop use — the convergent, unanchored middle is still human territory.

Try it where failures are loud and reversible: scoped coding with tests, terminal work you can diff, long-context retrieval you can verify. Keep pre-registered criteria for everything else.
