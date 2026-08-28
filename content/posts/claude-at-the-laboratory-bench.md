---
title: "Claude Has Reached the Laboratory Bench"
description: Why a common hardware interface for Claude could change the pace and practice of experimental science.
date: 2026-08-28
taxonomies:
  tags: [ai, science, claude, hardware, laboratory-automation]
draft: false
---

I have mostly thought about AI for science as a software problem. Give a model access to papers, datasets, code, and enough compute, and it can help somewhere between literature review and analysis. That is already useful, but it leaves out the part of science where ideas collide with reality: the experiment itself.

A model can propose a protocol in seconds. The scientist may then spend weeks configuring a microscope, aligning a laser, programming a liquid handler, or persuading several instruments from different manufacturers to exchange data. Every machine has its own software and its own peculiar assumptions. Much of the knowledge required to operate it lives in old manuals, fragile scripts, and the memory of the person who built the setup.

The Model Hardware Standard, or MHS, gives Claude a common way to understand and operate this equipment. I think this interface could become one of the more consequential developments in AI-assisted science because it connects reasoning to measurement. It gives an agent a path from an idea to a physical action, then returns the result of that action to the same reasoning loop.

<iframe
  style="width: 100%; aspect-ratio: 16 / 9; border: 0;"
  src="https://www.youtube-nocookie.com/embed/P1zBiAQU1IA"
  title="AI models can now help run physical science experiments"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen>
</iframe>

## Science is constrained by its instruments

Scientific progress is often described through theories and discoveries. The physical machinery behind those discoveries receives less attention. A modern laboratory is full of highly capable equipment that was never designed to work as one system.

Consider a custom microscope. The laser, camera, detector, mirrors, and motorized stage may each come with a separate control program. One component speaks Python, another depends on an old Windows interface, and another only exposes buttons in a graphical application. Before the first useful measurement, somebody has to build the connections between them.

Large industrial laboratories can employ automation engineers to do this. Smaller research groups often rely on a graduate student or postdoc who learns enough about every component to keep the experiment alive. When that person leaves, part of the laboratory's operating knowledge leaves with them.

This is a serious bottleneck because experimental science depends on iteration. A researcher rarely chooses the correct settings on the first attempt. Samples behave differently. Sensors drift. A result suggests a better parameter range. The apparatus needs to support these changes without demanding a new software project each time.

## The missing abstraction layer

MHS is valuable because it treats laboratory equipment as an interface problem.

A device connected through MHS describes what it can do, what state it is in, which values can be changed, and which limits must never be crossed. Claude does not need to understand every vendor-specific command before it can begin working with the machine. It receives a consistent description of the device and uses a small set of common operations to read from it or act on it.

The same description can include physical knowledge that usually sits outside an API: the safe reach of a robotic arm, the usable power range of a laser, or the risk of a microscope objective colliding with a sample. This context is essential. Software documentation tells a model how to call a function. It rarely explains what breaking the specimen looks like.

Once a device has this interface, it can become part of a larger system without another custom translation layer. Claude can observe one instrument, use the result to change another, and coordinate several machines around a shared goal. A scientist can describe the experiment at a higher level while the agent handles more of the mechanical translation.

This is the part that feels revolutionary to me. The reusable hardware abstraction is the consequential part. It reduces the cost of connecting each new instrument and makes the connection useful beyond one experiment or one laboratory.

## From instructions to a closed experimental loop

Most AI assistants stop after producing an answer. An agent connected to hardware can continue through a cycle of action and observation.

It can adjust a parameter, read the resulting measurement, compare it with the goal, and choose another adjustment. If a liquid transfer produces a poor reading, it can vary the flow rate and try again. If a dose-response curve is saturated, it can narrow the concentration range and rerun the plate. If a laser loses its lock, it can inspect the instrument state and test a recovery procedure.

The model is no longer limited to reasoning over a fixed dataset. It can help generate the next data point.

That changes the role of an AI system in research. Today, researchers usually collect data first and bring it to a model later. With a hardware interface, the model can participate while the data is being produced. Analysis can alter acquisition in real time. A weak signal can receive more attention. An obviously failed run can stop early. A promising region of the parameter space can be explored while the sample and equipment are still available.

This resembles the way scientists already work. We do not execute every experiment as a perfectly fixed sequence. We look at intermediate results, notice unexpected behaviour, and revise the next step. MHS gives an agent enough access to take part in that process.

## Exploration should become ordinary code

There is an important distinction between using a model to discover a procedure and asking it to control every millisecond of an experiment.

Language models are variable and relatively slow. Laboratory control systems often need precise timing and predictable behaviour. A model should not be responsible for a tight motor-control loop or a hardware interlock.

A better pattern is for Claude to explore within safe boundaries, learn which sequence works, and then write a deterministic program for repeated execution. The resulting code can be inspected, tested, versioned, and run without consulting the model at every step. Claude returns when the system encounters a new condition or when the scientist wants to change the goal.

This combination makes practical sense. The model contributes adaptation and broad reasoning. Conventional software provides repeatability. The hardware controller retains authority over timing and physical safety.

It also produces a more defensible scientific record. A finished script is easier to examine than a long conversation containing hundreds of individual tool calls. Another researcher can see the exact procedure, rerun it, and compare changes between versions.

## Tacit knowledge can become shared infrastructure

Every laboratory accumulates knowledge that is real but poorly documented. A certain liquid foams above a particular pipetting speed. A stage needs to approach its target from one direction to avoid backlash. A sensor reports plausible values for several seconds after it has actually failed.

Researchers learn these facts through experience. They pass them to colleagues verbally or hide them inside code comments. Standard operating procedures capture some of this knowledge, but they are usually written for people and remain disconnected from the software controlling the device.

MHS creates a place to attach operational knowledge directly to the machine interface. An expert can state a constraint in plain language, and the agent can carry that context whenever it uses the instrument. A lesson from one failed run can become part of the default procedure for the next run.

Over time, this could turn laboratory experience into reusable infrastructure. A new researcher would inherit a driver that moves the machine and the accumulated knowledge required to move it sensibly.

## Physical access raises the cost of being wrong

Claude still lacks much of the physical intuition that experienced researchers use without thinking about it. A model may understand an error code while missing the material process that caused it. Retrying a failed liquid-handling step can create more bubbles. Moving a microscope objective by a seemingly small distance can destroy a sample that took weeks to prepare.

The consequences of a bad action are also different from the consequences of a bad answer. A broken script can be reverted. A contaminated sample or damaged instrument may be irrecoverable.

Safety therefore has to exist below the language model. Travel boundaries, power limits, collision checks, emergency stops, and permission rules must be enforced by deterministic systems. The agent should be physically unable to exceed them, regardless of what appears in its prompt or how confident its reasoning sounds.

Human approval also needs to depend on risk. Reading a temperature is different from heating a sample. Moving an empty robotic arm is different from moving one beside a person or carrying a hazardous material. A useful standard should express these differences clearly enough for laboratories to define their own boundaries.

The same caution applies to scientific judgment. An agent can optimize a measurable quantity while optimizing the wrong quantity. It can generate a clean curve from a flawed assay and repeat a systematic error with impressive efficiency. Researchers remain responsible for deciding whether the experiment answers the intended question and whether the result deserves belief.

## What has to happen next

The success of MHS will depend on the quality of its ecosystem.

Instrument coverage comes first. Laboratories will benefit only if manufacturers and researchers create drivers that are reliable, maintained, and reusable. Those drivers need versioning and conformance tests because a subtle interface error can corrupt an experiment while every component appears to be working.

The standard also needs strong provenance. Every result should carry the device state, driver version, parameter changes, analysis code, model decisions, and human approvals that produced it. Reproducibility must cover the physical execution as carefully as the notebook used for analysis.

Agents should be tested against ordinary laboratory failures rather than only clean demonstrations. Real equipment drifts, disconnects, overheats, wears down, and occasionally reports the wrong state. Samples are mislabeled. Cameras become obstructed. Two individually recoverable failures can interact in ways nobody anticipated. A system trusted to run overnight must fail safely under these conditions.

If this foundation develops, the effect will extend beyond saving researchers a few hours of manual work. Smaller laboratories could gain forms of automation that currently require a dedicated engineering team. Instruments could be recombined for new experiments without rebuilding the full control stack. Experimental cycles that now take weeks could be compressed because setup, monitoring, and routine recovery no longer consume most of the available time.

The important change is that Claude can move between reasoning and reality. It can help form a plan, act through bounded hardware interfaces, receive a physical measurement, and use that measurement to improve the next attempt. The scientist remains responsible for the question and for deciding what the evidence means.
