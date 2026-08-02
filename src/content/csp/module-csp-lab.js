export default {
  "project": {
    "id": "csp-lab",
    "title": "Programming Lab: Python for CSP",
    "description": "A hands-on Python lab that reinforces the Algorithms and Programming big idea with real coding practice, from variables and loops to procedures, search, and a small simulation.",
    "difficulty": "beginner",
    "category": "apcsp",
    "order": 102.5,
    "track": "apcsp",
    "unit": "Programming Lab",
    "tags": [
      "python",
      "practice",
      "algorithms",
      "coding"
    ]
  },
  "lessons": [
    {
      "id": "csp-lab-l1",
      "project_id": "csp-lab",
      "order": 1,
      "title": "Variables and Assignment",
      "explanation": "## Boxes With Names\n\nA **variable** is a name that holds a value. You create one with an **assignment statement**, which uses a single equals sign. The name goes on the left and the value goes on the right.\n\n```python\nscore = 10\nname = \"Ada\"\nprint(score)\nprint(name)\n```\n\nThe first line stores the number 10 under the name `score`. The second stores the text `\"Ada\"` under the name `name`. When you `print` a variable, Python looks up its current value and shows it.\n\n## Reassigning\n\nA variable can change. Assigning again replaces the old value with a new one.\n\n```python\nscore = 10\nscore = score + 5\nprint(score)\n```\n\nRead the middle line right side first. Python computes `score + 5`, which is `10 + 5`, gets 15, then stores 15 back into `score`. The old 10 is gone. This pattern, using a variable's current value to compute its next value, shows up constantly in real programs.\n\n## Naming Well\n\nGood names describe what the value means. `total` and `player_name` tell a reader what is inside. Names like `x` or `data` say nothing. Clear names make code read almost like plain English.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| `TypeError: can only concatenate str (not \"int\") to str` | The value read from input was still text when a number was added to it | Convert it to a whole number before doing any arithmetic |\n| `NameError: name 'value' is not defined` | The name was read on a line before any assignment gave it a value | Assign to the name first, on a line above the one that reads it |\n| The printed number is the original, not the updated one | The result of the addition was computed but never stored back | Put the name on the left of the equals sign so it receives the new value |\n\nKey takeaways:\n\n- A variable is a name bound to a value.\n- Assignment uses one equals sign, with the name on the left.\n- Reassigning replaces the old value.\n- Descriptive names make code easier to read.",
      "key_terms": [
        {
          "term": "Variable",
          "definition": "A name that holds a value, which you can read and change later in the program."
        },
        {
          "term": "Assignment",
          "definition": "A statement that stores a value in a variable using a single equals sign, name on the left."
        }
      ],
      "animated_diagrams": [
        {
          "title": "What assignment does",
          "caption": "Python computes the right side first, then stores the result under the name on the left.",
          "loop": false,
          "nodes": [
            { "label": "score = 10", "sub": "create", "detail": "Python makes a variable named score and stores the value 10 in it." },
            { "label": "score + 5", "sub": "compute right", "detail": "It reads score (10) and adds 5, producing 15, before touching the variable." },
            { "label": "score = 15", "sub": "store back", "detail": "The result 15 replaces the old value, so score now holds 15." },
            { "label": "print(score)", "sub": "read", "detail": "Printing looks up the current value and shows 15." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing a reassignment",
          "steps": [
            { "label": "start", "detail": "score is created and holds 10.", "code": "score = 10" },
            { "label": "compute", "detail": "The right side reads score (10) and adds 5, giving 15.", "code": "score = score + 5" },
            { "label": "store", "detail": "15 is written back into score, replacing 10.", "code": "# score is now 15" },
            { "label": "output", "detail": "Printing shows the current value, 15.", "code": "print(score)" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In Python, a single equals sign (=) stores a value into a variable.", "correct_answer": "true", "explanation": "One equals sign is assignment. Two equals signs (==) is a comparison, which comes later." },
            { "type": "fill_in", "question": "In score = score + 5, Python computes the ____ side before storing the result.", "correct_answer": "right", "explanation": "The right side is evaluated first, then the result is stored in the name on the left." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "After these two lines run, what does count hold?\n\ncount = 3\ncount = count + 4",
          "options": [
            "3",
            "4",
            "7",
            "34"
          ],
          "correct_index": 2,
          "explanation": "The right side computes 3 + 4 = 7, and 7 is stored back into count."
        },
        {
          "question": "Which statement correctly assigns the text Ada to a variable named name?",
          "options": [
            "\"Ada\" = name",
            "name == \"Ada\"",
            "name = \"Ada\"",
            "name := Ada"
          ],
          "correct_index": 2,
          "explanation": "The name goes on the left of a single equals sign, and text values are wrapped in quotes."
        }
      ],
      "hints": [
        "One whole number arrives from the input. One whole number comes out, and it is ten larger than the one that came in.",
        "You need a single named holder for the number, and a way to replace what it holds with a larger version of itself.",
        "read the number and store it under a name, then store ____ back under that same name, then print what the name holds now."
      ],
      "challenge_title": "Add Ten",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer from input.\n# Store it in a variable, add 10 to that variable, and print the result.\nvalue = int(input())\n# TODO: add 10 to value and print it\n",
      "challenge_solution_code": "value = int(input())\nvalue = value + 10\nprint(value)\n",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "15",
          "description": "normal positive number"
        },
        {
          "input": "-4",
          "expected_output": "6",
          "description": "negative input crosses back above zero"
        },
        {
          "input": "0",
          "expected_output": "10",
          "description": "input is zero"
        },
        {
          "input": "-10",
          "expected_output": "0",
          "description": "result lands exactly on zero"
        },
        {
          "input": "1000000",
          "expected_output": "1000010",
          "description": "large value"
        }
      ]
    },
    {
      "id": "csp-lab-l2",
      "project_id": "csp-lab",
      "order": 2,
      "title": "Input, Output, and Types",
      "explanation": "## Talking to the User\n\nTwo functions handle the conversation. `input()` reads a line the user types, and `print()` shows a value on the screen.\n\n```python\nname = input()\nprint(\"Hello \" + name)\n```\n\nWhatever the user types comes back as **text**, also called a **string**. Even if they type `42`, `input()` hands you the string `\"42\"`, not the number 42.\n\n## Types Matter\n\nA **type** is the kind of value: `int` for whole numbers, `float` for decimals, `str` for text. You cannot add a number to a string directly, so you convert. `int(...)` turns text into a whole number and `str(...)` turns a number into text.\n\n```python\nage_text = input()\nage = int(age_text)\nnext_age = age + 1\nprint(\"Next year you are \" + str(next_age))\n```\n\nHere `int(age_text)` converts `\"20\"` into the number 20 so math works. Then `str(next_age)` converts 21 back into text so it can join the sentence with `+`.\n\n## Two Ways to Combine\n\nWith strings, `+` glues text together. With numbers, `+` adds. Mixing them without converting is a common error. When you want to print a number beside words, convert the number with `str(...)` first, or print them as separate arguments separated by a comma.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| `TypeError: can only concatenate str (not \"int\") to str` | A number was joined to text with `+` without being converted first | Wrap the number in `str(...)`, or pass the pieces to `print` separated by a comma |\n| The digits repeat instead of the number doubling | The value was still text, and `*` on text repeats it rather than multiplying | Convert with `int(...)` before you multiply |\n| `ValueError: invalid literal for int() with base 10` | `int(...)` was handed something that is not a whole number, such as a blank line or a decimal | Check what the input really contains before converting it |\n\nKey takeaways:\n\n- `input()` always returns a string.\n- `int(...)` converts text to a whole number; `str(...)` converts a number to text.\n- `+` joins strings but adds numbers.\n- Convert before mixing text and numbers.",
      "key_terms": [
        {
          "term": "String",
          "definition": "A value made of text characters, written in quotes. Input always arrives as a string."
        },
        {
          "term": "Type",
          "definition": "The kind of a value, such as int (whole number), float (decimal), or str (text)."
        },
        {
          "term": "Type conversion",
          "definition": "Changing a value from one type to another, such as int(\"42\") turning text into a number."
        }
      ],
      "animated_diagrams": [
        {
          "title": "From typed text to a number and back",
          "caption": "Input arrives as text, you convert it to compute, then convert back to display.",
          "loop": false,
          "nodes": [
            { "label": "input()", "sub": "read text", "detail": "The user types 20 and Python hands you the string \"20\"." },
            { "label": "int(...)", "sub": "text to number", "detail": "int(\"20\") converts the string into the number 20 so math works." },
            { "label": "add 1", "sub": "compute", "detail": "20 + 1 gives the number 21." },
            { "label": "str(...)", "sub": "number to text", "detail": "str(21) turns it back into \"21\" so it can join a sentence with +." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Why we convert both directions",
          "steps": [
            { "label": "read", "detail": "input() returns the string \"20\", not the number 20.", "code": "age_text = input()" },
            { "label": "to int", "detail": "int converts the text so we can do arithmetic.", "code": "age = int(age_text)" },
            { "label": "compute", "detail": "Now 20 + 1 is valid and gives 21.", "code": "next_age = age + 1" },
            { "label": "to str", "detail": "str(21) becomes \"21\" so + joins it to the sentence text.", "code": "print(\"Next year you are \" + str(next_age))" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "input() returns a number when the user types digits.", "correct_answer": "false", "explanation": "input() always returns a string. You must call int(...) to get a number." },
            { "type": "fill_in", "question": "To turn the text \"42\" into the whole number 42, you call the ____ function.", "correct_answer": "int", "explanation": "int(\"42\") converts the string into the integer 42." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "The user types 7. What is the value and type of input() before any conversion?",
          "options": [
            "The number 7 (int)",
            "The text \"7\" (str)",
            "The decimal 7.0 (float)",
            "Nothing, it is empty"
          ],
          "correct_index": 1,
          "explanation": "input() always returns a string, so you get the text \"7\" until you convert it with int(...)."
        },
        {
          "question": "Which line correctly prints the number stored in n beside some words?",
          "options": [
            "print(\"Total: \" + n)",
            "print(\"Total: \" + str(n))",
            "print(\"Total: \" + int(n))",
            "print(\"Total: \" n)"
          ],
          "correct_index": 1,
          "explanation": "You cannot join a string and a number with +. Convert the number to text with str(n) first."
        }
      ],
      "hints": [
        "A single number arrives as typed text. A single number comes out, twice as large as the one that came in.",
        "You need one conversion from typed text into a whole number, and the doubling has to happen on the converted value, not on the text.",
        "read the typed line, convert it into a whole number, then print ____."
      ],
      "challenge_title": "Double the Number",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a number as text, convert it to an int, double it, and print the result.\ntext = input()\n# TODO: convert to int, multiply by 2, and print\n",
      "challenge_solution_code": "text = input()\nnumber = int(text)\nprint(number * 2)\n",
      "challenge_test_cases": [
        {
          "input": "6",
          "expected_output": "12",
          "description": "single digit doubles"
        },
        {
          "input": "12",
          "expected_output": "24",
          "description": "two digits, so repeating the text instead of doubling fails"
        },
        {
          "input": "0",
          "expected_output": "0",
          "description": "input is zero"
        },
        {
          "input": "-7",
          "expected_output": "-14",
          "description": "negative input"
        },
        {
          "input": "250",
          "expected_output": "500",
          "description": "larger value"
        }
      ]
    },
    {
      "id": "csp-lab-l3",
      "project_id": "csp-lab",
      "order": 3,
      "title": "Conditionals and Booleans",
      "explanation": "## Making Decisions\n\nA **conditional** lets a program choose between paths. It tests a **Boolean**, a value that is either `True` or `False`, and runs different code depending on the result.\n\n```python\nage = int(input())\nif age >= 18:\n    print(\"adult\")\nelse:\n    print(\"minor\")\n```\n\nThe test `age >= 18` produces a Boolean. If it is `True`, the indented block under `if` runs. If it is `False`, the block under `else` runs. Only one branch runs, never both.\n\n## Comparison Operators\n\nYou build Booleans with comparisons: `==` (equal), `!=` (not equal), `<`, `>`, `<=`, `>=`. Notice `==` with two equals signs tests equality, while a single `=` assigns. Mixing them up is a classic beginner bug.\n\n## More Than Two Choices\n\nUse `elif` (short for else if) to check several conditions in order. Python tries each test top to bottom and runs the first block whose test is `True`.\n\n```python\nscore = int(input())\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelse:\n    print(\"C\")\n```\n\nOrder matters here. A score of 95 matches the first test and stops, so it never reaches the `elif`.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| `SyntaxError: invalid syntax` pointing at the `if` line | A single equals sign was used where a comparison belonged | A test needs two equals signs. One equals sign only stores a value |\n| `IndentationError: expected an indented block` | The line under `if` or `else` was left flush against the margin | Indent every line that belongs to a branch by the same amount |\n| Every input prints the same word | The condition never actually changes, often because the remainder was compared to the wrong value | Dividing by two leaves a remainder of 0 or 1, so compare against 0 |\n\nKey takeaways:\n\n- A conditional chooses a path based on a Boolean.\n- `==` compares; a single `=` assigns.\n- `if`, `elif`, and `else` handle two or more choices.\n- Only the first matching branch runs.",
      "key_terms": [
        {
          "term": "Boolean",
          "definition": "A value that is either True or False, usually produced by a comparison."
        },
        {
          "term": "Conditional",
          "definition": "An if / elif / else structure that runs different code depending on a Boolean test."
        },
        {
          "term": "Comparison operator",
          "definition": "A symbol like ==, !=, <, or >= that compares two values and yields a Boolean."
        }
      ],
      "animated_diagrams": [
        {
          "title": "How an if / elif / else chooses",
          "caption": "Python checks each test top to bottom and runs the first True branch, then skips the rest.",
          "loop": false,
          "nodes": [
            { "label": "score >= 90", "sub": "first test", "detail": "If this is True, print A and skip everything else." },
            { "label": "score >= 80", "sub": "elif test", "detail": "Only checked if the first was False. If True, print B and stop." },
            { "label": "else", "sub": "fallback", "detail": "If no test above was True, this branch runs and prints C." },
            { "label": "one branch", "sub": "result", "detail": "Exactly one block runs, no matter how many tests there are." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing score = 85",
          "steps": [
            { "label": "read", "detail": "score becomes the number 85.", "code": "score = 85" },
            { "label": "test 1", "detail": "85 >= 90 is False, so skip the A branch.", "code": "if score >= 90:" },
            { "label": "test 2", "detail": "85 >= 80 is True, so run this branch.", "code": "elif score >= 80:" },
            { "label": "output", "detail": "Prints B and skips the else entirely.", "code": "print(\"B\")" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In an if / elif / else chain, more than one branch can run for a single value.", "correct_answer": "false", "explanation": "Only the first branch whose test is True runs. The rest are skipped." },
            { "type": "fill_in", "question": "To test whether two values are equal, you use the ____ operator (type the symbol).", "correct_answer": "==", "explanation": "Two equals signs compares for equality. A single equals sign assigns." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "What does this print when score is 90?\n\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")",
          "options": [
            "A",
            "B",
            "Both A and B",
            "Nothing"
          ],
          "correct_index": 0,
          "explanation": "90 >= 90 is True, so the first branch prints A and the elif is skipped."
        },
        {
          "question": "Which is the correct way to test equality in a conditional?",
          "options": [
            "if x = 5:",
            "if x == 5:",
            "if x =< 5:",
            "if x := 5:"
          ],
          "correct_index": 1,
          "explanation": "Equality uses ==. A single = is assignment and is not allowed as a condition."
        }
      ],
      "hints": [
        "One whole number arrives. One of two words comes out, decided by whether that number splits into pairs with nothing left over.",
        "You need the remainder left behind after dividing by two, and a two-way choice that picks one word or the other based on that remainder.",
        "read the number, then if ____ print one word, otherwise print the other."
      ],
      "challenge_title": "Even or Odd",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer.\n# Print \"even\" if it is divisible by 2, otherwise print \"odd\".\nn = int(input())\n# TODO: use % 2 and an if / else to print even or odd\n",
      "challenge_solution_code": "n = int(input())\nif n % 2 == 0:\n    print(\"even\")\nelse:\n    print(\"odd\")\n",
      "challenge_test_cases": [
        {
          "input": "4",
          "expected_output": "even",
          "description": "even number"
        },
        {
          "input": "7",
          "expected_output": "odd",
          "description": "odd number"
        },
        {
          "input": "0",
          "expected_output": "even",
          "description": "zero counts as even"
        },
        {
          "input": "-3",
          "expected_output": "odd",
          "description": "negative odd number"
        },
        {
          "input": "1",
          "expected_output": "odd",
          "description": "smallest odd number"
        }
      ]
    },
    {
      "id": "csp-lab-l4",
      "project_id": "csp-lab",
      "order": 4,
      "title": "Lists and Indexing",
      "explanation": "## A Row of Values\n\nA **list** holds several values in order under one name. You write it with square brackets and commas.\n\n```python\nscores = [90, 85, 72]\nprint(scores[0])\nprint(scores[2])\n```\n\nEach value has a position called an **index**. Indexing starts at 0, so `scores[0]` is the first value (90) and `scores[2]` is the third (72). Counting from zero trips up almost everyone at first, so slow down and count carefully.\n\n## Length and the Last Item\n\n`len(scores)` gives the number of items, here 3. Because indexing starts at 0, the last valid index is `len(scores) - 1`. Asking for `scores[3]` in a three-item list is an error, since there is no index 3.\n\n## Building Lists From Input\n\nA line of space-separated values becomes a list with `split()`. To do math you convert each piece to a number.\n\n```python\nparts = input().split()      # a list of strings\nfirst = int(parts[0])\nprint(first)\n```\n\n`\"90 85 72\".split()` produces `[\"90\", \"85\", \"72\"]`, a list of strings. Indexing gives you one piece, and `int(...)` converts it to a number.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| `IndexError: list index out of range` | The length itself was used as an index, but the last position is one below the length | Subtract one from the length to reach the final item |\n| The first value is skipped and the second one shows up instead | Counting started at one, but positions start at zero | The opening position is 0, and the second item sits at 1 |\n| Two values glue together instead of adding | `split()` hands back pieces of text, and `+` joins text rather than summing it | Convert a piece with `int(...)` whenever you need to calculate with it |\n\nKey takeaways:\n\n- A list stores ordered values under one name.\n- Indexing starts at 0, so the last index is len - 1.\n- `len(...)` counts the items.\n- `split()` turns a line of text into a list of strings.",
      "key_terms": [
        {
          "term": "List",
          "definition": "An ordered collection of values stored under one name, written with square brackets."
        },
        {
          "term": "Index",
          "definition": "The position of an item in a list, counting from 0 for the first item."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Indexing a list from zero",
          "caption": "The first item is at index 0, so the last valid index is one less than the length.",
          "loop": false,
          "nodes": [
            { "label": "[90, 85, 72]", "sub": "the list", "detail": "Three values stored in order under the name scores." },
            { "label": "index 0", "sub": "first", "detail": "scores[0] is 90, the first item. Indexing starts at zero." },
            { "label": "index 2", "sub": "last", "detail": "scores[2] is 72, the third and last item." },
            { "label": "len - 1", "sub": "rule", "detail": "len is 3, so the highest valid index is 3 - 1 = 2. scores[3] is an error." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "From input line to a value",
          "steps": [
            { "label": "read + split", "detail": "input().split() turns \"90 85 72\" into the list of strings [\"90\", \"85\", \"72\"].", "code": "parts = input().split()" },
            { "label": "index", "detail": "parts[0] is the string \"90\", the first piece.", "code": "parts[0]" },
            { "label": "convert", "detail": "int(\"90\") gives the number 90.", "code": "first = int(parts[0])" },
            { "label": "output", "detail": "Prints 90.", "code": "print(first)" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In the list [90, 85, 72], the value 90 is at index 1.", "correct_answer": "false", "explanation": "Indexing starts at 0, so 90 is at index 0. Index 1 holds 85." },
            { "type": "fill_in", "question": "For a list of length 5, the last valid index is the number ____.", "correct_answer": "4", "explanation": "The last index is len - 1, which is 5 - 1 = 4." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "Given nums = [3, 6, 9, 12], what is nums[2]?",
          "options": [
            "3",
            "6",
            "9",
            "12"
          ],
          "correct_index": 2,
          "explanation": "Counting from 0: index 0 is 3, index 1 is 6, index 2 is 9."
        },
        {
          "question": "What does \"5 10 15\".split() produce?",
          "options": [
            "The number 30",
            "The list [5, 10, 15] of numbers",
            "The list [\"5\", \"10\", \"15\"] of strings",
            "The string \"51015\""
          ],
          "correct_index": 2,
          "explanation": "split() breaks the text on spaces into a list of strings. You must convert each with int(...) to get numbers."
        }
      ],
      "hints": [
        "A line of values arrives all at once. Two of them come out, the one at the very front and the one at the very end, each on its own line.",
        "You need the line broken into an ordered run of pieces, plus a count of how many pieces there are so you can reach the final position.",
        "break the line into pieces, print the piece at position 0, then print the piece at position ____."
      ],
      "challenge_title": "First and Last",
      "challenge_language": "python",
      "challenge_starter_code": "# Read a line of space-separated integers.\n# Print the first value on one line and the last value on the next line.\nparts = input().split()\n# TODO: print the first item, then the last item using len - 1\n",
      "challenge_solution_code": "parts = input().split()\nprint(parts[0])\nprint(parts[len(parts) - 1])\n",
      "challenge_test_cases": [
        {
          "input": "10 20 30 40",
          "expected_output": "10\n40",
          "description": "several values"
        },
        {
          "input": "5",
          "expected_output": "5\n5",
          "description": "single item, first and last are the same"
        },
        {
          "input": "7 8",
          "expected_output": "7\n8",
          "description": "exactly two items"
        },
        {
          "input": "-5 0 12",
          "expected_output": "-5\n12",
          "description": "negative first value"
        },
        {
          "input": "  3   9   4  ",
          "expected_output": "3\n4",
          "description": "extra spaces around and between values"
        }
      ]
    },
    {
      "id": "csp-lab-l5",
      "project_id": "csp-lab",
      "order": 5,
      "title": "Loops: for and while",
      "explanation": "## Repeating Work\n\nA **loop** runs a block of code many times so you do not repeat yourself. Python has two main kinds.\n\nA **for loop** walks through each item in a collection, one at a time.\n\n```python\nparts = input().split()\ntotal = 0\nfor p in parts:\n    total += int(p)\nprint(total)\n```\n\nEach time around, `p` becomes the next item in `parts`. The line `total += int(p)` adds that value into a running total. After the last item, the loop ends and you print the sum. A variable that builds up across iterations, like `total`, is called an **accumulator**.\n\n## Counting Loops\n\n`range(n)` gives the numbers 0 up to but not including n, which is handy for repeating something a fixed number of times.\n\n```python\nfor i in range(3):\n    print(i)\n```\n\nThis prints 0, then 1, then 2. It stops before 3.\n\n## while Loops\n\nA **while loop** keeps going as long as a condition stays `True`. You must change something inside so the condition eventually turns `False`, or the loop runs forever.\n\n```python\nn = 3\nwhile n > 0:\n    print(n)\n    n -= 1\n```\n\nThis prints 3, 2, 1. Each pass lowers `n` by one until `n > 0` becomes False. Forgetting to change `n` would create an infinite loop.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| The last number is missing from the output | `range` stops one short of the number you hand it | Raise the stopping value by one so the final number is included |\n| The output starts at 0 instead of 1 | `range` given a single value always begins counting at zero | Supply a starting value as well as a stopping value |\n| The program never finishes | The while condition never turns False because nothing inside the loop changes it | Update the tested variable inside the loop so it moves toward stopping |\n\nKey takeaways:\n\n- A for loop visits each item in a collection.\n- `range(n)` counts 0 to n - 1.\n- An accumulator builds a result across iterations.\n- A while loop repeats while a condition holds, so you must move it toward False.",
      "key_terms": [
        {
          "term": "Loop",
          "definition": "A structure that repeats a block of code, either once per item (for) or while a condition holds (while)."
        },
        {
          "term": "Accumulator",
          "definition": "A variable that builds up a result across loop iterations, such as a running total or count."
        },
        {
          "term": "Infinite loop",
          "definition": "A while loop whose condition never becomes False, so it never stops."
        }
      ],
      "animated_diagrams": [
        {
          "title": "One trip through a summing for loop",
          "caption": "Each iteration takes the next item and folds it into the running total.",
          "loop": true,
          "nodes": [
            { "label": "next item", "sub": "p = ...", "detail": "The loop hands p the next value from the list." },
            { "label": "convert", "sub": "int(p)", "detail": "Turn the string piece into a number so it can be added." },
            { "label": "accumulate", "sub": "total += ...", "detail": "Add that number into total, which grows each pass." },
            { "label": "more items?", "sub": "repeat or stop", "detail": "If items remain, loop again. Otherwise leave the loop and print total." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Summing \"2 3 5\"",
          "steps": [
            { "label": "start", "detail": "total begins at 0 before the loop.", "code": "total = 0" },
            { "label": "p = 2", "detail": "int(\"2\") is 2, so total becomes 0 + 2 = 2.", "code": "total += int(p)" },
            { "label": "p = 3", "detail": "total becomes 2 + 3 = 5.", "code": "total += int(p)" },
            { "label": "p = 5", "detail": "total becomes 5 + 5 = 10, then the loop ends.", "code": "total += int(p)" },
            { "label": "output", "detail": "Prints 10.", "code": "print(total)" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "range(3) produces the numbers 0, 1, and 2.", "correct_answer": "true", "explanation": "range(n) counts from 0 up to but not including n, so range(3) is 0, 1, 2." },
            { "type": "fill_in", "question": "A variable that builds up a running total across loop passes is called an ____.", "correct_answer": "accumulator", "explanation": "An accumulator collects a result across iterations, like a sum or count." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "How many times does the body of this loop run?\n\nfor i in range(4):\n    print(i)",
          "options": [
            "3 times",
            "4 times",
            "5 times",
            "Forever"
          ],
          "correct_index": 1,
          "explanation": "range(4) is 0, 1, 2, 3, which is four values, so the body runs four times."
        },
        {
          "question": "What is the danger in this while loop?\n\nn = 5\nwhile n > 0:\n    print(n)",
          "options": [
            "It prints nothing",
            "n is never changed, so it loops forever",
            "range is missing",
            "n must be a string"
          ],
          "correct_index": 1,
          "explanation": "Nothing inside changes n, so n > 0 stays True and the loop never ends. You need something like n -= 1."
        }
      ],
      "hints": [
        "One whole number arrives. Every counting number from one up to and including that number comes out, one per line.",
        "You need a loop that runs a fixed number of times, with a counter whose first value is one and whose last value is the number that arrived.",
        "read the number, then for each value counted from 1 through ____ print that value."
      ],
      "challenge_title": "Count Up to N",
      "challenge_language": "python",
      "challenge_starter_code": "# Read an integer n.\n# Print the numbers from 1 to n, each on its own line.\nn = int(input())\n# TODO: loop and print 1, 2, ..., n\n",
      "challenge_solution_code": "n = int(input())\nfor i in range(1, n + 1):\n    print(i)\n",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "1\n2\n3",
          "description": "counts up to n"
        },
        {
          "input": "1",
          "expected_output": "1",
          "description": "n is one, so only one line prints"
        },
        {
          "input": "5",
          "expected_output": "1\n2\n3\n4\n5",
          "description": "longer count reaches the last number"
        },
        {
          "input": "0",
          "expected_output": "",
          "description": "n is zero, so nothing prints"
        },
        {
          "input": "2",
          "expected_output": "1\n2",
          "description": "smallest count with more than one line"
        }
      ]
    },
    {
      "id": "csp-lab-l6",
      "project_id": "csp-lab",
      "order": 6,
      "title": "Procedures: Parameters and Return",
      "explanation": "## Naming a Chunk of Work\n\nA **procedure**, which Python calls a **function**, is a named block of code you can run whenever you need it. You define it with `def`, and you run it by **calling** its name with parentheses.\n\n```python\ndef greet():\n    print(\"hello\")\n\ngreet()\ngreet()\n```\n\nDefining `greet` does not run it. The two calls below do, so this prints hello twice. Writing the steps once and calling them many times keeps code short and clear.\n\n## Parameters Pass Data In\n\nA **parameter** is a variable listed in the definition that receives a value when you call the function. The value you pass in is an **argument**.\n\n```python\ndef square(n):\n    return n * n\n\nresult = square(5)\nprint(result)\n```\n\nWhen you call `square(5)`, the argument 5 lands in the parameter `n`. The **return** statement sends a value back to whoever called the function, so `square(5)` becomes 25, which is stored in `result`.\n\n## Return Versus Print\n\nThese are different. `print` shows a value on screen. `return` hands a value back to the caller so the program can use it further. A function that returns a value lets you combine results, like `square(3) + square(4)`. A function that only prints cannot be reused that way.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| The output is `None` | The function reached its end without an explicit `return`, so the caller got nothing back | Return the value you computed instead of just computing it |\n| The number shows on screen but cannot be stored or reused | The function printed its result rather than returning it | Return from the function and print at the place that called it |\n| `NameError: name 'square' is not defined` | The call sits above the `def` line in the file | Define the function before the line that calls it |\n\nKey takeaways:\n\n- `def` defines a function; parentheses call it.\n- A parameter receives the argument you pass in.\n- `return` sends a value back to the caller.\n- Returning is not the same as printing.",
      "key_terms": [
        {
          "term": "Function",
          "definition": "A named, reusable block of code defined with def and run by calling its name with parentheses."
        },
        {
          "term": "Parameter",
          "definition": "A variable in a function definition that receives a value (the argument) when the function is called."
        },
        {
          "term": "Return",
          "definition": "A statement that sends a value back to the code that called the function."
        }
      ],
      "animated_diagrams": [
        {
          "title": "A function call and its return",
          "caption": "The argument flows into the parameter, the body runs, and return hands a value back.",
          "loop": false,
          "nodes": [
            { "label": "square(5)", "sub": "call", "detail": "You call square and pass the argument 5." },
            { "label": "n = 5", "sub": "parameter", "detail": "The argument 5 lands in the parameter n inside the function." },
            { "label": "n * n", "sub": "body runs", "detail": "The body computes 5 * 5, which is 25." },
            { "label": "return 25", "sub": "hand back", "detail": "return sends 25 back, so square(5) becomes 25 at the call site." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing result = square(5)",
          "steps": [
            { "label": "call", "detail": "The argument 5 is passed to square.", "code": "result = square(5)" },
            { "label": "bind", "detail": "Inside the function, n is set to 5.", "code": "def square(n):" },
            { "label": "compute", "detail": "n * n is 5 * 5 = 25.", "code": "return n * n" },
            { "label": "store", "detail": "The returned 25 is stored in result, and printing shows 25.", "code": "print(result)" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Defining a function with def also runs its body immediately.", "correct_answer": "false", "explanation": "def only defines the function. The body runs when you call it with parentheses." },
            { "type": "fill_in", "question": "The keyword that sends a value back to the caller is ____.", "correct_answer": "return", "explanation": "return hands a value back so the caller can use the result." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "What does this print?\n\ndef add(a, b):\n    return a + b\n\nprint(add(2, 3) + add(4, 1))",
          "options": [
            "5",
            "10",
            "23 41",
            "Nothing, add only returns"
          ],
          "correct_index": 1,
          "explanation": "add(2, 3) returns 5 and add(4, 1) returns 5, so 5 + 5 = 10 is printed."
        },
        {
          "question": "What is the difference between return and print?",
          "options": [
            "They are identical",
            "return shows text on screen; print sends a value back",
            "print shows a value on screen; return hands a value back to the caller",
            "return only works with strings"
          ],
          "correct_index": 2,
          "explanation": "print displays a value, while return passes a value back so the program can keep using it."
        }
      ],
      "hints": [
        "One whole number arrives and one comes out, that number multiplied by itself. The multiplying has to happen inside a named block, not in the main body of the program.",
        "You need a named block that accepts one incoming value and hands a result back to whoever called it, plus a call site that prints whatever came back.",
        "define a block that takes one value and ____ that value times itself, then read the number and print the result of calling the block on it."
      ],
      "challenge_title": "Square Function",
      "challenge_language": "python",
      "challenge_starter_code": "# Write a function square(n) that returns n * n.\n# Read an integer, call square on it, and print the returned value.\ndef square(n):\n    # TODO: return n times n\n    pass\n\nx = int(input())\n# TODO: print square(x)\n",
      "challenge_solution_code": "def square(n):\n    return n * n\n\nx = int(input())\nprint(square(x))\n",
      "challenge_test_cases": [
        {
          "input": "5",
          "expected_output": "25",
          "description": "normal positive number"
        },
        {
          "input": "-6",
          "expected_output": "36",
          "description": "negative input squares to a positive result"
        },
        {
          "input": "0",
          "expected_output": "0",
          "description": "input is zero"
        },
        {
          "input": "1",
          "expected_output": "1",
          "description": "one squared is still one"
        },
        {
          "input": "12",
          "expected_output": "144",
          "description": "larger value"
        }
      ]
    },
    {
      "id": "csp-lab-l7",
      "project_id": "csp-lab",
      "order": 7,
      "title": "Building an Algorithm: Search and Count",
      "explanation": "## An Algorithm Is a Plan\n\nAn **algorithm** is a clear sequence of steps that solves a problem. Two of the most common are **searching** (does a value appear?) and **counting** (how many match a rule?). Both walk through a list once and keep track of what they find.\n\n## Linear Search\n\nA **linear search** checks each item in turn until it finds the target or runs out. You can track success with a Boolean **flag**.\n\n```python\nparts = input().split()\ntarget = input()\nfound = False\nfor p in parts:\n    if p == target:\n        found = True\nif found:\n    print(\"yes\")\nelse:\n    print(\"no\")\n```\n\nThe flag `found` starts False. If any item equals the target, it flips to True. After the loop, the flag tells you the answer. This visit-each-item pattern is the backbone of countless algorithms.\n\n## Counting Matches\n\nCounting uses the same walk but with an accumulator instead of a flag. Here you count how many numbers are above a threshold.\n\n```python\nparts = input().split()\nlimit = int(input())\ncount = 0\nfor p in parts:\n    if int(p) > limit:\n        count += 1\nprint(count)\n```\n\nStart the count at 0, add 1 each time the rule holds, and print the total. The shape is always the same: set up a result, loop and update it, then report it.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| The answer is always no, even when the word is clearly there | The flag was reset back to False inside the loop, wiping out an earlier match | Set the flag once before the loop, and only ever flip it inside |\n| The answer is always yes | The flag was set on every pass instead of only inside the branch that matched | Indent the flag change so it sits under the comparison |\n| One answer prints for every item in the list | The reporting `if` was placed inside the loop instead of after it | Move the report out of the loop so it runs once, after the walk finishes |\n\nKey takeaways:\n\n- An algorithm is an ordered sequence of steps for a problem.\n- Linear search checks each item until it finds the target.\n- A flag records whether something happened; an accumulator counts how often.\n- Set up, loop and update, then report the result.",
      "key_terms": [
        {
          "term": "Algorithm",
          "definition": "A clear, finite sequence of steps that solves a problem or completes a task."
        },
        {
          "term": "Linear search",
          "definition": "Checking each item in a list one at a time until the target is found or the list ends."
        },
        {
          "term": "Flag",
          "definition": "A Boolean variable that records whether some event happened, such as finding a target."
        }
      ],
      "animated_diagrams": [
        {
          "title": "Linear search with a flag",
          "caption": "Walk the list once, flipping the flag to True the moment you find the target.",
          "loop": true,
          "nodes": [
            { "label": "found = False", "sub": "set up", "detail": "Before the loop, assume the target is not present." },
            { "label": "check item", "sub": "p == target?", "detail": "Compare the current item to the target you are looking for." },
            { "label": "flip flag", "sub": "found = True", "detail": "If it matches, set found to True. Otherwise leave it as is." },
            { "label": "more items?", "sub": "loop or report", "detail": "Keep going through the list, then after the loop print yes or no based on found." }
          ]
        }
      ],
      "worked_examples": [
        {
          "difficulty": "easy",
          "prompt": "Count how many of \"4 9 2 7\" are greater than the limit 5.",
          "steps": [
            "Set count = 0 before looking at anything.",
            "4 > 5 is False, so count stays 0.",
            "9 > 5 is True, so count becomes 1.",
            "2 > 5 is False, so count stays 1.",
            "7 > 5 is True, so count becomes 2. Print 2."
          ],
          "output": "2"
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "A linear search may stop early once it finds the target, but it never needs to look past the end of the list.", "correct_answer": "true", "explanation": "Linear search checks items in order and can stop at a match. It never indexes past the last item." },
            { "type": "fill_in", "question": "A Boolean variable that records whether something was found is called a ____.", "correct_answer": "flag", "explanation": "A flag starts False and flips to True when the event happens." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "In a counting loop, what value should the counter start at before the loop?",
          "options": [
            "1",
            "0",
            "The length of the list",
            "The first item"
          ],
          "correct_index": 1,
          "explanation": "Start the count at 0 so that adding 1 per match gives the correct total."
        },
        {
          "question": "What is the shared shape of search and count algorithms?",
          "options": [
            "Sort the list, then print it",
            "Set up a result, loop and update it, then report it",
            "Call a function once with no loop",
            "Read input twice and compare the two lines"
          ],
          "correct_index": 1,
          "explanation": "Both initialize a result (a flag or a count), walk the list updating it, and then report the final value."
        }
      ],
      "hints": [
        "A line of words arrives, then one more word on its own. One of two answers comes out, depending on whether that lone word appears anywhere among the others.",
        "You need a single true or false record that starts out assuming failure, a walk across every word, and exactly one report made after the walk ends.",
        "set the record to false, then for each word if ____ flip the record to true, then after the walk print one answer or the other."
      ],
      "challenge_title": "Search the List",
      "challenge_language": "python",
      "challenge_starter_code": "# First line: space-separated words.\n# Second line: a single target word.\n# Print \"yes\" if the target appears in the list, otherwise print \"no\".\nparts = input().split()\ntarget = input()\n# TODO: use a flag and a loop to search, then print yes or no\n",
      "challenge_solution_code": "parts = input().split()\ntarget = input()\nfound = False\nfor p in parts:\n    if p == target:\n        found = True\nif found:\n    print(\"yes\")\nelse:\n    print(\"no\")\n",
      "challenge_test_cases": [
        {
          "input": "cat dog fish\ndog",
          "expected_output": "yes",
          "description": "target sits in the middle"
        },
        {
          "input": "cat dog fish\nbird",
          "expected_output": "no",
          "description": "target is not in the list"
        },
        {
          "input": "cat dog fish\nfish",
          "expected_output": "yes",
          "description": "target is the last word"
        },
        {
          "input": "cat dog fish\ncat",
          "expected_output": "yes",
          "description": "target is the first word"
        },
        {
          "input": "apple\napple",
          "expected_output": "yes",
          "description": "single word list"
        },
        {
          "input": "cat dog fish\nog",
          "expected_output": "no",
          "description": "partial word must not count as a match"
        }
      ]
    },
    {
      "id": "csp-lab-l8",
      "project_id": "csp-lab",
      "order": 8,
      "title": "A Small Simulation: Putting It Together",
      "explanation": "## Modeling Something Step by Step\n\nA **simulation** models a real process by stepping through it one round at a time. It brings together everything in this lab: variables, input, conditionals, a loop, and a clear final output. Each round updates the state, and when the rounds end you report the result.\n\n## A Savings Simulation\n\nSuppose you start with some savings and add a fixed amount each week. You want to know how many weeks it takes to reach a goal. That is a simulation: repeat a step (one week passing) until a condition is met (savings reach the goal).\n\n```python\nstart = int(input())\nweekly = int(input())\ngoal = int(input())\n\nsavings = start\nweeks = 0\nwhile savings < goal:\n    savings += weekly\n    weeks += 1\nprint(weeks)\n```\n\nThe **state** here is `savings` and `weeks`. Each pass of the while loop is one week: savings grow by the weekly amount and the week count goes up by one. The loop stops the moment savings reach the goal, and you print how many weeks that took.\n\n## Watch the Starting State\n\nEdge cases matter. If `start` already meets the goal, the condition `savings < goal` is False right away, so the loop body never runs and the answer is 0 weeks. Thinking through that boundary before you run is exactly the testing habit good programmers build. Choosing a positive weekly amount also guarantees the loop makes progress and ends.\n\n## What usually goes wrong\n\n| What you see | What caused it | How to fix it |\n| --- | --- | --- |\n| The answer is one week too high | A week was counted before the goal was checked, so a round got recorded that never needed to run | Test the stop condition first, and only count a round you actually carried out |\n| The answer is 1 when the savings already meet the goal | The loop body ran once before any test happened | Check the condition before the first round so an answer of zero is possible |\n| The program never finishes | Savings never grow, so the condition stays True forever | Make sure the weekly amount is positive and is actually added inside the loop |\n\nKey takeaways:\n\n- A simulation steps through a process one round at a time.\n- State variables carry the current situation between rounds.\n- Each loop pass updates the state until a stop condition is met.\n- Check the boundary where the goal is already met, giving 0 rounds.",
      "key_terms": [
        {
          "term": "Simulation",
          "definition": "A program that models a real process by stepping through it one round at a time."
        },
        {
          "term": "State",
          "definition": "The set of variables that describe the current situation, updated each round of a simulation."
        }
      ],
      "animated_diagrams": [
        {
          "title": "One week of the savings loop",
          "caption": "Each round adds the weekly amount and counts a week, until savings reach the goal.",
          "loop": true,
          "nodes": [
            { "label": "savings < goal?", "sub": "check", "detail": "If savings are still below the goal, run another week. Otherwise stop." },
            { "label": "savings += weekly", "sub": "grow", "detail": "Add the weekly deposit to the running savings total." },
            { "label": "weeks += 1", "sub": "count", "detail": "Record that one more week has passed." },
            { "label": "loop back", "sub": "repeat", "detail": "Check the condition again. When savings reach the goal, print the week count." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "start 10, weekly 5, goal 20",
          "steps": [
            { "label": "set up", "detail": "savings = 10, weeks = 0. The goal is 20.", "code": "savings = start" },
            { "label": "week 1", "detail": "10 < 20 is True. savings becomes 15, weeks becomes 1.", "code": "savings += weekly" },
            { "label": "week 2", "detail": "15 < 20 is True. savings becomes 20, weeks becomes 2.", "code": "weeks += 1" },
            { "label": "stop", "detail": "20 < 20 is False, so the loop ends and prints 2.", "code": "print(weeks)" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "If the starting savings already meet the goal, the answer should be 0 weeks.", "correct_answer": "true", "explanation": "The while condition is False right away, so the body never runs and weeks stays 0." },
            { "type": "fill_in", "question": "The variables that describe the current situation between rounds of a simulation are its ____.", "correct_answer": "state", "explanation": "State variables like savings and weeks carry the situation forward each round." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "start = 20, weekly = 5, goal = 20. How many weeks does the loop count?",
          "options": [
            "0",
            "1",
            "4",
            "It loops forever"
          ],
          "correct_index": 0,
          "explanation": "20 < 20 is False immediately, so the body never runs and weeks stays 0."
        },
        {
          "question": "Why must the weekly amount be positive for this simulation to end?",
          "options": [
            "So the output looks nicer",
            "So savings keep growing and eventually reach the goal, ending the loop",
            "Because negative numbers are not allowed in Python",
            "It does not matter, the loop always ends"
          ],
          "correct_index": 1,
          "explanation": "A positive weekly deposit makes savings rise each pass, so the stop condition is eventually met. A zero or negative amount could loop forever."
        }
      ],
      "hints": [
        "Three numbers arrive: an amount to start with, an amount added each round, and a target. One number comes out, the count of rounds needed to reach that target, and it can be zero.",
        "You need two pieces of running state, the amount so far and the rounds so far, plus a loop that keeps going only while the amount is still short of the target.",
        "set the running amount to the start and the round count to zero, then while ____ add the weekly amount and raise the count by one, then print the count."
      ],
      "challenge_title": "Weeks to Goal",
      "challenge_language": "python",
      "challenge_starter_code": "# Read three integers on three separate lines:\n#   start   (starting savings)\n#   weekly  (amount added each week, positive)\n#   goal    (target savings)\n# Print how many whole weeks it takes for savings to reach the goal.\n# If savings already meet or exceed the goal, print 0.\nstart = int(input())\nweekly = int(input())\ngoal = int(input())\n# TODO: simulate week by week and print the week count\n",
      "challenge_solution_code": "start = int(input())\nweekly = int(input())\ngoal = int(input())\nsavings = start\nweeks = 0\nwhile savings < goal:\n    savings += weekly\n    weeks += 1\nprint(weeks)\n",
      "challenge_test_cases": [
        {
          "input": "10\n5\n20",
          "expected_output": "2",
          "description": "reaches the goal in two weeks"
        },
        {
          "input": "50\n5\n20",
          "expected_output": "0",
          "description": "savings already exceed the goal"
        },
        {
          "input": "20\n5\n20",
          "expected_output": "0",
          "description": "savings exactly meet the goal, so zero weeks"
        },
        {
          "input": "0\n10\n25",
          "expected_output": "3",
          "description": "last week overshoots the goal"
        },
        {
          "input": "0\n10\n30",
          "expected_output": "3",
          "description": "goal is an exact multiple of the weekly amount"
        },
        {
          "input": "0\n1\n1",
          "expected_output": "1",
          "description": "a single week is enough"
        }
      ]
    }
  ]
}
