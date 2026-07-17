const project = {
  id: "prod-04",
  title: "Resume Bullet Booster",
  description:
    "A command-line tool that rewrites plain task descriptions into strong, quantified resume bullets. You build the rewrite prompt, enforce action-verb openings and length limits, then batch a whole list of tasks into polished bullets you can paste straight into a resume.",
  difficulty: "beginner",
  category: "foundations",
  estimated_time: 120,
  lessons_count: 8,
  tags: ["resume", "prompting", "rewrite", "action-verbs", "validation", "anthropic"],
  order: 104,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-04-1",
    project_id: "prod-04",
    order: 1,
    title: "The Rewrite Request",
    concept: "the rewrite prompt",
    explanation: `Everyone writes the same weak resume line: "responsible for the front desk." A recruiter skims past it in half a second. Over the next eight lessons you'll build a small tool that takes a limp task description and hands back a strong bullet: "Managed a 40-person front desk, cutting check-in time by 30%." Same job. The second line gets you the interview.

## What you're building

The finished tool is one function you run from a terminal: paste in a plain task, get back a punchy bullet. Under the hood it runs the same loop that sits inside most AI products. Read a task, wrap it in a prompt, call the model, clean the reply, check it against your rules, print it. This lesson builds step two, the **rewrite prompt**.

## The system prompt is the product

A rewrite tool lives or dies on its prompt. The persona and the rules go in the **system** prompt, which you set once and reuse for every task. The actual task the user typed goes in a **user** message. Split that way, you write the rules a single time and swap only the input on each call.

\`\`\`python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SYSTEM = (
    "You rewrite plain task descriptions into strong resume bullets. "
    "Start with a past-tense action verb. Keep it to one line. "
    "Return only the bullet, no preamble."
)

def rewrite(task):
    reply = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=80,
        system=SYSTEM,
        messages=[{"role": "user", "content": "Rewrite this as a resume bullet: " + task}],
    )
    return reply.content[0].text
\`\`\`

## Why the "Return only the bullet" line matters

Left alone, a chat model gets chatty: "Sure! Here's a strong version:…". That preamble breaks everything downstream, because your tool expects a bare bullet and gets a friendly paragraph instead. Telling the model the **exact output shape**, one line, verb-first, nothing else, is the cheapest reliability you can buy. You'll still defend against a chatty reply in lesson 2, but a precise prompt means you rarely have to.

## The mental model

The prompt is a set of instructions that will run on a thousand tasks you'll never see. Write it precise and a little dull: who the model is, what it does, and the format it returns. Below you'll build the request payload by hand, no network call, so the data shape is locked in before you ever hit the API.`,
    animated_diagrams: [
      {
        title: "Building the rewrite request",
        caption: "The rules stay put in the system prompt while only the task changes each call.",
        loop: false,
        nodes: [
          { label: "Plain task", sub: "raw input", detail: "The limp task description a user types, like 'did the front desk stuff'." },
          { label: "System prompt", sub: "the rules", detail: "The persona and rules you write once: rewrite into a verb-first bullet, one line, bullet only." },
          { label: "User message", sub: "the task", detail: "The task wrapped in a short instruction: 'Rewrite this as a resume bullet: ...'." },
          { label: "Request payload", sub: "dict to send", detail: "model, max_tokens, system, and messages bundled into one dict the API expects." },
          { label: "Ready to call", sub: "off to model", detail: "The payload is complete, so the actual network call becomes a one-liner later." },
        ],
      },
    ],
    key_terms: [
      { term: "System prompt", definition: "The standing rules and persona you set once and reuse on every call." },
      { term: "User message", definition: "The per-call input, here the task you want rewritten." },
      { term: "Payload", definition: "The bundle of model, max_tokens, system, and messages you hand to the API." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Build the request for the task \"managed the front desk\".",
        steps: [
          "Keep the SYSTEM string as the reusable rules.",
          "Wrap the task: \"Rewrite this as a resume bullet: managed the front desk\".",
          "Put that string as the content of one user message.",
          "Bundle model, max_tokens, system, and messages into a dict.",
        ],
        output: "{ model, max_tokens: 80, system: SYSTEM, messages: [{ role: 'user', content: 'Rewrite this as a resume bullet: managed the front desk' }] }",
      },
    ],
    inline_quizzes: [
      { question: "Where do the reusable rules (verb-first, one line, bullet only) belong?", options: ["In the user message", "In the system prompt", "In max_tokens", "In the model name"], correct_index: 1, explanation: "Rules that stay the same for every task go in the system prompt, set once and reused." },
      { question: "Why add \"Return only the bullet\" to the prompt?", options: ["It makes the model faster", "It stops the model adding a chatty preamble your tool can't parse", "It lowers the token cost to zero", "It is required by the API"], correct_index: 1, explanation: "A precise output shape keeps the reply to a bare bullet, so downstream checks don't choke on 'Sure! Here's...'." },
    ],
    callouts: [
      { type: "tip", position: "after", title: "Prompt for quality, verify later", content: "A precise prompt gets you a clean bullet most of the time. You still add checks in later lessons for the runs where it slips." },
    ],
    starter_code: `# Build the rewrite request payload by hand (no API call yet).
# system holds the rules; the user message holds this task.

SYSTEM = (
    "You rewrite plain task descriptions into strong resume bullets. "
    "Start with a past-tense action verb. Keep it to one line."
)

def build_rewrite_request(task):
    # TODO: return a dict with keys: model, max_tokens, system, messages
    #       messages is a list with ONE user turn whose content is
    #       "Rewrite this as a resume bullet: " + task
    pass

task = "did the front desk stuff and answered phones"
req = build_rewrite_request(task)
print("system set:", "system" in req)
`,
    solution_code: `# Build the rewrite request payload by hand (no API call yet).
# system holds the rules; the user message holds this task.

SYSTEM = (
    "You rewrite plain task descriptions into strong resume bullets. "
    "Start with a past-tense action verb. Keep it to one line."
)

def build_rewrite_request(task):
    return {
        "model": "claude-sonnet-4-6",
        "max_tokens": 80,
        "system": SYSTEM,
        "messages": [
            {"role": "user", "content": "Rewrite this as a resume bullet: " + task},
        ],
    }

task = "did the front desk stuff and answered phones"
req = build_rewrite_request(task)

print("system:", req["system"])
print("model:", req["model"])
print("messages:", len(req["messages"]))
print("user:", req["messages"][0]["content"])
`,
    hints: [
      "build_rewrite_request just returns a dict with model, max_tokens, system, and messages keys.",
      "messages is a list holding one dict: {\"role\": \"user\", \"content\": ...}.",
      "Concatenate the fixed instruction with the task: \"Rewrite this as a resume bullet: \" + task.",
    ],
    challenge_title: "Compose the Rewrite Prompt",
    challenge_description: "Given a system prompt and a raw task, assemble the exact two lines a rewrite request is built from.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    system = data[0]
    task = data[1]
    # TODO: print "system: <system>" then
    #       "user: Rewrite this as a resume bullet: <task>"

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    system = data[0]
    task = data[1]
    print("system: " + system)
    print("user: Rewrite this as a resume bullet: " + task)

main()
`,
    challenge_test_cases: [
      { input: "You rewrite resume bullets.\nmanaged the front desk", expected_output: "system: You rewrite resume bullets.\nuser: Rewrite this as a resume bullet: managed the front desk", description: "System line echoed, task wrapped in the fixed instruction." },
      { input: "Turn tasks into strong bullets.\nhelped plan the company party", expected_output: "system: Turn tasks into strong bullets.\nuser: Rewrite this as a resume bullet: helped plan the company party", description: "Different system and task, same assembly." },
    ],
  },

  {
    id: "prod-04-2",
    project_id: "prod-04",
    order: 2,
    title: "Cleaning the Reply",
    concept: "parsing the model's bullet",
    explanation: `You asked for a bare bullet. Sometimes you get one. Sometimes you get \`- Managed the front desk\`, or \`"Managed the front desk"\`, or \`1. Managed the front desk\`, or a cheerful \`Here's your bullet:\` glued to the front. The model is helpful in ways that break your tool. This lesson builds the cleanup step that turns any of those into one plain bullet.

## Why parsing is a separate step

Never trust the raw reply. Even with a strict prompt, models drift. They wrap text in quotes, add a leading dash because "that's what bullets look like," or number the line. Your downstream code (the action-verb check, the length check) expects a clean string that starts with the actual first word. A stray \`- \` makes the "first word" a dash, and every check misfires. So right after the call, you normalize.

\`\`\`python
def clean_bullet(raw):
    s = raw.strip()
    for marker in ("- ", "* ", "• "):
        if s.startswith(marker):
            s = s[len(marker):]
            break
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1]
    return s.strip()
\`\`\`

## The order of operations

Cleanup is a pipeline, and order matters:

1. **Strip whitespace** first, so a leading space doesn't hide the marker.
2. **Remove one bullet marker** (\`- \`, \`* \`, \`• \`, or a numeric \`1. \`) if present. Just one, a real bullet won't start with two.
3. **Strip surrounding quotes** if both ends have them.
4. **Strip again**: because removing a marker can expose new whitespace.

Each step is dull on its own. Run them in sequence and the rest of your tool always sees a predictable string.

## What cleanup does NOT fix

Cleanup handles formatting noise, not bad content. If the model returns "Here is a great bullet for you: Managed the desk," stripping markers won't remove the preamble. That's a prompt problem, and the fix is the "Return only the bullet" line from lesson 1. Tighten the prompt first, then clean up whatever still slips through.

## The mental model

Think of the reply as a package that sometimes arrives with extra tape and a bow. You're not judging the gift yet, just unwrapping it so what's inside is a plain string you can measure. Below you'll write \`clean_bullet\` and run it over a few messy replies.`,
    animated_diagrams: [
      {
        title: "The cleanup pipeline",
        caption: "Each step is dull alone; run in order and you always get a predictable bullet.",
        loop: false,
        nodes: [
          { label: "Raw reply", sub: "messy string", detail: "Whatever the model sent: maybe '  - \"Managed the desk\"' with markers and quotes." },
          { label: "Strip spaces", sub: "trim edges", detail: "Remove leading and trailing whitespace so a stray space can't hide the marker." },
          { label: "Drop marker", sub: "one only", detail: "Peel off a single '- ', '* ', bullet dot, or numeric '1. ' if present." },
          { label: "Strip quotes", sub: "both ends", detail: "If the text is wrapped in double quotes on both sides, remove them." },
          { label: "Clean bullet", sub: "predictable", detail: "A plain string starting with the real first word, ready for later checks." },
        ],
      },
    ],
    key_terms: [
      { term: "Normalize", definition: "Rewrite messy input into one predictable shape the rest of your code can rely on." },
      { term: "Bullet marker", definition: "A leading '- ', '* ', bullet dot, or '1. ' that the model adds to look list-like." },
      { term: "Pipeline", definition: "A fixed sequence of small steps where order matters and each feeds the next." },
    ],
    step_throughs: [
      {
        title: "Cleaning '  - Led the team '",
        steps: [
          { label: "start", detail: "The raw reply has spaces on both ends and a dash marker.", code: "raw = '  - Led the team '" },
          { label: "strip()", detail: "Trim the edges so the marker sits at the very front.", code: "'- Led the team'" },
          { label: "drop marker", detail: "It starts with '- ', so remove those two characters.", code: "'Led the team'" },
          { label: "strip again", detail: "No quotes to remove; a final strip leaves the clean bullet.", code: "'Led the team'" },
        ],
      },
    ],
    inline_quizzes: [
      { question: "Why strip whitespace before looking for a bullet marker?", options: ["It runs faster", "A leading space would hide the marker so startswith misses it", "It removes the quotes", "The API requires it"], correct_index: 1, explanation: "'  - Led' does not start with '- ' until you trim the space first." },
    ],
    callouts: [
      { type: "warning", position: "after", title: "Cleanup is not content repair", content: "Stripping markers fixes formatting noise, not a chatty preamble baked into the sentence. Tighten the prompt for that." },
    ],
    starter_code: `# Turn a messy model reply into one clean bullet string.

def clean_bullet(raw):
    s = raw.strip()
    # TODO: if s starts with "- ", "* ", or "• ", remove that marker (just one)
    # TODO: if s is wrapped in double quotes on both ends, remove them
    # TODO: return s stripped of surrounding whitespace
    return s

samples = [
    "  - Led the team ",
    '"Increased sales"',
    "• Managed a team of five",
    "Reduced churn by 12%",
]
for r in samples:
    print(clean_bullet(r))
`,
    solution_code: `# Turn a messy model reply into one clean bullet string.

def clean_bullet(raw):
    s = raw.strip()
    for marker in ("- ", "* ", "• "):
        if s.startswith(marker):
            s = s[len(marker):]
            break
    else:
        digits = 0
        while digits < len(s) and s[digits].isdigit():
            digits += 1
        if digits > 0 and s[digits:digits + 2] == ". ":
            s = s[digits + 2:]
    s = s.strip()
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1].strip()
    return s

samples = [
    "  - Led the team ",
    '1. "Increased sales"',
    "• Managed a team of five",
    "Reduced churn by 12%",
]
for r in samples:
    print(clean_bullet(r))
`,
    hints: [
      "Strip whitespace before you look for a marker, or a leading space hides it.",
      "Use a for/else: the else runs only if no dash/star/bullet marker matched, so that's where you check for a numeric marker like '1. '.",
      "Only strip quotes when both the first and last character are a double quote.",
    ],
    challenge_title: "Strip the Bullet",
    challenge_description: "Clean one raw model reply: remove a single leading bullet marker (dash, star, dot, or numeric) and surrounding quotes.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def clean_bullet(raw):
    s = raw.strip()
    # TODO: remove one leading marker: "- ", "* ", "• ", or "<digits>. "
    # TODO: remove surrounding double quotes if present
    return s.strip()

def main():
    print(clean_bullet(sys.stdin.read()))

main()
`,
    challenge_solution_code: `import sys

def clean_bullet(raw):
    s = raw.strip()
    for marker in ("- ", "* ", "• "):
        if s.startswith(marker):
            s = s[len(marker):]
            break
    else:
        digits = 0
        while digits < len(s) and s[digits].isdigit():
            digits += 1
        if digits > 0 and s[digits:digits + 2] == ". ":
            s = s[digits + 2:]
    s = s.strip()
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        s = s[1:-1].strip()
    return s

def main():
    print(clean_bullet(sys.stdin.read()))

main()
`,
    challenge_test_cases: [
      { input: "  - Led the team ", expected_output: "Led the team", description: "Strips whitespace and a leading dash marker." },
      { input: "1. \"Increased sales\"", expected_output: "Increased sales", description: "Removes a numeric marker and surrounding quotes." },
      { input: "• Managed a team of five", expected_output: "Managed a team of five", description: "Removes a bullet-dot marker." },
      { input: "\"Reduced churn\"", expected_output: "Reduced churn", description: "No marker, just surrounding quotes to strip." },
    ],
  },

  {
    id: "prod-04-3",
    project_id: "prod-04",
    order: 3,
    title: "Demand a Strong Verb",
    concept: "action-verb constraints",
    explanation: `The biggest tell of a weak resume is the opener. "Responsible for," "Helped with," "Worked on," "Assisted with," "Duties included": every one of them reads as someone who watched the work happen. Strong bullets start with a past-tense **action verb** you owned: Led, Built, Shipped, Cut, Grew, Automated, Negotiated. This lesson makes your tool enforce that.

## Two ways to enforce the verb

You have two levers, and good tools pull both:

1. **Constrain the prompt.** Tell the model to start with a strong past-tense action verb and ban weak openers outright. This is where the quality actually comes from.

\`\`\`python
SYSTEM = (
    "You rewrite tasks into strong resume bullets. Rules:\\n"
    "- Start with a past-tense action verb (Led, Built, Cut, Grew, Automated).\\n"
    "- Never start with a weak phrase: 'Responsible for', 'Helped', "
    "'Worked on', 'Assisted with', 'Duties included'.\\n"
    "- Return only the bullet."
)
\`\`\`

2. **Verify the output.** The prompt is a strong suggestion, not a guarantee. After cleaning the reply, check the opener yourself and reject bullets that still start weak.

\`\`\`python
WEAK_OPENERS = ["responsible for", "helped", "worked on",
                "assisted with", "duties included", "participated in"]

def starts_weak(bullet):
    low = bullet.strip().lower()
    return any(low.startswith(op) for op in WEAK_OPENERS)
\`\`\`

## Why check when you already asked

Because "asked" and "guaranteed" are different words. A model that follows your rule 95% of the time still ships a weak bullet one run in twenty, and on a resume the weak line is the one a recruiter notices. The verification is cheap: a lowercase-and-\`startswith\` scan over a short list. When it fails, you'll retry the call (lesson 6). You prompt for quality and verify for reliability, and that pairing sits under most AI tools that hold up in production.

## Getting the check right

Two details keep the check honest. **Lowercase both sides** so "Responsible" and "responsible" match. And match against the **opener**, not any occurrence: a bullet can legitimately contain "helped" mid-sentence, as in "Led a rewrite that helped cut load time." It's weak only when it *starts* that way, and \`startswith\` on the lowercased bullet gets both cases right.

## The mental model

The prompt tells the model what good looks like. The verifier double-checks before the line goes on paper. Below you'll build \`starts_weak\` and score a batch of bullets.`,
    animated_diagrams: [
      {
        title: "Checking the opener",
        caption: "Lowercase the bullet, then test only its first words against the weak list.",
        loop: false,
        nodes: [
          { label: "Bullet", sub: "one line", detail: "The cleaned bullet, like 'Responsible for the monthly budget'." },
          { label: "Lowercase + strip", sub: "level the field", detail: "Fold case and trim so 'Responsible' and 'responsible' both match." },
          { label: "startswith?", sub: "opener only", detail: "Test whether it begins with any weak phrase, not whether it contains one." },
          { label: "Label", sub: "WEAK / STRONG", detail: "Begins weak means WEAK; otherwise it opened with a real action verb." },
        ],
      },
    ],
    key_terms: [
      { term: "Action verb", definition: "A past-tense verb you owned: Led, Built, Cut, Grew, Automated." },
      { term: "Weak opener", definition: "A passive lead-in like 'Responsible for' or 'Helped with' that reads as watching, not doing." },
      { term: "Verification", definition: "Checking the model's output against a rule instead of trusting it followed the prompt." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Is \"Led a rewrite that helped cut load time\" weak?",
        steps: [
          "Lowercase it: 'led a rewrite that helped cut load time'.",
          "Test startswith against each weak opener.",
          "It begins with 'led', not 'helped', so no weak opener matches at the start.",
          "'helped' appears mid-sentence, but startswith only checks the opening.",
        ],
        output: "STRONG (the word 'helped' in the middle does not count)",
      },
    ],
    inline_quizzes: [
      { question: "The prompt already bans weak openers. Why verify the output too?", options: ["Verification is required by law", "A model that obeys 95% of the time still ships a weak bullet one run in twenty", "It makes the model start with a verb", "To lower token cost"], correct_index: 1, explanation: "You prompt for quality and verify for reliability; the check catches the rare miss before it reaches paper." },
      { question: "Why match with startswith instead of 'in'?", options: ["startswith is faster", "A strong bullet can contain 'helped' mid-sentence; it's only weak when it opens that way", "'in' does not work on strings", "There is no difference"], correct_index: 1, explanation: "The opener is what's weak, so you test the start, not any occurrence." },
    ],
    starter_code: `# Flag bullets that open with a weak, passive phrase.

WEAK_OPENERS = ["responsible for", "helped", "worked on",
                "assisted with", "duties included", "participated in"]

def starts_weak(bullet):
    # TODO: lowercase and strip the bullet, then return True if it
    #       startswith any phrase in WEAK_OPENERS
    pass

bullets = [
    "Responsible for the monthly budget",
    "Led a team of six engineers",
    "Helped customers with returns",
    "Cut cloud costs by 20%",
]
for b in bullets:
    label = "WEAK" if starts_weak(b) else "STRONG"
    print(label, "-", b)
`,
    solution_code: `# Flag bullets that open with a weak, passive phrase.

WEAK_OPENERS = ["responsible for", "helped", "worked on",
                "assisted with", "duties included", "participated in"]

def starts_weak(bullet):
    low = bullet.strip().lower()
    return any(low.startswith(op) for op in WEAK_OPENERS)

bullets = [
    "Responsible for the monthly budget",
    "Led a team of six engineers",
    "Helped customers with returns",
    "Cut cloud costs by 20%",
]
for b in bullets:
    label = "WEAK" if starts_weak(b) else "STRONG"
    print(label, "-", b)
`,
    hints: [
      "Lowercase AND strip the bullet before comparing, so casing and stray spaces don't fool the check.",
      "any(low.startswith(op) for op in WEAK_OPENERS) returns True if any opener matches.",
      "Match on the start only: a bullet containing 'helped' in the middle is still strong.",
    ],
    challenge_title: "Reject Weak Openers",
    challenge_description: "Given a list of weak opener phrases and a batch of bullets, label each STRONG or WEAK and tally the results.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    idx = 0
    w = int(data[idx]); idx += 1
    weak = [data[idx + i].strip().lower() for i in range(w)]; idx += w
    n = int(data[idx]); idx += 1
    bullets = [data[idx + i] for i in range(n)]; idx += n
    # TODO: print STRONG or WEAK for each bullet (WEAK if it starts with
    #       any weak opener, case-insensitively), then "Strong: X Weak: Y".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    idx = 0
    w = int(data[idx]); idx += 1
    weak = [data[idx + i].strip().lower() for i in range(w)]; idx += w
    n = int(data[idx]); idx += 1
    bullets = [data[idx + i] for i in range(n)]; idx += n

    strong_count = 0
    weak_count = 0
    for b in bullets:
        low = b.strip().lower()
        if any(low.startswith(op) for op in weak):
            print("WEAK")
            weak_count += 1
        else:
            print("STRONG")
            strong_count += 1
    print(f"Strong: {strong_count} Weak: {weak_count}")

main()
`,
    challenge_test_cases: [
      { input: "3\nresponsible for\nhelped\nworked on\n3\nResponsible for the budget\nLed the team\nHelped customers", expected_output: "WEAK\nSTRONG\nWEAK\nStrong: 1 Weak: 2", description: "Two weak openers, one strong verb." },
      { input: "2\nassisted with\nduties included\n2\nBuilt the API\nDesigned the logo", expected_output: "STRONG\nSTRONG\nStrong: 2 Weak: 0", description: "Both open with strong action verbs." },
      { input: "1\nresponsible for\n1\nResponsible for payroll", expected_output: "WEAK\nStrong: 0 Weak: 1", description: "Single weak bullet." },
    ],
  },

  {
    id: "prod-04-4",
    project_id: "prod-04",
    order: 4,
    title: "Make It Count",
    concept: "quantifying bullets",
    explanation: `"Improved the onboarding process" is forgettable. "Cut onboarding from 5 days to 2, raising 30-day retention 18%" gets you hired. The difference is **numbers**. A quantified bullet hands a recruiter something concrete to picture and compare. This lesson makes your tool push for metrics and flag the bullets that still don't have any.

## The rewrite prompt should ask for numbers

The model can't invent true numbers, since it doesn't know your metrics, but it can ask you for them and use any you provide. So the rewrite instruction does two things: it bakes numbers in when the task mentions them, and it drops in a clear placeholder when it doesn't, so you fill the gap instead of shipping a vague line.

\`\`\`python
SYSTEM = (
    "You rewrite tasks into strong resume bullets. "
    "Quantify impact wherever possible: team size, %, time saved, dollars, volume. "
    "If the task has no numbers, insert a bracketed placeholder like [X%] "
    "so the user can fill it in. Return only the bullet."
)
\`\`\`

A bullet that comes back as "Reduced ticket backlog by [X%]" is doing its job: it's telling you exactly what fact would make it strong.

## Detecting whether a bullet is quantified

After the rewrite, check whether real numbers made it in. The simplest reliable signal is: does the bullet contain a digit?

\`\`\`python
def has_number(bullet):
    return any(ch.isdigit() for ch in bullet)
\`\`\`

That single line catches percentages, counts, dollar amounts, and time spans, anything with a digit 0 through 9 in it. It's a heuristic, not a proof (a bullet could say "doubled" in words), but it flags the vast majority of vague lines so you know which ones still need a metric. When \`has_number\` is False, your tool warns you: "this bullet has no numbers, add one."

## Why a heuristic is enough here

You don't need a full grammar of "impact." You need a fast, cheap flag that surfaces the bullets most likely to read as fluff, so a human spends thirty seconds adding the real figure. A digit check is the whole detector, and for the cost of one line it pays for itself.

## The mental model

Numbers are the load-bearing wall of a resume bullet. Your tool's job here is a metal detector: sweep each bullet, beep on the ones with no metal in them, and tell you to go find the number. Below you'll build \`has_number\` and sort a batch into quantified vs vague.`,
    animated_diagrams: [
      {
        title: "The digit sweep",
        caption: "Scan each character; one digit anywhere flips the bullet to quantified.",
        loop: false,
        nodes: [
          { label: "Bullet", sub: "one line", detail: "A rewritten bullet, like 'Cut cloud costs by 30%'." },
          { label: "Scan chars", sub: "one by one", detail: "Walk the string checking each character with .isdigit()." },
          { label: "Any digit?", sub: "0-9 present", detail: "Stop at the first digit found; 'any' short-circuits once it hits one." },
          { label: "Label", sub: "QUANTIFIED / VAGUE", detail: "A digit means QUANTIFIED; none means VAGUE, so a human adds the real figure." },
        ],
      },
    ],
    key_terms: [
      { term: "Quantify", definition: "Back a claim with a concrete number: percent, count, dollars, or time saved." },
      { term: "Heuristic", definition: "A fast, cheap rule that's right most of the time without trying to be perfect." },
      { term: "Placeholder", definition: "A bracketed stand-in like [X%] the model inserts so you know a number is missing." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Does has_number(\"Improved team morale\") return True?",
        steps: [
          "Walk each character: I, m, p, r, o, v, e, d, space, t, ...",
          "None of them satisfy .isdigit().",
          "any(...) finds no digit, so it returns False.",
        ],
        output: "False, so the bullet is labeled VAGUE",
      },
    ],
    inline_quizzes: [
      { question: "Why is a plain digit check good enough here?", options: ["It proves every bullet is strong", "It's a cheap flag that surfaces most vague bullets so a human adds the real figure", "It detects spelled-out numbers like 'ten'", "It rewrites the bullet automatically"], correct_index: 1, explanation: "You want a fast signal, not a proof; a digit scan catches the vast majority of fluffy lines for one line of code." },
    ],
    callouts: [
      { type: "insight", position: "after", title: "The model can't invent your numbers", content: "It doesn't know your real metrics, so a smart prompt asks for a [X%] placeholder when the task has no numbers, telling you exactly what fact to fill in." },
    ],
    starter_code: `# Flag bullets that contain no numbers (likely vague).

def has_number(bullet):
    # TODO: return True if any character in bullet is a digit 0-9
    pass

bullets = [
    "Cut cloud costs by 30%",
    "Improved team morale",
    "Grew signups from 100 to 450",
    "Managed the front desk",
]
for b in bullets:
    label = "QUANTIFIED" if has_number(b) else "VAGUE"
    print(label, "-", b)
`,
    solution_code: `# Flag bullets that contain no numbers (likely vague).

def has_number(bullet):
    return any(ch.isdigit() for ch in bullet)

bullets = [
    "Cut cloud costs by 30%",
    "Improved team morale",
    "Grew signups from 100 to 450",
    "Managed the front desk",
]
quantified = 0
for b in bullets:
    if has_number(b):
        print("QUANTIFIED -", b)
        quantified += 1
    else:
        print("VAGUE -", b)
print(f"Quantified: {quantified} of {len(bullets)}")
`,
    hints: [
      "str method .isdigit() is True for a single digit character.",
      "any(ch.isdigit() for ch in bullet) scans the whole string for at least one digit.",
      "You don't need to detect spelled-out numbers like 'ten'; a digit check flags the vast majority of vague bullets.",
    ],
    challenge_title: "Flag the Vague Bullets",
    challenge_description: "Label each bullet QUANTIFIED if it contains a digit, otherwise VAGUE, and count how many made the cut.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    bullets = [data[1 + i] for i in range(n)]
    # TODO: print QUANTIFIED or VAGUE per bullet (QUANTIFIED if it has a digit),
    #       then "Quantified: X of N".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    bullets = [data[1 + i] for i in range(n)]

    q = 0
    for b in bullets:
        if any(ch.isdigit() for ch in b):
            print("QUANTIFIED")
            q += 1
        else:
            print("VAGUE")
    print(f"Quantified: {q} of {n}")

main()
`,
    challenge_test_cases: [
      { input: "3\nCut costs by 30%\nImproved team morale\nGrew signups from 100 to 450", expected_output: "QUANTIFIED\nVAGUE\nQUANTIFIED\nQuantified: 2 of 3", description: "Two bullets carry digits, one is vague." },
      { input: "2\nManaged the office\nLed weekly standups", expected_output: "VAGUE\nVAGUE\nQuantified: 0 of 2", description: "No numbers anywhere." },
      { input: "1\nReduced load time by 2 seconds", expected_output: "QUANTIFIED\nQuantified: 1 of 1", description: "Single quantified bullet." },
    ],
  },

  {
    id: "prod-04-5",
    project_id: "prod-04",
    order: 5,
    title: "One Line, No More",
    concept: "length limits",
    explanation: `A resume bullet is one line. A bullet that wraps three times reads as a paragraph someone forgot to edit, and recruiters skim past it. This lesson makes your tool enforce a hard **length limit**, once in the prompt and again on the output.

## Cap it in the prompt first

The cleanest length control is telling the model the budget up front. A word cap is easier for a model to hit reliably than a character cap, and it maps to how bullets actually read.

\`\`\`python
MAX_WORDS = 20

SYSTEM = (
    f"You rewrite tasks into resume bullets of at most {MAX_WORDS} words. "
    "One line, no line breaks. Lead with the action verb; cut filler words "
    "like 'various', 'successfully', 'in order to'. Return only the bullet."
)
\`\`\`

## Enforce it on the output too

Same story as the verb check: asking isn't guaranteeing. After cleaning, count words and, if the bullet blew the budget, trim it at a **word boundary** so you never cut a word in half.

\`\`\`python
def enforce_length(bullet, max_words):
    words = bullet.split()
    if len(words) <= max_words:
        return bullet, False
    return " ".join(words[:max_words]), True
\`\`\`

The function returns the (possibly trimmed) bullet and a flag saying whether it had to cut. That flag matters: a hard truncation can lop off the number at the end ("...by 30%"), so when it trips, your tool should warn you to rewrite shorter instead of silently shipping a chopped line.

## Why trim instead of just reject

Rejecting and retrying costs another API call and another few seconds. For length, a local trim is instant and usually fine, because the important content is front-loaded once you forced the verb first. Trim locally, flag when you did, and re-call the model only when the trim damaged the meaning. Reach for the cheap fix before the expensive one.

## Watch the boundary

The one bug to avoid: never slice by character count in the middle of a word. \`bullet[:100]\` can produce "Automated the deploy pipeli", which is worse than the original. Splitting into words and rejoining the first N gives you clean, readable output every time, and \`split()\` collapses any accidental double spaces for free.

## The mental model

Think of the bullet as a headline with a fixed budget, like a tweet. When it runs over, you don't shrink the font, you cut words from the end, and if the cut hurt the meaning, you rewrite. Below you'll build \`enforce_length\` and trim to a limit.`,
    animated_diagrams: [
      {
        title: "Trimming to the word budget",
        caption: "Split into words, keep the first N, and flag whether you had to cut.",
        loop: false,
        nodes: [
          { label: "Bullet", sub: "maybe long", detail: "The cleaned bullet, which might run past the word budget." },
          { label: "split()", sub: "into words", detail: "Break on whitespace into a list of words; this also collapses double spaces." },
          { label: "Count vs cap", sub: "compare", detail: "If the word count is within max_words, return it unchanged with flag False." },
          { label: "Join first N", sub: "word boundary", detail: "Over budget: rejoin the first max_words words so no word is cut in half." },
          { label: "Return + flag", sub: "bullet, cut?", detail: "Hand back the bullet and a bool saying whether a trim happened." },
        ],
      },
    ],
    key_terms: [
      { term: "Word boundary", definition: "The gap between whole words; trimming here never leaves a half-word." },
      { term: "Truncation", definition: "Cutting text to fit a limit; a bad truncation can drop the number at the end." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "enforce_length(\"Cut cloud costs by thirty percent\", 6)",
        steps: [
          "split() gives ['Cut','cloud','costs','by','thirty','percent'], 6 words.",
          "6 is not greater than the cap of 6, so it fits.",
          "Return the bullet unchanged with the flag False.",
        ],
        output: "('Cut cloud costs by thirty percent', False)",
      },
    ],
    inline_quizzes: [
      { question: "Why trim on words instead of slicing bullet[:100] by characters?", options: ["Character slicing is slower", "A character slice can leave a half-word like 'pipeli'; word slicing stays readable", "The API rejects character slices", "There is no difference"], correct_index: 1, explanation: "Splitting into words and rejoining the first N gives clean output every time." },
      { question: "Why return a flag saying whether you trimmed?", options: ["The flag is decorative", "A hard cut can lop off the ending number, so the tool should warn you to rewrite shorter", "It doubles the speed", "It is required syntax"], correct_index: 1, explanation: "The flag lets your tool tell you a trim may have damaged meaning instead of silently shipping a chopped line." },
    ],
    starter_code: `# Enforce a word limit, trimming at a word boundary.

def enforce_length(bullet, max_words):
    words = bullet.split()
    # TODO: if len(words) <= max_words, return (bullet, False)
    # TODO: otherwise return (" ".join(first max_words words), True)
    pass

samples = [
    ("Led a cross-functional team of ten engineers across three global offices", 6),
    ("Cut cloud costs by thirty percent", 6),
]
for bullet, cap in samples:
    trimmed, was_trimmed = enforce_length(bullet, cap)
    print(("TRIMMED" if was_trimmed else "OK"), "->", trimmed)
`,
    solution_code: `# Enforce a word limit, trimming at a word boundary.

def enforce_length(bullet, max_words):
    words = bullet.split()
    if len(words) <= max_words:
        return bullet, False
    return " ".join(words[:max_words]), True

samples = [
    ("Led a cross-functional team of ten engineers across three global offices", 6),
    ("Cut cloud costs by thirty percent", 6),
]
for bullet, cap in samples:
    trimmed, was_trimmed = enforce_length(bullet, cap)
    print(("TRIMMED" if was_trimmed else "OK"), "->", trimmed)
`,
    hints: [
      "bullet.split() gives the list of words; len() of it is the word count.",
      "Return a tuple: the (possibly trimmed) bullet and a bool for whether you cut.",
      "Trim with ' '.join(words[:max_words]) so you never split a word in half.",
    ],
    challenge_title: "Trim to the Limit",
    challenge_description: "Given a max word count and a bullet, print the bullet unchanged if it fits, otherwise trim it at a word boundary; report OK or TRIMMED.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    bullet = data[1] if len(data) > 1 else ""
    # TODO: if the bullet has <= m words, print it then "OK".
    # TODO: otherwise print the first m words joined by spaces, then "TRIMMED".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    bullet = data[1] if len(data) > 1 else ""
    words = bullet.split()
    if len(words) <= m:
        print(bullet)
        print("OK")
    else:
        print(" ".join(words[:m]))
        print("TRIMMED")

main()
`,
    challenge_test_cases: [
      { input: "5\nLed a team of ten engineers across three offices", expected_output: "Led a team of ten\nTRIMMED", description: "Nine words trimmed to the first five." },
      { input: "6\nCut cloud costs by thirty percent", expected_output: "Cut cloud costs by thirty percent\nOK", description: "Exactly at the limit, unchanged." },
      { input: "3\nBuilt the dashboard", expected_output: "Built the dashboard\nOK", description: "Under the limit." },
    ],
  },

  {
    id: "prod-04-6",
    project_id: "prod-04",
    order: 6,
    title: "Guard Every Bullet",
    concept: "validation and retries",
    explanation: `You now have three separate rules: strong opener, has a number, within the word limit. Scattered across your code they're easy to forget. This lesson pulls them into one **validator** that checks every rule at once and, when a bullet fails, tells your tool exactly what to fix. It also handles the edge case everyone forgets, empty input.

## One function, all the rules

A validator returns the list of things wrong with a bullet. Empty list means it passed.

\`\`\`python
def validate(bullet, weak_openers, max_words):
    text = bullet.strip()
    if text == "":
        return ["EMPTY"]
    problems = []
    low = text.lower()
    if any(low.startswith(op) for op in weak_openers):
        problems.append("WEAK")
    if not any(ch.isdigit() for ch in text):
        problems.append("NONUM")
    if len(text.split()) > max_words:
        problems.append("LONG")
    return problems
\`\`\`

Notice the order: **EMPTY short-circuits**. An empty bullet isn't weak or long, it's nothing, and every other check would just add noise. Return early, then collect the rest in a fixed order so the output is predictable.

## Turning failures into a retry

The validator is what makes the "prompt for quality, verify for reliability" loop real. When a bullet fails, you call the model again and tell it *why* it failed, so the retry is better than a blind redo:

\`\`\`python
def rewrite_valid(task, tries=2):
    for attempt in range(tries + 1):
        bullet = clean_bullet(rewrite(task))
        problems = validate(bullet, WEAK_OPENERS, MAX_WORDS)
        if not problems:
            return bullet
        task = task + f"  (last attempt failed: {', '.join(problems)}. Fix it.)"
    return bullet
\`\`\`

Feeding the failure codes back is the trick. "You started weak and used no numbers" gives the model a concrete correction, so attempt two usually lands. Cap the tries so a stubborn task can't loop forever and burn money, then return the best you got and flag it.

## Why empty input matters most

The empty case is the one that crashes tools in the wild: a blank line in the input file, a task that's only whitespace. If \`validate\` didn't check it first, \`text.split()\` returns \`[]\`, "no number" fires, and you'd retry forever on a bullet that can never be filled. Handling empty up front turns a crash-or-loop into a clean, honest "EMPTY, skip this one."

## The mental model

The validator is the bouncer at the door. It checks every rule and either waves the bullet through or hands back the exact list of reasons it's turned away. Below you'll build \`validate\` end to end.`,
    animated_diagrams: [
      {
        title: "Validate, then retry with the reason",
        caption: "One validator collects every problem; failures feed back into a sharper retry.",
        loop: true,
        nodes: [
          { label: "Bullet", sub: "cleaned reply", detail: "The bullet after cleanup, ready to be judged against all the rules." },
          { label: "Empty?", sub: "short-circuit", detail: "If it's empty, return ['EMPTY'] alone; the other checks would just add noise." },
          { label: "Run all checks", sub: "WEAK / NONUM / LONG", detail: "Collect every failing rule into one list in a fixed order." },
          { label: "Problems?", sub: "list vs empty", detail: "Empty list means it passed and you return the bullet." },
          { label: "Retry with why", sub: "feed back codes", detail: "Tell the model exactly what failed and call again, capped so it can't loop forever." },
        ],
      },
    ],
    key_terms: [
      { term: "Validator", definition: "One function that checks every rule and returns the list of what's wrong (empty means passed)." },
      { term: "Short-circuit", definition: "Returning early on a decisive case (empty input) so later checks never run." },
      { term: "Retry with feedback", definition: "Re-calling the model with the failure reasons attached so attempt two is better than a blind redo." },
    ],
    step_throughs: [
      {
        title: "validate('Responsible for the office supplies', ['responsible for'], 8)",
        steps: [
          { label: "strip", detail: "Text is non-empty, so we skip the EMPTY short-circuit.", code: "text = 'Responsible for the office supplies'" },
          { label: "WEAK?", detail: "Lowercased, it startswith 'responsible for', so append WEAK.", code: "problems = ['WEAK']" },
          { label: "NONUM?", detail: "No digit anywhere, so append NONUM.", code: "problems = ['WEAK','NONUM']" },
          { label: "LONG?", detail: "Five words, under the cap of 8, so nothing added.", code: "return ['WEAK','NONUM']" },
        ],
      },
    ],
    inline_quizzes: [
      { question: "Why does the EMPTY check return early instead of joining the other codes?", options: ["Empty text is faster to check", "An empty bullet isn't weak or long, it's nothing, so the other codes would just be noise", "The API needs EMPTY first", "It saves memory"], correct_index: 1, explanation: "Empty short-circuits: it's the one decisive case, and every other check would add meaningless codes." },
    ],
    starter_code: `# One validator that checks all the bullet rules at once.

def validate(bullet, weak_openers, max_words):
    text = bullet.strip()
    # TODO: if text is empty, return ["EMPTY"] (and nothing else)
    # TODO: build a list of problem codes in this order:
    #       "WEAK"  if it starts with a weak opener (case-insensitive)
    #       "NONUM" if it has no digit
    #       "LONG"  if it has more than max_words words
    # TODO: return the list (empty list means it passed)
    pass

weak = ["responsible for", "helped"]
print(validate("Responsible for the office supplies", weak, 8))
print(validate("Increased revenue 20% in Q3", weak, 8))
print(validate("   ", weak, 8))
`,
    solution_code: `# One validator that checks all the bullet rules at once.

def validate(bullet, weak_openers, max_words):
    text = bullet.strip()
    if text == "":
        return ["EMPTY"]
    problems = []
    low = text.lower()
    if any(low.startswith(op) for op in weak_openers):
        problems.append("WEAK")
    if not any(ch.isdigit() for ch in text):
        problems.append("NONUM")
    if len(text.split()) > max_words:
        problems.append("LONG")
    return problems

weak = ["responsible for", "helped"]
print(validate("Responsible for the office supplies", weak, 8))
print(validate("Increased revenue 20% in Q3", weak, 8))
print(validate("   ", weak, 8))
`,
    hints: [
      "Check empty FIRST and return ['EMPTY'] immediately; the other checks would be meaningless.",
      "Append codes in a fixed order (WEAK, NONUM, LONG) so results are predictable.",
      "An empty list of problems is your 'passed' signal.",
    ],
    challenge_title: "The Bullet Validator",
    challenge_description: "Run all rules against one bullet and print PASS or the failure codes in order (EMPTY short-circuits).",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    w = int(data[1])
    weak = [data[2 + i].strip().lower() for i in range(w)]
    bi = 2 + w
    bullet = data[bi] if len(data) > bi else ""
    # TODO: text = bullet.strip(); if empty print "EMPTY" and return.
    # TODO: collect codes in order: WEAK, NONUM, LONG.
    # TODO: print "PASS" if none, else the codes space-separated.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    m = int(data[0])
    w = int(data[1])
    weak = [data[2 + i].strip().lower() for i in range(w)]
    bi = 2 + w
    bullet = data[bi] if len(data) > bi else ""

    text = bullet.strip()
    if text == "":
        print("EMPTY")
        return

    codes = []
    low = text.lower()
    if any(low.startswith(op) for op in weak):
        codes.append("WEAK")
    if not any(ch.isdigit() for ch in text):
        codes.append("NONUM")
    if len(text.split()) > m:
        codes.append("LONG")

    print(" ".join(codes) if codes else "PASS")

main()
`,
    challenge_test_cases: [
      { input: "8\n1\nresponsible for\nResponsible for the office supplies", expected_output: "WEAK NONUM", description: "Weak opener and no number." },
      { input: "8\n1\nresponsible for\nIncreased revenue 20% in Q3", expected_output: "PASS", description: "Strong, quantified, short enough." },
      { input: "4\n1\nhelped\nBuilt a fast reliable scalable analytics pipeline", expected_output: "NONUM LONG", description: "No number and over the word cap." },
      { input: "8\n1\nhelped\n   ", expected_output: "EMPTY", description: "Whitespace-only input short-circuits to EMPTY." },
    ],
  },

  {
    id: "prod-04-7",
    project_id: "prod-04",
    order: 7,
    title: "Batch and Budget",
    concept: "batching, dedup, and cost",
    explanation: `Nobody rewrites one bullet. You paste in a whole job's worth of tasks, fifteen or twenty lines, usually with duplicates and blanks mixed in. This lesson turns your single-bullet tool into a **batch** tool that dedupes the input and estimates what the run will cost, so a big paste doesn't quietly become a big bill.

## Deduplicate before you spend

Every rewrite is an API call, and every call costs tokens. If your input has "Managed staff" three times (people repeat themselves), rewriting it three times is wasted money. Dedupe first, keeping the first occurrence and matching case-insensitively so "Managed staff" and "managed staff" collapse into one:

\`\`\`python
def dedupe(tasks):
    seen = set()
    unique = []
    for t in tasks:
        key = t.strip().lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(t.strip())
    return unique
\`\`\`

The \`seen\` set holds the lowercased keys; \`unique\` keeps the original text of the first time each appeared. Blank lines drop out for free because \`if key\` is False for an empty string.

## Estimate the cost before you run

Before firing off twenty calls, estimate the tokens. The rule of thumb is about four characters per token, so a whole batch's input cost is a sum of \`len(task) // 4\`:

\`\`\`python
def estimate_tokens(tasks):
    return sum(max(1, len(t) // 4) for t in tasks)
\`\`\`

This is deliberately rough (it ignores the system prompt and the output tokens), but it answers the one question that matters at this stage: is this a 200-token run or a 20,000-token run? A quick estimate lets your tool print "About N tokens, continue?" before spending anything, which is the difference between a tool people trust and one they're afraid to paste into.

## Why this is the "harden" step

A demo rewrites the one bullet you tested. A real tool survives the messy input people actually give it: duplicates, blank lines, a paste of thirty tasks. Deduping and cost-estimating aren't glamorous, but they stop your tool from doing redundant work and handing someone a surprise bill. The guards are cheap and the payoff is large.

## The mental model

Think of the batch as a shopping cart. Before checkout you pull out the duplicate items and glance at the total. Dedupe trims the cart, and the token estimate is the price tag you read before you swipe. Below you'll build both and produce a batch report.`,
    animated_diagrams: [
      {
        title: "Trim the cart, then read the price",
        caption: "Dedupe drops repeated work; the token estimate tells you the bill before you spend.",
        loop: false,
        nodes: [
          { label: "Raw tasks", sub: "messy paste", detail: "Fifteen or twenty lines with duplicates and blanks mixed in." },
          { label: "Dedupe", sub: "case-insensitive", detail: "Keep the first of each task; 'Managed staff' and 'managed staff' collapse into one." },
          { label: "Drop blanks", sub: "for free", detail: "An empty stripped key is falsy, so blank lines fall out without extra code." },
          { label: "Estimate tokens", sub: "~4 chars each", detail: "Sum max(1, len(task) // 4) over the unique tasks for a rough cost." },
          { label: "Report", sub: "count + cost", detail: "Print 'N unique, about T tokens, continue?' before any call fires." },
        ],
      },
    ],
    key_terms: [
      { term: "Deduplicate", definition: "Remove repeated inputs so you don't pay to rewrite the same task twice." },
      { term: "Token estimate", definition: "A rough character-based guess of cost, about one token per four characters." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "process_batch(['Managed staff', 'managed staff', 'Led sales', '  '])",
        steps: [
          "'Managed staff' -> key 'managed staff', new, keep it.",
          "'managed staff' -> same key, already seen, skip.",
          "'Led sales' -> key 'led sales', new, keep it.",
          "'  ' -> empty key, falsy, skip.",
          "Tokens: max(1, 13//4)=3 for 'Managed staff' plus max(1, 9//4)=2 for 'Led sales'.",
        ],
        output: "unique = ['Managed staff', 'Led sales'], total = 5 tokens",
      },
    ],
    inline_quizzes: [
      { question: "Why dedupe before calling the model instead of after?", options: ["The output looks nicer", "Every rewrite is a paid call, so rewriting the same task three times wastes money", "The model rejects duplicates", "It changes the token math"], correct_index: 1, explanation: "Deduping first means you never spend tokens rewriting an input you already handled." },
    ],
    starter_code: `# Dedupe a batch of tasks (case-insensitive) and estimate token cost.

def process_batch(tasks):
    seen = set()
    unique = []
    # TODO: keep the first occurrence of each task (compare .strip().lower()),
    #       skipping blanks; store the stripped original text in 'unique'
    total = 0
    # TODO: sum max(1, len(t) // 4) over the unique tasks into 'total'
    return unique, total

tasks = ["Managed staff", "managed staff", "Led sales", "  "]
unique, total = process_batch(tasks)
print("Unique:", len(unique))
print("Tokens:", total)
`,
    solution_code: `# Dedupe a batch of tasks (case-insensitive) and estimate token cost.

def process_batch(tasks):
    seen = set()
    unique = []
    for t in tasks:
        key = t.strip().lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(t.strip())
    total = sum(max(1, len(t) // 4) for t in unique)
    return unique, total

tasks = ["Managed staff", "managed staff", "Led sales", "  "]
unique, total = process_batch(tasks)
print("Unique:", len(unique))
for t in unique:
    print(" -", t, "(~" + str(max(1, len(t) // 4)) + " tokens)")
print("Tokens:", total)
`,
    hints: [
      "Use a set of lowercased keys to detect duplicates, and a list to keep first-seen originals.",
      "An empty stripped string is falsy, so 'if key and key not in seen' skips blanks automatically.",
      "Token estimate per task is max(1, len(task) // 4); sum it over the unique tasks.",
    ],
    challenge_title: "Batch Cost Report",
    challenge_description: "Dedupe a batch of tasks case-insensitively, then report the unique count and the estimated token cost.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    tasks = [data[1 + i] for i in range(n)]
    # TODO: dedupe case-insensitively, keeping the first occurrence's text.
    # TODO: token cost per unique task = max(1, len(task) // 4).
    # TODO: print "Unique: <count>" then "Tokens: <total>".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    tasks = [data[1 + i] for i in range(n)]

    seen = set()
    unique = []
    for t in tasks:
        key = t.strip().lower()
        if key not in seen:
            seen.add(key)
            unique.append(t)

    total = sum(max(1, len(t) // 4) for t in unique)
    print(f"Unique: {len(unique)}")
    print(f"Tokens: {total}")

main()
`,
    challenge_test_cases: [
      { input: "3\nManaged staff\nmanaged staff\nLed sales", expected_output: "Unique: 2\nTokens: 5", description: "Case-insensitive duplicate collapses; tokens 3 + 2." },
      { input: "2\nBuilt the API\nBuilt the API", expected_output: "Unique: 1\nTokens: 3", description: "Exact duplicate removed." },
      { input: "1\nx", expected_output: "Unique: 1\nTokens: 1", description: "Tiny task still costs at least one token." },
    ],
  },

  {
    id: "prod-04-8",
    project_id: "prod-04",
    order: 8,
    title: "Ship the Booster",
    concept: "assembling and shipping",
    explanation: `Every piece exists now: the rewrite prompt, the cleanup, the verb check, the number check, the length cap, the validator with retries, and batch handling with a cost estimate. Shipping is wiring them into one command and running it on a real list. When you finish, this build lands in your **Portfolio**.

## The whole pipeline, one function

Shipping isn't new code, it's the assembly. Read tasks, dedupe, rewrite each with retries, validate, and print a clean resume section:

\`\`\`python
def boost(tasks):
    unique = dedupe(tasks)
    print(f"Rewriting {len(unique)} tasks (~{estimate_tokens(unique)} tokens)...")
    bullets = []
    for task in unique:
        bullet = rewrite_valid(task)
        problems = validate(bullet, WEAK_OPENERS, MAX_WORDS)
        if problems:
            print(f"  [check] {task}: {', '.join(problems)}")
        bullets.append(bullet)
    print("\\nYOUR RESUME BULLETS")
    for b in bullets:
        print("- " + b)
    return bullets
\`\`\`

Read it top to bottom and the loop from lesson 1 of the whole track is right there: input (tasks), prompt and call (rewrite), parse (clean), verify (validate), ship (print). Every project in this track is that same skeleton with a different middle.

## What "done" means here

Shipped doesn't mean deployed to the cloud. It means:

1. It runs from a clean start on a whole list, not just your one test task.
2. It handles the messy input, blanks, duplicates, a bullet that fails validation, without crashing.
3. Someone else could paste their tasks in and get usable bullets from your instructions alone.

If those three hold, it's a real deliverable, not a demo.

## It lands in your Portfolio

Finishing this final lesson records the build in your **Portfolio** tab: the title, what it does, and that you built it. That shelf of finished tools (your summarizer, your chatbot, this bullet booster) is the actual point of the track. Keep a one-line description and one example, a raw task in and a strong bullet out, so the entry proves it works.

## Ship it well

Two finishing touches make it read as done. Print the cost estimate before running so users aren't surprised, and flag any bullet that failed validation instead of hiding it. An honest "[check] add a number here" is worth more than a silently weak line. Below you'll assemble the final section: dedupe, drop blanks, and print the clean list.`,
    animated_diagrams: [
      {
        title: "The whole booster pipeline",
        caption: "Every lesson's piece lined up: the same input-to-ship loop under most AI tools.",
        loop: false,
        nodes: [
          { label: "Read tasks", sub: "input", detail: "Take the raw list of task descriptions the user pasted in." },
          { label: "Dedupe", sub: "trim + estimate", detail: "Drop duplicates and blanks, then estimate the token cost before spending." },
          { label: "Rewrite + retry", sub: "prompt & call", detail: "Rewrite each task, validating and re-asking with the reason when a bullet fails." },
          { label: "Validate", sub: "verify", detail: "Run the rules once more and flag any bullet that still needs a fix." },
          { label: "Print section", sub: "ship", detail: "Output a clean bullet list you can paste straight into a resume." },
        ],
      },
    ],
    key_terms: [
      { term: "Pipeline", definition: "The assembled stages, input to ship, that every project in this track shares." },
      { term: "Deliverable", definition: "A tool someone else can run from your instructions alone, not just a one-off demo." },
    ],
    participation_activities: [
      {
        activity_title: "Is it really shipped?",
        questions: [
          { type: "true_false", question: "\"Shipped\" here means the tool is deployed to the cloud.", correct_answer: "false", explanation: "Shipped means it runs from a clean start on a whole list, survives messy input, and someone else could use it from your instructions." },
          { type: "true_false", question: "A bullet that fails validation should be flagged rather than hidden.", correct_answer: "true", explanation: "An honest '[check] add a number here' is worth more than a silently weak line." },
          { type: "fill_in", question: "Finishing this lesson records the build in your ____ tab.", correct_answer: "portfolio", explanation: "The Portfolio tab is the shelf of finished tools that is the point of the track." },
        ],
      },
    ],
    inline_quizzes: [
      { question: "Which of these is NOT part of what 'done' means for this tool?", options: ["It runs on a whole list from a clean start", "It handles blanks and duplicates without crashing", "It is deployed to a production server", "Someone else could paste tasks and get usable bullets"], correct_index: 2, explanation: "Deployment isn't required; a real, runnable deliverable that survives messy input is the bar here." },
    ],
    starter_code: `# Ship: assemble a clean resume section from final bullets.
# Drop blanks, dedupe case-insensitively, print a numbered-free bullet list.

def assemble(bullets):
    seen = set()
    kept = []
    # TODO: for each bullet: strip it; skip if empty; skip if its lowercase
    #       was already seen; otherwise keep the stripped text
    return kept

raw = ["Led the team", "", "led the team", "Cut costs 10%"]
kept = assemble(raw)
for b in kept:
    print("- " + b)
print("Bullets:", len(kept))
`,
    solution_code: `# Ship: assemble a clean resume section from final bullets.
# Drop blanks, dedupe case-insensitively, print a clean bullet list.

def assemble(bullets):
    seen = set()
    kept = []
    for b in bullets:
        t = b.strip()
        if t == "":
            continue
        key = t.lower()
        if key in seen:
            continue
        seen.add(key)
        kept.append(t)
    return kept

raw = ["Led the team", "", "led the team", "Cut costs 10%"]
kept = assemble(raw)
print("YOUR RESUME BULLETS")
for b in kept:
    print("- " + b)
print("Bullets:", len(kept))
`,
    hints: [
      "Strip each bullet first; a stripped empty string means skip it.",
      "Track lowercased text in a set to drop case-insensitive duplicates.",
      "Keep the original stripped text (not the lowercase key) in your output list.",
    ],
    challenge_title: "Assemble the Resume Section",
    challenge_description: "Build the final bullet list: drop blank lines, remove case-insensitive duplicates, print each with a dash, then the count.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    raw = [data[1 + i] if 1 + i < len(data) else "" for i in range(n)]
    # TODO: drop blanks (after strip) and case-insensitive duplicates.
    # TODO: print each kept bullet as "- <bullet>", then "Bullets: <count>".

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().splitlines()
    n = int(data[0])
    raw = [data[1 + i] if 1 + i < len(data) else "" for i in range(n)]

    seen = set()
    kept = []
    for b in raw:
        t = b.strip()
        if t == "":
            continue
        key = t.lower()
        if key in seen:
            continue
        seen.add(key)
        kept.append(t)

    for b in kept:
        print("- " + b)
    print(f"Bullets: {len(kept)}")

main()
`,
    challenge_test_cases: [
      { input: "4\nLed the team\n\nled the team\nCut costs 10%", expected_output: "- Led the team\n- Cut costs 10%\nBullets: 2", description: "Blank dropped, case-insensitive duplicate removed." },
      { input: "2\nBuilt the app\nBuilt the app", expected_output: "- Built the app\nBullets: 1", description: "Exact duplicate collapses to one." },
      { input: "1\n   ", expected_output: "Bullets: 0", description: "Only a blank line; nothing kept." },
    ],
  },
];

export default { project, lessons };
