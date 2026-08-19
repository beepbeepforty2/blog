---
title: "Your LLM Assistant Is Great at Everything Except Research"
description: A map of where language models genuinely help in the research pipeline, where they only work inside verification machinery, and where no prompt can fix the problem.
published: 2026-08-19
tags: [llms, research, workflow]
draft: false
---

*Or: a map of where language models actually help in the research pipeline, where they quietly sabotage you, and why the difference is structural — not a prompt-engineering problem.*

---

If you've tried using an LLM as a research assistant, you've probably lived this cycle: it declares a eureka with total confidence, you ask it to check, it searches, finds the 2023 paper that already did the thing, and concedes gracefully. Then it does it again. And again. Eventually you stop trusting anything it says, which is a strange relationship to have with a tool you're paying for.

The instinct is to fix this with better prompts, a "constitution," a carefully worded system message about epistemic humility. This mostly doesn't work, and the reason it doesn't work is more interesting than the failure itself: **the reliability of an LLM on a task is not a function of the prompt. It's a function of where the task sits on two axes.**

## The two axes

**Axis 1: Specification tightness.** How small is the set of acceptable outputs? "Write me a landing page" — millions of outputs are acceptable. "Find the actual gap in this specific literature" — the acceptable set might be a single sentence, and you don't know it in advance.

**Axis 2: Verification strength.** Can acceptability be checked mechanically? A compiler checks syntax perfectly. A test suite checks behavior partially. "Is this hypothesis actually novel?" — nothing checks that. You find out from Reviewer 2.

LLMs succeed at two corners of this space. **Loose spec** (anything competent lands inside the huge acceptable region — this is why one-prompt websites feel miraculous) and **strong verification** (generate freely, filter mechanically — this is why theorem provers and well-tested code work).

The dead zone is **tight spec + weak verification**: a small target the machine cannot see. And here's the uncomfortable observation — *almost everything that makes research actually research lives in the dead zone.*

With that frame, the entire research pipeline sorts itself.

## Where LLMs are genuinely excellent

**Literature retrieval and mapping.** The best fit in the whole pipeline. "Find papers on X since 2024, one line each, with the dataset used." The output is links and quotes — verifiable by you in minutes, nearly impossible to fake at the link level. Loose spec, strong verification. Use it hard, at volume, without guilt.

**Hypothesis generation — as enumeration, never assessment.** Ask for twenty candidate hypotheses, explicitly unranked, explicitly unassessed. Hallucinated confidence is harmless when the output contract is "a list of candidates," because nothing is being asserted. You are harvesting the model's one true superpower: it has read everything and recombines cheaply. The failure only enters when you ask the same context which candidate is *good* — that's a judgment, and it will happily manufacture one.

**Paper comprehension at the retrieval level.** "What does this paper assume about X? Quote the passage and give me the section." Anchored to a text you can check. Superb for triaging what deserves your actual attention.

**Experiment implementation.** The training loop, the eval harness, the plotting code, the data loader. This is scoped coding with a runnable verifier. Solved-enough territory.

**Building the instruments you judge with.** Dashboards, worst-k sample viewers, disagreement reports between two models. The LLM constructs the apparatus; *you* look through it. This is quietly the highest-leverage use per hour of human attention, because it makes your judgment cheaper without pretending to replace it.

**Mechanical prose.** Related-work skeletons, method boilerplate, LaTeX suffering. You'll rewrite it anyway. Loose spec. Free lunch.

## Where LLMs are usable — but only inside machinery

**Experiment design.** Models propose protocols surprisingly well; they know the *shape* of a good ablation. But design encodes a judgment about what would be *convincing to a skeptical expert*, which is tight-spec, weak-verify. The working pattern: model drafts the protocol, protocol gets written to a file *before* the experiment runs (pre-registration — yes, steal it from psychology's replication crisis), human approves. Proposer yes, designer no. Pre-registration also kills the model's favorite trick: the post-hoc eureka, where whatever the numbers turned out to be becomes "the key insight."

**Experiment running.** Fine when failures are loud — crashes, NaNs, metrics that visibly regress. Dangerous when wrongness is silent: data leakage, an off-by-one in the eval split, the wrong normalization. Exit code 0 is not correctness. A pipeline that can be wrong quietly should not be run unsupervised by a system whose only sensor is the return channel.

**Gap finding.** The trap category. It *feels* like retrieval, but "nobody has done X" is a universally quantified claim — retrieval can support it and can never verify it. The only safe pattern is adversarial: one session generates candidate gaps; a *fresh* session is given each gap with a single mandate — kill it, find the prior work, destroy the novelty claim. Whatever survives is not a verdict. It's a signal about where to spend your own reading time. (Bonus: this inverts the model's agreeableness and points it at the attack, which is the one direction where sycophancy is useful.)

## Where LLMs are structurally unsuitable — no prompt fixes this

**Deciding your research direction.** Tightest possible spec (it's yours alone), zero external verification, and it's precisely where the model's agreeableness costs the most: it will co-sign whichever direction your phrasing already leans. An advisor that always agrees is not a cheap advisor. It's an anti-advisor — it subsidizes your existing biases at scale. If you're the kind of person who keeps too many doors open, an always-agreeing oracle is the most expensive free thing you will ever use.

**Judging novelty or significance.** "Is this publishable? Does this matter?" requires taste plus field-state that lives partly outside any corpus — what reviewers currently reward, what's quietly saturated, what the community is bored of. There is no anchor. Every answer is tone.

**Interpreting ambiguous results.** When the numbers are murky, the model will produce a fluent, confident narrative for whatever the numbers *seem* to say. That's not analysis; it's a story generator pointed at your CSV. Take the pre-registered criteria, compute them mechanically, and do the reading yourself.

**Being the memory of the project.** What was tried, why it was abandoned, what you currently believe — this must live in files you author. Models forget agreements within a session; expecting one to hold the arc of a multi-month project is the same failure at project scale.

## The pattern, compressed

LLMs are strong at the **divergent, anchored ends** of research — expanding candidate sets, retrieving and checking against external text — and structurally weak at the **convergent, unanchored middle**: choosing, judging, interpreting, directing.

The middle is not incidental. The convergent middle *is* the research. It's the part that distinguishes a researcher from a pipeline, and it's the part being examined when anyone evaluates your work.

Which yields an allocation rule blunt enough to actually follow:

> **Delegate everything divergent and anchored, aggressively, to buy back hours. Delegate nothing from the convergent middle — that's the part with your name on it.**

## The bitter little corollary

Notice what this means about the hype. "AI does research now" and "AI research assistants are useless" are both true, about different quadrants. The demos live in the loose-spec corner (look, it wrote a survey!) and the strong-verify corner (look, it proved a theorem!). Your frustration lives in the dead zone, where your target is a point and the machine is a sampler from a prior that cannot see it.

The models will keep getting better at the corners. The dead zone shrinks only when someone builds a verifier for taste — and if you know how to do that, stop reading blog posts and go collect your Turing Award.

Until then: the assistant is real, the colleague is not, and the difference between people who get value from these tools and people who get burned is exactly the people who know which one they're talking to.

---

*If this maps to your experience, the actionable version is boring: split roles across sessions, force citations before claims, pre-register experiments in files, and never — never — ask the thing that generated an idea whether the idea is good.*
