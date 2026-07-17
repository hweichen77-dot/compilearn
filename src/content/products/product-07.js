export default {
  project: {
    id: "prod-07",
    title: "Meeting Notes to Action Items",
    description:
      "Turn a raw meeting transcript into a clean list of action items, each with an owner and a due date, then group them by person. You'll build the extraction prompt, force reliable JSON output, and harden it against messy real-world transcripts.",
    difficulty: "intermediate",
    category: "prompting",
    estimated_time: 120,
    lessons_count: 8,
    tags: ["prompting", "extraction", "structured-output", "json", "meeting-notes", "action-items"],
    order: 107,
    cover_image: "",
    track: "ai",
    kind: "product",
  },
  lessons: [
    {
      id: "prod-07-1",
      project_id: "prod-07",
      order: 1,
      title: "The Transcript Problem",
      concept: "extraction as a loop",
      explanation: `Every meeting ends the same way: someone agreed to do something, and by Monday nobody remembers who, or by when. You have a wall of transcript text and you need a short, honest list of who owes what. That gap is the whole product.

## What we're building

By lesson 8 you'll have a tool that takes a raw transcript and returns action items, each with an **owner**, a **task**, and a **due date**, grouped by person. It's the same six-step loop every AI product follows: get the transcript in, wrap it in a prompt, call the model, parse the reply into structured items, verify them, and print the report.

The special step here is **parse**. A summarizer turns text into shorter text. We turn text into *structured data*: a list of records your code can sort, group, and count. That's the skill this whole track calls extraction.

## Why not just eyeball it

A ten-minute meeting is a thousand words of noise: greetings, tangents, half-decisions, jokes. The action items are three or four sentences buried in it. A human skimming misses some and mis-remembers owners. The model reads the whole thing every time and pulls the commitments out consistently, which is exactly the boring, repeatable job it's good at.

## The real call, previewed

The actual product sends the transcript to the model with an instruction to extract commitments:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

transcript = open("standup.txt").read()

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    system="You extract action items from meeting transcripts.",
    messages=[{"role": "user", "content": transcript}],
)
print(resp.content[0].text)
\`\`\`

That works, but the reply is loose prose. The next seven lessons turn that loose reply into clean, structured, grouped action items you can trust.

## Before the model: find the candidates

The first instinct is to send everything to the model, and eventually we will. But it helps to see the shape of the problem first with plain Python. Not every line is an action item. Lines that create a commitment tend to contain trigger words: "will", "todo", "action". Filtering for those is a crude first pass a human would do too, and it makes the extraction job smaller.

## The mental model to keep

Think of the transcript as raw ore and the action items as the metal you want out of it. The model does the smelting later, but you still decide what goes in and what a clean result looks like. Below, build the candidate filter by hand, no API yet, so you get a feel for the raw material before you automate it.`,
      animated_diagrams: [
        {
          title: "The extraction pipeline",
          caption: "The same six steps run every time you turn a transcript into action items.",
          loop: false,
          nodes: [
            { label: "Ingest", sub: "read transcript", detail: "Load the raw meeting text, the wall of words you want commitments out of." },
            { label: "Prompt", sub: "wrap in instructions", detail: "Put the transcript inside a prompt that tells the model exactly what to pull out." },
            { label: "Model", sub: "call the API", detail: "The model reads the whole transcript and returns the commitments it found." },
            { label: "Parse", sub: "text to records", detail: "Turn the loose reply into structured items your code can sort and group. This is the new skill." },
            { label: "Verify", sub: "check each item", detail: "Drop junk, fill blanks, keep only the items you trust." },
            { label: "Report", sub: "print for a human", detail: "Group by person and render a clean list someone can act on." },
          ],
        },
      ],
      key_terms: [
        { term: "Extraction", definition: "Turning free text into structured records your code can sort, count, and group." },
        { term: "Structured data", definition: "Data organized into named fields, like owner and due, instead of a paragraph of prose." },
        { term: "Trigger word", definition: "A word like 'will' or 'todo' that hints a line is a commitment, useful for a cheap first-pass filter." },
      ],
      inline_quizzes: [
        {
          question: "How is extraction different from summarizing?",
          options: [
            "Summarizing makes text shorter; extraction turns text into structured records",
            "They are the same thing with different names",
            "Extraction always needs a bigger model",
            "Summarizing keeps every word; extraction deletes words",
          ],
          correct_index: 0,
          explanation: "A summary is shorter text. Extraction pulls out fields (owner, task, due) that your code can work with.",
        },
        {
          question: "Why filter for trigger words before calling the model?",
          options: [
            "It replaces the model entirely",
            "It shrinks the job and shows you the shape of the problem cheaply",
            "The model cannot read full transcripts",
            "Trigger words are required by the API",
          ],
          correct_index: 1,
          explanation: "The filter is a free first pass. It makes the extraction smaller and helps you understand the raw material before automating it.",
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Filter these lines with TRIGGERS = ('will', 'todo', 'action'): \"Alex will send the report\" / \"we chatted about lunch\" / \"TODO: book the room\"",
          steps: [
            "Lowercase line 1: 'alex will send the report' contains 'will', keep it.",
            "Lowercase line 2: 'we chatted about lunch' has no trigger word, drop it.",
            "Lowercase line 3: 'todo: book the room' contains 'todo', keep it.",
          ],
          output: "2 candidate action lines: the Alex line and the TODO line.",
        },
      ],
      starter_code: `# First pass, no API yet: pull the candidate action lines out of a transcript.
# An action line tends to contain a trigger word like "will", "todo", "action".

transcript = """Alex will send the Q3 report by Friday.
We spent a while on the budget numbers.
TODO: Sam books the conference room.
Priya thinks the launch looks good.
Action item: Jordan updates the changelog."""

TRIGGERS = ("will", "todo", "action")

def is_action_line(line):
    # TODO: return True if a lowercased 'line' contains any trigger word
    pass

lines = transcript.split("\\n")
# TODO: keep only the lines where is_action_line is True
actions = []

print("Lines:", len(lines))
print("Action candidates:", len(actions))
for a in actions:
    print("-", a)
`,
      solution_code: `# First pass, no API yet: pull the candidate action lines out of a transcript.
# An action line tends to contain a trigger word like "will", "todo", "action".

transcript = """Alex will send the Q3 report by Friday.
We spent a while on the budget numbers.
TODO: Sam books the conference room.
Priya thinks the launch looks good.
Action item: Jordan updates the changelog."""

TRIGGERS = ("will", "todo", "action")

def is_action_line(line):
    low = line.lower()
    return any(t in low for t in TRIGGERS)

lines = transcript.split("\\n")
actions = [ln for ln in lines if is_action_line(ln)]

print("Lines:", len(lines))
print("Action candidates:", len(actions))
for a in actions:
    print("-", a)
`,
      expected_output: `Lines: 5
Action candidates: 3
- Alex will send the Q3 report by Friday.
- TODO: Sam books the conference room.
- Action item: Jordan updates the changelog.`,
      hints: [
        "Lowercase the line first so the match is case-insensitive.",
        "any(t in low for t in TRIGGERS) is True if the line contains any trigger word.",
        "Build the filtered list with a comprehension: [ln for ln in lines if is_action_line(ln)].",
      ],
      challenge_title: "Count the Commitments",
      challenge_description: "Scan a transcript and count how many lines look like action items.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    triggers = ("will", "todo", "action")
    # TODO: count lines 1..n that contain any trigger word (case-insensitive)
    count = 0
    print(count)

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    triggers = ("will", "todo", "action")
    count = 0
    for i in range(1, n + 1):
        low = data[i].lower()
        if any(t in low for t in triggers):
            count += 1
    print(count)

main()
`,
      challenge_test_cases: [
        {
          input: "4\nAlex will send the report\nwe discussed the budget\nTODO: Sam books the room\nAction item: Priya reviews the PR",
          expected_output: "3",
          description: "Three lines contain a trigger word (will, todo, action).",
        },
        {
          input: "2\nnothing here\njust chatting about the weekend",
          expected_output: "0",
          description: "No trigger words, so no action items.",
        },
        {
          input: "3\nJordan will deploy tonight\nTODO: update docs\nAction: close the ticket",
          expected_output: "3",
          description: "Every line is a commitment.",
        },
      ],
    },

    {
      id: "prod-07-2",
      project_id: "prod-07",
      order: 2,
      title: "The Smallest Extractor",
      concept: "one item, three fields",
      explanation: `A filter that finds candidate lines is a start, but "Alex will send the Q3 report by Friday" is still a sentence, not data. The smallest useful version of this product takes one commitment sentence and splits it into three named fields: **owner**, **task**, **due**. That's the atom everything else is built from.

## The extraction prompt

We ask the model to do the splitting. The trick is telling it the exact output shape. Vague instructions ("pull out the details") give you a paragraph back; a precise format gives you something parseable. The simplest parseable format is a single delimited line:

\`\`\`python
SYSTEM = """You extract a single action item from one sentence.
Return exactly one line in this format, with pipes as separators:
owner | task | due
Use the person's name for owner, a short imperative for task,
and the deadline for due. Nothing else."""

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    system=SYSTEM,
    messages=[{"role": "user", "content": "Alex will send the Q3 report by Friday."}],
)
print(resp.content[0].text)   # -> "Alex | Send the Q3 report | Friday"
\`\`\`

## Why a delimiter first

You'll upgrade to JSON in lesson 4, but a pipe-delimited line is the perfect training wheel. It's dead simple to produce and dead simple to parse: \`line.split("|")\`. Starting here keeps the two hard parts separate: first get the model to return a *consistent shape*, then worry about a *richer* shape. Learn one thing at a time.

## Parsing the reply

Whatever format you ask for, the model's reply is just a string until your code gives it structure. Parsing the delimited line means splitting on the pipe and stripping the whitespace the model likes to add around separators:

\`\`\`python
def parse_item(line):
    parts = [p.strip() for p in line.split("|")]
    return {"owner": parts[0], "task": parts[1], "due": parts[2]}
\`\`\`

Now "Alex | Send the Q3 report | Friday" becomes \`{"owner": "Alex", "task": "Send the Q3 report", "due": "Friday"}\`, a record your code can store, sort, and group.

## The two-sided contract

Extraction is a contract with two sides you both control. The **prompt** promises a shape ("owner | task | due"); the **parser** assumes that shape. Keep them in lockstep. If you change the delimiter in the prompt, change the split in the parser. Most extraction bugs are a prompt and a parser that quietly disagree about the format.

## The mental model to keep

The model is a translator from messy language to a fixed shape you designed. You wrote the shape; the model fills it in. Below, skip the network and practice the parser side: turn one delimited reply into a clean three-field record.`,
      animated_diagrams: [
        {
          title: "One sentence to one record",
          caption: "The prompt promises a shape; the parser turns that shape into a record.",
          loop: false,
          nodes: [
            { label: "Sentence", sub: "raw commitment", detail: "\"Alex will send the Q3 report by Friday.\" is language, not data yet." },
            { label: "Prompt shape", sub: "owner | task | due", detail: "You tell the model to return exactly one pipe-delimited line, nothing else." },
            { label: "Model line", sub: "Alex | Send... | Friday", detail: "The model fills in your shape and returns a single delimited string." },
            { label: "split('|')", sub: "cut into pieces", detail: "Splitting on the pipe gives a list of three raw strings." },
            { label: "Record", sub: "owner/task/due dict", detail: "Strip each piece and build a dict your code can store and group." },
          ],
        },
      ],
      key_terms: [
        { term: "Delimiter", definition: "A separator character, here the pipe, that marks where one field ends and the next begins." },
        { term: "Parse", definition: "Turn a string into structured data your program can use, like splitting a line into named fields." },
        { term: "Two-sided contract", definition: "The prompt promises a format and the parser assumes it; both must agree or extraction breaks." },
      ],
      inline_quizzes: [
        {
          question: "Why start with a pipe-delimited line instead of JSON?",
          options: [
            "JSON cannot hold three fields",
            "A delimited line is trivial to produce and parse, so you learn 'consistent shape' before 'rich shape'",
            "Pipes are faster for the model",
            "JSON is not supported by the API",
          ],
          correct_index: 1,
          explanation: "The pipe is a training wheel. It separates the two hard parts: getting a consistent shape first, then a richer one later.",
        },
        {
          question: "The model returns \"Alex | Send report | Friday\" with spaces around the pipes. What must the parser do?",
          options: [
            "Reject the line as malformed",
            "Split on '|' and strip whitespace off each piece",
            "Ask the model to try again",
            "Replace spaces with underscores",
          ],
          correct_index: 1,
          explanation: "Models add spaces around separators. Split on the pipe, then .strip() each part so 'Alex ' becomes 'Alex'.",
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Parse the model line: \"Sam | Book the room | Monday\"",
          steps: [
            "Split on '|' -> ['Sam ', ' Book the room ', ' Monday'].",
            "Strip each piece -> ['Sam', 'Book the room', 'Monday'].",
            "Map them to the field names owner, task, due in order.",
          ],
          output: "{\"owner\": \"Sam\", \"task\": \"Book the room\", \"due\": \"Monday\"}",
        },
      ],
      starter_code: `# The model returned one action item as a delimited line.
# Your job is the parser side: turn it into a three-field record.

reply = "Alex | Send the Q3 report | Friday"

def parse_item(line):
    # TODO: split on "|", strip each part, return a dict
    #       with keys "owner", "task", "due"
    pass

item = parse_item(reply)
print("Owner:", item["owner"])
print("Task:", item["task"])
print("Due:", item["due"])
`,
      solution_code: `# The model returned one action item as a delimited line.
# Your job is the parser side: turn it into a three-field record.

reply = "Alex | Send the Q3 report | Friday"

def parse_item(line):
    parts = [p.strip() for p in line.split("|")]
    return {"owner": parts[0], "task": parts[1], "due": parts[2]}

item = parse_item(reply)
print("Owner:", item["owner"])
print("Task:", item["task"])
print("Due:", item["due"])
`,
      expected_output: `Owner: Alex
Task: Send the Q3 report
Due: Friday`,
      hints: [
        "line.split(\"|\") gives you a list of the three pieces.",
        "The model adds spaces around the pipes, so .strip() each piece.",
        "Return {\"owner\": parts[0], \"task\": parts[1], \"due\": parts[2]}.",
      ],
      challenge_title: "Format the Extracted Items",
      challenge_description: "Parse pipe-delimited action items and print each in a readable one-line format.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for i in range(1, n + 1):
        # TODO: split data[i] on "|" into owner, task, due
        #       then print "owner: task (due: due)"
        pass

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for i in range(1, n + 1):
        owner, task, due = data[i].split("|")
        print(f"{owner}: {task} (due: {due})")

main()
`,
      challenge_test_cases: [
        {
          input: "2\nAlex|Send the Q3 report|Friday\nSam|Book the room|Monday",
          expected_output: "Alex: Send the Q3 report (due: Friday)\nSam: Book the room (due: Monday)",
          description: "Two items reformatted from pipe-delimited to readable.",
        },
        {
          input: "1\nPriya|Review the PR|Wednesday",
          expected_output: "Priya: Review the PR (due: Wednesday)",
          description: "A single item.",
        },
      ],
    },

    {
      id: "prod-07-3",
      project_id: "prod-07",
      order: 3,
      title: "Owner, Task, Deadline",
      concept: "reliable three-field extraction",
      explanation: `One clean sentence is easy. Real transcripts aren't clean. Somebody says "we should update the wiki" with no owner. Somebody says "Priya, can you review the PR?" with no deadline. If your extractor assumes every item has all three fields, it breaks the first time reality shows up. This lesson makes the three-field extraction hold up: always three fields, even when the transcript only gives you one or two.

## Prompt for the missing case explicitly

The model won't guess your convention unless you tell it. If you don't say what to do about a missing owner, it might invent one, drop the item, or leave the field blank inconsistently. Pin it down:

\`\`\`python
SYSTEM = """Extract action items as lines of: owner | task | due
Rules:
- owner: the person's name. If nobody is named, use an empty owner.
- task: a short imperative describing the work.
- due: the deadline exactly as stated. If none is given, leave it empty.
Never invent an owner or a deadline that wasn't said."""
\`\`\`

The "never invent" line matters. Models are eager to be helpful and will happily assign a random due date to look complete. Telling it to leave the field empty is what keeps your data honest.

## Fill defaults in code, not the prompt

You want empty fields to become readable labels like "Unassigned" and "No deadline", but that's a *display* decision, so do it in Python, not the prompt. Keep the model's job narrow (extract what was said) and let your code apply presentation rules:

\`\`\`python
def normalize(parts):
    owner = parts[0].strip() or "Unassigned"
    task = parts[1].strip()
    due = parts[2].strip() or "No deadline"
    return {"owner": owner, "task": task, "due": due}
\`\`\`

The \`x or default\` idiom is the workhorse here: an empty string is falsy, so \`"" or "Unassigned"\` evaluates to "Unassigned", while \`"Alex" or "Unassigned"\` stays "Alex". One line handles the missing case for each field.

## Why the split of duties matters

There are two places a rule can live: in the prompt (the model applies it) or in your code (you apply it). Extraction rules ("what was actually said") belong to the model because only it can read the language. Policy rules ("blanks display as Unassigned") belong to your code because they're deterministic and free, so there's no reason to spend a token or risk the model forgetting. Get this division wrong and your extractor turns flaky; get it right and it stays predictable.

## The mental model to keep

The model reports the facts; your code sets the house style. Below, take several extracted lines, some with blanks, and normalize every one into a complete three-field record with sensible defaults.`,
      animated_diagrams: [
        {
          title: "Normalizing one item",
          caption: "The model reports what was said; your code fills the blanks with house-style defaults.",
          loop: false,
          nodes: [
            { label: "Model line", sub: "may have blanks", detail: "\" | Update the wiki | \" came back with no owner and no due date." },
            { label: "Split + strip", sub: "three raw parts", detail: "Cut on the pipe and strip each field so a blank field is an empty string." },
            { label: "owner or default", sub: "blank to Unassigned", detail: "An empty string is falsy, so '' or 'Unassigned' picks the default." },
            { label: "due or default", sub: "blank to No deadline", detail: "Same trick for the deadline: keep what was said, otherwise use a label." },
            { label: "Full record", sub: "always 3 fields", detail: "Every item now has all three fields, even when the transcript only gave one." },
          ],
        },
      ],
      key_terms: [
        { term: "Normalize", definition: "Reshape messy records into one consistent form, here always three filled fields." },
        { term: "Falsy", definition: "A value Python treats as false in a condition; an empty string is falsy, which makes the 'or default' idiom work." },
        { term: "Extraction vs policy rules", definition: "Extraction rules (what was said) belong in the prompt; policy rules (blanks show as Unassigned) belong in code." },
      ],
      inline_quizzes: [
        {
          question: "What does the expression \"\" or \"Unassigned\" evaluate to?",
          options: ["An empty string", "\"Unassigned\"", "True", "None"],
          correct_index: 1,
          explanation: "An empty string is falsy, so 'or' returns the right side. 'Alex' or 'Unassigned' would stay 'Alex' because a non-empty string is truthy.",
        },
        {
          question: "Where should the 'blanks display as Unassigned' rule live?",
          options: [
            "In the prompt, so the model applies it",
            "In your Python code, because it is deterministic and free",
            "In the transcript",
            "Nowhere; leave blanks blank",
          ],
          correct_index: 1,
          explanation: "Display defaults are a policy decision. Keep the model's job narrow (extract what was said) and apply presentation rules in code.",
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Normalize the extracted line: \" | Update the wiki | \"",
          steps: [
            "Split and strip -> owner '', task 'Update the wiki', due ''.",
            "owner: '' or 'Unassigned' -> 'Unassigned'.",
            "due: '' or 'No deadline' -> 'No deadline'. task is left as-is.",
          ],
          output: "{\"owner\": \"Unassigned\", \"task\": \"Update the wiki\", \"due\": \"No deadline\"}",
        },
      ],
      starter_code: `# The model extracted several items, but some fields came back blank.
# Normalize every line into a complete record with sensible defaults.

model_lines = [
    "Alex | Send report | Friday",
    " | Update the wiki | ",
    "Priya | Review the PR | ",
]

def normalize(line):
    parts = [p.strip() for p in line.split("|")]
    # TODO: owner defaults to "Unassigned" when blank
    # TODO: due defaults to "No deadline" when blank
    # TODO: return a dict with owner, task, due
    pass

for ln in model_lines:
    item = normalize(ln)
    print(f"{item['owner']} :: {item['task']} :: {item['due']}")
`,
      solution_code: `# The model extracted several items, but some fields came back blank.
# Normalize every line into a complete record with sensible defaults.

model_lines = [
    "Alex | Send report | Friday",
    " | Update the wiki | ",
    "Priya | Review the PR | ",
]

def normalize(line):
    parts = [p.strip() for p in line.split("|")]
    owner = parts[0] or "Unassigned"
    task = parts[1]
    due = parts[2] or "No deadline"
    return {"owner": owner, "task": task, "due": due}

for ln in model_lines:
    item = normalize(ln)
    print(f"{item['owner']} :: {item['task']} :: {item['due']}")
`,
      expected_output: `Alex :: Send report :: Friday
Unassigned :: Update the wiki :: No deadline
Priya :: Review the PR :: No deadline`,
      hints: [
        "After stripping, an empty field is an empty string, which is falsy.",
        "parts[0] or \"Unassigned\" gives the default only when the owner is blank.",
        "Do the same for due with \"No deadline\"; leave task as-is here.",
      ],
      challenge_title: "Default the Missing Fields",
      challenge_description: "Parse action items where owner or due may be blank, applying default labels.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for i in range(1, n + 1):
        parts = data[i].split("|")
        # TODO: strip each part; blank owner -> "Unassigned",
        #       blank due -> "No deadline"; then print
        #       "owner | task | due"
        pass

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    for i in range(1, n + 1):
        parts = data[i].split("|")
        owner = parts[0].strip() or "Unassigned"
        task = parts[1].strip()
        due = parts[2].strip() or "No deadline"
        print(f"{owner} | {task} | {due}")

main()
`,
      challenge_test_cases: [
        {
          input: "3\nAlex|Send report|Friday\n|Update the wiki|\nPriya|Review PR|Wednesday",
          expected_output: "Alex | Send report | Friday\nUnassigned | Update the wiki | No deadline\nPriya | Review PR | Wednesday",
          description: "Blank owner and blank due each get a default label.",
        },
        {
          input: "1\n|Clean up the backlog|",
          expected_output: "Unassigned | Clean up the backlog | No deadline",
          description: "Both owner and due default.",
        },
      ],
    },

    {
      id: "prod-07-4",
      project_id: "prod-07",
      order: 4,
      title: "Make It Return JSON",
      concept: "structured JSON output",
      explanation: `Pipe-delimited lines got us this far, but they're fragile. What if a task itself contains a pipe? What if you later want a fourth field like priority? Delimited text falls apart. The standard shape for structured model output is **JSON**, and switching to it is what takes this product from a demo to something you'd actually run.

## Ask for JSON, precisely

You get JSON by asking for JSON and describing the exact schema, keys included. Show the model the shape you want:

\`\`\`python
SYSTEM = """Extract all action items from the transcript.
Return ONLY a JSON array, no prose, no code fence. Each element:
{"owner": "name or empty", "task": "short imperative", "due": "deadline or empty"}
Example: [{"owner": "Alex", "task": "Send the report", "due": "Friday"}]"""

resp = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=800,
    system=SYSTEM,
    messages=[{"role": "user", "content": transcript}],
)
items = json.loads(resp.content[0].text)
\`\`\`

Now one call returns *all* the items as a list of dicts, exactly the structure your code wants.

## The model wraps its JSON, deal with it

Even when you say "only JSON", models often wrap it in chatty text or a Markdown code fence like \\\`\\\`\\\`json ... \\\`\\\`\\\`. A raw \`json.loads\` on that reply throws. The fix is to grab the JSON array out of whatever surrounds it by finding the first \`[\` and the last \`]\`:

\`\`\`python
def extract_json(text):
    start = text.index("[")
    end = text.rindex("]") + 1
    return json.loads(text[start:end])
\`\`\`

This one guard handles most of what goes wrong with structured output. It survives code fences, a leading "Here are the items:", and a trailing "Hope that helps!" without any special-casing.

## Validate every item

Parsing succeeds, but you're not done: the model might return an item missing the \`due\` key, or with an empty owner. Before you trust an item, check it has the keys you need with non-empty values:

\`\`\`python
REQUIRED = ("owner", "task", "due")

def is_valid(item):
    return all(item.get(k) for k in REQUIRED)
\`\`\`

\`item.get(k)\` returns None for a missing key (falsy) and "" for a blank value (also falsy), so one \`all(...)\` catches both problems. Keep the valid items, count or log the rest.

## The mental model to keep

JSON is the handoff point between what the model writes and what your program can work with. You ask for a precise shape, pull it out defensively because the model gets chatty, then validate before you trust it. Below, take a realistic messy reply, pull the JSON out of the surrounding text, and keep only the complete items.`,
      animated_diagrams: [
        {
          title: "From chatty reply to clean items",
          caption: "Ask for JSON, pull it out of whatever the model wrapped it in, then validate.",
          loop: false,
          nodes: [
            { label: "Model reply", sub: "JSON plus chatter", detail: "\"Here are the items: [ ... ] hope that helps!\" mixes the array with prose." },
            { label: "Find [ ... ]", sub: "first [ to last ]", detail: "Slice from the first '[' to the last ']' to grab just the array, code fence or not." },
            { label: "json.loads", sub: "text to list", detail: "Parse the slice into a real Python list of dicts." },
            { label: "Validate", sub: "check every key", detail: "Keep only items where owner, task, and due are all present and non-empty." },
            { label: "Clean list", sub: "trusted records", detail: "What survives is safe to group, sort, and render." },
          ],
        },
      ],
      key_terms: [
        { term: "JSON", definition: "A text format for structured data, the standard shape for model output your code needs to parse." },
        { term: "Schema", definition: "The exact keys and value types you ask the model to return, like owner, task, and due." },
        { term: "Validation", definition: "Checking parsed data has the fields you need before you trust it downstream." },
      ],
      inline_quizzes: [
        {
          question: "Why slice from the first '[' to the last ']' instead of calling json.loads directly?",
          options: [
            "It runs faster",
            "The model often wraps JSON in prose or a code fence, and the slice survives that",
            "json.loads cannot read arrays",
            "It removes duplicate items",
          ],
          correct_index: 1,
          explanation: "Even when you ask for 'only JSON', models add a lead-in or a code fence. Grabbing first '[' to last ']' ignores the surrounding text.",
        },
        {
          question: "What does all(item.get(k) for k in REQUIRED) catch?",
          options: [
            "Only missing keys",
            "Only empty values",
            "Both a missing key (get returns None) and a blank value (empty string), since both are falsy",
            "Extra keys the model added",
          ],
          correct_index: 2,
          explanation: "item.get(k) returns None for a missing key and '' for a blank value. Both are falsy, so one all(...) rejects either problem.",
        },
      ],
      worked_examples: [
        {
          difficulty: "medium",
          prompt: "Extract and validate: 'Here you go: [{\"owner\": \"Alex\", \"task\": \"Send report\", \"due\": \"Friday\"}, {\"owner\": \"Sam\", \"task\": \"Book room\", \"due\": \"\"}] done!'",
          steps: [
            "First '[' and last ']' bound the array; slice and json.loads it into 2 dicts.",
            "Item 1: owner, task, due all non-empty -> valid.",
            "Item 2: due is '' which is falsy -> all(...) is False -> invalid, drop it.",
          ],
          output: "Parsed 2 items, kept 1 valid: Alex -> Send report.",
        },
      ],
      starter_code: `import json

# The model returned JSON, but wrapped in chatty text (as it often does).
# Extract the array, then keep only items with all three fields filled.

raw = 'Here are the items: [{"owner": "Alex", "task": "Send report", "due": "Friday"}, {"owner": "Sam", "task": "Book room", "due": ""}] hope that helps!'

def extract_json(text):
    # TODO: find the first "[" and last "]" and json.loads that slice
    pass

REQUIRED = ("owner", "task", "due")

def is_valid(item):
    # TODO: True only if owner, task, and due are all present and non-empty
    pass

items = extract_json(raw)
valid = [it for it in items if is_valid(it)]
print("Parsed:", len(items))
print("Valid:", len(valid))
for it in valid:
    print("-", it["owner"], "->", it["task"])
`,
      solution_code: `import json

# The model returned JSON, but wrapped in chatty text (as it often does).
# Extract the array, then keep only items with all three fields filled.

raw = 'Here are the items: [{"owner": "Alex", "task": "Send report", "due": "Friday"}, {"owner": "Sam", "task": "Book room", "due": ""}] hope that helps!'

def extract_json(text):
    start = text.index("[")
    end = text.rindex("]") + 1
    return json.loads(text[start:end])

REQUIRED = ("owner", "task", "due")

def is_valid(item):
    return all(item.get(k) for k in REQUIRED)

items = extract_json(raw)
valid = [it for it in items if is_valid(it)]
print("Parsed:", len(items))
print("Valid:", len(valid))
for it in valid:
    print("-", it["owner"], "->", it["task"])
`,
      expected_output: `Parsed: 2
Valid: 1
- Alex -> Send report`,
      hints: [
        "text.index(\"[\") is the first bracket; text.rindex(\"]\") is the last.",
        "json.loads on the slice text[start:end] gives you the list of dicts.",
        "all(item.get(k) for k in REQUIRED) is False if any field is missing or empty.",
      ],
      challenge_title: "Validate the JSON Items",
      challenge_description: "Parse a JSON array of action items and count how many are complete versus incomplete.",
      challenge_language: "python",
      challenge_starter_code: `import sys, json

def main():
    items = json.loads(sys.stdin.read())
    required = ("owner", "task", "due")
    # TODO: an item is valid if owner, task, and due are all present
    #       and non-empty. Count valid and invalid.
    valid = 0
    invalid = 0
    print(f"valid: {valid}")
    print(f"invalid: {invalid}")

main()
`,
      challenge_solution_code: `import sys, json

def main():
    items = json.loads(sys.stdin.read())
    required = ("owner", "task", "due")
    valid = sum(1 for it in items if all(it.get(k) for k in required))
    invalid = len(items) - valid
    print(f"valid: {valid}")
    print(f"invalid: {invalid}")

main()
`,
      challenge_test_cases: [
        {
          input: "[{\"owner\": \"Alex\", \"task\": \"Send report\", \"due\": \"Friday\"}, {\"owner\": \"\", \"task\": \"Fix bug\", \"due\": \"Monday\"}, {\"task\": \"No owner key\", \"due\": \"Tue\"}]",
          expected_output: "valid: 1\ninvalid: 2",
          description: "One complete item; one blank owner; one missing owner key.",
        },
        {
          input: "[{\"owner\": \"Sam\", \"task\": \"Book room\", \"due\": \"Now\"}]",
          expected_output: "valid: 1\ninvalid: 0",
          description: "A single fully-populated item.",
        },
        {
          input: "[]",
          expected_output: "valid: 0\ninvalid: 0",
          description: "Edge: empty array has nothing to count.",
        },
      ],
    },

    {
      id: "prod-07-5",
      project_id: "prod-07",
      order: 5,
      title: "Group by Owner",
      concept: "flat list to per-person view",
      explanation: `You now have a flat list of validated action items. It's correct, but it's not yet *useful*. Nobody wants to scan twenty mixed items to find their three. The payoff view of this product is per-person: each owner sees exactly what they owe, in one place. That's grouping, and it's pure Python, no model needed.

## Grouping is a dictionary of lists

The whole operation is one pattern: a dict where each key is an owner and each value is the list of that owner's items. \`setdefault\` builds it in one pass:

\`\`\`python
def group_by_owner(items):
    groups = {}
    for it in items:
        groups.setdefault(it["owner"], []).append(it)
    return groups
\`\`\`

\`groups.setdefault(owner, [])\` returns the existing list for that owner, or creates a fresh empty list the first time you see them, then you append. After one loop, \`groups\` maps each owner to all their tasks. This "dict of lists" is the most common shape in all of data wrangling; once it's in your fingers you'll reach for it constantly.

## Sort for a stable report

A dict preserves insertion order, which means owners come out in the order they first appeared in the transcript. That's arbitrary. A report reads better alphabetically, and it's stable, run it twice and Alex is always first:

\`\`\`python
for owner in sorted(groups):
    tasks = groups[owner]
    print(f"{owner} ({len(tasks)}):")
    for it in tasks:
        print(f"  - {it['task']} (due {it['due']})")
\`\`\`

Within each owner, the tasks stay in transcript order, which is usually the order they were discussed, a sensible default. \`len(tasks)\` gives you a free per-person count, so everyone sees their load at a glance.

## Where the model stops and code takes over

Notice the division of labor across this project. The model did the hard, fuzzy part: reading language and pulling out commitments. Everything since, defaulting fields, validating, and now grouping and sorting, is plain deterministic Python. Use the model for the one thing only it can do, and use ordinary code for the transforms that are simple and predictable. Ordinary code is cheaper, and it will never hallucinate a group that wasn't there.

## The mental model to keep

Grouping turns a pile into folders, one per person, each holding just their work. The model filled the pile; a dict of lists sorts it into folders. Below, group a list of action items by owner and print each person's tasks with a count.`,
      animated_diagrams: [
        {
          title: "Flat list into folders",
          caption: "One pass with setdefault turns a mixed pile into one folder per owner.",
          loop: true,
          nodes: [
            { label: "Next item", sub: "read one record", detail: "Take the next action item from the flat list, for example {owner: Alex, task: Send report}." },
            { label: "setdefault", sub: "find owner's list", detail: "groups.setdefault(owner, []) returns Alex's list, creating an empty one the first time." },
            { label: "append", sub: "drop it in", detail: "Append the whole item to that owner's list, keeping its task and due." },
            { label: "sorted view", sub: "folders A to Z", detail: "After the loop, iterate sorted(groups) so owners print alphabetically and stably." },
          ],
        },
      ],
      key_terms: [
        { term: "Dict of lists", definition: "A dictionary whose values are lists; the standard shape for grouping items by a key." },
        { term: "setdefault", definition: "Returns the value for a key, inserting a default (here an empty list) if the key is new." },
        { term: "Stable sort", definition: "An ordering that gives the same result every run; sorting owners alphabetically makes the report predictable." },
      ],
      inline_quizzes: [
        {
          question: "What does groups.setdefault(owner, []) return the first time it sees a new owner?",
          options: [
            "None",
            "A fresh empty list, which it also stores under that owner",
            "The whole groups dict",
            "An error",
          ],
          correct_index: 1,
          explanation: "For a new key setdefault inserts the default [] and returns it, so you can append immediately. For an existing key it returns the current list.",
        },
        {
          question: "Why loop over sorted(groups) instead of groups directly?",
          options: [
            "Dicts cannot be looped",
            "A plain dict yields owners in first-seen order, which is arbitrary; sorting makes the report stable and alphabetical",
            "sorted removes duplicates",
            "It is faster",
          ],
          correct_index: 1,
          explanation: "Insertion order is whatever the transcript happened to mention first. sorted(groups) gives a stable, readable A-to-Z report.",
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Group: Alex/Send report, Sam/Book room, Alex/Review PR",
          steps: [
            "Alex is new: setdefault makes []; append Send report -> {Alex: [Send report]}.",
            "Sam is new: append Book room -> {Alex: [...], Sam: [Book room]}.",
            "Alex exists: append Review PR -> {Alex: [Send report, Review PR], Sam: [Book room]}.",
          ],
          output: "Alex (2): Send report, Review PR / Sam (1): Book room",
        },
      ],
      starter_code: `# Turn a flat list of action items into a per-owner view.

items = [
    {"owner": "Alex", "task": "Send report", "due": "Friday"},
    {"owner": "Sam", "task": "Book room", "due": "Monday"},
    {"owner": "Alex", "task": "Review PR", "due": "Wednesday"},
]

def group_by_owner(items):
    groups = {}
    # TODO: for each item, append it to groups[owner],
    #       creating the list with setdefault the first time
    return groups

groups = group_by_owner(items)
for owner in sorted(groups):
    tasks = groups[owner]
    print(f"{owner} ({len(tasks)}):")
    for t in tasks:
        print(f"  - {t['task']} (due {t['due']})")
`,
      solution_code: `# Turn a flat list of action items into a per-owner view.

items = [
    {"owner": "Alex", "task": "Send report", "due": "Friday"},
    {"owner": "Sam", "task": "Book room", "due": "Monday"},
    {"owner": "Alex", "task": "Review PR", "due": "Wednesday"},
]

def group_by_owner(items):
    groups = {}
    for it in items:
        groups.setdefault(it["owner"], []).append(it)
    return groups

groups = group_by_owner(items)
for owner in sorted(groups):
    tasks = groups[owner]
    print(f"{owner} ({len(tasks)}):")
    for t in tasks:
        print(f"  - {t['task']} (due {t['due']})")
`,
      expected_output: `Alex (2):
  - Send report (due Friday)
  - Review PR (due Wednesday)
Sam (1):
  - Book room (due Monday)`,
      hints: [
        "groups.setdefault(owner, []) returns the owner's list, creating it if new.",
        "Append the whole item so you keep its task and due.",
        "sorted(groups) iterates the owner keys alphabetically.",
      ],
      challenge_title: "Group Tasks by Owner",
      challenge_description: "Read owner/task pairs and print each owner's tasks, alphabetically, with a count.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    groups = {}
    for i in range(1, n + 1):
        owner, task = data[i].split("|")
        # TODO: append task to groups[owner]
    # TODO: print "owner (count): task1, task2" for each owner, alphabetical
    for owner in sorted(groups):
        pass

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    groups = {}
    for i in range(1, n + 1):
        owner, task = data[i].split("|")
        groups.setdefault(owner, []).append(task)
    for owner in sorted(groups):
        tasks = groups[owner]
        print(f"{owner} ({len(tasks)}): {', '.join(tasks)}")

main()
`,
      challenge_test_cases: [
        {
          input: "4\nAlex|Send report\nSam|Book room\nAlex|Review PR\nSam|Email client",
          expected_output: "Alex (2): Send report, Review PR\nSam (2): Book room, Email client",
          description: "Two owners, two tasks each, tasks kept in input order.",
        },
        {
          input: "2\nPriya|Task A\nAlex|Task B",
          expected_output: "Alex (1): Task B\nPriya (1): Task A",
          description: "Owners printed alphabetically, not in input order.",
        },
      ],
    },

    {
      id: "prod-07-6",
      project_id: "prod-07",
      order: 6,
      title: "Survive a Messy Transcript",
      concept: "validation, repair, edge cases",
      explanation: `Your extractor works on a clean transcript. Now hand it a real one: someone pastes a Slack thread, half the "action items" are actually just comments, one item has an empty task because the model got confused, and the meeting had no action items at all. A tool ships only when it handles this gracefully instead of crashing or emitting garbage. That's the "harden" step every project has.

## Three failures to expect

1. **Empty or junk items.** The model sometimes returns an item with a blank task, a leftover from an ambiguous sentence. An action item with no task is not an action item; drop it.
2. **Missing fields.** Owner or due comes back blank. You already know the fix: default them to "Unassigned" and "No deadline" so the report is still complete.
3. **No action items at all.** A pure status meeting yields an empty list. The tool should say "No action items found", not throw.

## One cleaning pass

Fold all three into a single function that takes the raw parsed items and returns only the trustworthy ones, repaired:

\`\`\`python
def clean(items):
    out = []
    for it in items:
        task = (it.get("task") or "").strip()
        if not task:
            continue                      # drop items with no real task
        owner = (it.get("owner") or "").strip() or "Unassigned"
        due = (it.get("due") or "").strip() or "No deadline"
        out.append({"owner": owner, "task": task, "due": due})
    return out
\`\`\`

The \`(it.get("task") or "")\` guard is doing double duty: \`.get\` handles a *missing* key by returning None, and \`or ""\` turns that None into a string so \`.strip()\` never crashes. This is the defensive style that keeps a tool alive on input you didn't anticipate.

## Validate at the boundary, trust inside

The rule of thumb: distrust data exactly once, at the edge where it enters your program, then trust it everywhere after. \`clean\` is that boundary. Every item that survives it is guaranteed to have a non-empty task and both other fields filled. Downstream code, grouping, sorting, rendering, never has to re-check, because it can rely on the contract \`clean\` enforced. This is why you don't sprinkle \`if item.get(...)\` checks all over the codebase: you validate once and hand clean data forward.

## Don't forget cost

Every one of these items came from a model call you paid for. When you retry a malformed reply or re-run on an edited transcript, those tokens add up. Cleaning in code, rather than asking the model to re-extract, is free, so prefer a Python repair over another round-trip whenever the fix is deterministic.

## The mental model to keep

Cleaning is the bouncer at the door: junk gets turned away and the incomplete get patched up, so everything past that point is in order. Below, write the one pass that drops taskless items and defaults the blanks.`,
      animated_diagrams: [
        {
          title: "The cleaning boundary",
          caption: "One pass at the edge either drops an item or repairs it, so everything after is trusted.",
          loop: true,
          nodes: [
            { label: "Raw item", sub: "maybe broken", detail: "Take the next parsed item; it might have a blank task, a missing owner, or nothing at all." },
            { label: "Task check", sub: "no task, drop", detail: "(it.get('task') or '').strip() gives ''; if empty, skip the item, it is not real work." },
            { label: "Repair blanks", sub: "fill owner/due", detail: "Default a blank owner to Unassigned and a blank due to No deadline." },
            { label: "Trusted item", sub: "3 fields, safe", detail: "Append the repaired record. Past this point, no code needs to re-check it." },
          ],
        },
      ],
      key_terms: [
        { term: "Validate at the boundary", definition: "Distrust data once, at the edge where it enters your program, then trust it everywhere after." },
        { term: "Defensive get", definition: "(it.get('task') or '') returns '' for a missing key or None, so .strip() never crashes on bad input." },
      ],
      callouts: [
        {
          type: "tip",
          position: "after",
          title: "Repair in code, not another API call",
          content: "Every item cost a model call you paid for. When a fix is deterministic, repair it in Python instead of re-extracting; that round-trip is free.",
        },
      ],
      participation_activities: [
        {
          activity_title: "Check yourself",
          questions: [
            { type: "true_false", question: "An action item with an empty task should be kept and shown with a blank.", correct_answer: "false", explanation: "An item with no task is not an action item. Drop it in the cleaning pass." },
            { type: "true_false", question: "(it.get('task') or '') prevents a crash when the 'task' key is missing entirely.", correct_answer: "true", explanation: ".get returns None for a missing key, and 'or \"\"' turns that None into a string so .strip() is safe." },
            { type: "fill_in", question: "A blank owner should default to which single word label?", correct_answer: "Unassigned", explanation: "Blank owners become 'Unassigned' so the report stays complete." },
          ],
        },
      ],
      starter_code: `# Harden the extractor: drop junk items, repair the fixable ones.

raw_items = [
    {"owner": "Alex", "task": "Send report", "due": "Friday"},
    {"owner": "", "task": "Fix login bug", "due": ""},
    {"owner": "Sam", "task": "", "due": "Monday"},
    {"owner": "Priya", "task": "Review PR", "due": "Wednesday"},
]

def clean(items):
    out = []
    for it in items:
        # TODO: skip the item if its task (stripped) is empty
        # TODO: default a blank owner to "Unassigned", blank due to "No deadline"
        # TODO: append the repaired {owner, task, due}
        pass
    return out

cleaned = clean(raw_items)
print("In:", len(raw_items), "Out:", len(cleaned))
for it in cleaned:
    print(f"{it['owner']} | {it['task']} | {it['due']}")
`,
      solution_code: `# Harden the extractor: drop junk items, repair the fixable ones.

raw_items = [
    {"owner": "Alex", "task": "Send report", "due": "Friday"},
    {"owner": "", "task": "Fix login bug", "due": ""},
    {"owner": "Sam", "task": "", "due": "Monday"},
    {"owner": "Priya", "task": "Review PR", "due": "Wednesday"},
]

def clean(items):
    out = []
    for it in items:
        task = (it.get("task") or "").strip()
        if not task:
            continue
        owner = (it.get("owner") or "").strip() or "Unassigned"
        due = (it.get("due") or "").strip() or "No deadline"
        out.append({"owner": owner, "task": task, "due": due})
    return out

cleaned = clean(raw_items)
print("In:", len(raw_items), "Out:", len(cleaned))
for it in cleaned:
    print(f"{it['owner']} | {it['task']} | {it['due']}")
`,
      expected_output: `In: 4 Out: 3
Alex | Send report | Friday
Unassigned | Fix login bug | No deadline
Priya | Review PR | Wednesday`,
      hints: [
        "(it.get(\"task\") or \"\").strip() gives \"\" for a missing or blank task.",
        "if not task: continue skips items with no real work.",
        "Use x or default for the owner and due repairs.",
      ],
      challenge_title: "Clean the Raw Items",
      challenge_description: "Drop action items with an empty task and default the missing owner and due fields.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    cleaned = []
    for i in range(1, n + 1):
        parts = data[i].split("|")
        # TODO: skip if task (parts[1] stripped) is empty
        # TODO: default blank owner -> "Unassigned", blank due -> "No deadline"
        # TODO: append "owner | task | due"
    print(len(cleaned))
    for line in cleaned:
        print(line)

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    cleaned = []
    for i in range(1, n + 1):
        parts = data[i].split("|")
        task = parts[1].strip()
        if not task:
            continue
        owner = parts[0].strip() or "Unassigned"
        due = parts[2].strip() or "No deadline"
        cleaned.append(f"{owner} | {task} | {due}")
    print(len(cleaned))
    for line in cleaned:
        print(line)

main()
`,
      challenge_test_cases: [
        {
          input: "4\nAlex|Send report|Friday\nSam||Monday\n|Fix login bug|\nPriya|Review PR|",
          expected_output: "3\nAlex | Send report | Friday\nUnassigned | Fix login bug | No deadline\nPriya | Review PR | No deadline",
          description: "The taskless item is dropped; blanks in the rest are defaulted.",
        },
        {
          input: "2\nJordan||Friday\n||",
          expected_output: "0",
          description: "Edge: every item lacks a task, so none survive.",
        },
      ],
    },

    {
      id: "prod-07-7",
      project_id: "prod-07",
      order: 7,
      title: "Long Transcripts and Duplicates",
      concept: "chunking, cost, dedup",
      explanation: `A five-minute standup fits in one call. An hour-long planning meeting is thousands of words, and a full day of transcripts can blow past what you want to send in a single request, both for the context limit and for the bill. This lesson handles scale: split the transcript, and clean up the duplicates that splitting creates.

## Chunk the transcript

You break a long transcript into smaller pieces and extract from each, then combine the results. The simplest, most predictable split is by a fixed number of lines:

\`\`\`python
def chunk(lines, size):
    return [lines[i:i + size] for i in range(0, len(lines), size)]
\`\`\`

A chunk of, say, 40 lines is small enough to send cheaply and get a focused extraction. You run the extractor on each chunk and concatenate the item lists. The tradeoff: an action item mentioned across a chunk boundary might get caught twice, once in each chunk, which is exactly the problem the next step solves.

## Estimate the cost before you spend it

Every chunk is a call, and every call is tokens you pay for. A rough gauge, about four characters per token, lets you predict a bill before running:

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)
\`\`\`

Summing that over your chunks tells you roughly what one pass costs. If a transcript is 8,000 characters, that's ~2,000 input tokens per full pass, useful for deciding whether to chunk finely (more calls, smaller each) or coarsely (fewer calls, larger each). You don't need exact counts; you need to not be surprised.

## Dedup the combined results

Chunking, retries, and people repeating themselves ("so Alex, you'll send the report, right?") all produce duplicate action items. Deduping keeps the first occurrence of each unique item and drops the rest, preserving order:

\`\`\`python
def dedup(items):
    seen = set()
    out = []
    for it in items:
        if it not in seen:
            seen.add(it)
            out.append(it)
    return out
\`\`\`

A \`set\` gives O(1) membership checks, so this stays fast even on a long day's worth of items. The \`seen\` set remembers what you've already emitted; the \`out\` list keeps them in first-seen order. This same pattern deduplicates almost anything: keep a set of what you've seen, skip repeats.

## The mental model to keep

A long meeting is more like a book than a single page. You read it a chapter at a time, jot the commitments from each, then merge your notes and cross out the ones you wrote twice. Chunk to fit the context and the budget; dedup to clean up the seams. Below, chunk a transcript, estimate each chunk's tokens, and dedup repeated lines.`,
      animated_diagrams: [
        {
          title: "Chunk, extract, merge, dedup",
          caption: "A long transcript is read a piece at a time, then the seams are cleaned up.",
          loop: true,
          nodes: [
            { label: "Split", sub: "fixed-size chunks", detail: "Break the transcript into slices of, say, 40 lines each so every call is small and cheap." },
            { label: "Estimate", sub: "~4 chars/token", detail: "Roughly size each chunk so you can predict the bill before spending it." },
            { label: "Extract chunk", sub: "one call each", detail: "Run the extractor on the current chunk and collect its items." },
            { label: "Merge", sub: "combine lists", detail: "Concatenate every chunk's items into one big list." },
            { label: "Dedup", sub: "keep first seen", detail: "A chunk boundary can catch the same item twice; a set drops the repeats, keeping order." },
          ],
        },
      ],
      key_terms: [
        { term: "Chunking", definition: "Splitting a long input into smaller pieces so each fits the context window and costs less per call." },
        { term: "Token estimate", definition: "A rough size, about four characters per token, used to predict a call's cost before running it." },
        { term: "Dedup", definition: "Removing repeated items while keeping the first occurrence, using a set to remember what you have seen." },
      ],
      inline_quizzes: [
        {
          question: "Why does chunking create duplicate action items?",
          options: [
            "The model is broken",
            "An item mentioned near a chunk boundary can be caught in both neighboring chunks",
            "Sets always duplicate data",
            "Chunks are always identical",
          ],
          correct_index: 1,
          explanation: "Splitting can put the same commitment at the edge of two chunks, so it gets extracted twice. That is exactly what dedup cleans up.",
        },
        {
          question: "What makes the set-based dedup fast even on a long day of items?",
          options: [
            "Sets sort the items",
            "A set gives O(1) membership checks, so 'seen' lookups stay cheap",
            "It skips the loop",
            "Lists are faster than sets",
          ],
          correct_index: 1,
          explanation: "Membership in a set is roughly constant time, so checking 'have I seen this' stays fast as the list grows.",
        },
      ],
      worked_examples: [
        {
          difficulty: "easy",
          prompt: "Dedup: ['Alex report', 'Sam room', 'Alex report', 'Priya PR']",
          steps: [
            "'Alex report' not in seen: add it, keep it.",
            "'Sam room' not in seen: add it, keep it.",
            "'Alex report' already in seen: skip it.",
            "'Priya PR' not in seen: add it, keep it.",
          ],
          output: "3 unique lines, in first-seen order: Alex report, Sam room, Priya PR.",
        },
      ],
      starter_code: `# Scale up: chunk a long transcript, gauge cost, and remove duplicates.

transcript_lines = [
    "Alex will send the report",
    "Sam books the room",
    "Alex will send the report",
    "Priya reviews the PR",
    "Jordan updates the docs",
]

def chunk(lines, size):
    # TODO: return a list of slices of length 'size' (last may be shorter)
    pass

def estimate_tokens(text):
    return max(1, len(text) // 4)

def dedup(items):
    seen = set()
    out = []
    # TODO: keep the first occurrence of each item, in order
    return out

chunks = chunk(transcript_lines, 2)
print("Chunks:", len(chunks))
for c in chunks:
    joined = "\\n".join(c)
    print(f"  size {len(c)}, ~{estimate_tokens(joined)} tokens")

unique = dedup(transcript_lines)
print("Unique lines:", len(unique))
`,
      solution_code: `# Scale up: chunk a long transcript, gauge cost, and remove duplicates.

transcript_lines = [
    "Alex will send the report",
    "Sam books the room",
    "Alex will send the report",
    "Priya reviews the PR",
    "Jordan updates the docs",
]

def chunk(lines, size):
    return [lines[i:i + size] for i in range(0, len(lines), size)]

def estimate_tokens(text):
    return max(1, len(text) // 4)

def dedup(items):
    seen = set()
    out = []
    for it in items:
        if it not in seen:
            seen.add(it)
            out.append(it)
    return out

chunks = chunk(transcript_lines, 2)
print("Chunks:", len(chunks))
for c in chunks:
    joined = "\\n".join(c)
    print(f"  size {len(c)}, ~{estimate_tokens(joined)} tokens")

unique = dedup(transcript_lines)
print("Unique lines:", len(unique))
`,
      expected_output: `Chunks: 3
  size 2, ~11 tokens
  size 2, ~11 tokens
  size 1, ~5 tokens
Unique lines: 4`,
      hints: [
        "range(0, len(lines), size) steps by 'size'; slice lines[i:i+size] for each chunk.",
        "For dedup, keep a set of items you've already added and skip repeats.",
        "Append to the output list only when the item is new so order is preserved.",
      ],
      challenge_title: "Deduplicate the Action Items",
      challenge_description: "Remove duplicate action items produced by chunking, keeping the first occurrence.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    seen = set()
    unique = []
    for i in range(1, n + 1):
        line = data[i]
        # TODO: add line to 'unique' only the first time you see it
    print(len(unique))
    for line in unique:
        print(line)

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    seen = set()
    unique = []
    for i in range(1, n + 1):
        line = data[i]
        if line not in seen:
            seen.add(line)
            unique.append(line)
    print(len(unique))
    for line in unique:
        print(line)

main()
`,
      challenge_test_cases: [
        {
          input: "5\nAlex|Send report\nSam|Book room\nAlex|Send report\nPriya|Review PR\nSam|Book room",
          expected_output: "3\nAlex|Send report\nSam|Book room\nPriya|Review PR",
          description: "Two duplicates removed; first occurrences kept in order.",
        },
        {
          input: "3\nA|x\nA|x\nA|x",
          expected_output: "1\nA|x",
          description: "Edge: all three lines identical collapse to one.",
        },
      ],
    },

    {
      id: "prod-07-8",
      project_id: "prod-07",
      order: 8,
      title: "Ship the Report",
      concept: "assemble and ship",
      explanation: `Every piece is built: a filter, an extraction prompt, JSON parsing, defaults, validation, grouping, chunking, dedup. Shipping means wiring them into one pipeline that takes a transcript in and prints a clean report out, then handing it to a person who can use it.

## The full pipeline, end to end

Here's the whole product as one function. Each step is something you built across the last seven lessons:

\`\`\`python
def transcript_to_report(transcript):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        system=EXTRACTION_SYSTEM,
        messages=[{"role": "user", "content": transcript}],
    )
    items = extract_json(resp.content[0].text)   # defensive JSON parse
    items = clean(items)                          # drop junk, default blanks
    items = dedup_records(items)                  # remove repeats
    return render_report(items)                   # grouped, sorted output
\`\`\`

The model appears once, at the top, doing the one thing only it can. Everything after is the deterministic Python you already wrote. That layering, one fuzzy step, then reliable transforms, is what a shippable AI product looks like.

## The report a human actually reads

Nobody wants a list of dicts handed to them; they want a document they can read. Group by owner, sort, and format as Markdown so it drops straight into a doc, an email, or a ticket:

\`\`\`python
def render_report(items):
    groups = {}
    for it in items:
        groups.setdefault(it["owner"], []).append(it)
    lines = ["# Action Items", ""]
    for owner in sorted(groups):
        lines.append(f"## {owner}")
        for it in groups[owner]:
            lines.append(f"- {it['task']} (due: {it['due']})")
        lines.append("")
    return "\\n".join(lines).strip()
\`\`\`

Now each person sees their section, their tasks, their deadlines. That's the thing that was worth building.

## What "shipped" means here

Three checks, the same three every project ends on: it runs from a clean start on one transcript; it handles an empty transcript or a meeting with no action items without crashing (an empty report, not an exception); and someone else could paste in their own transcript and get a useful result from your instructions alone. Hit those and it's real.

## It lands in your Portfolio

Finishing this lesson saves **Meeting Notes to Action Items** to your Portfolio automatically, with the title and what you built: a tool that turns a raw transcript into owned, dated, grouped action items. Keep an example transcript and its rendered report alongside it, proof it works, and a demo you can show. You built an extraction pipeline end to end: prompt design, structured output, validation, and the plain-code transforms that make a model's output trustworthy. That pattern is most of applied AI. Below, write the final renderer that turns your cleaned items into the report you ship.`,
      animated_diagrams: [
        {
          title: "The whole product, one line",
          caption: "One fuzzy model step at the top, then reliable Python transforms to the finished report.",
          loop: false,
          nodes: [
            { label: "Transcript", sub: "raw text in", detail: "The meeting text arrives, the same input you started with in lesson 1." },
            { label: "Model", sub: "extract items", detail: "One API call does the fuzzy part: reading language and pulling out commitments." },
            { label: "extract_json", sub: "defensive parse", detail: "Pull the JSON array out of the chatty reply and load it into records." },
            { label: "clean", sub: "drop + default", detail: "Remove junk items and fill blanks so every record is complete." },
            { label: "dedup", sub: "remove repeats", detail: "Collapse duplicates from chunking or people repeating themselves." },
            { label: "render_report", sub: "grouped Markdown", detail: "Group by owner, sort, and format the report a human actually reads." },
          ],
        },
      ],
      key_terms: [
        { term: "Pipeline", definition: "A fixed sequence of steps where each one's output feeds the next, from transcript to finished report." },
        { term: "Render", definition: "Turning structured records into human-readable output, here grouped Markdown you can paste into a doc or ticket." },
      ],
      inline_quizzes: [
        {
          question: "In the finished pipeline, how many times does the model appear?",
          options: [
            "Once, at the top, doing the fuzzy extraction",
            "Once per output line",
            "At every step",
            "Never; it is all Python",
          ],
          correct_index: 0,
          explanation: "The model runs once to do the one thing only it can. Everything after (parse, clean, dedup, render) is deterministic Python.",
        },
      ],
      participation_activities: [
        {
          activity_title: "Is it shipped?",
          questions: [
            { type: "true_false", question: "A shippable version runs from a clean start on one transcript.", correct_answer: "true", explanation: "Running end to end from scratch is one of the three ship checks." },
            { type: "true_false", question: "An empty transcript should raise an exception rather than print an empty report.", correct_answer: "false", explanation: "It should handle a meeting with no action items gracefully: an empty report, not a crash." },
            { type: "fill_in", question: "The renderer groups items by which field before printing?", correct_answer: "owner", explanation: "render_report groups by owner so each person sees their own section." },
          ],
        },
      ],
      starter_code: `# The ship step: render cleaned items into the Markdown report you deliver.

items = [
    {"owner": "Alex", "task": "Send the Q3 report", "due": "Friday"},
    {"owner": "Sam", "task": "Book the room", "due": "Monday"},
    {"owner": "Alex", "task": "Review the PR", "due": "Wednesday"},
]

def render_report(items):
    groups = {}
    for it in items:
        groups.setdefault(it["owner"], []).append(it)
    lines = ["# Action Items", ""]
    # TODO: for each owner alphabetically, add a "## owner" heading
    #       then a "- task (due: due)" bullet per item, then a blank line
    return "\\n".join(lines).strip()

print(render_report(items))
`,
      solution_code: `# The ship step: render cleaned items into the Markdown report you deliver.

items = [
    {"owner": "Alex", "task": "Send the Q3 report", "due": "Friday"},
    {"owner": "Sam", "task": "Book the room", "due": "Monday"},
    {"owner": "Alex", "task": "Review the PR", "due": "Wednesday"},
]

def render_report(items):
    groups = {}
    for it in items:
        groups.setdefault(it["owner"], []).append(it)
    lines = ["# Action Items", ""]
    for owner in sorted(groups):
        lines.append(f"## {owner}")
        for it in groups[owner]:
            lines.append(f"- {it['task']} (due: {it['due']})")
        lines.append("")
    return "\\n".join(lines).strip()

print(render_report(items))
`,
      expected_output: `# Action Items

## Alex
- Send the Q3 report (due: Friday)
- Review the PR (due: Wednesday)

## Sam
- Book the room (due: Monday)`,
      hints: [
        "Group with setdefault, then loop sorted(groups) for stable, alphabetical output.",
        "Each owner gets a \"## owner\" heading; each item a \"- task (due: due)\" line.",
        "Join with newlines and .strip() to drop the trailing blank line.",
      ],
      challenge_title: "Render the Final Report",
      challenge_description: "Read action items and print a report grouped by owner, alphabetical, with due dates.",
      challenge_language: "python",
      challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    groups = {}
    for i in range(1, n + 1):
        owner, task, due = data[i].split("|")
        # TODO: append (task, due) to groups[owner]
    out = []
    for owner in sorted(groups):
        out.append(owner)
        # TODO: add "  - task (due)" for each of the owner's items
    print("\\n".join(out))

main()
`,
      challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    groups = {}
    for i in range(1, n + 1):
        owner, task, due = data[i].split("|")
        groups.setdefault(owner, []).append((task, due))
    out = []
    for owner in sorted(groups):
        out.append(owner)
        for task, due in groups[owner]:
            out.append(f"  - {task} ({due})")
    print("\\n".join(out))

main()
`,
      challenge_test_cases: [
        {
          input: "3\nAlex|Send report|Friday\nSam|Book room|Monday\nAlex|Review PR|Wednesday",
          expected_output: "Alex\n  - Send report (Friday)\n  - Review PR (Wednesday)\nSam\n  - Book room (Monday)",
          description: "Owners alphabetical; each owner's tasks in input order with due dates.",
        },
        {
          input: "1\nPriya|Ship v2|Q3",
          expected_output: "Priya\n  - Ship v2 (Q3)",
          description: "A single owner with one task.",
        },
      ],
    },
  ],
};
