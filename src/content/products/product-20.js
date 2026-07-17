export default {
  project: {
    id: "prod-20",
    title: "Streaming Writing Assistant",
    description:
      "Build a small web app that streams AI-generated writing token by token, so a user watches an essay outline or email draft appear live instead of staring at a spinner. You'll wire a minimal backend endpoint that streams over Server-Sent Events and a front end that renders tokens as they arrive. Along the way you'll add the buffering that survives a choppy network and the budget guard that stops a runaway generation from quietly running up a bill.",
    difficulty: "advanced",
    category: "production_ops",
    estimated_time: 135,
    lessons_count: 8,
    tags: ["streaming", "server-sent-events", "fastapi", "web-app", "backend", "frontend"],
    order: 120,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-20-1",
      project_id: "prod-20",
      order: 1,
      title: "What Makes Text Stream Over HTTP",
      concept: "Server-Sent Events (SSE)",
      explanation: `A normal HTTP response is one round trip: the client asks, the server computes everything, then sends it back as a single block. That's fine for a JSON reply. It's also exactly why a naive "AI writing assistant" endpoint feels frozen for several seconds before the whole essay dumps onto the screen at once. This project fixes that by keeping the connection open and sending the reply in pieces as it's generated.

## The protocol we'll use: SSE

**Server-Sent Events (SSE)** is a plain-HTTP way to stream data from server to client, one direction only. There's no new protocol and no special port. The server keeps the connection open and writes small framed messages to it over time, so the response never quite finishes. Browsers and HTTP clients already read this format natively.

An SSE frame has a strict, boring shape: a line starting with \`data: \`, then the payload, then a **blank line** that marks the end of that event.

\`\`\`
data: Once

data: upon

data: a time

\`\`\`

That trailing blank line (\`\\n\\n\`) is the delimiter, not decoration. Without it, a receiver can't tell where one chunk ends and the next begins.

## Why SSE instead of a WebSocket

WebSockets are bidirectional and heavier to set up: a handshake, a different scheme, your own framing. A writing assistant only needs one direction, server to client, so SSE is the simpler correct tool. It rides on normal HTTP, works through most proxies, and browsers auto-reconnect a dropped SSE connection for you. Save WebSockets for chat-style apps where the client also needs to push data mid-stream.

## What the server actually does

\`\`\`python
def format_sse(data: str) -> str:
    return f"data: {data}\\n\\n"

for token in ["Once", "upon", "a", "time"]:
    chunk = format_sse(token)
    # in a real server this gets written to the response stream, not returned
\`\`\`

Every later lesson builds on this one function. Whatever you want to send, you wrap it in \`data: ...\\n\\n\` before it goes out the socket. A real endpoint sets the content-type header to \`text/event-stream\`, which tells the browser to hand you pieces as they arrive instead of buffering them.

## The mental model

Think of SSE as a radio broadcast rather than a phone call. The server keeps transmitting frames, and anyone tuned in receives them in order, one at a time, with a clear end-of-message marker between them. Below, you'll write the framing function by hand and run it on a list of words. No network yet, just the wire format, because every bug in later lessons traces back to getting this shape right.`,
      key_terms: [
        { term: "Server-Sent Events (SSE)", definition: "A plain-HTTP way to stream data one direction, server to client, by keeping the response open and writing framed messages over time." },
        { term: "Frame", definition: "One SSE event: a line starting with `data: `, the payload, then a blank line that marks the end of that event." },
        { term: "Delimiter", definition: "The trailing blank line (`\\n\\n`) that separates one frame from the next, so a receiver knows where a chunk ends." },
      ],
      animated_diagrams: [
        {
          title: "How one token becomes a frame",
          caption: "Each token gets wrapped in the SSE shape, then written to the open connection.",
          loop: false,
          nodes: [
            { label: "Token", sub: "one piece of text", detail: "A single word or fragment the server wants to send right now." },
            { label: "Wrap", sub: "add 'data: '", detail: "Prefix the payload with the literal 'data: ' that marks it as an SSE data line." },
            { label: "Terminate", sub: "add blank line", detail: "Append the two newlines that signal the end of this event." },
            { label: "Write to socket", sub: "send immediately", detail: "The framed bytes go straight onto the open connection instead of waiting for the whole reply." },
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Frame the tokens ['Once', 'upon'] into the SSE wire format.",
          steps: [
            "Take the first token 'Once' and wrap it: 'data: Once' then a blank line, giving data: Once then two newlines.",
            "Take 'upon' and wrap it the same way, giving data: upon then two newlines.",
            "Concatenate the two frames in order with plain string addition.",
          ],
          output: "data: Once, blank line, data: upon, blank line.",
        },
      ],
      callouts: [
        { type: "warning", position: "after", title: "the blank line is not optional", content: "A single newline does not end an SSE event. Only the double newline does. Drop it and the receiver cannot tell where one chunk stops and the next starts, and every later lesson breaks." },
      ],
      inline_quizzes: [
        {
          question: "What marks the end of a single SSE event?",
          options: ["A semicolon", "A blank line after the data line", "The word END", "A closing brace"],
          correct_index: 1,
          explanation: "Each frame is a 'data: ' line followed by a blank line. That double newline is the delimiter, not decoration.",
        },
        {
          question: "Why use SSE instead of a WebSocket for a writing assistant?",
          options: ["WebSockets cannot send text", "The assistant only needs one direction, server to client, so SSE is the simpler correct tool", "SSE is faster than every other protocol", "Browsers cannot read WebSockets"],
          correct_index: 1,
          explanation: "SSE streams one direction over normal HTTP and auto-reconnects. Save WebSockets for when the client also needs to push data mid-stream.",
        },
      ],
      starter_code: `# Format plain strings into the SSE wire format: "data: <text>\\n\\n"

def format_sse(data):
    # TODO: return f"data: {data}\\n\\n"
    pass

tokens = ["Once", "upon", "a", "time"]

stream = ""
for t in tokens:
    stream += format_sse(t)

print(stream, end="")
print("FRAMES:", stream.count("\\n\\n"))
`,
      solution_code: `# Format plain strings into the SSE wire format: "data: <text>\\n\\n"

def format_sse(data):
    return f"data: {data}\\n\\n"

tokens = ["Once", "upon", "a", "time"]

stream = ""
for t in tokens:
    stream += format_sse(t)

print(stream, end="")
print("FRAMES:", stream.count("\\n\\n"))
`,
      hints: [
        "The frame is just an f-string: 'data: ' plus the text plus two newlines.",
        "Each frame must end in a blank line, that's the '\\n\\n', not a single '\\n'.",
        "Concatenate the frames with plain string addition to build the full stream.",
      ],
      challenge_title: "Frame the Stream",
      challenge_description:
        "Format a list of text deltas into SSE data frames and report how many characters of payload were sent.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    # parse done: 'lines' holds the n delta strings, in order

    # TODO: for each line, print "data: {line}" followed by a blank line.
    # TODO: after all frames, print "TOTAL <n>" where n is the sum of
    #       len(line) over all lines (payload characters only, no "data: ").

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]

    total = 0
    for line in lines:
        print(f"data: {line}")
        print("")
        total += len(line)

    print(f"TOTAL {total}")

main()
`,
      challenge_test_cases: [
        {
          input: "2\nHello\nworld",
          expected_output: "data: Hello\n\ndata: world\n\nTOTAL 10",
          description: "Two deltas frame cleanly; TOTAL is 5 + 5 = 10 payload characters.",
        },
        {
          input: "1\nAI",
          expected_output: "data: AI\n\nTOTAL 2",
          description: "A single delta still gets its own frame and blank-line terminator.",
        },
        {
          input: "3\na b\n\nc",
          expected_output: "data: a b\n\ndata: \n\ndata: c\n\nTOTAL 4",
          description: "Edge: an empty delta still emits a valid 'data: ' frame with no payload.",
        },
      ],
    },
    {
      id: "prod-20-2",
      project_id: "prod-20",
      order: 2,
      title: "The Smallest Streaming Endpoint",
      concept: "a generator-based route",
      explanation: `You have the wire format. Now build the smallest backend that uses it: one route that keeps the connection open and yields SSE frames as a Python generator produces them.

## A generator is the whole trick

A normal route handler builds a full response, then returns it. A streaming route returns a **generator** instead, a function that \`yield\`s pieces over time instead of \`return\`ing one value. The framework reads from that generator and writes each yielded piece straight to the open socket as soon as it appears.

\`\`\`python
from flask import Flask, Response

app = Flask(__name__)

def token_stream(prompt):
    for word in fake_model_reply(prompt).split(" "):
        yield f"data: {word} \\n\\n"

@app.route("/generate")
def generate():
    prompt = request.args.get("prompt", "")
    return Response(token_stream(prompt), mimetype="text/event-stream")
\`\`\`

FastAPI does the same thing under a different name, \`StreamingResponse\`:

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.get("/generate")
def generate(prompt: str):
    return StreamingResponse(token_stream(prompt), media_type="text/event-stream")
\`\`\`

Both frameworks do the same job: hold the connection open, pull the next item from the generator when it's ready, write it out, and repeat until the generator is exhausted. Then close the connection.

## Where the real model plugs in

In production, \`token_stream\` doesn't split a fake string. It iterates the model's own streaming API and re-wraps each piece as an SSE frame:

\`\`\`python
def token_stream(prompt):
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            yield f"data: {text}\\n\\n"
\`\`\`

The endpoint's job is thin. It doesn't decide *what* to write, it just re-frames whatever the model hands it. Keep the streaming plumbing dumb and reusable, and let the model do the generating.

## Why generators, not lists

If \`token_stream\` built a list of all frames and returned it, you'd be back to waiting for the whole reply before sending anything. Streaming would be a false label on a blocking call. The generator is what makes "send as it's produced" literally true: each \`yield\` hands one piece to the framework immediately instead of accumulating.

## The mental model

A streaming endpoint is a pipe, not a bucket. A bucket fills up and then you dump it out all at once; a pipe lets water flow through as it arrives at one end. Below, build the generator and framing together in pure Python. Simulate the model's output as a list of words, wrap each in SSE, and print the assembled stream. No network yet, just the shape of the endpoint's core loop.`,
      key_terms: [
        { term: "Generator", definition: "A function that yields pieces one at a time over time instead of returning one finished value, so each piece can be sent the moment it appears." },
        { term: "yield", definition: "The keyword that hands one value out of a generator and pauses it there until the caller asks for the next value." },
        { term: "StreamingResponse", definition: "FastAPI's response type that reads from a generator and writes each yielded piece straight to the open connection." },
      ],
      animated_diagrams: [
        {
          title: "The endpoint's streaming loop",
          caption: "The framework pulls one piece from the generator, frames it, writes it, and repeats until the generator is done.",
          loop: true,
          nodes: [
            { label: "Ask generator", sub: "next piece", detail: "The framework requests the next value the generator will yield." },
            { label: "Model yields", sub: "one delta", detail: "The generator produces one piece of text, either from a fake string or the real streaming API." },
            { label: "Frame it", sub: "wrap as SSE", detail: "Re-wrap the yielded piece in 'data: ...' plus a blank line." },
            { label: "Write to socket", sub: "send now", detail: "The framed piece goes out the open connection immediately, then the loop asks for the next one." },
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Run the endpoint loop on the prompt 'the ship' with a fake stream that yields 'the ' then 'ship '.",
          steps: [
            "fake_model_stream splits on spaces and yields 'the ' first.",
            "format_sse wraps it into 'data: the \\n\\n' and it is added to the output.",
            "The loop asks again; the generator yields 'ship ', wrapped into 'data: ship \\n\\n'.",
            "The generator is exhausted, so the loop stops and the assembled stream is returned.",
          ],
          output: "data: the , blank line, data: ship , blank line.",
        },
      ],
      callouts: [
        { type: "insight", position: "after", title: "keep the plumbing dumb", content: "The endpoint never inspects or rewrites the words. It only re-frames whatever the model hands it. That is what makes the same streaming route reusable across every feature." },
      ],
      inline_quizzes: [
        {
          question: "Why return a generator instead of building a list of all frames and returning it?",
          options: ["Lists use more memory", "A returned list waits for the whole reply first, so 'streaming' would be a false label on a blocking call", "Generators are always faster", "The framework rejects lists"],
          correct_index: 1,
          explanation: "Each yield hands one piece to the framework immediately. Building a full list first means you are back to waiting for the whole reply before sending anything.",
        },
      ],
      starter_code: `# Simulate a streaming endpoint's core loop: consume tokens from a
# fake generator, wrap each in the SSE frame, and assemble the stream.

def fake_model_stream(text):
    for word in text.split(" "):
        yield word + " "

def format_sse(data):
    return f"data: {data}\\n\\n"

def run_endpoint(prompt):
    # TODO: build the full SSE stream by calling fake_model_stream(prompt)
    #       and format_sse on each yielded piece, concatenated together.
    pass

stream = run_endpoint("the ship sailed at dawn")
print(stream, end="")
`,
      solution_code: `# Simulate a streaming endpoint's core loop: consume tokens from a
# fake generator, wrap each in the SSE frame, and assemble the stream.

def fake_model_stream(text):
    for word in text.split(" "):
        yield word + " "

def format_sse(data):
    return f"data: {data}\\n\\n"

def run_endpoint(prompt):
    out = ""
    for piece in fake_model_stream(prompt):
        out += format_sse(piece)
    return out

stream = run_endpoint("the ship sailed at dawn")
print(stream, end="")
print("PIECES:", stream.count("data: "))
`,
      hints: [
        "Loop over fake_model_stream(prompt) the same way you'd loop over stream.text_stream.",
        "Wrap each yielded piece with format_sse before adding it to the output string.",
        "The endpoint's job is just re-framing, it never inspects or rewrites the words themselves.",
      ],
      challenge_title: "Consume the Token Stream",
      challenge_description:
        "Reassemble a reply from an ordered list of streamed chunks and report how many chunks it took.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    chunks = data[1:1 + n]
    # parse done: 'chunks' holds the n streamed pieces, in arrival order

    # TODO: print the full assembled text (chunks concatenated, no separator).
    # TODO: print "CHUNKS <n>" where n is the number of chunks.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    chunks = data[1:1 + n]

    assembled = "".join(chunks)
    print(assembled)
    print(f"CHUNKS {n}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nOnce \nupon \na time",
          expected_output: "Once upon a time\nCHUNKS 3",
          description: "Three chunks concatenate directly into the full reply.",
        },
        {
          input: "1\nHi",
          expected_output: "Hi\nCHUNKS 1",
          description: "A single chunk is already the whole reply.",
        },
        {
          input: "4\nThe\n end.\n\n!",
          expected_output: "The end.!\nCHUNKS 4",
          description: "Edge: an empty chunk in the middle contributes nothing but still counts.",
        },
      ],
    },
    {
      id: "prod-20-3",
      project_id: "prod-20",
      order: 3,
      title: "Chunking the Reply Into Deltas",
      concept: "delta chunking",
      explanation: `Real model APIs don't send you whole words at civilized boundaries. They send **deltas**: small, arbitrary-sized pieces of text that arrive as the model produces them. Sometimes a delta is a whole word, sometimes half a word, sometimes just punctuation. Your job as the client is to not care, and to concatenate everything in order.

## What a delta actually is

A delta is whatever text arrived in this event. Nothing promises it aligns with words, sentences, or anything meaningful on its own:

\`\`\`python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=400,
    messages=[{"role": "user", "content": "Write two sentences about rain."}],
) as stream:
    for delta in stream.text_stream:
        print(repr(delta))
\`\`\`

That might print \`'Ra'\`, then \`'in'\`, then \`' falls'\`, then \`' softly'\`, with unpredictable boundaries every run. This is why lesson 2's endpoint re-frames whatever it receives instead of buffering up to word boundaries. The API already decided the chunking; you just relay it.

## Order is the only thing that matters

Deltas are meaningless individually and only make sense **concatenated in arrival order**. Drop one, skip one, or reorder two, and the final text is corrupted. There's no close enough. The whole contract is: receive in order, join with nothing in between, done.

\`\`\`python
def reconstruct(deltas):
    return "".join(deltas)
\`\`\`

No spaces added, no separators. The deltas already contain any spacing the model produced. Adding your own separator between deltas is one of the most common streaming bugs; it silently inserts whitespace that wasn't in the original reply.

## Chunk size is a knob, not a rule

If you're chunking text yourself, say replaying a cached reply or building a demo without live network calls, you get to pick the delta size. Small chunks of a few characters feel smoother and more like live typing, but they mean more frames and slightly more overhead per character. Larger chunks are cheaper per byte but feel more like stutter-then-dump. Most production streams don't chunk at a fixed size at all: the model decides and you relay. You'll only pick a chunk size yourself when simulating or testing.

## The mental model

A delta is one puzzle piece with no picture printed on the box. You can't tell what the final image looks like from a single piece. You can only place pieces down in the order they're handed to you and trust that concatenation reveals the whole picture. Below, you'll split a full string into fixed-size deltas and prove that reconstructing it in order, with no separators, gives back the exact original.`,
      key_terms: [
        { term: "Delta", definition: "Whatever text arrived in one streaming event: sometimes a whole word, sometimes half a word, sometimes just punctuation." },
        { term: "Arrival order", definition: "The sequence deltas come in. Concatenating them in that exact order, with nothing between, is the only thing that rebuilds the reply." },
        { term: "Chunk size", definition: "The length of each delta when you split text yourself. A knob you only pick when simulating or testing, not when relaying a live model." },
      ],
      animated_diagrams: [
        {
          title: "Deltas rebuild the reply",
          caption: "Small arbitrary pieces arrive in order and concatenate, with no separators, into the exact original.",
          loop: false,
          nodes: [
            { label: "Model produces", sub: "text over time", detail: "The model generates the reply gradually as it thinks." },
            { label: "Deltas arrive", sub: "arbitrary pieces", detail: "Each event carries whatever text was ready, not aligned to word boundaries." },
            { label: "Concatenate", sub: "join in order", detail: "Append each delta to the running result with no space or separator added." },
            { label: "Full reply", sub: "exact original", detail: "The joined deltas equal the model's complete output, character for character." },
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Split 'hello world' into deltas of size 3, then reconstruct.",
          steps: [
            "Walk the string in steps of 3: indices 0, 3, 6, 9.",
            "Slice each window: 'hel', 'lo ', 'wor', 'ld'. The last slice is shorter, which is fine.",
            "Join the four deltas with no separator: 'hel' + 'lo ' + 'wor' + 'ld'.",
            "Compare the result to the original 'hello world'.",
          ],
          output: "'hello world', identical to the input, proving order plus empty separator is the whole contract.",
        },
      ],
      callouts: [
        { type: "warning", position: "after", title: "never add your own separator", content: "The deltas already contain any spacing the model produced. Joining them with a space or newline silently inserts whitespace that was not in the reply. This is one of the most common streaming bugs." },
      ],
      inline_quizzes: [
        {
          question: "How do you reconstruct the full reply from a list of deltas?",
          options: ["Join them with a space", "Join them in arrival order with no separator", "Sort them then join", "Join them with a newline between each"],
          correct_index: 1,
          explanation: "Deltas are meaningless individually. The contract is: receive in order, join with nothing in between. Any added separator corrupts the text.",
        },
      ],
      starter_code: `# Split a full reply into fixed-size deltas, then verify reconstruction
# by concatenating them back together in order.

def split_into_deltas(text, size):
    # TODO: return a list of substrings of length 'size' (the last one
    #       may be shorter), covering all of 'text' in order.
    pass

def reconstruct(deltas):
    # TODO: join the deltas back into one string, no separator.
    pass

text = "hello world"
deltas = split_into_deltas(text, 3)
print(deltas)
print(reconstruct(deltas) == text)
`,
      solution_code: `# Split a full reply into fixed-size deltas, then verify reconstruction
# by concatenating them back together in order.

def split_into_deltas(text, size):
    return [text[i:i + size] for i in range(0, len(text), size)]

def reconstruct(deltas):
    return "".join(deltas)

text = "hello world"
deltas = split_into_deltas(text, 3)
print(deltas)
print(reconstruct(deltas) == text)
print("DELTAS:", len(deltas))
`,
      hints: [
        "A range with a step equal to 'size' walks the string in fixed-size windows.",
        "Slicing past the end of a string is safe in Python, it just returns a shorter piece.",
        "reconstruct is just ''.join(deltas), no separator between pieces.",
      ],
      challenge_title: "Split Into Deltas",
      challenge_description:
        "Chunk a string into fixed-size deltas and print each on its own line, then report how many pieces it took.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    size = int(data[0])
    text = data[1]
    # parse done: 'size' is the max delta length; 'text' is the full string

    # TODO: split text into chunks of length 'size' (last one may be shorter),
    #       print each chunk on its own line, in order.
    # TODO: print "CHUNKS <n>" where n is the number of chunks produced.

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    size = int(data[0])
    text = data[1]

    chunks = [text[i:i + size] for i in range(0, len(text), size)]
    for c in chunks:
        print(c)
    print(f"CHUNKS {len(chunks)}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nhello world",
          expected_output: "hel\nlo \nwor\nld\nCHUNKS 4",
          description: "An 11-character string splits into three full 3-char chunks and one 2-char remainder.",
        },
        {
          input: "5\nAI",
          expected_output: "AI\nCHUNKS 1",
          description: "A string shorter than the chunk size becomes exactly one chunk.",
        },
        {
          input: "1\nab",
          expected_output: "a\nb\nCHUNKS 2",
          description: "Edge: a chunk size of 1 splits every character into its own piece.",
        },
      ],
    },
    {
      id: "prod-20-4",
      project_id: "prod-20",
      order: 4,
      title: "The Front End That Renders Live",
      concept: "parsing SSE on the client",
      explanation: `The backend is streaming frames. Now build the other half: a browser page that reads those frames as they arrive and paints each one onto the screen the moment it shows up, with no full-page wait.

## Reading a stream in the browser

The plain-JavaScript way uses \`fetch\` with a \`ReadableStream\` reader. You read raw bytes in whatever-sized pieces the network hands you, decode them to text, and split on the frame boundary:

\`\`\`javascript
async function renderStream(prompt, targetEl) {
  const res = await fetch("/generate?prompt=" + encodeURIComponent(prompt));
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let frames = buffer.split("\\n\\n");
    buffer = frames.pop();               // keep the incomplete tail for next read
    for (const frame of frames) {
      if (frame.startsWith("data: ")) {
        targetEl.textContent += frame.slice(6);
      }
    }
  }
}
\`\`\`

Look closely at \`frames.pop()\`. \`buffer.split("\\n\\n")\` may cut a frame in half if the network delivered fewer bytes than a full frame. The last element after splitting is whatever's left over, which might be a complete frame or a fragment. Popping it off and keeping it in \`buffer\` for the next read is what makes this safe: you never render a half-arrived chunk, only frames you know are complete.

## The DOM update is the whole point

\`targetEl.textContent += frame.slice(6)\` is the line that makes this feel alive. Each time a frame completes, you append its payload onto whatever's already on the page, so the essay draft visibly grows word by word instead of appearing as one block after a multi-second wait. \`slice(6)\` strips the \`"data: "\` prefix, six characters, and leaves just the payload.

## Why this mirrors the backend exactly

The client-side parser and the SSE format from lesson 1 are two ends of the same contract. The server promises that every event ends in a blank line, and the client's whole parsing strategy is built on trusting that promise: buffer bytes, split on \`\\n\\n\`, keep the remainder. Get the framing wrong on either side and the other side's assumptions break.

## The mental model

The reader is a person transcribing a radio broadcast live. They write down each complete sentence the instant they hear it end, but they hold an unfinished sentence in their head until the rest of it arrives. Below, you'll write that same parser in pure Python: given raw multi-frame text, split it into individual payloads, exactly what the JavaScript above does one \`fetch\` chunk at a time.`,
      key_terms: [
        { term: "ReadableStream reader", definition: "The browser object that hands you raw bytes from a fetch response in whatever-sized pieces the network delivers." },
        { term: "Incomplete tail", definition: "The last element after splitting a buffer on the frame delimiter, which may be a fragment, so you keep it for the next read instead of rendering it." },
        { term: "textContent", definition: "The DOM property you append each payload onto, so the draft visibly grows on the page instead of appearing as one block." },
      ],
      animated_diagrams: [
        {
          title: "The client read loop",
          caption: "Read bytes, decode, split on the delimiter, render complete frames, and hold the leftover tail.",
          loop: true,
          nodes: [
            { label: "Read bytes", sub: "network chunk", detail: "reader.read() returns whatever bytes arrived, which may not line up with a frame boundary." },
            { label: "Decode + buffer", sub: "append to text", detail: "Decode the bytes and add them to the running buffer string." },
            { label: "Split on \\n\\n", sub: "find frames", detail: "Splitting the buffer gives complete frames plus a possibly-incomplete last piece." },
            { label: "Keep the tail", sub: "pop the last", detail: "The final piece may be half a frame, so pop it back into the buffer for the next read." },
            { label: "Render frames", sub: "append to page", detail: "For each complete 'data: ' frame, strip the prefix and append the payload to textContent." },
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Parse the raw SSE text 'data: Hello\\n\\ndata: world\\n\\n' into payloads.",
          steps: [
            "Split on '\\n\\n', giving ['data: Hello', 'data: world', ''].",
            "The trailing empty string is not a 'data: ' frame, so it is ignored.",
            "For 'data: Hello', strip the 6-character prefix to get 'Hello'.",
            "For 'data: world', strip the prefix to get 'world'.",
          ],
          output: "['Hello', 'world'], the two payloads in order.",
        },
      ],
      inline_quizzes: [
        {
          question: "Why does the client pop the last piece after splitting the buffer on \\n\\n?",
          options: ["To save memory", "Because that last piece may be a frame that hasn't finished arriving, so it is held until more bytes come", "Because the last frame is always empty", "To reverse the order"],
          correct_index: 1,
          explanation: "A network read can cut a frame in half. Popping the tail and keeping it in the buffer means you only ever render frames you know are complete.",
        },
        {
          question: "What does frame.slice(6) do in the client parser?",
          options: ["Keeps the first 6 characters", "Strips the 'data: ' prefix, leaving just the payload", "Removes the blank line", "Trims whitespace"],
          correct_index: 1,
          explanation: "'data: ' is exactly six characters. Slicing them off leaves the payload that gets appended to the page.",
        },
      ],
      starter_code: `# Parse raw SSE text back into a list of payload strings.
# Frames are separated by a blank line ("\\n\\n"); only "data: " frames count.

def parse_sse(raw):
    # TODO: split raw on "\\n\\n" to get frame candidates.
    # TODO: keep only frames that start with "data: ", stripping that prefix.
    # TODO: return the list of payloads, in order.
    pass

raw = "data: Hello\\n\\ndata: world\\n\\n"
print(parse_sse(raw))
`,
      solution_code: `# Parse raw SSE text back into a list of payload strings.
# Frames are separated by a blank line ("\\n\\n"); only "data: " frames count.

def parse_sse(raw):
    frames = raw.split("\\n\\n")
    payloads = []
    for frame in frames:
        if frame.startswith("data: "):
            payloads.append(frame[6:])
    return payloads

raw = "data: Hello\\n\\ndata: world\\n\\n"
payloads = parse_sse(raw)
print(payloads)
print("EVENTS:", len(payloads))
`,
      hints: [
        "raw.split('\\n\\n') gives you frame candidates, including a trailing empty one to ignore.",
        "Only frames starting with the literal 'data: ' (6 characters) are real events.",
        "frame[6:] strips the prefix and leaves the payload.",
      ],
      challenge_title: "Parse the SSE Wire Format",
      challenge_description:
        "Recover the data payloads from a raw SSE stream, skipping any malformed or non-data frames.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    raw = sys.stdin.read()
    # 'raw' is the full raw SSE stream, frames separated by "\\n\\n"

    # TODO: split into frames, keep only ones starting with "data: ",
    #       and print each payload (frame with the prefix stripped) on its own line.
    # TODO: print "EVENTS <n>" where n is the number of payloads printed.

main()
`,
      challenge_solution_code: `import sys

def main():
    raw = sys.stdin.read()
    frames = raw.split("\\n\\n")

    count = 0
    for frame in frames:
        if frame.startswith("data: "):
            print(frame[6:])
            count += 1

    print(f"EVENTS {count}")

main()
`,
      challenge_test_cases: [
        {
          input: "data: Hello\n\ndata: world\n\n",
          expected_output: "Hello\nworld\nEVENTS 2",
          description: "Two well-formed data frames parse into two payloads.",
        },
        {
          input: "data: A\n\nnote: skip\n\ndata: B\n\n",
          expected_output: "A\nB\nEVENTS 2",
          description: "A frame without the 'data: ' prefix is not a valid event and is skipped.",
        },
        {
          input: "data: \n\ndata: X\n\n",
          expected_output: "\nX\nEVENTS 2",
          description: "Edge: a frame with an empty payload still counts as one event.",
        },
      ],
    },
    {
      id: "prod-20-5",
      project_id: "prod-20",
      order: 5,
      title: "Stream to Show, Store to Remember",
      concept: "assembling and saving the draft",
      explanation: `Streaming is a display trick. It changes what the user sees while the reply is generated, but on its own it does nothing to remember what got written. If your writing assistant needs a "continue this draft" or "regenerate" button, you need the complete text saved somewhere the moment the stream ends, not just painted onto the screen and forgotten.

## Two separate jobs

- **Stream to show**: append each delta to the page as it arrives, so the user watches the draft appear live.
- **Store to remember**: once the stream finishes, take the full assembled text and save it into a history list, a database row, a file, whatever your app needs next.

\`\`\`python
def generate_and_store(prompt, history):
    full_reply = ""
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=600,
        messages=history + [{"role": "user", "content": prompt}],
    ) as stream:
        for delta in stream.text_stream:
            print(delta, end="", flush=True)   # show
            full_reply += delta                # accumulate

    history.append({"role": "user", "content": prompt})
    history.append({"role": "assistant", "content": full_reply})  # remember
    return full_reply
\`\`\`

\`full_reply\` is built the same way as lesson 3's \`reconstruct\`: concatenate deltas, in order, no separators. The printing and the accumulating happen in the same loop, but they do different jobs. One is for the user's eyes, one is for your data.

## Why a writing assistant especially needs this

A summarizer or chatbot needs history so the model remembers earlier turns. A writing assistant needs it for a slightly different reason: users iterate. "Make the second paragraph shorter," "give me a punchier opening", these follow-ups only make sense if the assistant can see the draft it just streamed. Skip the store step and every regenerate starts from nothing. The model has no memory of what it just wrote, even though the user watched it happen a second ago.

## The failure mode this prevents

Picture a UI that streams beautifully, tokens flowing onto the page, users happy, but the JavaScript never saves the assembled text. Refresh the page and the draft is gone. Ask for a revision and the model has no prior draft to revise. The stream looked complete, but nothing was stored, and that gap stays invisible until a user hits it.

## The mental model

Streaming is the live performance; storing is the recording. An audience watching a concert still needs someone to hit record if anyone's going to hear it again. Below, you'll assemble a streamed reply from its chunks and append it as a new turn onto a growing history list, the store half of "stream to show, store to remember."`,
      key_terms: [
        { term: "Stream to show", definition: "Appending each delta to the page as it arrives so the user watches the draft appear live." },
        { term: "Store to remember", definition: "Saving the full assembled text once the stream ends, into history or a database, so the draft survives past the screen." },
        { term: "History", definition: "The running list of user and assistant turns that lets a follow-up like 'make it shorter' refer to the draft the model just wrote." },
      ],
      animated_diagrams: [
        {
          title: "One loop, two jobs",
          caption: "Each delta is both painted to the screen and accumulated into the full reply, then saved when the stream ends.",
          loop: true,
          nodes: [
            { label: "Delta arrives", sub: "one piece", detail: "The next streamed piece of the model's reply comes in." },
            { label: "Show it", sub: "paint to page", detail: "Append the delta to the screen so the user sees the draft grow live." },
            { label: "Accumulate", sub: "add to full_reply", detail: "Concatenate the same delta onto the growing full_reply string." },
            { label: "Stream ends", sub: "save the turn", detail: "Once no more deltas arrive, append the complete reply to history as an assistant turn." },
          ],
        },
      ],
      comparison_tables: [
        {
          title: "Show versus store",
          columns: ["Aspect", "Stream to show", "Store to remember"],
          rows: [
            ["When it runs", "During the stream, per delta", "Once, after the stream ends"],
            ["What it touches", "The DOM / screen", "History, a database, or a file"],
            ["If you skip it", "User sees a spinner, not live text", "Refresh loses the draft; regenerate has nothing to revise"],
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Assemble the chunks ['Waves ', 'crash ', 'softly'] and append the reply to a one-turn history.",
          steps: [
            "Join the chunks with no separator: 'Waves ' + 'crash ' + 'softly' = 'Waves crash softly'.",
            "The user turn is already in history from before the stream.",
            "Append an assistant turn holding the assembled reply.",
            "History now has two turns, and the last one is the assistant's reply.",
          ],
          output: "History length 2, last turn = assistant 'Waves crash softly'.",
        },
      ],
      inline_quizzes: [
        {
          question: "Why does a writing assistant especially need to store the assembled draft?",
          options: ["To make streaming faster", "Because users iterate; a follow-up like 'shorten the second paragraph' only works if the assistant can see the draft it just streamed", "Because the model requires it", "To reduce token cost"],
          correct_index: 1,
          explanation: "Streaming only shows the draft. Without storing it, every regenerate starts from nothing and the model has no memory of what it just wrote.",
        },
      ],
      starter_code: `# Assemble a streamed reply from its chunks, then append it as a new
# assistant turn onto the existing conversation history.

def assemble(chunks):
    # TODO: join the chunks into the full reply text, no separator.
    pass

def store(history, prompt, reply):
    # TODO: append only an assistant turn for 'reply' onto 'history' (the user
    #       turn is already there); mutate the list in place, then return it.
    pass

history = [{"role": "user", "content": "Write me a haiku about the sea"}]
chunks = ["Waves ", "crash ", "softly"]

reply = assemble(chunks)
history = store(history, "Write me a haiku about the sea", reply)
print(len(history), history[-1])
`,
      solution_code: `# Assemble a streamed reply from its chunks, then append it as a new
# assistant turn onto the existing conversation history.

def assemble(chunks):
    return "".join(chunks)

def store(history, prompt, reply):
    history.append({"role": "assistant", "content": reply})
    return history

history = [{"role": "user", "content": "Write me a haiku about the sea"}]
chunks = ["Waves ", "crash ", "softly"]

reply = assemble(chunks)
history = store(history, "Write me a haiku about the sea", reply)
print(len(history), history[-1])
`,
      hints: [
        "assemble is just ''.join(chunks), same as lesson 3's reconstruct.",
        "store only needs to append the assistant turn here, the user turn is already in history.",
        "history.append mutates the list in place; returning it too just makes the flow explicit.",
      ],
      challenge_title: "Assemble and Append the Draft",
      challenge_description:
        "Reassemble a streamed reply from its chunks, append it to a conversation history, and report the final state.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx]); idx += 1
    history = []
    for _ in range(m):
        role, content = data[idx].split(" ", 1); idx += 1
        history.append((role, content))
    n = int(data[idx]); idx += 1
    chunks = data[idx:idx + n]
    # parse done: 'history' holds m prior (role, content) turns;
    #             'chunks' holds the n streamed pieces of the new reply

    # TODO: assemble the chunks into the full reply (no separator).
    # TODO: append ("assistant", reply) onto history.
    # TODO: print "TURNS <len(history)>".
    # TODO: print "LAST assistant <reply>".

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    idx = 0
    m = int(data[idx]); idx += 1
    history = []
    for _ in range(m):
        role, content = data[idx].split(" ", 1); idx += 1
        history.append((role, content))
    n = int(data[idx]); idx += 1
    chunks = data[idx:idx + n]

    reply = "".join(chunks)
    history.append(("assistant", reply))

    print(f"TURNS {len(history)}")
    print(f"LAST assistant {reply}")

main()
`,
      challenge_test_cases: [
        {
          input: "1\nuser Write me a haiku about the sea\n3\nWaves \ncrash \nsoftly",
          expected_output: "TURNS 2\nLAST assistant Waves crash softly",
          description: "One prior turn plus the newly assembled assistant reply gives two total turns.",
        },
        {
          input: "0\n2\nHi \nthere",
          expected_output: "TURNS 1\nLAST assistant Hi there",
          description: "With no prior history, the assembled reply becomes the only turn.",
        },
        {
          input: "2\nuser draft an email\nassistant Sure, on what topic?\n1\nDone",
          expected_output: "TURNS 3\nLAST assistant Done",
          description: "Edge: appending onto an existing two-turn history yields three turns total.",
        },
      ],
    },
    {
      id: "prod-20-6",
      project_id: "prod-20",
      order: 6,
      title: "Buffers Don't Respect Your Frame Boundaries",
      concept: "partial-frame buffering",
      explanation: `Real networks don't deliver data in tidy, frame-sized packages. A single \`read()\` on the client might return half of an SSE frame, or three and a half frames, cut off wherever the network happened to hand you bytes. If your parser assumes every read boundary lines up with a frame boundary, it will occasionally slice a payload in half or drop a frame that arrived split across two reads.

## The buffering rule

Whenever you receive raw bytes from a stream, **append them to a running buffer**, then split that buffer on the frame delimiter (\`\\n\\n\`). Every piece except the last one is a **complete** frame, safe to process. The last piece is whatever's left after the final delimiter you found. It might be empty, meaning the stream ended cleanly, or it might be a real frame that hasn't finished arriving. Either way, you hold it back and wait for more data before treating it as complete.

\`\`\`python
buffer = ""

def on_network_chunk(raw_bytes_as_text):
    global buffer
    buffer += raw_bytes_as_text
    frames = buffer.split("\\n\\n")
    buffer = frames.pop()          # last piece may be incomplete, keep it
    for frame in frames:
        if frame.startswith("data: "):
            handle(frame[6:])       # only complete frames reach here
\`\`\`

This is the same \`frames.pop()\` move from lesson 4's JavaScript reader, now in Python, because it's a network-level problem rather than a language-level one. Whatever language you write the client in, the fix is identical: buffer, split, hold the tail.

## Why the tail can't just be processed anyway

Suppose a chunk splits mid-frame: \`"data: hello wo"\` arrives, then \`"rld\\n\\n"\` arrives a moment later. Process \`"data: hello wo"\` immediately as if it were complete and you've rendered a broken half-word to the user, then lost the rest when the second half arrives with no matching frame to attach it to. Holding the incomplete tail and prepending the next chunk to it is what stitches \`"data: hello wo"\` and \`"rld\\n\\n"\` back into the single frame they always were.

## Applying this to a whole finished transcript

If you're handed a complete raw stream all at once, a saved log, a test fixture, a full response body, the same logic applies: split on \`\\n\\n\`, and treat only the pieces **before** the final split as guaranteed complete. If the stream ends without a trailing \`\\n\\n\`, that last piece is an unfinished frame that was cut off, and it's correctly discarded rather than rendered as garbled text.

## The mental model

You're assembling a jigsaw puzzle from a box that gets refilled while you work. You never place a piece you're not sure is whole; you set uncertain pieces aside and check again once more pieces arrive. Below, you'll implement exactly that: recover every complete frame from a raw stream, and drop anything left dangling at the end.`,
      key_terms: [
        { term: "Partial frame", definition: "A frame cut in half because the network delivered fewer bytes than a full frame in one read." },
        { term: "Running buffer", definition: "A string you append every received chunk onto, so a frame split across two reads can be stitched back together." },
        { term: "Holding the tail", definition: "Keeping the last split piece unprocessed until more data arrives, since it may be an unfinished frame." },
      ],
      animated_diagrams: [
        {
          title: "Buffer, split, hold the tail",
          caption: "Each network chunk joins the buffer; complete frames are processed, the leftover tail waits.",
          loop: true,
          nodes: [
            { label: "Chunk arrives", sub: "raw bytes", detail: "A network read delivers bytes cut off wherever the network happened to stop." },
            { label: "Append to buffer", sub: "join running text", detail: "Add the new bytes to the buffer, stitching them onto any leftover tail from last time." },
            { label: "Split on \\n\\n", sub: "find boundaries", detail: "Splitting gives every complete frame plus a last piece that may be unfinished." },
            { label: "Pop the tail", sub: "keep for later", detail: "Remove the last piece and hold it in the buffer until more data arrives." },
            { label: "Process frames", sub: "only complete ones", detail: "Handle every frame before the tail, since those are guaranteed whole." },
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "medium",
          prompt: "Recover frames from 'data: full\\n\\ndata: partial' (no trailing blank line).",
          steps: [
            "Split on '\\n\\n', giving ['data: full', 'data: partial'].",
            "Drop the last piece with frames[:-1], because it is never treated as complete.",
            "That leaves ['data: full'] as the only guaranteed-complete frame.",
            "Strip the 'data: ' prefix from it to get 'full'. 'data: partial' is correctly discarded as unfinished.",
          ],
          output: "['full'], with the dangling partial frame dropped.",
        },
      ],
      callouts: [
        { type: "warning", position: "after", title: "never render the tail as-is", content: "Process 'data: hello wo' before its second half arrives and you paint a broken half-word, then lose the rest when 'rld\\n\\n' shows up with no frame to attach to. Always hold the tail." },
      ],
      inline_quizzes: [
        {
          question: "After splitting a stream on \\n\\n, which pieces are safe to process?",
          options: ["All of them", "Every piece except the last one", "Only the first one", "Only the last one"],
          correct_index: 1,
          explanation: "Every piece before the final split is a complete frame. The last piece may be empty or a frame that hasn't finished arriving, so you hold it back.",
        },
      ],
      starter_code: `# Recover complete SSE frames from a raw stream, dropping any
# incomplete trailing frame that hasn't finished arriving.

def recover_frames(raw):
    # TODO: split raw on "\\n\\n". Every piece EXCEPT the last is a
    #       complete frame candidate; drop the last piece entirely.
    # TODO: from the complete frames, keep only ones starting with
    #       "data: ", stripped of that prefix, and return them as a list.
    pass

raw = "data: full\\n\\ndata: partial"
print(recover_frames(raw))
`,
      solution_code: `# Recover complete SSE frames from a raw stream, dropping any
# incomplete trailing frame that hasn't finished arriving.

def recover_frames(raw):
    frames = raw.split("\\n\\n")
    complete = frames[:-1]
    payloads = [f[6:] for f in complete if f.startswith("data: ")]
    return payloads

raw = "data: full\\n\\ndata: partial"
print(recover_frames(raw))

raw2 = "data: A\\n\\ndata: BC\\n\\n"
print(recover_frames(raw2))
`,
      hints: [
        "frames[:-1] drops the last split piece, which may be empty or an unfinished frame.",
        "A stream that ends cleanly with '\\n\\n' just makes that dropped last piece an empty string, harmless.",
        "A stream cut off mid-frame makes that dropped last piece the dangling partial text, correctly discarded.",
      ],
      challenge_title: "Recover the Stream, Drop the Incomplete Tail",
      challenge_description:
        "Parse a raw SSE stream into complete data payloads, discarding any frame left unfinished at the end.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    raw = sys.stdin.read()
    # 'raw' is the full raw stream received so far; it may or may not
    # end with a complete "\\n\\n" terminator.

    # TODO: split on "\\n\\n"; the LAST piece is never treated as complete
    #       (drop it, whether it's empty or a dangling partial frame).
    # TODO: from the remaining complete pieces, keep only "data: " frames,
    #       print each payload on its own line, then print "EVENTS <n>".

main()
`,
      challenge_solution_code: `import sys

def main():
    raw = sys.stdin.read()
    frames = raw.split("\\n\\n")
    complete = frames[:-1]

    count = 0
    for frame in complete:
        if frame.startswith("data: "):
            print(frame[6:])
            count += 1

    print(f"EVENTS {count}")

main()
`,
      challenge_test_cases: [
        {
          input: "data: A\n\ndata: BC\n\n",
          expected_output: "A\nBC\nEVENTS 2",
          description: "A stream ending cleanly with '\\n\\n' recovers both complete frames.",
        },
        {
          input: "data: full\n\ndata: partial",
          expected_output: "full\nEVENTS 1",
          description: "The dangling 'data: partial' frame at the end was never finished and is discarded.",
        },
        {
          input: "",
          expected_output: "EVENTS 0",
          description: "Edge: an empty stream (nothing received yet) recovers zero events.",
        },
      ],
    },
    {
      id: "prod-20-7",
      project_id: "prod-20",
      order: 7,
      title: "Streaming Still Costs Tokens",
      concept: "budget-aware streaming",
      explanation: `Streaming changes how a reply *feels*, not what it *costs*. Every token the model generates is billed, whether you display it all at once or one piece at a time. A writing assistant that lets users generate long drafts on repeat needs a way to cap spend and stop generation early, without waiting for the model to decide it's done on its own.

## The token estimate you already know

Same rough rule as everywhere else in this track: about four characters per token in English.

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

As chunks stream in, keep a running total. The moment the next chunk would push you over budget, stop consuming, close the connection, and truncate the draft, rather than letting the model keep generating (and billing) past the limit you set.

## Stopping a live stream, for real

With the Anthropic SDK, closing the \`with\` block early ends the request. You don't have to let \`stream.text_stream\` run to exhaustion:

\`\`\`python
def stream_within_budget(prompt, budget_tokens):
    used = 0
    full_reply = ""
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for delta in stream.text_stream:
            cost = estimate_tokens(delta)
            if used + cost > budget_tokens:
                break                      # stop consuming, connection closes
            used += cost
            full_reply += delta
    return full_reply, used
\`\`\`

The \`break\` inside the \`with\` block is what actually stops the spend. Once you exit the context manager without draining the stream, the SDK closes the connection instead of paying for tokens you'll never show anyone.

## Why check *before* adding, not after

The check happens before \`used\` is updated: \`if used + cost > budget_tokens\`. That guarantees you never report a total over the budget and never include a chunk that would have pushed you over. Checking after the fact ("stop once we're over") means you always slightly overshoot, the kind of off-by-one that turns "budget: 1000 tokens" into "actually billed 1050."

## Why this matters for a writing assistant specifically

Essay drafts, email rewrites, and outline generators are exactly what users click "regenerate" on repeatedly. Without a budget guard, a single runaway prompt, or a user mashing the button, can quietly rack up a large bill across dozens of long, unwatched generations. A budget check turns "hope it stays cheap" into "guaranteed under this number."

## The mental model

A budget guard is a meter running next to a taxi, not a fixed fare. You don't know the exact final cost in advance, so you watch the running total live and pull over the moment it hits your limit, instead of finding out the damage only after the ride ends. Below, consume a list of chunks against a token budget, stopping the moment the next one would exceed it.`,
      key_terms: [
        { term: "Token estimate", definition: "A rough count of tokens from text length, about four characters per token in English, used to track spend without an exact tokenizer." },
        { term: "Budget guard", definition: "A running total checked against a cap, that stops generation early instead of waiting for the model to finish on its own." },
        { term: "Check before adding", definition: "Testing 'used + cost > budget' before updating the total, so you never include a chunk that pushes you over or report a total above the cap." },
      ],
      animated_diagrams: [
        {
          title: "The budget-guarded stream loop",
          caption: "For each chunk, estimate its cost, check against the budget, then either keep it or stop the stream.",
          loop: true,
          nodes: [
            { label: "Next chunk", sub: "one delta", detail: "Pull the next streamed piece from the model." },
            { label: "Estimate cost", sub: "tokens for this", detail: "About one token per four characters, at least one token." },
            { label: "Would exceed?", sub: "used + cost > budget", detail: "Check before adding, so an over-budget chunk is caught before it counts." },
            { label: "Keep or break", sub: "add or stop", detail: "Under budget: add the cost and keep the chunk. Over: break the loop and close the connection." },
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "medium",
          prompt: "Consume ['abcd', 'efgh', 'ijkl'] against a budget of 2 tokens.",
          steps: [
            "estimate_tokens('abcd') = max(1, 4 // 4) = 1. used(0) + 1 = 1, not over 2, so keep it. used = 1.",
            "estimate_tokens('efgh') = 1. used(1) + 1 = 2, not over 2, so keep it. used = 2.",
            "estimate_tokens('ijkl') = 1. used(2) + 1 = 3, which is over 2, so break before adding.",
            "Two chunks were kept; the third and any later chunks are dropped.",
          ],
          output: "('abcdefgh', used=2, kept=2), truncated because one chunk was dropped.",
        },
      ],
      callouts: [
        { type: "insight", position: "after", title: "the break is what saves money", content: "Exiting the with block without draining the stream tells the SDK to close the connection. That is what actually stops the spend, not just skipping the display of tokens you already paid for." },
      ],
      inline_quizzes: [
        {
          question: "Why check 'used + cost > budget' before adding the cost instead of after?",
          options: ["It runs faster", "So you never include a chunk that pushes you over budget and never report a total above the cap", "Because addition is slow", "The SDK requires it"],
          correct_index: 1,
          explanation: "Checking after the fact always slightly overshoots. Checking before adding guarantees the reported total stays at or under the budget.",
        },
      ],
      starter_code: `# Consume streamed chunks against a token budget, stopping BEFORE
# any chunk that would push the running total over the limit.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def stream_within_budget(chunks, budget):
    # TODO: walk chunks in order, tracking a running token total.
    # TODO: before adding a chunk, check if used + its cost would exceed
    #       budget; if so, stop (do not include this or later chunks).
    # TODO: return (assembled_text, tokens_used, kept_count).
    pass

chunks = ["abcd", "efgh", "ijkl"]
text, used, kept = stream_within_budget(chunks, 2)
print(text, used, kept)
`,
      solution_code: `# Consume streamed chunks against a token budget, stopping BEFORE
# any chunk that would push the running total over the limit.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def stream_within_budget(chunks, budget):
    used = 0
    kept = 0
    out = ""
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if used + cost > budget:
            break
        used += cost
        out += chunk
        kept += 1
    return out, used, kept

chunks = ["abcd", "efgh", "ijkl"]
text, used, kept = stream_within_budget(chunks, 2)
print(text, used, kept)
print("TRUNCATED:", kept < len(chunks))
`,
      hints: [
        "Check 'used + cost > budget' BEFORE adding, so you never report a total over budget.",
        "Break out of the loop entirely on the first chunk that would exceed budget, don't skip and continue.",
        "A budget of 0 should stop before even the first chunk, since any chunk costs at least 1 token.",
      ],
      challenge_title: "Stop Within the Token Budget",
      challenge_description:
        "Consume streamed chunks against a token budget, stopping before the running total would exceed it, and report the outcome.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    chunks = data[2:2 + n]
    # parse done: 'budget' is the token cap; 'chunks' is the ordered stream

    # TODO: walk chunks in order with a running token total, stopping
    #       BEFORE any chunk that would push the total over budget.
    # TODO: print the assembled text kept so far (may be empty).
    # TODO: print "KEPT <count>", "TOKENS <total>", "TRUNCATED <True/False>"
    #       (True if fewer chunks were kept than were given).

main()
`,
      challenge_solution_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    chunks = data[2:2 + n]

    used = 0
    kept = 0
    out = ""
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if used + cost > budget:
            break
        used += cost
        out += chunk
        kept += 1

    print(out)
    print(f"KEPT {kept}")
    print(f"TOKENS {used}")
    print(f"TRUNCATED {kept < n}")

main()
`,
      challenge_test_cases: [
        {
          input: "2\n3\nabcd\nefgh\nijkl",
          expected_output: "abcdefgh\nKEPT 2\nTOKENS 2\nTRUNCATED True",
          description: "A budget of 2 admits two 1-token chunks, then stops before the third would make it 3.",
        },
        {
          input: "100\n2\nHi \nthere",
          expected_output: "Hi there\nKEPT 2\nTOKENS 2\nTRUNCATED False",
          description: "A generous budget keeps every chunk with no truncation.",
        },
        {
          input: "0\n1\nword",
          expected_output: "\nKEPT 0\nTOKENS 0\nTRUNCATED True",
          description: "Edge: a budget of 0 stops before even the first chunk, since any chunk costs at least 1 token.",
        },
      ],
    },
    {
      id: "prod-20-8",
      project_id: "prod-20",
      order: 8,
      title: "Ship the Streaming Writing Assistant",
      concept: "packaging the full app",
      explanation: `Everything so far has been pieces: framing, a generator route, delta chunking, a client parser, storing the draft, buffering, budget guards. Shipping means wiring all of it into one small, runnable web app. Finish this lesson and the build lands in your **Portfolio**.

## The shape of the finished app

Two files cover it:

- **A backend** (Flask or FastAPI) with one route that streams SSE frames from the model, exactly like lesson 2, wrapped with lesson 7's budget guard.
- **A single \`index.html\`** with a textarea for the writing prompt, a "Generate" button, and a \`<div>\` the JavaScript from lesson 4 appends tokens into live.

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, HTMLResponse

app = FastAPI()

@app.get("/")
def index():
    return HTMLResponse(open("index.html").read())

@app.get("/generate")
def generate(prompt: str):
    def stream():
        used = 0
        with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        ) as s:
            for delta in s.text_stream:
                cost = estimate_tokens(delta)
                if used + cost > TOKEN_BUDGET:
                    break
                used += cost
                yield f"data: {delta}\\n\\n"
    return StreamingResponse(stream(), media_type="text/event-stream")
\`\`\`

Run it with \`uvicorn app:app --reload\`, open \`http://localhost:8000\`, type a prompt, click Generate, and watch the draft appear live. That's the whole product.

## What "shipped" means here

Same checks as every build in this track. It runs from a clean start with one command (\`uvicorn app:app\`). It survives an empty prompt or a dropped connection without crashing, thanks to lessons 6 and 7's guards. And someone else could point their browser at it and use it with no explanation beyond "type a prompt, click Generate."

## Don't skip the harden lessons in the real build

It's tempting to wire the happy path (lessons 1-5) and call it done. The two harden lessons are what keep this from breaking the first time a user's connection hiccups or someone leaves a huge budget-less prompt running: buffer partial frames on the client (lesson 6), and cap spend with a token budget on the server (lesson 7). A demo that only works on a fast, stable connection isn't shipped. It's a screen recording waiting to happen.

## Into your Portfolio

Finishing this lesson records the Streaming Writing Assistant in your **Portfolio** tab: its title, what it does, and that it's built. Keep an example prompt and a screenshot of it mid-stream next to it as proof it works. A live-streaming UI is one of the more visually convincing things you can put on your shelf of built products.

## The mental model

A shipped streaming app hides all of this lesson's plumbing behind one button. The user never thinks about SSE frames, buffers, or token budgets; they just watch words appear. Below, wire the pipeline end to end in pure Python: chunk a reply, frame it, parse it back, and enforce the budget. One function that does what your whole app does, the last piece before it's done.`,
      key_terms: [
        { term: "Pipeline", definition: "The end-to-end chain of steps a reply passes through: chunk, frame, parse, budget-check, in that order." },
        { term: "Happy path", definition: "The flow that works when everything goes right. Lessons 1 to 5 build it; the harden lessons 6 and 7 keep it standing under real conditions." },
        { term: "Shipped", definition: "Runs from a clean start with one command, survives an empty prompt or dropped connection, and needs no explanation beyond type a prompt and click Generate." },
      ],
      animated_diagrams: [
        {
          title: "The whole app in one pass",
          caption: "The four earlier lessons chain into one pipeline from raw text to budget-checked payloads.",
          loop: false,
          nodes: [
            { label: "Chunk", sub: "lesson 3", detail: "Split the reply into fixed-size deltas." },
            { label: "Frame", sub: "lesson 1", detail: "Wrap each delta as 'data: ...' plus a blank line into one raw stream." },
            { label: "Parse", sub: "lesson 6", detail: "Split the raw stream back into payloads, dropping the always-incomplete last piece." },
            { label: "Budget", sub: "lesson 7", detail: "Consume the payloads against the token cap, stopping before any that would exceed it." },
            { label: "Result", sub: "assembled draft", detail: "Return the kept text plus counts, exactly what the running app would show and bill." },
          ],
        },
      ],
      worked_examples: [
        {
          difficulty: "medium",
          prompt: "Run the pipeline on 'hello world' with chunk_size 4 and budget 2.",
          steps: [
            "Chunk into size-4 deltas: ['hell', 'o wo', 'rld'], so 3 chunks are sent.",
            "Frame each and concatenate, then parse back into payloads ['hell', 'o wo', 'rld'].",
            "Budget loop: 'hell' costs 1, kept (used 1). 'o wo' costs 1, kept (used 2). 'rld' costs 1, would make 3, over budget 2, so break.",
            "Two chunks kept, one dropped, so the draft is truncated.",
          ],
          output: "('hello wo', chunks_sent=3, chunks_kept=2, tokens_used=2), truncated.",
        },
      ],
      callouts: [
        { type: "warning", position: "after", title: "the harden lessons are not optional", content: "Wiring only lessons 1 to 5 gives a demo that works on a fast, stable connection and breaks the first time a connection hiccups or a budget-less prompt runs long. Buffering and the budget guard are what make it shippable." },
      ],
      inline_quizzes: [
        {
          question: "Why keep the buffering and budget lessons in the real build instead of just the happy path?",
          options: ["They make it faster", "They keep the app from breaking when a connection hiccups or a long prompt runs without a spend cap", "They are required by FastAPI", "They reduce the file count"],
          correct_index: 1,
          explanation: "A demo that only works on a fast, stable connection is not shipped. Partial-frame buffering and the token budget are what let it survive real use.",
        },
      ],
      starter_code: `# The full pipeline in one function: chunk a reply, frame it as SSE,
# parse the frames back, and enforce a token budget on what's kept.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def run_pipeline(text, chunk_size, budget):
    # TODO: split 'text' into chunks of length chunk_size (lesson 3).
    # TODO: frame each chunk as "data: {chunk}\\n\\n" and concatenate
    #       into one raw stream string (lesson 1).
    # TODO: parse the raw stream back into payloads, dropping the last
    #       (always-incomplete) split piece (lesson 6).
    # TODO: consume the payloads against the token budget, stopping
    #       BEFORE any payload that would exceed it (lesson 7).
    # TODO: return (assembled_text, chunks_sent, chunks_kept, tokens_used).
    pass

result = run_pipeline("hello world", 4, 2)
print(result)
`,
      solution_code: `# The full pipeline in one function: chunk a reply, frame it as SSE,
# parse the frames back, and enforce a token budget on what's kept.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def run_pipeline(text, chunk_size, budget):
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    raw = ""
    for c in chunks:
        raw += f"data: {c}\\n\\n"

    frames = raw.split("\\n\\n")[:-1]
    payloads = [f[6:] for f in frames if f.startswith("data: ")]

    used = 0
    kept = 0
    out = ""
    for p in payloads:
        cost = estimate_tokens(p)
        if used + cost > budget:
            break
        used += cost
        out += p
        kept += 1

    return out, len(chunks), kept, used

result = run_pipeline("hello world", 4, 2)
print(result)
print("Streaming Writing Assistant built. Saved to your Portfolio.")
`,
      hints: [
        "Reuse the exact same steps from lessons 3, 1, 6, and 7 in order, this lesson just chains them.",
        "Frame every chunk first into one raw string, then parse it back, don't skip straight to the payloads.",
        "The budget loop is identical to lesson 7: check before adding, stop on the first chunk that would exceed it.",
      ],
      challenge_title: "End-to-End Stream Round Trip",
      challenge_description:
        "Chunk a reply, frame it as SSE, parse the frames back, and enforce a token budget, all in one pipeline.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    chunk_size = int(data[0])
    budget = int(data[1])
    text = data[2]
    # parse done: 'chunk_size' for splitting, 'budget' in tokens, 'text' the full reply

    # TODO: split text into chunks of length chunk_size.
    # TODO: frame each as "data: {chunk}\\n\\n", concatenate into one raw stream.
    # TODO: parse the raw stream back into payloads, dropping the last split piece.
    # TODO: consume payloads against the budget, stopping BEFORE any that would exceed it.
    # TODO: print the assembled text, then "CHUNKS_SENT <n>", "CHUNKS_KEPT <k>",
    #       "TOKENS <total>", "TRUNCATED <True/False>".

main()
`,
      challenge_solution_code: `import sys

def estimate_tokens(text):
    return max(1, len(text) // 4)

def main():
    data = sys.stdin.read().split("\\n")
    chunk_size = int(data[0])
    budget = int(data[1])
    text = data[2]

    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    raw = ""
    for c in chunks:
        raw += f"data: {c}\\n\\n"

    frames = raw.split("\\n\\n")[:-1]
    payloads = [f[6:] for f in frames if f.startswith("data: ")]

    used = 0
    kept = 0
    out = ""
    for p in payloads:
        cost = estimate_tokens(p)
        if used + cost > budget:
            break
        used += cost
        out += p
        kept += 1

    print(out)
    print(f"CHUNKS_SENT {len(chunks)}")
    print(f"CHUNKS_KEPT {kept}")
    print(f"TOKENS {used}")
    print(f"TRUNCATED {kept < len(chunks)}")

main()
`,
      challenge_test_cases: [
        {
          input: "4\n2\nhello world",
          expected_output: "hello wo\nCHUNKS_SENT 3\nCHUNKS_KEPT 2\nTOKENS 2\nTRUNCATED True",
          description: "Three chunks are produced but the budget of 2 only admits the first two before stopping.",
        },
        {
          input: "5\n100\nAI ships",
          expected_output: "AI ships\nCHUNKS_SENT 2\nCHUNKS_KEPT 2\nTOKENS 2\nTRUNCATED False",
          description: "A generous budget keeps every chunk, and the round trip reproduces the original text exactly.",
        },
        {
          input: "3\n0\nhi",
          expected_output: "\nCHUNKS_SENT 1\nCHUNKS_KEPT 0\nTOKENS 0\nTRUNCATED True",
          description: "Edge: a budget of 0 stops before the first chunk is kept, even though one chunk was sent.",
        },
      ],
    },
  ],
};
