import type { Topic } from '../types'

export const topics: Topic[] = [
  {
    id: 'llm-foundations',
    tier: 1,
    requiredLevel: 1,
    title: 'LLM Foundations',
    tagline: 'Tokens, context windows, and what these models actually do',
    icon: '🧠',
    fdeRelevance:
      "As an FDE you'll be asked \"why did the model do that?\" in front of a customer. You need a working mental model of tokens, context limits, and sampling to answer confidently.",
    lesson: [
      "A large language model doesn't see words — it sees tokens, chunks of text (often sub-word) mapped to numbers. \"Forward Deployed\" might become 3-4 tokens, not 2. This matters because pricing, context limits, and even weird spelling failures are all token-level phenomena.",
      "The context window is the total number of tokens the model can consider at once — input plus output. A 200K-token window sounds huge, but system prompts, tool definitions, retrieved documents, and chat history all eat into it. Part of the FDE job is budgeting that window.",
      "Generation is next-token prediction, sampled with a temperature. Temperature 0 is close to deterministic and best for structured/production tasks; higher temperature adds variety, useful for brainstorming, risky for anything that must be reliable.",
      "Models are trained in stages: pretraining (predict text at internet scale) then post-training/alignment (supervised fine-tuning + RL from human/AI feedback) to make them follow instructions and behave safely. What you interact with via an API is the post-trained model, not the raw pretrained one.",
      'Key limitation to remember on customer calls: the model has no persistent memory between separate API calls unless *you* re-send context. Anything that looks like "memory" in a product is application-layer engineering, not a property of the model itself.',
    ],
    quiz: [
      {
        id: 'llm-foundations-q1',
        kind: 'mcq',
        prompt: 'What is a "token" in the context of an LLM?',
        options: [
          'A single English word, always',
          'A chunk of text (often a sub-word unit) that the model processes as one unit',
          'A unit of GPU memory',
          'An API authentication key',
        ],
        correctIndex: 1,
        explanation:
          'Tokens are sub-word units produced by a tokenizer. Common words are often one token, rare words split into several — which is why token counts rarely match word counts.',
        xp: 20,
      },
      {
        id: 'llm-foundations-q2',
        kind: 'mcq',
        prompt: 'The "context window" of an LLM refers to:',
        options: [
          'How long the company has supported the model',
          'The maximum combined input + output tokens the model can handle in one call',
          'The number of parallel requests the API allows',
          'The size of the training dataset',
        ],
        correctIndex: 1,
        explanation:
          'The context window caps input + output tokens together. Long system prompts, tool schemas, and chat history all compete for the same budget.',
        xp: 20,
      },
      {
        id: 'llm-foundations-q3',
        kind: 'mcq',
        prompt:
          'A customer asks why the model gives slightly different answers to the same prompt on different runs. The most likely cause is:',
        options: [
          'The model is broken',
          'Non-zero temperature/sampling introduces randomness in token selection',
          'The context window changed size',
          'The API is caching an old response',
        ],
        correctIndex: 1,
        explanation:
          'With temperature above 0, the model samples from a probability distribution over next tokens rather than always taking the top choice, so outputs vary run to run.',
        xp: 20,
      },
      {
        id: 'llm-foundations-q4',
        kind: 'mcq',
        prompt: 'Does a base LLM API call "remember" previous separate conversations by default?',
        options: [
          'Yes, all major providers store and recall history automatically',
          'No — unless the application resends prior messages as context, each call is stateless',
          'Only if the user is on a paid plan',
          'Only for the first 24 hours',
        ],
        correctIndex: 1,
        explanation:
          "LLM APIs are stateless by default. Any sense of memory in a product (chat history, personalization) is built by the application layer re-sending context — that's exactly the kind of thing FDEs build.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'llm-foundations-challenge',
      prompt:
        'A customer\'s pilot deployment is randomly truncating long documents mid-sentence when summarizing. In 2-3 sentences, explain the likely root cause and how you would confirm it before proposing a fix.',
      hint: 'Think about what happens when input + expected output tokens exceed the context window.',
      modelAnswer:
        "The likely cause is that the document plus prompt plus expected output exceeds the model's context window, so the input (or output) is being silently truncated. To confirm, log the exact token count of the request (using the provider's tokenizer) against the model's documented limit, and check whether truncation happens at a consistent token offset. The fix is usually chunking the document (e.g. map-reduce summarization) or switching to a larger-context model, not a prompt tweak.",
      xp: 15,
    },
  },
  {
    id: 'prompt-engineering',
    tier: 1,
    requiredLevel: 1,
    title: 'Prompt Engineering',
    tagline: 'Getting reliable behavior out of a probabilistic system',
    icon: '✍️',
    fdeRelevance:
      "You'll spend a huge share of pilot time iterating on prompts with a customer's real data in the room. Structured, testable prompting is how you go from 'looks good in the demo' to 'works in production.'",
    lesson: [
      'Good prompts separate concerns clearly: role/system instructions, task instructions, the data to operate on, and the desired output format. Mixing all of that into one paragraph is the #1 source of unreliable outputs.',
      'Few-shot examples (showing 2-3 example input/output pairs) are often more effective than longer instructions for getting a consistent output format or tone — especially for classification and extraction tasks.',
      'Ask for structured output (JSON, XML tags, a fixed schema) whenever the output feeds into code. Constrained/structured output modes (or simply instructing a strict schema and validating it) turn a fuzzy generator into something you can build a pipeline on top of.',
      'Chain-of-thought ("think step by step" / a scratchpad before the final answer) improves accuracy on multi-step reasoning, but costs tokens and latency — reserve it for tasks that actually need reasoning, not simple lookups or formatting.',
      "In customer engagements, the highest-leverage move is usually building a small eval set (10-50 real examples) *before* iterating on the prompt, so you can tell if a change actually helped instead of eyeballing one output and declaring victory.",
    ],
    quiz: [
      {
        id: 'prompt-engineering-q1',
        kind: 'mcq',
        prompt: 'Why do few-shot examples often outperform longer written instructions for format-sensitive tasks?',
        options: [
          'They use fewer tokens than any instruction',
          'They show the model the exact pattern to imitate, which is easier than inferring rules from prose',
          "They're required by the API",
          'They disable randomness entirely',
        ],
        correctIndex: 1,
        explanation:
          'Models are strong pattern-matchers. Concrete examples of the input/output relationship are often easier to generalize from than abstract prose rules.',
        xp: 20,
      },
      {
        id: 'prompt-engineering-q2',
        kind: 'mcq',
        prompt: "You need the model's output to be parsed reliably by downstream code. What should you do?",
        options: [
          'Ask for a "brief, friendly" answer',
          'Request a strict structured format (e.g. JSON matching a schema) and validate/parse it',
          'Increase temperature to make it more creative',
          'Avoid giving any formatting instructions so the model has flexibility',
        ],
        correctIndex: 1,
        explanation:
          "Downstream code needs determinism in structure, not content. Specify a schema explicitly, and validate the model's output against it before trusting it.",
        xp: 20,
      },
      {
        id: 'prompt-engineering-q3',
        kind: 'mcq',
        prompt: 'Chain-of-thought prompting is most worth its extra latency/cost when:',
        options: [
          'The task is a simple lookup or reformatting job',
          'The task requires multi-step reasoning or arithmetic where intermediate steps reduce errors',
          'You want the shortest possible response',
          'The model has a very small context window',
        ],
        correctIndex: 1,
        explanation:
          'Reasoning traces help on genuinely multi-step problems. For trivial tasks they mostly add latency and cost without accuracy gains.',
        xp: 20,
      },
      {
        id: 'prompt-engineering-q4',
        kind: 'mcq',
        prompt: 'Before iterating further on a prompt that "seems to work," the most valuable next step is usually to:',
        options: [
          'Ship it immediately since it worked once',
          'Build a small evaluation set of real examples with expected outputs to measure changes objectively',
          'Increase the max token limit',
          'Switch to a different vendor',
        ],
        correctIndex: 1,
        explanation:
          "Without an eval set you're eyeballing single outputs, which is how regressions sneak into 'improvements.' A handful of representative examples turns prompting into something measurable.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'prompt-engineering-challenge',
      prompt:
        "A customer's support-ticket classifier prompt works well on easy tickets but breaks on ambiguous ones, returning inconsistent category names each time. Propose two concrete prompt changes to fix this, in 2-3 sentences.",
      hint: 'Think about closed-set vs open-ended output, and what examples do for edge cases.',
      modelAnswer:
        "First, constrain the output to a fixed enum of category names (e.g. \"respond with exactly one of: billing, bug, feature_request, other\") rather than free text, so category names can't drift. Second, add 2-3 few-shot examples that specifically cover ambiguous/borderline tickets and show the desired category, since the model is likely improvising on exactly the cases it hasn't seen a pattern for.",
      xp: 15,
    },
  },
  {
    id: 'embeddings-vector-search',
    tier: 2,
    requiredLevel: 2,
    title: 'Embeddings & Vector Search',
    tagline: 'Turning meaning into numbers you can search over',
    icon: '📐',
    fdeRelevance:
      'Nearly every enterprise pilot involves "search our documents." Understanding embeddings lets you diagnose bad retrieval instead of blaming the LLM for it.',
    lesson: [
      'An embedding model turns text into a vector (a list of numbers) such that semantically similar text ends up close together in that vector space. This is different from keyword search, which matches literal words.',
      "Similarity is usually measured with cosine similarity or dot product. \"Close in vector space\" roughly means \"the model thinks these mean similar things\" — it does not guarantee factual relevance, recency, or correctness.",
      'A vector database (or a vector index inside a general database) stores these embeddings and lets you query "find the k nearest vectors to this query vector" efficiently, even across millions of documents, using approximate nearest-neighbor (ANN) algorithms.',
      "Chunking strategy matters enormously: embedding a whole 50-page PDF as one vector loses granularity, while chunking too small loses context. A common starting point is a few hundred tokens per chunk with some overlap between chunks.",
      'Embeddings are domain-sensitive: a general-purpose embedding model may perform noticeably worse on dense legal or medical jargon than on general text. When retrieval quality is poor, checking whether the embedding model matches the domain is a cheap early diagnostic.',
    ],
    quiz: [
      {
        id: 'embeddings-q1',
        kind: 'mcq',
        prompt: 'What does an embedding model fundamentally produce from a piece of text?',
        options: [
          'A summary of the text',
          'A numeric vector positioned so similar meanings are close together',
          'A translated version of the text',
          'A compressed version of the raw bytes',
        ],
        correctIndex: 1,
        explanation:
          'Embeddings map text into a continuous vector space where geometric closeness approximates semantic similarity.',
        xp: 20,
      },
      {
        id: 'embeddings-q2',
        kind: 'mcq',
        prompt: 'Vector search fundamentally differs from classic keyword search because it:',
        options: [
          'Is always faster regardless of scale',
          'Matches on semantic similarity rather than exact word overlap',
          "Doesn't require any index to be built",
          'Only works on English text',
        ],
        correctIndex: 1,
        explanation:
          "Vector search finds conceptually related content even without shared keywords, which is exactly what it's good and bad at: high recall on paraphrases, but no guarantee of literal relevance.",
        xp: 20,
      },
      {
        id: 'embeddings-q3',
        kind: 'mcq',
        prompt: "A customer's retrieval keeps returning chunks that are topically related but don't actually answer the question. A likely fix to investigate first is:",
        options: [
          'Increase the LLM temperature',
          'Review chunking size/overlap and consider a domain-appropriate embedding model',
          'Switch the whole system to keyword search only, permanently',
          'Reduce the context window',
        ],
        correctIndex: 1,
        explanation:
          "Poor precision often traces back to chunking (too coarse/fine) or an embedding model mismatched to the domain — both are cheap to test before assuming the LLM itself is at fault.",
        xp: 20,
      },
      {
        id: 'embeddings-q4',
        kind: 'mcq',
        prompt: 'Approximate Nearest Neighbor (ANN) search exists primarily to:',
        options: [
          'Guarantee perfectly exact results at any scale',
          'Trade a small amount of accuracy for large speed/scale gains when searching millions of vectors',
          'Replace the need for an embedding model',
          'Encrypt vector data',
        ],
        correctIndex: 1,
        explanation:
          "Exact nearest-neighbor search doesn't scale to large corpora. ANN indexes (e.g. HNSW) trade a small recall cost for major speed gains.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'embeddings-challenge',
      prompt:
        'A customer wants to search across a mix of short product titles and long legal contracts using the same vector index. What risk should you flag, and what would you propose instead, in 2-3 sentences?',
      hint: 'Think about chunk length variance and whether one embedding strategy suits both content types.',
      modelAnswer:
        "Embedding a 5-word title and a 50-page contract the same way is risky: short texts and long texts embed very differently, and naive chunking of contracts alongside whole titles will skew similarity comparisons and hurt retrieval quality for both. I'd propose separate indexes (or at least separate, appropriately-sized chunking strategies) per content type, and route queries to the right index based on intent or search both and merge/re-rank results.",
      xp: 15,
    },
  },
  {
    id: 'rag',
    tier: 2,
    requiredLevel: 2,
    title: 'Retrieval-Augmented Generation',
    tagline: 'Grounding answers in a customer\'s own data',
    icon: '📚',
    fdeRelevance:
      'RAG is the single most common architecture FDEs ship in the first 90 days of a deployment: "answer questions about our internal documents/data."',
    lesson: [
      "RAG combines retrieval (fetch relevant chunks from a knowledge base, typically via vector search) with generation (an LLM writes an answer using those chunks as context). The point is grounding: reducing hallucination by making the model answer from real, cited source text instead of parametric memory.",
      'A basic RAG pipeline: embed the user query → retrieve top-k similar chunks → stuff them into the prompt with the question → the LLM generates an answer, ideally with citations back to source chunks.',
      "RAG quality has two independent failure modes and you must diagnose which one you're seeing: retrieval failure (the right document was never fetched) versus generation failure (the right document was fetched but the model ignored or misused it). Confusing the two leads to fixing the wrong layer.",
      'Reranking (using a smaller, more precise model to re-score the top ~50 retrieved chunks before picking the final top-k) often gives a bigger quality jump than swapping the embedding model, because initial vector search optimizes for recall, not precision.',
      "RAG is not a substitute for fine-tuning when the need is *behavior/style* change (e.g. \"always respond in this format\" or \"speak like our brand\") — RAG injects knowledge, it doesn't reliably change how the model behaves. Knowing which lever solves which customer complaint is a core FDE judgment call.",
    ],
    quiz: [
      {
        id: 'rag-q1',
        kind: 'mcq',
        prompt: 'What is the primary goal of Retrieval-Augmented Generation?',
        options: [
          'To make the model generate faster',
          "To ground the model's answers in retrieved, real source documents and reduce hallucination",
          'To fine-tune the model weights automatically',
          'To replace the need for prompts entirely',
        ],
        correctIndex: 1,
        explanation:
          "RAG grounds generation in actual retrieved content so answers can be traced to (and constrained by) real documents, rather than relying purely on the model's trained-in knowledge.",
        xp: 20,
      },
      {
        id: 'rag-q2',
        kind: 'mcq',
        prompt:
          'A RAG system gives a wrong answer. You check the logs: the correct source chunk WAS retrieved and included in the prompt, but the model still gave a wrong answer. This is a:',
        options: [
          'Retrieval failure',
          'Generation failure — the model had the right context but used it incorrectly',
          'Embedding model version mismatch',
          'Vector database outage',
        ],
        correctIndex: 1,
        explanation:
          "Since the right chunk was present in context, the retrieval layer did its job. The failure is in generation — worth investigating prompt clarity, conflicting chunks, or context length crowding it out.",
        xp: 20,
      },
      {
        id: 'rag-q3',
        kind: 'mcq',
        prompt: 'Reranking in a RAG pipeline typically happens:',
        options: [
          'Before any retrieval, to build the index',
          'After initial vector retrieval, to re-score a larger candidate set for higher precision before generation',
          'After the LLM has already generated an answer',
          'Only when using keyword search',
        ],
        correctIndex: 1,
        explanation:
          'Vector search casts a wide net optimized for recall; a reranker narrows that candidate set down with a more precise (often cross-encoder) relevance model before the final top-k is sent to the LLM.',
        xp: 20,
      },
      {
        id: 'rag-q4',
        kind: 'mcq',
        prompt: 'A customer says: "The bot knows the right facts but never responds in our required tone/format." What is the better lever?',
        options: [
          'Add more documents to the retrieval index',
          "Address it via prompting/output formatting or fine-tuning — RAG solves knowledge grounding, not style/behavior",
          'Increase the number of retrieved chunks (top-k)',
          'Switch the vector database vendor',
        ],
        correctIndex: 1,
        explanation:
          "Tone and format are behavioral, not knowledge problems — more or better retrieved documents won't fix them. That's a prompting/output-schema or fine-tuning problem.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'rag-challenge',
      prompt:
        'A customer\'s RAG chatbot confidently answers questions using outdated policy documents that were superseded last month. In 2-3 sentences, what is the likely root cause and fix — is this an LLM problem?',
      hint: 'Think about what the index actually contains and how freshness is (or isn\'t) managed.',
      modelAnswer:
        "This is not fundamentally an LLM problem — it's a data-freshness/indexing problem: the vector index still contains (or ranks highly) the outdated document, likely because the old version was never removed or re-indexing isn't automated on document updates. The fix is a document lifecycle process — versioning, deprecation/removal from the index, and ideally an automated re-index pipeline triggered on document changes — not a prompt or model change.",
      xp: 15,
    },
  },
  {
    id: 'tool-use',
    tier: 3,
    requiredLevel: 3,
    title: 'Tool Use & Function Calling',
    tagline: 'Letting the model take real actions, safely',
    icon: '🛠️',
    fdeRelevance:
      "Most FDE-built pilots aren't chatbots — they're systems where the model triggers real actions (query a database, call an internal API, draft a Jira ticket). Tool use is how that happens reliably.",
    lesson: [
      "Function/tool calling lets you describe available tools (name, description, input schema) to the model. Instead of answering in prose, the model can respond with a structured request to call one of those tools with specific arguments — your application code executes it and returns the result back to the model.",
      'The tool description is the interface contract: vague names and descriptions ("doStuff") produce unreliable tool selection. Precise names, parameter descriptions, and constraints (enums, required fields) dramatically improve reliability — this is prompt engineering applied to schemas.',
      "The model decides *whether* and *which* tool to call, but your code decides whether to actually execute it. Never treat a tool call as automatically safe to run — for anything destructive or costly (sending an email, deleting a record, spending money), add confirmation, validation, or a permission layer before execution.",
      'Multi-turn tool use is a loop: the model calls a tool → you execute it → you send the result back as a new message → the model decides the next step (another tool call, or a final answer). Getting this loop right, including error handling when a tool call fails, is core FDE engineering.',
      "A common failure mode: giving the model too many overlapping tools. If two tools could plausibly handle the same request, the model will sometimes pick the wrong one inconsistently. Keep the toolset minimal and the boundaries between tools crisp.",
    ],
    quiz: [
      {
        id: 'tool-use-q1',
        kind: 'mcq',
        prompt: 'In function/tool calling, who actually executes the tool once the model requests it?',
        options: [
          'The model itself, inside its weights',
          "Your application code — the model only outputs a structured request to call it",
          'The API provider automatically executes any tool for you',
          'It happens randomly based on temperature',
        ],
        correctIndex: 1,
        explanation:
          'The model never executes code directly. It emits a structured tool-call request; your application is responsible for actually running it and returning the result.',
        xp: 20,
      },
      {
        id: 'tool-use-q2',
        kind: 'mcq',
        prompt: 'Why does the quality of a tool\'s name and parameter descriptions matter so much?',
        options: [
          "It doesn't matter, only the underlying code matters",
          'The model relies on those descriptions, like a prompt, to decide whether and how to call the tool correctly',
          'Tool descriptions are only shown to end users',
          'Longer descriptions always slow down the API',
        ],
        correctIndex: 1,
        explanation:
          "Tool schemas are effectively part of the prompt. Ambiguous names/descriptions cause the model to misuse or confuse tools, just like ambiguous instructions cause bad text output.",
        xp: 20,
      },
      {
        id: 'tool-use-q3',
        kind: 'mcq',
        prompt: 'A tool call would permanently delete a customer record. What should the system do?',
        options: [
          'Execute it immediately since the model requested it',
          'Add an explicit confirmation/validation/permission step before executing destructive tool calls',
          'Disable tool use entirely for all tools',
          'Silently log it but still run it',
        ],
        correctIndex: 1,
        explanation:
          'The model choosing to call a tool is not the same as it being safe to run unsupervised. Destructive or costly actions need a guardrail layer regardless of how confident the model output looks.',
        xp: 20,
      },
      {
        id: 'tool-use-q4',
        kind: 'mcq',
        prompt: 'You give the model two tools, "search_orders" and "lookup_orders", with near-identical descriptions. The likely result is:',
        options: [
          'The model will always pick the alphabetically first one',
          'Inconsistent, unpredictable tool selection because the model cannot reliably distinguish overlapping tools',
          'The API will throw an error at definition time',
          'Both tools will always be called together',
        ],
        correctIndex: 1,
        explanation:
          "Overlapping tool boundaries confuse tool selection the same way ambiguous instructions confuse text generation. Keep each tool's purpose distinct and non-overlapping.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'tool-use-challenge',
      prompt:
        'A customer wants the agent to be able to "send a refund" via a tool call fully autonomously, with no human in the loop. In 2-3 sentences, what would you push back on or add before agreeing to ship that?',
      hint: 'Think about blast radius, reversibility, and staged rollout.',
      modelAnswer:
        "I'd push back on full autonomy for an irreversible financial action on day one, and propose staged trust instead: start with the agent drafting the refund for human approval, add hard limits (e.g. dollar caps, rate limits, eligibility checks enforced in code, not just prompted), and only expand to full autonomy after logging shows the agent's decisions are reliable within defined guardrails. Reversibility and blast radius should drive how much human oversight a given tool call needs, not just the model's confidence.",
      xp: 15,
    },
  },
  {
    id: 'agents',
    tier: 3,
    requiredLevel: 3,
    title: 'AI Agents & Orchestration',
    tagline: 'From single calls to multi-step, multi-tool systems',
    icon: '🤖',
    fdeRelevance:
      "\"Agent\" is the word customers use for almost any autonomous workflow. You need to translate that vague ask into a concrete architecture: single-agent loop, multi-agent, or plain deterministic pipeline.",
    lesson: [
      'An "agent," loosely, is an LLM in a loop: it observes state, decides an action (often a tool call), observes the result, and repeats until it decides the task is done. The defining feature versus a single prompt call is that the number and sequence of steps isn\'t fixed in advance — the model decides.',
      "Not every workflow needs to be agentic. If the steps are always the same and known ahead of time (fetch data → summarize → email), a deterministic pipeline with the LLM doing one well-scoped step is more reliable, cheaper, and easier to debug than a free-roaming agent. Reach for agents when the *path* through the task genuinely varies based on what's discovered along the way.",
      "Multi-agent systems (a 'planner' agent delegating to 'worker' agents, or specialized agents debating/reviewing each other) can help decompose complex tasks, but each additional agent hop adds latency, cost, and a new place for errors to compound. Treat multi-agent architecture as a cost you pay for a specific benefit (specialization, parallelism, isolation), not a default.",
      'Agents need explicit stopping conditions — a max number of steps/iterations, a clear "done" signal, and ideally a budget (time, tokens, or tool calls) — otherwise a confused agent can loop indefinitely or rack up runaway cost.',
      "Observability is not optional for agents: because the path is dynamic, you need step-by-step tracing (what did it decide, what tool did it call, what came back) to debug failures after the fact. Shipping an agent to a customer without traceable logs is close to shipping a black box.",
    ],
    quiz: [
      {
        id: 'agents-q1',
        kind: 'mcq',
        prompt: 'What most fundamentally distinguishes an "agent" from a single prompt/response call?',
        options: [
          'Agents always use a bigger model',
          'The sequence and number of steps is decided dynamically by the model in a loop, rather than fixed in advance',
          'Agents never use tools',
          'Agents run without any prompt at all',
        ],
        correctIndex: 1,
        explanation:
          "The defining trait is dynamic control flow: the model decides what happens next based on what it observes, rather than following a hardcoded sequence.",
        xp: 20,
      },
      {
        id: 'agents-q2',
        kind: 'mcq',
        prompt: 'A customer wants a workflow with fixed steps (fetch → summarize → email) every single time. What should you likely build?',
        options: [
          'A fully autonomous multi-agent system regardless of the fixed steps',
          'A deterministic pipeline where the LLM handles one well-scoped step, since the path never actually varies',
          'Nothing — this cannot be done with LLMs',
          'A single agent with unlimited iteration budget',
        ],
        correctIndex: 1,
        explanation:
          "When the path through a task is always the same, a deterministic pipeline is more reliable and debuggable than an agent loop — agentic freedom is a cost you pay only when the path genuinely needs to vary.",
        xp: 20,
      },
      {
        id: 'agents-q3',
        kind: 'mcq',
        prompt: 'Why must agent loops have an explicit stopping condition?',
        options: [
          "They don't need one, agents always know when to stop naturally",
          'Without a max-steps/budget/done-signal, a confused agent can loop indefinitely, wasting time and cost',
          'Stopping conditions are only required for multi-agent systems',
          'It is purely a legal requirement, not a technical one',
        ],
        correctIndex: 1,
        explanation:
          "Agent loops without hard bounds are a classic runaway-cost and reliability risk — always cap steps/time/tool-calls and define what 'done' means.",
        xp: 20,
      },
      {
        id: 'agents-q4',
        kind: 'mcq',
        prompt: 'Why is step-by-step tracing/observability especially important for agentic systems, more so than for a single LLM call?',
        options: [
          "It isn't more important, logging is identical either way",
          'Because the execution path is dynamic and unpredictable, you need to see the actual sequence of decisions to debug a failure',
          'Tracing is only needed for compliance, not debugging',
          'Agents never fail so tracing is precautionary only',
        ],
        correctIndex: 1,
        explanation:
          "Since an agent's path isn't fixed, you can't infer what happened just from the final output — you need the intermediate decisions and tool calls logged to diagnose failures.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'agents-challenge',
      prompt:
        'A customer asks for "an agent that fully automates our quarterly compliance report end-to-end." In 2-3 sentences, how would you scope the first version?',
      hint: 'Consider fixed vs. variable steps, and where a human should stay in the loop initially.',
      modelAnswer:
        "I'd start by mapping whether the report process is actually fixed-step (same sources, same structure every quarter) or genuinely variable — if it's mostly fixed, the first version should be a deterministic pipeline with LLM steps for drafting/summarizing narrative sections, not a free-roaming agent. I'd scope v1 to produce a draft report for human review rather than auto-submitting it, and only consider expanding autonomy once we have several quarters of accuracy data to justify removing the human checkpoint.",
      xp: 15,
    },
  },
  {
    id: 'evaluation',
    tier: 4,
    requiredLevel: 4,
    title: 'Evaluation & Testing LLM Systems',
    tagline: 'Proving it works, not just believing it does',
    icon: '📊',
    fdeRelevance:
      "The gap between a customer's 'looks great in the demo' and a production sign-off is almost always a missing evaluation story. FDEs who can produce a credible eval win more deals and more trust.",
    lesson: [
      "Evals are test suites for probabilistic systems. Unlike traditional unit tests, you usually can't assert exact string equality — you assert properties (does it contain the right fact, does it follow the schema, does a grader model or human rate it as correct/acceptable).",
      "Start with a small, real, labeled dataset (20-100 examples pulled from actual customer data or realistic scenarios) before writing any evaluation code. A great eval harness running against fake or trivial examples tells you nothing about production behavior.",
      "There are three common ways to grade LLM outputs: exact/structural match (great for classification, JSON schema validity — cheap and reliable), human review (gold standard for nuance, but slow and expensive), and LLM-as-judge (a second model scores outputs against a rubric — fast and scalable, but needs calibration against human judgment before you trust it).",
      "Track evals over time as a regression suite, the same way you'd track unit tests in normal software. When you change a prompt, model version, or retrieval config, rerun the eval set before declaring the change an improvement — 'it felt better' is not evidence.",
      'Separate correctness metrics from operational metrics: latency, cost per request, and error/timeout rates matter just as much to a production sign-off as answer quality, and customers will ask about all of them.',
    ],
    quiz: [
      {
        id: 'evaluation-q1',
        kind: 'mcq',
        prompt: 'Why can\'t most LLM evals rely on exact string-equality assertions the way traditional unit tests do?',
        options: [
          'LLM outputs are encrypted',
          "LLM outputs are naturally variable in phrasing even when correct, so you need to check properties/content rather than an exact string match",
          'Exact match is always cheaper, so it should always be used instead',
          'LLMs never produce the same answer twice, ever',
        ],
        correctIndex: 1,
        explanation:
          'Two correct answers can be worded completely differently. Evals need to check for the right content, structure, or facts rather than literal text equality — except for genuinely structural outputs like JSON schema validity.',
        xp: 20,
      },
      {
        id: 'evaluation-q2',
        kind: 'mcq',
        prompt: 'What should come first when building an eval for a customer pilot?',
        options: [
          'Writing the grading code',
          'A small, real, representative labeled dataset pulled from actual or realistic customer scenarios',
          'Choosing which LLM-as-judge model to use',
          'Optimizing for the lowest possible latency',
        ],
        correctIndex: 1,
        explanation:
          "Grading logic is worthless without a dataset that reflects real usage. Start from real examples, even a small set, before investing in harness sophistication.",
        xp: 20,
      },
      {
        id: 'evaluation-q3',
        kind: 'mcq',
        prompt: 'Before trusting an "LLM-as-judge" grading setup for a customer deliverable, you should:',
        options: [
          'Trust it immediately since LLMs are good graders by default',
          'Calibrate it against human judgment on a sample to confirm the judge model agrees with human graders',
          'Only use it for latency measurement',
          'Avoid using humans at any point in the process',
        ],
        correctIndex: 1,
        explanation:
          "LLM-as-judge is fast and scalable but not automatically trustworthy — validate that its scores correlate with human judgment on a sample before relying on it at scale.",
        xp: 20,
      },
      {
        id: 'evaluation-q4',
        kind: 'mcq',
        prompt: 'Besides answer correctness, what else should a production eval/monitoring story typically cover?',
        options: [
          'Nothing else matters besides correctness',
          'Operational metrics like latency, cost per request, and error/timeout rates',
          'Only the size of the model',
          'Only the number of employees on the customer team',
        ],
        correctIndex: 1,
        explanation:
          "Production sign-off usually depends on operational health as much as answer quality — a system that's occasionally brilliant but frequently slow or erroring won't pass a pilot.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'evaluation-challenge',
      prompt:
        'A stakeholder says "the new prompt feels way better, let\'s ship it" after looking at 3 example outputs. In 2-3 sentences, how do you respond?',
      hint: 'Think about sample size and what "feels better" is missing.',
      modelAnswer:
        "I'd push to run both the old and new prompt against the existing eval set (or quickly build one from ~20-30 real examples if none exists) before shipping, since 3 hand-picked examples can't reveal regressions on edge cases the new prompt might handle worse. I'd frame it collaboratively — \"let's get the eval numbers in the next hour so we ship with confidence, not just a good feeling\" — rather than blocking the enthusiasm outright.",
      xp: 15,
    },
  },
  {
    id: 'fine-tuning',
    tier: 4,
    requiredLevel: 4,
    title: 'Fine-tuning vs. Prompting',
    tagline: 'Knowing which lever actually solves the problem',
    icon: '🎛️',
    fdeRelevance:
      "Customers frequently ask to 'fine-tune the model on our data' when what they actually need is better prompting or RAG. Correctly diagnosing this saves weeks of wasted engineering.",
    lesson: [
      "Fine-tuning adjusts model weights on a custom dataset of examples, changing the model's default behavior/style/format without needing those instructions repeated in every prompt. It's a behavior lever, not a knowledge lever — it's poorly suited to injecting large amounts of fresh or frequently-changing factual content (use RAG for that).",
      "Prompting (including few-shot examples) should usually be tried first: it's faster to iterate, requires no training infrastructure, and a surprising fraction of 'we need to fine-tune' requests are solved by a better system prompt, structured output constraints, or RAG.",
      'Fine-tuning earns its cost when you need consistent behavior that\'s hard to specify in a prompt at all: a very specific output style/format applied thousands of times, domain-specific tasks where in-context examples don\'t generalize well, or reducing latency/cost by making a smaller model perform like a larger one on a narrow task (distillation).',
      "Fine-tuning requires real MLOps: a labeled training dataset (often hundreds to thousands of examples), a held-out eval set to check it didn't regress on things it used to do well, and a plan for re-tuning when the underlying base model is upgraded.",
      "A practical decision path: is the problem \"the model doesn't know X\" → RAG. Is it \"the model doesn't do Y consistently despite clear instructions\" → try prompting improvements first, then fine-tuning if prompting plateaus. Is it \"we need this cheaper/faster at scale\" → consider fine-tuning a smaller model or distillation.",
    ],
    quiz: [
      {
        id: 'fine-tuning-q1',
        kind: 'mcq',
        prompt: 'Fine-tuning is best understood as a lever for changing:',
        options: [
          "The model's factual knowledge about frequently-changing information",
          "The model's default behavior, style, or output format, learned from example data",
          'The size of the context window',
          "The customer's underlying data storage system",
        ],
        correctIndex: 1,
        explanation:
          "Fine-tuning shapes behavior/style baked into the weights. For frequently-changing facts, RAG is the right tool since fine-tuning would require constant retraining.",
        xp: 20,
      },
      {
        id: 'fine-tuning-q2',
        kind: 'mcq',
        prompt: 'A customer says "the model needs to know about our product catalog, which changes daily." What should you likely recommend over fine-tuning?',
        options: [
          'Fine-tune the model every single day on the new catalog',
          'Use RAG so the catalog is retrieved fresh at query time instead of baked into weights',
          'Increase temperature',
          'Ignore the daily changes and fine-tune once a year',
        ],
        correctIndex: 1,
        explanation:
          "Daily-changing knowledge is a textbook RAG use case. Fine-tuning for content that changes this fast would mean constant retraining, which is far more costly and slower to update than retrieval.",
        xp: 20,
      },
      {
        id: 'fine-tuning-q3',
        kind: 'mcq',
        prompt: 'Which scenario is a genuinely good candidate for fine-tuning?',
        options: [
          'Injecting today\'s stock prices into responses',
          'Consistently applying a very specific, hard-to-specify-in-a-prompt output style across thousands of generations, where prompting has plateaued',
          'Adding a single new fact to the model',
          'Making the model remember a specific past conversation',
        ],
        correctIndex: 1,
        explanation:
          'Fine-tuning shines when consistent behavior is needed at scale and can\'t be reliably achieved through prompting alone — not for fresh facts or memory, which are different problems entirely.',
        xp: 20,
      },
      {
        id: 'fine-tuning-q4',
        kind: 'mcq',
        prompt: 'What should always accompany a fine-tuning effort?',
        options: [
          'Nothing extra — just the training data',
          'A held-out evaluation set to check the fine-tuned model didn\'t regress on things it used to handle well',
          'Disabling all prompting entirely, since fine-tuning replaces it',
          'A guarantee that the base model will never be upgraded',
        ],
        correctIndex: 1,
        explanation:
          "Fine-tuning can cause regressions on capabilities outside the training distribution. A held-out eval set catches this before it reaches production, and you should expect to re-tune when the base model changes.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'fine-tuning-challenge',
      prompt:
        'A customer insists "we need to fine-tune the model on our whole knowledge base." In 2-3 sentences, how do you respond and what would you clarify first?',
      hint: 'Separate the "knowledge" need from the "behavior" need.',
      modelAnswer:
        "I'd first clarify what specific problem they're trying to solve — usually \"fine-tune on our knowledge base\" actually means \"the model should answer questions using our documents,\" which is a RAG problem, not a fine-tuning problem, since a knowledge base is exactly the kind of large, evolving factual content that's expensive and slow to bake into weights. I'd propose starting with RAG (faster, cheaper, easier to keep current) and only consider fine-tuning afterward if there's a separate, well-defined behavior/style problem that RAG and prompting can't solve.",
      xp: 15,
    },
  },
  {
    id: 'deployment',
    tier: 5,
    requiredLevel: 5,
    title: 'Deploying & Scaling AI Systems',
    tagline: 'From a working notebook to a production pilot',
    icon: '🚀',
    fdeRelevance:
      "FDEs are judged on getting real systems into a customer's production environment, not just a slick demo. This is where reliability engineering meets AI.",
    lesson: [
      'LLM API calls are slower and less predictable than typical microservice calls — latency can range from under a second to tens of seconds, especially with long outputs or reasoning. Design for this: streaming responses to the user as tokens arrive dramatically improves perceived latency even when total time is unchanged.',
      "Rate limits and quota are a real constraint in production, not just local dev. Build retry logic with exponential backoff for transient errors (429s, timeouts), and consider request queuing or batching for high-volume workloads instead of assuming unlimited throughput.",
      'Cost scales with tokens, not requests — a system that "usually" sends short prompts can spike in cost dramatically if a single upstream change (e.g. a bigger retrieved context, verbose system prompt) increases per-request tokens. Track cost per request as a first-class metric, not an afterthought at the end of the month.',
      "Caching matters more for LLM systems than typical CRUD apps: repeated or near-duplicate prompts (e.g. the same system prompt + tool schema on every call) can benefit from prompt caching features that cut latency and cost when supported by the provider.",
      "Have a fallback plan for provider outages or degraded model performance: a secondary model, a cached/last-known-good response, or graceful degradation (e.g. falling back to keyword search if the LLM call fails) rather than a hard failure the customer sees directly.",
    ],
    quiz: [
      {
        id: 'deployment-q1',
        kind: 'mcq',
        prompt: 'Why is streaming responses to the user often recommended for LLM-backed products?',
        options: [
          'It reduces the total tokens generated',
          'It improves perceived latency by showing output as it\'s generated, even when total generation time is unchanged',
          'It is required by every LLM API',
          'It eliminates the need for error handling',
        ],
        correctIndex: 1,
        explanation:
          "Streaming doesn't make generation faster in total, but showing tokens as they arrive makes the wait feel dramatically shorter to the user — a real UX win for a genuinely slower call pattern.",
        xp: 20,
      },
      {
        id: 'deployment-q2',
        kind: 'mcq',
        prompt: 'A production system occasionally hits API rate limits under load. What is the standard mitigation?',
        options: [
          'Ignore the errors, they resolve themselves',
          'Implement retry logic with exponential backoff, and consider request queuing for high-volume workloads',
          'Immediately fail the request permanently with no retry',
          'Increase temperature to speed up generation',
        ],
        correctIndex: 1,
        explanation:
          "Rate limit errors are usually transient. Exponential backoff retries (and queuing/batching at scale) handle them gracefully instead of surfacing hard failures to users.",
        xp: 20,
      },
      {
        id: 'deployment-q3',
        kind: 'mcq',
        prompt: 'Why should cost per request be tracked as a first-class production metric?',
        options: [
          'Cost is fixed per request regardless of content, so it doesn\'t need tracking',
          'Cost scales with tokens, so an increase in prompt/context size (e.g. bigger retrieved context) can spike costs even with the same number of requests',
          'Only end-of-month totals matter, not per-request figures',
          'Providers cap total spend automatically, so tracking is unnecessary',
        ],
        correctIndex: 1,
        explanation:
          "Since cost is driven by token volume, an upstream change that grows prompts (more retrieved context, verbose instructions) can silently blow up spend even if request counts stay flat — worth monitoring in real time.",
        xp: 20,
      },
      {
        id: 'deployment-q4',
        kind: 'mcq',
        prompt: 'A good production fallback strategy for an LLM outage or degraded model performance includes:',
        options: [
          'Letting the user see a raw stack trace',
          'A secondary model, cached/last-known-good responses, or graceful degradation instead of a hard failure',
          'Retrying the exact same failing request forever with no backoff',
          'Nothing — outages are the provider\'s problem, not the FDE\'s',
        ],
        correctIndex: 1,
        explanation:
          "Production-grade systems plan for degraded dependencies. Graceful degradation (fallback model, cached answer, reduced functionality) keeps the customer-facing experience intact even when a core dependency has issues.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'deployment-challenge',
      prompt:
        'A pilot that worked fine with 5 test users starts timing out once 200 real users hit it concurrently. In 2-3 sentences, what would you check first?',
      hint: 'Think about what changes between 5 users and 200 — concurrency, rate limits, and queuing.',
      modelAnswer:
        "I'd first check whether the system is hitting provider rate limits or concurrency caps under real load, and whether requests are being retried/queued gracefully or just failing outright — 5 users rarely exposes throughput limits that 200 concurrent users will. I'd also check whether any per-request latency-heavy step (large retrieved context, sequential rather than parallel tool calls) is compounding under load, since what's tolerable serially can become a bottleneck at concurrency.",
      xp: 15,
    },
  },
  {
    id: 'data-pipelines',
    tier: 5,
    requiredLevel: 5,
    title: 'Data Pipelines for AI',
    tagline: 'Garbage in, garbage out — but at enterprise scale',
    icon: '🗂️',
    fdeRelevance:
      "Most of the actual effort in an FDE engagement is unglamorous: getting messy customer data into a state an AI system can use. This is where deals succeed or stall.",
    lesson: [
      "Enterprise data almost never arrives clean: it's scattered across PDFs, scanned images, wikis, spreadsheets with inconsistent schemas, and databases with undocumented quirks. Budget real time for ingestion and normalization — it is routinely the majority of the work, not a footnote before the 'real' AI work begins.",
      "Extraction quality compounds: if OCR or PDF parsing drops table structure or garbles text, every downstream step (chunking, embedding, retrieval, generation) inherits that error. When a RAG system performs badly, checking the raw extracted text (not just the final answer) is often the fastest way to find the real bug.",
      "ETL pipelines for AI need the same rigor as traditional data engineering: idempotent runs (rerunning shouldn't duplicate or corrupt data), incremental updates (don't reprocess the entire corpus for one changed document), and monitoring for silent failures (a scraper that starts returning empty pages is worse than one that errors loudly).",
      'Data governance is not optional in enterprise settings: access controls, PII handling, and data residency requirements often shape the architecture as much as the AI use case itself. Ask about these constraints early, not after building a pipeline that violates them.',
      "Version and snapshot your data pipeline outputs where practical (what did the index look like when this answer was generated) — when a customer reports a bad answer weeks later, being able to reconstruct exactly what was retrievable at that time is invaluable for debugging.",
    ],
    quiz: [
      {
        id: 'data-pipelines-q1',
        kind: 'mcq',
        prompt: 'In most real enterprise AI engagements, what typically consumes the majority of the effort?',
        options: [
          'Choosing which LLM model to use',
          'Ingesting, cleaning, and normalizing messy real-world data (PDFs, scans, inconsistent spreadsheets, etc.)',
          'Writing the system prompt',
          'Selecting a UI framework',
        ],
        correctIndex: 1,
        explanation:
          "Data wrangling is unglamorous but dominant. Enterprise data is rarely clean, and getting it into a usable state is usually the real bottleneck, not model selection or prompting.",
        xp: 20,
      },
      {
        id: 'data-pipelines-q2',
        kind: 'mcq',
        prompt: 'A RAG system gives bad answers. Before assuming it\'s a prompting or model issue, what\'s a fast, high-value check?',
        options: [
          'Immediately switch to a bigger LLM',
          'Inspect the raw extracted text from the source documents to rule out OCR/parsing errors upstream',
          'Increase the number of retrieved chunks without checking anything else',
          'Rewrite the entire prompt from scratch blindly',
        ],
        correctIndex: 1,
        explanation:
          "Extraction errors compound downstream through every later step. Checking the raw extracted text is a cheap way to rule out (or find) the real root cause before touching prompting or model choice.",
        xp: 20,
      },
      {
        id: 'data-pipelines-q3',
        kind: 'mcq',
        prompt: 'Why should ETL pipelines for AI support incremental updates rather than always reprocessing the full corpus?',
        options: [
          "It doesn't matter, full reprocessing is always just as efficient",
          "Reprocessing everything for one changed document wastes time/cost and doesn't scale as the corpus grows",
          'Incremental updates are only relevant for keyword search, not vector search',
          'Full reprocessing is required for compliance reasons',
        ],
        correctIndex: 1,
        explanation:
          "As a corpus grows, reprocessing everything for a single changed document becomes prohibitively slow and expensive — incremental/targeted updates keep pipelines scalable.",
        xp: 20,
      },
      {
        id: 'data-pipelines-q4',
        kind: 'mcq',
        prompt: 'Why should data governance (access controls, PII handling, residency) be discussed early in a project, not after the pipeline is built?',
        options: [
          'It never actually affects system architecture',
          'These constraints often shape what the architecture can even look like, so discovering them late can force a costly rebuild',
          'Governance only matters for government customers',
          'It is purely a legal team concern with no engineering impact',
        ],
        correctIndex: 1,
        explanation:
          "Data governance requirements can determine where data can live, how it can be processed, and what a compliant architecture even looks like — surfacing them early avoids rebuilding a pipeline that violates them.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'data-pipelines-challenge',
      prompt:
        'Three weeks into a pilot, a customer reports that a chatbot gave a wrong answer, but the underlying documents have since been updated twice. In 2-3 sentences, why does this matter and what would help?',
      hint: 'Think about being able to reconstruct historical system state.',
      modelAnswer:
        "Without a snapshot of what was indexed/retrievable at the time the answer was generated, it's very hard to tell whether the answer was wrong given the data available then, or whether it's since been fixed by the document updates — this matters both for debugging and for explaining the issue credibly to the customer. Versioning or snapshotting the index (or at minimum logging exactly which document versions were retrieved for each answer) would let you reconstruct the historical state and diagnose the real cause instead of guessing.",
      xp: 15,
    },
  },
  {
    id: 'ai-safety',
    tier: 6,
    requiredLevel: 6,
    title: 'AI Safety, Guardrails & Governance',
    tagline: 'Shipping systems that fail safely, not silently',
    icon: '🛡️',
    fdeRelevance:
      "Enterprise customers, especially in regulated industries, will not sign off on a pilot without a credible safety and governance story. This is frequently the difference between a demo and a deployed system.",
    lesson: [
      "Hallucination isn't a bug you eliminate, it's a property you manage: grounding (RAG with citations), structured output validation, and confidence signaling (letting the system say \"I don't know\" or defer to a human) all reduce harm without pretending the risk is zero.",
      'Guardrails operate at multiple layers: input filtering (blocking prompt injection attempts or disallowed requests before they reach the model), output filtering (checking generated content against policy before showing it to a user), and behavioral constraints enforced in code (never relying solely on "please don\'t do X" in the system prompt for anything safety-critical).',
      'Prompt injection is a real, practical risk once a system processes untrusted external content (web pages, emails, uploaded documents) — an attacker can hide instructions in that content aimed at hijacking the model\'s behavior. Treat any retrieved or user-supplied content as data, never as trusted instructions, and design tool permissions assuming the model might be manipulated.',
      "Human-in-the-loop isn't a temporary crutch to remove as soon as possible — it's a deliberate architecture decision based on the reversibility and blast radius of an action, and for some actions (financial transactions, legal commitments, irreversible deletions) it may be the permanent right answer, not just a v1 safety net.",
      "Governance in enterprise settings usually means: audit logs of what the system did and why, clear escalation paths when the system is uncertain, and documented boundaries of what the system is and isn't allowed to do — this paperwork is often what actually unblocks a production sign-off, not additional model capability.",
    ],
    quiz: [
      {
        id: 'ai-safety-q1',
        kind: 'mcq',
        prompt: 'What is the most realistic framing of hallucination risk in a production LLM system?',
        options: [
          'It can be fully eliminated with the right prompt',
          "It's a property to manage via grounding, validation, and confidence signaling — not a risk you can reduce to zero",
          'It only happens with smaller/older models',
          'It is irrelevant if the system has a nice UI',
        ],
        correctIndex: 1,
        explanation:
          "Treating hallucination as fully solvable sets up false expectations. The realistic goal is reducing frequency and impact through grounding, validation, and letting the system defer when uncertain.",
        xp: 20,
      },
      {
        id: 'ai-safety-q2',
        kind: 'mcq',
        prompt: 'Why shouldn\'t safety-critical behavioral constraints rely solely on system prompt instructions like "never do X"?',
        options: [
          'System prompts are always ignored entirely',
          'Prompt-only instructions can be bypassed (e.g. via prompt injection) and aren\'t a reliable enforcement mechanism for anything safety-critical',
          'System prompts cost too many tokens to be practical',
          "It's actually fine to rely solely on prompts for safety-critical behavior",
        ],
        correctIndex: 1,
        explanation:
          "Prompted instructions are a strong nudge but not a guarantee — safety-critical constraints need enforcement in code (validation, permissions, hard limits), with prompting as a complement, not the sole mechanism.",
        xp: 20,
      },
      {
        id: 'ai-safety-q3',
        kind: 'mcq',
        prompt: 'A system summarizes emails, some of which are from untrusted external senders. What risk should you specifically design against?',
        options: [
          'The emails using too many tokens',
          'Prompt injection — hidden instructions in the email content attempting to hijack the model\'s behavior or tool use',
          'The emails being written in a foreign language',
          'The summarization being too short',
        ],
        correctIndex: 1,
        explanation:
          "Any untrusted external content processed by the model is a potential prompt injection vector. Treat such content strictly as data to summarize/analyze, never as instructions to follow, and scope tool permissions accordingly.",
        xp: 20,
      },
      {
        id: 'ai-safety-q4',
        kind: 'mcq',
        prompt: 'For an irreversible, high-stakes action (e.g. a legal commitment), what is the right default for human-in-the-loop?',
        options: [
          'Remove it as soon as the model demonstrates reasonable accuracy',
          'It may be the permanent right architecture, chosen based on reversibility and blast radius, not just a temporary v1 safety net',
          'Human-in-the-loop is never appropriate for AI systems',
          'It should be decided solely by the model itself at runtime',
        ],
        correctIndex: 1,
        explanation:
          "For sufficiently irreversible/high-stakes actions, permanent human oversight can be the correct long-term architecture, not merely training wheels to remove once the model looks good enough.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'ai-safety-challenge',
      prompt:
        'A regulated-industry customer asks "how do we know the AI won\'t do something we didn\'t intend?" In 2-3 sentences, what elements of your answer would give them real confidence (beyond "the model is very accurate")?',
      hint: 'Think layered guardrails, logging, and reversibility — not just model quality.',
      modelAnswer:
        "I'd point to layered guardrails rather than model accuracy alone: input/output filtering, hard-coded permission boundaries on what tools can do regardless of what the model requests, and human-in-the-loop for irreversible or high-stakes actions. I'd also emphasize audit logging of every decision and action taken so any unexpected behavior can be traced, reviewed, and used to tighten the guardrails — giving them a concrete answer for both prevention and post-hoc accountability, not just a confidence claim about the model.",
      xp: 15,
    },
  },
  {
    id: 'fde-mindset',
    tier: 6,
    requiredLevel: 6,
    title: 'The FDE Mindset',
    tagline: 'Translating ambiguous business problems into shipped systems',
    icon: '🎯',
    fdeRelevance:
      "This is the actual job description. Technical AI knowledge is necessary but not sufficient — the differentiator is turning a vague customer pain point into a scoped, working, trusted deployment, fast.",
    lesson: [
      'Forward Deployed Engineers embed directly with customers, often on-site or in tight collaboration, to build working software against real, messy, high-stakes problems — the opposite of building a generic product in isolation and hoping it fits every customer.',
      'The first and hardest skill is problem translation: a customer says "we need AI to help with X," but X is usually a symptom, not a spec. Your job is to ask enough questions to find the actual bottleneck (Is it a data problem? A process problem? A trust problem? Only sometimes is it genuinely a model capability problem) before writing code.',
      'Speed to a working prototype matters more than architectural elegance in the early stages of an engagement — a rough, honest prototype in front of real users this week teaches you more than a beautifully designed system three weeks from now. But "rough prototype" and "production system" are different deliverables; be explicit with the customer about which one you\'re showing them.',
      "Trust is built incrementally, not declared: show a working slice on real (or realistic) customer data early, be honest about current limitations, and expand scope as confidence is earned. Overpromising capability in week one is the single most common way FDE engagements lose credibility later.",
      "You are simultaneously the engineer and the interface to the customer's actual constraints (their data, their compliance requirements, their existing systems, their organizational politics). Part of the job is pulling those constraints into the design early, rather than building the technically ideal system and discovering afterward it can't be deployed.",
    ],
    quiz: [
      {
        id: 'fde-mindset-q1',
        kind: 'mcq',
        prompt: 'What most distinguishes a Forward Deployed Engineer role from a typical product engineering role?',
        options: [
          'FDEs never write code, only give presentations',
          'FDEs embed directly with customers to build working software against real, specific, often messy problems, rather than a generic product for a broad market',
          'FDEs only work on internal tools',
          'FDEs exclusively focus on model research, not applied engineering',
        ],
        correctIndex: 1,
        explanation:
          "The defining trait of FDE work is direct, close-in engagement with a specific customer's real problems and constraints — building and adapting rapidly rather than shipping a one-size-fits-all product.",
        xp: 20,
      },
      {
        id: 'fde-mindset-q2',
        kind: 'mcq',
        prompt: 'A customer says "we need AI to help with X." What should you do first?',
        options: [
          'Immediately start building whatever "AI for X" sounds like',
          'Ask enough questions to find the actual underlying bottleneck — it may be a data, process, or trust problem, not purely a model capability gap',
          'Tell them AI cannot help and suggest they hire more staff',
          'Assume X is exactly and only a prompting problem',
        ],
        correctIndex: 1,
        explanation:
          "\"We need AI to help with X\" is a symptom description, not a spec. Problem translation — finding the real bottleneck — is the highest-leverage early step, and skipping it leads to solving the wrong problem well.",
        xp: 20,
      },
      {
        id: 'fde-mindset-q3',
        kind: 'mcq',
        prompt: 'Why is it important to be explicit with a customer about whether something is a "rough prototype" versus a "production system"?',
        options: [
          "It isn't important, all deliverables should look identical",
          'Conflating the two sets the wrong expectations about reliability, and overpromising capability early is a common way engagements lose credibility',
          'Prototypes are always more reliable than production systems',
          'Customers never care about this distinction',
        ],
        correctIndex: 1,
        explanation:
          "A fast, honest prototype is valuable precisely because it's honest about being a prototype. Presenting it as production-ready sets expectations you likely can't meet yet, and erodes trust when limitations surface.",
        xp: 20,
      },
      {
        id: 'fde-mindset-q4',
        kind: 'mcq',
        prompt: 'Why should a customer\'s real-world constraints (compliance, existing systems, data access) be pulled into the design early rather than discovered later?',
        options: [
          'They never actually affect what can be built',
          'Discovering them after building the "technically ideal" system often means it can\'t actually be deployed, wasting the work',
          'Compliance constraints only apply after a system is fully shipped',
          'Constraints should always be the customer\'s problem to solve alone, unrelated to the engineering',
        ],
        correctIndex: 1,
        explanation:
          "An FDE is effectively designing within the customer's real environment, not a green field. Surfacing constraints early avoids building something elegant but undeployable.",
        xp: 20,
      },
    ],
    challenge: {
      id: 'fde-mindset-challenge',
      prompt:
        'A customer stakeholder says: "Just make it work like ChatGPT but for our internal data." In 2-3 sentences, how would you turn this into a scoped first conversation?',
      hint: 'Think about the underlying need, success criteria, and constraints, not the surface request.',
      modelAnswer:
        "I'd treat \"like ChatGPT but for our data\" as a starting point, not a spec, and ask what specific tasks people currently struggle to do without it (e.g. finding a policy answer, drafting a report, searching past cases) to identify 2-3 concrete, testable use cases rather than a vague general assistant. I'd also ask early about data access, sensitivity/compliance constraints, and what \"working\" would need to look like for them to trust it — since those answers determine whether this is primarily a RAG problem, a tool-integration problem, or something else entirely.",
      xp: 15,
    },
  },
]

export const XP_PER_LEVEL = 150

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL
}

export function totalPossibleXp(): number {
  return topics.reduce((sum, t) => {
    const quizXp = t.quiz.reduce((s, q) => s + q.xp, 0)
    return sum + quizXp + t.challenge.xp
  }, 0)
}
