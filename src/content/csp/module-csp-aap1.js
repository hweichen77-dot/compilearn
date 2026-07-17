export default {
  "project": {
    "id": "csp-aap1",
    "title": "Variables, Lists & Procedures",
    "description": "Big Idea 3 introduction: store data in variables, build expressions and strings, group values in lists, and package reusable logic into procedures with parameters, return values, and scope.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 103,
    "track": "apcsp",
    "unit": "Big Idea 3, Algorithms & Programming I",
    "tags": [
      "variables",
      "lists",
      "procedures"
    ]
  },
  "lessons": [
    {
      "id": "csp-aap1-l1",
      "project_id": "csp-aap1",
      "order": 1,
      "title": "Variables and Assignment",
      "concept": "Variables and Assignment",
      "xp_reward": 10,
      "explanation": "Every program needs a way to remember things, a player's score, a user's name, the running total of a bill. In AP CSP that memory comes from **variables**. A variable is a named box that holds a single value, and the value can change as the program runs.\n\n## Assignment\n\nYou put a value into a variable using an **assignment statement**. In Python the operator is `=`, read as \"gets\" or \"is set to\", not \"equals\" in the math sense.\n\n```python\nscore = 0            # create score, store 0\nscore = score + 10   # read old score (0), add 10, store 10\nname = \"Ada\"         # a variable can hold text too\n```\n\nThe right side is evaluated **first**, then the result is stored in the name on the left. So `score = score + 10` looks at the current value of `score`, adds 10, and writes the new value back. The old value is overwritten.\n\nOn the AP exam the equivalent pseudocode is `a ← expression`. The arrow makes the direction obvious: the box on the left receives the value.\n\n## Naming and data types\n\n- **Variable name**: a label you choose. Use clear names like `total`, `userAge`, `firstName`.\n- A variable's value has a **data type**. Common ones: integers (`42`), floating-point numbers (`3.14`), strings (`\"hi\"`), and Booleans (`True`/`False`).\n- Reassigning a variable replaces its value; the variable does not remember its history.\n\n## Reading input\n\nPrograms become useful when they react to data they did not know in advance. `input()` reads one line of text from the user. Because it always returns a **string**, you convert it when you need a number:\n\n```python\nraw = input()        # e.g. the user types \"7\"\nn = int(raw)         # convert string \"7\" to the integer 7\nprint(n * 2)         # 14\n```\n\nForgetting the `int()` conversion is the single most common beginner bug: `\"7\" * 2` gives `\"77\"` (string repetition), not `14`.\n\n## Why it matters\n\nVariables are the foundation of every algorithm. Loops count with them, conditionals test them, and procedures pass them around. Master assignment, value flows **right to left** into a named box that you can overwrite at any time, and the rest of programming builds cleanly on top.",
      "key_terms": [
        {
          "term": "Variable",
          "definition": "A named storage location that holds a single value, which can change as the program runs."
        },
        {
          "term": "Assignment",
          "definition": "An operation that evaluates the expression on the right and stores the result in the variable named on the left (Python `=`, AP pseudocode `←`)."
        },
        {
          "term": "Data type",
          "definition": "The kind of value a variable holds, such as integer, floating-point number, string, or Boolean."
        }
      ],
      "inline_quizzes": [
        {
          "question": "After running `x = 5` then `x = x + 3`, what is the value of `x`?",
          "options": [
            "8",
            "5",
            "3",
            "53"
          ],
          "correct_index": 0,
          "explanation": "The right side `x + 3` is evaluated using the current value 5, giving 8, which is then stored back into x."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why does `int()` appear in `n = int(input())`?",
          "options": [
            "Because input() returns a string, and int() converts it to a number for arithmetic",
            "Because input() can only read one character at a time",
            "Because int() prints the value to the screen",
            "Because variables must always be integers"
          ],
          "correct_index": 0,
          "explanation": "input() always returns a string. To do math on it you must convert with int() (or float())."
        },
        {
          "question": "In AP CSP pseudocode, what does the statement `a ← 7` mean?",
          "options": [
            "Store the value 7 in the variable a",
            "Test whether a is equal to 7",
            "Move a to the left side of the screen",
            "Create a list named a with 7 elements"
          ],
          "correct_index": 0,
          "explanation": "The left-arrow is the assignment operator; it places the value on the right into the variable on the left."
        }
      ],
      "animated_diagrams": [
        {
          "title": "How assignment flows",
          "caption": "The right side is evaluated first, then the result is stored in the name on the left.",
          "loop": false,
          "nodes": [
            { "label": "score = 0", "sub": "create box", "detail": "Make a variable named score and store the value 0 in it." },
            { "label": "Evaluate right", "sub": "score + 10", "detail": "Read the current score (0) and compute 0 + 10, which is 10." },
            { "label": "Store left", "sub": "score gets 10", "detail": "Write the result 10 back into score, overwriting the old value." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing x = 5 then x = x + 3",
          "steps": [
            { "label": "x = 5", "detail": "Store 5 in x.", "code": "x = 5" },
            { "label": "evaluate x + 3", "detail": "Read the current x (5) and add 3 to get 8.", "code": "x + 3  # 8" },
            { "label": "store back", "detail": "Write 8 into x, replacing the old 5.", "code": "x = 8" }
          ]
        }
      ],
      "callouts": [
        {
          "type": "warning",
          "position": "after",
          "title": "input() always returns text",
          "content": "Forgetting int() is the most common beginner bug. \"7\" * 2 gives \"77\", not 14, because you are repeating a string instead of doing math."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In an assignment, the expression on the right is evaluated before the value is stored on the left.", "correct_answer": "true", "explanation": "Python computes the right side first, then stores it in the variable on the left." },
            { "type": "fill_in", "question": "To turn the string \"7\" from input() into a number you use the ____() function.", "correct_answer": "int", "explanation": "int() converts a string of digits into an integer for arithmetic." }
          ]
        }
      ],
      "challenge_title": "Running Total",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer n, then read n more integers (one per line).\n# Print their sum.\n\nn = int(input())\ntotal = 0\n# TODO: loop n times, read each integer, add it to total\n\nprint(total)\n",
      "challenge_solution_code": "n = int(input())\ntotal = 0\nfor _ in range(n):\n    value = int(input())\n    total = total + value\nprint(total)\n",
      "challenge_test_cases": [
        {
          "input": "3\n10\n20\n30\n",
          "expected_output": "60"
        },
        {
          "input": "1\n5\n",
          "expected_output": "5"
        },
        {
          "input": "4\n-2\n2\n-3\n3\n",
          "expected_output": "0"
        }
      ]
    },
    {
      "id": "csp-aap1-l2",
      "project_id": "csp-aap1",
      "order": 2,
      "title": "Lists: Storing Many Values",
      "concept": "Lists and Indexing",
      "xp_reward": 10,
      "explanation": "A single variable holds one value. But what if you have 30 test scores or a class roster? Creating `score1`, `score2`, ... `score30` is hopeless. The answer is a **list**: one named variable that holds an ordered sequence of values.\n\n## Creating and indexing\n\nIn Python you write a list with square brackets:\n\n```python\nscores = [88, 92, 75, 100]\nprint(scores[0])   # 88  -> the FIRST element\nprint(scores[3])   # 100 -> the LAST element here\nprint(len(scores)) # 4   -> how many elements\n```\n\nEach value sits at a numbered position called an **index**. Python lists are **zero-indexed**: the first element is at index `0`, the second at `1`, and the last at `len(list) - 1`. Reaching past the end (here `scores[4]`) raises an error.\n\n> Note: AP exam pseudocode lists are **one-indexed**: `LIST[1]` is the first element. The idea of ordered, numbered access is identical; only the starting number differs. In runnable Python, always start from 0.\n\n## Common operations\n\n- **Access**: `scores[i]` reads the element at index `i`.\n- **Change**: `scores[0] = 90` overwrites the first element.\n- **Append**: `scores.append(64)` adds a new element to the end.\n- **Length**: `len(scores)` returns the count of elements.\n\n## Traversing a list\n\nMost list work is a **traversal**: visiting every element once, usually with a loop:\n\n```python\nscores = [88, 92, 75, 100]\ntotal = 0\nfor s in scores:        # s takes each value in turn\n    total = total + s\nprint(total)            # 355\nprint(total / len(scores))  # 88.75  (the average)\n```\n\nThe `for s in scores` form hands you each value directly. When you need positions instead, use `for i in range(len(scores))` and access `scores[i]`.\n\n## Why it matters\n\nLists turn a pile of related data into something a single loop can process. Almost every algorithm you will write, summing, searching, finding a maximum, filtering, is built on a list traversal. Once you can store many values together and walk through them, you can manage data sets of any size with the same short block of code.",
      "key_terms": [
        {
          "term": "List",
          "definition": "An ordered collection of values stored under one variable name, accessible by position."
        },
        {
          "term": "Index",
          "definition": "The numbered position of an element in a list; Python lists start at index 0."
        },
        {
          "term": "Traversal",
          "definition": "Visiting each element of a list in order, typically using a loop."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Given `nums = [4, 8, 15, 16]`, what does `nums[2]` evaluate to?",
          "options": [
            "15",
            "8",
            "16",
            "2"
          ],
          "correct_index": 0,
          "explanation": "Python is zero-indexed, so index 0 is 4, index 1 is 8, and index 2 is 15."
        }
      ],
      "quiz_questions": [
        {
          "question": "What does `len(x)` return for the list `x = [10, 20, 30]`?",
          "options": [
            "3",
            "2",
            "30",
            "60"
          ],
          "correct_index": 0,
          "explanation": "len() returns the number of elements, which is 3, regardless of their values."
        },
        {
          "question": "Which loop visits every value in `data` and adds it to `total`?",
          "options": [
            "for v in data: total = total + v",
            "for v in data: total = v",
            "if data: total = total + data",
            "while data: total = total + len(data)"
          ],
          "correct_index": 0,
          "explanation": "`for v in data` is a traversal that binds v to each element in turn; adding v each pass accumulates the sum."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Traversing a list to build a total",
          "caption": "A loop visits each element in turn and adds it to a running total.",
          "loop": true,
          "nodes": [
            { "label": "total = 0", "sub": "start", "detail": "Begin with a running total of 0 before visiting any element." },
            { "label": "s = 88", "sub": "total = 88", "detail": "The loop binds s to the first element, 88, and adds it." },
            { "label": "s = 92", "sub": "total = 180", "detail": "s becomes the next element, 92, so total grows to 180." },
            { "label": "s = 75", "sub": "total = 255", "detail": "Add 75, giving 255." },
            { "label": "s = 100", "sub": "total = 355", "detail": "Add the last element, 100, for a final total of 355." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Indexing nums = [4, 8, 15, 16]",
          "steps": [
            { "label": "nums[0]", "detail": "Index 0 is the first element.", "code": "nums[0]  # 4" },
            { "label": "nums[1]", "detail": "Index 1 is the second element.", "code": "nums[1]  # 8" },
            { "label": "nums[2]", "detail": "Index 2 is the third element, since counting starts at 0.", "code": "nums[2]  # 15" }
          ]
        }
      ],
      "callouts": [
        {
          "type": "warning",
          "position": "after",
          "title": "AP pseudocode counts from 1",
          "content": "Python lists start at index 0, but AP exam pseudocode starts at 1, so LIST[1] is the first element there. The idea is the same; only the starting number differs."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In Python, the first element of a list is at index 0.", "correct_answer": "true", "explanation": "Python lists are zero-indexed, so the first element is index 0 and the last is len(list) - 1." },
            { "type": "fill_in", "question": "The function that returns how many elements a list holds is ____().", "correct_answer": "len", "explanation": "len(list) returns the count of elements." }
          ]
        }
      ],
      "challenge_title": "Largest in the List",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: an integer n.\n# Second line: n space-separated integers.\n# Print the largest of those integers.\n\nn = int(input())\nnums = list(map(int, input().split()))\n# TODO: find and print the largest value (do not use max())\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\nlargest = nums[0]\nfor v in nums:\n    if v > largest:\n        largest = v\nprint(largest)\n",
      "challenge_test_cases": [
        {
          "input": "5\n3 9 2 7 4\n",
          "expected_output": "9"
        },
        {
          "input": "1\n42\n",
          "expected_output": "42"
        },
        {
          "input": "4\n-5 -1 -8 -3\n",
          "expected_output": "-1"
        }
      ]
    },
    {
      "id": "csp-aap1-l3",
      "project_id": "csp-aap1",
      "order": 3,
      "title": "Expressions and Operators",
      "concept": "Arithmetic Expressions",
      "xp_reward": 10,
      "explanation": "Variables store values, but the real work of a program happens when you **combine** those values. An **expression** is any piece of code that evaluates to a single value: `3 + 4`, `price * quantity`, or `total / count` are all expressions. The pieces that combine values are **operators**.\n\n## Arithmetic operators\n\nPython gives you the math operators you expect, plus two that trip up beginners:\n\n```python\nprint(7 + 2)   # 9   addition\nprint(7 - 2)   # 5   subtraction\nprint(7 * 2)   # 14  multiplication\nprint(7 / 2)   # 3.5 true division (always a float)\nprint(7 // 2)  # 3   integer (floor) division\nprint(7 % 2)   # 1   modulo: the remainder\n```\n\nTwo operators do the heavy lifting in countless algorithms:\n\n- **`//` integer division** drops the fractional part: `17 // 5` is `3`.\n- **`%` modulo** gives the remainder: `17 % 5` is `2`. Modulo answers \"is this even?\" (`n % 2 == 0`), \"every 3rd item?\" (`i % 3 == 0`), and \"what digit?\".\n\n## Order of operations\n\nExpressions follow **precedence** rules, just like math class: `*`, `/`, `//`, `%` happen before `+` and `-`. Use parentheses to force the order you want:\n\n```python\nprint(2 + 3 * 4)     # 14, because 3*4 happens first\nprint((2 + 3) * 4)   # 20, parentheses win\n```\n\nWhen unsure, **add parentheses**: they cost nothing and make intent clear.\n\n## Building useful values\n\nA classic pattern: split a total amount into whole units and a remainder.\n\n```python\ncents = 287\ndollars = cents // 100   # 2\nleftover = cents % 100   # 87\nprint(dollars, \"dollars and\", leftover, \"cents\")\n```\n\n## Why it matters\n\nEvery calculation an algorithm performs, averaging scores, converting units, deciding parity, wrapping an index around a list, is an expression built from operators. Knowing the difference between `/` and `//`, remembering what `%` returns, and respecting precedence are the small skills that prevent the most common arithmetic bugs.",
      "key_terms": [
        {
          "term": "Expression",
          "definition": "A piece of code that evaluates to a single value, such as `3 + 4` or `price * qty`."
        },
        {
          "term": "Modulo (%)",
          "definition": "An operator that returns the remainder of integer division; `17 % 5` is 2."
        },
        {
          "term": "Operator precedence",
          "definition": "The order in which operators are applied; multiplication and division run before addition and subtraction unless parentheses override them."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does `17 % 5` evaluate to?",
          "options": [
            "2",
            "3",
            "3.4",
            "12"
          ],
          "correct_index": 0,
          "explanation": "Modulo returns the remainder: 17 divided by 5 is 3 with a remainder of 2."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the value of `2 + 3 * 4` in Python?",
          "options": [
            "14",
            "20",
            "24",
            "9"
          ],
          "correct_index": 0,
          "explanation": "Multiplication has higher precedence, so 3*4 = 12 is computed first, then 2 + 12 = 14."
        },
        {
          "question": "Which operator gives the whole-number part of a division, discarding the remainder?",
          "options": [
            "//",
            "/",
            "%",
            "**"
          ],
          "correct_index": 0,
          "explanation": "`//` is integer (floor) division, so `7 // 2` is 3. `/` gives 3.5 and `%` gives the remainder."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Evaluating 2 + 3 * 4",
          "caption": "Precedence rules decide the order: multiplication runs before addition.",
          "loop": false,
          "nodes": [
            { "label": "2 + 3 * 4", "sub": "full expression", "detail": "Two operators appear, so precedence decides which runs first." },
            { "label": "3 * 4", "sub": "higher precedence", "detail": "Multiplication happens before addition, so compute 3 * 4 = 12." },
            { "label": "2 + 12", "sub": "then add", "detail": "Now add 2 to the result 12." },
            { "label": "14", "sub": "final value", "detail": "The expression evaluates to 14, not 20." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Splitting 287 cents",
          "steps": [
            { "label": "287 // 100", "detail": "Integer division drops the fraction, giving whole dollars.", "code": "dollars = 287 // 100  # 2" },
            { "label": "287 % 100", "detail": "Modulo returns the remainder, the leftover cents.", "code": "leftover = 287 % 100  # 87" },
            { "label": "print", "detail": "Report the two pieces together.", "code": "print(dollars, \"dollars and\", leftover, \"cents\")" }
          ]
        }
      ],
      "callouts": [
        {
          "type": "tip",
          "position": "after",
          "title": "When unsure, add parentheses",
          "content": "Parentheses cost nothing and make your intent obvious. (2 + 3) * 4 is 20, while 2 + 3 * 4 is 14. Spell out the order you mean."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "7 / 2 gives 3.5 while 7 // 2 gives 3.", "correct_answer": "true", "explanation": "The single slash is true division (a float); the double slash is floor division." },
            { "type": "fill_in", "question": "The operator that returns the remainder of a division is called ____.", "correct_answer": "modulo", "explanation": "Modulo (%) gives the remainder, so 17 % 5 is 2." }
          ]
        }
      ],
      "challenge_title": "Cents to Dollars",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer: a total number of cents.\n# Print it as: <dollars> dollars and <cents> cents\n# Example: 287 -> 2 dollars and 87 cents\n\ncents = int(input())\n# TODO: use // and % to split into dollars and leftover cents, then print\n",
      "challenge_solution_code": "cents = int(input())\ndollars = cents // 100\nleftover = cents % 100\nprint(dollars, \"dollars and\", leftover, \"cents\")\n",
      "challenge_test_cases": [
        {
          "input": "287\n",
          "expected_output": "2 dollars and 87 cents"
        },
        {
          "input": "5\n",
          "expected_output": "0 dollars and 5 cents"
        },
        {
          "input": "1000\n",
          "expected_output": "10 dollars and 0 cents"
        }
      ]
    },
    {
      "id": "csp-aap1-l4",
      "project_id": "csp-aap1",
      "order": 4,
      "title": "Working with Strings",
      "concept": "Strings and String Operations",
      "xp_reward": 10,
      "explanation": "A **string** is a sequence of characters, text like `\"Hello\"`, `\"42\"`, or even an empty `\"\"`. Strings are how programs handle names, messages, and any data made of letters and symbols.\n\n## Strings are ordered like lists\n\nCharacters in a string have **indexes**, exactly like list elements. Zero-indexed, with negative indexes counting from the end:\n\n```python\ns = \"PYTHON\"\nprint(s[0])    # P   first character\nprint(s[-1])   # N   last character\nprint(len(s))  # 6   number of characters\n```\n\nBecause they are ordered sequences, you can **traverse** a string with a loop:\n\n```python\nfor ch in \"cat\":\n    print(ch)      # prints c, then a, then t\n```\n\n## Common string operations\n\n- **Concatenation** with `+` joins strings: `\"Ada\" + \" \" + \"Lovelace\"` → `\"Ada Lovelace\"`.\n- **Repetition** with `*`: `\"ab\" * 3` → `\"ababab\"`.\n- **Length**: `len(s)` counts characters.\n- **Case**: `s.upper()` and `s.lower()` return new strings; the original is unchanged.\n- **Slicing**: `s[1:4]` takes characters 1 up to (not including) 4. `s[::-1]` reverses the whole string.\n\n```python\nname = \"ada\"\nprint(name.upper())      # ADA\nprint(name + \" lovelace\")# ada lovelace\nprint(name[::-1])        # ada -> reversed\n```\n\n## Strings are immutable\n\nYou cannot change a character in place: `name[0] = \"A\"` raises an error. Instead you **build a new string**. To count or transform characters, loop and accumulate:\n\n```python\ns = \"banana\"\ncount = 0\nfor ch in s:\n    if ch == \"a\":\n        count = count + 1\nprint(count)   # 3\n```\n\n## Why it matters\n\nReal data is full of text: usernames, sentences, DNA sequences, file contents. Treating a string as an ordered, traversable sequence, combined with concatenation, slicing, and case methods, lets you validate input, format output, and search text. These are the same traversal skills you learned for lists, now applied to characters.",
      "key_terms": [
        {
          "term": "String",
          "definition": "An ordered sequence of characters, written in quotes, such as \"hello\"."
        },
        {
          "term": "Concatenation",
          "definition": "Joining two strings end-to-end using the `+` operator."
        },
        {
          "term": "Immutable",
          "definition": "Cannot be changed in place; string operations create new strings rather than modifying the original."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does `\"ab\" * 3` produce?",
          "options": [
            "\"ababab\"",
            "\"ab3\"",
            "6",
            "\"ab ab ab\""
          ],
          "correct_index": 0,
          "explanation": "The `*` operator repeats a string; \"ab\" repeated 3 times is \"ababab\" with no spaces."
        }
      ],
      "quiz_questions": [
        {
          "question": "For `s = \"CODE\"`, what does `s[-1]` evaluate to?",
          "options": [
            "\"E\"",
            "\"C\"",
            "\"D\"",
            "An error"
          ],
          "correct_index": 0,
          "explanation": "Negative indexes count from the end, so s[-1] is the last character, \"E\"."
        },
        {
          "question": "Why does `name[0] = \"A\"` cause an error in Python?",
          "options": [
            "Strings are immutable, so individual characters cannot be reassigned",
            "Index 0 does not exist",
            "You must use parentheses instead of brackets",
            "Strings can only be read with input()"
          ],
          "correct_index": 0,
          "explanation": "Strings are immutable. To 'change' a string you build a new one rather than modifying it in place."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Traversing a string to count a letter",
          "caption": "A loop visits each character in turn, and you accumulate a count as you go.",
          "loop": true,
          "nodes": [
            { "label": "count = 0", "sub": "start", "detail": "Begin with a count of 0 before reading any character." },
            { "label": "'b','n','n'", "sub": "not 'a'", "detail": "These characters of banana are not 'a', so the count stays the same." },
            { "label": "each 'a'", "sub": "count += 1", "detail": "Every time the character is 'a', add 1 to the count." },
            { "label": "count = 3", "sub": "done", "detail": "banana has three a's, so the final count is 3." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Indexing s = \"PYTHON\"",
          "steps": [
            { "label": "s[0]", "detail": "Index 0 is the first character.", "code": "s[0]  # 'P'" },
            { "label": "s[-1]", "detail": "Negative indexes count from the end, so -1 is the last character.", "code": "s[-1]  # 'N'" },
            { "label": "s[::-1]", "detail": "A slice with step -1 walks the string backward, reversing it.", "code": "s[::-1]  # 'NOHTYP'" }
          ]
        }
      ],
      "callouts": [
        {
          "type": "warning",
          "position": "after",
          "title": "Strings are immutable",
          "content": "You cannot change a character in place. name[0] = \"A\" raises an error. To change a string you build a new one instead."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "\"ab\" * 3 produces \"ababab\".", "correct_answer": "true", "explanation": "The * operator repeats a string, joining the copies with no spaces." },
            { "type": "fill_in", "question": "Joining two strings end to end with the + operator is called ____.", "correct_answer": "concatenation", "explanation": "Concatenation combines strings, so \"Ada\" + \" Lovelace\" is \"Ada Lovelace\"." }
          ]
        }
      ],
      "challenge_title": "Reverse and Count Vowels",
      "challenge_language": "python",
      "challenge_starter_code": "# Read one line of text.\n# Print the string reversed on the first line.\n# Print the number of vowels (a, e, i, o, u, any case) on the second line.\n\ns = input()\n# TODO: print the reversed string, then the vowel count\n",
      "challenge_solution_code": "s = input()\nprint(s[::-1])\nvowels = 0\nfor ch in s:\n    if ch.lower() in \"aeiou\":\n        vowels = vowels + 1\nprint(vowels)\n",
      "challenge_test_cases": [
        {
          "input": "programming\n",
          "expected_output": "gnimmargorp\n3"
        },
        {
          "input": "AEIOU\n",
          "expected_output": "UOIEA\n5"
        },
        {
          "input": "xyz\n",
          "expected_output": "zyx\n0"
        }
      ]
    },
    {
      "id": "csp-aap1-l5",
      "project_id": "csp-aap1",
      "order": 5,
      "title": "List Operations: Build and Modify",
      "concept": "Mutating and Filtering Lists",
      "xp_reward": 10,
      "explanation": "Reading a list is only half the story. Real programs **grow, shrink, sort, and filter** their data. Unlike strings, Python lists are **mutable**: you can change them in place.\n\n## Adding and removing\n\n```python\nitems = [3, 1, 4]\nitems.append(1)      # [3, 1, 4, 1]  add to the end\nitems.insert(0, 9)   # [9, 3, 1, 4, 1]  insert at index 0\nitems.remove(4)      # [9, 3, 1, 1]  remove first 4\nlast = items.pop()   # last = 1, list is now [9, 3, 1]\n```\n\n- **`append(x)`** adds `x` to the end, the most common list operation.\n- **`insert(i, x)`** puts `x` at index `i`, shifting later elements right.\n- **`remove(x)`** deletes the first element equal to `x`.\n- **`pop()`** removes and returns the last element.\n\n## Sorting and reordering\n\n```python\nnums = [3, 1, 4, 1, 5]\nnums.sort()        # [1, 1, 3, 4, 5]  in-place, ascending\nnums.reverse()     # [5, 4, 3, 1, 1]\n```\n\n`sort()` changes the list itself and returns `None`, so never write `nums = nums.sort()`, that would store `None`.\n\n## Filtering with a new list\n\nOften you want a list *derived* from another: only the even numbers, or everything except a target. Build a fresh list as you traverse:\n\n```python\nnums = [4, 2, 4, 1, 4]\nkept = []\nfor v in nums:\n    if v != 4:\n        kept.append(v)\nprint(kept)   # [2, 1]\n```\n\nPython also offers a **list comprehension** as a compact form of the same idea:\n\n```python\nkept = [v for v in nums if v != 4]   # [2, 1]\n```\n\n## Joining for output\n\nTo print a list of numbers as a space-separated line, convert each to a string and join:\n\n```python\nprint(\" \".join(str(v) for v in kept))   # \"2 1\"\n```\n\n## Why it matters\n\nFiltering, sorting, and appending are the verbs of data processing. A search engine filters results, a leaderboard sorts scores, a shopping cart appends items. Mastering in-place mutation versus building a new list, and knowing which methods return `None`, keeps your data transformations correct.",
      "key_terms": [
        {
          "term": "Mutable",
          "definition": "Able to be changed in place; lists can be modified after creation, unlike strings."
        },
        {
          "term": "append",
          "definition": "A list method that adds a single element to the end of the list."
        },
        {
          "term": "List comprehension",
          "definition": "A compact expression that builds a new list by traversing and filtering an existing sequence, e.g. `[v for v in nums if v != 4]`."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is wrong with `nums = nums.sort()`?",
          "options": [
            "sort() returns None, so nums would become None instead of the sorted list",
            "sort() does not exist for lists",
            "It sorts in descending order by mistake",
            "Nothing is wrong with it"
          ],
          "correct_index": 0,
          "explanation": "sort() sorts the list in place and returns None, so assigning its result throws away the list."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which method adds an element to the END of a list?",
          "options": [
            "append",
            "insert",
            "remove",
            "pop"
          ],
          "correct_index": 0,
          "explanation": "append(x) adds x to the end. insert places at an index, remove deletes, and pop removes the last element."
        },
        {
          "question": "After `data = [5, 2]; data.insert(1, 9)`, what is `data`?",
          "options": [
            "[5, 9, 2]",
            "[9, 5, 2]",
            "[5, 2, 9]",
            "[5, 9]"
          ],
          "correct_index": 0,
          "explanation": "insert(1, 9) places 9 at index 1, shifting 2 to the right, giving [5, 9, 2]."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Filtering into a new list",
          "caption": "Traverse the original and append only the values you want to keep.",
          "loop": true,
          "nodes": [
            { "label": "kept = []", "sub": "empty result", "detail": "Start a fresh empty list to hold the values you keep." },
            { "label": "v = 4", "sub": "skip", "detail": "The value equals the target 4, so do not append it." },
            { "label": "v = 2", "sub": "keep", "detail": "2 is not the target, so append it to kept." },
            { "label": "v = 1", "sub": "keep", "detail": "1 is not the target, so append it too." },
            { "label": "kept = [2, 1]", "sub": "result", "detail": "After visiting every value, kept holds only the survivors." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing data = [5, 2]; data.insert(1, 9)",
          "steps": [
            { "label": "start", "detail": "The list holds 5 at index 0 and 2 at index 1.", "code": "data = [5, 2]" },
            { "label": "insert(1, 9)", "detail": "Place 9 at index 1, shifting 2 to the right.", "code": "data.insert(1, 9)" },
            { "label": "result", "detail": "The list is now [5, 9, 2].", "code": "# [5, 9, 2]" }
          ]
        }
      ],
      "callouts": [
        {
          "type": "warning",
          "position": "after",
          "title": "sort() returns None",
          "content": "Never write nums = nums.sort(). sort() reorders the list in place and hands back None, so that line would replace your list with None."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Python lists are mutable, so you can change them in place after creating them.", "correct_answer": "true", "explanation": "Unlike strings, lists can be modified in place with methods like append and sort." },
            { "type": "fill_in", "question": "The list method that adds a single element to the end of a list is ____.", "correct_answer": "append", "explanation": "append(x) adds x to the end, the most common list operation." }
          ]
        }
      ],
      "challenge_title": "Remove All Occurrences",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: an integer n.\n# Second line: n space-separated integers.\n# Third line: a target integer.\n# Print the list with EVERY occurrence of the target removed,\n# as a space-separated line (print an empty line if nothing remains).\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# TODO: build a new list without the target and print it space-separated\n",
      "challenge_solution_code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nkept = []\nfor v in nums:\n    if v != target:\n        kept.append(v)\nprint(\" \".join(str(v) for v in kept))\n",
      "challenge_test_cases": [
        {
          "input": "6\n4 2 4 1 4 3\n4\n",
          "expected_output": "2 1 3"
        },
        {
          "input": "3\n1 2 3\n9\n",
          "expected_output": "1 2 3"
        },
        {
          "input": "4\n7 7 7 7\n7\n",
          "expected_output": ""
        }
      ]
    },
    {
      "id": "csp-aap1-l6",
      "project_id": "csp-aap1",
      "order": 6,
      "title": "Procedures and Parameters",
      "concept": "Defining and Calling Procedures",
      "xp_reward": 10,
      "explanation": "As programs grow, copying the same block of code in five places becomes a maintenance nightmare. A **procedure** (called a *function* in Python) solves this: you write a named, reusable chunk of logic once and **call** it whenever you need it.\n\n## Defining and calling\n\n```python\ndef greet():\n    print(\"Hello!\")\n\ngreet()   # the call -> prints Hello!\ngreet()   # call again -> prints Hello! again\n```\n\n`def` defines the procedure; `greet()` runs it. This is **abstraction**: the caller uses the name and does not care how the body works.\n\n## Parameters and arguments\n\nProcedures get flexible when you pass data in. A **parameter** is a placeholder named in the definition; an **argument** is the actual value you supply at the call.\n\n```python\ndef square(num):     # num is the parameter\n    print(num * num)\n\nsquare(5)            # 5 is the argument -> prints 25\nsquare(9)            # prints 81\n```\n\nThe argument `5` is copied into the parameter `num` for that one call. Different arguments produce different behavior from the same code.\n\n## Multiple parameters\n\nA procedure can take several parameters, matched by position:\n\n```python\ndef rectangle_area(width, height):\n    print(width * height)\n\nrectangle_area(3, 4)   # width=3, height=4 -> 12\n```\n\nOrder matters: the first argument fills the first parameter, the second fills the second, and so on. The AP pseudocode equivalent is `PROCEDURE rectangleArea(width, height)`, same idea of named inputs.\n\n## Why it matters\n\nProcedures are how programmers manage complexity. They let you:\n\n- **Reuse** logic instead of duplicating it.\n- **Name** an idea so code reads like its intent.\n- **Hide detail** behind a clean interface, the heart of abstraction in Big Idea 3.\n\nIn this lesson the procedure does its work by printing. In the next lesson you will make procedures hand a result back so the caller can keep computing with it.",
      "key_terms": [
        {
          "term": "Procedure",
          "definition": "A named, reusable block of code (a function in Python) defined once and called when needed."
        },
        {
          "term": "Parameter",
          "definition": "A named placeholder in a procedure's definition that receives an argument value when the procedure is called."
        },
        {
          "term": "Argument",
          "definition": "The actual value passed to a procedure at the call site, copied into the matching parameter."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In `def f(a, b): print(a - b)`, what does the call `f(10, 3)` print?",
          "options": [
            "7",
            "13",
            "-7",
            "30"
          ],
          "correct_index": 0,
          "explanation": "Arguments match by position: a=10, b=3, so a - b prints 7."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the difference between a parameter and an argument?",
          "options": [
            "A parameter is the placeholder in the definition; an argument is the actual value passed at the call",
            "They are two words for exactly the same thing",
            "A parameter is returned; an argument is printed",
            "An argument is defined with def; a parameter is not"
          ],
          "correct_index": 0,
          "explanation": "The definition lists parameters; the call supplies arguments that are copied into those parameters."
        },
        {
          "question": "In `def area(w, h)`, which call passes 5 as the width?",
          "options": [
            "area(5, 2)",
            "area(2, 5)",
            "area(h=5)",
            "area(w*5)"
          ],
          "correct_index": 0,
          "explanation": "Arguments are matched by position, so area(5, 2) sets w=5 and h=2."
        }
      ],
      "animated_diagrams": [
        {
          "title": "How a call passes data in",
          "caption": "The argument at the call is copied into the parameter, then the body runs with it.",
          "loop": false,
          "nodes": [
            { "label": "square(5)", "sub": "the call", "detail": "You call square with the argument 5." },
            { "label": "num = 5", "sub": "copy in", "detail": "The argument 5 is copied into the parameter num for this call." },
            { "label": "num * num", "sub": "run body", "detail": "The body computes 5 * 5 using num." },
            { "label": "prints 25", "sub": "result", "detail": "The procedure prints 25, its output for this argument." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Calling rectangle_area(3, 4)",
          "steps": [
            { "label": "match by position", "detail": "The first argument fills the first parameter.", "code": "width = 3" },
            { "label": "second parameter", "detail": "The second argument fills the second parameter.", "code": "height = 4" },
            { "label": "run body", "detail": "Compute width * height with those values.", "code": "print(3 * 4)  # 12" }
          ]
        }
      ],
      "callouts": [
        {
          "type": "insight",
          "position": "after",
          "title": "Same code, different behavior",
          "content": "One procedure serves many cases because the arguments change what it works on. square(5) prints 25 and square(9) prints 81 from the exact same three lines."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Arguments are matched to parameters by position, so the first argument fills the first parameter.", "correct_answer": "true", "explanation": "Positional arguments fill parameters left to right." },
            { "type": "fill_in", "question": "The named placeholder listed in a procedure's definition is called a ____.", "correct_answer": "parameter", "explanation": "A parameter is the placeholder; the value passed at the call is the argument." }
          ]
        }
      ],
      "challenge_title": "Rectangle Stats",
      "challenge_language": "python",
      "challenge_starter_code": "# Read two integers: width and height (one per line).\n# Print the area on the first line and the perimeter on the second line.\n# Use a procedure that takes width and height as parameters.\n\ndef area(width, height):\n    # TODO: return the area\n    pass\n\ndef perimeter(width, height):\n    # TODO: return the perimeter\n    pass\n\nw = int(input())\nh = int(input())\nprint(area(w, h))\nprint(perimeter(w, h))\n",
      "challenge_solution_code": "def area(width, height):\n    return width * height\n\ndef perimeter(width, height):\n    return 2 * (width + height)\n\nw = int(input())\nh = int(input())\nprint(area(w, h))\nprint(perimeter(w, h))\n",
      "challenge_test_cases": [
        {
          "input": "3\n4\n",
          "expected_output": "12\n14"
        },
        {
          "input": "5\n5\n",
          "expected_output": "25\n20"
        },
        {
          "input": "10\n1\n",
          "expected_output": "10\n22"
        }
      ]
    },
    {
      "id": "csp-aap1-l7",
      "project_id": "csp-aap1",
      "order": 7,
      "title": "Return Values",
      "concept": "Returning Results from Procedures",
      "xp_reward": 10,
      "explanation": "A procedure that only prints is a dead end, the result vanishes to the screen and the program cannot reuse it. A **return value** sends a result back to the caller so computation can continue.\n\n## return hands a value back\n\n```python\ndef square(num):\n    return num * num     # hand the result back\n\nresult = square(6)       # result now holds 36\nprint(result + 4)        # 40, we can keep computing\n```\n\nWhen Python reaches `return`, the procedure **ends immediately** and the call expression *becomes* that value. So `square(6)` literally turns into `36` wherever it appears. A procedure with no `return` hands back the special value `None`.\n\n## Return vs. print\n\nThis distinction is the most important idea in the unit:\n\n- **`print(x)`** shows `x` to the user, then forgets it.\n- **`return x`** gives `x` back to the program so you can store it, add to it, or pass it on.\n\n```python\ndef double_print(n):\n    print(n * 2)     # shows it, returns None\n\ndef double_return(n):\n    return n * 2     # gives it back\n\nx = double_return(5)   # x = 10, usable\ny = double_print(5)    # prints 10, but y = None\n```\n\n## Returning from a loop\n\nProcedures often compute over many inputs and return one answer. A procedure that finds the maximum of three numbers compares and returns:\n\n```python\ndef max_of_three(a, b, c):\n    largest = a\n    if b > largest:\n        largest = b\n    if c > largest:\n        largest = c\n    return largest\n\nprint(max_of_three(3, 9, 5))   # 9\n```\n\nThe AP pseudocode form is `PROCEDURE maxOfThree(a, b, c) { ... RETURN(largest) }`, identical parameter-in, value-out shape.\n\n## Why it matters\n\nReturn values let procedures compose: the output of one becomes the input of another. `total = sum(filter(parse(data)))` only works because each procedure returns something usable. Returning rather than printing is what turns isolated procedures into building blocks for larger algorithms.",
      "key_terms": [
        {
          "term": "Return value",
          "definition": "The result a procedure hands back to its caller, allowing the call to be used in further computation."
        },
        {
          "term": "return statement",
          "definition": "A statement that ends a procedure immediately and sends a value back to the caller."
        },
        {
          "term": "None",
          "definition": "The special value a Python procedure returns when it has no explicit return statement."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does `result` hold after `def f(x): return x + 1` and `result = f(7)`?",
          "options": [
            "8",
            "7",
            "None",
            "x + 1"
          ],
          "correct_index": 0,
          "explanation": "7 is passed in as x, the procedure returns x + 1 = 8, and that value is stored in result."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the key difference between `return x` and `print(x)` inside a procedure?",
          "options": [
            "return gives the value back to the program to reuse; print only displays it",
            "They do exactly the same thing",
            "print can return a value but return cannot",
            "return only works with strings"
          ],
          "correct_index": 0,
          "explanation": "return hands the value back so the caller can store or compute with it; print just shows it and yields None."
        },
        {
          "question": "What happens immediately after Python executes a `return` statement?",
          "options": [
            "The procedure ends and control goes back to the caller",
            "The next line in the procedure still runs",
            "The program stops entirely",
            "The returned value is printed automatically"
          ],
          "correct_index": 0,
          "explanation": "return ends the procedure at once; any code after it in the procedure is skipped."
        }
      ],
      "animated_diagrams": [
        {
          "title": "What return does",
          "caption": "return hands a value back so the call expression becomes that value.",
          "loop": false,
          "nodes": [
            { "label": "square(6)", "sub": "the call", "detail": "You call square with the argument 6." },
            { "label": "return 36", "sub": "hand back", "detail": "The body computes 6 * 6 and returns 36, ending the procedure at once." },
            { "label": "result = 36", "sub": "becomes value", "detail": "The call square(6) becomes 36, which is stored in result." },
            { "label": "result + 4", "sub": "keep computing", "detail": "Because you got the value back, you can keep working: 36 + 4 = 40." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing max_of_three(3, 9, 5)",
          "steps": [
            { "label": "largest = a", "detail": "Start by assuming the first value, 3, is largest.", "code": "largest = 3" },
            { "label": "check b", "detail": "9 > 3 is True, so update largest to 9.", "code": "largest = 9" },
            { "label": "check c", "detail": "5 > 9 is False, so largest stays 9.", "code": "# largest still 9" },
            { "label": "return", "detail": "Hand back the largest value.", "code": "return 9" }
          ]
        }
      ],
      "comparison_tables": [
        {
          "title": "return vs print",
          "columns": ["Aspect", "return x", "print(x)"],
          "rows": [
            ["What it does", "Hands x back to the program", "Shows x on the screen"],
            ["Can you reuse the value?", "Yes, store or compute with it", "No, it is gone after display"],
            ["Value of the call", "Becomes x", "Becomes None"]
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "A procedure with no return statement hands back the value None.", "correct_answer": "true", "explanation": "Without an explicit return, Python returns None." },
            { "type": "fill_in", "question": "The statement that ends a procedure and sends a value back to the caller is the ____ statement.", "correct_answer": "return", "explanation": "return ends the procedure immediately and passes a value back." }
          ]
        }
      ],
      "challenge_title": "Max of Three",
      "challenge_language": "python",
      "challenge_starter_code": "# Read one line with three space-separated integers.\n# Use a procedure that RETURNS the largest of three numbers, then print it.\n# Do not use the built-in max().\n\ndef max_of_three(a, b, c):\n    # TODO: return the largest of a, b, c\n    pass\n\na, b, c = map(int, input().split())\nprint(max_of_three(a, b, c))\n",
      "challenge_solution_code": "def max_of_three(a, b, c):\n    largest = a\n    if b > largest:\n        largest = b\n    if c > largest:\n        largest = c\n    return largest\n\na, b, c = map(int, input().split())\nprint(max_of_three(a, b, c))\n",
      "challenge_test_cases": [
        {
          "input": "3 9 5\n",
          "expected_output": "9"
        },
        {
          "input": "10 10 2\n",
          "expected_output": "10"
        },
        {
          "input": "-1 -7 -4\n",
          "expected_output": "-1"
        }
      ]
    },
    {
      "id": "csp-aap1-l8",
      "project_id": "csp-aap1",
      "order": 8,
      "title": "Variable Scope",
      "concept": "Local and Global Scope",
      "xp_reward": 10,
      "explanation": "When you define variables inside procedures, where do they live, and who can see them? The answer is **scope**: the region of a program where a variable name is valid. Getting scope right is what makes procedures safe, reusable building blocks.\n\n## Local variables\n\nA variable created **inside** a procedure is **local** to that procedure. It is born when the call starts and disappears when the call ends. Code outside cannot see it.\n\n```python\ndef add_tax(price):\n    rate = 0.10           # local to add_tax\n    return price + price * rate\n\nprint(add_tax(100))       # 110.0\nprint(rate)               # ERROR: rate is not defined out here\n```\n\nParameters are local too: `price` exists only during the call. This **isolation** is a feature, two procedures can both use a variable named `total` without interfering, because each `total` lives in its own scope.\n\n## Global variables\n\nA variable defined at the top level of the program is **global**. Procedures can *read* a global value, but assigning to that name inside a procedure creates a **new local** variable instead of changing the global one:\n\n```python\ncount = 0\n\ndef bump():\n    count = count + 1   # ERROR / creates confusion\n\n```\n\nBecause of this, the clean style, and the one AP CSP teaches, is to **pass values in as parameters and return results out**, rather than reaching for globals.\n\n## Why isolation matters\n\nConsider two procedures that each loop with a counter `i`:\n\n```python\ndef count_up(n):\n    line = \"\"\n    for i in range(1, n + 1):\n        line = line + str(i) + \" \"\n    return line.strip()\n\nprint(count_up(3))   # \"1 2 3\"\n```\n\nThe `i` and `line` here cannot collide with an `i` or `line` anywhere else. That guarantee is exactly what lets you combine many procedures into a large program without their internals stepping on each other.\n\n## Why it matters\n\nScope is the rule that makes **abstraction** trustworthy. Because a procedure's locals stay private, you can use a procedure by its name and contract, its parameters and return value, without worrying about what variables it uses inside. That is the foundation for building big programs out of small, independent pieces.",
      "key_terms": [
        {
          "term": "Scope",
          "definition": "The region of a program where a particular variable name is valid and accessible."
        },
        {
          "term": "Local variable",
          "definition": "A variable created inside a procedure; it exists only during that call and is invisible outside it."
        },
        {
          "term": "Global variable",
          "definition": "A variable defined at the top level of a program, readable inside procedures but best passed via parameters."
        }
      ],
      "inline_quizzes": [
        {
          "question": "A variable created inside a procedure is visible...",
          "options": [
            "Only inside that procedure, during its call",
            "Everywhere in the whole program",
            "Only after the procedure returns",
            "Only inside other procedures"
          ],
          "correct_index": 0,
          "explanation": "Local variables exist only within their procedure and only while it is running; outside code cannot see them."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is passing parameters and returning values preferred over using global variables?",
          "options": [
            "It keeps procedures isolated and reusable, so their internals can't accidentally interfere",
            "Global variables are not allowed in Python",
            "Parameters run faster than every other operation",
            "Return values are required for a program to compile"
          ],
          "correct_index": 0,
          "explanation": "Local scope plus parameters/returns keeps each procedure self-contained, which is the basis of safe abstraction."
        },
        {
          "question": "Two different procedures each use a local variable named `total`. What happens?",
          "options": [
            "Each `total` is independent because each lives in its own scope",
            "They share the same value and overwrite each other",
            "Python raises a naming conflict error",
            "Only the first procedure's `total` works"
          ],
          "correct_index": 0,
          "explanation": "Local variables are private to their procedure, so two same-named locals never interfere."
        }
      ],
      "animated_diagrams": [
        {
          "title": "The life of a local variable",
          "caption": "A variable made inside a procedure is born at the call and gone when it ends.",
          "loop": true,
          "nodes": [
            { "label": "call add_tax", "sub": "scope opens", "detail": "Calling the procedure creates a fresh private scope for this call." },
            { "label": "rate = 0.10", "sub": "local born", "detail": "rate is created inside the procedure and only exists here." },
            { "label": "return result", "detail": "The procedure computes its answer and hands it back.", "sub": "hand back" },
            { "label": "scope closes", "sub": "local gone", "detail": "When the call ends, rate disappears. Outside code cannot see it." }
          ]
        }
      ],
      "callouts": [
        {
          "type": "insight",
          "position": "after",
          "title": "Isolation makes abstraction safe",
          "content": "Because a procedure's locals stay private, two procedures can both use a variable named total without interfering. That is what lets you build big programs from small independent pieces."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "A variable created inside a procedure can be read by code outside that procedure.", "correct_answer": "false", "explanation": "Local variables exist only inside their procedure during its call; outside code cannot see them." },
            { "type": "fill_in", "question": "The region of a program where a variable name is valid and accessible is called its ____.", "correct_answer": "scope", "explanation": "Scope is the region where a name is valid, either local or global." }
          ]
        }
      ],
      "challenge_title": "Countdown Procedure",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a positive integer n.\n# Use a procedure with LOCAL variables that builds and RETURNS a string\n# counting down from n to 1, space-separated.\n# Example: 5 -> \"5 4 3 2 1\"\n\ndef countdown(start):\n    # TODO: build a local string counting down from start to 1, return it\n    pass\n\nn = int(input())\nprint(countdown(n))\n",
      "challenge_solution_code": "def countdown(start):\n    line = \"\"\n    for i in range(start, 0, -1):\n        line = line + str(i) + \" \"\n    return line.strip()\n\nn = int(input())\nprint(countdown(n))\n",
      "challenge_test_cases": [
        {
          "input": "5\n",
          "expected_output": "5 4 3 2 1"
        },
        {
          "input": "3\n",
          "expected_output": "3 2 1"
        },
        {
          "input": "1\n",
          "expected_output": "1"
        }
      ]
    }
  ]
}
