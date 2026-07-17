export default {
  project: {
    id: "prod-22",
    title: "Ship & Monitor an LLM App (Capstone)",
    description:
      "The capstone build. You take your model-calling code, wrap it in a real HTTP endpoint, deploy it, and add structured logging, per-call cost tracking, and a usage dashboard. By the end you have a live LLM service that logs what it does, catches its own failures, and refuses to blow past a budget. Not a script that worked once on your laptop.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 140,
    lessons_count: 8,
    tags: ["deployment", "observability", "cost-tracking", "dashboards", "fastapi", "capstone"],
    order: 122,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
  {
    id: "prod-22-1",
    project_id: "prod-22",
    order: 1,
    title: "Package the Model Call as One Function",
    concept: "packaging for deployment",
    explanation: `Every project you've built so far has been a script. You run it, you watch the terminal, you're done. Shipping is different. Someone else's browser or curl command hits a URL and your code has to answer without you standing next to it. The first move toward that is packaging. You pull every place that calls the model into one function with one job, so the rest of your app (a route, a CLI, a test) calls that function and never touches the API directly.

## What packaging means here

Right now your model-calling code is probably scattered around: a system prompt in one spot, a \`client.messages.create(...)\` in another, some parsing after it. Packaging collects all of that into a single entry point, usually named something like \`handle_request\`, that takes one plain dict in and returns one plain dict out. Everything downstream (a web route, a test, a CLI) calls this one function and never touches the Anthropic client.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def call_model(prompt, max_tokens=300):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )
    return resp.content[0].text

def handle_request(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "error": "missing prompt"}
    max_tokens = payload.get("max_tokens", 300)
    reply = call_model(prompt, max_tokens)
    return {"ok": True, "reply": reply}
\`\`\`

## Why one entry point matters

Every layer you add for the rest of this capstone wraps around \`handle_request\`: the web route in the next lesson, the logger, the cost calculator, the budget guard. If your model call is scattered across five files, you patch five places every time you add a feature. With one entry point you patch once and every caller gets the fix.

It also makes your app testable without a network. \`handle_request({"prompt": "hi"})\` is a plain function call, dict in, dict out. Call it from a test, a CLI, or an HTTP route and it behaves the same way every time. That's what you want in place before you deploy anything.

## Validate before you spend money

Packaging is also your first line of defense. Check the input before you call the model. A missing or empty prompt should never reach the API, because you'd be paying to fail. Return a structured \`{"ok": False, "error": ...}\` instead of calling the model on garbage, and hand the caller a real reason instead of a stack trace.

## The mental model

Think of \`handle_request\` as the front door to your whole app. The web server, a test, future-you debugging at 2am all walk through that same door with a dict and get a dict back. Below, build that validation gate in pure Python. No network yet, just the contract every layer after this depends on.`,
    key_terms: [
      { term: "Entry point", definition: "The single function every caller goes through to reach the model, so there is one place to add logging, cost, and guards later." },
      { term: "Validation gate", definition: "A check on the incoming payload that rejects bad input before any money is spent on a model call." },
      { term: "Structured response", definition: "Returning a plain dict like ok True with a reply, or ok False with an error, so every caller handles success and failure the same way." },
    ],
    animated_diagrams: [
      {
        title: "One request through the front door",
        caption: "Every caller hands handle_request a dict, it validates, calls the model only if the input is good, and returns a dict.",
        loop: false,
        nodes: [
          { label: "Payload in", sub: "plain dict", detail: "A web route, a test, or a CLI passes one dict with a prompt field to handle_request." },
          { label: "Validate", sub: "check the prompt", detail: "Strip the prompt and reject it if empty, before any API call is made." },
          { label: "Call model", sub: "only if valid", detail: "A clean prompt reaches call_model, the one place that touches the Anthropic client." },
          { label: "Dict out", sub: "ok or error", detail: "The result comes back as a structured dict, success or failure in the same shape." },
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Run handle_request on a payload whose prompt is three spaces.",
        steps: [
          "payload.get returns the string of three spaces since the prompt key is present.",
          "Call .strip() on it, which removes the whitespace and leaves the empty string.",
          "The empty string is falsy, so the 'if not prompt' check is True.",
          "Return early with the error dict, never reaching call_model.",
        ],
        output: "An ok False dict with error 'missing prompt', and no money spent on a model call.",
      },
    ],
    callouts: [
      { type: "tip", position: "after", title: "one door means one fix", content: "When cost tracking and a budget guard get added later, they wrap this single function. Scatter the model call across five files and you patch five places every time." },
    ],
    inline_quizzes: [
      {
        question: "Why should handle_request return an ok False error dict instead of raising an exception on bad input?",
        options: ["Exceptions are slower", "So every caller (route, test, CLI) handles success and failure in the same shape instead of wrapping each call in try/except", "The API forbids exceptions", "Dicts use less memory"],
        correct_index: 1,
        explanation: "A consistent dict shape means callers branch on result['ok'] every time. Raising would force each caller to catch and translate the exception itself.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "An empty or whitespace-only prompt should still reach the model call.", correct_answer: "false", explanation: "You validate first, so a missing prompt returns an error dict and never pays for a failing API call." },
          { type: "fill_in", question: "What string method turns a padded '  hi  ' into 'hi' before the empty check?", correct_answer: "strip", explanation: "strip() removes surrounding whitespace so a whitespace-only prompt collapses to the falsy empty string." },
        ],
      },
    ],
    starter_code: `def call_model(prompt):
    return f"[stub reply to: {prompt}]"


def handle_request(payload):
    # TODO: get "prompt" from payload, default to "", and strip it
    # TODO: if prompt is empty, return {"ok": False, "error": "missing prompt"}
    # TODO: otherwise call call_model(prompt) and return {"ok": True, "reply": reply}
    pass


print(handle_request({"prompt": "Hello there"}))
print(handle_request({}))
print(handle_request({"prompt": "   "}))`,
    solution_code: `def call_model(prompt):
    return f"[stub reply to: {prompt}]"


def handle_request(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "error": "missing prompt"}
    reply = call_model(prompt)
    return {"ok": True, "reply": reply}


print(handle_request({"prompt": "Hello there"}))
print(handle_request({}))
print(handle_request({"prompt": "   "}))`,
    hints: [
      "payload.get(\"prompt\", \"\") never raises even if the key is missing; strip() then handles whitespace-only input.",
      "Check the stripped prompt for truthiness before calling call_model, an empty string is falsy.",
      "Return a plain dict; do not raise exceptions from handle_request, callers should get {\"ok\": False, ...} instead.",
    ],
    challenge_title: "Validate the Request Envelope",
    challenge_description: "Gate a batch of incoming requests before they ever reach the model: reject missing prompts and out-of-range token limits.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(1, n + 1):
        has_prompt, max_tokens = map(int, data[i].split())
        # has_prompt: 1 if the request has a non-empty prompt, 0 if missing
        # max_tokens: -1 if the field was not sent, otherwise the requested value

        # TODO: if has_prompt is 0, print "ERROR: missing prompt"
        # TODO: else if max_tokens != -1 and it's not between 1 and 4096 inclusive,
        #       print "ERROR: max_tokens out of range"
        # TODO: else print "OK"

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    for i in range(1, n + 1):
        has_prompt, max_tokens = map(int, data[i].split())
        if has_prompt == 0:
            print("ERROR: missing prompt")
        elif max_tokens != -1 and not (1 <= max_tokens <= 4096):
            print("ERROR: max_tokens out of range")
        else:
            print("OK")

main()`,
    challenge_test_cases: [
      { input: "3\n1 -1\n0 100\n1 5000", expected_output: "OK\nERROR: missing prompt\nERROR: max_tokens out of range", description: "One clean request, one missing prompt, one over the 4096 token ceiling." },
      { input: "1\n1 4096", expected_output: "OK", description: "Edge: max_tokens exactly at the 4096 ceiling is still valid." },
      { input: "1\n1 0", expected_output: "ERROR: max_tokens out of range", description: "Edge: max_tokens of 0 is below the minimum of 1." },
    ],
  },
  {
    id: "prod-22-2",
    project_id: "prod-22",
    order: 2,
    title: "Stand Up the Endpoint",
    concept: "deploying an HTTP endpoint",
    explanation: `The function from last lesson works, but nobody can hit a Python function from a browser. This lesson wraps \`handle_request\` in an HTTP server and gets one route live: \`POST /generate\` in, JSON out. That's the smallest thing you can deploy. One endpoint, one job, running as a process that listens on a port.

## Picking a framework

FastAPI is the usual choice for a small Python API. It's quick to write, it validates request bodies for you, and it runs under \`uvicorn\` as a real server process.

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 300

@app.post("/generate")
def generate(req: GenerateRequest):
    return handle_request(req.model_dump())

@app.get("/health")
def health():
    return {"status": "ok"}
\`\`\`

Notice \`generate\` is a thin wrapper. FastAPI parses and validates the JSON body into \`req\`, then hands it straight to the \`handle_request\` function you already built. You didn't rewrite your model logic for the web. You exposed the function you already had.

## Running it for real

\`\`\`bash
pip install fastapi uvicorn[standard]
uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`

\`uvicorn\` is the process that listens on a port and forwards requests into your FastAPI app. \`--host 0.0.0.0\` means accept connections from outside this machine, not just \`localhost\`. That's the difference between runs on my laptop and reachable from the internet once it's deployed somewhere.

## Where it actually runs

Deploying means running that same \`uvicorn\` command on a machine that stays on and has a public address, instead of your laptop. Small managed platforms (Render, Fly.io, Railway) do this for you. You push code, they run the process and give you a URL. A Dockerfile like this works on any of them:

\`\`\`dockerfile
FROM python:3.12-slim
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## Why a health route

\`/health\` isn't decoration. Deployment platforms, load balancers, and monitors ping a health route to decide whether the instance is alive. Return a fast \`{"status": "ok"}\` with no model call inside it, and infrastructure can check you're up without spending a token every few seconds.

## The mental model

A web framework is a router. It matches an incoming method and path to a Python function and hands back whatever that function returns. Below, build that routing logic in pure Python with no network and no framework: a dict of registered routes and a dispatcher that decides 200 or 404 for each request. That's what a deployed server does under the hood. Here you build it offline first.`,
    key_terms: [
      { term: "FastAPI", definition: "A small Python web framework that parses and validates the JSON request body for you before handing it to your function." },
      { term: "uvicorn", definition: "The server process that listens on a port and forwards incoming requests into your FastAPI app." },
      { term: "Health route", definition: "A cheap endpoint like GET /health that returns a fixed ok with no model call, so infrastructure can check the service is alive without spending tokens." },
    ],
    animated_diagrams: [
      {
        title: "How the router dispatches a request",
        caption: "A request carries a method and path. The router matches them to a handler, or answers 404 if nothing is registered.",
        loop: false,
        nodes: [
          { label: "Request", sub: "method + path", detail: "An incoming request arrives as a method like POST and a path like /generate." },
          { label: "Look up route", sub: "match the pair", detail: "The router checks its table for a handler registered under that exact (method, path) key." },
          { label: "Found?", sub: "handler or none", detail: "A hit runs the handler; a miss means no route was registered for that method and path." },
          { label: "Response", sub: "200 or 404", detail: "Return 200 with the handler's body, or 404 with a not-found error when there is no match." },
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Route a GET /generate when only POST /generate and GET /health are registered.",
        steps: [
          "Build the lookup key as the tuple (\"GET\", \"/generate\").",
          "Search the routes table: the registered keys are (\"POST\", \"/generate\") and (\"GET\", \"/health\").",
          "Neither key matches, because the path is right but the method is wrong.",
          "routes.get returns None, so the dispatcher falls through to the not-found branch.",
        ],
        output: "A 404 response with body {'error': 'not found'}, since method and path must both match.",
      },
    ],
    callouts: [
      { type: "insight", position: "after", title: "the route is a thin wrapper", content: "The /generate handler does not rewrite your model logic. It parses the body and hands it to the handle_request function you already built. The web layer only adds routing." },
    ],
    inline_quizzes: [
      {
        question: "Why key the routes table on the tuple (method, path) instead of the path alone?",
        options: ["Tuples are faster than strings", "So GET and POST on the same path map to different handlers instead of colliding", "The path alone is not hashable", "FastAPI requires tuples"],
        correct_index: 1,
        explanation: "The same path often supports different methods. Keying on (method, path) keeps GET /generate and POST /generate as separate, non-colliding routes.",
      },
      {
        question: "Why does /health return a fixed status with no model call inside it?",
        options: ["Model calls are not allowed in GET routes", "So load balancers and monitors can ping it constantly to check the service is up without spending a token each time", "It makes the route load faster in a browser", "Health checks must be POST"],
        correct_index: 1,
        explanation: "Infrastructure pings health routes every few seconds. A cheap fixed reply lets them confirm the process is alive without paying for a model call on every ping.",
      },
    ],
    starter_code: `routes = {}

def add_route(method, path, handler):
    # TODO: store handler in routes keyed by (method, path)
    pass


def route_request(method, path, body):
    # TODO: look up (method, path) in routes
    # TODO: if found, return {"status": 200, "body": handler(body)}
    # TODO: if not found, return {"status": 404, "body": {"error": "not found"}}
    pass


add_route("POST", "/generate", lambda body: {"reply": f"echo: {body['prompt']}"})
add_route("GET", "/health", lambda body: {"status": "ok"})

print(route_request("POST", "/generate", {"prompt": "hi"}))
print(route_request("GET", "/health", {}))
print(route_request("GET", "/generate", {}))`,
    solution_code: `routes = {}

def add_route(method, path, handler):
    routes[(method, path)] = handler


def route_request(method, path, body):
    handler = routes.get((method, path))
    if handler is None:
        return {"status": 404, "body": {"error": "not found"}}
    return {"status": 200, "body": handler(body)}


add_route("POST", "/generate", lambda body: {"reply": f"echo: {body['prompt']}"})
add_route("GET", "/health", lambda body: {"status": "ok"})

print(route_request("POST", "/generate", {"prompt": "hi"}))
print(route_request("GET", "/health", {}))
print(route_request("GET", "/generate", {}))`,
    hints: [
      "Use a tuple (method, path) as the dict key so GET and POST on the same path never collide.",
      "routes.get((method, path)) returns None cleanly instead of raising KeyError when there is no match.",
      "route_request should never call a handler for a route that is not registered.",
    ],
    challenge_title: "Route the Requests",
    challenge_description: "Simulate a minimal HTTP router: register a set of exact-match routes, then answer 200 or 404 for a batch of incoming requests.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    r = int(data[idx].strip()); idx += 1
    registered = set()
    for _ in range(r):
        method, path = data[idx].split(" ", 1); idx += 1
        registered.add((method, path))

    m = int(data[idx].strip()); idx += 1
    # TODO: for each of the next m lines ("METHOD PATH"), print 200 if that
    #       exact (method, path) pair is in 'registered', else print 404.

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    r = int(data[idx].strip()); idx += 1
    registered = set()
    for _ in range(r):
        method, path = data[idx].split(" ", 1); idx += 1
        registered.add((method, path))

    m = int(data[idx].strip()); idx += 1
    for i in range(m):
        method, path = data[idx].split(" ", 1); idx += 1
        print(200 if (method, path) in registered else 404)

main()`,
    challenge_test_cases: [
      { input: "2\nPOST /generate\nGET /health\n3\nPOST /generate\nGET /generate\nGET /health", expected_output: "200\n404\n200", description: "Exact method+path matches return 200; a registered path with the wrong method returns 404." },
      { input: "1\nPOST /generate\n1\nPOST /status", expected_output: "404", description: "Path was never registered, so the router falls through to 404." },
      { input: "0\n1\nGET /anything", expected_output: "404", description: "Edge: with zero registered routes, every request 404s." },
    ],
  },
  {
    id: "prod-22-3",
    project_id: "prod-22",
    order: 3,
    title: "Log Every Request",
    concept: "structured request logging",
    explanation: `Once your endpoint is live, \`print()\` stops being useful. Nobody is watching the terminal of a server running on someone else's machine. The fix is structured logging. For every request, write one record with a fixed shape (timestamps, token counts, latency, status) that a machine can read back later. Every later lesson in this capstone reads these records: cost tracking, the dashboard, error monitoring all start here.

## What one log record looks like

A good request log answers the same questions every time, in the same shape:

\`\`\`python
import time, json, uuid

def make_log_record(model, input_tokens, output_tokens, latency_ms, status="ok"):
    return {
        "id": str(uuid.uuid4())[:8],
        "timestamp": time.time(),
        "model": model,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
        "latency_ms": latency_ms,
        "status": status,
    }
\`\`\`

Note what's missing: the full prompt or reply text. Logging every character of every conversation is a privacy and storage liability you don't need for monitoring. Token counts and timing tell you almost everything about cost and health without storing what people actually said.

## Timing the call

\`latency_ms\` comes from wrapping the real call in a timer, not guessing:

\`\`\`python
start = time.perf_counter()
reply = call_model(prompt)
latency_ms = int((time.perf_counter() - start) * 1000)
\`\`\`

\`time.perf_counter()\` is a high-resolution clock built for measuring how long something took. \`time.time()\` is for wall-clock timestamps and can jump around when the system clock adjusts, so it's the wrong tool for durations.

## Where records go

For a small service, appending one JSON line per request to a file (\`log.jsonl\`, one record per line) is enough. This is the JSON Lines format: you append a line at a time, you can stream it, and you can parse one line without loading the whole file. Production systems swap the file for a database table or a logging service, but the record shape stays the same.

\`\`\`python
def write_log(record, path="log.jsonl"):
    with open(path, "a") as f:
        f.write(json.dumps(record) + "\\n")
\`\`\`

## Why it matters

Without this, "how many requests did we serve today" and "why did the bill spike" have no answer after the fact. With it, every later feature is arithmetic over a list of records: cost totals, the dashboard, error rates, budget alerts. Logging isn't a nice-to-have bolted on at the end. It's the data source everything else in this capstone reads from.

## The mental model

Every request leaves a receipt behind, even if nobody reads it that day. Below, build the record shape and a small in-memory log. No file or network yet, just the structure you'll aggregate in the coming lessons.`,
    key_terms: [
      { term: "Structured logging", definition: "Writing one record per request with a fixed set of fields (tokens, latency, status) that a machine can read back later, instead of free-form print output." },
      { term: "JSON Lines", definition: "A file format with one JSON object per line, so you can append a record at a time and parse a single line without loading the whole file." },
      { term: "perf_counter", definition: "A high-resolution clock built for measuring how long something took, unlike time.time which is for wall-clock timestamps and can jump when the clock adjusts." },
    ],
    animated_diagrams: [
      {
        title: "One request leaves one receipt",
        caption: "Time the call, build a fixed-shape record from the token counts, and append it. Every later feature reads these records.",
        loop: true,
        nodes: [
          { label: "Start timer", sub: "perf_counter", detail: "Read the high-resolution clock right before the model call so you measure real duration." },
          { label: "Call model", sub: "get the reply", detail: "The model responds with a reply and reports how many input and output tokens it used." },
          { label: "Build record", sub: "fixed shape", detail: "Assemble tokens, total, latency, and status into one dict with the same keys every time." },
          { label: "Append", sub: "one JSON line", detail: "Write the record as a single line to the log, ready for the next request to append after it." },
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Build a record for a call with 120 input tokens, 45 output tokens, and 850ms latency, then read total tokens back.",
        steps: [
          "make_log_record stores input_tokens 120 and output_tokens 45.",
          "It computes total_tokens once as 120 + 45 = 165 and stores that too.",
          "latency_ms 850 and status 'ok' (the default) are filled in.",
          "Later, sum(r['total_tokens'] for r in LOG) reads the stored 165 without recomputing.",
        ],
        output: "A record with total_tokens 165, so aggregates are arithmetic over stored fields.",
      },
    ],
    callouts: [
      { type: "warning", position: "after", title: "do not log the prompt text", content: "Storing every character of every conversation is a privacy and storage liability. Token counts and timing tell you almost everything about cost and health without keeping what people actually said." },
    ],
    inline_quizzes: [
      {
        question: "Why use time.perf_counter() instead of time.time() to measure latency?",
        options: ["perf_counter returns a nicer number", "perf_counter is a high-resolution clock built for durations, while time.time can jump around when the system clock adjusts", "time.time is deprecated", "perf_counter is the only one that works on servers"],
        correct_index: 1,
        explanation: "Durations need a monotonic high-resolution clock. time.time is a wall-clock timestamp that can shift, which corrupts a measured duration.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "A good request log stores the full prompt and reply text for every call.", correct_answer: "false", explanation: "You deliberately leave out the text. Token counts and timing cover cost and health without the privacy and storage cost." },
          { type: "fill_in", question: "What file format stores one JSON object per line so you can append and stream records?", correct_answer: "jsonl", explanation: "JSON Lines (jsonl) puts one record per line, so appending and parsing a single line is cheap." },
        ],
      },
    ],
    starter_code: `def make_log_record(input_tokens, output_tokens, latency_ms, status="ok"):
    # TODO: return a dict with keys: input_tokens, output_tokens,
    #       total_tokens (input + output), latency_ms, status
    pass


LOG = []
LOG.append(make_log_record(120, 45, 850))
LOG.append(make_log_record(80, 30, 600))
LOG.append(make_log_record(200, 0, 120, status="error"))

print("records:", len(LOG))`,
    solution_code: `def make_log_record(input_tokens, output_tokens, latency_ms, status="ok"):
    return {
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens,
        "latency_ms": latency_ms,
        "status": status,
    }


LOG = []
LOG.append(make_log_record(120, 45, 850))
LOG.append(make_log_record(80, 30, 600))
LOG.append(make_log_record(200, 0, 120, status="error"))

print("records:", len(LOG))
total_tokens = sum(r["total_tokens"] for r in LOG)
avg_latency = sum(r["latency_ms"] for r in LOG) / len(LOG)
errors = sum(1 for r in LOG if r["status"] == "error")
print("total tokens:", total_tokens)
print("avg latency:", avg_latency)
print("errors:", errors)`,
    hints: [
      "total_tokens is just input_tokens + output_tokens computed once and stored, not recomputed everywhere later.",
      "Give status a default of \"ok\" so most calls to make_log_record do not need to mention it.",
      "Aggregates like total tokens or average latency are just sum()/len() over the list of records, no new state needed.",
    ],
    challenge_title: "Parse the Access Log",
    challenge_description: "Read a batch of request log lines and compute the totals a monitoring dashboard would show: request count, error count, token usage, and worst-case latency.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    errors = 0
    max_latency = 0
    for i in range(1, n + 1):
        parts = data[i].split()
        in_tok, out_tok, latency, status = int(parts[0]), int(parts[1]), int(parts[2]), parts[3]
        # TODO: add in_tok + out_tok to total_tokens
        # TODO: if status == "error", increment errors
        # TODO: track the maximum latency seen

    # TODO: print n, then errors, then total_tokens, then max_latency (one per line)

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    errors = 0
    max_latency = 0
    for i in range(1, n + 1):
        parts = data[i].split()
        in_tok, out_tok, latency, status = int(parts[0]), int(parts[1]), int(parts[2]), parts[3]
        total_tokens += in_tok + out_tok
        if status == "error":
            errors += 1
        if latency > max_latency:
            max_latency = latency

    print(n)
    print(errors)
    print(total_tokens)
    print(max_latency)

main()`,
    challenge_test_cases: [
      { input: "3\n10 20 100 ok\n5 5 50 error\n0 0 200 ok", expected_output: "3\n1\n40\n200", description: "Three requests, one error; tokens sum to 40 and the slowest call took 200ms." },
      { input: "1\n100 200 300 ok", expected_output: "1\n0\n300\n300", description: "Single clean request; totals equal that one record." },
      { input: "2\n0 0 5 error\n0 0 5 error", expected_output: "2\n2\n0\n5", description: "Edge: both calls failed with zero tokens, error count and max latency still tracked correctly." },
    ],
  },
  {
    id: "prod-22-4",
    project_id: "prod-22",
    order: 4,
    title: "Compute the Cost of Every Call",
    concept: "token pricing and cost calculation",
    explanation: `Every log record already has token counts. This lesson turns those counts into money. Providers charge per token, and input and output tokens are priced differently. Output usually costs several times more than input, because generating text is more expensive than reading it. Get this wrong and your dashboard shows a number that's off by a multiple.

## The pricing shape

Providers publish a price per million tokens, split by input and output:

\`\`\`python
PRICING = {
    "claude-haiku-4-5":  {"input": 0.80,  "output": 4.00},
    "claude-sonnet-4-6": {"input": 3.00,  "output": 15.00},
}

def cost_for_call(model, input_tokens, output_tokens):
    rates = PRICING[model]
    input_cost = (input_tokens / 1_000_000) * rates["input"]
    output_cost = (output_tokens / 1_000_000) * rates["output"]
    return input_cost + output_cost
\`\`\`

Output is priced roughly 5x input here. A summarizer that reads a huge document but writes three sentences is cheap. A code generator that writes a thousand lines from a short prompt is not. The ratio matters more than either number alone.

## Attaching cost to the log record

Cost belongs on the same record as everything else, computed once, right after the call:

\`\`\`python
record = make_log_record(model, input_tokens, output_tokens, latency_ms)
record["cost_usd"] = cost_for_call(model, input_tokens, output_tokens)
\`\`\`

Now every downstream aggregate reads a field instead of recomputing pricing math in five places: daily spend, per-model spend, the cost of one request.

## Why per-request cost, not just a monthly total

Your provider's dashboard eventually shows you a monthly bill, but by then it's too late to catch a bug. Computing cost per request live lets you catch problems the moment they happen: a prompt that accidentally includes a whole document on every call, a loop calling the model far more than intended, a model swapped to a pricier tier by mistake. The per-call number is what makes the dashboard in the next lesson useful instead of a surprise at the end of the month.

## A note on precision

Money math with floats can drift by fractions of a cent over millions of calls. This lesson uses plain floats since the scale is small, but production billing systems track cost in integer cents so rounding errors don't compound. Keep that in your back pocket if this ever has to reconcile against a real invoice.

## The mental model

Token counts are the ingredients, the pricing table is the recipe, and cost is what falls out when you combine them. Below, compute cost per call in pure Python using fixed integer prices (cents per 1,000 tokens) so the arithmetic is exact, with no floating point rounding to fight.`,
    key_terms: [
      { term: "Price per million tokens", definition: "The unit providers publish rates in, split into a separate input rate and output rate." },
      { term: "Input vs output pricing", definition: "Output tokens usually cost several times more than input tokens, because generating text is more expensive than reading it." },
      { term: "Integer cents", definition: "Tracking cost as whole cents with integer floor division, so rounding errors do not compound over millions of calls the way floats can." },
    ],
    animated_diagrams: [
      {
        title: "From token counts to a cost",
        caption: "Look up the model's rates, price the input and output halves separately, then add them.",
        loop: false,
        nodes: [
          { label: "Token counts", sub: "input + output", detail: "The log record already holds how many input and output tokens the call used." },
          { label: "Look up rates", sub: "per the model", detail: "Find this model's input rate and output rate in the pricing table." },
          { label: "Price each half", sub: "in and out apart", detail: "Multiply input tokens by the input rate and output tokens by the higher output rate, separately." },
          { label: "Sum", sub: "cost of the call", detail: "Add the two halves to get one cost, stored on the same record as everything else." },
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Cost a sonnet call of 2000 input and 2000 output tokens, where sonnet is 300 cents/1000 input and 1500 cents/1000 output.",
        steps: [
          "input_cost = 2000 * 300 // 1000. That is 600000 // 1000 = 600 cents.",
          "output_cost = 2000 * 1500 // 1000. That is 3000000 // 1000 = 3000 cents.",
          "Notice output costs 5x input here even though the token counts are identical.",
          "Add the halves: 600 + 3000.",
        ],
        output: "3600 cents for the call, dominated by the pricier output tokens.",
      },
    ],
    comparison_tables: [
      {
        title: "Per-request cost vs a monthly bill",
        columns: ["Aspect", "Per-request (this lesson)", "Provider monthly bill"],
        rows: [
          ["When you see it", "The moment each call finishes", "Weeks later, at billing time"],
          ["Catches", "A prompt bug or runaway loop right away", "The damage only after it is done"],
          ["Granularity", "One number per call, per model", "One lump sum for the period"],
        ],
      },
    ],
    inline_quizzes: [
      {
        question: "Why compute cost per request instead of waiting for the provider's monthly bill?",
        options: ["The monthly bill is always wrong", "Per-request cost catches a bug the moment it happens (a loop, a bloated prompt, a pricier model) instead of at the end of the month", "Providers charge extra for monthly totals", "It is required to call the API"],
        correct_index: 1,
        explanation: "A live per-call number surfaces problems immediately. The monthly total tells you far too late to prevent the spend.",
      },
      {
        question: "Why do production billing systems track cost in integer cents rather than floats?",
        options: ["Floats are banned in Python", "Float math can drift by fractions of a cent and compound over millions of calls, while integer cents stay exact", "Integers are faster to add", "Cents are easier to display"],
        correct_index: 1,
        explanation: "Money math with floats accumulates tiny rounding errors. Integer cents keep the arithmetic exact so it reconciles against a real invoice.",
      },
    ],
    starter_code: `PRICING = {
    "haiku": {"input": 25, "output": 125},
    "sonnet": {"input": 300, "output": 1500},
}


def cost_for_call(model, input_tokens, output_tokens):
    # Prices are cents per 1000 tokens. TODO:
    # input_cost = input_tokens * price_in // 1000
    # output_cost = output_tokens * price_out // 1000
    # return their sum
    pass


calls = [
    ("haiku", 4000, 1000),
    ("sonnet", 2000, 2000),
]

total = 0
for model, in_tok, out_tok in calls:
    c = cost_for_call(model, in_tok, out_tok)
    total += c
    print(model, c)

print("total:", total)`,
    solution_code: `PRICING = {
    "haiku": {"input": 25, "output": 125},
    "sonnet": {"input": 300, "output": 1500},
}


def cost_for_call(model, input_tokens, output_tokens):
    rates = PRICING[model]
    input_cost = input_tokens * rates["input"] // 1000
    output_cost = output_tokens * rates["output"] // 1000
    return input_cost + output_cost


calls = [
    ("haiku", 4000, 1000),
    ("sonnet", 2000, 2000),
]

total = 0
for model, in_tok, out_tok in calls:
    c = cost_for_call(model, in_tok, out_tok)
    total += c
    print(model, c)

print("total:", total)`,
    hints: [
      "Use integer floor division (//) with cents-per-1000-tokens pricing to avoid floating point rounding entirely.",
      "Look up rates once with PRICING[model], then compute the input and output halves separately before adding them.",
      "Output tokens are usually priced several times higher than input tokens, do not reuse one rate for both.",
    ],
    challenge_title: "Bill the Session",
    challenge_description: "Given a pricing table and a batch of model calls, compute each call's cost and the grand total for the session.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx].strip()); idx += 1
    pricing = {}
    for _ in range(k):
        name, price_in, price_out = data[idx].split(); idx += 1
        pricing[name] = (int(price_in), int(price_out))

    n = int(data[idx].strip()); idx += 1
    costs = []
    for _ in range(n):
        model, in_tok, out_tok = data[idx].split(); idx += 1
        in_tok, out_tok = int(in_tok), int(out_tok)
        # TODO: look up (price_in, price_out) for 'model' from pricing
        # TODO: cost = in_tok * price_in // 1000 + out_tok * price_out // 1000
        # TODO: append cost to 'costs'

    # TODO: print n, then sum(costs), then each individual cost in order

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    k = int(data[idx].strip()); idx += 1
    pricing = {}
    for _ in range(k):
        name, price_in, price_out = data[idx].split(); idx += 1
        pricing[name] = (int(price_in), int(price_out))

    n = int(data[idx].strip()); idx += 1
    costs = []
    for _ in range(n):
        model, in_tok, out_tok = data[idx].split(); idx += 1
        in_tok, out_tok = int(in_tok), int(out_tok)
        price_in, price_out = pricing[model]
        cost = in_tok * price_in // 1000 + out_tok * price_out // 1000
        costs.append(cost)

    print(n)
    print(sum(costs))
    for c in costs:
        print(c)

main()`,
    challenge_test_cases: [
      { input: "2\nhaiku 25 125\nsonnet 300 1500\n2\nhaiku 4000 1000\nsonnet 2000 2000", expected_output: "2\n3825\n225\n3600", description: "Two calls across two models; total cost is the sum of each call's own input+output cost." },
      { input: "1\nhaiku 10 10\n1\nhaiku 1000 1000", expected_output: "1\n20\n20", description: "Single call; cost matches manual math (10 cents input + 10 cents output)." },
      { input: "1\nhaiku 25 125\n1\nhaiku 0 0", expected_output: "1\n0\n0", description: "Edge: a zero-token call costs nothing." },
    ],
  },
  {
    id: "prod-22-5",
    project_id: "prod-22",
    order: 5,
    title: "Build the Usage Dashboard",
    concept: "aggregating logs into a dashboard",
    explanation: `A pile of individual log records isn't a dashboard, it's a haystack. This lesson turns the raw log into the rolled-up numbers a dashboard shows: requests and cost broken down by model, plus the totals across everything. The technique is a single pass over your records, grouping as you go.

## Group, don't re-scan

The naive way to get total cost for sonnet is to filter the whole log every time you need a number: \`sum(r["cost_usd"] for r in log if r["model"] == "sonnet")\`. That works for one number. But a dashboard needs a dozen numbers, and re-scanning the whole log for each one is wasteful and easy to get subtly inconsistent. Do one grouped pass instead.

\`\`\`python
from collections import defaultdict

def build_dashboard(records):
    by_model = defaultdict(lambda: {"count": 0, "tokens": 0, "cost_usd": 0.0})
    for r in records:
        bucket = by_model[r["model"]]
        bucket["count"] += 1
        bucket["tokens"] += r["total_tokens"]
        bucket["cost_usd"] += r["cost_usd"]

    return {
        "by_model": dict(by_model),
        "total_requests": len(records),
        "total_cost_usd": sum(r["cost_usd"] for r in records),
    }
\`\`\`

\`defaultdict\` is what keeps this clean. The first time you touch \`by_model["sonnet"]\`, it creates a fresh \`{"count": 0, ...}\` bucket instead of raising a \`KeyError\`. You never write "have I seen this model before" checks. The dict handles it.

## Serving it

The simplest dashboard is one more route that returns this dict as JSON, which any front-end can render as a table or chart:

\`\`\`python
@app.get("/dashboard")
def dashboard():
    return build_dashboard(read_all_logs())
\`\`\`

You don't need a charting library to start. A JSON summary endpoint, or even a plain HTML table built with an f-string, is a real dashboard. Polish comes later. The numbers being correct comes first.

## What a dashboard is for

The point isn't the visual. It's catching problems early: a spike in requests from one model, a cost total climbing faster than usual, an error rate creeping up. You can only answer any of those if the aggregation is right. Get the grouping solid here, and rendering it prettier later is just formatting.

## The mental model

One pass over the log, one bucket per group, running totals updated as you go. That's every dashboard you'll ever build, whether it renders as a table, a JSON blob, or a chart. Below, build the same grouped aggregation in pure Python over a small in-memory record list.`,
    key_terms: [
      { term: "Aggregation", definition: "Rolling many individual records up into a few summary numbers, like requests and cost per model." },
      { term: "Grouped pass", definition: "Walking the records once and updating a bucket per group as you go, instead of re-scanning the whole log for each number." },
      { term: "defaultdict", definition: "A dict that creates a fresh bucket the first time you touch a new key, so you never write a 'have I seen this model before' check." },
    ],
    animated_diagrams: [
      {
        title: "One pass, one bucket per model",
        caption: "Walk the records once. Each record finds its model's bucket and adds to the running count, tokens, and cost.",
        loop: true,
        nodes: [
          { label: "Next record", sub: "one at a time", detail: "Take the next request record from the log in a single pass." },
          { label: "Find bucket", sub: "by model", detail: "Look up (or create) the bucket for that record's model with defaultdict." },
          { label: "Add to totals", sub: "count, tokens, cost", detail: "Increment the bucket's running count, tokens, and cost with this record's values." },
          { label: "Summary out", sub: "per model + grand", detail: "After the last record, the buckets plus the flat totals are the dashboard." },
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Group two haiku records (tokens 100 cost 20, tokens 200 cost 40) and one sonnet record (tokens 500 cost 300).",
        steps: [
          "First haiku record: create the haiku bucket, then count 1, tokens 100, cost 20.",
          "Sonnet record: create the sonnet bucket, then count 1, tokens 500, cost 300.",
          "Second haiku record: the bucket already exists, so count 2, tokens 300, cost 60.",
          "total_requests is len(records) = 3; total_cost is 20 + 300 + 40 = 360.",
        ],
        output: "haiku bucket {count 2, tokens 300, cost 60}, sonnet {count 1, tokens 500, cost 300}, total 360.",
      },
    ],
    callouts: [
      { type: "tip", position: "after", title: "correct first, pretty later", content: "A JSON summary endpoint or a plain HTML table is already a real dashboard. Get the grouping right, and rendering it as a chart later is just formatting." },
    ],
    inline_quizzes: [
      {
        question: "Why do one grouped pass instead of filtering the whole log once per number you need?",
        options: ["Filtering does not work in Python", "A dashboard needs many numbers, and re-scanning the log for each one is wasteful and easy to make subtly inconsistent", "Grouping uses less memory always", "The log is stored sorted"],
        correct_index: 1,
        explanation: "One pass updates every bucket together from the same data, so the numbers stay consistent and you touch each record once instead of many times.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "You need a charting library before you can call something a dashboard.", correct_answer: "false", explanation: "A correct JSON summary or plain table is a real dashboard. The visual polish comes after the numbers are right." },
          { type: "fill_in", question: "What collections type creates a fresh bucket on first access so you skip the 'is this key new' check?", correct_answer: "defaultdict", explanation: "collections.defaultdict builds the default value the first time a key is touched." },
        ],
      },
    ],
    starter_code: `def build_dashboard(records):
    by_model = {}
    for r in records:
        model = r["model"]
        # TODO: if model not in by_model, create {"count": 0, "tokens": 0, "cost": 0}
        # TODO: increment count by 1, tokens by r["tokens"], cost by r["cost"]
        pass

    total_requests = len(records)
    total_cost = sum(r["cost"] for r in records)
    return {"by_model": by_model, "total_requests": total_requests, "total_cost": total_cost}


records = [
    {"model": "haiku", "tokens": 100, "cost": 20},
    {"model": "sonnet", "tokens": 500, "cost": 300},
    {"model": "haiku", "tokens": 200, "cost": 40},
]

dash = build_dashboard(records)
print(dash["total_requests"], dash["total_cost"])
print(dash["by_model"]["haiku"])
print(dash["by_model"]["sonnet"])`,
    solution_code: `def build_dashboard(records):
    by_model = {}
    for r in records:
        model = r["model"]
        if model not in by_model:
            by_model[model] = {"count": 0, "tokens": 0, "cost": 0}
        by_model[model]["count"] += 1
        by_model[model]["tokens"] += r["tokens"]
        by_model[model]["cost"] += r["cost"]

    total_requests = len(records)
    total_cost = sum(r["cost"] for r in records)
    return {"by_model": by_model, "total_requests": total_requests, "total_cost": total_cost}


records = [
    {"model": "haiku", "tokens": 100, "cost": 20},
    {"model": "sonnet", "tokens": 500, "cost": 300},
    {"model": "haiku", "tokens": 200, "cost": 40},
]

dash = build_dashboard(records)
print(dash["total_requests"], dash["total_cost"])
print(dash["by_model"]["haiku"])
print(dash["by_model"]["sonnet"])`,
    hints: [
      "Check `if model not in by_model` before touching it the first time, or use collections.defaultdict to skip that check entirely.",
      "Update all three fields (count, tokens, cost) inside the same loop pass, do not re-scan records for each one.",
      "total_cost is a plain sum() over the flat records list; it does not need the by_model grouping at all.",
    ],
    challenge_title: "Aggregate by Model",
    challenge_description: "Group a batch of request records by model and print per-model totals plus the grand total cost, for the usage dashboard.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    groups = {}
    for i in range(1, n + 1):
        model, tokens, cost, latency = data[i].split()
        tokens, cost, latency = int(tokens), int(cost), int(latency)
        # TODO: if model is new, create a bucket with count, tokens, cost, latency_sum
        # TODO: update the bucket's count, tokens, cost, latency_sum

    # TODO: for each model sorted alphabetically, print:
    #   "model count tokens cost avg_latency"
    # where avg_latency = latency_sum // count (integer floor division)
    # TODO: on the last line, print the sum of every model's cost

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    groups = {}
    for i in range(1, n + 1):
        model, tokens, cost, latency = data[i].split()
        tokens, cost, latency = int(tokens), int(cost), int(latency)
        if model not in groups:
            groups[model] = {"count": 0, "tokens": 0, "cost": 0, "latency_sum": 0}
        g = groups[model]
        g["count"] += 1
        g["tokens"] += tokens
        g["cost"] += cost
        g["latency_sum"] += latency

    total_cost = 0
    for model in sorted(groups):
        g = groups[model]
        avg_latency = g["latency_sum"] // g["count"]
        print(model, g["count"], g["tokens"], g["cost"], avg_latency)
        total_cost += g["cost"]

    print(total_cost)

main()`,
    challenge_test_cases: [
      { input: "4\nhaiku 100 20 50\nsonnet 500 300 200\nhaiku 200 40 70\nsonnet 300 150 100", expected_output: "haiku 2 300 60 60\nsonnet 2 800 450 150\n510", description: "Two models, two calls each; per-model totals plus the grand total cost across both." },
      { input: "1\nhaiku 100 10 5", expected_output: "haiku 1 100 10 5\n10", description: "Single record; the group equals that one record exactly." },
      { input: "2\nzeta 10 5 3\nalpha 20 8 4", expected_output: "alpha 1 20 8 4\nzeta 1 10 5 3\n13", description: "Edge: models print alphabetically sorted regardless of input order." },
    ],
  },
  {
    id: "prod-22-6",
    project_id: "prod-22",
    order: 6,
    title: "Handle Failures Without Taking Down the Dashboard",
    concept: "error handling and status codes",
    explanation: `A deployed endpoint fails in ways your laptop never showed you. The provider times out, you hit a rate limit, a caller sends garbage. An unhandled exception in a web route doesn't just fail that one request. It can crash the worker process that's serving other users' requests too. This lesson wraps the request path in defenses so one bad call degrades gracefully instead of taking the service down.

## Catch specific things, not everything

Blanket \`except Exception\` hides real bugs. Catch the failure modes you actually expect and map each to the right response:

\`\`\`python
import anthropic

def safe_generate(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    try:
        reply = call_model(prompt)
        return {"ok": True, "status": 200, "reply": reply}
    except anthropic.RateLimitError:
        return {"ok": False, "status": 429, "error": "rate limited, retry shortly"}
    except anthropic.APITimeoutError:
        return {"ok": False, "status": 504, "error": "upstream timed out"}
    except anthropic.APIError as e:
        return {"ok": False, "status": 502, "error": f"upstream error: {e}"}
\`\`\`

Each branch returns the same shape (\`ok\`, \`status\`, plus either \`reply\` or \`error\`), so every caller handles success and failure the same way, whether it's the web route, the logger, or a test. That consistency keeps error handling from turning into a maze of special cases.

## Status codes carry meaning

- **400**: the caller's fault (bad input). Don't retry without fixing the request.
- **429**: you're being rate limited. Back off and retry later.
- **502/504**: the upstream provider failed or timed out. Often safe to retry once.

Picking the right code isn't pedantry. It's what lets a caller (or a monitoring system) react correctly without parsing your error string.

## Log the failure too

An error is still a request that happened. Write a log record for it with \`status="error"\` and \`cost_usd=0\` (a call that fails before the model responds usually isn't billed), so the error rate on your dashboard reflects reality instead of counting only successes.

## Why it matters

Without this, one flaky upstream response takes your whole service down, or half-crashes it in a way that's hard to reproduce. With it, a bad request gets a clean 400, a busy provider gets a clean 429 or 504, and your dashboard's error rate means something instead of quietly under-counting failures nobody logged.

## The mental model

Every failure mode gets caught, classified, and returned in the same shape as success, never left to crash the process. Below, build that classification in pure Python: given a fake call function that raises different exception types, map each one to the right status code.`,
    key_terms: [
      { term: "Fail gracefully", definition: "Catching a failure and returning a clean error response, so one bad call degrades instead of crashing the worker that serves other users." },
      { term: "Status code", definition: "A number like 400, 429, or 504 that tells a caller what kind of failure happened, so it can react without parsing your error text." },
      { term: "Same-shape response", definition: "Returning ok, status, and either reply or error from every branch, so callers handle success and failure the same way." },
    ],
    animated_diagrams: [
      {
        title: "Every failure gets caught and classified",
        caption: "Validate first, then try the call. Each expected exception maps to its own status code, never a raw crash.",
        loop: false,
        nodes: [
          { label: "Request", sub: "payload in", detail: "The incoming payload arrives and its prompt is validated before anything else." },
          { label: "Try the call", sub: "guarded model call", detail: "The model call runs inside a try block that expects it might fail." },
          { label: "Classify", sub: "which exception", detail: "A rate limit, a timeout, or another API error each matches its own except branch." },
          { label: "Status out", sub: "same shape", detail: "Return ok False with the right code (429, 504, 502) or ok True with 200, always the same shape." },
        ],
      },
    ],
    comparison_tables: [
      {
        title: "What each status code means",
        columns: ["Code", "Whose fault", "What a caller should do"],
        rows: [
          ["400", "The caller sent bad input", "Fix the request; do not retry as-is"],
          ["429", "You are being rate limited", "Back off and retry later"],
          ["502 / 504", "The upstream provider failed or timed out", "Often safe to retry once"],
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Trace safe_handle when the call raises RateLimitError and the prompt is valid.",
        steps: [
          "The prompt is non-empty, so validation passes and execution enters the try block.",
          "call_fn(prompt) raises RateLimitError before returning a reply.",
          "Python skips to the first matching except: the RateLimitError branch, checked before the generic Exception.",
          "That branch returns the same-shaped dict with status 429.",
        ],
        output: "An ok False dict with status 429 and error 'rate limited', never a crash.",
      },
    ],
    inline_quizzes: [
      {
        question: "Why catch specific exception types before a generic except Exception?",
        options: ["Generic except is slower", "So a rate limit gets a 429 and a timeout a 504, instead of a blanket except hiding real bugs and mislabeling every failure the same way", "Python runs except blocks bottom to top", "Specific excepts are required syntax"],
        correct_index: 1,
        explanation: "Specific branches map each known failure to the right code. A lone blanket except would swallow real bugs and give every failure the same meaningless response.",
      },
      {
        question: "Why write a log record for a failed request with status 'error' and cost 0?",
        options: ["Failures are billed double", "So the dashboard's error rate reflects reality instead of counting only successes", "The API needs a log to retry", "It speeds up the next call"],
        correct_index: 1,
        explanation: "An error is still a request that happened. Logging it keeps the error rate honest, and a call that fails before the model responds usually is not billed.",
      },
    ],
    starter_code: `class RateLimitError(Exception):
    pass


class TimeoutError_(Exception):
    pass


def safe_handle(payload, call_fn):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    try:
        reply = call_fn(prompt)
        return {"ok": True, "status": 200, "reply": reply}
    except RateLimitError:
        # TODO: return {"ok": False, "status": 429, "error": "rate limited"}
        pass
    except TimeoutError_:
        # TODO: return {"ok": False, "status": 504, "error": "upstream timed out"}
        pass
    except Exception as e:
        # TODO: return {"ok": False, "status": 502, "error": str(e)}
        pass


def flaky_call(kind):
    def call_fn(prompt):
        if kind == "rate_limit":
            raise RateLimitError()
        if kind == "timeout":
            raise TimeoutError_()
        if kind == "crash":
            raise ValueError("boom")
        return f"reply to {prompt}"
    return call_fn


print(safe_handle({"prompt": "hi"}, flaky_call("ok")))
print(safe_handle({"prompt": "hi"}, flaky_call("rate_limit")))
print(safe_handle({"prompt": "hi"}, flaky_call("timeout")))
print(safe_handle({"prompt": "hi"}, flaky_call("crash")))
print(safe_handle({"prompt": ""}, flaky_call("ok")))`,
    solution_code: `class RateLimitError(Exception):
    pass


class TimeoutError_(Exception):
    pass


def safe_handle(payload, call_fn):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    try:
        reply = call_fn(prompt)
        return {"ok": True, "status": 200, "reply": reply}
    except RateLimitError:
        return {"ok": False, "status": 429, "error": "rate limited"}
    except TimeoutError_:
        return {"ok": False, "status": 504, "error": "upstream timed out"}
    except Exception as e:
        return {"ok": False, "status": 502, "error": str(e)}


def flaky_call(kind):
    def call_fn(prompt):
        if kind == "rate_limit":
            raise RateLimitError()
        if kind == "timeout":
            raise TimeoutError_()
        if kind == "crash":
            raise ValueError("boom")
        return f"reply to {prompt}"
    return call_fn


print(safe_handle({"prompt": "hi"}, flaky_call("ok")))
print(safe_handle({"prompt": "hi"}, flaky_call("rate_limit")))
print(safe_handle({"prompt": "hi"}, flaky_call("timeout")))
print(safe_handle({"prompt": "hi"}, flaky_call("crash")))
print(safe_handle({"prompt": ""}, flaky_call("ok")))`,
    hints: [
      "Order matters: catch the specific exception types (RateLimitError, TimeoutError_) before the generic Exception fallback.",
      "Every branch, success or failure, should return the same shape: ok, status, and either reply or error.",
      "Validate the prompt before entering the try block, a missing prompt is a 400, not something call_fn should ever see.",
    ],
    challenge_title: "Classify the Failure",
    challenge_description: "Map a batch of call outcomes to HTTP-style status codes and tally how many requests landed in each bucket.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    counts = {}
    for i in range(1, n + 1):
        outcome = data[i].strip()
        # TODO: map outcome to a status code:
        #   "ok" -> 200, "bad_request" -> 400, "rate_limit" -> 429,
        #   "timeout" -> 504, anything else -> 500
        # TODO: increment counts[status] by 1

    # TODO: print "code count" for each status code that appeared,
    #       sorted by code ascending, then print n on the last line

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    counts = {}
    for i in range(1, n + 1):
        outcome = data[i].strip()
        if outcome == "ok":
            status = 200
        elif outcome == "bad_request":
            status = 400
        elif outcome == "rate_limit":
            status = 429
        elif outcome == "timeout":
            status = 504
        else:
            status = 500
        counts[status] = counts.get(status, 0) + 1

    for code in sorted(counts):
        print(code, counts[code])
    print(n)

main()`,
    challenge_test_cases: [
      { input: "5\nok\nbad_request\nrate_limit\ntimeout\nok", expected_output: "200 2\n400 1\n429 1\n504 1\n5", description: "Five outcomes across four status buckets, sorted ascending by code." },
      { input: "3\nok\nok\nok", expected_output: "200 3\n3", description: "All successful calls collapse into a single 200 bucket." },
      { input: "2\nok\nweird", expected_output: "200 1\n500 1\n2", description: "Edge: an unrecognized outcome string falls back to 500." },
    ],
  },
  {
    id: "prod-22-7",
    project_id: "prod-22",
    order: 7,
    title: "Guard the Budget",
    concept: "cost caps and spend guardrails",
    explanation: `Logging and cost tracking tell you what happened. A budget guard stops something before it happens. It refuses a call that would push total spend over a limit you set, instead of you finding out at the end of the month. This is the last piece between "the demo works" and "someone left it running in a loop overnight and racked up a bill."

## A guard that tracks and enforces

\`\`\`python
class BudgetGuard:
    def __init__(self, limit_cents):
        self.limit_cents = limit_cents
        self.spent_cents = 0

    def charge(self, cost_cents):
        if self.spent_cents + cost_cents > self.limit_cents:
            return False
        self.spent_cents += cost_cents
        return True
\`\`\`

The order matters. Check before you update \`spent_cents\`. If the check fails, nothing is charged and the call never reaches the model. This is a hard cap, not a warning. Once you're at the limit, \`charge()\` returns \`False\` every time until the window resets (daily, monthly, whatever you choose).

## Wiring it into the request path

\`\`\`python
budget = BudgetGuard(limit_cents=5000)  # $50/day

def handle_request(payload):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"ok": False, "status": 400, "error": "missing prompt"}

    estimated_cost = estimate_cost(prompt)
    if not budget.charge(estimated_cost):
        return {"ok": False, "status": 402, "error": "daily budget exceeded"}

    return safe_generate({"prompt": prompt})
\`\`\`

\`402 Payment Required\` is the status code for exactly this situation, rarely used but a clean fit. The guard sits before the model call, right after input validation, so a request that would blow the budget never spends a token.

## Rate limiting is the same idea, different resource

A budget guards a dollar amount. A rate limiter guards a request count over a time window (say, 60 requests per minute). Both follow the same pattern: track a running counter, compare it to a limit, allow or reject, reset the counter on a schedule. Build one and the other is a small variation.

## Alerting, briefly

A guard that silently rejects is only half the job. You want to know before you hit the wall. In production this usually means firing a Slack or email webhook when spend crosses 80% of the cap, so a human can look before requests start getting rejected. The mechanism (an HTTP POST to a webhook URL) is simple. The part that matters is picking a threshold below 100% so you have time to react.

## The mental model

Every dollar spent clears the guard first. No exceptions, no "just this once." The guard's whole job is saying no consistently so a bug or a loop can't turn into a surprise invoice. Below, build the guard and run it against a sequence of charges.`,
    key_terms: [
      { term: "Budget guard", definition: "An object that tracks running spend and refuses any charge that would push the total past a fixed limit, before the call reaches the model." },
      { term: "Hard cap", definition: "A limit that rejects every further charge once reached, not a warning, until the window (daily, monthly) resets." },
      { term: "402 Payment Required", definition: "The rarely used HTTP status code that cleanly signals a request was refused because it would exceed the budget." },
    ],
    animated_diagrams: [
      {
        title: "Every charge clears the guard first",
        caption: "For each request, check whether spend plus this cost fits the limit. Allow and add, or deny and change nothing.",
        loop: true,
        nodes: [
          { label: "Charge request", sub: "estimated cost", detail: "A new request arrives with an estimated cost to add to the running total." },
          { label: "Would it fit?", sub: "spent + cost vs limit", detail: "Compare current spend plus this cost against the limit, before updating anything." },
          { label: "Allow or deny", sub: "under or over", detail: "If it fits, add the cost to spent and allow the call; if not, deny and leave spent untouched." },
          { label: "Next request", sub: "guard holds", detail: "Once at the limit, every later charge is denied until the window resets." },
        ],
      },
    ],
    comparison_tables: [
      {
        title: "Budget guard vs rate limiter",
        columns: ["Aspect", "Budget guard", "Rate limiter"],
        rows: [
          ["Resource guarded", "A dollar (or cent) amount", "A request count"],
          ["Window", "Per day or per month", "Per minute or per second"],
          ["Shared pattern", "Track a running counter, compare to a limit, allow or reject, reset on schedule", "Same pattern, different counter"],
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Run charges 30, 50, 25, 10 against a BudgetGuard with limit 100.",
        steps: [
          "Charge 30: 0 + 30 = 30, within 100, so allow and spent becomes 30.",
          "Charge 50: 30 + 50 = 80, within 100, so allow and spent becomes 80.",
          "Charge 25: 80 + 25 = 105, over 100, so deny and spent stays 80.",
          "Charge 10: 80 + 10 = 90, within 100, so allow and spent becomes 90.",
        ],
        output: "Allow, allow, deny, allow. Three allowed and one denied, with spend held at 80 during the denial.",
      },
    ],
    callouts: [
      { type: "warning", position: "after", title: "check before you charge", content: "Compare spent plus cost to the limit before mutating spent. Update first and a rejected charge still counts against the budget, which defeats the guard." },
    ],
    inline_quizzes: [
      {
        question: "Why must the guard compare spent + cost to the limit BEFORE adding cost to spent?",
        options: ["It reads cleaner", "So a rejected charge changes nothing; update first and a denied call still eats budget", "Python evaluates the addition lazily", "The limit changes after each charge"],
        correct_index: 1,
        explanation: "The check has to happen against the pre-charge total. If you add first and then find it is over, you have already counted a call that never ran.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "A budget guard and a rate limiter follow the same track-compare-reset pattern on different resources.", correct_answer: "true", explanation: "One guards a dollar amount and the other a request count, but both track a running counter, compare to a limit, and reset on a schedule." },
          { type: "fill_in", question: "Which HTTP status code cleanly signals a request refused for exceeding the budget?", correct_answer: "402", explanation: "402 Payment Required is the rarely used but fitting code for a budget rejection." },
        ],
      },
    ],
    starter_code: `class BudgetGuard:
    def __init__(self, limit):
        self.limit = limit
        self.spent = 0

    def charge(self, cost):
        # TODO: if self.spent + cost > self.limit, return False (don't charge)
        # TODO: otherwise add cost to self.spent and return True
        pass


guard = BudgetGuard(100)
for cost in [30, 50, 25, 10]:
    allowed = guard.charge(cost)
    print(cost, allowed, guard.spent)`,
    solution_code: `class BudgetGuard:
    def __init__(self, limit):
        self.limit = limit
        self.spent = 0

    def charge(self, cost):
        if self.spent + cost > self.limit:
            return False
        self.spent += cost
        return True


guard = BudgetGuard(100)
for cost in [30, 50, 25, 10]:
    allowed = guard.charge(cost)
    print(cost, allowed, guard.spent)`,
    hints: [
      "Compare self.spent + cost against self.limit BEFORE mutating self.spent, or a rejected charge would still get counted.",
      "A denied charge changes nothing: spent stays exactly where it was.",
      "The guard is a hard cap: once spent is at the limit, every future charge() call returns False until you reset it.",
    ],
    challenge_title: "Enforce the Daily Cap",
    challenge_description: "Process a stream of request costs against a fixed budget, allowing or denying each one in order, and report how many landed on each side.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    spent = 0
    allowed = 0
    denied = 0
    for i in range(2, 2 + n):
        cost = int(data[i].strip())
        # TODO: if spent + cost <= budget: allow it, add cost to spent, increment allowed
        # TODO: else: deny it, spent stays the same, increment denied
        # TODO: print "ALLOW <spent>" or "DENY <spent>" for this request

    # TODO: on the last line, print "<allowed> <denied>"

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0].strip())
    n = int(data[1].strip())
    spent = 0
    allowed = 0
    denied = 0
    for i in range(2, 2 + n):
        cost = int(data[i].strip())
        if spent + cost <= budget:
            spent += cost
            allowed += 1
            print("ALLOW", spent)
        else:
            denied += 1
            print("DENY", spent)

    print(allowed, denied)

main()`,
    challenge_test_cases: [
      { input: "100\n4\n30\n50\n25\n10", expected_output: "ALLOW 30\nALLOW 80\nDENY 80\nALLOW 90\n3 1", description: "Four requests against a 100-cent budget; the third would overshoot so it is denied while spend holds steady." },
      { input: "0\n1\n0", expected_output: "ALLOW 0\n1 0", description: "Edge: a zero-cost request against a zero budget is still allowed." },
      { input: "10\n1\n20", expected_output: "DENY 0\n0 1", description: "Edge: a single request that alone exceeds the budget is denied immediately." },
    ],
  },
  {
    id: "prod-22-8",
    project_id: "prod-22",
    order: 8,
    title: "Ship the Endpoint and the Dashboard",
    concept: "final deployment and the finished capstone",
    explanation: `Every piece is built: a packaged request handler, a live HTTP route, structured logs, per-call cost, an aggregated dashboard, graceful error handling, and a budget guard. This lesson wires them into one running service, deploys it, and calls the capstone done. Finishing it lands the whole build in your Portfolio as a live, monitored LLM service you can point anyone to.

## Wiring it all together

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
budget = BudgetGuard(limit_cents=5000)

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 300

@app.post("/generate")
def generate(req: GenerateRequest):
    result = safe_generate(req.model_dump())
    if result["ok"] and not budget.charge(result.get("cost_cents", 0)):
        return {"ok": False, "status": 402, "error": "daily budget exceeded"}
    write_log(make_log_record(result))
    return result

@app.get("/dashboard")
def dashboard():
    return build_dashboard(read_all_logs())

@app.get("/health")
def health():
    return {"status": "ok"}
\`\`\`

Each route is thin on purpose. It calls the functions built in earlier lessons instead of reimplementing anything. That's the payoff of packaging everything as reusable functions from lesson 1 on: the app is really three routes gluing existing pieces together.

## Deploying it

Push the code to a small platform (Render, Fly.io, Railway) or a VPS with the Dockerfile from lesson 2, set \`ANTHROPIC_API_KEY\` as an environment variable (never in code), and start the process. Now you have a public URL. \`https://your-app.onrender.com/generate\` is a real endpoint anyone can \`curl\`, and \`/dashboard\` shows real usage.

## The done checklist

Before you call it shipped, three questions, now with teeth:

1. **Runs from a clean start**: a fresh clone, one install command, one run command, no manual steps you forgot to write down.
2. **Survives bad input**: a missing prompt, a huge prompt, a burst of requests. None of them should crash the process. Lessons 6-7 exist for this.
3. **Someone else could use it**: a README with the URL, an example \`curl\` command, and what the dashboard shows.

## What actually got built

Trace the arc. Lesson 1 packaged the model call into one function. Lesson 2 put an HTTP route in front of it. Lessons 3-5 built logging, cost, and the dashboard. Lessons 6-7 hardened it against failures and runaway spend. None of that was throwaway scaffolding. It's the shape of a small production LLM service.

## Into your Portfolio

Finishing this lesson records Ship & Monitor an LLM App in your Portfolio: a live URL, what it does, and the fact that it's monitored rather than running blind. This is the capstone of the track. Every tool you've built led here, to a deployed, observable AI product with your name on it.

Below, build the final piece: a plain-text render of the dashboard, the same numbers a \`/dashboard\` route hands back as JSON, formatted for a human to read.`,
    key_terms: [
      { term: "Thin route", definition: "A web handler that only calls functions built in earlier lessons instead of reimplementing logic, so the whole app is a few routes gluing existing pieces together." },
      { term: "Environment variable", definition: "A value like ANTHROPIC_API_KEY set outside the code on the deploy platform, so a secret never lives in the source." },
      { term: "Capstone", definition: "The final project that ties every earlier tool together into one deployed, observable service, recorded in your Portfolio." },
    ],
    animated_diagrams: [
      {
        title: "The finished request pipeline",
        caption: "One request flows through validation, the budget guard, the model call, logging, and out, with the dashboard reading what the log recorded.",
        loop: false,
        nodes: [
          { label: "POST /generate", sub: "request in", detail: "A caller hits the live endpoint with a prompt over the public URL." },
          { label: "Validate + guard", sub: "input then budget", detail: "The packaged handler validates the prompt, then the budget guard clears or refuses the spend." },
          { label: "Model call", sub: "safe_generate", detail: "The guarded call runs with error handling, returning a reply or a classified failure." },
          { label: "Log it", sub: "record written", detail: "A structured record with tokens, latency, cost, and status is appended to the log." },
          { label: "Dashboard", sub: "aggregated view", detail: "GET /dashboard rolls those records into per-model and total numbers anyone can read." },
        ],
      },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Render a summary of 20 requests, 2 errors, 450 cents spent, 500 cent budget.",
        steps: [
          "error_rate = round(2 / 20 * 100) = round(10.0) = 10.",
          "budget_used = round(450 / 500 * 100) = round(90.0) = 90.",
          "Build the four lines: Requests 20, Errors 2 (10%), Cost 450 cents, Budget used 90%.",
          "Join them with newlines into one string.",
        ],
        output: "A four-line report showing a 10% error rate and 90% of the budget used, close enough to alert on.",
      },
    ],
    callouts: [
      { type: "insight", position: "after", title: "none of it was scaffolding", content: "Lesson 1 packaged the call, lesson 2 exposed it, lessons 3 to 5 added logging, cost, and the dashboard, and lessons 6 to 7 hardened it. That arc is the shape of a small production LLM service." },
    ],
    inline_quizzes: [
      {
        question: "Why keep each route in the final app thin, calling earlier functions instead of reimplementing logic?",
        options: ["Thin routes load faster", "Because packaging everything as reusable functions from lesson 1 means the app is just a few routes gluing existing, tested pieces together", "FastAPI rejects long functions", "It reduces the number of routes"],
        correct_index: 1,
        explanation: "Every route calls the functions you already built and tested. That is the payoff of the one-entry-point design: no logic gets rewritten for the web layer.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "The ANTHROPIC_API_KEY should be set as an environment variable on the deploy platform, never written in the code.", correct_answer: "true", explanation: "Secrets live in the environment, not the source, so they are not exposed in the repository." },
          { type: "fill_in", question: "Finishing this capstone records the shipped service in your ______, a live URL with your name on it.", correct_answer: "portfolio", explanation: "The capstone lands in your Portfolio as a deployed, monitored LLM service." },
        ],
      },
    ],
    starter_code: `def render_dashboard(summary):
    requests = summary["requests"]
    errors = summary["errors"]
    cost_cents = summary["cost_cents"]
    budget_cents = summary["budget_cents"]

    # TODO: error_rate = round(errors / requests * 100) if requests else 0
    # TODO: budget_used = round(cost_cents / budget_cents * 100) if budget_cents else 0
    # TODO: return a multi-line string with these four lines, in this exact order:
    #   f"Requests: {requests}"
    #   f"Errors: {errors} ({error_rate}%)"
    #   f"Cost: {cost_cents} cents"
    #   f"Budget used: {budget_used}%"
    pass


summary = {"requests": 20, "errors": 2, "cost_cents": 450, "budget_cents": 500}
print(render_dashboard(summary))`,
    solution_code: `def render_dashboard(summary):
    requests = summary["requests"]
    errors = summary["errors"]
    cost_cents = summary["cost_cents"]
    budget_cents = summary["budget_cents"]

    error_rate = round(errors / requests * 100) if requests else 0
    budget_used = round(cost_cents / budget_cents * 100) if budget_cents else 0

    lines = [
        f"Requests: {requests}",
        f"Errors: {errors} ({error_rate}%)",
        f"Cost: {cost_cents} cents",
        f"Budget used: {budget_used}%",
    ]
    return "\\n".join(lines)


summary = {"requests": 20, "errors": 2, "cost_cents": 450, "budget_cents": 500}
print(render_dashboard(summary))`,
    hints: [
      "Guard both percentage calculations against division by zero with an `if requests else 0` style check.",
      "round() on a float gives you a clean integer percent instead of something like 9.999999.",
      "Join the four lines with \"\\n\".join(lines) so render_dashboard returns one string, not four separate prints.",
    ],
    challenge_title: "Final Health Check",
    challenge_description: "Run the go/no-go gate on a smoke test before flipping the deployed service live: it must clear both an error-rate ceiling and the cost budget.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    errors = 0
    total_cost = 0
    for i in range(1, n + 1):
        status, cost = data[i].split()
        cost = int(cost)
        # TODO: if status == "error", increment errors
        # TODO: add cost to total_cost

    budget = int(data[n + 1].strip())
    # TODO: error_rate = errors * 100 // n  (integer floor percent)
    # TODO: ready = error_rate <= 20 and total_cost <= budget
    # TODO: print "READY" or "NOT READY", then error_rate, then total_cost

main()`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    errors = 0
    total_cost = 0
    for i in range(1, n + 1):
        status, cost = data[i].split()
        cost = int(cost)
        if status == "error":
            errors += 1
        total_cost += cost

    budget = int(data[n + 1].strip())
    error_rate = errors * 100 // n
    ready = error_rate <= 20 and total_cost <= budget

    print("READY" if ready else "NOT READY")
    print(error_rate)
    print(total_cost)

main()`,
    challenge_test_cases: [
      { input: "5\nok 10\nok 10\nok 10\nerror 5\nok 10\n50", expected_output: "READY\n20\n45", description: "1 of 5 calls failed (20% error rate, right at the ceiling) and total cost stays within the 50-cent budget." },
      { input: "4\nok 10\nerror 5\nerror 5\nok 10\n30", expected_output: "NOT READY\n50\n30", description: "Error rate of 50% blows past the 20% ceiling even though cost is within budget." },
      { input: "2\nok 40\nok 40\n50", expected_output: "NOT READY\n0\n80", description: "Zero errors but total cost of 80 exceeds the 50-cent budget." },
    ],
  },
  ],
}
