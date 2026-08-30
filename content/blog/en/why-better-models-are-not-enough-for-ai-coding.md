---
title: "Why Better Models Are Not Enough for AI Coding"
description: "Why reliable AI coding depends as much on clear module boundaries, executable rules, and CI as it does on capable models."
date: "2026-08-26"
tags:
  - AI Coding
  - AI Agents
  - Software Architecture
  - Modularity
  - Testing
  - CI/CD
published: true
translationKey: "ai-coding-needs-software-architecture"
featuredImage: "/blog/warum-bessere-modelle-fuer-ai-coding-nicht-reichen/cover.jpg"
featuredImageAlt: "Portrait of the author in a warm cinematic style, overlaid with a black brushstroke and the German word Grenzen, meaning boundaries."
youtubeVideoId: "0z-z-bVgt5Y"
youtubeVideoUploadDate: "2026-08-26"
---

AI agents can now change an astonishing amount of code in very little time. That is precisely why I am becoming stricter about software architecture, not more relaxed.

After all, a powerful agent in a chaotic repository can simply be wrong faster and in more places. The main bottleneck is no longer just whether a model can generate valid code. In a real system, it must reliably answer three other questions:

- Where does this change belong?
- What must it not touch?
- How does the system know when the work is done?

My thesis is this: architecture is becoming part of the control system for AI agents. This is not a new academic definition of architecture, but my practical conclusion from established principles. Good boundaries shrink the workspace. Executable rules block forbidden paths. Tests and acceptance criteria provide verifiable evidence that the intended change works.

## A Real Change Is More Than Code Generation

Generating an isolated function and resolving an issue in an existing repository are two very different tasks.

For a real change, an agent first has to locate the relevant code. It then has to understand relationships across multiple functions, classes, and files, operate the development environment, and run the changed code. The [SWE-bench paper](https://arxiv.org/abs/2310.06770) describes these differences as well: its tasks come from real GitHub issues and often require coordinated changes to existing codebases, rather than just the right line of code.

The model is not the only factor. The [SWE-agent paper](https://papers.neurips.cc/paper_files/paper/2024/file/5a7c947568c1b1328ccc5230172e1e7c-Paper-Conference.pdf) shows that the interface between the agent and the computer also matters: how an agent searches files, edits them, runs programs, and receives feedback about errors influences its behavior.

That makes intuitive sense. Anyone who has worked in an unfamiliar repository knows the problem. The difficult part is rarely being able to write an `if` statement at all. The difficult part is deciding which condition belongs in which place and what side effects it will cause.

Consider a seemingly small user story:

> A customer should be able to schedule a payment for next Friday.

In a poorly structured system, the agent might find a controller, a general-purpose validator, several shared helpers, direct database access, and a similar flow in another feature. Each of these locations looks plausible. None of them makes it clear where the domain responsibility belongs.

The problem is not a lack of code generation. The repository offers too many plausible paths, including several wrong ones.

## Give the Agent a Small World

For the scheduled payment, the agent should mainly need to understand `Payments`, not the entire business.

A well-bounded module can give it a small world to work in: it exposes a narrow public interface, keeps its domain rules and data access internal, and reveals only the contracts that other parts of the system genuinely need. `Accounts` and `Compliance` initially remain outside this workspace. Only their public interfaces are relevant.

The principle behind this is not specific to AI. As early as 1972, David Parnas described [information hiding as a criterion for decomposing systems](https://doi.org/10.1145/361598.361623): modules should hide decisions that are likely to change instead of being organized solely around processing steps. My application of that idea to agents is this: when a module truly hides its internals, an agent making a local change has to consider less irrelevant system knowledge at once.

Current agent workflows also treat locating the relevant code as a distinct phase. [Agentless](https://arxiv.org/abs/2407.01489), for example, separates localization, repair, and validation. This does not prove that a particular architecture automatically produces better results from agents. It does show, however, that selecting the right context is a distinct part of the task.

That is why I find a modular monolith interesting for many of these workflows: changes can remain local, boundaries are visible, and you do not automatically incur additional network and deployment complexity. This is not a blanket rejection of microservices. System size, team structure, scaling, and operational requirements may lead to a different decision.

The important point is narrower: do not give an agent the entire system as its working world when the story concerns only one module.

## Deep Modules Instead of Scattered Changes

An architecture diagram can look clean while a single change is still scattered across the entire repository.

I often see structures organized exclusively by technical role:

```text
controllers/
services/
repositories/
dtos/
validators/
mappers/
```

For the scheduled-payment story, the agent then has to search almost every one of these directories for the appropriate file. The parts of the change that belong together in domain terms are spread horizontally.

A local organization reverses the perspective:

```text
payments/
  public-api/
  scheduled-payments/
    domain/
    application/
    infrastructure/
```

The layers do not disappear. They sit inside the area where the change has meaning. The module can still be deep internally: a great deal of behavior can sit behind a small public API. From the outside, the number of permitted entry points remains manageable.

The goal is not to have fewer files at any cost. The goal is locality: a specific change should require as little irrelevant knowledge about the rest of the system as possible.

This, too, is a design conclusion rather than a law of nature. Some changes inevitably cross domain boundaries. A new data-protection approach or a migration may affect several modules. Good boundaries make that coupling visible, however. They prevent every small feature change from quietly turning into a tour of the entire repository.

## Instructions Alone Are Not Boundaries

Repository instructions are useful. In an `AGENTS.md`, I can explain which commands to run, how a module is organized, or which conventions apply. According to the [official documentation](https://learn.chatgpt.com/docs/agent-configuration/agents-md), Codex can read these files hierarchically and combine local guidance with more general project rules.

But an instruction is still only an instruction. If it says that `Payments` must not import internal classes from `Compliance`, an agent can still technically create that import.

A boundary exists only when the system rejects the violation. Depending on the stack, there are several ways to achieve this:

- An architecture test can detect forbidden dependencies. [ArchUnit](https://www.archunit.org/userguide/html/000_Index.html), for example, supports rules over classes and layers in Java.
- Build visibility rules can define which packages may depend on one another. With [Bazel](https://bazel.build/concepts/visibility), disallowed access produces a build error during the analysis phase.
- CI can run these checks for every change. When a branch is protected accordingly, [Required Status Checks in GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing/protected-branches/about-protected-branches) can block a merge until every required check has passed.

“Please do not import this” then becomes a reproducible result: allowed public API, green; internal access, red.

That does not automatically make the rule correct. Architecture tests can only see the relationships we have formalized. They cannot detect incorrect business logic or a forgotten requirement. Rules that are too broad also tend to produce exceptions and workarounds. Even so, an incomplete but verifiable boundary is often more valuable than a perfect rule that exists only in a document.

In short, `AGENTS.md` can guide behavior. The build, tests, and CI can enforce selected rules.

## “Done” Must Be Verifiable from the Outside

Once the boundary is clear, we still need a definition of “done.” It should not emerge from a gut feeling only after the implementation is complete.

For the scheduled payment, an acceptance scenario might look like this:

```gherkin
Feature: Scheduled payments
  Scenario: Schedule a payment for next Friday
    Given an account with sufficient funds
    And a valid payee
    When the customer schedules the payment for next Friday
    Then the payment is not executed before Friday
    And the same idempotency key does not create a second payment
```

The [Gherkin reference from Cucumber](https://cucumber.io/docs/gherkin/reference/) describes a familiar sequence for examples like this: initial context with `Given`, an event with `When`, and an observable outcome with `Then`. The syntax is not the important part. What matters is that the expectation becomes concrete before implementation and can be executed afterward.

The same story might also require the following:

- `Payments` does not import internal classes from `Compliance`.
- Unit tests cover the business rules for calculating the scheduled date.
- An integration test verifies persistence and execution.
- Type checking, linting, and the build all pass.
- The acceptance scenario confirms the externally visible behavior.

The agent should not merely claim that it is finished. It should demonstrably satisfy the conditions defined beforehand.

One limitation matters here: green tests do not prove that the change is completely correct. They provide evidence that the encoded examples and rules hold in the tested environment. A forgotten acceptance criterion remains invisible even to a green pipeline.

## A Controlled Workflow, Not Prompt-and-Hope

For me, these building blocks lead to a different workflow:

1. Understand the story and its domain risks.
2. Formulate observable acceptance criteria.
3. Locate the relevant modules and public contracts.
4. Plan the change with a constrained scope.
5. Implement it without weakening the agreed boundaries.
6. Run tests, architecture rules, linting, type checking, and the build.
7. Trace failed checks back to their causes, fix them, and run the checks again.
8. Have a human review the change in the pull request, and only then merge it.

When a check fails, its feedback guides the agent back to the specific cause. After the correction, the relevant checks run again. Even when everything is green, the human review still has to ask about readability, unnecessary scope, missing criteria, and unintended side effects.

Specialized roles such as Planner, Implementer, or Reviewer can support individual steps. They do not make the codebase itself any clearer. More agents are no substitute for either repository boundaries or independent verification.

For me, effective agent work is not about writing the longest possible prompt. It is a controlled software-development process with short feedback loops.

## Where I Would Start in an Existing Repository

I would not begin with a large “AI-ready” migration. I would take one real, manageable user story and trace its path through the system.

Six questions help me do that:

1. Which module should be responsible for the change?
2. Which other parts of the system does the story genuinely need to know about?
3. Which internals are accidentally accessible today?
4. Which invalid dependency is only documented rather than technically blocked?
5. Which outcome can I observe from the outside and express as an acceptance scenario?
6. Which checks must pass before a merge is allowed?

Even a single executable boundary can improve the next agent run. Not because it makes the agent more intelligent, but because the repository leaves fewer wrong options available.

## Less Room to Be Wrong Without Anyone Noticing

We have long designed software architecture to help people understand and safely change large systems. Now it has a second audience: machines acting within those systems with increasing autonomy.

The familiar principles do not disappear. Information hiding, clear contracts, locality, automated tests, and CI become even more visibly important as control mechanisms.

AI-ready code, then, is not code that an AI can generate with particular ease. It is code that leaves an AI little room to be wrong without anyone noticing.
