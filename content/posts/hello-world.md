---
title: Hello, world
description: A small first post introducing who I am, what I build, and a quick tour of writing here.
date: 2026-08-11
updated: 2026-08-28
taxonomies:
  tags: [meta, about]
---

I’m Pratik — a Senior Machine Learning Engineer passionate about teaching robots new tricks and pushing the boundaries of AI.

This is a deliberately simple, static space where I write about software engineering, machine learning systems, privacy, robotics, and the things I learn along the way while building.

## 🛠️ Top Skills & Focus Areas {#️-top-skills--focus-areas}

- **Python** — My primary language of choice for ML architectures and systems.
- **PyTorch & TensorFlow** — Deep learning, neural networks, and everything in between.
- **LLMs & Multimodal Models** — Building, fine-tuning, evaluating, and deploying large models.
- **Docker & Reproducibility** — Containerizing pipelines for deterministic, reproducible experiments and production environments.

## 🤖 What Drives Me {#-what-drives-me}

Making robots learn is my thing! Whether it’s reinforcement learning, computer vision, or generative models, I love exploring how machines perceive, act, and continually improve.

> *"The future is learned, not programmed."*

Let’s build smarter robots and intelligent systems together.

---

## ⚡ A Quick Tour of Writing Here {#-a-quick-tour-of-writing-here}

Posts are pure Markdown files. Zola compiles them into static HTML at build time with zero client-side JavaScript overhead.

### Code syntax highlighting

Fenced code blocks are styled dynamically using the built-in terminal theme engine:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

export function attempt<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}
```

There is no server, database, or analytics tracking involved. GitHub Actions builds the site and GitHub Pages serves it.
