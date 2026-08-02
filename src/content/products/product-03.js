const project = {
  id: "prod-03",
  title: "Flashcard Maker",
  description:
    "Build a command-line tool that turns a block of messy study notes into a clean deck of question/answer flashcards. It extracts facts with the model, dedupes them, and exports the deck to a CSV file that imports straight into Anki.",
  difficulty: "beginner",
  category: "foundations",
  estimated_time: 120,
  lessons_count: 8,
  tags: ["flashcards", "extraction", "json-output", "dedup", "csv-export", "anki"],
  order: 103,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-03-1",
    project_id: "prod-03",
    order: 1,
    title: "Notes In, One Card Out",
    concept: "the flashcard loop",
    explanation: `You're going to build a tool that eats your messy class notes and hands back a clean deck of study flashcards, then exports them so they drop straight into Anki. By lesson 8 it's a real command-line tool. This lesson builds the smallest slice that works: notes in, one question/answer card out.

## The whole build in one sentence

Take a block of notes, ask the model to pull the key facts out as question/answer pairs, clean up the result, and write it to a CSV file. That's the entire product. Every lesson from here adds exactly one piece: chunking long notes, getting clean JSON, removing duplicates, controlling cost, validating, and exporting.

## The card is the unit

A flashcard is just two strings: a **question** and an **answer**. In Python that's a dict:

\`\`\`python
card = {"question": "What year did WWII end?", "answer": "1945"}
\`\`\`

A deck is a list of those dicts. Everything the tool does is turn text into a list of these dicts, then write that list to disk. Keep the shape in mind: \`str\` in, \`list[dict]\` out, a file at the end.

## The smallest thing that works

Give the model one fact and ask for one card. The prompt carries the rules:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SYSTEM = """You turn study notes into flashcards.
Given a note, write ONE question and its answer.
Reply in exactly this format:
Q: <the question>
A: <the answer>"""

note = "The mitochondria is the powerhouse of the cell."
reply = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=200,
    system=SYSTEM,
    messages=[{"role": "user", "content": note}],
).content[0].text
print(reply)
\`\`\`

The model replies with two lines. You parse them into a dict:

\`\`\`python
lines = reply.strip().splitlines()
question = lines[0].removeprefix("Q:").strip()
answer = lines[1].removeprefix("A:").strip()
card = {"question": question, "answer": answer}
\`\`\`

## Why force the reply into this shape

We told the model to answer in a rigid \`Q:\`/\`A:\` layout so parsing is trivial: split the lines, strip the labels, done. Later we switch to JSON so we can pull many cards at once, but the idea stays the same. Constrain the output so your code can read it. Ask vaguely for "some flashcards" and you get chatty prose no parser can touch.

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| IndexError on \`lines[1]\` | The model replied with prose or a single line instead of the two-line shape, so there is no second line to read | Check you have at least two lines before indexing, and tighten the system prompt so the reply is only the Q: and A: lines |
| The question comes out as "Sure! Here is your card" | The model added a friendly opener, so line 0 is the preamble and not the question | Find the line that starts with "Q:" instead of trusting position 0, and tell the model to reply with no preamble |
| The answer is cut off partway through | The answer ran onto a third line and you only read \`lines[1]\` | Join everything after the A: label back together, or ask for an answer short enough to fit one line |

## The runnable drill

The sandbox has no network, so below you build the same messages list and parse a *sample* reply string exactly as the real code would, with no API call. Get the parse right here and the live version is the same three lines.`,
    starter_code: `# Build the request, then parse the model's reply into a card dict.
# No network here: we parse a sample reply string instead.

SYSTEM = """You turn study notes into flashcards.
Given a note, write ONE question and its answer.
Reply in exactly this format:
Q: <the question>
A: <the answer>"""

note = "The mitochondria is the powerhouse of the cell."

def build_messages(note_text):
    # TODO: return the messages list: a single user turn holding note_text
    pass

sample_reply = "Q: What is the powerhouse of the cell?\\nA: The mitochondria"

def parse_card(reply):
    # TODO: split into lines, strip the "Q:" and "A:" labels,
    #       return {"question": ..., "answer": ...}
    pass

print("messages:", build_messages(note))
print("card:", parse_card(sample_reply))
`,
    solution_code: `# Build the request, then parse the model's reply into a card dict.
# No network here: we parse a sample reply string instead.

SYSTEM = """You turn study notes into flashcards.
Given a note, write ONE question and its answer.
Reply in exactly this format:
Q: <the question>
A: <the answer>"""

note = "The mitochondria is the powerhouse of the cell."

def build_messages(note_text):
    return [{"role": "user", "content": note_text}]

sample_reply = "Q: What is the powerhouse of the cell?\\nA: The mitochondria"

def parse_card(reply):
    lines = reply.strip().splitlines()
    question = lines[0].removeprefix("Q:").strip()
    answer = lines[1].removeprefix("A:").strip()
    return {"question": question, "answer": answer}

messages = build_messages(note)
print("messages:", messages)

card = parse_card(sample_reply)
print("question:", card["question"])
print("answer:", card["answer"])
`,
    hints: [
      "build_messages just returns [{\"role\": \"user\", \"content\": note_text}].",
      "splitlines() turns the reply into a list of its two lines.",
      "str.removeprefix(\"Q:\") drops the label; follow it with .strip() to clean the spaces.",
    ],
    animated_diagrams: [
      {
        title: "The flashcard loop",
        caption: "One note goes in, the model shapes it, your code parses it into a card.",
        loop: false,
        nodes: [
          { label: "Note", sub: "raw text", detail: "A single sentence of study notes, like a line about the mitochondria." },
          { label: "Prompt", sub: "Q:/A: rules", detail: "The system prompt tells the model to reply in a fixed two-line format." },
          { label: "Model reply", sub: "two lines", detail: "The model returns a Q: line and an A: line and nothing else." },
          { label: "Parse", sub: "strip labels", detail: "Split on newlines, remove the Q: and A: prefixes, and trim the spaces." },
          { label: "Card", sub: "dict", detail: "A dict with question and answer keys, ready to join a deck." },
        ],
      },
    ],
    key_terms: [
      { term: "Flashcard", definition: "A pair of strings, a question and its answer, stored as a dict with question and answer keys." },
      { term: "Deck", definition: "A list of card dicts, which is what the whole tool produces before writing to disk." },
      { term: "Structured output", definition: "Forcing the model to reply in a fixed shape (here Q:/A: lines) so your code can parse it reliably." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Parse this reply into a card: \"Q: What is the powerhouse of the cell?\\nA: The mitochondria\"",
        steps: [
          "Call reply.strip() to drop any leading or trailing whitespace, then splitlines() to get [\"Q: What is the powerhouse of the cell?\", \"A: The mitochondria\"].",
          "Take line 0, call removeprefix(\"Q:\") to get \" What is the powerhouse of the cell?\", then strip() to trim the space.",
          "Take line 1, call removeprefix(\"A:\") to get \" The mitochondria\", then strip().",
          "Put both into a dict with keys question and answer.",
        ],
        output: "{\"question\": \"What is the powerhouse of the cell?\", \"answer\": \"The mitochondria\"}",
      },
    ],
    inline_quizzes: [
      {
        question: "Why does the system prompt force the reply into a rigid Q:/A: layout?",
        options: [
          "It makes the model answer faster",
          "So the parsing code can split lines and strip labels reliably",
          "It reduces the cost of the call",
          "Anki requires the Q:/A: format",
        ],
        correct_index: 1,
        explanation: "A fixed shape means your parser always knows where the question and answer are. Ask vaguely and you get prose no parser can read.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "A single flashcard is stored as a Python dict with question and answer keys.", correct_answer: "true", explanation: "Yes, one card is just {\"question\": ..., \"answer\": ...}." },
          { type: "fill_in", question: "Which string method turns the two-line reply into a list of its lines?", correct_answer: "splitlines", explanation: "reply.splitlines() gives you the list of lines to parse." },
        ],
      },
    ],
    callouts: [
      { type: "tip", position: "after", title: "Constrain the output", content: "The more rigidly you pin the reply format, the simpler your parser gets. A vague ask for \"some flashcards\" gives you chatty text no code can read." },
    ],
    challenge_title: "Count Well-Formed Cards",
    challenge_description:
      "Given candidate flashcards in question|answer form, count how many are well-formed (exactly one pipe, both sides non-empty).",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    # TODO: a card is well-formed if splitting on "|" gives EXACTLY two parts
    #       and both parts are non-empty after .strip(). Count and print them.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]

    count = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) == 2 and parts[0].strip() and parts[1].strip():
            count += 1
    print(count)

main()
`,
    challenge_test_cases: [
      {
        input: "3\nWhat is 2+2?|4\n|missing question\nCapital of France?|Paris",
        expected_output: "2",
        description: "Two valid cards; the middle one has an empty question.",
      },
      {
        input: "2\nx|\n|y",
        expected_output: "0",
        description: "Both sides must be non-empty, so neither card counts.",
      },
      {
        input: "1\nno pipe here",
        expected_output: "0",
        description: "A line with no pipe cannot split into a question and answer.",
      },
    ],
  },

  {
    id: "prod-03-2",
    project_id: "prod-03",
    order: 2,
    title: "Chunking the Notes",
    concept: "splitting notes into study-sized pieces",
    explanation: `Real notes aren't one tidy sentence. They're a wall of text: a whole lecture, a textbook chapter, pages of bullet points. If you paste all of it into one call and ask for cards, two things go wrong: the model skims and misses facts, and long inputs cost more tokens per call. The fix is **chunking**: break the notes into smaller pieces and feed them in one at a time.

## Why chunk at all

A model reading a short, focused chunk pays attention to every line. A model reading ten pages tends to summarize the highlights and drop the details, exactly the small facts you want on flashcards. Smaller inputs also mean each call is cheaper and easier to retry when something fails. Chunking is the single change that most improves flashcard *coverage*.

## A chunk is just a slice of text under a size limit

Pick a maximum size, say a few hundred characters, and pack text into chunks that stay under it without ever splitting in the middle of a sentence. Cutting on sentence boundaries keeps each card's context intact:

\`\`\`python
def chunk_notes(text, max_chars=280):
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks, current = [], ""
    for s in sentences:
        candidate = (current + " " + s).strip() if current else s
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    return chunks
\`\`\`

This is a **greedy packer**: keep adding sentences to the current chunk until the next one would blow the limit, then start a fresh chunk. Each chunk is a self-contained bundle of a few sentences.

## How it fits the build

The loop becomes: chunk the notes, then run the lesson-1 extraction on each chunk, then collect every card into one deck:

\`\`\`python
all_cards = []
for chunk in chunk_notes(raw_notes):
    reply = extract_cards(chunk)   # the API call from lesson 1
    all_cards.extend(parse(reply))
\`\`\`

More chunks means more API calls, which means more cost and time, so you don't want chunks that are too tiny either. A few hundred characters per chunk is a sane default: big enough to hold real context, small enough that the model reads it carefully.

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| A card asks about a term the answer never names, or the answer has no matching question | A chunk boundary landed between a term and its definition, so neither half held the whole fact | Keep related sentences together by raising max_chars, or overlap the last sentence of each chunk into the next |
| Chunks split in odd places like "Water boils at 100" and "5C" | Splitting on "." also splits decimals, abbreviations, and initials | Split on sentence-ending punctuation followed by a space, or keep a short list of abbreviations you never split after |
| The run costs far more than expected and takes minutes | max_chars was set very small, so a page of notes became dozens of chunks and dozens of calls | Raise the chunk size until each chunk still holds real context, and count the chunks before you call the model |

## The runnable drill

No network needed to practice this, chunking is pure text handling. Below you implement the greedy packer and run it on a sample note. Getting the boundary logic right (never exceed the limit, never lose a sentence) is the whole skill.`,
    starter_code: `# Split a block of notes into chunks that each stay under a size limit,
# packing whole sentences greedily. Pure text work, no API.

def chunk_notes(text, max_chars=40):
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks, current = [], ""
    for s in sentences:
        # TODO: build 'candidate' by adding s to 'current' (with a space if needed)
        # TODO: if candidate fits in max_chars, keep it as 'current';
        #       otherwise push 'current' to chunks and start a new one from s
        pass
    # TODO: don't forget the last 'current' if it's non-empty
    return chunks

notes = "The sky is blue. Water boils at 100C. Cells have a nucleus."
for i, c in enumerate(chunk_notes(notes)):
    print(i, "->", c)
`,
    solution_code: `# Split a block of notes into chunks that each stay under a size limit,
# packing whole sentences greedily. Pure text work, no API.

def chunk_notes(text, max_chars=40):
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    chunks, current = [], ""
    for s in sentences:
        candidate = (current + " " + s).strip() if current else s
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    return chunks

notes = "The sky is blue. Water boils at 100C. Cells have a nucleus."
result = chunk_notes(notes)
print("chunks:", len(result))
for i, c in enumerate(result):
    print(i, "->", c, "(", len(c), "chars )")
`,
    hints: [
      "Build candidate as (current + ' ' + s).strip() when current is non-empty, else just s.",
      "If candidate fits within max_chars, that becomes the new current; otherwise flush current to chunks and restart from s.",
      "After the loop, append the leftover current if it isn't empty, that's the final chunk.",
    ],
    animated_diagrams: [
      {
        title: "Greedy sentence packing",
        caption: "Sentences flow in one at a time; each is added to the current chunk until the next would overflow.",
        loop: true,
        nodes: [
          { label: "Next sentence", sub: "from the split", detail: "Take the next sentence off the list of sentences split from the notes." },
          { label: "Build candidate", sub: "current + s", detail: "Join the current chunk and this sentence to see how long they would be together." },
          { label: "Fits?", sub: "<= max_chars", detail: "If the candidate stays under the limit, it becomes the new current chunk." },
          { label: "Overflow", sub: "flush + restart", detail: "If it would exceed the limit, push current to the list of chunks and start fresh from this sentence." },
        ],
      },
    ],
    key_terms: [
      { term: "Chunking", definition: "Breaking a long block of notes into smaller pieces so the model reads each one carefully." },
      { term: "Greedy packer", definition: "An algorithm that keeps adding items to the current group until the next one would break a limit, then starts a new group." },
      { term: "Coverage", definition: "How many of the real facts in your notes actually become cards; small chunks improve it." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Pack these sentences into chunks of at most 40 chars: [\"The sky is blue\", \"Water boils at 100C\", \"Cells have a nucleus\"]",
        steps: [
          "Start with current empty. Candidate for sentence 1 is \"The sky is blue\" (15 chars), which fits, so current becomes it.",
          "Candidate for sentence 2 is \"The sky is blue Water boils at 100C\" (35 chars), still under 40, so current grows.",
          "Candidate for sentence 3 is \"The sky is blue Water boils at 100C Cells have a nucleus\" (56 chars), over 40, so flush current as a chunk and restart from sentence 3.",
          "After the loop, current holds \"Cells have a nucleus\", so append it as the final chunk.",
        ],
        output: "[\"The sky is blue Water boils at 100C\", \"Cells have a nucleus\"]",
      },
    ],
    inline_quizzes: [
      {
        question: "Why do smaller chunks improve flashcard coverage?",
        options: [
          "The model reads a short focused chunk carefully instead of summarizing a long one",
          "Smaller inputs are always free",
          "The json module runs faster on short text",
          "Anki only accepts short cards",
        ],
        correct_index: 0,
        explanation: "A model reading ten pages tends to keep the highlights and drop the small facts. A short chunk gets full attention.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "Making chunks as tiny as possible is always best because coverage keeps improving.", correct_answer: "false", explanation: "Tiny chunks mean more API calls, so more cost and time. A few hundred chars is a sane default." },
          { type: "fill_in", question: "The packing strategy that adds sentences until the next would overflow is called a _____ packer.", correct_answer: "greedy", explanation: "It greedily fills the current chunk before starting a new one." },
        ],
      },
    ],
    callouts: [
      { type: "warning", position: "after", title: "More chunks costs more", content: "Every extra chunk is another API call. Balance coverage against cost; do not shrink chunks past the point where they still hold real context." },
    ],
    challenge_title: "Pack Notes into Chunks",
    challenge_description:
      "Greedily pack space-separated words into lines no longer than a character limit, and report how many chunks result.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_chars = int(data[0])
    words = data[1].split() if len(data) > 1 else []
    # TODO: pack words into chunks joined by single spaces so each chunk's
    #       length stays <= max_chars. Each word fits alone. Print the chunk count.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_chars = int(data[0])
    words = data[1].split() if len(data) > 1 else []

    chunks = 0
    current = ""
    for w in words:
        candidate = (current + " " + w) if current else w
        if len(candidate) <= max_chars:
            current = candidate
        else:
            chunks += 1
            current = w
    if current:
        chunks += 1
    print(chunks)

main()
`,
    challenge_test_cases: [
      {
        input: "10\nthe quick brown fox",
        expected_output: "2",
        description: "\"the quick\" (9) then \"brown fox\" (9), two chunks under 10 chars.",
      },
      {
        input: "5\na b c d e",
        expected_output: "2",
        description: "\"a b c\" (5) fills the limit, then \"d e\" (3).",
      },
      {
        input: "3\n",
        expected_output: "0",
        description: "Empty notes produce no chunks.",
      },
    ],
  },

  {
    id: "prod-03-3",
    project_id: "prod-03",
    order: 3,
    title: "The Extraction Prompt: Ask for JSON",
    concept: "structured extraction into a JSON array",
    explanation: `One card per call is fine for a demo, but real notes hold many facts per chunk. You want the model to read a chunk and hand back *several* cards at once, in a shape your code can loop over. The tool for that is **structured extraction**: instruct the model to return a JSON array of card objects.

## Why JSON instead of the Q:/A: format

The \`Q:\`/\`A:\` layout worked for exactly one card. For many cards you'd invent separators and count blank lines, brittle. JSON is the standard, well-defined format for a list of objects, and Python's \`json\` module parses it in one line. When you want many structured items back from a model, you ask for JSON.

## The extraction prompt

The system prompt has real work to do here. It names the task, pins the exact schema, and sets rules that keep garbage out:

\`\`\`python
SYSTEM = """You extract study flashcards from notes.
Read the note and produce every distinct fact worth memorizing.
Return ONLY a JSON array. Each element must be an object with exactly
two string keys: "question" and "answer".

Rules:
- One clear fact per card. No trivia, no duplicates.
- The question must be answerable from the note alone.
- If the note contains no facts worth a card, return [].
Example: [{"question": "What year did WWII end?", "answer": "1945"}]"""
\`\`\`

A few details carry the reliability here. **"Return ONLY a JSON array"** discourages the chatty "Sure! Here are your cards:" preamble that breaks parsing. **The exact keys** (\`question\`, \`answer\`) mean your loop can rely on them. **The example** shows the shape better than any description can. One line of sample output is worth a paragraph of rules.

## The call

\`\`\`python
import json

reply = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=SYSTEM,
    messages=[{"role": "user", "content": chunk}],
).content[0].text

cards = json.loads(reply)          # list[dict] with question/answer keys
for c in cards:
    print(c["question"], "->", c["answer"])
\`\`\`

That \`json.loads\` is why you asked for JSON in the first place. The text becomes a real Python list you can loop over and count. (The next lesson hardens the parse, since models sometimes wrap the JSON in extra text.)

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| \`json.loads\` raises JSONDecodeError on a reply that looks like valid JSON | The model wrapped the array in a code fence or opened with "Here are your cards:", so the string is not pure JSON | Slice from the first [ to the last ] before parsing, which is exactly what the next lesson builds |
| KeyError on \`c["question"]\` | The model used its own key names, such as q and a, or front and back | Name the exact keys in the prompt and show one example object, then read fields with .get so a stray shape does not crash the loop |
| The last card in the array is cut off mid-string | The reply hit max_tokens before the model could close the array | Raise max_tokens for the call, or send smaller chunks so each reply has room to finish |
| Cards come back for a chunk that held no real facts | The prompt never gave the model a way to say nothing, so it invented filler | Keep the rule that an empty array is a valid answer, and drop the filler cards in the validator later |

## The runnable drill

Below you don't call the API. Instead you take a *sample* parsed list of cards and validate it against the schema: every element must be a dict with non-empty \`question\` and \`answer\` strings. Counting the valid cards is the check every extraction step needs before trusting the model's output.`,
    starter_code: `# Validate a parsed extraction result against the card schema.
# 'cards' stands in for json.loads(model_reply) so no network is needed.

cards = [
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "", "answer": "missing question"},
    {"question": "Capital of France?", "answer": "Paris"},
    {"question": "No answer here?"},
]

def is_valid_card(card):
    # TODO: return True only if card is a dict with non-empty string
    #       "question" and "answer" values
    pass

valid = [c for c in cards if is_valid_card(c)]
print("valid cards:", len(valid))
`,
    solution_code: `# Validate a parsed extraction result against the card schema.
# 'cards' stands in for json.loads(model_reply) so no network is needed.

cards = [
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "", "answer": "missing question"},
    {"question": "Capital of France?", "answer": "Paris"},
    {"question": "No answer here?"},
]

def is_valid_card(card):
    if not isinstance(card, dict):
        return False
    q = card.get("question")
    a = card.get("answer")
    return isinstance(q, str) and isinstance(a, str) and q.strip() != "" and a.strip() != ""

valid = [c for c in cards if is_valid_card(c)]
print("valid cards:", len(valid))
for c in valid:
    print("-", c["question"], "->", c["answer"])
`,
    hints: [
      "Use card.get(\"question\") so a missing key returns None instead of raising KeyError.",
      "A field is good only if it's a str and non-empty after .strip().",
      "isinstance(card, dict) guards against the model returning a stray string or number in the array.",
    ],
    animated_diagrams: [
      {
        title: "Structured extraction",
        caption: "One chunk becomes many cards, returned as a JSON array your code can loop over.",
        loop: false,
        nodes: [
          { label: "Chunk", sub: "several facts", detail: "A packed chunk holding a few sentences worth of study material." },
          { label: "JSON prompt", sub: "schema + example", detail: "The system prompt pins the exact keys and shows one example array." },
          { label: "JSON array", sub: "text reply", detail: "The model replies with a JSON array of question/answer objects as a string." },
          { label: "json.loads", sub: "one line", detail: "Parse the string into a real Python list of dicts." },
          { label: "Validate", sub: "keep good", detail: "Keep only elements that are dicts with non-empty question and answer strings." },
        ],
      },
    ],
    key_terms: [
      { term: "Structured extraction", definition: "Asking the model to return data in a fixed machine-readable shape, here a JSON array of card objects." },
      { term: "JSON array", definition: "A list of objects written in JSON text, which json.loads turns into a Python list of dicts." },
      { term: "Schema", definition: "The exact set of keys and types each object must have, spelled out in the prompt so the reply is predictable." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Decide which of these parsed elements are valid cards: [{\"question\": \"Q?\", \"answer\": \"A\"}, {\"question\": \"\", \"answer\": \"x\"}, \"oops\"]",
        steps: [
          "Element 1 is a dict; question and answer are both non-empty strings, so it is valid.",
          "Element 2 is a dict, but question is an empty string, so q.strip() is empty and it fails.",
          "Element 3 is a plain string, so isinstance(card, dict) is False and it fails before any key lookup.",
          "Filter keeps only element 1.",
        ],
        output: "1 valid card",
      },
    ],
    inline_quizzes: [
      {
        question: "Why ask for a JSON array instead of the Q:/A: format from lesson 1?",
        options: [
          "JSON is shorter to type",
          "JSON is a standard shape for a list of objects, and json.loads parses it in one line",
          "The Q:/A: format costs more tokens",
          "Models cannot produce Q:/A: text anymore",
        ],
        correct_index: 1,
        explanation: "Q:/A: worked for one card. For many cards you want a real list, and JSON is the standard format the json module reads for free.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "Including one example array in the prompt helps the model match the exact shape you want.", correct_answer: "true", explanation: "One line of sample output teaches the shape better than a paragraph of rules." },
          { type: "fill_in", question: "Which json function turns the reply string into a Python list?", correct_answer: "loads", explanation: "json.loads(reply) parses the JSON text into Python objects." },
        ],
      },
    ],
    callouts: [
      { type: "tip", position: "after", title: "Use .get, not brackets", content: "Read fields with card.get(\"question\") so a missing key returns None instead of raising KeyError on a malformed element." },
    ],
    challenge_title: "Cards Per Note",
    challenge_description:
      "The extractor makes one card per sentence that has at least K words. Count how many cards a note produces.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    k = int(data[0])
    note = data[1] if len(data) > 1 else ""
    # TODO: split the note into sentences on ".", strip each, and count how many
    #       have at least k words. Print that count.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    k = int(data[0])
    note = data[1] if len(data) > 1 else ""

    count = 0
    for sentence in note.split("."):
        words = sentence.split()
        if len(words) >= k:
            count += 1
    print(count)

main()
`,
    challenge_test_cases: [
      {
        input: "3\nThe sky is blue. Yes. Water boils at one hundred degrees.",
        expected_output: "2",
        description: "\"Yes\" has one word, below the 3-word threshold, so only two cards.",
      },
      {
        input: "1\nHi. Bye.",
        expected_output: "2",
        description: "With K=1 both single-word sentences qualify.",
      },
      {
        input: "5\nShort note here.",
        expected_output: "0",
        description: "Three words falls short of the 5-word minimum.",
      },
    ],
  },

  {
    id: "prod-03-4",
    project_id: "prod-03",
    order: 4,
    title: "Parsing Messy JSON Safely",
    concept: "extracting JSON from a noisy reply",
    explanation: `You asked for "ONLY a JSON array." Most of the time you get one. But models are not vending machines: sometimes the reply is \\\`\\\`\\\`json ... \\\`\\\`\\\` wrapped in a code fence, sometimes it opens with "Here are your flashcards:", sometimes it adds a friendly "Hope that helps!" at the end. A bare \`json.loads(reply)\` then crashes on the very first surprise. This lesson makes the parse survive reality.

## The failure you're defending against

\`json.loads\` needs the string to be *pure* JSON. Any extra character before or after the array throws \`JSONDecodeError\`, and a crashed parse means the whole chunk's cards are gone. Parsing failures are the number-one way an extraction pipeline breaks, so you harden this one spot and everything downstream steadies out.

## The extract-then-parse trick

The JSON array itself always lives between the first \`[\` and the last \`]\`. So instead of parsing the whole reply, you slice out just that span and parse *that*:

\`\`\`python
import json

def parse_cards(reply):
    try:
        start = reply.index("[")
        end = reply.rindex("]") + 1
    except ValueError:
        return []                 # no array at all, return an empty deck
    snippet = reply[start:end]
    try:
        cards = json.loads(snippet)
    except json.JSONDecodeError:
        return []                 # malformed JSON, don't crash the run
    return cards if isinstance(cards, list) else []
\`\`\`

\`index\` finds the first \`[\`; \`rindex\` finds the last \`]\`. Slicing between them strips any preamble, any trailing chatter, and the code-fence backticks in one move. Two \`try/except\` guards mean a weird reply yields an **empty deck**, never a traceback. Returning \`[]\` on failure is the right default here: one bad chunk shouldn't sink the other twenty.

## Pair it with a retry

Because the whole thing is wrapped safely, you can retry a failed chunk once before giving up:

\`\`\`python
def extract_with_retry(chunk, tries=2):
    for _ in range(tries):
        cards = parse_cards(call_model(chunk))
        if cards:
            return cards
    return []
\`\`\`

Often a second call returns clean JSON when the first didn't. This "extract, and retry if empty" shape is the same defensive pattern you'll reuse across every AI product.

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| The retry fails the same way, every time | \`extract_with_retry\` resends an identical prompt, so the model has no reason to answer differently | Change something on the second attempt, such as restating the JSON-only rule or lowering the chunk size, before giving up |
| A chunk that clearly had facts produces zero cards and nothing explains why | \`parse_cards\` swallows the failure and returns [], so a bad reply looks the same as an empty note | Log the raw reply when the parse fails, and count failed chunks so a run that lost half its notes is visible |
| The parse still crashes on some replies | The two guards only catch ValueError and JSONDecodeError, and \`json.loads\` on a valid object or number returns something that is not a list | Keep the final \`isinstance(cards, list)\` check, and return [] whenever the parsed value is not a list of cards |
| The slice grabs too much text | The reply contained a bracket in the card text itself, so the span from the first [ to the last ] pulled in surrounding prose | Accept that the slice is a heuristic, let \`json.loads\` reject the bad span, and rely on the retry instead of widening the search |

## The runnable drill

Below you implement \`parse_cards\` and run it against several messy replies, one clean, one fenced, one with chatter, one with no array at all, and confirm each returns a sensible list without crashing. The \`json\` module works offline, so this drill exercises the real parse logic end to end.`,
    starter_code: `import json

# Pull the JSON array out of a noisy model reply and parse it safely.
# json works offline, so this is the real logic, no network.

def parse_cards(reply):
    # TODO: find the first "[" and last "]"; if either is missing, return []
    # TODO: slice that span and json.loads it inside a try/except; on any
    #       failure return []. Only return the result if it's a list.
    pass

replies = [
    '[{"question": "Q1?", "answer": "A1"}]',
    'Here are your cards:\\n[{"question": "Q2?", "answer": "A2"}]\\nHope that helps!',
    'Sorry, I could not find any facts.',
]
for r in replies:
    print(len(parse_cards(r)), "cards")
`,
    solution_code: `import json

# Pull the JSON array out of a noisy model reply and parse it safely.
# json works offline, so this is the real logic, no network.

def parse_cards(reply):
    try:
        start = reply.index("[")
        end = reply.rindex("]") + 1
    except ValueError:
        return []
    try:
        cards = json.loads(reply[start:end])
    except json.JSONDecodeError:
        return []
    return cards if isinstance(cards, list) else []

replies = [
    '[{"question": "Q1?", "answer": "A1"}]',
    'Here are your cards:\\n[{"question": "Q2?", "answer": "A2"}]\\nHope that helps!',
    'Sorry, I could not find any facts.',
]
for r in replies:
    cards = parse_cards(r)
    print(len(cards), "cards ->", cards)
`,
    hints: [
      "str.index raises ValueError when the character is absent, catch it and return [].",
      "reply.rindex(\"]\") finds the LAST closing bracket; add 1 so the slice includes it.",
      "Guard json.loads with except json.JSONDecodeError so malformed JSON returns [] instead of crashing.",
    ],
    animated_diagrams: [
      {
        title: "Safe extract-then-parse",
        caption: "Slice out the array span, try to parse it, and fall back to an empty deck if anything breaks.",
        loop: false,
        nodes: [
          { label: "Noisy reply", sub: "chatter + fences", detail: "The model reply may have a preamble, code fences, or trailing text around the array." },
          { label: "Find brackets", sub: "index / rindex", detail: "Locate the first [ and the last ]. If either is missing, return an empty deck." },
          { label: "Slice span", sub: "first [ to last ]", detail: "Take just that substring, dropping every character outside the array." },
          { label: "json.loads", sub: "in try/except", detail: "Parse the slice; catch JSONDecodeError so malformed JSON returns [] instead of crashing." },
          { label: "Deck or []", sub: "list guard", detail: "Return the list if the parse succeeded and gave a list, otherwise an empty deck." },
        ],
      },
    ],
    key_terms: [
      { term: "JSONDecodeError", definition: "The exception json.loads raises when the string is not valid JSON; you catch it to avoid crashing the run." },
      { term: "Fallback", definition: "A safe default (here an empty list) returned when parsing fails, so one bad chunk does not sink the rest." },
      { term: "Retry", definition: "Calling the model again on a chunk that came back empty, since a second attempt often returns clean JSON." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Parse this reply safely: 'Here are your cards:\\n[{\"question\": \"Q?\", \"answer\": \"A\"}]\\nHope that helps!'",
        steps: [
          "reply.index(\"[\") finds the first bracket at the start of the array, after the preamble.",
          "reply.rindex(\"]\") finds the last bracket; add 1 so the slice includes it.",
          "Slice from that start to that end to get exactly '[{\"question\": \"Q?\", \"answer\": \"A\"}]', dropping the preamble and the trailing chatter.",
          "json.loads on the slice succeeds and returns a list, so return it.",
        ],
        output: "[{\"question\": \"Q?\", \"answer\": \"A\"}]",
      },
    ],
    inline_quizzes: [
      {
        question: "What does parse_cards return when the reply has no square brackets at all?",
        options: [
          "It raises ValueError",
          "It returns None",
          "It returns an empty list []",
          "It returns the raw reply string",
        ],
        correct_index: 2,
        explanation: "index raises ValueError when the bracket is absent; the except catches it and returns [], an empty deck, so the run continues.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "A bare json.loads(reply) is safe even when the model wraps the array in a code fence.", correct_answer: "false", explanation: "Any extra character before or after the array makes json.loads raise JSONDecodeError. You slice the span first." },
          { type: "fill_in", question: "Which string method finds the LAST closing bracket in the reply?", correct_answer: "rindex", explanation: "reply.rindex(\"]\") searches from the right for the last ]." },
        ],
      },
    ],
    callouts: [
      { type: "insight", position: "after", title: "One bad chunk should not sink the run", content: "Returning [] on a parse failure keeps the other chunks flowing. A single crash would otherwise throw away every card in the whole run." },
    ],
    challenge_title: "Strip the Fence and Extract",
    challenge_description:
      "Given a noisy line, print the substring from the first '[' to the last ']' inclusive, or NONE if there's no array.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    text = sys.stdin.read().rstrip("\\n")
    # TODO: find the first "[" and the last "]". If both exist, print the
    #       substring spanning them (inclusive). Otherwise print "NONE".

main()
`,
    challenge_solution_code: `import sys

def main():
    text = sys.stdin.read().rstrip("\\n")
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end < start:
        print("NONE")
    else:
        print(text[start:end + 1])

main()
`,
    challenge_test_cases: [
      {
        input: "Sure! [1, 2, 3] done.",
        expected_output: "[1, 2, 3]",
        description: "Chatter on both sides is stripped away.",
      },
      {
        input: "no brackets here",
        expected_output: "NONE",
        description: "With no array present, the parse reports NONE.",
      },
      {
        input: "text [a] more [b] end",
        expected_output: "[a] more [b]",
        description: "First '[' to last ']' spans across both bracketed pieces.",
      },
    ],
  },

  {
    id: "prod-03-5",
    project_id: "prod-03",
    order: 5,
    title: "Deduping the Deck",
    concept: "removing duplicate cards",
    explanation: `Chunk your notes into ten pieces and the same fact often turns up in three of them, so your deck ends up with three near-identical cards for "What is the powerhouse of the cell?". Studying the same card three times wastes your time, and a deck full of repeats feels sloppy. This lesson strips the repeats before export.

## Why exact matching isn't enough

You can't just check if two question strings are identical. The model phrases the same fact slightly differently each time:

- \`"What is the powerhouse of the cell?"\`
- \`"What is the powerhouse of the cell"\`  (no question mark)
- \`"what is the POWERHOUSE of the cell?"\`  (different casing)

These are the same card to a human but three different strings to \`==\`. The fix is to compare a **normalized** form of each question, not the raw text.

## Normalize, then dedup

Normalizing means squashing away the differences that don't matter, so equivalent questions collapse to one key:

\`\`\`python
def normalize(question):
    q = question.strip().lower()
    q = q.rstrip("?.!")          # drop trailing punctuation
    q = " ".join(q.split())      # collapse runs of whitespace to single spaces
    return q

def dedup(cards):
    seen = set()
    unique = []
    for card in cards:
        key = normalize(card["question"])
        if key not in seen:
            seen.add(key)
            unique.append(card)
    return unique
\`\`\`

The pattern is the classic **seen-set dedup**: walk the deck once, compute each card's normalized key, and keep a card only the first time its key appears. Using a \`set\` makes the "have I seen this?" check instant even for a big deck. Keeping the *first* occurrence preserves the order the cards were extracted in.

## How aggressive to be

Normalization is a dial. Lowercasing and trimming punctuation is safe, it only merges cards that are truly the same question. You *could* go further (strip filler words, compare meaning with embeddings), but that risks merging two genuinely different cards into one and silently losing a fact. For a flashcard tool, conservative normalization is the right call: better a rare duplicate slips through than a real card disappears.

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| The deck still has three cards about the mitochondria | You compared the raw question strings, so a stray question mark or a capital letter made them look different | Compare the normalized key, not the raw text, and normalize both sides the same way |
| A fact you know was in your notes is missing from the deck | Normalization went too far and collapsed two different questions onto one key, so the second card was dropped as a repeat | Keep normalization to case, whitespace, and trailing punctuation, and print which cards were skipped as duplicates |
| A surviving card has a worse answer than the copy that got dropped | Dedup keys on the question only, so the first occurrence wins even when a later card answers it better | Keep first-seen order for predictability, or break ties by preferring the longer, more complete answer |

## The runnable drill

Below you implement \`normalize\` and \`dedup\` and run them on a deck with obvious repeats. Confirm the near-duplicates collapse while distinct cards survive. This is pure Python, no model needed, and it's the last cleaning step before the deck is export-ready.`,
    starter_code: `# Remove duplicate cards by comparing a normalized form of each question.

def normalize(question):
    # TODO: lowercase, strip, remove trailing ? . !, and collapse whitespace
    pass

def dedup(cards):
    # TODO: keep each card only the first time its normalized question appears
    pass

deck = [
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
    {"question": "what is the POWERHOUSE of the cell", "answer": "Mitochondria"},
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
]
print("unique:", len(dedup(deck)))
`,
    solution_code: `# Remove duplicate cards by comparing a normalized form of each question.

def normalize(question):
    q = question.strip().lower()
    q = q.rstrip("?.!")
    q = " ".join(q.split())
    return q

def dedup(cards):
    seen = set()
    unique = []
    for card in cards:
        key = normalize(card["question"])
        if key not in seen:
            seen.add(key)
            unique.append(card)
    return unique

deck = [
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
    {"question": "what is the POWERHOUSE of the cell", "answer": "Mitochondria"},
    {"question": "What year did WWII end?", "answer": "1945"},
    {"question": "What is the powerhouse of the cell?", "answer": "Mitochondria"},
]
result = dedup(deck)
print("unique:", len(result))
for c in result:
    print("-", c["question"])
`,
    hints: [
      "normalize should chain .strip().lower(), then .rstrip(\"?.!\"), then \" \".join(q.split()).",
      "\" \".join(q.split()) collapses any run of spaces or tabs into single spaces.",
      "Track seen keys in a set and append a card only when its key is new, preserving first-seen order.",
    ],
    animated_diagrams: [
      {
        title: "Normalize then seen-set dedup",
        caption: "Each card's question is normalized to a key; the first card for a key stays, later repeats are skipped.",
        loop: true,
        nodes: [
          { label: "Next card", sub: "from the deck", detail: "Walk the deck one card at a time, in extraction order." },
          { label: "Normalize", sub: "lower + trim", detail: "Lowercase, strip, drop trailing punctuation, and collapse whitespace to build a comparison key." },
          { label: "Seen?", sub: "check the set", detail: "Look the key up in the seen set, an instant check even for a big deck." },
          { label: "Keep or skip", sub: "first wins", detail: "New key: add it to seen and keep the card. Already seen: skip this repeat." },
        ],
      },
    ],
    key_terms: [
      { term: "Normalization", definition: "Reducing a string to a canonical form (lowercased, trimmed, punctuation dropped) so equivalent questions compare equal." },
      { term: "Seen-set dedup", definition: "Walking a list once while tracking keys in a set, keeping only the first item for each key." },
      { term: "Canonical key", definition: "The normalized string used to decide whether two cards count as the same fact." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Normalize and dedup these questions: [\"What is the powerhouse of the cell?\", \"what is the POWERHOUSE of the cell\", \"What year did WWII end?\"]",
        steps: [
          "Normalize question 1: lower and strip give \"what is the powerhouse of the cell?\", rstrip(\"?.!\") drops the ?, giving key A. Not seen, keep it.",
          "Normalize question 2: lowercasing and dropping the missing ? give the same key A. Already seen, skip it.",
          "Normalize question 3 to key B. Not seen, keep it.",
          "Two cards survive, in their original order.",
        ],
        output: "2 unique cards",
      },
    ],
    inline_quizzes: [
      {
        question: "Why compare a normalized key instead of the raw question string?",
        options: [
          "Raw strings are slower to compare",
          "The model phrases the same fact with different casing and punctuation, so == misses real duplicates",
          "Normalization saves API tokens",
          "A set cannot store long strings",
        ],
        correct_index: 1,
        explanation: "\"What is X?\" and \"what is X\" are the same card to a human but different strings to ==. Normalizing collapses them to one key.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "Keeping the first occurrence of each key preserves the order cards were extracted in.", correct_answer: "true", explanation: "You append a card only the first time its key appears, so surviving cards stay in extraction order." },
          { type: "fill_in", question: "Which data structure gives an instant \"have I seen this key?\" check?", correct_answer: "set", explanation: "A Python set does membership tests in constant time on average." },
        ],
      },
    ],
    callouts: [
      { type: "warning", position: "after", title: "Do not over-normalize", content: "Aggressive normalization (stripping filler words or matching by meaning) can merge two genuinely different cards and silently lose a fact. Stay conservative." },
    ],
    challenge_title: "Count Unique Cards",
    challenge_description:
      "Given a list of questions, normalize each (lowercase, trim, drop trailing ? and .) and count the distinct ones.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    questions = data[1:1 + n]
    # TODO: normalize each question (strip, lower, rstrip("?."), collapse spaces)
    #       and print how many DISTINCT normalized questions there are.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    questions = data[1:1 + n]

    seen = set()
    for q in questions:
        key = " ".join(q.strip().lower().rstrip("?.").split())
        seen.add(key)
    print(len(seen))

main()
`,
    challenge_test_cases: [
      {
        input: "4\nWhat is Python?\nwhat is python\nA dog barks.\nWhat is Python?",
        expected_output: "2",
        description: "The three Python phrasings collapse to one; the dog fact is the other.",
      },
      {
        input: "1\nHello",
        expected_output: "1",
        description: "A single card is trivially unique.",
      },
      {
        input: "3\nHi\nhi\nHI ",
        expected_output: "1",
        description: "Case and trailing space differences normalize to the same key.",
      },
    ],
  },

  {
    id: "prod-03-6",
    project_id: "prod-03",
    order: 6,
    title: "Watching the Cost",
    concept: "token budgets and batching calls",
    explanation: `Your tool works. Now run it on a 40-page study guide and watch the bill. Every chunk is a separate API call, every call sends tokens in and gets tokens out, and tokens are money. Before shipping, you need a feel for what a run costs and a lever to keep it sane. That lever is **batching**.

## Tokens are the unit of cost

A **token** is a chunk of text, roughly 4 characters of English. You pay for tokens sent (your chunks) and tokens received (the cards). A rough estimator is enough for budgeting:

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

To predict a run's input cost, sum the estimate over every chunk plus the system prompt, which you resend on *every* call. That last part is the trap: a 300-token system prompt sent across 50 chunks is 15,000 tokens spent on the prompt alone.

## Batching: fewer calls, less repeated overhead

Instead of one call per chunk, pack several small chunks into a single call, up to a token budget, and extract from all of them at once. Fewer calls means the fixed system-prompt overhead is paid fewer times:

\`\`\`python
def batch_chunks(chunks, budget):
    batches, current, used = [], [], 0
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if current and used + cost > budget:
            batches.append(current)
            current, used = [], 0
        current.append(chunk)
        used += cost
    if current:
        batches.append(current)
    return batches
\`\`\`

This is the greedy packer again, now measured in tokens instead of characters. Each batch stays under \`budget\`; when the next chunk would overflow, you close the batch and open a new one. Ten chunks that once cost ten calls might now fit in three, cutting repeated-prompt overhead by more than half.

## The tradeoff to hold in mind

Batching trades attention for cost. A batch that's too big is back to the lesson-2 problem: the model skims and misses facts. So batch *small related* chunks together, not the whole document. A budget of a few hundred to a couple thousand tokens per batch is a reasonable middle: cheaper than one-call-per-chunk, still small enough to extract carefully. Don't hunt for a magic number. *Measure* a run before you ship, so the cost shows up in your terminal and not on your billing dashboard.

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| You raised the budget to save money and the deck came back smaller | Bigger batches put more text in front of the model per call, so it summarized the highlights and skipped the small facts | Lower the budget until card counts recover, and compare cards per chunk before and after any batching change |
| The reply for a batch stops partway through the array | Batching raised the input but max_tokens stayed where it was, so the output ran out of room | Scale max_tokens with the batch size, or cap how many chunks go into one call |
| The real bill is well above your estimate | The estimate summed the chunks but ignored the system prompt, which you resend on every single call | Add the system prompt cost once per call to the estimate, not once per run |
| Two unrelated topics end up in one card | Batching packed chunks from different parts of the notes together and the model blended them | Batch neighboring chunks only, and keep a separator between chunks so the model treats them as distinct notes |

## The runnable drill

Below you estimate tokens for a set of chunks and pack them into batches under a budget, then report the batch count and total tokens. Seeing the call count drop as the budget rises is the whole intuition. Pure Python, no API required.`,
    starter_code: `# Estimate token cost and batch chunks under a per-call token budget.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def batch_chunks(chunks, budget):
    # TODO: greedily pack chunks into batches so each batch's total estimated
    #       tokens stays <= budget; start a new batch when the next would overflow
    pass

chunks = ["a" * 40, "b" * 40, "c" * 40, "d" * 40]  # ~10 tokens each
batches = batch_chunks(chunks, 25)
print("batches:", len(batches))
`,
    solution_code: `# Estimate token cost and batch chunks under a per-call token budget.

def estimate_tokens(text):
    return max(1, len(text) // 4)

def batch_chunks(chunks, budget):
    batches, current, used = [], [], 0
    for chunk in chunks:
        cost = estimate_tokens(chunk)
        if current and used + cost > budget:
            batches.append(current)
            current, used = [], 0
        current.append(chunk)
        used += cost
    if current:
        batches.append(current)
    return batches

chunks = ["a" * 40, "b" * 40, "c" * 40, "d" * 40]  # ~10 tokens each
batches = batch_chunks(chunks, 25)
print("chunks:", len(chunks))
print("batches (calls):", len(batches))
for i, b in enumerate(batches):
    print(i, "->", len(b), "chunks,", sum(estimate_tokens(c) for c in b), "tokens")
`,
    hints: [
      "estimate_tokens(chunk) is just len(chunk) // 4 (with a floor of 1).",
      "Close the current batch when it's non-empty AND adding the next chunk would exceed budget.",
      "After the loop, append the leftover current batch if it has any chunks.",
    ],
    animated_diagrams: [
      {
        title: "Batching chunks under a token budget",
        caption: "Chunks pack into batches until the token budget fills, so fewer calls pay the system-prompt overhead.",
        loop: true,
        nodes: [
          { label: "Next chunk", sub: "estimate cost", detail: "Estimate the chunk's tokens as len(text) // 4, a rough character-based count." },
          { label: "Budget check", sub: "used + cost", detail: "If the current batch is non-empty and adding this chunk would exceed the budget, close the batch." },
          { label: "New batch", sub: "reset used", detail: "Start a fresh batch and reset the running token total to zero." },
          { label: "Add chunk", sub: "used += cost", detail: "Append the chunk to the current batch and add its cost to the running total." },
          { label: "One call", sub: "per batch", detail: "Each finished batch becomes a single API call, so the system prompt is resent fewer times." },
        ],
      },
    ],
    key_terms: [
      { term: "Token", definition: "The unit of model cost, roughly 4 characters of English; you pay for tokens sent and received." },
      { term: "Token budget", definition: "A per-call cap on total tokens that decides when a batch is full and a new one must start." },
      { term: "Batching", definition: "Packing several small chunks into one call so the fixed system-prompt overhead is paid fewer times." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Batch four chunks of ~10 tokens each under a budget of 25 tokens.",
        steps: [
          "Chunk 1 (10 tokens): batch empty, so add it. Running total 10.",
          "Chunk 2 (10 tokens): 10 + 10 = 20, still under 25, so add it. Running total 20.",
          "Chunk 3 (10 tokens): 20 + 10 = 30, over 25, so close the batch, start a new one, add chunk 3. Running total 10.",
          "Chunk 4 (10 tokens): 10 + 10 = 20, under 25, so add it. After the loop, flush the second batch.",
        ],
        output: "2 batches (2 API calls instead of 4)",
      },
    ],
    inline_quizzes: [
      {
        question: "Why does batching reduce cost even when the total note text is unchanged?",
        options: [
          "It compresses the notes",
          "The system prompt is resent once per call, so fewer calls means less repeated prompt overhead",
          "Batched calls are billed at half price",
          "The model skips the system prompt on batched calls",
        ],
        correct_index: 1,
        explanation: "You resend the system prompt on every call. Fewer, larger calls pay that fixed overhead fewer times.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "Batching every chunk into one giant call is always the cheapest and best choice.", correct_answer: "false", explanation: "A batch that is too big is the lesson-2 problem again: the model skims and misses facts. Batch small related chunks." },
          { type: "fill_in", question: "Roughly how many characters of English make up one token?", correct_answer: "4", explanation: "The estimator len(text) // 4 uses about 4 characters per token." },
        ],
      },
    ],
    callouts: [
      { type: "tip", position: "after", title: "Measure before you ship", content: "Print the estimated token total for a run so the cost shows up in your terminal, not later on your billing dashboard." },
    ],
    challenge_title: "Count the API Calls",
    challenge_description:
      "Greedily pack note token-sizes into batches under a budget and report how many API calls that takes.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    sizes = list(map(int, data[2].split())) if n > 0 else []
    # TODO: greedily pack sizes into batches so each batch sum stays <= budget
    #       (each size fits alone). Print the number of batches (API calls).

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    budget = int(data[0])
    n = int(data[1])
    sizes = list(map(int, data[2].split())) if n > 0 else []

    batches = 0
    used = 0
    for size in sizes:
        if used and used + size > budget:
            batches += 1
            used = 0
        used += size
    if used:
        batches += 1
    print(batches)

main()
`,
    challenge_test_cases: [
      {
        input: "100\n5\n30 40 50 20 60",
        expected_output: "3",
        description: "Batches [30,40], [50,20], [60] each stay within 100.",
      },
      {
        input: "50\n3\n50 50 50",
        expected_output: "3",
        description: "Each note fills the whole budget, so every one is its own call.",
      },
      {
        input: "100\n0\n",
        expected_output: "0",
        description: "No notes means no API calls.",
      },
    ],
  },

  {
    id: "prod-03-7",
    project_id: "prod-03",
    order: 7,
    title: "Keeping Only Good Cards",
    concept: "validating and repairing the deck",
    explanation: `Even with clean JSON and no duplicates, the model occasionally hands you a card that shouldn't exist: an empty answer, a "question" that's actually a statement, or a card where the question and answer are the same string. Studying junk cards trains bad habits, so the last gate before export is a **validator** that drops anything not worth memorizing.

## What makes a card bad

A few failure modes cover almost all of it:

- **Empty fields.** A missing or blank question or answer, useless.
- **Question equals answer.** \`{"question": "Photosynthesis", "answer": "Photosynthesis"}\` teaches nothing.
- **Runaway length.** A "card" that's a whole paragraph is the model dumping the note instead of extracting a fact. Cap the length.
- **Wrong type.** A stray number or null where a string should be, guard against it so a bad element can't crash the run.

## The validator

Encode those rules as one predicate and filter the deck through it:

\`\`\`python
def is_good(card, max_len=200):
    if not isinstance(card, dict):
        return False
    q, a = card.get("question"), card.get("answer")
    if not isinstance(q, str) or not isinstance(a, str):
        return False
    q, a = q.strip(), a.strip()
    if not q or not a:
        return False
    if q.lower() == a.lower():
        return False
    if len(q) > max_len or len(a) > max_len:
        return False
    return True

good = [c for c in cards if is_good(c)]
dropped = len(cards) - len(good)
\`\`\`

Notice the order: cheapest, most-likely checks first (type, emptiness), then the subtler ones. Each rule is one line, and together they turn "the model probably behaved" into a guarantee your export step can trust.

## Report, don't hide

Print how many cards you dropped. A run that quietly discards half its cards is telling you the notes were thin or a chunk failed, and you want to *see* that, not wonder why your deck is short. A validator that shows what it threw away earns your trust in a way a silent one never will:

\`\`\`python
print(f"Kept {len(good)} cards, dropped {dropped}.")
\`\`\`

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| The deck is much shorter than the number of cards the model returned, and nothing says why | The filter drops bad cards silently, so the count never adds up and you cannot tell a thin note from a broken chunk | Print kept versus dropped every run, and print the first few rejected cards while you are tuning the rules |
| Good cards keep disappearing | max_len is set too low, so real answers that run a couple of sentences get rejected along with the paragraph dumps | Raise max_len until only the note dumps fail, and check what the longest kept card actually looks like |
| \`len()\` or \`.lower()\` raises TypeError inside the validator | A field came back as a number or null and the type checks ran after the checks that touch the value | Keep the guard clauses in order: dict first, then field types, then everything that reads the strings |
| Duplicate cards survive validation | The validator runs on each card alone and has no view of the rest of the deck, so it cannot see repeats | Leave repeats to the dedup pass from lesson 5 and run it before this filter |

## The runnable drill

Below you implement \`is_good\` and run a deck containing each failure mode past it, then report kept versus dropped. This is the production-readiness step: the same "validate every item, count what you rejected" pattern hardens every AI pipeline you'll build. Pure Python, no model needed.`,
    starter_code: `# Keep only cards worth studying; report how many you dropped.

def is_good(card, max_len=200):
    # TODO: reject non-dicts, non-string or empty question/answer,
    #       cards where question == answer (case-insensitive),
    #       and cards where either field is longer than max_len
    pass

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": "Photosynthesis", "answer": "Photosynthesis"},
    {"question": "", "answer": "no question"},
    {"question": "Capital of Japan?", "answer": "Tokyo"},
]
good = [c for c in deck if is_good(c)]
print("kept:", len(good), "dropped:", len(deck) - len(good))
`,
    solution_code: `# Keep only cards worth studying; report how many you dropped.

def is_good(card, max_len=200):
    if not isinstance(card, dict):
        return False
    q, a = card.get("question"), card.get("answer")
    if not isinstance(q, str) or not isinstance(a, str):
        return False
    q, a = q.strip(), a.strip()
    if not q or not a:
        return False
    if q.lower() == a.lower():
        return False
    if len(q) > max_len or len(a) > max_len:
        return False
    return True

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": "Photosynthesis", "answer": "Photosynthesis"},
    {"question": "", "answer": "no question"},
    {"question": "Capital of Japan?", "answer": "Tokyo"},
]
good = [c for c in deck if is_good(c)]
print("kept:", len(good), "dropped:", len(deck) - len(good))
for c in good:
    print("-", c["question"], "->", c["answer"])
`,
    hints: [
      "Check the cheap conditions first: isinstance(card, dict), then the field types, then emptiness.",
      "Compare q.lower() == a.lower() so \"Cell\" and \"cell\" still count as identical.",
      "dropped is just len(deck) - len(good); print it so thin runs are visible.",
    ],
    animated_diagrams: [
      {
        title: "The is_good validator",
        caption: "Each card runs the cheap checks first; the first failure drops it before the costlier tests.",
        loop: false,
        nodes: [
          { label: "Card", sub: "from the deck", detail: "One candidate card, which might be junk the model produced." },
          { label: "Type check", sub: "dict + str fields", detail: "Reject anything that is not a dict with string question and answer, so a stray number cannot crash the run." },
          { label: "Emptiness", sub: "non-blank", detail: "Strip both fields and reject the card if either is empty." },
          { label: "Q != A", sub: "case-insensitive", detail: "Reject cards where the question equals the answer, which teach nothing." },
          { label: "Length cap", sub: "<= max_len", detail: "Reject a field longer than the cap, which usually means the model dumped the whole note." },
          { label: "Keep", sub: "passed all", detail: "A card that clears every gate is worth studying and joins the good deck." },
        ],
      },
    ],
    key_terms: [
      { term: "Validator", definition: "A predicate that returns True only for cards worth keeping, used to filter the deck before export." },
      { term: "Predicate", definition: "A function that returns a boolean, here is_good(card), which decides pass or fail for one item." },
      { term: "Guard clause", definition: "An early return that rejects a bad case up front (like a non-dict) so later code can assume clean input." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Run is_good on {\"question\": \"Photosynthesis\", \"answer\": \"Photosynthesis\"} with max_len 200.",
        steps: [
          "It is a dict, so the type check passes.",
          "Both fields are strings, so the field-type check passes.",
          "After strip, both are non-empty, so the emptiness check passes.",
          "q.lower() == a.lower() is True (both \"photosynthesis\"), so the identical-fields rule rejects it before the length check ever runs.",
        ],
        output: "False (card dropped)",
      },
    ],
    inline_quizzes: [
      {
        question: "Why put the cheap type and emptiness checks before the length comparison?",
        options: [
          "Length checks are not allowed to run first in Python",
          "Cheap, most-likely-to-fail checks reject bad cards early and guard against crashes on the later checks",
          "It makes the deck sort itself",
          "The order does not matter at all",
        ],
        correct_index: 1,
        explanation: "Checking isinstance first stops a non-string field from crashing len() or .lower() later, and cheap checks catch most junk up front.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "A validator that silently discards half the deck is better than one that prints how many it dropped.", correct_answer: "false", explanation: "Printing the dropped count tells you the notes were thin or a chunk failed. A silent validator hides the problem." },
          { type: "fill_in", question: "You compare q.lower() to a.lower() so that \"Cell\" and \"cell\" count as _____.", correct_answer: "identical", explanation: "Lowercasing both sides makes the question-equals-answer check case-insensitive." },
        ],
      },
    ],
    callouts: [
      { type: "insight", position: "after", title: "Report, do not hide", content: "Print kept versus dropped every run. A deck that comes back short is a signal about your notes, and you want to see it, not wonder about it." },
    ],
    challenge_title: "Keep Valid Cards",
    challenge_description:
      "Given question|answer cards, keep those with both fields non-empty and question != answer, and print kept and dropped counts.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]
    # TODO: split each line on "|". A card is valid if it has exactly two parts,
    #       both non-empty after strip, and the two parts differ (case-insensitive).
    #       Print "kept dropped".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    lines = data[1:1 + n]

    kept = 0
    for line in lines:
        parts = line.split("|")
        if len(parts) != 2:
            continue
        q, a = parts[0].strip(), parts[1].strip()
        if q and a and q.lower() != a.lower():
            kept += 1
    print(kept, n - kept)

main()
`,
    challenge_test_cases: [
      {
        input: "3\nWhat is 2+2?|4\nsame|same\n|empty q",
        expected_output: "1 2",
        description: "Only the first card survives; the others repeat or are empty.",
      },
      {
        input: "1\nQ|A",
        expected_output: "1 0",
        description: "A single well-formed card is kept.",
      },
      {
        input: "2\na|a\nb|",
        expected_output: "0 2",
        description: "Identical fields and an empty answer are both dropped.",
      },
    ],
  },

  {
    id: "prod-03-8",
    project_id: "prod-03",
    order: 8,
    title: "Export to CSV and Ship",
    concept: "writing an Anki-ready CSV",
    explanation: `The deck is extracted, deduped, and validated. Now make it *usable*: write it to a CSV file that imports straight into Anki, Quizlet, or a spreadsheet. Getting the file format exactly right is what turns your script into a tool someone else can actually run.

## Why CSV, and why it's trickier than it looks

Anki imports a plain CSV: one row per card, question in the first column, answer in the second. The catch is that flashcard text is full of the characters CSV uses as control codes, commas, quotes, and newlines. A question like \`Say "hi", then wave\` naively written as \`Say "hi", then wave,answer\` has a stray comma that splits it into the wrong columns. You must **escape** those fields.

The rule (RFC 4180): if a field contains a comma, a double-quote, or a newline, wrap the whole field in double-quotes and double any interior quotes. Python's \`csv\` module does this correctly so you never hand-roll it:

\`\`\`python
import csv

def export_csv(cards, path="deck.csv"):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for card in cards:
            writer.writerow([card["question"], card["answer"]])
\`\`\`

\`csv.writer\` handles every escaping edge case, quotes, commas, newlines inside a field, so \`Say "hi", then wave\` lands in exactly one column. The \`newline=""\` argument is required on the \`open\` call; without it you get blank rows between cards on some platforms.

## The finished pipeline

Every piece from the last seven lessons now lines up into one flow:

\`\`\`python
raw = load_notes("notes.txt")
chunks = chunk_notes(raw)                       # lesson 2
batches = batch_chunks(chunks, budget=1500)     # lesson 6
cards = []
for batch in batches:
    reply = call_model("\\n\\n".join(batch))      # lessons 1, 3
    cards.extend(parse_cards(reply))            # lesson 4
cards = dedup(cards)                             # lesson 5
cards = [c for c in cards if is_good(c)]         # lesson 7
export_csv(cards, "deck.csv")                    # this lesson
print(f"Wrote {len(cards)} cards to deck.csv")
\`\`\`

Notes in one end, an Anki-ready deck out the other. That's the whole product.

## What "shipped" means here

It's shipped when it runs from a clean start with one command, survives an empty or junk notes file without crashing (you return \`[]\` and write a header-only file instead of throwing), and someone else could run it from your README. Keep a sample \`notes.txt\` and the \`deck.csv\` it produces as proof it works.

## What usually goes wrong

| What you see | What caused it | How to fix it |
| --- | --- | --- |
| A card lands split across two columns after import | The row was built by joining fields with a comma, so a comma inside the question became a column break | Pass the fields to \`csv.writer\` as a list and let it quote them for you |
| Answers show up wrapped in stray double-quotes | Interior quotes were escaped by hand and doubled the wrong number of times | Hand the raw string to \`csv.writer\` unchanged; it doubles interior quotes correctly on its own |
| Every other row in the file is blank | \`open\` was called without \`newline=""\`, so line endings got written twice on some platforms | Always open the file with \`newline=""\` when a \`csv.writer\` is attached to it |
| Accented or non-English characters import as garbage | The file was written in the platform default encoding rather than UTF-8 | Pass \`encoding="utf-8"\` on the \`open\` call and import the deck as UTF-8 |

## It lands in your Portfolio

Finishing this lesson saves **Flashcard Maker** to your **Portfolio** tab, with the title and what you built: a notes-to-flashcards tool with structured extraction, dedup, cost batching, validation, and CSV export. You walk away with something you can show off. The runnable drill below builds the escaped CSV text in memory (using the same \`csv\` module, which works offline) so you can see the exact bytes your file will contain.`,
    starter_code: `import csv, io

# Turn the finished deck into Anki-ready CSV text, correctly escaped.
# csv works offline; we write to an in-memory buffer instead of a file.

def to_csv(cards):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    # TODO: write one row per card: [question, answer]
    return buffer.getvalue()

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": 'Say "hi", ok?', "answer": "Greeting"},
]
print(to_csv(deck))
`,
    solution_code: `import csv, io

# Turn the finished deck into Anki-ready CSV text, correctly escaped.
# csv works offline; we write to an in-memory buffer instead of a file.

def to_csv(cards):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    for card in cards:
        writer.writerow([card["question"], card["answer"]])
    return buffer.getvalue()

deck = [
    {"question": "What is 2+2?", "answer": "4"},
    {"question": 'Say "hi", ok?', "answer": "Greeting"},
]
print(to_csv(deck), end="")
print("cards exported:", len(deck))
`,
    hints: [
      "Loop the cards and call writer.writerow([card[\"question\"], card[\"answer\"]]) for each.",
      "csv.writer handles all the escaping; never build the comma-joined line yourself.",
      "io.StringIO() gives csv.writer a file-like buffer so you can capture the text with getvalue().",
    ],
    animated_diagrams: [
      {
        title: "The finished pipeline",
        caption: "Notes flow through every stage you built and land as an Anki-ready CSV file.",
        loop: false,
        nodes: [
          { label: "Load notes", sub: "read the file", detail: "Read the raw study notes from disk as one block of text." },
          { label: "Chunk", sub: "lesson 2", detail: "Split the notes into study-sized chunks on sentence boundaries." },
          { label: "Batch + extract", sub: "lessons 3, 4, 6", detail: "Pack chunks into budgeted batches, call the model, and safely parse each JSON reply." },
          { label: "Dedup + validate", sub: "lessons 5, 7", detail: "Drop repeats by normalized key, then keep only cards that pass is_good." },
          { label: "Export CSV", sub: "csv.writer", detail: "Write one escaped row per card so the file imports straight into Anki." },
        ],
      },
    ],
    key_terms: [
      { term: "CSV", definition: "Comma-separated values: one card per row, question in the first column and answer in the second." },
      { term: "RFC 4180", definition: "The CSV standard: a field with a comma, double-quote, or newline is wrapped in double-quotes with interior quotes doubled." },
      { term: "csv.writer", definition: "The stdlib writer that applies RFC 4180 escaping for you, so you never hand-build a comma-joined line." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Escape this field for CSV: Say \"hi\", ok?",
        steps: [
          "The field contains both a comma and double-quotes, so it must be quoted per RFC 4180.",
          "Double every interior double-quote: Say \"hi\" becomes Say \"\"hi\"\".",
          "Wrap the whole field in outer double-quotes.",
          "csv.writer does all of this automatically when you pass the raw string in a row.",
        ],
        output: "\"Say \"\"hi\"\", ok?\"",
      },
    ],
    inline_quizzes: [
      {
        question: "Why let csv.writer build the row instead of joining fields with commas yourself?",
        options: [
          "csv.writer is faster than string joins",
          "It applies RFC 4180 escaping, so commas, quotes, and newlines inside a field land in one column",
          "Anki rejects manually built rows",
          "String joins are deprecated in Python",
        ],
        correct_index: 1,
        explanation: "Flashcard text is full of commas and quotes. csv.writer quotes and doubles them correctly so a field like Say \"hi\", ok? stays in one column.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "You should pass newline=\"\" to open() when writing a CSV file.", correct_answer: "true", explanation: "Without newline=\"\" you get blank rows between cards on some platforms." },
          { type: "fill_in", question: "Which stdlib module handles CSV escaping correctly?", correct_answer: "csv", explanation: "The csv module implements RFC 4180 so you never escape fields by hand." },
        ],
      },
    ],
    callouts: [
      { type: "tip", position: "after", title: "Shipped means it survives junk", content: "It is shipped when a clean start with one command handles an empty or junk notes file without crashing, writing a header-only or empty file instead of throwing." },
    ],
    challenge_title: "Escape the CSV Row",
    challenge_description:
      "Turn question|answer cards into properly escaped CSV rows: quote any field containing a comma or quote, doubling interior quotes.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def escape(field):
    # TODO: if field contains a comma or a double-quote, wrap it in double-quotes
    #       and double any interior double-quotes; otherwise return it unchanged
    pass

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for line in data[1:1 + n]:
        q, a = line.split("|")
        print(escape(q) + "," + escape(a))

main()
`,
    challenge_solution_code: `import sys

def escape(field):
    if "," in field or '"' in field:
        return '"' + field.replace('"', '""') + '"'
    return field

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for line in data[1:1 + n]:
        q, a = line.split("|")
        print(escape(q) + "," + escape(a))

main()
`,
    challenge_test_cases: [
      {
        input: '2\nWhat is 2+2?|4\nSay "hi", ok?|Greeting',
        expected_output: 'What is 2+2?,4\n"Say ""hi"", ok?",Greeting',
        description: "The plain card passes through; the one with a comma and quotes is escaped.",
      },
      {
        input: "1\na|b",
        expected_output: "a,b",
        description: "Fields with no special characters need no quoting.",
      },
      {
        input: "1\nhas,comma|plain",
        expected_output: '"has,comma",plain',
        description: "A field containing a comma gets wrapped in double-quotes.",
      },
    ],
  },
];

export default { project, lessons };
