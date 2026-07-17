const project = {
  id: "prod-16",
  title: "Semantic Search Engine",
  description:
    "Build a search tool that finds results by meaning instead of matching keywords. By lesson 8 you have a working engine that embeds a corpus, ranks it by cosine similarity, and returns the top-k matches with their scores.",
  difficulty: "intermediate",
  category: "rag_search",
  estimated_time: 130,
  lessons_count: 8,
  tags: ["embeddings", "semantic-search", "cosine-similarity", "vector-search", "rag", "voyage-ai"],
  order: 116,
  cover_image: "",
  track: "ai",
  kind: "product",
};

const lessons = [
  {
    id: "prod-16-1",
    project_id: "prod-16",
    order: 1,
    title: "Search by Meaning, Not Keywords",
    concept: "embeddings and semantic search",
    explanation: `Over the next eight lessons you'll build a search tool that finds results by **meaning**, not by matching keywords. Search "puppy training tips" and it should still surface a document titled "how to teach your dog to sit," even though the two share almost no words. By the end you'll have a working engine you can point at any small dataset and query in plain English.

## Keyword search hits a wall

Classic search (grep, SQL \`LIKE\`, a plain search box) matches literal substrings. It can't tell that "car" and "automobile" mean roughly the same thing, or that "return policy" and "how do I send this back" are the same question. It's fast and simple, and it's blind to meaning.

## What an embedding is

An **embedding** is a list of floating-point numbers, produced by a model, that places the meaning of a piece of text at a point in space. Two texts with similar meaning get embeddings that land close together; two unrelated texts land far apart. A real embedding vector runs from a few hundred to over a thousand numbers long, but the intuition matches a 2D map: closeness in the vector space is closeness in meaning.

## Calling a real embeddings API

Claude's Messages API has no embeddings endpoint. Anthropic's documented recommendation for text embeddings is **Voyage AI**, an embeddings provider Anthropic partners with directly for this:

\`\`\`python
import os
import voyageai

vo = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])

texts = [
    "The cat sat on the mat.",
    "A feline rested on the rug.",
    "Stock prices fell sharply today.",
]

result = vo.embed(texts, model="voyage-3.5", input_type="document")
vectors = result.embeddings
print(len(vectors), len(vectors[0]))
\`\`\`

\`vo.embed\` sends a batch of texts and gets one vector back per text. The first two sentences are both about a cat resting somewhere, so they land close together. The third, about stock prices, lands far from both, even though it shares zero words with them.

## The mental model

Picture every document as a dot dropped onto a giant map where meaning, not geography, sets its position. A query is one more dot on that same map. Semantic search asks "which dots sit nearest my query's dot?" Every lesson from here answers that one question quickly and correctly: how texts get onto the map (embedding), how we measure "nearest" (similarity), and how we return only the closest few (top-k).

The rest of this lesson builds the smallest piece: a corpus that already carries its vectors, so you can see the shape of the data before computing anything.`,
    starter_code: `# A "corpus" is just a list of documents, each carrying its embedding vector.
# Real vectors come from an API call like vo.embed() (see the explanation
# above); here they are given to you directly so this runs offline.

corpus = [
    {"id": 1, "text": "The cat sat on the mat.", "vector": [0.9, 0.1, 0.0]},
    {"id": 2, "text": "A feline rested on the rug.", "vector": [0.85, 0.15, 0.05]},
    {"id": 3, "text": "Stock prices fell sharply today.", "vector": [0.05, 0.1, 0.9]},
]

# TODO: print the number of documents in the corpus.
# TODO: print the vector dimension (length) of the first document's vector.
# TODO: check that every document's vector has the same dimension; print True/False.
`,
    solution_code: `corpus = [
    {"id": 1, "text": "The cat sat on the mat.", "vector": [0.9, 0.1, 0.0]},
    {"id": 2, "text": "A feline rested on the rug.", "vector": [0.85, 0.15, 0.05]},
    {"id": 3, "text": "Stock prices fell sharply today.", "vector": [0.05, 0.1, 0.9]},
]

print("Documents:", len(corpus))

dim = len(corpus[0]["vector"])
print("Dimension:", dim)

same_dim = all(len(doc["vector"]) == dim for doc in corpus)
print("Consistent dimension:", same_dim)
`,
    hints: [
      "len(corpus) gives the document count; len(corpus[0][\"vector\"]) gives the dimension.",
      "Use all(...) with a generator expression to check every vector matches the first one's length.",
      "This lesson computes nothing about meaning yet. It confirms the data shape is sane before you embed a real corpus.",
    ],
    animated_diagrams: [
      {
        title: "The semantic search pipeline",
        caption: "Text becomes points on a map, and a query finds its nearest neighbors.",
        loop: false,
        nodes: [
          { label: "Documents", sub: "raw text", detail: "You start with a corpus: a plain list of documents you want to search." },
          { label: "Embed", sub: "text to vectors", detail: "An embedding model turns each document into a vector that places its meaning as a point in space." },
          { label: "Index", sub: "store vectors", detail: "Every document now carries its vector. That collection is your searchable index." },
          { label: "Query", sub: "embed the question", detail: "The search text gets embedded the same way and lands as one more point on the map." },
          { label: "Rank", sub: "nearest first", detail: "You measure which document points sit closest to the query and sort them best-first." },
          { label: "Top-k", sub: "best few", detail: "You return only the closest handful, each with a score showing how strong the match is." },
        ],
      },
    ],
    key_terms: [
      { term: "Embedding", definition: "A list of numbers from a model that places a piece of text at a point in meaning-space." },
      { term: "Semantic search", definition: "Finding results by meaning rather than by matching exact words." },
      { term: "Corpus", definition: "The full set of documents you want to search over." },
    ],
    inline_quizzes: [
      {
        question: "Why does keyword search miss that 'puppy training tips' relates to 'how to teach your dog to sit'?",
        options: [
          "The second phrase is too long to index",
          "The two phrases share almost no literal words, and keyword search only matches words",
          "Keyword search ignores punctuation",
          "The documents are in different languages",
        ],
        correct_index: 1,
        explanation: "Keyword search matches literal substrings. With almost no shared words, it never connects the two even though they mean the same thing.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Check yourself",
        questions: [
          { type: "true_false", question: "Two texts with similar meaning get embeddings that land close together.", correct_answer: "true", explanation: "That closeness in vector space is exactly what makes semantic search work." },
        ],
      },
    ],
    challenge_title: "Same Dimension or Bust",
    challenge_description:
      "Check that every vector in a corpus has the same dimension before you search it. A mismatched vector silently breaks every similarity score computed downstream.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    vectors = [list(map(float, data[1 + i].split())) for i in range(n)]

    # TODO: dim = the length of the first vector.
    # TODO: find the index of the first vector whose length differs from dim.
    # TODO: if none differ, print "OK" then dim.
    # TODO: otherwise print "MISMATCH" then the (0-based) index that differs.

main()
`,
    challenge_solution_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    vectors = [list(map(float, data[1 + i].split())) for i in range(n)]

    dim = len(vectors[0])
    mismatch_index = None
    for i, v in enumerate(vectors):
        if len(v) != dim:
            mismatch_index = i
            break

    if mismatch_index is None:
        print("OK")
        print(dim)
    else:
        print("MISMATCH")
        print(mismatch_index)

main()
`,
    challenge_test_cases: [
      {
        input: "3\n1 2 3\n4 5 6\n7 8 9",
        expected_output: "OK\n3",
        description: "All three vectors share dimension 3.",
      },
      {
        input: "3\n1 2 3\n4 5\n7 8 9",
        expected_output: "MISMATCH\n1",
        description: "The second vector (index 1) has dimension 2 instead of 3.",
      },
      {
        input: "1\n1 2 3 4",
        expected_output: "OK\n4",
        description: "Edge: a single vector is trivially consistent with itself.",
      },
      {
        input: "4\n1 2\n3 4\n5 6\n7 8 9",
        expected_output: "MISMATCH\n3",
        description: "The mismatch can appear at the very last vector.",
      },
    ],
  },

  {
    id: "prod-16-2",
    project_id: "prod-16",
    order: 2,
    title: "Turning Text into Vectors",
    concept: "batch embedding a corpus",
    explanation: `Lesson 1 handed you vectors. Now you produce them yourself, and the decision that matters is making **one batch call** instead of one call per document.

## Batching, not looping

A first attempt often embeds documents one at a time in a loop, calling the API once per document. That's slow, one network round trip per doc, and on most providers it costs more than sending them together. Collect every text you need embedded, then send them as a single batch request.

\`\`\`python
import voyageai

vo = voyageai.Client()

docs = [
    {"id": 1, "text": "Onboarding checklist for new hires."},
    {"id": 2, "text": "How to file an expense report."},
    {"id": 3, "text": "Quarterly earnings summary."},
]

texts = [d["text"] for d in docs]
result = vo.embed(texts, model="voyage-3.5", input_type="document")

for doc, vector in zip(docs, result.embeddings):
    doc["vector"] = vector

print(docs[0]["text"], "->", len(docs[0]["vector"]), "dims")
\`\`\`

One request in, one vector per text out, in the same order you sent them. That is the shape of an **index**: a corpus where every document now also carries its vector.

## Documents vs. queries

Notice the \`input_type="document"\` argument. Voyage's models embed documents and search queries slightly differently. Documents expect to be searched; queries expect to search. When you later embed the user's search text, you pass \`input_type="query"\` instead. Using the wrong one for a given side won't crash anything. It quietly makes your rankings worse, so get it right from the start.

## Why batching matters as the corpus grows

A batch call to an embeddings API caps how many texts (and total tokens) it accepts per request, and there's usually a per-minute rate limit on top. A 10,000-document corpus isn't one call. It's dozens of calls of a few hundred documents each. You'll build that chunking logic in a later lesson. The habit to form now: gather all the texts first, then embed them together, instead of interleaving embed calls with other work.

## The drill below

There's no network in this sandbox, so you'll build the same pipeline shape, collect texts, embed in one batch, attach vectors back to their documents, using a deterministic pure-Python stand-in for the real embed call. The stand-in turns each text into a 5-number vector by counting its vowels. It knows nothing about meaning, so it isn't a real embedding, but it lets you practice the batching pattern you'll reuse with a real API for the rest of this build.`,
    starter_code: `# Pure-Python stand-in for a real embeddings API call.
# It turns each text into a small vector by counting vowels, deterministic,
# so it's not a real embedding, but it lets us build and test the batching
# pipeline offline exactly the same shape as a real embed_fn.

VOWELS = "aeiou"

def toy_embed(texts):
    vectors = []
    for text in texts:
        lower = text.lower()
        vectors.append([lower.count(v) for v in VOWELS])
    return vectors

docs = [
    {"id": 1, "text": "Onboarding checklist for new hires."},
    {"id": 2, "text": "How to file an expense report."},
    {"id": 3, "text": "Quarterly earnings summary."},
]

def build_index(docs, embed_fn):
    # TODO: collect all texts from docs into one list.
    # TODO: embed them in ONE batch call to embed_fn.
    # TODO: return a new list of dicts, each with id, text, and vector.
    pass

index = build_index(docs, toy_embed)
print(len(index))
print(index[0]["vector"])
`,
    solution_code: `VOWELS = "aeiou"

def toy_embed(texts):
    vectors = []
    for text in texts:
        lower = text.lower()
        vectors.append([lower.count(v) for v in VOWELS])
    return vectors

docs = [
    {"id": 1, "text": "Onboarding checklist for new hires."},
    {"id": 2, "text": "How to file an expense report."},
    {"id": 3, "text": "Quarterly earnings summary."},
]

def build_index(docs, embed_fn):
    texts = [d["text"] for d in docs]
    vectors = embed_fn(texts)
    index = []
    for doc, vector in zip(docs, vectors):
        index.append({"id": doc["id"], "text": doc["text"], "vector": vector})
    return index

index = build_index(docs, toy_embed)
print(len(index))
for entry in index:
    print(entry["id"], entry["vector"])
`,
    hints: [
      "Build the full texts list first (a list comprehension over docs), then call embed_fn ONCE on that whole list.",
      "zip(docs, vectors) pairs each original document with its vector in the same order.",
      "build_index calls embed_fn exactly once no matter how many documents there are.",
    ],
    animated_diagrams: [
      {
        title: "Building the index in one batch",
        caption: "Gather every text first, embed them together, then attach each vector back to its document.",
        loop: false,
        nodes: [
          { label: "Collect", sub: "all texts", detail: "Pull the text out of every document into one list before you call the API." },
          { label: "One batch", sub: "single request", detail: "Send the whole list in a single embed call instead of one call per document." },
          { label: "Vectors", sub: "same order", detail: "The API returns one vector per text, in the same order you sent them." },
          { label: "Attach", sub: "zip back", detail: "Pair each document with its vector so the meaning travels with the text." },
          { label: "Index", sub: "ready to search", detail: "Every document now carries its vector. That is your index." },
        ],
      },
    ],
    key_terms: [
      { term: "Batch call", definition: "Sending many texts to the embeddings API in one request instead of one call each." },
      { term: "Index", definition: "A corpus where every document also carries its embedding vector." },
      { term: "input_type", definition: "A flag telling the model whether it is embedding a document to be searched or a query doing the searching." },
    ],
    inline_quizzes: [
      {
        question: "Why embed a corpus in one batch call instead of looping one call per document?",
        options: [
          "Looping changes the vectors' meaning",
          "One batch is fewer network round trips and usually cheaper than one call per document",
          "The API rejects single-document calls",
          "Batching sorts the documents for you",
        ],
        correct_index: 1,
        explanation: "Each call is a network round trip and often priced per request, so one batch beats a loop on both speed and cost.",
      },
    ],
    callouts: [
      { type: "warning", position: "after", title: "Match input_type to the side", content: "Embed documents with input_type document and queries with input_type query. Using the wrong one will not crash. It quietly makes your rankings worse." },
    ],
    challenge_title: "Batch-Embed the Corpus",
    challenge_description:
      "Embed a corpus in one batch pass with a deterministic vowel-count embedding, then report the index size and each document's vector.",
    challenge_language: "python",
    challenge_starter_code: `import sys

VOWELS = "aeiou"

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    texts = [data[1 + i] for i in range(n)]

    # TODO: embed all texts in one batch (vowel counts a,e,i,o,u), producing
    #       one 5-number vector per text, in the same order as texts.
    # TODO: print n, then each vector as 5 space-separated counts.

main()
`,
    challenge_solution_code: `import sys

VOWELS = "aeiou"

def embed(texts):
    vectors = []
    for text in texts:
        lower = text.lower()
        vectors.append([lower.count(v) for v in VOWELS])
    return vectors

def main():
    data = sys.stdin.read().split("\\n")
    n = int(data[0])
    texts = [data[1 + i] for i in range(n)]

    vectors = embed(texts)

    print(n)
    for vector in vectors:
        print(" ".join(map(str, vector)))

main()
`,
    challenge_test_cases: [
      {
        input: "3\nHello World\nData Science\nPython",
        expected_output: "3\n0 1 0 2 0\n2 2 1 0 0\n0 0 0 1 0",
        description: "'Hello World' has 1 e and 2 o's; 'Data Science' has 2 a's, 2 e's, 1 i; 'Python' has 1 o.",
      },
      {
        input: "1\nAEIOU",
        expected_output: "1\n1 1 1 1 1",
        description: "Case-insensitive: one of each vowel.",
      },
      {
        input: "2\nbcdfg\naaa",
        expected_output: "2\n0 0 0 0 0\n3 0 0 0 0",
        description: "Edge: a text with zero vowels produces the zero vector.",
      },
    ],
  },

  {
    id: "prod-16-3",
    project_id: "prod-16",
    order: 3,
    title: "Measuring Similarity with Cosine",
    concept: "cosine similarity",
    explanation: `You have vectors. The next question: given a query vector, how "close" is it to a document's vector? For embeddings the standard answer is **cosine similarity**.

## Why not just measure distance?

The obvious first move is straight-line distance between two vectors. Embedding vectors vary in length (magnitude) for reasons that have nothing to do with meaning. A longer document sometimes produces a vector with larger magnitude than a short one, purely as an artifact of the model. Measure raw distance and a long document about the exact right topic can score worse than a short, only vaguely related one, just because of its magnitude.

## What cosine similarity measures instead

Cosine similarity ignores magnitude and measures the **angle** between two vectors. Two vectors pointing the same direction score 1.0, no matter how long either one is. Perpendicular vectors score 0.0. Opposite directions score -1.0. Because only direction counts, doubling a vector's length leaves its similarity to everything unchanged, which is what you want when comparing meaning across documents of different lengths.

## The formula

\`\`\`python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)
\`\`\`

- **Dot product** (\`dot\`): multiply matching positions and sum them. It's large when two vectors point the same way and both have big numbers in the same spots.
- **Norm** (\`norm_a\`, \`norm_b\`): each vector's own magnitude, its length if you drew it as an arrow from the origin.
- **Dividing by both norms** is exactly what cancels out magnitude, leaving only the angle.

## Using it on real embeddings

\`\`\`python
query_vector = vo.embed([user_query], model="voyage-3.5", input_type="query").embeddings[0]

for doc in index:
    score = cosine_similarity(query_vector, doc["vector"])
    print(doc["text"], round(score, 3))
\`\`\`

Real embeddings from Voyage are already close to unit length, so in practice scores land somewhere between about 0.0 and 1.0. Genuinely relevant matches often score 0.7 or higher; unrelated text scores closer to 0.2-0.4. Those numbers aren't universal thresholds, they shift by model, but the ordering (which document scores highest) is what your search depends on.

## The mental model

Cosine similarity asks "are these two arrows pointing the same way?", not "are these two arrows the same length?" That is the question you want when the arrows represent meaning, and it's the one function every later lesson builds on.`,
    starter_code: `import math

def cosine_similarity(a, b):
    # TODO: dot product of a and b (sum of element-wise products).
    # TODO: norm_a = euclidean magnitude of a; norm_b = euclidean magnitude of b.
    # TODO: return dot / (norm_a * norm_b).
    pass

v1 = [1, 0, 1]
v2 = [1, 1, 0]
v3 = [2, 0, 2]

print(round(cosine_similarity(v1, v2), 4))
print(round(cosine_similarity(v1, v3), 4))
`,
    solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b)

v1 = [1, 0, 1]
v2 = [1, 1, 0]
v3 = [2, 0, 2]

print(round(cosine_similarity(v1, v2), 4))
print(round(cosine_similarity(v1, v3), 4))
`,
    hints: [
      "sum(x * y for x, y in zip(a, b)) is the dot product in one line.",
      "math.sqrt(sum(x * x for x in a)) is the norm (magnitude) of a.",
      "v3 is v1 scaled by 2, same direction, so its similarity to v1 comes out to exactly 1.0.",
    ],
    animated_diagrams: [
      {
        title: "Computing cosine similarity",
        caption: "Line up the vectors, measure each one's length, then divide out the length to leave only the angle.",
        loop: false,
        nodes: [
          { label: "Dot product", sub: "align them", detail: "Multiply matching positions and sum. This is large when the vectors point the same way." },
          { label: "Norm A", sub: "length of a", detail: "Take the square root of the sum of squares of the first vector." },
          { label: "Norm B", sub: "length of b", detail: "Do the same for the second vector to get its magnitude." },
          { label: "Divide", sub: "cancel length", detail: "Divide the dot product by both norms. This removes magnitude and leaves only direction." },
          { label: "Score", sub: "the angle", detail: "You get a number from -1 to 1: 1 means same direction, 0 means perpendicular." },
        ],
      },
    ],
    key_terms: [
      { term: "Cosine similarity", definition: "A score from -1 to 1 measuring the angle between two vectors, ignoring their length." },
      { term: "Dot product", definition: "The sum of the products of matching positions in two vectors." },
      { term: "Norm", definition: "A vector's length, the square root of the sum of its squared components." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "cosine_similarity([1, 0, 1], [1, 1, 0])",
        steps: [
          "Dot product: 1*1 + 0*1 + 1*0 = 1.",
          "Norm of the first vector: sqrt(1 + 0 + 1) = sqrt(2), about 1.414.",
          "Norm of the second vector: sqrt(1 + 1 + 0) = sqrt(2), about 1.414.",
          "Divide the dot product by both norms: 1 / (1.414 * 1.414) = 1 / 2.",
        ],
        output: "0.5",
      },
    ],
    inline_quizzes: [
      {
        question: "What does cosine similarity actually measure between two vectors?",
        options: [
          "The straight-line distance between their tips",
          "The angle between them, ignoring how long each one is",
          "The number of positions where they share a value",
          "The sum of their lengths",
        ],
        correct_index: 1,
        explanation: "Dividing by both norms cancels magnitude, so only direction (the angle) is left. Doubling a vector's length leaves its cosine score unchanged.",
      },
    ],
    challenge_title: "Cosine Similarity from Scratch",
    challenge_description:
      "Compute the cosine similarity between two integer vectors read from stdin, guarding against a zero vector so you never divide by zero.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def main():
    lines = sys.stdin.read().split("\\n")
    a = list(map(float, lines[0].split()))
    b = list(map(float, lines[1].split()))

    # TODO: compute norm_a and norm_b.
    # TODO: if either norm is 0, print "0.0000" and stop.
    # TODO: otherwise compute the dot product and the similarity,
    #       and print it formatted to 4 decimal places.

main()
`,
    challenge_solution_code: `import sys, math

def main():
    lines = sys.stdin.read().split("\\n")
    a = list(map(float, lines[0].split()))
    b = list(map(float, lines[1].split()))

    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))

    if norm_a == 0 or norm_b == 0:
        print("0.0000")
        return

    dot = sum(x * y for x, y in zip(a, b))
    sim = dot / (norm_a * norm_b)
    print(f"{sim:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "1 0 1\n1 1 0",
        expected_output: "0.5000",
        description: "Two vectors at 60 degrees from each other score 0.5.",
      },
      {
        input: "2 0 2\n1 0 1",
        expected_output: "1.0000",
        description: "Same direction, different magnitude, still scores a perfect 1.0.",
      },
      {
        input: "0 0 0\n1 2 3",
        expected_output: "0.0000",
        description: "Edge: a zero vector returns 0.0000 instead of raising a division error.",
      },
      {
        input: "1 0\n0 1",
        expected_output: "0.0000",
        description: "Perpendicular vectors are unrelated and score 0.0000.",
      },
    ],
  },

  {
    id: "prod-16-4",
    project_id: "prod-16",
    order: 4,
    title: "Ranking the Whole Corpus",
    concept: "scoring and ranking documents",
    explanation: `Cosine similarity scores one pair of vectors. A search engine scores a query against **every** document in the corpus, then orders them best-first. That's ranking.

## The ranking loop

\`\`\`python
def search(query_vector, index):
    scored = []
    for doc in index:
        score = cosine_similarity(query_vector, doc["vector"])
        scored.append((doc, score))
    scored.sort(key=lambda pair: pair[1], reverse=True)
    return scored

results = search(query_vector, index)
for doc, score in results:
    print(f"{score:.3f}  {doc['text']}")
\`\`\`

Score every document once, then sort. For a corpus of a few thousand documents this is fast: a handful of multiplications per document, no API call. The embedding call is the expensive part. Ranking is nearly free arithmetic.

## Ties need a rule

Two documents can score identically, especially with toy or small-dimension vectors, or when two entries are near-duplicates. Python's sort is stable, but "stable" only means ties keep whatever order they arrived in, which is an accident of how you built the corpus rather than a decision. Give the search engine an explicit, deterministic tie-break. The simplest is that the smaller document ID wins:

\`\`\`python
scored.sort(key=lambda pair: (-pair[1], pair[0]["id"]))
\`\`\`

Sorting by \`(-score, id)\` sorts descending by score first (the negative sign flips an ascending sort into descending), then ascending by ID among ties only. Two searches on the same corpus and query now return results in the exact same order every time, which matters for testing, caching, and not confusing a user who searches the same thing twice.

## Why you rank before you trim

You might want to stop as soon as you've found "enough good" documents, but you can't know a document is in the top 5 until you've compared it against everything else. Score first, sort second, then decide how many to keep (the next lesson). Stopping early produces wrong results the moment the corpus order changes.

## The mental model

Ranking turns a pile of independent similarity scores into one ordering, with ties broken the same way every time. It bridges "I can compare two vectors" (lesson 3) and "I can hand a user a numbered list of results" (the next two lessons).`,
    starter_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

index = [
    {"id": 1, "vector": [1, 0, 1]},
    {"id": 2, "vector": [0, 1, 0]},
    {"id": 3, "vector": [2, 0, 2]},
]
query = [1, 0, 1]

def rank_documents(query_vector, index):
    # TODO: score every document with cosine_similarity.
    # TODO: sort descending by score; break ties by the smaller id first.
    # TODO: return a list of (id, score) tuples in ranked order.
    pass

ranked = rank_documents(query, index)
for doc_id, score in ranked:
    print(doc_id, round(score, 4))
`,
    solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

index = [
    {"id": 1, "vector": [1, 0, 1]},
    {"id": 2, "vector": [0, 1, 0]},
    {"id": 3, "vector": [2, 0, 2]},
]
query = [1, 0, 1]

def rank_documents(query_vector, index):
    scored = [(doc["id"], cosine_similarity(query_vector, doc["vector"])) for doc in index]
    scored.sort(key=lambda pair: (-pair[1], pair[0]))
    return scored

ranked = rank_documents(query, index)
for doc_id, score in ranked:
    print(doc_id, round(score, 4))
`,
    hints: [
      "Build the scored list first with a list comprehension over index, then sort it once.",
      "Sort key (-score, id) sorts by score descending and breaks ties by id ascending in one pass.",
      "Documents 1 and 3 point the same direction as the query, so they should tie at the top.",
    ],
    animated_diagrams: [
      {
        title: "From scores to a ranking",
        caption: "Score every document, collect the pairs, then sort best-first with a fixed tie-break.",
        loop: false,
        nodes: [
          { label: "Score each", sub: "one per doc", detail: "Run cosine similarity between the query and every document in the corpus." },
          { label: "Collect", sub: "(doc, score)", detail: "Gather every document with its score into one list of pairs." },
          { label: "Sort", sub: "highest first", detail: "Order the pairs by score descending so the best matches rise to the top." },
          { label: "Tie-break", sub: "smaller id wins", detail: "When two scores are equal, the smaller document id comes first, so results are deterministic." },
          { label: "Ranked list", sub: "ordered output", detail: "You now have one stable ordering the next lesson can trim to top-k." },
        ],
      },
    ],
    key_terms: [
      { term: "Ranking", definition: "Turning per-document similarity scores into one best-first ordering." },
      { term: "Tie-break", definition: "A fixed rule that decides order when two documents score the same." },
      { term: "Stable sort", definition: "A sort that keeps equal items in their original relative order." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "Rank three docs by the key (-score, id): doc 1 scores 1.0, doc 3 scores 1.0, doc 2 scores 0.0.",
        steps: [
          "Build each key: doc 1 -> (-1.0, 1), doc 3 -> (-1.0, 3), doc 2 -> (0.0, 2).",
          "Sort by the first value: -1.0 sorts before 0.0, so docs 1 and 3 land ahead of doc 2.",
          "Docs 1 and 3 tie on -1.0, so the second value breaks it: id 1 before id 3.",
        ],
        output: "doc 1, doc 3, doc 2",
      },
    ],
    inline_quizzes: [
      {
        question: "Why score and sort the whole corpus before trimming to the top few?",
        options: [
          "Sorting is faster than scoring",
          "You cannot know a document is in the top few until you have compared it against everything else",
          "Trimming first saves an API call",
          "The embedding model requires it",
        ],
        correct_index: 1,
        explanation: "A document's rank depends on every other document's score. Stop early and you get wrong results the moment the corpus order changes.",
      },
    ],
    challenge_title: "Rank the Corpus",
    challenge_description:
      "Score every document in a corpus against a query vector with cosine similarity, then rank them highest-first, breaking ties by the smaller document id.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    # TODO: score every doc against query with cosine_similarity.
    # TODO: sort descending by score, tie-break by ascending id.
    # TODO: print "id score" (score as %.4f) for every doc, one per line.

main()
`,
    challenge_solution_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    scored = [(doc_id, cosine_similarity(query, vector)) for doc_id, vector in docs]
    scored.sort(key=lambda pair: (-pair[1], pair[0]))

    for doc_id, score in scored:
        print(doc_id, f"{score:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "3 3\n1 1 0 1\n2 0 1 0\n3 2 0 2\n1 0 1",
        expected_output: "1 1.0000\n3 1.0000\n2 0.0000",
        description: "Docs 1 and 3 point the same direction as the query and tie at 1.0; doc 2 is perpendicular and scores 0.",
      },
      {
        input: "2 2\n1 0 0\n2 1 1\n1 1",
        expected_output: "2 1.0000\n1 0.0000",
        description: "Doc 1 is the zero vector and scores 0; doc 2 matches the query direction exactly.",
      },
      {
        input: "3 2\n5 1 1\n2 1 1\n9 1 1\n1 1",
        expected_output: "2 1.0000\n5 1.0000\n9 1.0000",
        description: "Edge: all three docs tie at 1.0, so ascending id order (2, 5, 9) decides the ranking.",
      },
    ],
  },

  {
    id: "prod-16-5",
    project_id: "prod-16",
    order: 5,
    title: "Returning Top-K with Scores",
    concept: "top-k selection and result formatting",
    explanation: `A ranked list of every document isn't a search result. It's a wall of text. Real search returns the best few matches, the **top-k**, each with a score so the caller can judge how confident the match is.

## Slicing off the top

Once \`rank_documents\` has produced a fully sorted list, the top-k is a slice:

\`\`\`python
def top_k(ranked, k):
    k = min(k, len(ranked))
    return ranked[:k]
\`\`\`

The \`min(k, len(ranked))\` guard matters. If a caller asks for the top 10 results from a 3-document corpus, you don't want an index error or a list padded with missing entries. You want all 3 documents. Clamping k to the corpus size does that.

## Putting the full pipeline together

\`\`\`python
def semantic_search(query_text, index, k=5):
    query_vector = vo.embed(
        [query_text], model="voyage-3.5", input_type="query"
    ).embeddings[0]

    ranked = rank_documents(query_vector, index)
    top = top_k(ranked, k)

    return [
        {"id": doc_id, "score": round(score, 4)}
        for doc_id, score in top
    ]
\`\`\`

This is the shape of a real semantic search function: embed the query, score and rank the whole corpus, slice to the requested size, and hand back something a caller (a UI, an API response, another program) can consume directly. The query gets embedded once per search regardless of \`k\` or corpus size, so a search costs one embedding call plus cheap arithmetic.

## Why return the score at all

A bare list of matching documents throws away useful information. A score of 0.91 means "this is almost certainly what the user meant." A score of 0.31 on the last item in a top-5 list means "weak match, included only because the other four ranked higher," and it might not be relevant at all. Returning scores lets the caller decide whether to trust a result, show a "did you mean" fallback, or apply its own cutoff.

## The mental model

Top-k is a promise: here are the k most relevant documents, ranked, with a number showing how relevant each one is. Everything upstream (embedding, scoring, sorting) makes that promise trustworthy. The next two lessons keep it holding when the input is messy.`,
    starter_code: `def top_k(ranked, k):
    # TODO: clamp k to len(ranked) so asking for more than exists is safe.
    # TODO: return the first k entries of ranked.
    pass

ranked = [(1, 0.92), (3, 0.81), (2, 0.40), (4, 0.10)]

print(top_k(ranked, 2))
print(top_k(ranked, 10))
`,
    solution_code: `def top_k(ranked, k):
    k = min(k, len(ranked))
    return ranked[:k]

ranked = [(1, 0.92), (3, 0.81), (2, 0.40), (4, 0.10)]

print(top_k(ranked, 2))
print(top_k(ranked, 10))
`,
    hints: [
      "k = min(k, len(ranked)) is the whole guard, apply it before slicing.",
      "ranked[:k] returns the first k items of an already-sorted list.",
      "Asking for more results than exist should return everything, not raise an error or pad the list.",
    ],
    animated_diagrams: [
      {
        title: "One search, end to end",
        caption: "Embed the query once, rank the corpus, then hand back only the best k with their scores.",
        loop: false,
        nodes: [
          { label: "Embed query", sub: "one call", detail: "The search text becomes a vector with a single embedding call, whatever k or corpus size is." },
          { label: "Rank", sub: "score + sort", detail: "Score the query against every document and sort them best-first." },
          { label: "Clamp k", sub: "min(k, size)", detail: "Shrink k to the corpus size so asking for more results than exist is safe." },
          { label: "Slice", sub: "top k", detail: "Take the first k entries off the sorted list." },
          { label: "Return", sub: "id + score", detail: "Hand back each result with its score so the caller can judge the match." },
        ],
      },
    ],
    key_terms: [
      { term: "Top-k", definition: "Keeping only the k highest-ranked results instead of the whole sorted list." },
      { term: "Clamping", definition: "Capping a value to a safe range, here shrinking k to the corpus size." },
    ],
    inline_quizzes: [
      {
        question: "What does k = min(k, len(ranked)) protect against?",
        options: [
          "Returning duplicate documents",
          "Asking for more results than the corpus holds, which would otherwise slice past the end",
          "A slow embedding call",
          "Ties between two documents",
        ],
        correct_index: 1,
        explanation: "If a caller asks for 10 results from a 3-document corpus, clamping k returns all 3 instead of erroring or padding.",
      },
    ],
    callouts: [
      { type: "insight", position: "after", title: "Return the score, not just the id", content: "A score of 0.91 says almost certainly right; a 0.31 on the last item says weak, included only because nothing better ranked. The score lets the caller apply its own cutoff." },
    ],
    challenge_title: "Top-K Search Results",
    challenge_description:
      "Given a corpus, a query vector, and k, run the full pipeline: score every document, rank them, then return only the top k results with their scores.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d, k = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    # TODO: score every doc, sort descending (tie-break ascending id),
    #       clamp k to n, print "id score" (%.4f) for the top k only.

main()
`,
    challenge_solution_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d, k = map(int, data[0].split())
    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        vector = list(map(float, parts[1:1 + d]))
        docs.append((doc_id, vector))
    query = list(map(float, data[1 + n].split()))

    scored = [(doc_id, cosine_similarity(query, vector)) for doc_id, vector in docs]
    scored.sort(key=lambda pair: (-pair[1], pair[0]))

    k = min(k, n)
    for doc_id, score in scored[:k]:
        print(doc_id, f"{score:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "4 2 2\n1 3 4\n2 4 3\n3 -3 -4\n4 0 0\n3 4",
        expected_output: "1 1.0000\n2 0.9600",
        description: "Top 2 of 4 docs: doc 1 matches the query exactly, doc 2 is a close second at 0.96.",
      },
      {
        input: "3 2 10\n1 1 0\n2 0 1\n3 1 1\n1 0",
        expected_output: "1 1.0000\n3 0.7071\n2 0.0000",
        description: "Asking for k=10 with only 3 docs returns all 3, clamped safely.",
      },
      {
        input: "2 2 1\n5 1 1\n2 2 2\n1 1",
        expected_output: "2 1.0000",
        description: "Edge: both docs tie at 1.0, but only the top 1 is requested, so the smaller id (2) wins.",
      },
    ],
  },

  {
    id: "prod-16-6",
    project_id: "prod-16",
    order: 6,
    title: "Handling Bad Vectors and Empty Results",
    concept: "edge cases: zero vectors, dimension mismatches, empty corpora",
    explanation: `Every piece works on clean input. Real corpora aren't clean. A document that failed to embed leaves a zero vector behind, a bug attaches a vector of the wrong length, or a search runs before the corpus has anything in it. This lesson hardens the pipeline against all three.

## Zero vectors

You already guard against this in \`cosine_similarity\` (lesson 3): if either vector's norm is 0, dividing would crash, so you return 0.0 instead. But *why* would a zero vector show up? Usually something upstream failed silently, an empty string got embedded, a placeholder document was never processed, or a bug zeroed out a field. Scoring it as 0.0 instead of crashing the search means one bad document doesn't take down every other result.

## Dimension mismatches

Every vector in an index should have the same length, the dimension your embedding model produces. When one doesn't, cosine similarity's \`zip(a, b)\` silently truncates to the shorter length and returns a meaningless number instead of raising an error. That's worse than a crash, because it looks like a valid result. Check the dimension *before* scoring and skip (or flag) anything that doesn't match:

\`\`\`python
def safe_rank(query_vector, index):
    if not index:
        return []

    scored = []
    for doc in index:
        if len(doc["vector"]) != len(query_vector):
            continue  # skip: this doc never got embedded correctly
        score = cosine_similarity(query_vector, doc["vector"])
        scored.append((doc["id"], score))

    scored.sort(key=lambda pair: (-pair[1], pair[0]))
    return scored
\`\`\`

## Empty corpora

If the index is empty there is nothing to rank, and the right answer is an empty list, not an error and not a crash on \`index[0]\` somewhere downstream. Check for it first, before touching anything else, so it short-circuits cleanly.

## Why this matters in production

A search engine that crashes on one malformed document, or silently returns garbage instead of skipping it, is worse than one that's a little slower. Real corpora get updated by many processes over time, and eventually something goes wrong with one document's embedding. You can't prevent that entirely. You can make one bad row degrade quietly instead of breaking search for everyone.

## The mental model

Treat every document's vector as untrusted until you've checked it. A dimension check and a zero-vector guard cost a few lines and turn "the whole search engine is down" into "one document was silently skipped." That's the difference between a bug report and an outage.`,
    starter_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def safe_rank(query_vector, index):
    # TODO: if index is empty, return [] immediately.
    # TODO: skip any doc whose vector length doesn't match query_vector's length.
    # TODO: score the rest with cosine_similarity, sort desc, tie-break by id.
    pass

index = [
    {"id": 1, "vector": [1, 0]},
    {"id": 2, "vector": [1, 0, 0]},  # wrong dimension, should be skipped
    {"id": 3, "vector": [0, 0]},     # zero vector, should score 0.0
]
query = [1, 0]

print(safe_rank(query, index))
print(safe_rank(query, []))
`,
    solution_code: `import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def safe_rank(query_vector, index):
    if not index:
        return []

    scored = []
    for doc in index:
        if len(doc["vector"]) != len(query_vector):
            continue
        score = cosine_similarity(query_vector, doc["vector"])
        scored.append((doc["id"], score))

    scored.sort(key=lambda pair: (-pair[1], pair[0]))
    return scored

index = [
    {"id": 1, "vector": [1, 0]},
    {"id": 2, "vector": [1, 0, 0]},
    {"id": 3, "vector": [0, 0]},
]
query = [1, 0]

print(safe_rank(query, index))
print(safe_rank(query, []))
`,
    hints: [
      "Check `if not index: return []` before anything else, so an empty corpus never reaches the scoring loop.",
      "`continue` inside the loop skips a mismatched document without stopping the whole function.",
      "The zero-vector guard already lives inside cosine_similarity, so a zero-vector doc still gets scored, just as 0.0.",
    ],
    animated_diagrams: [
      {
        title: "Hardened ranking",
        caption: "Each guard runs before the risky step it protects, so one bad document degrades quietly.",
        loop: false,
        nodes: [
          { label: "Empty?", sub: "no docs", detail: "If the index is empty, return an empty list immediately instead of touching index[0]." },
          { label: "Dim check", sub: "same length", detail: "Skip any document whose vector length does not match the query's, since zip would silently truncate." },
          { label: "Zero guard", sub: "norm is 0", detail: "A zero-vector document scores 0.0 instead of dividing by zero and crashing." },
          { label: "Score", sub: "safe now", detail: "Only clean, matching vectors reach cosine similarity." },
          { label: "Rank", sub: "best-first", detail: "Sort the survivors with the same deterministic tie-break as before." },
        ],
      },
    ],
    key_terms: [
      { term: "Zero vector", definition: "A vector of all zeros, usually left behind when something failed to embed." },
      { term: "Dimension mismatch", definition: "A vector whose length differs from the rest of the index, breaking similarity math." },
    ],
    inline_quizzes: [
      {
        question: "Why is a silent dimension mismatch worse than a crash?",
        options: [
          "It uses more memory",
          "zip truncates to the shorter vector and returns a plausible-looking but meaningless score",
          "It always returns zero",
          "It doubles the API cost",
        ],
        correct_index: 1,
        explanation: "A crash is loud and obvious. A truncated score looks like a real result, so the bug hides in your rankings instead of surfacing.",
      },
    ],
    callouts: [
      { type: "warning", position: "after", title: "Treat every vector as untrusted", content: "Corpora get updated by many processes over time, and eventually one document's embedding goes wrong. A few lines of guarding turn an outage into one silently skipped row." },
    ],
    challenge_title: "Search That Doesn't Crash",
    challenge_description:
      "Rank a corpus safely: skip any document whose vector dimension doesn't match the query, score zero vectors as 0.0 instead of crashing, and handle an empty corpus.",
    challenge_language: "python",
    challenge_starter_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())

    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        dim = int(parts[1])
        vector = list(map(float, parts[2:2 + dim]))
        docs.append((doc_id, vector))

    # TODO: if n == 0, print "EMPTY" and stop (don't try to read a query line).
    # TODO: otherwise read the query vector from the next line.
    # TODO: skip any doc whose vector length != d (the query's dimension).
    # TODO: score the rest with cosine_similarity, sort desc (tie-break asc id),
    #       print "id score" (%.4f) for each, one per line.

main()
`,
    challenge_solution_code: `import sys, math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def main():
    data = sys.stdin.read().split("\\n")
    n, d = map(int, data[0].split())

    docs = []
    for i in range(n):
        parts = data[1 + i].split()
        doc_id = int(parts[0])
        dim = int(parts[1])
        vector = list(map(float, parts[2:2 + dim]))
        docs.append((doc_id, vector))

    if n == 0:
        print("EMPTY")
        return

    query_line = data[1 + n] if len(data) > 1 + n else ""
    query = list(map(float, query_line.split()))

    scored = []
    for doc_id, vector in docs:
        if len(vector) != d:
            continue
        score = cosine_similarity(query, vector)
        scored.append((doc_id, score))

    scored.sort(key=lambda pair: (-pair[1], pair[0]))

    for doc_id, score in scored:
        print(doc_id, f"{score:.4f}")

main()
`,
    challenge_test_cases: [
      {
        input: "3 2\n1 2 1 0\n2 3 1 0 0\n3 2 0 0\n1 0",
        expected_output: "1 1.0000\n3 0.0000",
        description: "Doc 2 has dimension 3 instead of 2 and is skipped; doc 3 is a zero vector and scores 0.0 instead of crashing.",
      },
      {
        input: "0 2\n1 0",
        expected_output: "EMPTY",
        description: "Edge: an empty corpus returns EMPTY instead of erroring on a missing query.",
      },
      {
        input: "3 2\n7 2 0 0\n4 2 0 0\n9 2 2 2\n1 1",
        expected_output: "9 1.0000\n4 0.0000\n7 0.0000",
        description: "Two zero-vector docs tie at 0.0 and are ordered by ascending id (4 before 7) after the real match.",
      },
    ],
  },

  {
    id: "prod-16-7",
    project_id: "prod-16",
    order: 7,
    title: "Cost, Caching, and Batching at Scale",
    concept: "embedding cost, caching duplicates, batching large corpora",
    explanation: `Every embedding call costs tokens, and a real corpus doesn't sit still. Documents get added, edited, and re-indexed. This lesson is about not paying to embed the same text twice, and not sending a batch so large the API rejects it.

## Cache identical texts

Corpora repeat text. Two support articles share a boilerplate paragraph, or the same FAQ gets synced from two sources. Re-embedding both spends money and time on an identical result. A **cache** keyed by the exact text, in memory or in a small database, embeds each unique string once:

\`\`\`python
import voyageai

vo = voyageai.Client()

def embed_corpus(texts, cache, batch_size=128):
    to_embed = [t for t in texts if t not in cache]

    for i in range(0, len(to_embed), batch_size):
        batch = to_embed[i:i + batch_size]
        result = vo.embed(batch, model="voyage-3.5", input_type="document")
        for text, vector in zip(batch, result.embeddings):
            cache[text] = vector

    return [cache[t] for t in texts]
\`\`\`

Two things happen here. \`to_embed\` filters out anything already cached *before* any API call, and the loop below chunks whatever's left into fixed-size batches. Rebuild the same corpus a second time with this function and it makes zero API calls, since everything is already cached.

## Batching for API limits, not just cost

Embedding providers cap how many texts (and how many total tokens) one request can carry. A corpus of 10,000 unique documents isn't one call. It's however many batches of, say, 128 documents it takes to cover them: \`ceil(10000 / 128)\` = 79 calls. Chunking a list into fixed-size pieces is the same pattern whatever's inside it:

\`\`\`python
def batch(items, batch_size):
    return [items[i:i + batch_size] for i in range(0, len(items), batch_size)]
\`\`\`

## Estimating cost before you spend it

A rough rule of thumb for English text is about 4 characters per token. Before embedding a large corpus for the first time, it's worth estimating the bill:

\`\`\`python
def estimate_tokens(text):
    return max(1, len(text) // 4)

total = sum(estimate_tokens(t) for t in unique_texts)
\`\`\`

Sum the estimate over only the *unique* texts, not the duplicates the cache will skip, and you get a realistic number instead of an inflated one.

## The mental model

Dedupe first, batch second, estimate third. Each step is cheap arithmetic that heads off an expensive mistake. Dedupe stops you paying twice for the same text. Batching stops a request getting rejected for being too large. Estimating stops "I built the index" from becoming a surprise bill.`,
    starter_code: `def dedupe_preserve_order(texts):
    # TODO: return a list of the unique texts in texts, in first-seen order.
    pass

def batch(items, batch_size):
    # TODO: return a list of chunks of items, each up to batch_size long.
    pass

texts = ["cat", "dog", "cat", "bird", "dog", "fish"]
unique = dedupe_preserve_order(texts)
print(unique)

batches = batch(unique, 2)
print(batches)
print("Batches needed:", len(batches))
`,
    solution_code: `def dedupe_preserve_order(texts):
    seen = set()
    unique = []
    for t in texts:
        if t not in seen:
            seen.add(t)
            unique.append(t)
    return unique

def batch(items, batch_size):
    chunks = []
    for i in range(0, len(items), batch_size):
        chunks.append(items[i:i + batch_size])
    return chunks

texts = ["cat", "dog", "cat", "bird", "dog", "fish"]
unique = dedupe_preserve_order(texts)
print(unique)

batches = batch(unique, 2)
print(batches)
print("Batches needed:", len(batches))
`,
    hints: [
      "Use a set to track which texts you've already added, and a separate list to preserve the order they first appeared in.",
      "batch() is just slicing items in fixed-size steps: items[i:i+batch_size] for i in range(0, len(items), batch_size).",
      "Dedupe BEFORE batching. Batching duplicates wastes a slot in some batch for nothing.",
    ],
    animated_diagrams: [
      {
        title: "Embedding a big corpus without overpaying",
        caption: "Drop duplicates, skip anything already cached, then embed what's left in fixed-size batches.",
        loop: false,
        nodes: [
          { label: "Dedupe", sub: "unique texts", detail: "Collapse repeated texts to one copy so you never embed the same string twice." },
          { label: "Cache check", sub: "already have it?", detail: "Filter out any text whose vector is already cached before making a call." },
          { label: "Batch", sub: "fixed chunks", detail: "Split the remaining texts into chunks that fit the API's per-request limit." },
          { label: "Embed", sub: "one call each", detail: "Send each batch as one request and store every returned vector in the cache." },
          { label: "Estimate", sub: "count tokens", detail: "Sum a rough token estimate over the unique texts to predict the bill before you spend." },
        ],
      },
    ],
    key_terms: [
      { term: "Cache", definition: "A store keyed by exact text so each unique string is embedded only once." },
      { term: "Batching", definition: "Splitting a large list into fixed-size chunks that each fit one API request." },
      { term: "Token estimate", definition: "A rough character-based guess of cost, about 4 characters per token for English." },
    ],
    worked_examples: [
      {
        difficulty: "easy",
        prompt: "A corpus has 10,000 unique documents and the batch size is 128. How many embed calls?",
        steps: [
          "Each call carries at most 128 documents.",
          "Divide and round up: 10000 / 128 = 78.125.",
          "You cannot send a partial batch, so round up to the next whole call.",
        ],
        output: "ceil(10000 / 128) = 79 calls",
      },
    ],
    inline_quizzes: [
      {
        question: "Should you dedupe before or after batching, and why?",
        options: [
          "After, so batches stay full",
          "Before, because batching duplicates wastes a slot on a text you will throw away",
          "It makes no difference",
          "Before, because the API rejects duplicates",
        ],
        correct_index: 1,
        explanation: "Dedupe first. Every duplicate you carry into a batch spends a slot and possibly a whole extra call on an identical result.",
      },
    ],
    challenge_title: "Dedupe, Batch, and Bill",
    challenge_description:
      "Before re-embedding a corpus, dedupe repeated texts (cache hits are free), batch the rest into fixed-size API calls, and estimate the token cost of the unique texts only.",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    data = sys.stdin.read().split("\\n")
    n, b = map(int, data[0].split())
    texts = [data[1 + i] for i in range(n)]

    # TODO: dedupe texts, preserving first-seen order.
    # TODO: batches_needed = ceil(unique_count / b).
    # TODO: total_tokens = sum of max(1, len(text)//4) over the UNIQUE texts only.
    # TODO: print unique_count, batches_needed, total_tokens on three lines.

main()
`,
    challenge_solution_code: `import sys, math

def main():
    data = sys.stdin.read().split("\\n")
    n, b = map(int, data[0].split())
    texts = [data[1 + i] for i in range(n)]

    seen = set()
    unique = []
    for t in texts:
        if t not in seen:
            seen.add(t)
            unique.append(t)

    batches_needed = math.ceil(len(unique) / b)
    total_tokens = sum(max(1, len(t) // 4) for t in unique)

    print(len(unique))
    print(batches_needed)
    print(total_tokens)

main()
`,
    challenge_test_cases: [
      {
        input: "6 2\ncat\ndog\ncat\nbird\ndog\nfish",
        expected_output: "4\n2\n4",
        description: "4 unique texts fit in 2 batches of size 2; each short word costs 1 estimated token.",
      },
      {
        input: "3 5\nhello\nhello\nhello",
        expected_output: "1\n1\n1",
        description: "All three lines are the same text, so the cache reduces it to a single unique embed.",
      },
      {
        input: "5 1\nartificial intelligence\nmachine learning\nartificial intelligence\ndeep learning models\nneural networks",
        expected_output: "4\n4\n17",
        description: "One duplicate is deduped to 4 unique texts; batch size 1 needs 4 batches; token estimate sums only the unique texts.",
      },
    ],
  },

  {
    id: "prod-16-8",
    project_id: "prod-16",
    order: 8,
    title: "Ship the Semantic Search Engine",
    concept: "assembling and shipping the engine",
    explanation: `Every piece is built: batch embedding, cosine similarity, ranking with a tie-break, top-k with clamping, guards against bad vectors, and a cache to hold costs down. This lesson bolts them into one engine and ships it. Finish it and the project lands in your **Portfolio**.

## The whole thing, assembled

\`\`\`python
import math
import voyageai

class SemanticSearchEngine:
    def __init__(self, api_key=None):
        self.vo = voyageai.Client(api_key=api_key)
        self.index = []
        self.cache = {}

    def add_documents(self, docs, batch_size=128):
        texts = [d["text"] for d in docs]
        to_embed = [t for t in texts if t not in self.cache]

        for i in range(0, len(to_embed), batch_size):
            chunk = to_embed[i:i + batch_size]
            result = self.vo.embed(chunk, model="voyage-3.5", input_type="document")
            for text, vector in zip(chunk, result.embeddings):
                self.cache[text] = vector

        for doc in docs:
            self.index.append({
                "id": doc["id"],
                "text": doc["text"],
                "vector": self.cache[doc["text"]],
            })

    def _cosine(self, a, b):
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(x * x for x in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def search(self, query_text, k=5):
        if not self.index:
            return []

        query_vector = self.vo.embed(
            [query_text], model="voyage-3.5", input_type="query"
        ).embeddings[0]

        scored = []
        for doc in self.index:
            if len(doc["vector"]) != len(query_vector):
                continue
            score = self._cosine(query_vector, doc["vector"])
            scored.append((doc, score))

        scored.sort(key=lambda pair: (-pair[1], pair[0]["id"]))
        k = min(k, len(scored))

        return [
            {"id": doc["id"], "text": doc["text"], "score": round(score, 4)}
            for doc, score in scored[:k]
        ]
\`\`\`

Read it top to bottom and every lesson is there. \`add_documents\` batches and caches (lessons 2 and 7). \`_cosine\` is the similarity math with its zero-vector guard (lesson 3). \`search\` ranks, breaks ties, and clamps to top-k (lessons 4-5). The dimension check and the empty-index guard are the hardening (lesson 6).

## What "shipped" means here

No deployment needed. Shipped means three things are true:

1. It runs from a clean start: point it at a folder of documents, call \`add_documents\`, then \`search\`.
2. It handles an empty corpus, a repeated document, and a weird query without crashing.
3. Someone else could use it from your instructions alone: \`engine.add_documents(docs)\`, then \`engine.search("your question", k=5)\`.

## Your Portfolio

Completing this final lesson records the project in your **Portfolio** with its title and what you built: a working semantic search engine over a real corpus, backed by real embeddings, ranked by cosine similarity, returned as scored top-k results. Keep a one-line description ("finds FAQ answers by meaning, not keyword") plus a saved example query and its top result as proof it works.

## The drill below

You'll build a ship-readiness check. Given the engine's index size, cache flag, zero-vector guard flag, and estimated token usage, it decides whether the engine is ready to ship or lists what's missing.`,
    starter_code: `# Ship-readiness check for the finished search engine.
# index_size: number of documents embedded and indexed
# cache_enabled: 1 if repeated texts are deduped/cached, else 0
# handles_zero_vector: 1 if cosine_similarity guards against zero vectors, else 0
# tokens, budget: estimated embedding cost vs the ceiling you set

def ship_check(index_size, cache_enabled, handles_zero_vector, tokens, budget):
    fails = []
    # TODO: "index" if index_size < 1.
    # TODO: "cache" if cache_enabled != 1.
    # TODO: "zero_vector_guard" if handles_zero_vector != 1.
    # TODO: "budget" if tokens > budget.
    return fails

print(ship_check(50, 1, 1, 400, 1000))
`,
    solution_code: `def ship_check(index_size, cache_enabled, handles_zero_vector, tokens, budget):
    fails = []
    if index_size < 1:
        fails.append("index")
    if cache_enabled != 1:
        fails.append("cache")
    if handles_zero_vector != 1:
        fails.append("zero_vector_guard")
    if tokens > budget:
        fails.append("budget")
    return fails

cases = [
    (50, 1, 1, 400, 1000),
    (0, 0, 0, 2000, 1000),
    (30, 1, 0, 500, 400),
]
for index_size, cache, guard, tok, bud in cases:
    fails = ship_check(index_size, cache, guard, tok, bud)
    print("READY" if not fails else ",".join(fails))
`,
    hints: [
      "Check the four conditions in a fixed order: index, cache, zero_vector_guard, budget.",
      "index_size < 1 means nothing has been embedded yet, so there's nothing to search.",
      "No failures means the engine is READY to ship.",
    ],
    animated_diagrams: [
      {
        title: "The assembled engine",
        caption: "Every earlier lesson becomes one method: add documents, then search them.",
        loop: false,
        nodes: [
          { label: "add_documents", sub: "batch + cache", detail: "Dedupe, batch, and cache embeddings, then store each document with its vector in the index." },
          { label: "Index", sub: "vectors ready", detail: "The engine holds a list of documents that each carry text and a vector." },
          { label: "search", sub: "embed query", detail: "Embed the query once, then guard against an empty index before scoring." },
          { label: "Rank + guard", sub: "skip bad dims", detail: "Score matching vectors, skip mismatched ones, and sort with the id tie-break." },
          { label: "Top-k", sub: "scored results", detail: "Clamp k, slice, and return each match with its rounded score." },
        ],
      },
    ],
    inline_quizzes: [
      {
        question: "In this project, what does 'shipped' mean?",
        options: [
          "The code is deployed to a public server",
          "It runs from a clean start, survives messy input without crashing, and someone else could use it from your instructions",
          "It passes exactly one test",
          "The embeddings are stored in a database",
        ],
        correct_index: 1,
        explanation: "No deployment is needed here. Shipped means it runs end to end, handles edge cases, and is usable by someone else.",
      },
    ],
    participation_activities: [
      {
        activity_title: "Trace the engine",
        questions: [
          { type: "true_false", question: "The query is embedded once per search, no matter how large k or the corpus is.", correct_answer: "true", explanation: "A search costs one embedding call for the query plus cheap arithmetic to rank." },
          { type: "fill_in", question: "Which method batches and caches the document embeddings?", correct_answer: "add_documents", explanation: "add_documents dedupes, batches, caches, then appends each document with its vector to the index." },
        ],
      },
    ],
    challenge_title: "Ship Checklist",
    challenge_description:
      "Given the finished search engine's index size, cache flag, zero-vector guard flag, and token usage, print READY or list every failing check in order (index, cache, zero_vector_guard, budget).",
    challenge_language: "python",
    challenge_starter_code: `import sys

def main():
    parts = sys.stdin.read().split()
    index_size, cache_enabled, handles_zero_vector, tokens, budget = map(int, parts[:5])

    fails = []
    # TODO: append "index" if index_size < 1.
    # TODO: append "cache" if cache_enabled != 1.
    # TODO: append "zero_vector_guard" if handles_zero_vector != 1.
    # TODO: append "budget" if tokens > budget.
    # TODO: print "READY" if no fails, else each failing check on its own line.

main()
`,
    challenge_solution_code: `import sys

def main():
    parts = sys.stdin.read().split()
    index_size, cache_enabled, handles_zero_vector, tokens, budget = map(int, parts[:5])

    fails = []
    if index_size < 1:
        fails.append("index")
    if cache_enabled != 1:
        fails.append("cache")
    if handles_zero_vector != 1:
        fails.append("zero_vector_guard")
    if tokens > budget:
        fails.append("budget")

    if not fails:
        print("READY")
    else:
        for f in fails:
            print(f)

main()
`,
    challenge_test_cases: [
      {
        input: "50 1 1 400 1000",
        expected_output: "READY",
        description: "All four checks pass.",
      },
      {
        input: "0 0 0 2000 1000",
        expected_output: "index\ncache\nzero_vector_guard\nbudget",
        description: "Everything fails; all four checks reported in order.",
      },
      {
        input: "30 1 0 500 400",
        expected_output: "zero_vector_guard\nbudget",
        description: "Index and cache are fine, but the zero-vector guard is missing and the estimate exceeds budget.",
      },
    ],
  },
];

export default { project, lessons };
