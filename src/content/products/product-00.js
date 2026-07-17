const project = {
  id: "prod-00",
  title: "How to Build with AI: The Playbook",
  description:
    "A warm-up before the build track. Learn the loop every AI product follows, set up Python and a free API key once, pick a starter tech stack you can reuse for every project, and see how each guide is laid out. By the end nothing in the track feels unfamiliar.",
  difficulty: "beginner",
  category: "foundations",
  estimated_time: 75,
  lessons_count: 7,
  tags: ["setup", "workflow", "python", "api-key", "tech-stack", "getting-started"],
  order: 100,
  cover_image: "",
  track: "ai",
  kind: "product",
  optional: true,
};

const lessons = [
  {
    id: "prod-00-1",
    project_id: "prod-00",
    order: 1,
    title: "Every AI Product Is the Same Loop",
    concept: "the build loop",
    illustrative: true,
    explanation:
      "Before you build twenty-two products, learn the one shape they all share. Every AI product, from a text summarizer to a research agent, is the same six-step loop wearing different clothes.\n\n## The loop\n\n1. **Input**: get something from the user. Text, a file, an image, a question.\n2. **Prompt**: turn that input into clear instructions for the model.\n3. **Call**: send it to the model and wait for a reply.\n4. **Parse**: pull the useful part out of the reply. A summary, a JSON object, an answer.\n5. **Verify**: check the reply is good, and retry or repair it if it isn't.\n6. **Ship**: do something real with the result. Print it, save it, show it in a UI.\n\nThat's the whole skeleton. A chatbot loops steps 1 through 6 forever. A summarizer runs them once. A search app adds a lookup step between input and prompt. The shape underneath never changes.\n\n## Where projects differ\n\nBeginners get lost because every tutorial looks different on the surface. Once you can see the loop, every project collapses into one question: which step is the special one here? A vision app changes step 1, because the input is an image. A data-extraction tool changes step 4 and parses into JSON. An agent repeats steps 2 through 5 in a cycle. You are never learning a brand-new thing. You are swapping out one step of a loop you already know.\n\n## What a real deliverable means\n\nEvery guide in this track ends with something you can run and show. Not a quiz score. An artifact: a script, a tool, a small app. When you finish a project it gets saved to your **Portfolio** tab automatically. By the end you have a shelf of working things instead of a certificate.\n\n## The mental model to keep\n\nAn AI product is a plain program with one unusual function call in the middle. You already know how to read input, call a function, and print output. The model is just a very powerful, slightly unreliable function. The rest of this track is about how to call it well and how to handle it when it misbehaves.",
    key_terms: [
      { term: "The build loop", definition: "The six repeating steps every AI product follows: input, prompt, call, parse, verify, ship." },
      { term: "Deliverable", definition: "A runnable artifact you finish with. A script, tool, or small app, not a quiz score." },
      { term: "The model as a function", definition: "The mental model that treats an AI call as one powerful but unreliable function inside an ordinary program." },
    ],
    animated_diagrams: [
      {
        title: "The six-step loop",
        loop: true,
        caption: "Watch one request travel the loop. Every project you build is this same path with one step swapped out.",
        nodes: [
          { label: "Input", sub: "user gives you something", detail: "Text, a file, an image, or a question comes in from the user." },
          { label: "Prompt", sub: "write the instructions", detail: "Turn that raw input into clear instructions the model can follow." },
          { label: "Call", sub: "send to the model", detail: "Send the prompt over the network and wait for the reply." },
          { label: "Parse", sub: "extract the answer", detail: "Pull the useful part out of the reply: a summary, a JSON object, an answer." },
          { label: "Verify", sub: "is it good?", detail: "Check the reply. If it's malformed or wrong, retry or repair it." },
          { label: "Ship", sub: "do something real", detail: "Print it, save it, or show it in a UI. Then loop again if you need to." },
        ],
      },
    ],
    inline_quizzes: [
      {
        question: "An agent that repeats steps 2 through 5 in a cycle is changing what about the loop?",
        options: ["It invents a brand-new loop", "It repeats part of the same loop instead of running it once", "It skips the input step", "It removes the model call"],
        correct_index: 1,
        explanation: "An agent doesn't use a different loop. It runs the prompt, call, parse, verify steps over and over until the task is done.",
      },
    ],
  },
  {
    id: "prod-00-2",
    project_id: "prod-00",
    order: 2,
    title: "Set Up Once, Build Forever",
    concept: "environment and API key",
    illustrative: true,
    explanation:
      "You set this up one time, then stop thinking about it. The goal of this lesson is a single Python file that makes a real model call and prints a reply.\n\n## What you need\n\n- **Python 3.10 or newer** installed. Check with `python --version` in a terminal.\n- **A code editor**. VS Code is free and works well.\n- **An API key** from a model provider. This track uses simple HTTP calls, so any provider works. You paste your key once. The next lesson recommends a specific free one if you don't have a preference yet.\n\n## Install the basics\n\n```bash\npip install requests\n```\n\nThat's the only library you need to start. `requests` makes HTTP calls. Provider SDKs are convenient later, but plain HTTP shows you exactly what is going over the wire.\n\n## The one rule about keys: never hard-code them\n\nA key is a password that can spend money. Do **not** paste it into your code, where it can end up on GitHub for the world to find. Put it in an environment variable instead:\n\n```bash\nexport AI_API_KEY=\"your-key-here\"      # macOS / Linux\n```\n\nThen read it in Python:\n\n```python\nimport os\n\nkey = os.environ.get(\"AI_API_KEY\")\nif not key:\n    raise SystemExit(\"Set AI_API_KEY first.\")\nprint(\"Key loaded, length:\", len(key))\n```\n\nIf that prints a length instead of an error, you are ready. If it crashes, the variable isn't set in this terminal, so run the `export` line again.\n\n## Why bother\n\nHard-coded keys are the most common way beginners leak credentials and rack up surprise bills. Reading from the environment costs you three lines now and removes that whole class of problem. Every project in this track assumes your key lives in `AI_API_KEY`.",
    key_terms: [
      { term: "Environment variable", definition: "A value stored in your shell, not your code, so secrets like API keys stay out of your source files." },
      { term: "API key", definition: "A password that identifies you to a model provider and lets you spend against your account." },
    ],
    callouts: [
      { type: "warning", position: "after", title: "the number one beginner mistake", content: "Never paste your key straight into a .py file you might commit. A leaked key on GitHub can be found and abused within minutes. Keep it in AI_API_KEY and you never have to think about it again." },
    ],
    inline_quizzes: [
      {
        question: "Why read the key from an environment variable instead of writing it in your code?",
        options: ["It runs faster", "It keeps the secret out of files you might share or commit", "The model requires it", "It uses less memory"],
        correct_index: 1,
        explanation: "Keys in code leak. Keys in the environment stay off GitHub and out of screenshots.",
      },
    ],
  },
  {
    id: "prod-00-7",
    project_id: "prod-00",
    order: 3,
    title: "Your Starter Tech Stack: Pick This and Go",
    concept: "a simple stack you reuse everywhere",
    illustrative: true,
    explanation:
      "The fastest way to stall is to spend a week choosing tools. So here is one stack that is free, beginner-friendly, and enough to build every project in this track. Use it until you have a real reason to change. You can swap any single piece later without relearning the rest.\n\n## The stack, one line each\n\n- **Language: Python.** Every guide here is Python. It has the least ceremony and the most examples online.\n- **Model API: Groq (free).** Groq gives you a fast, capable model with no credit card to start. It speaks the standard OpenAI message format, so the code you learn here works against almost any provider later.\n- **Talking to the model: the `openai` library, pointed at Groq.** One small library, one base URL change, and you are calling a real model.\n- **UI (optional): Streamlit.** When you want a web page instead of a terminal, Streamlit turns a Python file into a shareable app with no HTML.\n- **Storage: plain files, then SQLite.** A JSON file is enough for most projects. The search and memory projects later use SQLite, which ships with Python.\n- **Hosting (optional): Streamlit Community Cloud.** Free, and it deploys straight from a GitHub repo when you want a live link.\n\n## Get the model call working\n\nSign up at groq.com, create an API key, and set it:\n\n```bash\nexport AI_API_KEY=\"your-groq-key\"\npip install openai\n```\n\nThen this is a complete, working AI program:\n\n```python\nimport os\nfrom openai import OpenAI\n\nclient = OpenAI(\n    api_key=os.environ[\"AI_API_KEY\"],\n    base_url=\"https://api.groq.com/openai/v1\",\n)\n\nresp = client.chat.completions.create(\n    model=\"llama-3.3-70b-versatile\",\n    messages=[{\"role\": \"user\", \"content\": \"Say hello in one short sentence.\"}],\n)\nprint(resp.choices[0].message.content)\n```\n\nRun it. If a sentence prints, your whole stack works. That `client` and that `create` call are the one unusual function from lesson 1. Everything else you build wraps around it.\n\n## Adding a UI later, in about five lines\n\nWhen a project is worth a web page, you don't need a front-end framework:\n\n```python\nimport streamlit as st\n\nprompt = st.text_input(\"Ask me anything\")\nif prompt:\n    st.write(ask_model(prompt))   # your loop from earlier\n```\n\n`streamlit run app.py` opens it in a browser. That's the entire UI story for this track.\n\n## Why this specific stack\n\nEvery piece is free to start, every piece is popular enough that errors are one search away, and none of them lock you in. The model format is the industry standard, Python is the most documented language, and Streamlit skips the hardest part of web apps. Pick it, stop deliberating, and spend your energy on the actual product.",
    key_terms: [
      { term: "OpenAI-compatible API", definition: "A common request format many providers accept, so code written for one often works against others by changing only the base URL." },
      { term: "Base URL", definition: "The address your library sends requests to. Point it at Groq, and the same code calls Groq instead of OpenAI." },
      { term: "Streamlit", definition: "A Python library that turns a script into a shareable web app without writing HTML or JavaScript." },
    ],
    animated_diagrams: [
      {
        title: "How the pieces fit together",
        caption: "Your code sits in the middle. The provider does the thinking, and an optional UI shows the result.",
        nodes: [
          { label: "You (Python)", sub: "your program", detail: "Your Python file holds the loop: read input, build the prompt, handle the reply." },
          { label: "openai lib", sub: "the messenger", detail: "The library packages your prompt and sends it over HTTP." },
          { label: "Groq API", sub: "the model", detail: "Groq runs the model and sends a reply back, all for free to start." },
          { label: "Streamlit", sub: "optional UI", detail: "When you want a web page, Streamlit shows the result without any HTML." },
        ],
      },
    ],
    callouts: [
      { type: "tip", position: "after", title: "you can swap any one piece", content: "Prefer a different provider? Change the base URL and model name. Prefer a plain terminal? Skip Streamlit. The stack is a default, not a cage. The point is to stop choosing and start building." },
    ],
    inline_quizzes: [
      {
        question: "You learned the code against Groq but later want to use a different provider. What usually has to change?",
        options: ["The whole program is rewritten", "Mostly the base URL and model name", "Python itself", "Nothing can change"],
        correct_index: 1,
        explanation: "Because the message format is a shared standard, switching providers is usually a base URL and model name change, not a rewrite.",
      },
    ],
  },
  {
    id: "prod-00-3",
    project_id: "prod-00",
    order: 4,
    title: "How to Read a Project Guide",
    concept: "the 8-lesson structure",
    illustrative: true,
    explanation:
      "Every build guide in this track has the same eight-lesson shape. Learn the shape and you always know where you are and what comes next.\n\n## The arc of a project\n\n- **Lessons 1 and 2, Setup:** the smallest version that does one real thing. You get an early win.\n- **Lessons 3 to 5, Core:** the actual product logic, one piece at a time.\n- **Lessons 6 and 7, Harden:** the boring part that keeps it working: errors, edge cases, cost.\n- **Lesson 8, Ship:** package it, run it for real, and it lands in your Portfolio.\n\nThe momentum is deliberate. A rough thing that works early, a real thing that works well by the end.\n\n## What's in each lesson\n\n- **Explanation**: the concept and the plan, in plain language. Read this first.\n- **Starter code**: a scaffold with `TODO`s. You fill the gaps.\n- **Solution code**: the worked answer. Peek if stuck, but don't copy it blind.\n- **Hints**: nudges for when you're close but not quite there.\n- **Challenge**: a small graded problem that proves you understood before you move on.\n\n## How to actually use it\n\n1. Read the explanation once, top to bottom, no coding.\n2. Open the starter and try the `TODO`s from memory.\n3. Stuck for more than a few minutes? Read one hint, not the whole solution.\n4. Run it. Broken output teaches faster than a correct explanation.\n5. Do the challenge. If it passes, you earned the next lesson.\n\n## Getting unstuck\n\nWhen something breaks, read the error's **last line** first. It usually names the problem. Then print the thing right before it fails. Nine times out of ten the model returned a slightly different shape than you expected, and one `print()` shows you exactly what.",
    animated_diagrams: [
      {
        title: "The shape of every project",
        caption: "Each guide climbs the same four stages. You always know which stage you're in.",
        nodes: [
          { label: "Setup", sub: "lessons 1-2", detail: "The smallest thing that works. An early win to build on." },
          { label: "Core", sub: "lessons 3-5", detail: "The real product logic, added one piece at a time." },
          { label: "Harden", sub: "lessons 6-7", detail: "Errors, edge cases, and cost. The part that makes it reliable." },
          { label: "Ship", sub: "lesson 8", detail: "Package it, run it for real, and it lands in your Portfolio." },
        ],
      },
    ],
    inline_quizzes: [
      {
        question: "You've been stuck on a TODO for five minutes. What's the recommended next move?",
        options: ["Copy the full solution", "Read one hint", "Skip the lesson", "Restart the project"],
        correct_index: 1,
        explanation: "Hints are staged on purpose. One nudge usually unblocks you without spoiling the whole answer.",
      },
    ],
  },
  {
    id: "prod-00-4",
    project_id: "prod-00",
    order: 5,
    title: "The Reusable Prompt Skeleton",
    concept: "writing prompts for products",
    illustrative: true,
    explanation:
      "A prompt inside a product is not a chat message. It's a function's instructions. It runs a thousand times on inputs you'll never see, so it has to be precise and a little boring. Here's a skeleton you'll reuse in almost every project.\n\n## System vs user\n\nMost APIs take two kinds of message:\n\n- **System**: the standing rules. Who the model is, what to do, what format to return. Set once.\n- **User**: the actual input for this run.\n\nSeparate them and you write the rules once, then swap only the input each call.\n\n## The skeleton\n\n```python\nSYSTEM = \"\"\"You are a {role}.\nYour job: {task}.\nRules:\n- {constraint 1}\n- {constraint 2}\nReturn: {exact output format}.\"\"\"\n\ndef build_messages(user_input):\n    return [\n        {\"role\": \"system\", \"content\": SYSTEM},\n        {\"role\": \"user\", \"content\": user_input},\n    ]\n```\n\nFill the braces per product. A summarizer's `task` is \"summarize the text in 3 sentences.\" An extractor's `Return` is \"a JSON object with keys name, email, phone.\"\n\n## The rules that fix most bad output\n\n1. **Say the format exactly.** \"Return JSON\" beats \"give me the data.\" \"Three bullet points\" beats \"be concise.\"\n2. **Show, don't just tell.** One tiny example in the system prompt is worth a paragraph of rules.\n3. **Constrain the scope.** \"If the text has no email, return null\" stops the model from inventing one.\n\n## Why specific prompts win\n\nVague prompts fail silently. The model returns something plausible that breaks your parsing step. A specific prompt is the cheapest reliability you'll ever buy. When a project later says \"write the system prompt,\" reach for this skeleton first.",
    key_terms: [
      { term: "System prompt", definition: "The standing instructions set once per product: the model's role, its task, and the exact output format." },
      { term: "User message", definition: "The specific input for a single run, swapped in each time while the system prompt stays fixed." },
    ],
    animated_diagrams: [
      {
        title: "System stays, user changes",
        caption: "The system prompt is written once. Only the user message changes each call.",
        nodes: [
          { label: "System", sub: "written once", detail: "Role, task, rules, and exact output format. You set this a single time." },
          { label: "User", sub: "new each call", detail: "The actual input for this run. This is the only part that changes." },
          { label: "Model", sub: "follows both", detail: "The model reads the fixed rules plus this run's input and replies in the format you asked for." },
        ],
      },
    ],
    inline_quizzes: [
      {
        question: "Which prompt is more reliable inside a product?",
        options: ["\"Give me the data\"", "\"Return a JSON object with keys name and email, or null if missing\"", "\"Be helpful\"", "\"Do your best\""],
        correct_index: 1,
        explanation: "The exact one. Naming the format and the empty case stops the model from inventing data or breaking your parser.",
      },
    ],
  },
  {
    id: "prod-00-5",
    project_id: "prod-00",
    order: 6,
    title: "From Script to Tool: Handling Reality",
    concept: "errors, retries, cost",
    illustrative: true,
    explanation:
      "A script works once on your machine. A tool works every time, on inputs you didn't expect. Closing that gap is this lesson, and it's why every guide has a harden section.\n\n## Three things that will go wrong\n\n1. **The network fails.** Calls time out or return errors. Wrap them and retry.\n2. **The output is malformed.** You asked for JSON, and the model wrapped it in chatty text or a code fence. Parse defensively.\n3. **It costs money.** Every call spends tokens. Long inputs and long histories add up.\n\n## A safe call\n\n```python\nimport json, time\n\ndef safe_json_call(call_fn, retries=2):\n    for attempt in range(retries + 1):\n        text = call_fn()\n        try:\n            start = text.index(\"{\")\n            end = text.rindex(\"}\") + 1\n            return json.loads(text[start:end])\n        except (ValueError, json.JSONDecodeError):\n            if attempt == retries:\n                raise\n            time.sleep(1)\n```\n\nThis does two jobs at once. It retries on failure, and it pulls out the JSON object even when the model added text around it. You'll reuse this pattern constantly.\n\n## Watching cost\n\nA rough rule: one token is about four characters. Before shipping, ask how big your input is and how often it runs. A tool that resends a huge document on every call is a tool with a big bill. Later projects trim, cache, and summarize to keep cost sane. For now, just know that length equals money.\n\n## The mindset\n\nAssume the model will sometimes return garbage and the network will sometimes drop. A good AI product fails politely and recovers instead of falling over. Every `try/except` you add is the difference between a demo and a tool someone can rely on.",
    key_terms: [
      { term: "Retry", definition: "Calling again after a failure, usually with a short pause, so a single dropped request doesn't crash your tool." },
      { term: "Defensive parsing", definition: "Extracting the part you need even when the reply has extra text around it, instead of trusting a perfect format." },
      { term: "Token", definition: "The unit a model bills by. Roughly four characters. More text in and out means more cost." },
    ],
    animated_diagrams: [
      {
        title: "A call that survives reality",
        loop: true,
        caption: "The call runs, the reply gets checked, and a bad one loops back for a retry instead of crashing.",
        nodes: [
          { label: "Call", sub: "send it", detail: "Send the request to the model over the network." },
          { label: "Check", sub: "did it work?", detail: "Did the network respond? Is the JSON valid? Decide before trusting it." },
          { label: "Retry", sub: "if it failed", detail: "On failure, pause a moment and try again, up to a limit." },
          { label: "Return", sub: "clean result", detail: "Once you have a good reply, pull out the part you need and return it." },
        ],
      },
    ],
    callouts: [
      { type: "insight", position: "after", title: "length equals money", content: "One token is about four characters. A tool that resends a whole document on every call quietly runs up a bill. Watch how much text you send, not just how many calls you make." },
    ],
    inline_quizzes: [
      {
        question: "The model returns your JSON wrapped in a code fence and a sentence of chatter. What handles this best?",
        options: ["Crash and tell the user to try again", "Slice from the first { to the last } before parsing", "Ask the model to apologize", "Ignore the reply"],
        correct_index: 1,
        explanation: "Defensive parsing pulls the object out of the surrounding text, so a chatty reply still works.",
      },
    ],
  },
  {
    id: "prod-00-6",
    project_id: "prod-00",
    order: 7,
    title: "Ship It, and It Lands in Your Portfolio",
    concept: "finishing and shipping",
    illustrative: true,
    explanation:
      "The last lesson of every project is ship, and finishing it does something real. The project gets saved to your **Portfolio** tab. This lesson is about what done means and how to make your builds show well.\n\n## What shipped means here\n\nYou don't need a fancy deployment for most projects. Shipped means:\n\n1. It runs from a clean start with one command.\n2. It handles an empty or weird input without crashing.\n3. Someone else could use it from your instructions alone.\n\nIf those three are true, it's a real deliverable.\n\n## Your Portfolio\n\nWhen you complete the final lesson of a build guide, Compilearn records it in your Portfolio with the project's title and what you built. Over the track this becomes a visible shelf of working products: your summarizer, your chatbot, your search app, your deployed capstone. That shelf is the point of this track. A score is forgettable. A portfolio of things you built is not.\n\n## Make each build show well\n\n- Keep a one-line description of what it does and who it's for.\n- Save an example input and its output as proof it works.\n- For the projects that produce a web app or an endpoint, keep the link. It becomes your live demo.\n\n## You're ready\n\nYou know the loop. Your key is set and your stack is chosen. You know how each guide is laid out, you have a prompt skeleton, and you know how to make a script survive contact with reality. That's the whole framework. Everything from here is applying it to build one real thing at a time. Pick the first project and go. You are not being dropped in the deep end. You've got the playbook.",
    animated_diagrams: [
      {
        title: "What counts as shipped",
        caption: "Three checks, then it's a real deliverable in your Portfolio.",
        nodes: [
          { label: "Runs clean", sub: "one command", detail: "It starts from scratch with a single command, no manual fiddling." },
          { label: "Survives", sub: "weird input", detail: "An empty or strange input doesn't crash it." },
          { label: "Usable", sub: "by someone else", detail: "A stranger could run it from your instructions alone." },
          { label: "Portfolio", sub: "saved for good", detail: "All three true? It lands on your Portfolio shelf as proof you built it." },
        ],
      },
    ],
    inline_quizzes: [
      {
        question: "Which of these makes a project count as shipped in this track?",
        options: ["It has a thousand users", "It runs from a clean start, survives odd input, and someone else could use it", "It uses the newest model", "It has no comments"],
        correct_index: 1,
        explanation: "Shipped here means reliable and usable by someone else, not famous. Those three checks are the bar.",
      },
    ],
  },
];

export default { project, lessons };
