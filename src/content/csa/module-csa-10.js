export default {
  "project": {
    "id": "csa-10",
    "title": "Recursion",
    "description": "Master recursive thinking in Java, base cases, the call stack, tracing, and recursive search and sort.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 210,
    "track": "apcsa",
    "unit": "Unit 10, Recursion",
    "tags": [
      "recursion",
      "java",
      "apcsa"
    ]
  },
  "lessons": [
    {
      "id": "csa-10-l1",
      "project_id": "csa-10",
      "order": 1,
      "title": "Base Case and Recursive Case",
      "explanation": "## What Is Recursion?\n\n**Recursion** is when a method calls **itself** to solve a smaller version of the same problem. Every recursive method needs two ingredients:\n\n- A **base case**: the simplest input where the answer is known directly, with no further calls. This stops the recursion.\n- A **recursive case**: where the method calls itself on a **smaller** input, moving toward the base case.\n\nIf you forget the base case, or the recursive case never shrinks the problem, you get **infinite recursion** and a `StackOverflowError`.\n\n## A Classic Example: Factorial\n\nThe factorial `n! = n * (n-1) * ... * 1`, and `0! = 1`. Notice that `n! = n * (n-1)!`. That self-reference is the recursive case.\n\n```java\npublic static int factorial(int n) {\n    if (n <= 1) {     // base case\n        return 1;\n    }\n    return n * factorial(n - 1); // recursive case\n}\n```\n\nWhen we call `factorial(4)`:\n\n- `factorial(4)` returns `4 * factorial(3)`\n- `factorial(3)` returns `3 * factorial(2)`\n- `factorial(2)` returns `2 * factorial(1)`\n- `factorial(1)` hits the **base case** and returns `1`\n\nThen the results multiply back up: `2*1=2`, `3*2=6`, `4*6=24`.\n\n## Why the Base Case Matters\n\nThe base case is the **exit door**. Each recursive call must make progress toward it, here, `n` always decreases by 1, so we are guaranteed to reach `n <= 1`. Without that shrinking, recursion never ends.\n\n## Recursion vs. Iteration\n\nAnything a loop can do, recursion can do, and vice versa. Recursion shines when a problem is **naturally self-similar** (trees, divide-and-conquer). For simple counting it can be less efficient than a loop because each call uses memory, but it is often clearer.\n\nKey takeaway: **always write the base case first**, then express the bigger problem in terms of a smaller one.",
      "key_terms": [
        {
          "term": "Base case",
          "definition": "The condition under which a recursive method returns directly without making another recursive call, stopping the recursion."
        },
        {
          "term": "Recursive case",
          "definition": "The part of a method where it calls itself on a smaller or simpler input to make progress toward the base case."
        },
        {
          "term": "Infinite recursion",
          "definition": "Recursion that never reaches a base case, causing repeated calls until the program crashes with a StackOverflowError."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What happens if a recursive method has no reachable base case?",
          "options": [
            "It returns 0",
            "It runs forever until a StackOverflowError",
            "The compiler refuses to build it",
            "It automatically becomes a loop"
          ],
          "correct_index": 1,
          "explanation": "Without a reachable base case, the method keeps calling itself, exhausting the call stack and throwing StackOverflowError."
        }
      ],
      "quiz_questions": [
        {
          "question": "In factorial(n), which line is the base case?",
          "options": [
            "return n * factorial(n - 1);",
            "if (n <= 1) return 1;",
            "factorial(4)",
            "n = n - 1;"
          ],
          "correct_index": 1,
          "explanation": "The base case returns a known value directly. For factorial that is returning 1 when n is 1 or less."
        },
        {
          "question": "Why must each recursive call use a smaller input?",
          "options": [
            "To save memory",
            "So the method eventually reaches the base case",
            "Because Java requires it",
            "To avoid using loops"
          ],
          "correct_index": 1,
          "explanation": "Shrinking the input on each call guarantees the recursion makes progress toward the base case and terminates."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Base case or recursive case?",
          "caption": "Every call first asks whether it can answer directly or must shrink the problem.",
          "loop": false,
          "nodes": [
            { "label": "Call arrives", "sub": "factorial(n)", "detail": "A new call comes in with some value of n." },
            { "label": "Check base case", "sub": "is n <= 1?", "detail": "The very first thing a recursive method does is test for the base case." },
            { "label": "Base case", "sub": "return 1", "detail": "If n is 1 or less, return the known answer 1 and make no more calls." },
            { "label": "Recursive case", "sub": "n * factorial(n-1)", "detail": "Otherwise call yourself on the smaller value n-1, which moves toward the base case." },
            { "label": "Answer", "sub": "value returns", "detail": "The returned value flows back to whoever made this call." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing factorial(3)",
          "steps": [
            { "label": "factorial(3)", "detail": "3 is not <= 1, so take the recursive case and wait on factorial(2).", "code": "return 3 * factorial(2);" },
            { "label": "factorial(2)", "detail": "2 is not <= 1, so this call waits on factorial(1).", "code": "return 2 * factorial(1);" },
            { "label": "factorial(1)", "detail": "1 is <= 1, so the base case fires and returns 1 with no more calls.", "code": "return 1;" },
            { "label": "back in factorial(2)", "detail": "Now factorial(1) gave back 1, so this call computes 2 * 1.", "code": "2 * 1 = 2" },
            { "label": "back in factorial(3)", "detail": "factorial(2) gave back 2, so this call computes 3 * 2.", "code": "3 * 2 = 6" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Every recursive method needs at least one base case to stop.", "correct_answer": "true", "explanation": "Without a reachable base case the method calls itself forever and crashes." },
            { "type": "fill_in", "question": "The part of a recursive method that returns an answer directly without recursing is called the ___.", "correct_answer": "base case", "explanation": "The base case is the exit door that stops the recursion." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "warning",
          "position": "after",
          "title": "No base case means no exit",
          "content": "If you forget the base case, or the recursive call never gets closer to it, the calls pile up until the program throws a StackOverflowError. Write the base case first, then make sure each recursive call shrinks the input."
        }
      ],
      "challenge_title": "Recursive Factorial",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static long factorial(int n) {\n        // TODO: base case + recursive case\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static long factorial(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "4",
          "expected_output": "24"
        },
        {
          "input": "0",
          "expected_output": "1"
        },
        {
          "input": "6",
          "expected_output": "720"
        }
      ]
    },
    {
      "id": "csa-10-l2",
      "project_id": "csa-10",
      "order": 2,
      "title": "The Call Stack",
      "explanation": "## How Recursion Actually Runs\n\nWhen a method is called, Java creates a **stack frame**: a small block of memory holding that call's **parameters**, **local variables**, and the spot to return to. These frames pile up on the **call stack**, a last-in-first-out (LIFO) structure.\n\nEach recursive call **pushes** a new frame. When a call finishes (returns), its frame is **popped** off, and control returns to the caller.\n\n## Tracing Through the Stack\n\nConsider counting down:\n\n```java\npublic static void countDown(int n) {\n    if (n == 0) {\n        return;            // base case\n    }\n    System.out.println(n);\n    countDown(n - 1);      // recursive call\n}\n```\n\nCalling `countDown(3)` builds the stack like this:\n\n- Push `countDown(3)` -> prints 3 -> calls `countDown(2)`\n- Push `countDown(2)` -> prints 2 -> calls `countDown(1)`\n- Push `countDown(1)` -> prints 1 -> calls `countDown(0)`\n- Push `countDown(0)` -> base case, returns -> pop\n- `countDown(1)` resumes, returns -> pop\n- `countDown(2)` resumes, returns -> pop\n- `countDown(3)` resumes, returns -> pop\n\nOutput: `3 2 1`.\n\n## Work Before vs. After the Call\n\nThe **position** of your work matters:\n\n- Code **before** the recursive call runs on the way **down** (during pushes).\n- Code **after** the recursive call runs on the way **back up** (during pops).\n\nIf we move the print **after** the call, the numbers come out reversed (`1 2 3`) because each print waits for the deeper call to finish first.\n\n## StackOverflowError\n\nThe stack has limited size. Too-deep recursion (or a missing base case) overflows it. This is the runtime cost of recursion: every pending call occupies memory until it returns.\n\nUnderstanding the stack lets you **predict output order** and explains why recursion uses more memory than a simple loop.",
      "key_terms": [
        {
          "term": "Call stack",
          "definition": "The LIFO structure of stack frames that tracks active method calls and where each should return."
        },
        {
          "term": "Stack frame",
          "definition": "A block of memory holding one method call's parameters, local variables, and return location."
        },
        {
          "term": "LIFO",
          "definition": "Last-in, first-out, the most recently pushed call frame is the first one to finish and be removed."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Code placed AFTER the recursive call executes during which phase?",
          "options": [
            "While calls are being pushed (going down)",
            "While calls are returning (coming back up)",
            "Never",
            "Only in the base case"
          ],
          "correct_index": 1,
          "explanation": "Statements after the recursive call wait until the deeper call returns, so they run as the stack unwinds upward."
        }
      ],
      "quiz_questions": [
        {
          "question": "If you print n AFTER calling countDown(n-1), what order do numbers print for countDown(3)?",
          "options": [
            "3 2 1",
            "1 2 3",
            "0 1 2 3",
            "Nothing prints"
          ],
          "correct_index": 1,
          "explanation": "Each call defers its print until the deeper call finishes, so the deepest (1) prints first: 1 2 3."
        },
        {
          "question": "What causes a StackOverflowError?",
          "options": [
            "Dividing by zero",
            "Too many stack frames from deep or non-terminating recursion",
            "A null value",
            "Using too many loops"
          ],
          "correct_index": 1,
          "explanation": "Each pending recursive call uses a frame; too many frames exhaust the limited call stack memory."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Frames push and pop",
          "caption": "Each call pushes a frame going down, then frames pop off in reverse as calls return.",
          "loop": true,
          "nodes": [
            { "label": "Push factorial(3)", "sub": "top of stack", "detail": "The first call gets a frame holding its own n = 3." },
            { "label": "Push factorial(2)", "sub": "n = 2", "detail": "factorial(3) calls factorial(2), which stacks a new frame on top." },
            { "label": "Push factorial(1)", "sub": "base case", "detail": "factorial(1) hits the base case and returns 1 without pushing more." },
            { "label": "Pop factorial(1)", "sub": "returns 1", "detail": "Its frame is removed and control goes back to factorial(2)." },
            { "label": "Pop factorial(2)", "sub": "returns 2", "detail": "factorial(2) finishes its multiply, pops, and returns to factorial(3)." },
            { "label": "Pop factorial(3)", "sub": "returns 6", "detail": "The last frame pops and the final answer leaves the stack." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Watching the stack for factorial(4)",
          "steps": [
            { "label": "push factorial(4)", "detail": "Frame for n = 4 is on the stack. It needs factorial(3) first.", "code": "return 4 * factorial(3);" },
            { "label": "push factorial(3)", "detail": "Frame for n = 3 stacks on top, waiting on factorial(2).", "code": "return 3 * factorial(2);" },
            { "label": "push factorial(2)", "detail": "Frame for n = 2 stacks on top, waiting on factorial(1).", "code": "return 2 * factorial(1);" },
            { "label": "push factorial(1)", "detail": "Base case. Returns 1 and its frame pops off.", "code": "return 1;" },
            { "label": "pop to factorial(2)", "detail": "With 1 in hand, factorial(2) computes 2 * 1 = 2 and pops.", "code": "2 * 1 = 2" },
            { "label": "pop to factorial(3)", "detail": "factorial(3) computes 3 * 2 = 6 and pops.", "code": "3 * 2 = 6" },
            { "label": "pop to factorial(4)", "detail": "factorial(4) computes 4 * 6 = 24 and the stack is empty.", "code": "4 * 6 = 24" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "The call stack is last-in, first-out, so the most recent call finishes first.", "correct_answer": "true", "explanation": "LIFO means the frame pushed last is the first one to return and pop." },
            { "type": "fill_in", "question": "Recursion that is too deep or never terminates crashes with a ___.", "correct_answer": "StackOverflowError", "explanation": "Each pending call holds a frame, and too many frames exhaust the stack." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "insight",
          "position": "after",
          "title": "Each frame has its own copy",
          "content": "Every call gets a fresh frame with its own parameters and local variables. That is why the n inside factorial(3) stays 3 even while factorial(2) and factorial(1) run. The values do not clobber each other."
        }
      ],
      "challenge_title": "Print On The Way Up",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void printUp(int n) {\n        // TODO: print 1..n in increasing order using recursion only (no loops)\n        // hint: recurse first, then print\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        printUp(n);\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void printUp(int n) {\n        if (n == 0) {\n            return;\n        }\n        printUp(n - 1);\n        System.out.println(n);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        printUp(n);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "1\n2\n3"
        },
        {
          "input": "1",
          "expected_output": "1"
        },
        {
          "input": "5",
          "expected_output": "1\n2\n3\n4\n5"
        }
      ]
    },
    {
      "id": "csa-10-l3",
      "project_id": "csa-10",
      "order": 3,
      "title": "Tracing Recursion and Return Values",
      "explanation": "## Following the Values Back Up\n\nMany recursive methods **combine** the result of a smaller call with some local work. To trace them, you must follow values **down** (as arguments shrink) and **back up** (as returns combine).\n\n## The Fibonacci Sequence\n\nThe Fibonacci numbers are `0, 1, 1, 2, 3, 5, 8, ...` where each is the sum of the previous two:\n\n```java\npublic static int fib(int n) {\n    if (n < 2) {\n        return n;            // fib(0)=0, fib(1)=1\n    }\n    return fib(n - 1) + fib(n - 2);\n}\n```\n\nThis has **two** recursive calls per step, a **branching** (tree) recursion. To trace `fib(4)`:\n\n- `fib(4) = fib(3) + fib(2)`\n- `fib(3) = fib(2) + fib(1)`\n- `fib(2) = fib(1) + fib(0) = 1 + 0 = 1`\n- `fib(1) = 1`, `fib(0) = 0`\n\nWorking up: `fib(2)=1`, `fib(3)=fib(2)+fib(1)=1+1=2`, `fib(4)=fib(3)+fib(2)=2+1=3`.\n\n## Trace Tables\n\nA reliable way to trace is a **table** listing each call and what it returns once its sub-calls resolve. Always resolve the **deepest** call first, then substitute upward, exactly how the stack unwinds.\n\n## Watch For Repeated Work\n\nNotice `fib(2)` is computed more than once. Branching recursion can repeat sub-problems, making naive Fibonacci slow for large `n`. That is fine for tracing practice, but be aware it grows roughly exponentially.\n\n## Tips for Hand-Tracing\n\n- Write the base cases first so you instantly recognize them.\n- Replace each call with its returned value, innermost first.\n- Keep parentheses to avoid order mistakes.\n\nTracing is an AP exam staple: given a recursive method and a starting call, predict the **exact** returned value or printed output.",
      "key_terms": [
        {
          "term": "Branching recursion",
          "definition": "A recursive method that makes more than one recursive call per invocation, forming a tree of calls."
        },
        {
          "term": "Trace table",
          "definition": "A hand-written table that records each recursive call and the value it returns, resolved from the deepest call upward."
        },
        {
          "term": "Return value",
          "definition": "The result a recursive call passes back to its caller, often combined with local work to build the final answer."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does fib(5) return for the standard Fibonacci method?",
          "options": [
            "3",
            "5",
            "8",
            "13"
          ],
          "correct_index": 1,
          "explanation": "The sequence is 0,1,1,2,3,5,... so fib(5) = 5."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is naive recursive Fibonacci slow for large n?",
          "options": [
            "It has no base case",
            "It recomputes the same sub-problems many times",
            "It uses too many loops",
            "It returns the wrong values"
          ],
          "correct_index": 1,
          "explanation": "Each call branches into two, recomputing overlapping sub-problems repeatedly, causing exponential growth."
        },
        {
          "question": "When hand-tracing, which call should you resolve first?",
          "options": [
            "The first call made",
            "The deepest (innermost) call",
            "Any call at random",
            "The base case last"
          ],
          "correct_index": 1,
          "explanation": "The deepest call returns first as the stack unwinds, so resolve innermost calls before substituting upward."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Values unwind back up",
          "caption": "Arguments shrink on the way down, then returned values combine on the way back up.",
          "loop": false,
          "nodes": [
            { "label": "Descend", "sub": "arguments shrink", "detail": "Calls go deeper with smaller n until a base case is reached." },
            { "label": "Hit base case", "sub": "known value", "detail": "The deepest call returns a value directly, with nothing left to compute." },
            { "label": "Return up one level", "sub": "combine", "detail": "The caller takes that value and combines it with its own local work." },
            { "label": "Keep combining", "sub": "level by level", "detail": "Each level substitutes the value it got and returns its own result." },
            { "label": "Final answer", "sub": "top call returns", "detail": "The very first call finishes last and hands back the final value." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing fib(4)",
          "steps": [
            { "label": "fib(4)", "detail": "4 is not < 2, so it needs fib(3) plus fib(2).", "code": "return fib(3) + fib(2);" },
            { "label": "fib(3)", "detail": "3 is not < 2, so it needs fib(2) plus fib(1).", "code": "return fib(2) + fib(1);" },
            { "label": "fib(2)", "detail": "2 is not < 2, so it needs fib(1) plus fib(0).", "code": "fib(1) + fib(0) = 1 + 0 = 1" },
            { "label": "base cases", "detail": "fib(1) returns 1 and fib(0) returns 0 directly.", "code": "fib(1) = 1, fib(0) = 0" },
            { "label": "resolve fib(3)", "detail": "fib(2) is 1 and fib(1) is 1, so fib(3) is 1 + 1.", "code": "1 + 1 = 2" },
            { "label": "resolve fib(4)", "detail": "fib(3) is 2 and fib(2) is 1, so fib(4) is 2 + 1.", "code": "2 + 1 = 3" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "When hand-tracing, you resolve the deepest call first and substitute its value upward.", "correct_answer": "true", "explanation": "The deepest call returns first as the stack unwinds, so trace innermost to outermost." },
            { "type": "fill_in", "question": "fib(6) for the standard Fibonacci method returns the value ___.", "correct_answer": "8", "explanation": "The sequence is 0, 1, 1, 2, 3, 5, 8, so fib(6) is 8." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "tip",
          "position": "after",
          "title": "Return the result, do not just call",
          "content": "A recursive method almost always needs to return the value of its recursive call, often combined with local work. Writing fib(n - 1) on its own line throws the answer away. Use return fib(n - 1) + fib(n - 2) so the value flows back up."
        }
      ],
      "challenge_title": "Recursive Fibonacci",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static long fib(int n) {\n        // TODO: base cases fib(0)=0, fib(1)=1; else sum of previous two\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fib(n));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static long fib(int n) {\n        if (n < 2) {\n            return n;\n        }\n        return fib(n - 1) + fib(n - 2);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fib(n));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "0",
          "expected_output": "0"
        },
        {
          "input": "7",
          "expected_output": "13"
        },
        {
          "input": "10",
          "expected_output": "55"
        }
      ]
    },
    {
      "id": "csa-10-l4",
      "project_id": "csa-10",
      "order": 4,
      "title": "Recursion on Strings",
      "explanation": "## Strings Are Recursive Too\n\nA **String** can be viewed as a first character plus the **rest** of the string. That self-similar structure makes strings perfect for recursion. The key tools are:\n\n- `s.length()`, number of characters; `length() == 0` is the natural base case.\n- `s.charAt(0)`, the first character.\n- `s.substring(1)`, everything **except** the first character (the smaller problem).\n\n## Reversing a String\n\nTo reverse, put the first character **last**: reverse the rest, then append the first character.\n\n```java\npublic static String reverse(String s) {\n    if (s.length() <= 1) {\n        return s;                       // base case\n    }\n    return reverse(s.substring(1)) + s.charAt(0);\n}\n```\n\nTrace `reverse(\"cat\")`:\n\n- `reverse(\"cat\") = reverse(\"at\") + 'c'`\n- `reverse(\"at\") = reverse(\"t\") + 'a'`\n- `reverse(\"t\") = \"t\"` (base case)\n- Build up: `\"t\" + \"a\" = \"ta\"`, then `\"ta\" + \"c\" = \"tac\"`\n\n## Counting Occurrences\n\nThe same pattern counts a target character: check the first char, then recurse on the rest.\n\n```java\npublic static int countChar(String s, char c) {\n    if (s.length() == 0) {\n        return 0;\n    }\n    int rest = countChar(s.substring(1), c);\n    return (s.charAt(0) == c) ? 1 + rest : rest;\n}\n```\n\n## Why This Pattern Works\n\nEach call handles **one** character and delegates the remaining `n-1` characters to a recursive call. Because the string shrinks by one each time, it always reaches the empty (or single-char) base case.\n\n## A Note on Performance\n\n`substring(1)` creates a new String each call, so string recursion is not the fastest approach, but it is wonderfully clear and a common AP pattern. The mental model, **first character + smaller string**: transfers directly to arrays in the next lesson.",
      "key_terms": [
        {
          "term": "substring(1)",
          "definition": "Returns the string with its first character removed, producing the smaller sub-problem for recursion."
        },
        {
          "term": "charAt(0)",
          "definition": "Returns the first character of a string, the piece processed by the current recursive call."
        },
        {
          "term": "Empty-string base case",
          "definition": "Stopping recursion when length() reaches 0 (or 1), since an empty or single-char string needs no further work."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is a natural base case for string recursion?",
          "options": [
            "When the string equals \"a\"",
            "When length() is 0 (or 1)",
            "When charAt(0) is a space",
            "Never; strings can't have base cases"
          ],
          "correct_index": 1,
          "explanation": "An empty (or single-character) string has a known result and needs no further recursion, making it the base case."
        }
      ],
      "quiz_questions": [
        {
          "question": "In reverse(s), what does s.substring(1) represent?",
          "options": [
            "The first character",
            "The whole string",
            "Everything except the first character",
            "The last character"
          ],
          "correct_index": 2,
          "explanation": "substring(1) drops index 0, giving the smaller remaining string to recurse on."
        },
        {
          "question": "Why does string recursion always terminate?",
          "options": [
            "Java limits recursion depth",
            "The string shrinks by one character each call toward the empty base case",
            "charAt resets the string",
            "It uses a loop internally"
          ],
          "correct_index": 1,
          "explanation": "Each recursive call removes one character, so the length steadily decreases until it hits the base case."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Peeling one character at a time",
          "caption": "Each call handles the first character and hands the rest of the string to a smaller call.",
          "loop": true,
          "nodes": [
            { "label": "\"cat\"", "sub": "first = 'c'", "detail": "Split into the first char 'c' and the rest \"at\"." },
            { "label": "\"at\"", "sub": "first = 'a'", "detail": "Split into the first char 'a' and the rest \"t\"." },
            { "label": "\"t\"", "sub": "base case", "detail": "Length is 1, so return \"t\" directly with no more recursion." },
            { "label": "\"t\" + 'a'", "sub": "= \"ta\"", "detail": "Going back up, append 'a' after the reversed rest." },
            { "label": "\"ta\" + 'c'", "sub": "= \"tac\"", "detail": "Append 'c' last to get the fully reversed string." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing reverse(\"cat\")",
          "steps": [
            { "label": "reverse(\"cat\")", "detail": "Length is 3, so recurse on \"at\" then tack 'c' on the end.", "code": "return reverse(\"at\") + 'c';" },
            { "label": "reverse(\"at\")", "detail": "Length is 2, so recurse on \"t\" then tack 'a' on the end.", "code": "return reverse(\"t\") + 'a';" },
            { "label": "reverse(\"t\")", "detail": "Length is 1, base case, return \"t\".", "code": "return \"t\";" },
            { "label": "back in reverse(\"at\")", "detail": "\"t\" plus 'a' gives \"ta\".", "code": "\"t\" + 'a' = \"ta\"" },
            { "label": "back in reverse(\"cat\")", "detail": "\"ta\" plus 'c' gives \"tac\".", "code": "\"ta\" + 'c' = \"tac\"" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "String recursion terminates because the string loses one character on each call.", "correct_answer": "true", "explanation": "The length drops by one each call, so it steadily reaches the empty or single-char base case." },
            { "type": "fill_in", "question": "The method call s.___(1) returns the string with its first character removed.", "correct_answer": "substring", "explanation": "substring(1) drops index 0 and gives the smaller remaining string." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "tip",
          "position": "after",
          "title": "First character plus the rest",
          "content": "The mental model for every string recursion is the same. Do a little work with charAt(0), then hand substring(1) to a recursive call. Once the string is empty or a single character, you are at the base case."
        }
      ],
      "challenge_title": "Recursive String Reverse",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static String reverse(String s) {\n        // TODO: base case + recurse on substring(1)\n        return s;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(reverse(s));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static String reverse(String s) {\n        if (s.length() <= 1) {\n            return s;\n        }\n        return reverse(s.substring(1)) + s.charAt(0);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(reverse(s));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "cat",
          "expected_output": "tac"
        },
        {
          "input": "hello",
          "expected_output": "olleh"
        },
        {
          "input": "a",
          "expected_output": "a"
        }
      ]
    },
    {
      "id": "csa-10-l5",
      "project_id": "csa-10",
      "order": 5,
      "title": "Recursion on Arrays",
      "explanation": "## Processing Arrays Recursively\n\nUnlike strings, we usually do **not** create smaller arrays (that is wasteful). Instead we pass an **index** that marks where the current sub-problem begins. The array stays the same; the index shrinks the problem.\n\nThe pattern: a helper takes the array plus an index `i`. The **base case** is when `i` reaches `arr.length` (nothing left). Otherwise, combine `arr[i]` with the recursive result for `i + 1`.\n\n## Summing an Array\n\n```java\npublic static int sum(int[] arr, int i) {\n    if (i == arr.length) {\n        return 0;                 // base case: no elements left\n    }\n    return arr[i] + sum(arr, i + 1);\n}\n```\n\nCall it with `sum(arr, 0)`. Trace `{4, 2, 7}`:\n\n- `sum(arr,0) = 4 + sum(arr,1)`\n- `sum(arr,1) = 2 + sum(arr,2)`\n- `sum(arr,2) = 7 + sum(arr,3)`\n- `sum(arr,3) = 0` (base case)\n- Up: `7+0=7`, `2+7=9`, `4+9=13`\n\n## Finding a Maximum\n\nThe same index trick finds the largest element:\n\n```java\npublic static int max(int[] arr, int i) {\n    if (i == arr.length - 1) {\n        return arr[i];            // last element\n    }\n    return Math.max(arr[i], max(arr, i + 1));\n}\n```\n\n## Wrapper Methods\n\nUsers should not have to pass a starting index. A common technique is a **wrapper** (public) method that calls the recursive **helper** with index 0:\n\n```java\npublic static int sum(int[] arr) {\n    return sum(arr, 0);\n}\n```\n\nThis keeps the public interface clean while the helper does the recursion.\n\n## Key Idea\n\n**Index-based recursion** avoids copying data: the array is shared, and only the integer index moves forward. This mirrors how recursive search and sort algorithms operate in the next lessons.",
      "key_terms": [
        {
          "term": "Index-based recursion",
          "definition": "Recursing over an array by passing an integer index that advances each call, instead of copying sub-arrays."
        },
        {
          "term": "Wrapper method",
          "definition": "A public method that hides the helper's extra parameters by calling the recursive helper with a sensible starting value such as index 0."
        },
        {
          "term": "Helper method",
          "definition": "The actual recursive method, usually with extra parameters like an index, invoked by a wrapper."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why pass an index instead of copying a smaller array each call?",
          "options": [
            "Indices are more accurate",
            "To avoid the cost of creating new arrays repeatedly",
            "Java forbids array copies",
            "It changes the base case"
          ],
          "correct_index": 1,
          "explanation": "Copying sub-arrays every call wastes time and memory; a moving index reuses the same array efficiently."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the base case for sum(arr, i)?",
          "options": [
            "i == 0",
            "i == arr.length",
            "arr[i] == 0",
            "i < 0"
          ],
          "correct_index": 1,
          "explanation": "When the index reaches arr.length there are no elements left, so the sum of the empty remainder is 0."
        },
        {
          "question": "What is the purpose of a wrapper method?",
          "options": [
            "To make recursion faster",
            "To hide helper parameters and start recursion with index 0",
            "To replace the base case",
            "To copy the array"
          ],
          "correct_index": 1,
          "explanation": "The wrapper gives a clean public signature and supplies the starting index to the recursive helper."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Walking the array by index",
          "caption": "The array stays put while an index moves forward one step per call.",
          "loop": true,
          "nodes": [
            { "label": "i = 0", "sub": "arr[0] = 4", "detail": "Take arr[0], then add whatever sum(arr, 1) returns." },
            { "label": "i = 1", "sub": "arr[1] = 2", "detail": "Take arr[1], then add whatever sum(arr, 2) returns." },
            { "label": "i = 2", "sub": "arr[2] = 7", "detail": "Take arr[2], then add whatever sum(arr, 3) returns." },
            { "label": "i = 3", "sub": "base case", "detail": "i equals arr.length, nothing left, return 0." },
            { "label": "combine up", "sub": "7, 9, 13", "detail": "Add back up: 7 + 0, then 2 + 7, then 4 + 9 = 13." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing sum({4, 2, 7}, 0)",
          "steps": [
            { "label": "sum(arr, 0)", "detail": "i is 0, not the length, so add arr[0] to the rest.", "code": "return 4 + sum(arr, 1);" },
            { "label": "sum(arr, 1)", "detail": "i is 1, add arr[1] to the rest.", "code": "return 2 + sum(arr, 2);" },
            { "label": "sum(arr, 2)", "detail": "i is 2, add arr[2] to the rest.", "code": "return 7 + sum(arr, 3);" },
            { "label": "sum(arr, 3)", "detail": "i equals arr.length (3), base case, return 0.", "code": "return 0;" },
            { "label": "combine", "detail": "Add back up the stack: 7 + 0 = 7, then 2 + 7 = 9, then 4 + 9 = 13.", "code": "4 + 2 + 7 = 13" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Passing an index avoids copying a smaller array on every recursive call.", "correct_answer": "true", "explanation": "The array is shared and only the integer index advances, which saves time and memory." },
            { "type": "fill_in", "question": "For sum(arr, i), the base case is reached when i equals arr.___.", "correct_answer": "length", "explanation": "When i reaches arr.length there are no elements left, so return 0." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "tip",
          "position": "after",
          "title": "Move the index, not the data",
          "content": "For arrays, do not build smaller arrays each call. Pass a starting index and advance it. A public wrapper can call the helper with index 0 so the caller never sees the extra parameter."
        }
      ],
      "challenge_title": "Recursive Array Sum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int sum(int[] arr, int i) {\n        // TODO: base case when i reaches arr.length\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        System.out.println(sum(arr, 0));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int sum(int[] arr, int i) {\n        if (i == arr.length) {\n            return 0;\n        }\n        return arr[i] + sum(arr, i + 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        System.out.println(sum(arr, 0));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "3\n4 2 7",
          "expected_output": "13"
        },
        {
          "input": "1\n99",
          "expected_output": "99"
        },
        {
          "input": "5\n1 2 3 4 5",
          "expected_output": "15"
        }
      ]
    },
    {
      "id": "csa-10-l6",
      "project_id": "csa-10",
      "order": 6,
      "title": "Recursive Binary Search",
      "explanation": "## Searching by Halving\n\n**Binary search** finds a target in a **sorted** array by repeatedly cutting the search range in half. Recursion expresses this beautifully: each call searches a sub-range defined by `low` and `high` indices.\n\n## The Algorithm\n\n- Compute the middle index `mid = (low + high) / 2`.\n- If `arr[mid]` equals the target, return `mid`.\n- If the target is **smaller**, search the **left** half (`low..mid-1`).\n- If the target is **larger**, search the **right** half (`mid+1..high`).\n- **Base case**: if `low > high`, the range is empty, the target is not present, return `-1`.\n\n```java\npublic static int search(int[] arr, int target, int low, int high) {\n    if (low > high) {\n        return -1;                       // not found\n    }\n    int mid = (low + high) / 2;\n    if (arr[mid] == target) {\n        return mid;\n    } else if (target < arr[mid]) {\n        return search(arr, target, low, mid - 1);\n    } else {\n        return search(arr, target, mid + 1, high);\n    }\n}\n```\n\n## Why It Is Fast\n\nEach call eliminates **half** of the remaining elements, so binary search runs in **O(log n)** time. Searching 1,000,000 sorted items takes about 20 comparisons. Linear search would take up to a million.\n\n## Tracing an Example\n\nSearch for `7` in `{1, 3, 5, 7, 9}` with `low=0, high=4`:\n\n- `mid=2`, `arr[2]=5`; `7 > 5` -> search right `low=3, high=4`\n- `mid=3`, `arr[3]=7` -> found, return `3`\n\n## Critical Requirement\n\nBinary search only works on **sorted** data. On unsorted input it gives wrong answers. The base case `low > high` is what guarantees termination: every recursive call strictly shrinks the range, so it cannot loop forever.",
      "key_terms": [
        {
          "term": "Binary search",
          "definition": "A search that repeatedly halves a sorted array's range, achieving O(log n) time."
        },
        {
          "term": "Midpoint",
          "definition": "The index (low + high) / 2 used to split the search range and compare against the target."
        },
        {
          "term": "Empty-range base case",
          "definition": "When low exceeds high the range holds no elements, so the target is absent and the method returns -1."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Binary search requires the array to be...",
          "options": [
            "Reversed",
            "Sorted",
            "All positive",
            "Of even length"
          ],
          "correct_index": 1,
          "explanation": "Halving only makes sense when elements are ordered; on unsorted data binary search gives incorrect results."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the time complexity of binary search?",
          "options": [
            "O(n)",
            "O(log n)",
            "O(n^2)",
            "O(1)"
          ],
          "correct_index": 1,
          "explanation": "Each step discards half the remaining elements, so the number of comparisons grows logarithmically."
        },
        {
          "question": "Which base case signals the target is not present?",
          "options": [
            "arr[mid] == target",
            "low > high",
            "mid == 0",
            "high == arr.length"
          ],
          "correct_index": 1,
          "explanation": "When low passes high the range is empty, meaning the target was never found, so return -1."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Halving the search range",
          "caption": "Each call checks the middle and throws away the half that cannot hold the target.",
          "loop": true,
          "nodes": [
            { "label": "lo=0 hi=5", "sub": "mid=2, arr=5", "detail": "Range is the whole array. Middle value 5 is too small for target 11, so go right." },
            { "label": "lo=3 hi=5", "sub": "mid=4, arr=9", "detail": "Left half is gone. Middle value 9 is still too small, so go right again." },
            { "label": "lo=5 hi=5", "sub": "mid=5, arr=11", "detail": "One element left. Middle value 11 equals the target." },
            { "label": "Found", "sub": "return 5", "detail": "Return the index where the target was found." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Searching for 11 in {1, 3, 5, 7, 9, 11}",
          "steps": [
            { "label": "low=0, high=5", "detail": "mid is (0 + 5) / 2 = 2. arr[2] is 5. Since 11 > 5, search the right half.", "code": "search(arr, 11, 3, 5)" },
            { "label": "low=3, high=5", "detail": "mid is (3 + 5) / 2 = 4. arr[4] is 9. Since 11 > 9, search the right half.", "code": "search(arr, 11, 5, 5)" },
            { "label": "low=5, high=5", "detail": "mid is (5 + 5) / 2 = 5. arr[5] is 11, which equals the target.", "code": "return 5;" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Binary search gives correct results only when the array is sorted.", "correct_answer": "true", "explanation": "Halving relies on order, so on unsorted data the answer can be wrong." },
            { "type": "fill_in", "question": "The time complexity of binary search is O(___ n).", "correct_answer": "log", "explanation": "Each step discards half the elements, so comparisons grow logarithmically." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "warning",
          "position": "after",
          "title": "Sorted first, always",
          "content": "Binary search assumes the array is already sorted in order. Run it on unsorted data and it will confidently return the wrong index or -1. The base case low > high is what guarantees it stops, since every call strictly shrinks the range."
        }
      ],
      "challenge_title": "Recursive Binary Search",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int search(int[] arr, int target, int low, int high) {\n        // TODO: base case low > high returns -1; else compare mid\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        System.out.println(search(arr, target, 0, n - 1));\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int search(int[] arr, int target, int low, int high) {\n        if (low > high) {\n            return -1;\n        }\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) {\n            return mid;\n        } else if (target < arr[mid]) {\n            return search(arr, target, low, mid - 1);\n        } else {\n            return search(arr, target, mid + 1, high);\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        System.out.println(search(arr, target, 0, n - 1));\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n1 3 5 7 9\n7",
          "expected_output": "3"
        },
        {
          "input": "5\n1 3 5 7 9\n4",
          "expected_output": "-1"
        },
        {
          "input": "6\n2 4 6 8 10 12\n2",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csa-10-l7",
      "project_id": "csa-10",
      "order": 7,
      "title": "Recursive Sorting: Merge Sort",
      "explanation": "## Divide and Conquer\n\n**Merge sort** is the textbook example of recursive **divide and conquer**. It works in three stages:\n\n- **Divide**: split the array into two halves.\n- **Conquer**: recursively sort each half.\n- **Combine**: **merge** the two sorted halves into one sorted result.\n\nThe **base case** is an array (or sub-array) of length 0 or 1, it is already sorted, so we stop.\n\n## The Merge Step\n\nMerging two sorted lists is the heart of the algorithm. Walk both lists with pointers, repeatedly taking the **smaller** front element:\n\n```java\npublic static int[] merge(int[] a, int[] b) {\n    int[] result = new int[a.length + b.length];\n    int i = 0, j = 0, k = 0;\n    while (i < a.length && j < b.length) {\n        if (a[i] <= b[j]) result[k++] = a[i++];\n        else result[k++] = b[j++];\n    }\n    while (i < a.length) result[k++] = a[i++];\n    while (j < b.length) result[k++] = b[j++];\n    return result;\n}\n```\n\n## Putting It Together\n\n```java\npublic static int[] mergeSort(int[] arr) {\n    if (arr.length <= 1) {\n        return arr;                       // base case\n    }\n    int mid = arr.length / 2;\n    int[] left = Arrays.copyOfRange(arr, 0, mid);\n    int[] right = Arrays.copyOfRange(arr, mid, arr.length);\n    return merge(mergeSort(left), mergeSort(right));\n}\n```\n\n## Why It Is Efficient\n\nThe array is halved `log n` times, and each level does `O(n)` merging work, giving **O(n log n)** overall, far better than the `O(n^2)` of simple sorts on large inputs. Merge sort is also **stable** (equal elements keep their order) thanks to the `<=` in the merge.\n\n## The Recursive Shape\n\nNotice the two recursive calls (`mergeSort(left)` and `mergeSort(right)`), branching recursion again, but here each branch handles a **disjoint** half, so there is no wasteful repeated work like naive Fibonacci. This is recursion at its most powerful.",
      "key_terms": [
        {
          "term": "Divide and conquer",
          "definition": "An approach that splits a problem into smaller independent sub-problems, solves them recursively, and combines the results."
        },
        {
          "term": "Merge",
          "definition": "The step that combines two already-sorted arrays into one sorted array by repeatedly taking the smaller front element."
        },
        {
          "term": "O(n log n)",
          "definition": "Merge sort's running time: log n levels of splitting, each doing n work to merge."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the base case of merge sort?",
          "options": [
            "An array of length 0 or 1",
            "An array with duplicates",
            "An empty merge result",
            "An array of length n/2"
          ],
          "correct_index": 0,
          "explanation": "A sub-array of length 0 or 1 is already sorted, so recursion stops there."
        }
      ],
      "quiz_questions": [
        {
          "question": "What are the three stages of merge sort?",
          "options": [
            "Search, swap, repeat",
            "Divide, conquer (sort halves), combine (merge)",
            "Pivot, partition, recurse",
            "Hash, bucket, gather"
          ],
          "correct_index": 1,
          "explanation": "Merge sort divides into halves, recursively sorts each, then merges them back together."
        },
        {
          "question": "Why is merge sort O(n log n) rather than O(n^2)?",
          "options": [
            "It never recurses",
            "There are log n levels, each doing O(n) merge work",
            "It only compares once",
            "It sorts in place with no copies"
          ],
          "correct_index": 1,
          "explanation": "Halving gives log n levels and merging each level costs O(n), so total work is n log n."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Split all the way down, then merge back up",
          "caption": "Merge sort breaks the array into single elements, then merges pairs back into sorted order.",
          "loop": true,
          "nodes": [
            { "label": "{5, 2, 8, 1}", "sub": "divide", "detail": "Split into the halves {5, 2} and {8, 1}." },
            { "label": "{5, 2} and {8, 1}", "sub": "divide again", "detail": "Each half splits into single elements, which are sorted by definition." },
            { "label": "merge {5},{2}", "sub": "= {2, 5}", "detail": "Merge the singles into a sorted pair, taking the smaller front each time." },
            { "label": "merge {8},{1}", "sub": "= {1, 8}", "detail": "The other pair merges into {1, 8}." },
            { "label": "merge halves", "sub": "= {1, 2, 5, 8}", "detail": "Merge {2, 5} with {1, 8} into the final sorted array." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Merge sorting {5, 2, 8, 1}",
          "steps": [
            { "label": "split", "detail": "Length is 4, over the base case. Split into left {5, 2} and right {8, 1}.", "code": "mid = 2" },
            { "label": "sort left {5, 2}", "detail": "Split into {5} and {2}, both base cases, then merge them.", "code": "merge({5}, {2}) = {2, 5}" },
            { "label": "sort right {8, 1}", "detail": "Split into {8} and {1}, both base cases, then merge them.", "code": "merge({8}, {1}) = {1, 8}" },
            { "label": "merge halves", "detail": "Compare fronts: 1 < 2 take 1, then 2 < 8 take 2, then 5 < 8 take 5, then 8.", "code": "merge({2, 5}, {1, 8}) = {1, 2, 5, 8}" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "The two recursive calls in merge sort each work on a disjoint half, so no work is repeated.", "correct_answer": "true", "explanation": "Unlike naive Fibonacci, the halves do not overlap, so each element is handled once per level." },
            { "type": "fill_in", "question": "The step that combines two sorted halves into one sorted array is called the ___ step.", "correct_answer": "merge", "explanation": "Merging walks both halves and repeatedly takes the smaller front element." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "insight",
          "position": "after",
          "title": "Fast but not in place",
          "content": "Merge sort runs in O(n log n), which beats the O(n^2) of simple sorts on large inputs. The tradeoff is that the merge step allocates new arrays, so it is not an in-place sort like insertion sort."
        }
      ],
      "challenge_title": "Merge Sort an Array",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static int[] merge(int[] a, int[] b) {\n        // TODO: merge two sorted arrays\n        return new int[0];\n    }\n\n    public static int[] mergeSort(int[] arr) {\n        // TODO: base case + divide + merge\n        return arr;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int[] sorted = mergeSort(arr);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < sorted.length; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(sorted[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static int[] merge(int[] a, int[] b) {\n        int[] result = new int[a.length + b.length];\n        int i = 0, j = 0, k = 0;\n        while (i < a.length && j < b.length) {\n            if (a[i] <= b[j]) {\n                result[k++] = a[i++];\n            } else {\n                result[k++] = b[j++];\n            }\n        }\n        while (i < a.length) {\n            result[k++] = a[i++];\n        }\n        while (j < b.length) {\n            result[k++] = b[j++];\n        }\n        return result;\n    }\n\n    public static int[] mergeSort(int[] arr) {\n        if (arr.length <= 1) {\n            return arr;\n        }\n        int mid = arr.length / 2;\n        int[] left = Arrays.copyOfRange(arr, 0, mid);\n        int[] right = Arrays.copyOfRange(arr, mid, arr.length);\n        return merge(mergeSort(left), mergeSort(right));\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        int[] sorted = mergeSort(arr);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < sorted.length; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(sorted[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n5 2 4 1 3",
          "expected_output": "1 2 3 4 5"
        },
        {
          "input": "1\n42",
          "expected_output": "42"
        },
        {
          "input": "6\n9 9 1 5 1 0",
          "expected_output": "0 1 1 5 9 9"
        }
      ]
    },
    {
      "id": "csa-10-l8",
      "project_id": "csa-10",
      "order": 8,
      "title": "Recursive Insertion and Putting It Together",
      "explanation": "## Insertion Sort, Recursively\n\nWe usually write **insertion sort** with loops, but it also has an elegant recursive form that reinforces the **base case + smaller problem** mindset.\n\nThe idea: to sort the first `n` elements, first **recursively sort the first `n-1`**, then **insert** the `n`-th element into its correct spot among the already-sorted prefix.\n\n```java\npublic static void insertionSort(int[] arr, int n) {\n    if (n <= 1) {\n        return;                      // base case: 0 or 1 element is sorted\n    }\n    insertionSort(arr, n - 1);       // sort first n-1\n    int last = arr[n - 1];           // element to insert\n    int j = n - 2;\n    while (j >= 0 && arr[j] > last) {\n        arr[j + 1] = arr[j];         // shift right\n        j--;\n    }\n    arr[j + 1] = last;               // place it\n}\n```\n\nHere the **recursive call comes first** (sort the prefix), then the **insert** work happens on the way back up the stack.\n\n## Comparing the Two Sorts\n\n- **Merge sort**: divide and conquer, **O(n log n)**, uses extra arrays.\n- **Insertion sort**: builds a sorted prefix one element at a time, **O(n^2)** in the worst case, but fast on nearly-sorted data and sorts in place.\n\nBoth illustrate the same recursive principle: solve a smaller version, then do a little local work.\n\n## The Big Picture of Recursion\n\nAcross this unit you have seen one pattern repeat:\n\n- Identify a **base case** where the answer is trivial.\n- Express the problem in terms of a **smaller** version of itself.\n- Let the **call stack** combine the partial results.\n\nWhether reversing a string, searching a sorted array, or sorting with merge or insertion, recursion turns a hard problem into the **same problem, one step smaller**. Mastering that reframing is the real goal, the specific algorithm is just practice. When you can spot self-similarity, recursion becomes a natural, powerful tool.",
      "key_terms": [
        {
          "term": "Insertion sort",
          "definition": "A sort that grows a sorted prefix by inserting each next element into its correct position; recursively, sort n-1 then insert the n-th."
        },
        {
          "term": "In-place sorting",
          "definition": "Rearranging elements within the original array without allocating significant extra storage, as insertion sort does."
        },
        {
          "term": "Self-similarity",
          "definition": "The property that a problem can be expressed as a smaller instance of itself, which is what makes recursion applicable."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In recursive insertion sort, what happens AFTER the recursive call returns?",
          "options": [
            "Nothing",
            "The current last element is inserted into the sorted prefix",
            "The array is divided in half",
            "The base case runs again"
          ],
          "correct_index": 1,
          "explanation": "The recursive call sorts the first n-1 elements; on the way back up, the n-th element is inserted into place."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the worst-case time complexity of insertion sort?",
          "options": [
            "O(log n)",
            "O(n)",
            "O(n^2)",
            "O(n log n)"
          ],
          "correct_index": 2,
          "explanation": "Inserting each element may shift all earlier ones, leading to O(n^2) comparisons in the worst case."
        },
        {
          "question": "What single idea unifies every recursive algorithm in this unit?",
          "options": [
            "Always use two recursive calls",
            "Solve a smaller version of the same problem and combine via the base case",
            "Avoid loops entirely",
            "Sort the data first"
          ],
          "correct_index": 1,
          "explanation": "Every example reduces the problem to a smaller instance and relies on a base case to terminate and combine results."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Sort the prefix, then insert",
          "caption": "Recursive insertion sort sorts the first n-1 elements, then drops the last one into place.",
          "loop": true,
          "nodes": [
            { "label": "sort first n-1", "sub": "recurse down", "detail": "Recursively sort everything except the last element." },
            { "label": "base case", "sub": "n <= 1", "detail": "One element (or none) is already sorted, so stop recursing." },
            { "label": "grab last", "sub": "arr[n-1]", "detail": "On the way back up, take the last element as the one to insert." },
            { "label": "shift bigger right", "sub": "make a gap", "detail": "Slide each larger element in the sorted prefix one slot to the right." },
            { "label": "drop it in", "sub": "prefix sorted", "detail": "Place the held value in the gap, extending the sorted prefix by one." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing insertionSort({3, 1, 2}, 3)",
          "steps": [
            { "label": "insertionSort(arr, 3)", "detail": "n is 3, over the base case, so first sort the prefix of length 2.", "code": "insertionSort(arr, 2);" },
            { "label": "insertionSort(arr, 2)", "detail": "n is 2, so first sort the prefix of length 1.", "code": "insertionSort(arr, 1);" },
            { "label": "insertionSort(arr, 1)", "detail": "n is 1, base case, return. The prefix {3} is sorted.", "code": "return;" },
            { "label": "insert arr[1] = 1", "detail": "1 is less than 3, so shift 3 right and place 1 first. Array is now {1, 3, 2}.", "code": "{1, 3, 2}" },
            { "label": "insert arr[2] = 2", "detail": "2 is less than 3, shift 3 right; 2 is more than 1, stop. Array is now {1, 2, 3}.", "code": "{1, 2, 3}" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In recursive insertion sort, the recursive call runs before the insert work.", "correct_answer": "true", "explanation": "You sort the first n-1 elements first, then insert the last one on the way back up." },
            { "type": "fill_in", "question": "The worst-case time complexity of insertion sort is O(n^___).", "correct_answer": "2", "explanation": "Inserting each element may shift all earlier ones, giving O(n^2)." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "insight",
          "position": "after",
          "title": "Same idea, different shape",
          "content": "Every algorithm in this unit reduces to one move: solve a smaller version, then do a little local work. Reversing a string, searching a sorted array, or sorting all reuse that reframing. Spotting self-similarity is the real skill."
        }
      ],
      "challenge_title": "Recursive Insertion Sort",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void insertionSort(int[] arr, int n) {\n        // TODO: base case; sort first n-1; insert arr[n-1]\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        insertionSort(arr, n);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < n; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(arr[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void insertionSort(int[] arr, int n) {\n        if (n <= 1) {\n            return;\n        }\n        insertionSort(arr, n - 1);\n        int last = arr[n - 1];\n        int j = n - 2;\n        while (j >= 0 && arr[j] > last) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = last;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int k = 0; k < n; k++) {\n            arr[k] = sc.nextInt();\n        }\n        insertionSort(arr, n);\n        StringBuilder sb = new StringBuilder();\n        for (int k = 0; k < n; k++) {\n            if (k > 0) sb.append(' ');\n            sb.append(arr[k]);\n        }\n        System.out.println(sb.toString());\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "5\n5 2 4 1 3",
          "expected_output": "1 2 3 4 5"
        },
        {
          "input": "4\n4 3 2 1",
          "expected_output": "1 2 3 4"
        },
        {
          "input": "3\n7 7 2",
          "expected_output": "2 7 7"
        }
      ]
    }
  ]
}
