const project = {
  id: "prod-13",
  title: "Receipt Scanner",
  description:
    "Turn a photo of a receipt into structured expense JSON: merchant, date, line items, and totals. You'll teach the model to read an image, pin its answer to a strict schema, and check the arithmetic before you trust a single number it hands back.",
  difficulty: "intermediate",
  category: "vision_multimodal",
  estimated_time: 130,
  lessons_count: 8,
  tags: ["vision", "ocr", "json-extraction", "validation", "expenses", "multimodal"],
  order: 113,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-13-1",
    project_id: "prod-13",
    order: 1,
    title: "Handing the Model a Photo",
    concept: "image content blocks",
    explanation: `A vision model doesn't take a separate "image" parameter. It takes the same \`messages\` list you'd use for plain text. The only difference is that one block in that list is a picture instead of words. Once that clicks, the whole receipt scanner stops looking exotic: it's the chat API you already know, with a photo tucked into the same envelope as the text.

## What an image content block is

A plain text message has \`content\` as a string. A multimodal message has \`content\` as a **list of blocks**, and each block carries its own \`type\`. You can put an image block and a text block in the same user turn:

\`\`\`python
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_b64,
                },
            },
            {"type": "text", "text": "What store is this receipt from?"},
        ],
    }
]
\`\`\`

The \`source\` dict is where the real work happens. \`type\` says how the bytes are encoded (\`base64\` for a raw upload). \`media_type\` is the file's actual MIME type, like \`image/jpeg\` or \`image/png\`. \`data\` is the base64 string itself.

## Getting a photo into base64

JSON can't carry raw bytes, so an image rides across the wire as base64 text. Reading a file and encoding it is three lines:

\`\`\`python
import base64

with open("receipt.jpg", "rb") as f:
    image_b64 = base64.standard_b64encode(f.read()).decode("utf-8")
\`\`\`

Then you call the API the same way you'd make any chat call, passing this richer \`content\` list:

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=messages,
)
print(response.content[0].text)
\`\`\`

## Why the media_type has to be honest

If the file is actually a PNG but you label it \`image/jpeg\`, decoding can fail or the model can misread the picture. Nothing on your side sniffs the real format. You are declaring what the bytes are, so pull the type from the actual file extension rather than a hopeful guess. One more thing to file away: base64 inflates the payload by about a third. A 3 MB photo becomes roughly 4 MB of text on the wire. That matters later, once this scanner is chewing through a whole batch of receipts.

## What to hold onto

There is no special "vision endpoint" here. It's the message-list shape you already know, with one block that happens to be a photo instead of a sentence. The send-and-parse loop around it works exactly as it did for text.`,
    animated_diagrams: [
      {
        title: "How a photo reaches the model",
        caption: "A picture rides inside the same messages list you already use for text.",
        loop: false,
        nodes: [
          { label: "Photo file", sub: "receipt.jpg", detail: "You start with raw image bytes on disk, which JSON cannot carry directly." },
          { label: "Base64", sub: "bytes to text", detail: "Encoding turns those bytes into a long plain-text string that fits in a JSON field." },
          { label: "Image block", sub: "type + source", detail: "The base64 string goes into a content block tagged type image, with its media_type." },
          { label: "Messages", sub: "user turn", detail: "The image block and a text block sit together in one user message's content list." },
          { label: "Model", sub: "reads + replies", detail: "The API receives the same shape as a text chat, and the model reads the picture." },
        ],
      },
    ],
    key_terms: [
      { term: "Content block", definition: "One typed item inside a message's content list, such as an image block or a text block." },
      { term: "Base64", definition: "A way to write raw bytes as plain text so they can travel inside a JSON string." },
      { term: "media_type", definition: "The MIME label you attach to image bytes, like image/jpeg, so the API decodes them correctly." },
    ],
    inline_quizzes: [
      {
        question: "In a multimodal message, what type is the content field?",
        options: ["A single string", "A list of typed blocks", "A base64 string", "A file path"],
        correct_index: 1,
        explanation: "Text-only messages use a plain string, but a message with an image uses a list of blocks, each carrying its own type.",
      },
      {
        question: "Why must media_type match the real image format?",
        options: ["It changes the price", "Nothing sniffs the real bytes, so a wrong label can break decoding", "It picks the model", "It sets the resolution"],
        correct_index: 1,
        explanation: "You are declaring what the bytes are. Label a PNG as image/jpeg and decoding can fail or the model can misread the picture.",
      },
    ],
    starter_code: `def build_image_message(image_b64, media_type, question):
    # TODO: return a messages list with one user turn whose "content" is
    # a list containing an image block first, then a text block with
    # \`question\`.
    # Image block shape:
    #   {"type": "image", "source": {"type": "base64",
    #                                 "media_type": media_type,
    #                                 "data": image_b64}}
    # Text block shape:
    #   {"type": "text", "text": question}
    pass

fake_b64 = "iVBORw0KGgoAAAANS"  # stand-in, a real one is much longer
messages = build_image_message(fake_b64, "image/jpeg", "What store is this receipt from?")
print(messages[0]["role"])
print(len(messages[0]["content"]))
print(messages[0]["content"][0]["type"])
print(messages[0]["content"][1]["text"])
`,
    solution_code: `def build_image_message(image_b64, media_type, question):
    return [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": image_b64,
                    },
                },
                {"type": "text", "text": question},
            ],
        }
    ]

fake_b64 = "iVBORw0KGgoAAAANS"  # stand-in, a real one is much longer
messages = build_image_message(fake_b64, "image/jpeg", "What store is this receipt from?")
print(messages[0]["role"])
print(len(messages[0]["content"]))
print(messages[0]["content"][0]["type"])
print(messages[0]["content"][1]["text"])
`,
    hints: [
      "content is a list of blocks; each block is its own dict with a type key.",
      "The image block needs a nested source dict with type, media_type, and data.",
      "role stays 'user' at the top level, just like a text-only message.",
    ],
    challenge_title: "Sort the Receipt Inbox",
    challenge_description:
      "Given a batch of uploaded file mime types, split them into valid image types the vision API accepts and everything else.",
    challenge_language: "python",
    challenge_starter_code: `import sys

ALLOWED = {"image/jpeg", "image/png", "image/gif", "image/webp"}

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    types = [data[i + 1].strip() for i in range(n)]
    # TODO: split \`types\` into ones in ALLOWED and ones that aren't,
    # keeping the invalid ones in their original order.
    # TODO: print "VALID: <count>", then "INVALID: <count>",
    #       then each invalid mime type on its own line.

main()
`,
    challenge_solution_code: `import sys

ALLOWED = {"image/jpeg", "image/png", "image/gif", "image/webp"}

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    types = [data[i + 1].strip() for i in range(n)]

    invalid = [t for t in types if t not in ALLOWED]
    valid_count = n - len(invalid)

    print(f"VALID: {valid_count}")
    print(f"INVALID: {len(invalid)}")
    for t in invalid:
        print(t)

main()
`,
    challenge_test_cases: [
      {
        input: `4\nimage/jpeg\nimage/bmp\nimage/png\napplication/pdf`,
        expected_output: `VALID: 2\nINVALID: 2\nimage/bmp\napplication/pdf`,
        description: "Mixed batch: two valid image types, two rejects.",
      },
      {
        input: `2\nimage/png\nimage/webp`,
        expected_output: `VALID: 2\nINVALID: 0`,
        description: "All valid: no invalid lines printed.",
      },
      {
        input: `1\nimage/tiff`,
        expected_output: `VALID: 0\nINVALID: 1\nimage/tiff`,
        description: "Edge: a single unsupported type.",
      },
    ],
  },

  {
    id: "prod-13-2",
    project_id: "prod-13",
    order: 2,
    title: "Ask for JSON, Not a Paragraph",
    concept: "structured JSON extraction",
    explanation: `The model will happily describe a receipt in a chatty paragraph. That does you no good. You want a Python dict with \`merchant\`, \`date\`, and \`total\` that goes straight into a database. Getting there takes two things: a prompt that asks for JSON and nothing else, and parsing code that still works when the model ignores you and wraps its JSON in chatter anyway.

## Asking for the exact shape

Spell out the keys and the format you want, right in the system prompt:

\`\`\`python
SYSTEM = """Look at the receipt image and return ONLY a JSON object,
no other text, with exactly these keys:
- merchant: string, the store name
- date: string, in YYYY-MM-DD format
- total: number, the final amount paid

If a field is unreadable, use null for it."""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=300,
    system=SYSTEM,
    messages=messages,
)
raw_reply = response.content[0].text
\`\`\`

Naming the keys and formats up front is the biggest lever you have. "Return the date" gets you five different date formats across five receipts. "Return the date as YYYY-MM-DD" gets you one.

## The model still adds chatter

Even with a strict prompt, replies come back looking like \`"Sure, here's the data: {...} Let me know if you need more."\`, or with the JSON buried in a markdown code fence. A good prompt shrinks how often this happens. It won't stop it entirely. So your parser has to go looking for the JSON object inside the text instead of assuming the whole reply *is* JSON.

## Pulling the JSON out of the noise

The trick is short: find the first \`{\` and the last \`}\` in the reply, slice out everything between them, and hand that slice to \`json.loads\`. Anything before the first brace or after the last one gets dropped.

\`\`\`python
import json

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])
\`\`\`

\`text.index("{")\` finds the *first* opening brace and \`text.rindex("}")\` finds the *last* closing brace. That last-brace detail matters once you add line items next lesson, because the receipt's JSON will contain nested braces of its own. If a brace is missing, or the slice still isn't valid JSON, this raises an exception. Treat that exception as your cue to retry or flag the receipt for review. You'll wire up that handling properly a few lessons from now.

## Checking the fields actually showed up

Getting valid JSON is not the same as getting the JSON you asked for. A well-formed object can still be missing \`total\` because the model couldn't read it off a smudged receipt. After parsing, confirm every required key is present before you trust the data:

\`\`\`python
required = ["merchant", "date", "total"]
missing = [k for k in required if k not in data]
\`\`\`

## What to hold onto

Treat the model's reply as an envelope, not the package itself. There might be a sticky note stuck to it or a rubber band around it. Your job is to find the package inside (the JSON object), open it, and check nothing is missing before you use what's in there.`,
    animated_diagrams: [
      {
        title: "Pulling JSON out of a chatty reply",
        caption: "Slice from the first brace to the last, then parse only that piece.",
        loop: false,
        nodes: [
          { label: "Model reply", sub: "prose + JSON", detail: "The text often wraps the JSON in a greeting or a code fence you did not ask for." },
          { label: "Find first {", sub: "index", detail: "text.index('{') marks where the JSON object starts, dropping any lead-in text." },
          { label: "Find last }", sub: "rindex", detail: "text.rindex('}') marks where it ends, ignoring any trailing chatter." },
          { label: "json.loads", sub: "slice to dict", detail: "Parsing just that slice turns the JSON text into a real Python dict." },
          { label: "Check keys", sub: "required present", detail: "Confirm every required key showed up before trusting the data." },
        ],
      },
    ],
    key_terms: [
      { term: "Schema", definition: "The exact set of keys and value formats you tell the model to return." },
      { term: "json.loads", definition: "The function that parses a JSON string into a Python dict or list." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Extract the JSON object from: Here you go: {\"merchant\": \"Cafe Luna\", \"total\": 12.5} thanks!",
        steps: [
          "text.index('{') finds the first brace at the start of the object.",
          "text.rindex('}') finds the last brace, so the trailing 'thanks!' is dropped.",
          "Slice text[start:end] to get just the {\"merchant\": ..., \"total\": ...} part.",
          "json.loads on that slice returns a dict.",
        ],
        output: "{'merchant': 'Cafe Luna', 'total': 12.5}",
      },
    ],
    inline_quizzes: [
      {
        question: "Why use rindex to find the LAST closing brace instead of the first?",
        options: ["It is faster", "Nested JSON has inner braces, so the object ends at the last one", "index does not exist", "To skip whitespace"],
        correct_index: 1,
        explanation: "Once line items add nested objects, the receipt's JSON contains its own braces. The last closing brace is where the whole object really ends.",
      },
    ],
    starter_code: `import json

RAW_REPLY = 'Sure thing! Here is what I found on the receipt: {"merchant": "Cafe Luna", "date": "2026-07-01", "total": 12.5} Let me know if you need anything else.'

REQUIRED = ["merchant", "date", "total"]

def extract_json(text):
    # TODO: find the first "{" and the last "}" in text, slice that
    # substring out, and json.loads it. Return the parsed dict.
    pass

def check_required(data, required):
    # TODO: return a list of keys from \`required\` missing from \`data\`.
    pass

data = extract_json(RAW_REPLY)
missing = check_required(data, REQUIRED)
print(data["merchant"])
print(missing)
`,
    solution_code: `import json

RAW_REPLY = 'Sure thing! Here is what I found on the receipt: {"merchant": "Cafe Luna", "date": "2026-07-01", "total": 12.5} Let me know if you need anything else.'

REQUIRED = ["merchant", "date", "total"]

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])

def check_required(data, required):
    return [k for k in required if k not in data]

data = extract_json(RAW_REPLY)
missing = check_required(data, REQUIRED)
print(data["merchant"])
print(missing)
`,
    hints: [
      "text.index('{') finds the first opening brace; text.rindex('}') finds the last closing brace.",
      "Slice text[start:end] before calling json.loads on it, don't parse the whole string.",
      "A key is missing if it's not in data.keys(); build the list with a comprehension.",
    ],
    challenge_title: "Pull the JSON Out of the Noise",
    challenge_description:
      "Extract an embedded JSON receipt object from a noisy model reply, then verify the required fields all showed up.",
    challenge_language: "python",
    challenge_starter_code: `import sys, json

REQUIRED = ["merchant", "date", "total"]

def main():
    text = sys.stdin.read()
    # TODO: try to locate the first "{" and last "}" in text and parse
    # the JSON between them. If either brace is missing, or json.loads
    # fails, print "PARSE_ERROR" and stop.
    # TODO: if parsing succeeds, check REQUIRED keys are all present.
    #       If any are missing, print "MISSING:" followed by the missing
    #       keys joined with commas, in REQUIRED order.
    # TODO: otherwise print one "key=value" line per REQUIRED key, in
    #       REQUIRED order.

main()
`,
    challenge_solution_code: `import sys, json

REQUIRED = ["merchant", "date", "total"]

def main():
    text = sys.stdin.read()
    try:
        start = text.index("{")
        end = text.rindex("}") + 1
        data = json.loads(text[start:end])
    except (ValueError, json.JSONDecodeError):
        print("PARSE_ERROR")
        return

    missing = [k for k in REQUIRED if k not in data]
    if missing:
        print("MISSING:" + ",".join(missing))
        return

    for k in REQUIRED:
        print(f"{k}={data[k]}")

main()
`,
    challenge_test_cases: [
      {
        input: `Sure! Here's the result: {"merchant": "Cafe Luna", "date": "2026-07-01", "total": 12.5} Hope that's helpful!`,
        expected_output: `merchant=Cafe Luna\ndate=2026-07-01\ntotal=12.5`,
        description: "JSON embedded in chatty prose parses and all fields are present.",
      },
      {
        input: `{"merchant": "Joe's Diner", "date": "2026-05-02"}`,
        expected_output: `MISSING:total`,
        description: "total is missing from an otherwise valid object.",
      },
      {
        input: `{"merchant": "Bad Shop", "date": `,
        expected_output: `PARSE_ERROR`,
        description: "Edge: no closing brace at all, extraction fails cleanly.",
      },
    ],
  },

  {
    id: "prod-13-3",
    project_id: "prod-13",
    order: 3,
    title: "Line Items Are a List of Objects",
    concept: "nested schema validation",
    explanation: `\`merchant\`, \`date\`, and \`total\` are the easy part. The useful part of a receipt is the list of things someone actually bought. That list has a different shape than the flat fields you validated last lesson. It's a variable-length array of objects, and every object can go wrong in its own way.

## Asking for a list of objects

Extend the prompt's schema with an \`items\` array, and show the model exactly what one item looks like:

\`\`\`python
SYSTEM = """Return ONLY JSON with these keys:
- merchant: string
- date: string, YYYY-MM-DD
- items: a list of objects, each with:
    - name: string
    - quantity: integer
    - price: number, the per-item price
- total: number

Example item: {"name": "Latte", "quantity": 2, "price": 4.5}"""
\`\`\`

One concrete example item in the prompt does more work than a paragraph describing the shape. Models copy a pattern far more reliably than they follow an abstract spec.

## Why line items break more than flat fields

A blurry photo or a cramped receipt can push the model into merging two items into one, or inventing a quantity it couldn't actually read, or handing back a price as the string \`"$4.50"\` when you wanted the number \`4.5\`. A flat field either shows up or goes missing. A list field is messier: it can carry some good entries and some broken ones in the same array. That means validating each item on its own, not just checking that \`items\` exists.

## What "valid" means for one item

Three checks, run against every entry in the list:

- \`name\` is a non-empty string.
- \`quantity\` is a positive integer.
- \`price\` is a number (int or float) that's zero or more.

\`\`\`python
def is_valid_item(item):
    name = item.get("name")
    quantity = item.get("quantity")
    price = item.get("price")
    return (
        isinstance(name, str) and name.strip() != ""
        and isinstance(quantity, int) and not isinstance(quantity, bool)
        and quantity > 0
        and isinstance(price, (int, float)) and not isinstance(price, bool)
        and price >= 0
    )
\`\`\`

The \`not isinstance(x, bool)\` checks look fussy, but they earn their place. In Python, \`bool\` is a subclass of \`int\`, so \`True\` and \`False\` quietly pass an \`isinstance(x, int)\` check. Leave \`bool\` out of the exclusion and a stray \`True\` from a malformed reply slides through as a "valid quantity of 1."

## What to do with a mixed bag

Once you know which items are valid and which aren't, you get to choose. Drop the bad ones and keep going with what parsed, or reject the whole receipt until someone re-scans it. This project takes the first path: keep the valid items and record the indexes that failed. You end up with a usable partial result and a short list of what a human should double check.

## What to hold onto

A flat field is there or it isn't. A list of objects is a stack of independent verdicts, some passing and some failing. Your validator sorts them into two piles. It doesn't hand down one ruling for the entire receipt.`,
    animated_diagrams: [
      {
        title: "Sorting line items into two piles",
        caption: "Each item gets its own verdict, not one ruling for the whole list.",
        loop: true,
        nodes: [
          { label: "Items list", sub: "from JSON", detail: "The parsed receipt hands you a variable-length list of item objects." },
          { label: "Take one item", sub: "loop", detail: "Walk the list one entry at a time, checking each on its own." },
          { label: "Run 3 checks", sub: "name/qty/price", detail: "Name is a non-empty string, quantity a positive int, price a number zero or more." },
          { label: "Valid pile", sub: "keep", detail: "Entries that pass all three checks go into the list you keep." },
          { label: "Invalid indexes", sub: "flag", detail: "Entries that fail have their index recorded for a human to review." },
        ],
      },
    ],
    key_terms: [
      { term: "Nested schema", definition: "A schema where a field is itself a list of objects, each with its own required fields." },
      { term: "isinstance", definition: "A Python check that asks whether a value is of a given type, like str or int." },
    ],
    worked_examples: [
      {
        difficulty: "medium",
        prompt: "Is {\"name\": \"Latte\", \"quantity\": True, \"price\": 4.5} a valid item?",
        steps: [
          "name is 'Latte', a non-empty string, so that check passes.",
          "quantity is True, and isinstance(True, int) is True because bool subclasses int in Python.",
          "But the extra not isinstance(quantity, bool) check catches it and fails.",
          "The item is invalid, so its index gets recorded.",
        ],
        output: "invalid (quantity was a bool, not a real integer)",
      },
    ],
    inline_quizzes: [
      {
        question: "Why add 'not isinstance(x, bool)' when checking quantity?",
        options: ["Bools are slow", "In Python bool subclasses int, so True passes an int check", "To reject zero", "It is required syntax"],
        correct_index: 1,
        explanation: "True and False quietly pass isinstance(x, int). Without the extra check, a stray True slides through as a quantity of 1.",
      },
    ],
    starter_code: `def validate_items(items):
    valid = []
    invalid = []
    for i, item in enumerate(items):
        # TODO: an item is valid only if:
        #   - "name" is a non-empty string
        #   - "quantity" is an int (not a bool) and > 0
        #   - "price" is an int or float (not a bool) and >= 0
        # Append valid items to \`valid\`, and the 0-based index of any
        # invalid item to \`invalid\`.
        pass
    return valid, invalid

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "", "quantity": 1, "price": 3.0},
    {"name": "Muffin", "quantity": -1, "price": 2.5},
    {"name": "Bagel", "quantity": 1, "price": "2.00"},
]

valid, invalid = validate_items(items)
print("valid:", len(valid))
print("invalid indexes:", invalid)
`,
    solution_code: `def validate_items(items):
    valid = []
    invalid = []
    for i, item in enumerate(items):
        name = item.get("name")
        quantity = item.get("quantity")
        price = item.get("price")

        ok = (
            isinstance(name, str) and name.strip() != ""
            and isinstance(quantity, int) and not isinstance(quantity, bool)
            and quantity > 0
            and isinstance(price, (int, float)) and not isinstance(price, bool)
            and price >= 0
        )

        if ok:
            valid.append(item)
        else:
            invalid.append(i)
    return valid, invalid

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "", "quantity": 1, "price": 3.0},
    {"name": "Muffin", "quantity": -1, "price": 2.5},
    {"name": "Bagel", "quantity": 1, "price": "2.00"},
]

valid, invalid = validate_items(items)
print("valid:", len(valid))
print("invalid indexes:", invalid)
`,
    hints: [
      "Use item.get(key) instead of item[key] so a missing key returns None instead of crashing.",
      "bool is a subclass of int in Python, so exclude it explicitly or True can pass as quantity 1.",
      "invalid should collect the index i, not the item itself.",
    ],
    challenge_title: "Line Item Bouncer",
    challenge_description:
      "Check a batch of raw 'name|quantity|price' lines against the receipt schema rules and report which lines fail.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]
    # TODO: for each line "name|quantity|price", check:
    #   - name (after strip) is non-empty
    #   - quantity parses as an int and is > 0
    #   - price parses as a float and is >= 0
    # A line that fails int()/float() parsing is invalid, not a crash.
    # TODO: print "VALID: <count>" then "INVALID: <count>", then the
    # 1-indexed line numbers of invalid entries, one per line, in order.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]

    invalid_lines = []
    valid_count = 0
    for i, line in enumerate(lines, start=1):
        parts = line.split("|")
        ok = False
        if len(parts) == 3:
            name, qty_s, price_s = parts
            if name.strip() != "":
                try:
                    qty = int(qty_s)
                    price = float(price_s)
                    ok = qty > 0 and price >= 0
                except ValueError:
                    ok = False
        if ok:
            valid_count += 1
        else:
            invalid_lines.append(i)

    print(f"VALID: {valid_count}")
    print(f"INVALID: {len(invalid_lines)}")
    for ln in invalid_lines:
        print(ln)

main()
`,
    challenge_test_cases: [
      {
        input: `4\nLatte|2|4.5\n|1|3.0\nMuffin|-1|2.5\nBagel|1|2.00x`,
        expected_output: `VALID: 1\nINVALID: 3\n2\n3\n4`,
        description: "One clean item, three broken in three different ways.",
      },
      {
        input: `2\nLatte|2|4.5\nMuffin|1|2.5`,
        expected_output: `VALID: 2\nINVALID: 0`,
        description: "All lines valid, no invalid lines printed.",
      },
      {
        input: `1\nBagel|0|2.0`,
        expected_output: `VALID: 0\nINVALID: 1\n1`,
        description: "Edge: quantity of zero is invalid, must be strictly positive.",
      },
    ],
  },

  {
    id: "prod-13-4",
    project_id: "prod-13",
    order: 4,
    title: "Do the Totals Add Up?",
    concept: "totals-check with tolerance",
    explanation: `A scanner that parrots back whatever total the model claims isn't a scanner. It's a transcription of a guess. The check that catches the most bad reads is plain arithmetic: the line items should sum to the subtotal, and the subtotal plus tax should equal the total. When they don't, something on the receipt got misread.

## Why == won't work here

Money lives in floats, and floats don't compare the way you'd hope. \`0.1 + 0.2 == 0.3\` is \`False\` in Python. The math isn't broken; binary floating point just can't represent every decimal exactly. Receipts add their own wrinkle: they round to the cent, while your intermediate math doesn't. So a computed sum can land a fraction of a cent off the printed subtotal even when every number was read correctly.

The fix is a **tolerance**. Instead of "are these exactly equal," you ask "are these within a cent or two of each other."

\`\`\`python
def approx_equal(a, b, tolerance=0.01):
    return abs(a - b) <= tolerance
\`\`\`

## Building the totals check

Two comparisons cover the whole receipt. The items should sum to the subtotal, and the subtotal plus tax should equal the total.

\`\`\`python
def check_totals(items, subtotal, tax, total, tolerance=0.01):
    items_sum = sum(item["price"] * item["quantity"] for item in items)
    subtotal_ok = abs(items_sum - subtotal) <= tolerance
    total_ok = abs((subtotal + tax) - total) <= tolerance
    return {
        "items_sum": items_sum,
        "subtotal_ok": subtotal_ok,
        "total_ok": total_ok,
    }
\`\`\`

Notice that \`items_sum\` multiplies price by quantity for each item instead of just adding prices. Two lattes at \\$4.50 contribute \\$9.00, not \\$4.50.

## What a mismatch actually tells you

A mismatch doesn't automatically mean the model hallucinated. It could be a line item whose quantity or price got misread. It could be a tip or discount line your schema doesn't capture yet. It could even be the subtotal or total field itself that was read wrong, with the items fine.

The numbers alone won't tell you which. So the right move is to **flag it** rather than quietly accept or quietly reject. Mark the receipt \`needs_review\` and surface which check failed, subtotal or total, so a human glancing at it knows where to look first.

## Why this check earns its keep

This one arithmetic check catches a large share of misreads for almost no extra API cost. It's pure math on data you already pulled out. It's the cheapest reliability you'll add anywhere in this project, and it's what separates a tool that prints numbers from a tool that tells you when to stop trusting them.

## What to hold onto

Trust, but verify with a calculator. The model read the receipt. A few lines of arithmetic check that reading against itself before you write anything down as fact.`,
    animated_diagrams: [
      {
        title: "Checking the arithmetic",
        caption: "The receipt's own numbers should agree with each other within a cent.",
        loop: false,
        nodes: [
          { label: "Line items", sub: "price x qty", detail: "Multiply each item's price by its quantity so two lattes count as two." },
          { label: "Sum items", sub: "items_sum", detail: "Add those products into one number, the expected subtotal." },
          { label: "Compare subtotal", sub: "within tolerance", detail: "abs(items_sum - subtotal) <= tolerance instead of an exact equals." },
          { label: "Compare total", sub: "sub + tax", detail: "Check that subtotal plus tax lands within a cent of the printed total." },
          { label: "Verdict", sub: "ok or flag", detail: "Any mismatch marks the receipt needs_review and names which check failed." },
        ],
      },
    ],
    key_terms: [
      { term: "Tolerance", definition: "A small allowed gap so near-equal floats count as matching instead of demanding exact equality." },
      { term: "Floating-point error", definition: "Tiny inaccuracies from storing decimals in binary, which is why 0.1 + 0.2 is not exactly 0.3." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "items: 2 lattes at 4.5, subtotal 9.0, tax 0.5, total 9.5. Does it reconcile?",
        steps: [
          "items_sum = 4.5 * 2 = 9.0.",
          "abs(9.0 - 9.0) = 0.0, within the 0.01 tolerance, so subtotal is OK.",
          "subtotal + tax = 9.0 + 0.5 = 9.5.",
          "abs(9.5 - 9.5) = 0.0, within tolerance, so total is OK.",
        ],
        output: "both checks pass, the receipt reconciles",
      },
    ],
    inline_quizzes: [
      {
        question: "Why compare money with abs(a - b) <= tolerance instead of a == b?",
        options: ["== is deprecated", "Floats and cent rounding make exact equality unreliable", "abs is faster", "Tolerance rejects negatives"],
        correct_index: 1,
        explanation: "Binary floats cannot store every decimal exactly, and receipts round to the cent. A tolerance lets near-equal values match.",
      },
    ],
    starter_code: `def check_totals(items, subtotal, tax, total, tolerance=0.01):
    items_sum = sum(item["price"] * item["quantity"] for item in items)
    # TODO: compute whether items_sum matches subtotal within \`tolerance\`,
    # and whether subtotal + tax matches total within \`tolerance\`.
    # Return a dict:
    #   {"items_sum": items_sum, "subtotal_ok": ..., "total_ok": ...}
    pass

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "Muffin", "quantity": 1, "price": 3.0},
]
result = check_totals(items, subtotal=12.0, tax=1.0, total=13.0)
print(result)
`,
    solution_code: `def check_totals(items, subtotal, tax, total, tolerance=0.01):
    items_sum = sum(item["price"] * item["quantity"] for item in items)
    subtotal_ok = abs(items_sum - subtotal) <= tolerance
    total_ok = abs((subtotal + tax) - total) <= tolerance
    return {"items_sum": items_sum, "subtotal_ok": subtotal_ok, "total_ok": total_ok}

items = [
    {"name": "Latte", "quantity": 2, "price": 4.5},
    {"name": "Muffin", "quantity": 1, "price": 3.0},
]
result = check_totals(items, subtotal=12.0, tax=1.0, total=13.0)
print(result)
`,
    hints: [
      "items_sum should multiply price by quantity, not just add up the prices.",
      "Use abs(a - b) <= tolerance instead of == for float comparisons.",
      "subtotal + tax should be compared to total, using the same tolerance.",
    ],
    challenge_title: "Does the Math Check Out",
    challenge_description:
      "Given a receipt's line items and its stated subtotal/tax/total, verify the arithmetic within a one-cent tolerance.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    items = []
    for i in range(n):
        price_s, qty_s = data[i + 1].split()
        items.append((float(price_s), int(qty_s)))
    subtotal, tax, total = map(float, data[n + 1].split())
    # parse done: items is a list of (price, quantity) tuples

    # TODO: items_sum = sum(price * qty for each item)
    # TODO: subtotal is a MATCH if abs(items_sum - subtotal) <= 0.01, else MISMATCH
    # TODO: total is a MATCH if abs((subtotal + tax) - total) <= 0.01, else MISMATCH
    # TODO: print "SUBTOTAL: <MATCH|MISMATCH>" then "TOTAL: <MATCH|MISMATCH>"

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    items = []
    for i in range(n):
        price_s, qty_s = data[i + 1].split()
        items.append((float(price_s), int(qty_s)))
    subtotal, tax, total = map(float, data[n + 1].split())

    items_sum = sum(price * qty for price, qty in items)
    subtotal_ok = abs(items_sum - subtotal) <= 0.01
    total_ok = abs((subtotal + tax) - total) <= 0.01

    print("SUBTOTAL:", "MATCH" if subtotal_ok else "MISMATCH")
    print("TOTAL:", "MATCH" if total_ok else "MISMATCH")

main()
`,
    challenge_test_cases: [
      {
        input: `2\n4.5 2\n3.0 1\n12.0 1.0 13.0`,
        expected_output: `SUBTOTAL: MATCH\nTOTAL: MATCH`,
        description: "Clean receipt: items, subtotal, and total all agree.",
      },
      {
        input: `1\n5.0 1\n10.0 0.0 10.0`,
        expected_output: `SUBTOTAL: MISMATCH\nTOTAL: MATCH`,
        description: "Items sum to 5.0 but the stated subtotal is 10.0.",
      },
      {
        input: `1\n3.333 3\n10.00 0.0 10.00`,
        expected_output: `SUBTOTAL: MATCH\nTOTAL: MATCH`,
        description: "Edge: tiny rounding drift stays inside the one-cent tolerance.",
      },
    ],
  },

  {
    id: "prod-13-5",
    project_id: "prod-13",
    order: 5,
    title: "Cleaning Up Messy Fields",
    concept: "normalizing amounts and dates",
    explanation: `Ask a vision model for a dollar amount and you might get \`12.5\`, \`"$12.50"\`, or \`"1,234.56"\`. Ask for a date and back comes \`"07/01/2026"\`, \`"2026-07-01"\`, or \`"Jan 5, 2026"\`. Every one of those is a correct reading of the receipt. They just aren't in the same shape yet. Before you can do math on an amount or sort receipts by date, each field has to become one predictable type.

## Normalizing a currency string

The plan is short: strip a leading currency symbol, drop the thousands-separator commas, then convert to \`float\`. If the conversion fails, return \`None\` instead of crashing. One bad field shouldn't sink the whole receipt.

\`\`\`python
import re

def normalize_amount(raw):
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip())
    cleaned = cleaned.replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None
\`\`\`

\`re.sub(r"^[$€£]", "", cleaned)\` removes exactly one currency symbol, and only when it sits at the very start of the string. The \`^\` anchor pins it to the front, so a stray \`$\` in the middle survives. Dropping commas afterward turns \`"1,234.56"\` into \`"1234.56"\`, which \`float()\` handles fine.

## Normalizing a date string

Dates are harder because there's no single separator to strip. The whole *format* shifts from receipt to receipt. The practical fix is to try a short list of known formats in order and keep whichever one parses.

\`\`\`python
import datetime

def normalize_date(raw, formats=("%m/%d/%Y", "%Y-%m-%d", "%b %d, %Y")):
    for fmt in formats:
        try:
            parsed = datetime.datetime.strptime(raw.strip(), fmt)
            return parsed.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None
\`\`\`

Each \`strptime\` attempt either succeeds and returns a \`datetime\` or raises \`ValueError\`, at which point you move on to the next format. When one lands, \`strftime("%Y-%m-%d")\` rewrites it into one consistent output no matter which input format matched. If nothing fits, you get \`None\`, which flags the field for a human instead of storing a silently wrong date.

## Where this fits in the pipeline

Normalize right after you extract the JSON and before you run last lesson's totals check. Feeding \`"$12.00"\` and the float \`12.0\` into \`abs()\` crashes; feeding it \`12.0\` and \`12.0\` doesn't. Everything downstream, whether it's math, storage, or display, assumes clean types. Clean each field once, right after parsing, so you're not re-cleaning the same value in five different places.

## What to hold onto

The model reads a receipt the way a person would, in whatever format the paper happens to print. Your code speaks exactly one dialect: floats for money, ISO strings for dates. Normalization is the translator sitting between how the model wrote it and how your program needs it.`,
    animated_diagrams: [
      {
        title: "Normalizing a currency string",
        caption: "One messy string becomes one predictable float, or None if it cannot.",
        loop: false,
        nodes: [
          { label: "Raw value", sub: "$1,234.56", detail: "The model returns money in whatever shape the receipt printed it." },
          { label: "Strip symbol", sub: "leading $", detail: "Remove one currency symbol anchored to the front of the string." },
          { label: "Drop commas", sub: "thousands", detail: "Replace commas so 1,234.56 becomes 1234.56, which float can read." },
          { label: "float()", sub: "convert", detail: "Convert the cleaned string to a real number for math and storage." },
          { label: "float or None", sub: "safe result", detail: "If conversion fails, return None to flag the field instead of crashing." },
        ],
      },
    ],
    key_terms: [
      { term: "Normalization", definition: "Rewriting varied inputs into one consistent type and format your code can rely on." },
      { term: "strptime", definition: "A datetime function that parses a date string according to a format you supply." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "normalize_date(\"Jan 5, 2026\") trying formats %m/%d/%Y, then %Y-%m-%d, then %b %d, %Y",
        steps: [
          "Try %m/%d/%Y: 'Jan 5, 2026' does not match, strptime raises, move on.",
          "Try %Y-%m-%d: still no match, move on.",
          "Try %b %d, %Y: %b matches 'Jan', so parsing succeeds.",
          "strftime('%Y-%m-%d') rewrites it into one consistent output.",
        ],
        output: "2026-01-05",
      },
    ],
    inline_quizzes: [
      {
        question: "What does normalize_amount return when the value cannot be parsed?",
        options: ["0.0", "An empty string", "None", "It raises an error"],
        correct_index: 2,
        explanation: "Returning None flags the one bad field for review instead of crashing the whole receipt.",
      },
    ],
    starter_code: `import re

def normalize_amount(raw):
    # TODO: strip whitespace, remove a leading currency symbol ($, €, £)
    # and remove thousands separators (commas), then convert to float.
    # Return None if it can't be converted.
    pass

def normalize_date(raw, formats=("%m/%d/%Y", "%Y-%m-%d", "%b %d, %Y")):
    import datetime
    # TODO: try each format in \`formats\` with datetime.datetime.strptime.
    # Return the date formatted as "%Y-%m-%d" on the first format that
    # works, or None if none of them parse.
    pass

print(normalize_amount("$1,234.56"))
print(normalize_amount("12.5"))
print(normalize_amount("free"))
print(normalize_date("07/01/2026"))
print(normalize_date("Jan 5, 2026"))
`,
    solution_code: `import re
import datetime

def normalize_amount(raw):
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip())
    cleaned = cleaned.replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None

def normalize_date(raw, formats=("%m/%d/%Y", "%Y-%m-%d", "%b %d, %Y")):
    for fmt in formats:
        try:
            parsed = datetime.datetime.strptime(raw.strip(), fmt)
            return parsed.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None

print(normalize_amount("$1,234.56"))
print(normalize_amount("12.5"))
print(normalize_amount("free"))
print(normalize_date("07/01/2026"))
print(normalize_date("Jan 5, 2026"))
`,
    hints: [
      "re.sub(r'^[$€£]', '', s) removes exactly one leading currency symbol, using ^ to anchor it to the start.",
      "Try each date format in order inside a loop, and return as soon as one strptime call doesn't raise.",
      "Wrap float() and strptime() in try/except ValueError rather than pre-checking the string by hand.",
    ],
    challenge_title: "Normalize the Damn Numbers",
    challenge_description:
      "Clean up a batch of raw receipt amount strings into consistent two-decimal floats, or flag the ones that can't be parsed.",
    challenge_language: "python",
    challenge_starter_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]
    # TODO: for each raw amount, strip a leading currency symbol ($, €, £)
    # and remove commas, then try to convert to float.
    # Print the result formatted to 2 decimals (e.g. "1234.56"), or
    # "ERROR" if it can't be converted.

main()
`,
    challenge_solution_code: `import sys, re

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    lines = [data[i + 1] for i in range(n)]

    for raw in lines:
        cleaned = re.sub(r"^[$€£]", "", raw.strip()).replace(",", "")
        try:
            value = float(cleaned)
            print(f"{value:.2f}")
        except ValueError:
            print("ERROR")

main()
`,
    challenge_test_cases: [
      {
        input: `3\n$1,234.56\n12.5\nfree`,
        expected_output: `1234.56\n12.50\nERROR`,
        description: "Currency symbol and comma stripped; an unparsable value flagged.",
      },
      {
        input: `2\n€1,000.00\n£250.5`,
        expected_output: `1000.00\n250.50`,
        description: "Different currency symbols, both cleaned to plain floats.",
      },
      {
        input: `1\n$-5.00`,
        expected_output: `-5.00`,
        description: "Edge: a negative amount (e.g. a refund line) still parses fine.",
      },
    ],
  },

  {
    id: "prod-13-6",
    project_id: "prod-13",
    order: 6,
    title: "When the Photo Is Bad",
    concept: "retries and manual review",
    explanation: `Some receipts are blurry, or crumpled, or shot at an angle with half the total off the edge of the frame. On those, the model sometimes hands back malformed JSON, or JSON that parses cleanly but is missing the fields you need. A production scanner can't fall over on the first bad photo. It needs a plan for "this one didn't work" that doesn't end with a person reading a stack trace.

## The retry loop

The fix is small. If the reply doesn't parse, ask again, up to a small capped number of attempts. A reworded follow-up like "Return ONLY the JSON object, nothing else" often works where the first try failed, because you're nudging the model off whatever formatting habit tripped it up the first time.

\`\`\`python
import time

def scan_receipt(image_b64, media_type, max_retries=3):
    for attempt in range(1, max_retries + 1):
        reply = call_vision_model(image_b64, media_type)
        try:
            return extract_json(reply)
        except (ValueError, json.JSONDecodeError):
            if attempt == max_retries:
                return None  # give up, flag for manual review
            time.sleep(1)
\`\`\`

The cap matters as much as the retry. Without \`max_retries\`, a receipt that will *never* parse (a photo of a cat, say) retries forever, burning API calls and money on something that was doomed from the start.

## Returning None on purpose

When every attempt fails, the function returns \`None\` rather than raising. That's deliberate. One bad receipt in a batch of fifty shouldn't take down the other forty-nine. \`None\` is a checkable signal that means "this one needs a human," and whatever calls \`scan_receipt\` can act on it however the product wants: log it, skip it, drop it into a manual-entry queue.

## Letting the model admit uncertainty

You can also head off bad extractions at the source. Rather than forcing the model to fill in every field, explicitly allow \`null\`:

\`\`\`python
SYSTEM = """... If any field is unreadable in the photo, use null
for that field instead of guessing."""
\`\`\`

A model allowed to say "I don't know" for one blurry field gives you far better data than one that feels obliged to invent a plausible total. A guessed \`$47.32\` that happens to be wrong is worse than an honest \`null\`, because the guess looks right until someone checks it by hand.

## What to hold onto

Any real system that leans on an unreliable process needs two things: a bounded retry count and a defined give-up state that downstream code can check. \`scan_receipt\` returns a receipt or returns \`None\`. There is no third outcome where it hangs or crashes. That is exactly what makes it safe to point at a whole folder of photos and walk away.`,
    animated_diagrams: [
      {
        title: "Bounded retry loop",
        caption: "Try again a few times, then give up on purpose instead of hanging.",
        loop: true,
        nodes: [
          { label: "Call model", sub: "attempt n", detail: "Send the photo and ask for the JSON, one attempt at a time." },
          { label: "Try parse", sub: "extract_json", detail: "Attempt to pull a clean JSON object out of the reply." },
          { label: "Parsed?", sub: "yes or no", detail: "If it parsed, return the data right away and stop looping." },
          { label: "Retry", sub: "under cap", detail: "If it failed and attempts remain, reword the ask and try once more." },
          { label: "Give up", sub: "return None", detail: "Once the cap is hit, return None so this receipt goes to manual review." },
        ],
      },
    ],
    key_terms: [
      { term: "Retry cap", definition: "A hard limit on attempts so a hopeless input cannot loop forever burning API calls." },
      { term: "Graceful degradation", definition: "Failing in a defined, checkable way, like returning None, instead of crashing." },
    ],
    inline_quizzes: [
      {
        question: "Why does scan_receipt return None instead of raising when it gives up?",
        options: ["None is faster", "So one bad receipt does not take down the whole batch", "To save tokens", "Raising is not allowed"],
        correct_index: 1,
        explanation: "None is a checkable signal meaning 'needs a human'. One doomed photo should not stop the other forty-nine.",
      },
    ],
    callouts: [
      { type: "warning", position: "after", title: "Always cap retries", content: "Without max_retries, a photo that will never parse (a picture of a cat) retries forever. That is an unbounded bill, not just a slow one." },
    ],
    starter_code: `def parse_attempt(reply):
    # A "successful" reply looks like "OK:<merchant name>".
    # A failed attempt is exactly "BAD".
    # TODO: return the merchant name (str) if reply starts with "OK:",
    # otherwise return None.
    pass

def scan_receipt(replies, max_retries=3):
    # \`replies\` simulates what the model would return on each attempt,
    # in order. Try up to \`max_retries\` attempts; return as soon as one
    # parses successfully.
    # TODO: loop over replies[:max_retries], call parse_attempt, and
    # return (attempt_number, merchant) on the first success (1-indexed).
    # Return None if no attempt within max_retries succeeds.
    pass

print(scan_receipt(["BAD", "BAD", "OK:Cafe Luna", "OK:Should not reach"]))
print(scan_receipt(["BAD", "BAD", "BAD"], max_retries=3))
`,
    solution_code: `def parse_attempt(reply):
    if reply.startswith("OK:"):
        return reply[3:]
    return None

def scan_receipt(replies, max_retries=3):
    for i, reply in enumerate(replies[:max_retries], start=1):
        merchant = parse_attempt(reply)
        if merchant is not None:
            return (i, merchant)
    return None

print(scan_receipt(["BAD", "BAD", "OK:Cafe Luna", "OK:Should not reach"]))
print(scan_receipt(["BAD", "BAD", "BAD"], max_retries=3))
`,
    hints: [
      "Slice replies[:max_retries] so you never look past the retry cap, even if the list is longer.",
      "enumerate(..., start=1) keeps attempt numbers human-readable (1-indexed).",
      "Returning None cleanly signals 'give up, flag for manual review' instead of raising an exception.",
    ],
    challenge_title: "Give Up Gracefully",
    challenge_description:
      "Simulate a bounded retry loop over vision-model attempts, reporting the first success or a clean manual-review flag.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_retries = int(data[0].strip())
    n = int(data[1].strip())
    attempts = [data[i + 2] for i in range(n)]
    # TODO: look at attempts[:max_retries] in order. The first one that
    # starts with "OK:" is a success: print
    #   "SUCCESS attempt=<k> merchant=<name>"
    # where k is the 1-indexed attempt number and name is the text after
    # "OK:". If none of the first max_retries attempts succeed, print
    # "MANUAL_REVIEW".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    max_retries = int(data[0].strip())
    n = int(data[1].strip())
    attempts = [data[i + 2] for i in range(n)]

    for i, reply in enumerate(attempts[:max_retries], start=1):
        if reply.startswith("OK:"):
            print(f"SUCCESS attempt={i} merchant={reply[3:]}")
            return

    print("MANUAL_REVIEW")

main()
`,
    challenge_test_cases: [
      {
        input: `3\n4\nBAD\nBAD\nOK:Cafe Luna\nOK:Ignored`,
        expected_output: `SUCCESS attempt=3 merchant=Cafe Luna`,
        description: "Succeeds on the third of three allowed attempts.",
      },
      {
        input: `2\n3\nBAD\nBAD\nOK:TooLate`,
        expected_output: `MANUAL_REVIEW`,
        description: "The retry cap of 2 is hit before the (later) successful attempt is reached.",
      },
      {
        input: `1\n1\nOK:Solo Shop`,
        expected_output: `SUCCESS attempt=1 merchant=Solo Shop`,
        description: "Edge: succeeds immediately on the first and only attempt.",
      },
    ],
  },

  {
    id: "prod-13-7",
    project_id: "prod-13",
    order: 7,
    title: "Watching the Cost of Every Photo",
    concept: "image cost and batching",
    explanation: `Text is cheap to send. A few hundred words is a few hundred tokens. Photos don't work that way. A full-resolution image can cost more tokens than a page of text, and once this scanner is meant to work through a shoebox of receipts rather than one at a time, that adds up quickly. This lesson is about seeing the cost coming and running a batch so one bad file doesn't take down the rest.

## Estimating image cost

Vision APIs bill image tokens by pixel count, not file size in bytes. A rough rule of thumb some providers use is about one token per 750 pixels:

\`\`\`python
import math

def estimate_image_tokens(width, height):
    return math.ceil((width * height) / 750)
\`\`\`

The exact formula shifts by provider and model, but the point holds either way. A 4000x3000 photo straight off a phone camera costs far more than the same receipt scaled down to something readable like 1000x750. Before you send an image, ask whether you really need full camera resolution to read a receipt. You almost never do.

## Resizing before you send

A quick resize with an imaging library cuts the cost with almost no loss in what the model has to read:

\`\`\`python
from PIL import Image
import io, base64

def resize_and_encode(path, max_dim=1200):
    img = Image.open(path)
    img.thumbnail((max_dim, max_dim))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return base64.standard_b64encode(buf.getvalue()).decode("utf-8")
\`\`\`

Capping the longest side at 1200 pixels keeps receipt text legible while cutting the token bill well below an uncompressed phone photo.

## Batching without one failure taking down the rest

Scanning a folder of receipts, the batch loop has to keep going even when one image fails or comes back malformed. It's the same retry-and-give-up pattern from last lesson, applied across many files instead of one:

\`\`\`python
results = []
for path in receipt_paths:
    result = scan_receipt(path)  # None if it needed manual review
    results.append(result)
\`\`\`

You pay for the API call whether or not it gave you anything usable. A receipt that burned all three retries before giving up cost you three image-token charges. That's real money spent on a receipt you still have to key in by hand, and it's the whole reason the retry cap from last lesson exists. Unlimited retries on a bad photo aren't merely slow. They're an unbounded bill.

## Tallying the damage

At the end of a batch run you want two numbers: how many receipts succeeded, and what the batch cost in estimated tokens across successes and failures together. That second number is the one you'd quote if someone asked what scanning this month's receipts cost.

## What to hold onto

Every image carries a price tag before the model reads a word of it, set by pixel count and not by whether the extraction eventually works. Resize before you send. Cap the retries. Count the cost of the failures next to the successes, because they land on the same bill.`,
    animated_diagrams: [
      {
        title: "What one photo costs",
        caption: "Pixel count sets the token price before the model reads a word.",
        loop: false,
        nodes: [
          { label: "Photo", sub: "W x H pixels", detail: "Cost comes from pixel area, not the file size in bytes." },
          { label: "Estimate tokens", sub: "area / 750", detail: "A rough rule: about one token per 750 pixels, rounded up." },
          { label: "Resize?", sub: "cap longest side", detail: "Shrinking a 4000px photo to 1200px cuts the bill and keeps text readable." },
          { label: "Batch loop", sub: "each receipt", detail: "Scan a folder, and one bad image should not stop the rest." },
          { label: "Tally", sub: "success + cost", detail: "Report how many succeeded and the token cost across successes and failures." },
        ],
      },
    ],
    key_terms: [
      { term: "Image tokens", definition: "The token cost of an image, billed by pixel area rather than file size." },
      { term: "Batching", definition: "Processing many inputs in one run, letting failures be recorded instead of stopping everything." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Estimate tokens for a 900 x 1600 photo at one token per 750 pixels.",
        steps: [
          "Pixel area = 900 * 1600 = 1,440,000.",
          "Divide by 750: 1,440,000 / 750 = 1920.",
          "math.ceil rounds up, and here it is already a whole number.",
        ],
        output: "1920 tokens",
      },
    ],
    inline_quizzes: [
      {
        question: "A receipt fails after 3 retries. What did it cost?",
        options: ["Nothing, it failed", "One call", "Three image-token charges", "Only text tokens"],
        correct_index: 2,
        explanation: "You pay per call whether or not it worked. Three retries on a bad photo is three image-token charges, which is why the cap matters.",
      },
    ],
    starter_code: `import math

def estimate_image_tokens(width, height):
    # A common rule of thumb: image tokens scale with pixel count.
    # TODO: return math.ceil((width * height) / 750)
    pass

def batch_cost(receipts):
    # \`receipts\` is a list of dicts:
    #   {"width": int, "height": int, "status": "OK"|"ERROR"}
    # You pay the image-token cost whether or not extraction succeeded,
    # because the call already happened.
    # TODO: return (total_tokens, success_count, error_count)
    pass

receipts = [
    {"width": 900, "height": 1600, "status": "OK"},
    {"width": 300, "height": 300, "status": "ERROR"},
    {"width": 1200, "height": 1200, "status": "OK"},
]
print(estimate_image_tokens(900, 1600))
print(batch_cost(receipts))
`,
    solution_code: `import math

def estimate_image_tokens(width, height):
    return math.ceil((width * height) / 750)

def batch_cost(receipts):
    total_tokens = 0
    success_count = 0
    error_count = 0
    for r in receipts:
        total_tokens += estimate_image_tokens(r["width"], r["height"])
        if r["status"] == "OK":
            success_count += 1
        else:
            error_count += 1
    return (total_tokens, success_count, error_count)

receipts = [
    {"width": 900, "height": 1600, "status": "OK"},
    {"width": 300, "height": 300, "status": "ERROR"},
    {"width": 1200, "height": 1200, "status": "OK"},
]
print(estimate_image_tokens(900, 1600))
print(batch_cost(receipts))
`,
    hints: [
      "math.ceil rounds token estimates up, never down, since providers bill in whole tokens.",
      "A receipt still costs tokens even if status is ERROR, the API call already happened before you knew the result.",
      "Sum tokens across every receipt in the batch, not just the ones that succeeded.",
    ],
    challenge_title: "Batch Bill",
    challenge_description:
      "Estimate the total image-token cost of a batch of receipt photos, regardless of whether each one succeeded.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    success = 0
    error = 0
    for i in range(n):
        w_s, h_s, status = data[i + 1].split()
        w, h = int(w_s), int(h_s)
        # TODO: add ceil((w*h)/750) to total_tokens
        # TODO: bump success or error depending on status
        pass
    # TODO: print total_tokens, then "SUCCESS: <success>", then "ERROR: <error>"

main()
`,
    challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0].strip())
    total_tokens = 0
    success = 0
    error = 0
    for i in range(n):
        w_s, h_s, status = data[i + 1].split()
        w, h = int(w_s), int(h_s)
        total_tokens += math.ceil((w * h) / 750)
        if status == "OK":
            success += 1
        else:
            error += 1

    print(total_tokens)
    print(f"SUCCESS: {success}")
    print(f"ERROR: {error}")

main()
`,
    challenge_test_cases: [
      {
        input: `3\n900 1600 OK\n300 300 ERROR\n1200 1200 OK`,
        expected_output: `3960\nSUCCESS: 2\nERROR: 1`,
        description: "Mixed batch: tokens are billed for every photo, success and failure alike.",
      },
      {
        input: `1\n100 100 ERROR`,
        expected_output: `14\nSUCCESS: 0\nERROR: 1`,
        description: "A single failed receipt still costs its estimated tokens.",
      },
      {
        input: `1\n750 1 OK`,
        expected_output: `1\nSUCCESS: 1\nERROR: 0`,
        description: "Edge: pixel count divides evenly by 750, no rounding needed.",
      },
    ],
  },

  {
    id: "prod-13-8",
    project_id: "prod-13",
    order: 8,
    title: "Ship the Scanner",
    concept: "assembling the full pipeline",
    explanation: `Every piece is built. You send the photo, pull JSON out of the reply, validate the line items, check the totals, normalize the messy fields, retry on failure, and watch the cost. Shipping is wiring those pieces into one function that takes a photo and returns a result you can trust, plus a thin script around it that a person can actually run.

## One function, start to finish

\`\`\`python
import base64, json

def scan_receipt_from_file(path, client, max_retries=3):
    with open(path, "rb") as f:
        image_b64 = base64.standard_b64encode(f.read()).decode("utf-8")
    media_type = "image/jpeg" if path.lower().endswith(("jpg", "jpeg")) else "image/png"

    for attempt in range(1, max_retries + 1):
        messages = build_image_message(image_b64, media_type, EXTRACTION_PROMPT)
        response = client.messages.create(
            model="claude-sonnet-4-6", max_tokens=800,
            system=SYSTEM, messages=messages,
        )
        try:
            data = extract_json(response.content[0].text)
            return process_receipt(data)
        except (ValueError, json.JSONDecodeError):
            if attempt == max_retries:
                return {"status": "manual_review", "path": path}
\`\`\`

Every function called here (\`build_image_message\`, \`extract_json\`, \`process_receipt\`) is something you already wrote in an earlier lesson. Shipping isn't new logic. It's assembly.

## The final validation pass

\`process_receipt\` is where extraction, normalization, and the totals check meet and settle into one verdict:

\`\`\`python
def process_receipt(data, tolerance=0.01):
    subtotal = normalize_amount(data["subtotal"])
    tax = normalize_amount(data["tax"])
    total = normalize_amount(data["total"])

    items_sum = sum(
        normalize_amount(item["price"]) * item["quantity"] for item in data["items"]
    )
    ok = (
        abs(items_sum - subtotal) <= tolerance
        and abs((subtotal + tax) - total) <= tolerance
    )
    return {
        "merchant": data["merchant"],
        "total": total,
        "status": "ok" if ok else "needs_review",
    }
\`\`\`

The output stays small and deliberate: enough to act on with \`merchant\`, \`total\`, and \`status\`, while the full itemized receipt is still sitting on \`data\` if you want to store or display more.

## A script someone else can run

The last mile of "shipped" is a command a stranger could run without opening your source:

\`\`\`bash
python scan_receipt.py path/to/photo.jpg
# writes result.json, prints: {"merchant": "Cafe Luna", "total": 13.0, "status": "ok"}
\`\`\`

That's the whole thing: one command in, a JSON file out, and a status you can trust because it survived a retry loop and an arithmetic check instead of a single hopeful API call.

## It lands in your Portfolio

Finish this lesson and the Receipt Scanner is recorded in your **Portfolio** tab automatically, alongside its description. It becomes something you can point to as a real, working tool. Aim a phone camera at a receipt and you get back clean expense data plus a warning when the numbers don't add up. That's the arc of the whole build, from "send one photo, get one string back" in lesson one to a scanner that catches its own mistakes.

## What to hold onto

A shipped product isn't more code than a rough prototype. It's the same code with the gaps filled in: what happens when a call fails, when a field is missing, when the math doesn't reconcile. You already wrote all of that. Today you connected the wires.`,
    animated_diagrams: [
      {
        title: "The whole scanner, end to end",
        caption: "Every step you built, wired into one function that returns a trustworthy result.",
        loop: false,
        nodes: [
          { label: "Photo", sub: "file in", detail: "Read the image and base64-encode it, as in lesson one." },
          { label: "Model", sub: "with retries", detail: "Send it and pull JSON out, retrying on a bad reply." },
          { label: "Normalize", sub: "clean fields", detail: "Turn messy amounts and dates into floats and ISO strings." },
          { label: "Totals check", sub: "arithmetic", detail: "Confirm the items, subtotal, tax, and total reconcile." },
          { label: "Result", sub: "ok or review", detail: "Return merchant, total, and a status you can actually trust." },
        ],
      },
    ],
    key_terms: [
      { term: "Pipeline", definition: "A chain of steps where each one's output feeds the next, from raw input to final result." },
    ],
    inline_quizzes: [
      {
        question: "Why does process_receipt normalize amounts BEFORE the totals check?",
        options: ["To save tokens", "abs() on a string and a float would crash", "The model requires it", "To sort the items"],
        correct_index: 1,
        explanation: "The totals check does arithmetic. Feeding it '$12.00' as a string instead of the float 12.0 crashes, so clean the fields first.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "Shipping this scanner mostly meant writing brand-new logic, not wiring up existing functions.", correct_answer: "false", explanation: "Shipping was assembly. Every function came from an earlier lesson." },
          { type: "fill_in", question: "A receipt whose numbers do not reconcile is marked with what status (one word, underscore allowed)?", correct_answer: "needs_review", explanation: "needs_review flags it for a human instead of silently accepting or rejecting it." },
        ],
      },
    ],
    starter_code: `import json, re

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])

def normalize_amount(raw):
    if isinstance(raw, (int, float)):
        return float(raw)
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip()).replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None

def process_receipt(raw_reply, tolerance=0.01):
    data = extract_json(raw_reply)

    # TODO: normalize data["subtotal"], data["tax"], and data["total"]
    # with normalize_amount, and normalize each item's "price" too.
    # TODO: compute items_sum = sum(price * quantity) over the items.
    # TODO: status is "ok" if BOTH:
    #   abs(items_sum - subtotal) <= tolerance
    #   abs(subtotal + tax - total) <= tolerance
    # else status is "needs_review".
    # TODO: return a dict with keys: merchant, total, status
    pass

RAW = ('{"merchant": "Cafe Luna", "date": "2026-07-01", '
       '"items": [{"name": "Latte", "quantity": 2, "price": 4.5}, '
       '{"name": "Muffin", "quantity": 1, "price": 3.0}], '
       '"subtotal": 12.0, "tax": 1.0, "total": 13.0}')

print(process_receipt(RAW))
`,
    solution_code: `import json, re

def extract_json(text):
    start = text.index("{")
    end = text.rindex("}") + 1
    return json.loads(text[start:end])

def normalize_amount(raw):
    if isinstance(raw, (int, float)):
        return float(raw)
    cleaned = re.sub(r"^[$€£]", "", str(raw).strip()).replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None

def process_receipt(raw_reply, tolerance=0.01):
    data = extract_json(raw_reply)

    subtotal = normalize_amount(data["subtotal"])
    tax = normalize_amount(data["tax"])
    total = normalize_amount(data["total"])

    items_sum = 0.0
    for item in data["items"]:
        price = normalize_amount(item["price"])
        items_sum += price * item["quantity"]

    subtotal_ok = abs(items_sum - subtotal) <= tolerance
    total_ok = abs((subtotal + tax) - total) <= tolerance
    status = "ok" if subtotal_ok and total_ok else "needs_review"

    return {"merchant": data["merchant"], "total": total, "status": status}

RAW = ('{"merchant": "Cafe Luna", "date": "2026-07-01", '
       '"items": [{"name": "Latte", "quantity": 2, "price": 4.5}, '
       '{"name": "Muffin", "quantity": 1, "price": 3.0}], '
       '"subtotal": 12.0, "tax": 1.0, "total": 13.0}')

print(process_receipt(RAW))
`,
    hints: [
      "Reuse extract_json and normalize_amount exactly as written in earlier lessons, don't rewrite the parsing logic.",
      "Normalize amounts before comparing them; abs() on a string and a float will crash.",
      "Keep the final dict small and deliberate: merchant, total, status is enough for the shipped output.",
    ],
    challenge_title: "Full Pipeline Check",
    challenge_description:
      "Given a complete parsed receipt, run the final validation pass and report whether it's ready to file or needs a human to check it.",
    challenge_language: "python",
    challenge_starter_code: `import sys, json

def main():
    line = sys.stdin.read().strip()
    data = json.loads(line)
    # parse done: data has merchant, subtotal, tax, total, items (list of
    # {"name", "price", "quantity"})

    # TODO: items_sum = sum(item["price"] * item["quantity"] for item in data["items"])
    # TODO: status is "OK" if BOTH match within 0.01:
    #   items_sum vs data["subtotal"]
    #   data["subtotal"] + data["tax"] vs data["total"]
    # else "NEEDS_REVIEW"
    # TODO: print the status, then print data["total"] formatted to 2 decimals

main()
`,
    challenge_solution_code: `import sys, json

def main():
    line = sys.stdin.read().strip()
    data = json.loads(line)

    items_sum = sum(item["price"] * item["quantity"] for item in data["items"])
    subtotal_ok = abs(items_sum - data["subtotal"]) <= 0.01
    total_ok = abs((data["subtotal"] + data["tax"]) - data["total"]) <= 0.01

    status = "OK" if subtotal_ok and total_ok else "NEEDS_REVIEW"
    print(status)
    print(f"{data['total']:.2f}")

main()
`,
    challenge_test_cases: [
      {
        input: `{"merchant": "Cafe Luna", "subtotal": 12.0, "tax": 1.0, "total": 13.0, "items": [{"name": "Latte", "price": 4.5, "quantity": 2}, {"name": "Muffin", "price": 3.0, "quantity": 1}]}`,
        expected_output: `OK\n13.00`,
        description: "Clean receipt: items, subtotal, and total all reconcile.",
      },
      {
        input: `{"merchant": "X", "subtotal": 20.0, "tax": 2.0, "total": 22.0, "items": [{"name": "A", "price": 5.0, "quantity": 1}]}`,
        expected_output: `NEEDS_REVIEW\n22.00`,
        description: "Items sum to 5.0 but the stated subtotal is 20.0, a misread item.",
      },
      {
        input: `{"merchant": "Y", "subtotal": 10.0, "tax": 1.0, "total": 12.0, "items": [{"name": "B", "price": 10.0, "quantity": 1}]}`,
        expected_output: `NEEDS_REVIEW\n12.00`,
        description: "Edge: items match the subtotal fine, but subtotal + tax doesn't reach the stated total.",
      },
    ],
  },
];

export default { project, lessons };
