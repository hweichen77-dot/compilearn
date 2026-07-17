export default {
  "project": {
    "id": "csa-11",
    "title": "Exam Workshop: FRQ Strategies",
    "description": "Master the four AP CSA free-response question types with rubric thinking, worked Java examples, tracing practice, and a full timed walkthrough so you earn every point you can.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 211,
    "track": "apcsa",
    "unit": "Exam Workshop",
    "tags": [
      "exam",
      "frq",
      "java",
      "practice"
    ]
  },
  "lessons": [
    {
      "id": "csa-11-l1",
      "project_id": "csa-11",
      "order": 1,
      "title": "How the Exam and FRQs Are Scored",
      "concept": "rubric thinking",
      "xp_reward": 10,
      "explanation": "## The Shape of the Exam\n\nThe AP CSA exam has two sections. The multiple choice section is 40 questions worth half your score. The free response section is 4 questions, also worth half. Each free response question (FRQ) is graded out of 9 points against a public rubric. Your goal on the FRQ section is not elegant code. It is collecting rubric points.\n\n## Rubric Thinking\n\nGraders do not read your code looking for beauty. They hold a checklist. Each line of that checklist is worth a point, and you earn it if your code does that one thing correctly. A method that is 80 percent right can still score 7 out of 9. A method that never compiles can still score points, because the rubric awards ideas, not a clean run.\n\nThat changes how you should write. Attempt every part. Never leave a method blank, because a blank method earns zero rubric points while a partial attempt can earn several.\n\n```java\npublic int countPositives(int[] nums) {\n    int count = 0;\n    for (int n : nums) {\n        if (n > 0) {\n            count++;\n        }\n    }\n    return count;\n}\n```\n\nEven if you forgot the `return`, you would still earn the points for declaring the counter, looping over the array, and the correct `if` test. Write the parts you know.\n\n## What Loses Points\n\nThe rubric also lists ways to lose points that you already earned. The most common one is a change that breaks working code, like modifying an array you were told to leave alone, or printing when the question asked you to return. Do exactly what the prompt says and no more.\n\nKey ideas to keep:\n\n- Each FRQ is 9 points, and points come from a checklist.\n- Partial credit is real, so attempt every part.\n- Do what the prompt asks, nothing extra, so you do not lose points you earned.",
      "animated_diagrams": [
        {
          "title": "How a rubric point is earned",
          "caption": "A grader walks a checklist and awards each point independently.",
          "loop": false,
          "nodes": [
            { "label": "Read prompt", "sub": "what is asked", "detail": "The grader knows exactly which behavior each point rewards before reading your code." },
            { "label": "Check line", "sub": "one behavior", "detail": "Each rubric line asks a yes or no question, like 'does the loop visit every element'." },
            { "label": "Award point", "sub": "if correct", "detail": "If your code does that one thing, you get the point, even if other parts are wrong." },
            { "label": "Sum points", "sub": "out of 9", "detail": "The points add up independently, so partial work still scores." }
          ]
        }
      ],
      "worked_examples": [
        {
          "difficulty": "easy",
          "prompt": "A method should return how many values in an int array are positive. A student writes the loop and the if test but forgets the return statement. How does it score?",
          "steps": [
            "Point for declaring and initializing a counter to 0: earned.",
            "Point for looping over every element of the array: earned.",
            "Point for the correct condition n > 0 and incrementing: earned.",
            "Point for returning the counter: lost, because there is no return.",
            "Result: strong partial credit instead of zero."
          ],
          "output": "Most of the rubric points, not zero, because partial credit rewards each correct idea."
        }
      ],
      "key_terms": [
        {
          "term": "Rubric",
          "definition": "The public checklist graders use, where each item is worth one point earned independently of the others."
        },
        {
          "term": "Partial credit",
          "definition": "Points awarded for the correct parts of an answer even when the whole method is not complete or does not compile."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Leaving an FRQ part blank and a wrong attempt both score zero points.", "correct_answer": "false", "explanation": "A blank part scores zero, but a partial attempt can earn several rubric points. Always attempt every part." },
            { "type": "fill_in", "question": "Each free response question is scored out of how many points?", "correct_answer": "9", "explanation": "Every AP CSA FRQ is graded out of 9 points against its rubric." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "Why should you attempt every part of an FRQ even if you are unsure?",
          "options": [
            "Blank answers are penalized with negative points",
            "Partial attempts can earn rubric points while a blank earns zero",
            "Graders give bonus points for length",
            "The compiler requires all methods to be filled"
          ],
          "correct_index": 1,
          "explanation": "Rubric points are awarded per correct idea, so a partial attempt can score several points while a blank scores nothing."
        },
        {
          "question": "Which action commonly loses points you already earned?",
          "options": [
            "Using clear variable names",
            "Printing a value when the prompt asked you to return it",
            "Declaring a counter variable",
            "Writing a for-each loop"
          ],
          "correct_index": 1,
          "explanation": "Doing more or less than the prompt asks, like printing instead of returning, can cost points, so follow the prompt exactly."
        }
      ],
      "challenge_title": "Total the Rubric Points",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] points = new int[n];\n        for (int i = 0; i < n; i++) {\n            points[i] = sc.nextInt();\n        }\n        System.out.println(totalPoints(points));\n    }\n\n    // TODO: return the sum of all values in the array\n    public static int totalPoints(int[] points) {\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] points = new int[n];\n        for (int i = 0; i < n; i++) {\n            points[i] = sc.nextInt();\n        }\n        System.out.println(totalPoints(points));\n    }\n\n    public static int totalPoints(int[] points) {\n        int sum = 0;\n        for (int p : points) {\n            sum += p;\n        }\n        return sum;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "4\n2 1 3 1",
          "expected_output": "7"
        },
        {
          "input": "3\n9 0 0",
          "expected_output": "9"
        },
        {
          "input": "1\n5",
          "expected_output": "5"
        }
      ]
    },
    {
      "id": "csa-11-l2",
      "project_id": "csa-11",
      "order": 2,
      "title": "FRQ Type 1: Methods and Control Structures",
      "concept": "methods and control",
      "xp_reward": 10,
      "explanation": "## What This FRQ Asks\n\nThe first FRQ usually hands you a described method and asks you to write its body. The rubric rewards the plumbing of control flow: setting up a loop, testing a condition, updating a running value, and returning the right answer. No classes to design, just one focused method.\n\n## The Standard Pattern\n\nMost of these methods follow a count or accumulate shape. You set up a result variable, walk over a range or a String, update the result when a condition holds, and return it.\n\n```java\npublic static int countVowels(String word) {\n    int count = 0;\n    for (int i = 0; i < word.length(); i++) {\n        String ch = word.substring(i, i + 1);\n        if (ch.equals(\"a\") || ch.equals(\"e\") || ch.equals(\"i\")\n                || ch.equals(\"o\") || ch.equals(\"u\")) {\n            count++;\n        }\n    }\n    return count;\n}\n```\n\nNotice the AP subset String tools: `length()`, `substring(i, i + 1)` to pull one character, and `equals` to compare. The exam does not use `charAt` in its official subset, so `substring` is the safe way to read one character.\n\n## Reading the Prompt for Clues\n\nThe prompt tells you the return type and the parameters. Match them exactly. If it says the method returns a `boolean`, your method header and every `return` must produce a boolean. A frequent point comes from the header itself, so copy the given signature precisely.\n\n```java\npublic static boolean hasDigit(String s) {\n    for (int i = 0; i < s.length(); i++) {\n        String ch = s.substring(i, i + 1);\n        if (\"0123456789\".indexOf(ch) >= 0) {\n            return true;\n        }\n    }\n    return false;\n}\n```\n\nHere the early `return true` exits as soon as the answer is known, and the `return false` at the end covers the case where no digit was found. Both returns matter for the rubric.\n\nKey points:\n\n- Set up a result, loop, test, update, return.\n- Match the given return type and parameters exactly.\n- Use `length`, `substring`, `equals`, and `indexOf` from the AP String subset.",
      "animated_diagrams": [
        {
          "title": "The count-and-accumulate loop",
          "caption": "One pass builds up a result, then returns it.",
          "loop": true,
          "nodes": [
            { "label": "Init result", "sub": "count = 0", "detail": "Start a variable that will hold the running answer before the loop begins." },
            { "label": "Visit item", "sub": "next element", "detail": "The loop moves to the next character or value in the sequence." },
            { "label": "Test", "sub": "condition?", "detail": "Check whether this item should change the result, like 'is it a vowel'." },
            { "label": "Update", "sub": "count++", "detail": "If the condition holds, adjust the running result." },
            { "label": "Return", "sub": "final value", "detail": "After the loop visits everything, return the accumulated result." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing countVowels(\"aloe\")",
          "steps": [
            { "label": "start", "detail": "count begins at 0 before the loop", "code": "int count = 0;" },
            { "label": "i = 0", "detail": "ch is 'a', which is a vowel, so count becomes 1", "code": "ch = \"a\"; count++;" },
            { "label": "i = 1", "detail": "ch is 'l', not a vowel, so count stays 1", "code": "ch = \"l\";" },
            { "label": "i = 2", "detail": "ch is 'o', a vowel, so count becomes 2", "code": "ch = \"o\"; count++;" },
            { "label": "i = 3", "detail": "ch is 'e', a vowel, so count becomes 3", "code": "ch = \"e\"; count++;" },
            { "label": "return", "detail": "the loop ends and the method returns 3", "code": "return count;" }
          ]
        }
      ],
      "key_terms": [
        {
          "term": "Accumulator",
          "definition": "A variable declared before a loop that builds up a result as the loop runs, such as a running count or sum."
        },
        {
          "term": "substring(i, i + 1)",
          "definition": "The AP-subset way to read a single character of a String as a one-character String you can compare with equals."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In the AP subset, substring(i, i + 1) is a safe way to read one character of a String.", "correct_answer": "true", "explanation": "The AP subset uses substring rather than charAt, so substring(i, i + 1) gives you one character as a String." },
            { "type": "fill_in", "question": "What method returns the number of characters in a String?", "correct_answer": "length", "explanation": "s.length() returns the character count, which usually controls the loop bound." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "Why should you copy the method signature from the prompt exactly?",
          "options": [
            "It is worth a rubric point and the return type must match your returns",
            "Longer signatures score higher",
            "The grader ignores the header",
            "It changes how fast the code runs"
          ],
          "correct_index": 0,
          "explanation": "The header itself is often a rubric point, and matching the return type keeps every return statement valid."
        },
        {
          "question": "In a boolean-returning search method, why put return false after the loop?",
          "options": [
            "It makes the loop run twice",
            "It handles the case where no match was ever found",
            "It is required by the compiler for every loop",
            "It resets the loop counter"
          ],
          "correct_index": 1,
          "explanation": "The return true inside the loop handles a found match, and the return false after the loop reports that nothing matched."
        }
      ],
      "challenge_title": "Count Values Divisible by Three",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        System.out.println(countMultiplesOfThree(nums));\n    }\n\n    // TODO: return how many values are divisible by 3\n    public static int countMultiplesOfThree(int[] nums) {\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        System.out.println(countMultiplesOfThree(nums));\n    }\n\n    public static int countMultiplesOfThree(int[] nums) {\n        int count = 0;\n        for (int x : nums) {\n            if (x % 3 == 0) {\n                count++;\n            }\n        }\n        return count;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n3 4 9 10 12",
          "expected_output": "3"
        },
        {
          "input": "4\n1 2 4 5",
          "expected_output": "0"
        },
        {
          "input": "3\n0 6 9",
          "expected_output": "3"
        }
      ]
    },
    {
      "id": "csa-11-l3",
      "project_id": "csa-11",
      "order": 3,
      "title": "FRQ Type 2: Class Design",
      "concept": "class design",
      "xp_reward": 10,
      "explanation": "## What This FRQ Asks\n\nThe class design FRQ gives you a written description of a class and asks you to write the whole thing: private instance variables, a constructor, and one or two methods. The rubric is generous here because there are many small pieces, each worth a point. Private fields, a constructor that stores its parameters, correct method headers, and correct method bodies each score.\n\n## Build It Part by Part\n\nWork top to bottom so you do not forget a piece. Declare the fields the description mentions, write a constructor that copies each parameter into a field, then write each method the prompt lists.\n\n```java\npublic class Rectangle {\n    private int width;\n    private int height;\n\n    public Rectangle(int w, int h) {\n        width = w;\n        height = h;\n    }\n\n    public int area() {\n        return width * height;\n    }\n\n    public int perimeter() {\n        return 2 * (width + height);\n    }\n}\n```\n\nEvery instance variable is `private`, the constructor stores both parameters, and each method returns the right computed value. That is four or five rubric points in a short, calm block of code.\n\n## Common Point Losses\n\nThe two mistakes that cost the most here are making fields `public` and forgetting to store a constructor parameter. If the constructor leaves a field unset, that field stays at its default and every method that uses it returns the wrong answer. Read your constructor once to confirm every field mentioned in the description gets assigned.\n\nAlso match method names and return types to the description exactly. If it says `getArea` returns an `int`, do not name it `area` or return a `double`.\n\nKey points:\n\n- Write fields, constructor, then methods, in that order.\n- Keep every instance variable `private`.\n- Make sure the constructor assigns every field the description lists.",
      "animated_diagrams": [
        {
          "title": "Building a class part by part",
          "caption": "Each piece of the class is a separate rubric point.",
          "loop": false,
          "nodes": [
            { "label": "Fields", "sub": "private state", "detail": "Declare each instance variable the description mentions and mark them private." },
            { "label": "Constructor", "sub": "store params", "detail": "Copy every constructor parameter into its matching field so no field stays at default." },
            { "label": "Methods", "sub": "behaviors", "detail": "Write each method the prompt lists, matching its name and return type." },
            { "label": "Review", "sub": "every field set", "detail": "Re-read the constructor to confirm each field is assigned before you move on." }
          ]
        }
      ],
      "worked_examples": [
        {
          "difficulty": "medium",
          "prompt": "A Savings class stores a balance and a rate. Write the fields and a constructor that takes startBalance and yearlyRate.",
          "steps": [
            "Declare private double balance and private double rate.",
            "Write the header public Savings(double startBalance, double yearlyRate).",
            "Inside, assign balance = startBalance so the field is set.",
            "Assign rate = yearlyRate so the second field is set too.",
            "Both fields are now stored, earning the constructor rubric points."
          ],
          "output": "private double balance; private double rate; and a constructor assigning both, so no field stays at its default."
        }
      ],
      "key_terms": [
        {
          "term": "Instance variable",
          "definition": "A private field declared in the class that holds one object's state and is set by the constructor."
        },
        {
          "term": "Constructor",
          "definition": "A method named for the class with no return type that stores its parameters into the object's fields."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "Leaving a constructor parameter unassigned means that field stays at its default value.", "correct_answer": "true", "explanation": "If the constructor never assigns a field, Java leaves it at 0, false, or null, and methods using it return wrong answers." },
            { "type": "fill_in", "question": "What access modifier should instance variables in a class-design FRQ use?", "correct_answer": "private", "explanation": "Instance variables should be private so the class controls access, which is a rubric requirement." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the most reliable order to write a class-design FRQ?",
          "options": [
            "Methods, then constructor, then fields",
            "Fields, then constructor, then methods",
            "Constructor only",
            "Whatever order, order does not matter for points"
          ],
          "correct_index": 1,
          "explanation": "Writing fields, then the constructor, then methods top to bottom makes it easy to confirm each field is declared and assigned."
        },
        {
          "question": "Why is forgetting to store a constructor parameter costly?",
          "options": [
            "The class will not compile at all",
            "That field stays at its default, so methods using it return wrong answers",
            "The constructor becomes static",
            "It has no effect on scoring"
          ],
          "correct_index": 1,
          "explanation": "An unassigned field keeps its default value, so any method reading it produces incorrect results and loses those points."
        }
      ],
      "challenge_title": "Design a Rectangle Class",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int w = sc.nextInt();\n        int h = sc.nextInt();\n        Rectangle r = new Rectangle(w, h);\n        System.out.println(r.area());\n        System.out.println(r.perimeter());\n    }\n}\n\nclass Rectangle {\n    // TODO: declare private width and height\n\n    // TODO: write a constructor taking w and h\n\n    // TODO: write area() returning width * height\n\n    // TODO: write perimeter() returning 2 * (width + height)\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int w = sc.nextInt();\n        int h = sc.nextInt();\n        Rectangle r = new Rectangle(w, h);\n        System.out.println(r.area());\n        System.out.println(r.perimeter());\n    }\n}\n\nclass Rectangle {\n    private int width;\n    private int height;\n\n    public Rectangle(int w, int h) {\n        width = w;\n        height = h;\n    }\n\n    public int area() {\n        return width * height;\n    }\n\n    public int perimeter() {\n        return 2 * (width + height);\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3 4",
          "expected_output": "12\n14"
        },
        {
          "input": "5 5",
          "expected_output": "25\n20"
        },
        {
          "input": "2 10",
          "expected_output": "20\n24"
        }
      ]
    },
    {
      "id": "csa-11-l4",
      "project_id": "csa-11",
      "order": 4,
      "title": "FRQ Type 3: Array and ArrayList",
      "concept": "array and arraylist",
      "xp_reward": 10,
      "explanation": "## What This FRQ Asks\n\nThe array FRQ gives you a one-dimensional array or an `ArrayList` and asks you to search it, sum it, find a maximum, or build a new list from it. The rubric rewards a correct traversal and correct index or element handling. Off-by-one errors are the number one point loss here, so bound your loops carefully.\n\n## Traversing an Array\n\nWhen you only read elements, a for-each loop is clean and avoids index mistakes:\n\n```java\npublic static int maxValue(int[] arr) {\n    int max = arr[0];\n    for (int x : arr) {\n        if (x > max) {\n            max = x;\n        }\n    }\n    return max;\n}\n```\n\nStart `max` at `arr[0]`, not at `0`, or an array of all negative numbers would give the wrong answer. When you need the index, use a counted loop with the correct bound `i < arr.length`:\n\n```java\nfor (int i = 0; i < arr.length; i++) {\n    // arr[i] is valid for every i here\n}\n```\n\n## ArrayList Basics\n\nAn `ArrayList` uses methods instead of brackets. The four you need are `size()`, `get(i)`, `add(x)`, and `remove(i)`.\n\n```java\npublic static int sumList(ArrayList<Integer> list) {\n    int sum = 0;\n    for (int i = 0; i < list.size(); i++) {\n        sum += list.get(i);\n    }\n    return sum;\n}\n```\n\nWhen you remove from an `ArrayList` inside a loop, be careful. After `remove(i)`, every later element shifts left by one, so blindly doing `i++` skips the next element. A common fix is to not increment `i` in the iteration where you removed.\n\nKey points:\n\n- Bound array loops with `i < arr.length` and start a max at `arr[0]`.\n- Use `size`, `get`, `add`, and `remove` for an `ArrayList`.\n- Removing during a loop shifts indices, so adjust your counter.",
      "animated_diagrams": [
        {
          "title": "Array traversal to find the max",
          "caption": "The loop compares each element against the running maximum.",
          "loop": true,
          "nodes": [
            { "label": "max = arr[0]", "sub": "seed", "detail": "Start the maximum at the first element, not zero, so negatives work." },
            { "label": "arr[1]", "sub": "compare", "detail": "Compare the next element to max and keep the larger one." },
            { "label": "arr[2]", "sub": "compare", "detail": "Continue element by element, updating max whenever a bigger value appears." },
            { "label": "arr[n-1]", "sub": "last", "detail": "The final index is length minus one, the correct loop bound." },
            { "label": "return max", "sub": "result", "detail": "After visiting every element, return the largest value found." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing maxValue on {4, 9, 2}",
          "steps": [
            { "label": "start", "detail": "max is seeded with the first element", "code": "int max = arr[0];  // max = 4" },
            { "label": "x = 4", "detail": "4 > 4 is false, so max stays 4", "code": "if (4 > 4) // false" },
            { "label": "x = 9", "detail": "9 > 4 is true, so max becomes 9", "code": "max = 9;" },
            { "label": "x = 2", "detail": "2 > 9 is false, so max stays 9", "code": "if (2 > 9) // false" },
            { "label": "return", "detail": "the loop ends and the method returns 9", "code": "return max;  // 9" }
          ]
        }
      ],
      "key_terms": [
        {
          "term": "Off-by-one error",
          "definition": "A loop bound that is one too high or too low, causing an out-of-bounds access or a skipped element."
        },
        {
          "term": "ArrayList",
          "definition": "A resizable list that uses methods size, get, add, and remove instead of the square-bracket indexing arrays use."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "You should seed a running maximum with arr[0] rather than 0.", "correct_answer": "true", "explanation": "Seeding with 0 breaks on arrays of all negative numbers, so start the max at the first element." },
            { "type": "fill_in", "question": "Which ArrayList method returns the number of elements?", "correct_answer": "size", "explanation": "list.size() returns the element count, and it is what you use as the loop bound." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the correct upper bound for a counted loop over an array named arr?",
          "options": [
            "i <= arr.length",
            "i < arr.length",
            "i < arr.length - 1",
            "i <= arr.length + 1"
          ],
          "correct_index": 1,
          "explanation": "Valid indices are 0 through length minus one, so i < arr.length visits every element without going out of bounds."
        },
        {
          "question": "Why can removing from an ArrayList inside a loop skip elements?",
          "options": [
            "remove is not allowed in loops",
            "After a removal, later elements shift left, so incrementing the index skips one",
            "remove doubles the list size",
            "get stops working after remove"
          ],
          "correct_index": 1,
          "explanation": "Removing at index i shifts every later element left by one, so a plain i++ jumps past the element that moved into position i."
        }
      ],
      "challenge_title": "Find the Maximum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n        System.out.println(maxValue(arr));\n    }\n\n    // TODO: return the largest value in arr (arr has at least one element)\n    public static int maxValue(int[] arr) {\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n        System.out.println(maxValue(arr));\n    }\n\n    public static int maxValue(int[] arr) {\n        int max = arr[0];\n        for (int x : arr) {\n            if (x > max) {\n                max = x;\n            }\n        }\n        return max;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "5\n4 9 2 9 1",
          "expected_output": "9"
        },
        {
          "input": "3\n-5 -2 -8",
          "expected_output": "-2"
        },
        {
          "input": "1\n7",
          "expected_output": "7"
        }
      ]
    },
    {
      "id": "csa-11-l5",
      "project_id": "csa-11",
      "order": 5,
      "title": "FRQ Type 4: 2D Array",
      "concept": "2d array",
      "xp_reward": 10,
      "explanation": "## What This FRQ Asks\n\nThe last FRQ works with a two-dimensional array, a grid of rows and columns. You might sum the whole grid, sum one row, find a column total, or count values that match a rule. The rubric rewards a correct nested loop with the row and column bounds set right.\n\n## The Nested Loop\n\nA 2D array in Java is an array of rows. For a grid named `g`, `g.length` is the number of rows, and `g[r].length` is the number of columns in row `r`. The standard traversal is an outer loop over rows and an inner loop over columns.\n\n```java\npublic static int gridSum(int[][] g) {\n    int sum = 0;\n    for (int r = 0; r < g.length; r++) {\n        for (int c = 0; c < g[r].length; c++) {\n            sum += g[r][c];\n        }\n    }\n    return sum;\n}\n```\n\nRead `g[r][c]` as row `r`, column `c`. The most common mistake is swapping the two, writing `g[c][r]`, which goes out of bounds on a non-square grid. Keep row first, column second, every time.\n\n## Row Versus Column Work\n\nIf the prompt asks about one specific row, you only need a single loop over the columns of that row:\n\n```java\npublic static int rowSum(int[][] g, int row) {\n    int sum = 0;\n    for (int c = 0; c < g[row].length; c++) {\n        sum += g[row][c];\n    }\n    return sum;\n}\n```\n\nA column total is the opposite: fix the column and loop over the rows, using `g[r][col]`. Decide which index stays fixed before you write the loop.\n\nKey points:\n\n- `g.length` counts rows, `g[r].length` counts columns.\n- Always index as `g[row][column]`, row first.\n- For one row, loop columns; for one column, loop rows.",
      "animated_diagrams": [
        {
          "title": "Row by row, column by column",
          "caption": "The outer loop picks a row, the inner loop walks its columns.",
          "loop": true,
          "nodes": [
            { "label": "row r", "sub": "outer loop", "detail": "The outer loop selects a row, from 0 up to g.length minus one." },
            { "label": "col 0", "sub": "inner start", "detail": "For the current row, the inner loop starts at column 0." },
            { "label": "g[r][c]", "sub": "visit cell", "detail": "Read the cell at row r, column c, and add it to the running sum." },
            { "label": "next col", "sub": "inner step", "detail": "The inner loop advances across every column of this row." },
            { "label": "next row", "sub": "outer step", "detail": "When the row is done, the outer loop moves to the next row." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing gridSum on {{1,2},{3,4}}",
          "steps": [
            { "label": "start", "detail": "sum begins at 0 before the loops", "code": "int sum = 0;" },
            { "label": "r=0,c=0", "detail": "add g[0][0] which is 1, sum becomes 1", "code": "sum += 1;  // 1" },
            { "label": "r=0,c=1", "detail": "add g[0][1] which is 2, sum becomes 3", "code": "sum += 2;  // 3" },
            { "label": "r=1,c=0", "detail": "add g[1][0] which is 3, sum becomes 6", "code": "sum += 3;  // 6" },
            { "label": "r=1,c=1", "detail": "add g[1][1] which is 4, sum becomes 10", "code": "sum += 4;  // 10" },
            { "label": "return", "detail": "both loops finish and the method returns 10", "code": "return sum;  // 10" }
          ]
        }
      ],
      "key_terms": [
        {
          "term": "2D array",
          "definition": "An array of arrays forming a grid, where g.length is the row count and g[r].length is the column count of row r."
        },
        {
          "term": "Nested loop",
          "definition": "A loop inside another loop, used to visit every cell of a grid with the outer index for rows and inner for columns."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "For a grid g, the correct order to index a cell is g[row][column].", "correct_answer": "true", "explanation": "Row comes first and column second, so g[row][column] is correct; swapping them can go out of bounds." },
            { "type": "fill_in", "question": "What expression gives the number of rows in a 2D array g?", "correct_answer": "g.length", "explanation": "g.length is the number of rows, while g[r].length is the number of columns in row r." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "For a 2D array g, what does g[r].length give you?",
          "options": [
            "The number of rows",
            "The number of columns in row r",
            "The total number of cells",
            "The value at row r"
          ],
          "correct_index": 1,
          "explanation": "g.length is the row count, and g[r].length is the number of columns in that particular row."
        },
        {
          "question": "To sum one fixed column of a grid, which index do you loop over?",
          "options": [
            "The column index, keeping the row fixed",
            "The row index, keeping the column fixed",
            "Neither, a single value is enough",
            "Both at the same time in one loop"
          ],
          "correct_index": 1,
          "explanation": "A column total fixes the column and loops over the rows, reading g[r][col] for each row r."
        }
      ],
      "challenge_title": "Sum a Grid",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] g = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                g[r][c] = sc.nextInt();\n            }\n        }\n        System.out.println(gridSum(g));\n    }\n\n    // TODO: return the sum of every cell in the grid\n    public static int gridSum(int[][] g) {\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] g = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                g[r][c] = sc.nextInt();\n            }\n        }\n        System.out.println(gridSum(g));\n    }\n\n    public static int gridSum(int[][] g) {\n        int sum = 0;\n        for (int r = 0; r < g.length; r++) {\n            for (int c = 0; c < g[r].length; c++) {\n                sum += g[r][c];\n            }\n        }\n        return sum;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "2 2\n1 2\n3 4",
          "expected_output": "10"
        },
        {
          "input": "2 3\n1 1 1\n1 1 1",
          "expected_output": "6"
        },
        {
          "input": "1 4\n5 0 5 0",
          "expected_output": "10"
        }
      ]
    },
    {
      "id": "csa-11-l6",
      "project_id": "csa-11",
      "order": 6,
      "title": "Reading and Tracing Code Under Time Pressure",
      "concept": "tracing code",
      "xp_reward": 10,
      "explanation": "## Why Tracing Wins Points\n\nMany multiple choice questions and the early parts of FRQs ask you to predict what code outputs. The fastest, most reliable way is not to read the code and guess. It is to trace it by hand: keep a small table of every variable and update it line by line as the code runs. Under time pressure, a two-line table beats re-reading a loop five times.\n\n## The Variable Table\n\nWrite the variables across the top and add a row each time something changes. Here is a loop and its trace.\n\n```java\nint sum = 0;\nfor (int i = 1; i <= 4; i++) {\n    sum += i;\n}\nSystem.out.println(sum);\n```\n\nYour table would track `i` and `sum`: after `i = 1`, `sum = 1`; after `i = 2`, `sum = 3`; after `i = 3`, `sum = 6`; after `i = 4`, `sum = 10`. The loop stops when `i` reaches 5, so the output is `10`. Writing those four rows takes ten seconds and removes all doubt.\n\n## Watch the Loop Boundaries\n\nThe two spots that trip people are the loop start and the loop end. Check the initial value, then check the exact condition. `i <= 4` runs for `i` equal to 1, 2, 3, 4. Change it to `i < 4` and it stops at 3, giving `sum = 6` instead. When a question offers answers that differ by one iteration, the trap is a boundary, so trace the first and last passes with care.\n\n```java\nint p = 1;\nfor (int k = 0; k < 3; k++) {\n    p = p * 2;\n}\n// p doubles three times: 2, 4, 8\n```\n\nKey points:\n\n- Trace with a small variable table, one row per change.\n- Verify the loop's first and last iteration explicitly.\n- Boundary conditions like `<` versus `<=` are the classic trap.",
      "animated_diagrams": [
        {
          "title": "Tracing with a variable table",
          "caption": "Each loop pass adds one row to your hand-drawn table.",
          "loop": true,
          "nodes": [
            { "label": "Setup", "sub": "list variables", "detail": "Write each variable's starting value in the first row of your table." },
            { "label": "Enter loop", "sub": "check condition", "detail": "Confirm the loop condition is true before running the body." },
            { "label": "Run body", "sub": "update row", "detail": "Apply the body's changes and record the new values in a fresh row." },
            { "label": "Update index", "sub": "step", "detail": "Advance the loop counter and re-check the condition for the next pass." },
            { "label": "Exit", "sub": "read result", "detail": "When the condition is false, the last row holds the values to report." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing the doubling loop",
          "steps": [
            { "label": "start", "detail": "p begins at 1 before the loop", "code": "int p = 1;" },
            { "label": "k = 0", "detail": "0 < 3 is true, so p doubles to 2", "code": "p = p * 2;  // 2" },
            { "label": "k = 1", "detail": "1 < 3 is true, so p doubles to 4", "code": "p = p * 2;  // 4" },
            { "label": "k = 2", "detail": "2 < 3 is true, so p doubles to 8", "code": "p = p * 2;  // 8" },
            { "label": "k = 3", "detail": "3 < 3 is false, so the loop ends", "code": "// loop exits, p = 8" }
          ]
        }
      ],
      "key_terms": [
        {
          "term": "Hand tracing",
          "definition": "Running code on paper by tracking each variable's value in a table, one row per change, instead of guessing the result."
        },
        {
          "term": "Boundary condition",
          "definition": "The exact test that starts and stops a loop, such as i < 4 versus i <= 4, a frequent source of off-by-one traps."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "A loop with condition i <= 4 starting at i = 1 runs its body four times.", "correct_answer": "true", "explanation": "It runs for i equal to 1, 2, 3, and 4, so four iterations before i reaches 5 and stops." },
            { "type": "fill_in", "question": "What technique means running code on paper by tracking each variable's value?", "correct_answer": "tracing", "explanation": "Hand tracing with a variable table is the reliable way to predict output under time pressure." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "What does the loop for (int i = 1; i <= 4; i++) sum += i; leave in sum, starting from 0?",
          "options": [
            "6",
            "10",
            "4",
            "15"
          ],
          "correct_index": 1,
          "explanation": "It adds 1 + 2 + 3 + 4, which is 10, because i <= 4 includes the value 4."
        },
        {
          "question": "Why check the first and last iterations of a loop when tracing?",
          "options": [
            "They are the only ones the compiler runs",
            "Boundary conditions cause most off-by-one errors and trap answers",
            "The middle iterations never change variables",
            "It makes the code run faster"
          ],
          "correct_index": 1,
          "explanation": "The start value and the stop condition are where off-by-one mistakes hide, so verifying them catches the classic traps."
        }
      ],
      "challenge_title": "Sum One to N",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(sumToN(n));\n    }\n\n    // TODO: return 1 + 2 + ... + n using a loop (return 0 if n < 1)\n    public static int sumToN(int n) {\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(sumToN(n));\n    }\n\n    public static int sumToN(int n) {\n        int sum = 0;\n        for (int i = 1; i <= n; i++) {\n            sum += i;\n        }\n        return sum;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "4",
          "expected_output": "10"
        },
        {
          "input": "1",
          "expected_output": "1"
        },
        {
          "input": "10",
          "expected_output": "55"
        }
      ]
    },
    {
      "id": "csa-11-l7",
      "project_id": "csa-11",
      "order": 7,
      "title": "Common Mistakes That Lose Points",
      "concept": "common mistakes",
      "xp_reward": 10,
      "explanation": "## The Small Errors That Cost the Most\n\nA handful of mistakes show up on almost every exam and quietly drain points. Knowing them by name lets you scan your own code for them before you move on. Four stand out: comparing objects with `==`, off-by-one loop bounds, boundary conditions, and printing when you should return.\n\n## == Versus .equals\n\nFor `String` and other objects, `==` tests whether two references point to the same object, not whether they hold the same text. To compare content, use `.equals`.\n\n```java\nString a = \"hi\";\nString b = new String(\"hi\");\nif (a == b) { }        // may be false, compares references\nif (a.equals(b)) { }   // true, compares the characters\n```\n\nUse `==` only for primitives like `int` and `boolean`. For anything built with `new` or returned as an object, reach for `.equals`.\n\n## Off-by-One and Boundaries\n\nLoop bounds are the second big trap. Valid array indices run from `0` to `length - 1`, so the correct bound is `i < arr.length`. Writing `i <= arr.length` reads one past the end and throws an out-of-bounds error. Whenever a loop touches the first or last element, trace those two passes to be sure.\n\n## Return Versus Print\n\nThe third trap is doing the wrong action with your answer. If the prompt says the method returns a value, a `System.out.println` earns nothing, because the caller gets no value back. Return the result and let the caller decide whether to print it.\n\n```java\npublic static int doubleIt(int x) {\n    System.out.println(x * 2);   // WRONG: returns nothing useful\n}\n// correct:\npublic static int doubleIt2(int x) {\n    return x * 2;\n}\n```\n\nKey points:\n\n- Use `.equals` for objects, `==` only for primitives.\n- Bound array loops with `i < arr.length` to avoid off-by-one.\n- Return the value the prompt asks for instead of printing it.",
      "animated_diagrams": [
        {
          "title": "Scan for the four common errors",
          "caption": "A quick self-check pass before you leave a method.",
          "loop": false,
          "nodes": [
            { "label": "==  check", "sub": "objects?", "detail": "Find every == and confirm both sides are primitives, not Strings or objects." },
            { "label": "Bounds", "sub": "length?", "detail": "Confirm array loops use i < arr.length so you never read one past the end." },
            { "label": "Boundary", "sub": "first/last", "detail": "Trace the first and last iteration to catch off-by-one traps." },
            { "label": "Return", "sub": "not print", "detail": "If the prompt says return, make sure you return the value rather than print it." }
          ]
        }
      ],
      "comparison_tables": [
        {
          "title": "== versus .equals",
          "columns": ["Aspect", "==", ".equals"],
          "rows": [
            ["Compares", "references (same object)", "contents (same value)"],
            ["Use for", "primitives like int, boolean", "Strings and other objects"],
            ["Risk", "false for equal text", "safe for content checks"]
          ]
        }
      ],
      "key_terms": [
        {
          "term": "Reference equality",
          "definition": "What == tests for objects: whether two variables point to the very same object, not whether their contents match."
        },
        {
          "term": "Return versus print",
          "definition": "Returning hands a value back to the caller; printing only displays text and gives the caller nothing to use."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "You should compare two String values for equal text using ==.", "correct_answer": "false", "explanation": "Use .equals for Strings; == compares references and may be false even when the text matches." },
            { "type": "fill_in", "question": "What method compares two Strings by their contents?", "correct_answer": "equals", "explanation": "a.equals(b) compares the characters, which is what you almost always want for Strings." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "Which comparison correctly checks if two String variables hold the same text?",
          "options": [
            "a == b",
            "a.equals(b)",
            "a = b",
            "a != b"
          ],
          "correct_index": 1,
          "explanation": "a.equals(b) compares the actual characters, while == only checks whether they are the same object in memory."
        },
        {
          "question": "The prompt says a method returns the count. What happens if you print it instead?",
          "options": [
            "It earns full credit anyway",
            "The caller gets no value back, so it loses points",
            "The code will not compile",
            "It runs faster but scores the same"
          ],
          "correct_index": 1,
          "explanation": "Printing displays text but returns nothing, so the caller has no value to use and the rubric point is lost."
        }
      ],
      "challenge_title": "Count Matching Words",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        String[] words = new String[n];\n        for (int i = 0; i < n; i++) {\n            words[i] = sc.next();\n        }\n        String target = sc.next();\n        System.out.println(countMatches(words, target));\n    }\n\n    // TODO: return how many words equal target (compare with .equals, not ==)\n    public static int countMatches(String[] words, String target) {\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        String[] words = new String[n];\n        for (int i = 0; i < n; i++) {\n            words[i] = sc.next();\n        }\n        String target = sc.next();\n        System.out.println(countMatches(words, target));\n    }\n\n    public static int countMatches(String[] words, String target) {\n        int count = 0;\n        for (int i = 0; i < words.length; i++) {\n            if (words[i].equals(target)) {\n                count++;\n            }\n        }\n        return count;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "4\ncat dog cat fish\ncat",
          "expected_output": "2"
        },
        {
          "input": "3\na b c\nd",
          "expected_output": "0"
        },
        {
          "input": "5\nyes yes yes no yes\nyes",
          "expected_output": "4"
        }
      ]
    },
    {
      "id": "csa-11-l8",
      "project_id": "csa-11",
      "order": 8,
      "title": "A Full Timed FRQ Walkthrough",
      "concept": "full walkthrough",
      "xp_reward": 10,
      "explanation": "## Putting It All Together\n\nNow you will work one FRQ the way you should on exam day, start to finish, with the clock running. The habit is always the same: read the prompt twice, name the return type and parameters, write the loop skeleton, fill in the logic, then trace one example to check.\n\n## The Prompt\n\nA class GradeBook stores an array of int scores. Write a method `passingCount` that returns how many scores are 60 or higher.\n\n```java\npublic int passingCount() {\n    // scores is a private int[] field\n}\n```\n\n## Step 1: Set Up the Skeleton\n\nThe return type is `int`, and there are no parameters, so start with a counter and a loop over the field.\n\n```java\npublic int passingCount() {\n    int count = 0;\n    for (int i = 0; i < scores.length; i++) {\n        // test each score here\n    }\n    return count;\n}\n```\n\nRight away you have earned the header, the counter, the traversal, and the return. Those are points even before the logic.\n\n## Step 2: Fill In the Logic\n\nThe passing rule is a score of 60 or more, so the boundary matters. Use `>= 60`, not `> 60`, because 60 itself passes.\n\n```java\npublic int passingCount() {\n    int count = 0;\n    for (int i = 0; i < scores.length; i++) {\n        if (scores[i] >= 60) {\n            count++;\n        }\n    }\n    return count;\n}\n```\n\n## Step 3: Trace One Example\n\nWith scores `{55, 60, 90}`: 55 fails, 60 passes so count is 1, 90 passes so count is 2. The method returns 2, which matches by hand. That trace is your proof the boundary is right.\n\nKey points:\n\n- Skeleton first, logic second, trace last.\n- Watch the boundary word: 'or higher' means `>=`.\n- A quick trace of one example confirms your answer before you move on.",
      "animated_diagrams": [
        {
          "title": "The four-step FRQ routine",
          "caption": "The same loop you run on every free-response question.",
          "loop": true,
          "nodes": [
            { "label": "Read twice", "sub": "return + params", "detail": "Read the prompt twice and note the exact return type and parameters." },
            { "label": "Skeleton", "sub": "counter + loop", "detail": "Write the header, a result variable, the loop, and the return before any logic." },
            { "label": "Logic", "sub": "the condition", "detail": "Fill in the test, watching boundary words like 'or higher' for >=." },
            { "label": "Trace", "sub": "one example", "detail": "Run one small input by hand to confirm the answer matches." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing passingCount on {55, 60, 90}",
          "steps": [
            { "label": "start", "detail": "count begins at 0 before the loop", "code": "int count = 0;" },
            { "label": "i = 0", "detail": "scores[0] is 55, and 55 >= 60 is false, so count stays 0", "code": "if (55 >= 60) // false" },
            { "label": "i = 1", "detail": "scores[1] is 60, and 60 >= 60 is true, so count becomes 1", "code": "count++;  // 1" },
            { "label": "i = 2", "detail": "scores[2] is 90, and 90 >= 60 is true, so count becomes 2", "code": "count++;  // 2" },
            { "label": "return", "detail": "the loop ends and the method returns 2", "code": "return count;  // 2" }
          ]
        }
      ],
      "key_terms": [
        {
          "term": "Skeleton first",
          "definition": "Writing the method header, result variable, loop, and return before the logic so you bank the easy rubric points immediately."
        },
        {
          "term": "Boundary word",
          "definition": "A word in the prompt like 'or higher' or 'at least' that tells you whether to use >= or >, deciding whether the edge value counts."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "If the passing rule is 'a score of 60 or higher', a score of exactly 60 should count as passing.", "correct_answer": "true", "explanation": "'Or higher' includes the boundary, so use >= 60 and 60 itself passes." },
            { "type": "fill_in", "question": "Which comparison operator means 'greater than or equal to'?", "correct_answer": ">=", "explanation": "The operator >= includes the boundary value, which 'or higher' and 'at least' both call for." }
          ]
        }
      ],
      "quiz_questions": [
        {
          "question": "The prompt says 'a score of 60 or higher passes'. Which test is correct?",
          "options": [
            "scores[i] > 60",
            "scores[i] >= 60",
            "scores[i] == 60",
            "scores[i] < 60"
          ],
          "correct_index": 1,
          "explanation": "'Or higher' includes 60 itself, so the boundary needs >= 60, not > 60 which would exclude a score of exactly 60."
        },
        {
          "question": "Why write the skeleton before the logic on an FRQ?",
          "options": [
            "It looks neater to the grader",
            "The header, counter, loop, and return each earn points independent of the logic",
            "The compiler requires it",
            "It makes the logic run faster"
          ],
          "correct_index": 1,
          "explanation": "The structural pieces are separate rubric points, so writing them first banks credit even if you struggle with the exact condition."
        }
      ],
      "challenge_title": "Count Passing Scores",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] scores = new int[n];\n        for (int i = 0; i < n; i++) {\n            scores[i] = sc.nextInt();\n        }\n        GradeBook gb = new GradeBook(scores);\n        System.out.println(gb.passingCount());\n    }\n}\n\nclass GradeBook {\n    private int[] scores;\n\n    public GradeBook(int[] s) {\n        scores = s;\n    }\n\n    // TODO: return how many scores are 60 or higher\n    public int passingCount() {\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] scores = new int[n];\n        for (int i = 0; i < n; i++) {\n            scores[i] = sc.nextInt();\n        }\n        GradeBook gb = new GradeBook(scores);\n        System.out.println(gb.passingCount());\n    }\n}\n\nclass GradeBook {\n    private int[] scores;\n\n    public GradeBook(int[] s) {\n        scores = s;\n    }\n\n    public int passingCount() {\n        int count = 0;\n        for (int i = 0; i < scores.length; i++) {\n            if (scores[i] >= 60) {\n                count++;\n            }\n        }\n        return count;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3\n55 60 90",
          "expected_output": "2"
        },
        {
          "input": "4\n10 20 30 40",
          "expected_output": "0"
        },
        {
          "input": "5\n60 60 60 59 100",
          "expected_output": "4"
        }
      ]
    }
  ]
}
