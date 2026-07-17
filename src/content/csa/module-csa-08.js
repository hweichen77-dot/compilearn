export default {
  "project": {
    "id": "csa-08",
    "title": "2D Array",
    "description": "Covers two-dimensional array declaration and initialization, row-major order, nested-loop traversal, enhanced-for iteration, and standard grid algorithms in the AP CSA Java subset.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 208,
    "track": "apcsa",
    "unit": "Unit 8, 2D Array",
    "tags": [
      "2D arrays",
      "nested loops",
      "grids"
    ]
  },
  "lessons": [
    {
      "id": "csa-08-l1",
      "project_id": "csa-08",
      "order": 1,
      "title": "Declaring and Initializing 2D Arrays",
      "explanation": "## What Is a 2D Array?\n\nA **two-dimensional array** stores data in a grid of **rows** and **columns**. In Java it is really an *array of arrays*: each element of the outer array is itself a one-dimensional array (a row). On the AP CSA exam you only deal with **rectangular** 2D arrays, where every row has the same number of columns.\n\n## Declaration Syntax\n\nYou declare a 2D array by writing the element type followed by two pairs of brackets, then create the grid with `new`:\n\n```java\nint[][] grid = new int[3][4];  // 3 rows, 4 columns\n```\n\nThis makes a grid with **3 rows** and **4 columns**. Every slot starts at the **default value** for the type, `0` for `int`, `0.0` for `double`, `false` for `boolean`, and `null` for object types like `String`.\n\n## Initializer Lists\n\nYou can also build a 2D array with a nested **initializer list**, giving the values directly. The compiler counts the rows and columns for you:\n\n```java\nint[][] m = { {1, 2, 3},\n              {4, 5, 6} };  // 2 rows, 3 columns\n```\n\n## Accessing Elements\n\nYou access a single cell with **two indices**: the first is the row, the second is the column. Both start at `0`.\n\n```java\nint[][] m = { {1, 2, 3}, {4, 5, 6} };\nSystem.out.println(m[0][0]); // 1  (row 0, col 0)\nSystem.out.println(m[1][2]); // 6  (row 1, col 2)\nm[0][1] = 99;                // overwrite a cell\n```\n\n- `m[r][c]` reads or writes the cell at row `r`, column `c`.\n- The **first index** selects the row, the **second** selects the column. Reversing them is a classic bug.\n\nValid row indices run from `0` to `numRows - 1`, and valid column indices from `0` to `numCols - 1`. Going outside these bounds throws an `ArrayIndexOutOfBoundsException`. Mastering this `[row][col]` order is the foundation for everything else in this unit.",
      "animated_diagrams": [
        {
          "title": "Indexing a cell with [row][col]",
          "caption": "The first index picks the row, then the second index picks the column inside that row.",
          "loop": false,
          "nodes": [
            { "label": "int[][] m", "sub": "array of rows", "detail": "m holds two rows: {1,2,3} and {4,5,6}. Each row is its own 1D array." },
            { "label": "m[1]", "sub": "pick the row", "detail": "The first index, 1, selects row 1, the array {4,5,6}." },
            { "label": "m[1][2]", "sub": "pick the column", "detail": "The second index, 2, selects column 2 of that row, the value 6." },
            { "label": "Result: 6", "sub": "one cell", "detail": "m[1][2] reads the cell at row 1, column 2. Reversing the indices would read a different cell or go out of bounds." }
          ]
        }
      ],
      "worked_examples": [
        {
          "difficulty": "easy",
          "prompt": "Given int[][] m = { {1, 2, 3}, {4, 5, 6} };, what does m[0][2] evaluate to, and what does m[1][0] evaluate to?",
          "steps": [
            "m[0] selects row 0, which is the array {1, 2, 3}.",
            "m[0][2] then selects column 2 of that row, the value 3.",
            "m[1] selects row 1, which is {4, 5, 6}.",
            "m[1][0] selects column 0 of that row, the value 4."
          ],
          "output": "m[0][2] is 3 and m[1][0] is 4."
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "In new int[3][4], the 3 is the number of columns.", "correct_answer": "false", "explanation": "The first bracket is rows, so 3 is the row count and 4 is the column count." },
            { "type": "fill_in", "question": "In the access m[r][c], which part selects the row: the first or the second index? Answer with one word.", "correct_answer": "first", "explanation": "The first index selects the row and the second selects the column." }
          ]
        }
      ],
      "callouts": [
        { "type": "warning", "position": "after", "title": "Do not swap [row][col]", "content": "Writing m[c][r] when you meant m[r][c] is the classic 2D bug. It either reads the wrong cell or throws ArrayIndexOutOfBoundsException on a non-square grid. Always put row first." }
      ],
      "challenge_title": "Read and Echo a Grid Cell",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        // TODO: read rows*cols values in row order into grid,\n        // then read r and c and print grid[r][c]\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                grid[r][c] = sc.nextInt();\n            }\n        }\n        int r = sc.nextInt();\n        int c = sc.nextInt();\n        System.out.println(grid[r][c]);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6\n1 2",
          "expected_output": "6"
        },
        {
          "input": "2 2\n7 8\n9 10\n0 0",
          "expected_output": "7"
        },
        {
          "input": "3 3\n1 2 3\n4 5 6\n7 8 9\n2 1",
          "expected_output": "8"
        }
      ],
      "key_terms": [
        {
          "term": "2D array",
          "definition": "An array of arrays that stores values in a grid of rows and columns; in Java each row is itself a 1D array."
        },
        {
          "term": "Default value",
          "definition": "The value every cell holds right after creation with new: 0 for int, 0.0 for double, false for boolean, null for objects."
        },
        {
          "term": "Index order [row][col]",
          "definition": "The convention that the first index selects the row and the second selects the column when accessing a 2D array cell."
        }
      ],
      "inline_quizzes": [
        {
          "question": "For `int[][] m = new int[3][4];`, how many rows and columns does m have?",
          "options": [
            "4 rows, 3 columns",
            "3 rows, 4 columns",
            "12 rows, 1 column",
            "3 rows, 3 columns"
          ],
          "correct_index": 1,
          "explanation": "The first bracket gives the number of rows (3) and the second gives the number of columns (4)."
        }
      ],
      "quiz_questions": [
        {
          "question": "What value does `grid[1][1]` hold immediately after `int[][] grid = new int[2][2];`?",
          "options": [
            "null",
            "0",
            "1",
            "It is undefined"
          ],
          "correct_index": 1,
          "explanation": "For an int 2D array every cell starts at the default value 0 right after creation with new."
        },
        {
          "question": "In `m[r][c]`, which index selects the column?",
          "options": [
            "r, the first index",
            "c, the second index",
            "Both r and c together",
            "Neither; columns are not indexed"
          ],
          "correct_index": 1,
          "explanation": "The first index r selects the row and the second index c selects the column."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l2",
      "project_id": "csa-08",
      "order": 2,
      "title": "Row-Major Order and Dimensions",
      "explanation": "## Row-Major Order\n\nJava stores and processes 2D arrays in **row-major order**: you finish all the columns of row 0 before moving to row 1, then row 2, and so on. When you traverse a grid with nested loops, the **outer loop walks the rows** and the **inner loop walks the columns** of the current row.\n\n```java\nint[][] m = { {1, 2, 3}, {4, 5, 6} };\nfor (int r = 0; r < 2; r++) {\n    for (int c = 0; c < 3; c++) {\n        System.out.print(m[r][c] + \" \");\n    }\n}\n// prints: 1 2 3 4 5 6\n```\n\nThe values come out in the order `1 2 3 4 5 6`, row 0 first, then row 1. That ordering is exactly what *row-major* means.\n\n## Finding the Dimensions\n\nYou rarely hard-code the size. Instead you ask the array for its dimensions:\n\n- `arr.length` is the **number of rows** (length of the outer array).\n- `arr[0].length` is the **number of columns** (length of a single row).\n\n```java\nint[][] m = { {1, 2, 3}, {4, 5, 6} };\nint numRows = m.length;        // 2\nint numCols = m[0].length;     // 3\n```\n\n## Why This Matters\n\nUsing `.length` makes your loops work for **any** size grid:\n\n```java\nfor (int r = 0; r < m.length; r++) {\n    for (int c = 0; c < m[0].length; c++) {\n        System.out.print(m[r][c]);\n    }\n}\n```\n\n- The **outer bound** is `m.length` (rows).\n- The **inner bound** is `m[r].length` or `m[0].length` (columns).\n\nA frequent mistake is swapping these bounds, which throws an `ArrayIndexOutOfBoundsException` whenever the grid is not square. Because the AP exam uses only rectangular arrays, `m[0].length` always equals `m[r].length`, but writing `m[r].length` is the most robust habit. Remember: **outer = rows, inner = columns, row-major = rows first.**",
      "animated_diagrams": [
        {
          "title": "Row-major sweep of a 2x3 grid",
          "caption": "Finish all columns of a row before moving down to the next row.",
          "loop": true,
          "nodes": [
            { "label": "m[0][0]=1", "sub": "row 0, col 0", "detail": "Start at the top-left. The inner loop is about to walk across row 0." },
            { "label": "m[0][1]=2", "sub": "row 0, col 1", "detail": "Move right one column. Still on row 0." },
            { "label": "m[0][2]=3", "sub": "row 0, col 2", "detail": "Last column of row 0. The inner loop ends, so the outer loop advances." },
            { "label": "m[1][0]=4", "sub": "row 1, col 0", "detail": "Drop to row 1 and reset the column back to 0." },
            { "label": "m[1][1]=5", "sub": "row 1, col 1", "detail": "Keep sweeping across row 1." },
            { "label": "m[1][2]=6", "sub": "row 1, col 2", "detail": "Last cell. Output order was 1 2 3 4 5 6, which is what row-major means." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Tracing m.length and m[0].length",
          "steps": [
            { "label": "Grid built", "detail": "m holds two rows, each with three values.", "code": "int[][] m = { {1,2,3}, {4,5,6} };" },
            { "label": "Count rows", "detail": "m.length is the length of the outer array, which holds 2 rows.", "code": "int numRows = m.length;   // 2" },
            { "label": "Count columns", "detail": "m[0] is the first row {1,2,3}, and its length is 3 columns.", "code": "int numCols = m[0].length; // 3" },
            { "label": "Loop bounds", "detail": "The outer loop stops at numRows, the inner at numCols, so it works for any size grid.", "code": "for (int r=0; r<m.length; r++) for (int c=0; c<m[r].length; c++)" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "fill_in", "question": "Which expression gives the number of rows in a 2D array named grid? Answer with the exact code.", "correct_answer": "grid.length", "explanation": "grid.length is the length of the outer array, which is the row count." },
            { "type": "true_false", "question": "In row-major traversal the outer loop walks the columns.", "correct_answer": "false", "explanation": "The outer loop walks the rows and the inner loop walks the columns." }
          ]
        }
      ],
      "callouts": [
        { "type": "tip", "position": "after", "title": "Rows vs columns length", "content": "grid.length is rows, grid[0].length is columns. Mixing them up is the top cause of ArrayIndexOutOfBoundsException on non-square grids. Using grid[r].length for the inner bound is the safest habit." }
      ],
      "challenge_title": "Print Grid in Row-Major Order",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        // TODO: print all values in row-major order,\n        // space-separated, on a single line\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        boolean first = true;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[r].length; c++) {\n                if (!first) {\n                    System.out.print(\" \");\n                }\n                System.out.print(grid[r][c]);\n                first = false;\n            }\n        }\n        System.out.println();\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6",
          "expected_output": "1 2 3 4 5 6"
        },
        {
          "input": "3 1\n9\n8\n7",
          "expected_output": "9 8 7"
        },
        {
          "input": "1 4\n5 6 7 8",
          "expected_output": "5 6 7 8"
        }
      ],
      "key_terms": [
        {
          "term": "Row-major order",
          "definition": "Processing a 2D array one full row at a time: all columns of row 0, then all columns of row 1, and so on."
        },
        {
          "term": "arr.length",
          "definition": "The number of rows in a 2D array, equal to the length of the outer array."
        },
        {
          "term": "arr[0].length",
          "definition": "The number of columns in a 2D array, equal to the length of any single row."
        }
      ],
      "inline_quizzes": [
        {
          "question": "For `int[][] m = new int[5][8];`, what are `m.length` and `m[0].length`?",
          "options": [
            "m.length = 8, m[0].length = 5",
            "m.length = 5, m[0].length = 8",
            "Both equal 40",
            "Both equal 13"
          ],
          "correct_index": 1,
          "explanation": "m.length is the number of rows (5) and m[0].length is the number of columns (8)."
        }
      ],
      "quiz_questions": [
        {
          "question": "In a standard nested-loop traversal, what does the outer loop iterate over?",
          "options": [
            "The columns",
            "The rows",
            "Every individual cell at once",
            "The diagonal"
          ],
          "correct_index": 1,
          "explanation": "In row-major order the outer loop walks the rows while the inner loop walks the columns of each row."
        },
        {
          "question": "Which expression most robustly gives the column count for row r of array m?",
          "options": [
            "m.length",
            "m[r].length",
            "m.length - 1",
            "r.length"
          ],
          "correct_index": 1,
          "explanation": "m[r].length gives the number of columns in row r, which works even if you cannot assume m[0] represents all rows."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l3",
      "project_id": "csa-08",
      "order": 3,
      "title": "Nested Loops: Summing and Counting",
      "explanation": "## Traversing Every Cell\n\nMost grid problems require visiting **every cell exactly once**. The standard tool is a pair of **nested loops**: an outer loop over rows and an inner loop over columns. Inside the innermost body you have access to one cell, `grid[r][c]`.\n\n```java\nint total = 0;\nfor (int r = 0; r < grid.length; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        total += grid[r][c];\n    }\n}\nSystem.out.println(total);\n```\n\n## Accumulator Patterns\n\nTwo of the most common grid algorithms reuse the same skeleton:\n\n- **Summing**: start an accumulator at `0` and add each cell.\n- **Counting**: start a counter at `0` and add `1` whenever a cell meets a condition.\n\n```java\nint count = 0;\nfor (int r = 0; r < grid.length; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        if (grid[r][c] % 2 == 0) {\n            count++;   // count even cells\n        }\n    }\n}\n```\n\n## Where to Declare the Accumulator\n\nThe placement of a variable controls what it measures:\n\n- Declare **before both loops** to total the whole grid.\n- Declare **inside the outer loop but before the inner loop** to total each row separately.\n\n```java\nfor (int r = 0; r < grid.length; r++) {\n    int rowSum = 0;            // resets each row\n    for (int c = 0; c < grid[r].length; c++) {\n        rowSum += grid[r][c];\n    }\n    System.out.println(rowSum); // one sum per row\n}\n```\n\n## Key Idea\n\nThe number of times the **inner body** runs equals `rows * cols`. By choosing **where to declare** and **where to print** your accumulator, the same nested-loop pattern computes a grand total, per-row totals, or counts of matching cells. This control of variable scope is the heart of every 2D-array algorithm.",
      "animated_diagrams": [
        {
          "title": "Accumulating a grand total",
          "caption": "One accumulator declared before both loops grows as each cell is added.",
          "loop": true,
          "nodes": [
            { "label": "total = 0", "sub": "before loops", "detail": "The accumulator starts at 0 outside both loops so it survives the whole traversal." },
            { "label": "+1 = 1", "sub": "m[0][0]", "detail": "Add the first cell. total is now 1." },
            { "label": "+2 = 3", "sub": "m[0][1]", "detail": "Add the next cell in row 0. total is now 3." },
            { "label": "+3 = 6", "sub": "m[0][2]", "detail": "Finish row 0. total is now 6." },
            { "label": "+4,5,6 = 21", "sub": "row 1", "detail": "Row 1 adds 4, 5, and 6, bringing the running total to 21." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Summing { {1,2,3}, {4,5,6} } cell by cell",
          "steps": [
            { "label": "start", "detail": "Accumulator declared before the loops, set to 0.", "code": "int total = 0;" },
            { "label": "r=0, c=0", "detail": "Add grid[0][0] which is 1. total becomes 1.", "code": "total += 1;  // total = 1" },
            { "label": "r=0, c=1", "detail": "Add grid[0][1] which is 2. total becomes 3.", "code": "total += 2;  // total = 3" },
            { "label": "r=0, c=2", "detail": "Add grid[0][2] which is 3. total becomes 6.", "code": "total += 3;  // total = 6" },
            { "label": "r=1, c=0", "detail": "Outer loop advances to row 1. Add 4. total becomes 10.", "code": "total += 4;  // total = 10" },
            { "label": "r=1, c=1", "detail": "Add grid[1][1] which is 5. total becomes 15.", "code": "total += 5;  // total = 15" },
            { "label": "r=1, c=2", "detail": "Add grid[1][2] which is 6. total becomes 21.", "code": "total += 6;  // total = 21" },
            { "label": "done", "detail": "The body ran 6 times, which is rows times columns.", "code": "System.out.println(total); // 21" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "For a grid with R rows and C columns, the inner loop body runs R * C times.", "correct_answer": "true", "explanation": "The outer loop runs R times and the inner runs C times each pass, so the body runs R * C times." },
            { "type": "fill_in", "question": "To sum each row separately, you declare the accumulator inside the outer loop so it does what at the start of every row? One word.", "correct_answer": "resets", "explanation": "Declaring it inside the outer loop resets it once per row, giving an independent per-row sum." }
          ]
        }
      ],
      "callouts": [
        { "type": "insight", "position": "after", "title": "Placement equals meaning", "content": "The same nested loop computes a grand total or per-row totals depending only on where you declare the accumulator. Before both loops totals everything, inside the outer loop totals each row." }
      ],
      "challenge_title": "Sum of All Grid Values",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        // TODO: print the sum of every value in the grid\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int total = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[r].length; c++) {\n                total += grid[r][c];\n            }\n        }\n        System.out.println(total);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6",
          "expected_output": "21"
        },
        {
          "input": "2 2\n10 10\n10 10",
          "expected_output": "40"
        },
        {
          "input": "1 3\n-1 -2 -3",
          "expected_output": "-6"
        }
      ],
      "key_terms": [
        {
          "term": "Nested loop",
          "definition": "A loop placed inside another loop; for a 2D array the outer loop walks rows and the inner loop walks columns to reach every cell."
        },
        {
          "term": "Accumulator",
          "definition": "A variable initialized before a loop (often to 0) that builds up a running sum or count as the loop executes."
        },
        {
          "term": "Variable scope",
          "definition": "The region where a declared variable exists; declaring an accumulator before vs. inside the outer loop changes whether it totals the whole grid or each row."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Where should you declare `int rowSum = 0;` so it gives a separate sum for each row?",
          "options": [
            "Before both loops",
            "Inside the outer loop, before the inner loop",
            "Inside the inner loop",
            "After both loops"
          ],
          "correct_index": 1,
          "explanation": "Declaring it inside the outer loop resets it once per row, so each row gets its own independent sum."
        }
      ],
      "quiz_questions": [
        {
          "question": "How many times does the innermost loop body run for a grid with R rows and C columns?",
          "options": [
            "R + C",
            "R * C",
            "R only",
            "C only"
          ],
          "correct_index": 1,
          "explanation": "The outer loop runs R times and the inner loop runs C times per outer iteration, giving R * C executions of the body."
        },
        {
          "question": "To count cells greater than 5, what should the accumulator do inside the inner loop?",
          "options": [
            "Add the cell's value",
            "Increment by 1 when grid[r][c] > 5",
            "Reset to 0",
            "Multiply by the cell value"
          ],
          "correct_index": 1,
          "explanation": "Counting increments a counter by 1 each time the condition (cell greater than 5) is true."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l4",
      "project_id": "csa-08",
      "order": 4,
      "title": "Enhanced For Loops Over 2D Arrays",
      "explanation": "## The For-Each Over a Grid\n\nThe **enhanced for loop** (for-each) also works on 2D arrays, but you must remember the *array-of-arrays* structure. The outer for-each gives you each **row**, which is itself a 1D array. A second, inner for-each then walks the elements of that row.\n\n```java\nint[][] grid = { {1, 2, 3}, {4, 5, 6} };\nint total = 0;\nfor (int[] row : grid) {        // row is a 1D int array\n    for (int value : row) {     // value is one cell\n        total += value;\n    }\n}\nSystem.out.println(total); // 21\n```\n\n## The Critical Type Detail\n\nThe outer loop variable must be declared as a **1D array** of the element type:\n\n- For `int[][]`, the outer variable is `int[] row` and the inner is `int value`.\n- For `String[][]`, the outer variable is `String[] row` and the inner is `String s`.\n\nForgetting the brackets on the outer variable is the most common mistake.\n\n## When to Use For-Each\n\nThe enhanced for loop is ideal when you only need to **read** every cell, because it is concise and avoids index bookkeeping. However, it has real limits:\n\n- You **cannot** know the current row or column index inside the loop.\n- You **cannot** reliably write back into the array through the loop variable for primitives, `value = value * 2;` only changes the copy.\n\n```java\nfor (int[] row : grid) {\n    for (int value : row) {\n        value = value * 2; // does NOT modify the grid\n    }\n}\n```\n\n## Read vs. Modify\n\nIf you need indices, or you must **change** the contents, fall back to indexed nested loops with `grid[r][c]`. Use the enhanced for loop for **read-only** passes such as summing, counting, searching for a value, or printing. Knowing this trade-off lets you pick the cleanest correct loop for each grid task.",
      "animated_diagrams": [
        {
          "title": "For-each over an array of arrays",
          "caption": "The outer loop hands you a whole row, the inner loop hands you one value.",
          "loop": true,
          "nodes": [
            { "label": "for int[] row", "sub": "outer loop", "detail": "The outer for-each variable is a 1D array, because each element of a 2D array is a row." },
            { "label": "row = {1,2,3}", "sub": "first row", "detail": "On the first pass row points at the array {1,2,3}." },
            { "label": "for int value", "sub": "inner loop", "detail": "The inner for-each walks the ints inside that row: 1, then 2, then 3." },
            { "label": "row = {4,5,6}", "sub": "next row", "detail": "The outer loop advances to the next row and the inner loop repeats." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Why value = value * 2 does not change the grid",
          "steps": [
            { "label": "read cell", "detail": "value is a fresh copy of grid[0][0], which is 1.", "code": "for (int value : row) { // value = 1" },
            { "label": "reassign copy", "detail": "This changes the local copy to 2, not the cell in the array.", "code": "value = value * 2; // copy is 2" },
            { "label": "grid unchanged", "detail": "The array still holds 1 at that spot. For-each cannot write back primitives.", "code": "grid[0][0]; // still 1" },
            { "label": "fix it", "detail": "To modify cells you need indexed loops and grid[r][c].", "code": "grid[r][c] = grid[r][c] * 2;" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "fill_in", "question": "For int[][] grid, complete the outer for-each header: for ( ___ row : grid). Give the type with brackets.", "correct_answer": "int[]", "explanation": "Each element of a 2D int array is a 1D int array, so the outer variable is int[]." },
            { "type": "true_false", "question": "You can reliably overwrite primitive cells by reassigning the for-each loop variable.", "correct_answer": "false", "explanation": "The loop variable is a copy, so reassigning it leaves the array unchanged." }
          ]
        }
      ],
      "callouts": [
        { "type": "warning", "position": "after", "title": "For-each has no index", "content": "Inside a for-each you cannot know r or c, and you cannot write primitive cells through the loop variable. Use it for read-only passes like summing or searching, and switch to grid[r][c] when you need position or want to modify cells." }
      ],
      "challenge_title": "Count Matches with For-Each",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int target = sc.nextInt();\n        // TODO: use enhanced for loops to count how many\n        // cells equal target, then print the count\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int target = sc.nextInt();\n        int count = 0;\n        for (int[] row : grid) {\n            for (int value : row) {\n                if (value == target) {\n                    count++;\n                }\n            }\n        }\n        System.out.println(count);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 2\n2 3 4\n2",
          "expected_output": "3"
        },
        {
          "input": "2 2\n5 5\n5 5\n5",
          "expected_output": "4"
        },
        {
          "input": "2 2\n1 2\n3 4\n9",
          "expected_output": "0"
        }
      ],
      "key_terms": [
        {
          "term": "Enhanced for loop (for-each)",
          "definition": "A loop that iterates directly over elements; for a 2D array the outer for-each yields each row as a 1D array."
        },
        {
          "term": "Row as 1D array",
          "definition": "Each element of a 2D array is itself a one-dimensional array, so the outer for-each variable must be declared with array brackets."
        },
        {
          "term": "Read-only traversal",
          "definition": "A pass that only inspects values; enhanced for loops are ideal here because they cannot reliably modify primitive cells or expose indices."
        }
      ],
      "inline_quizzes": [
        {
          "question": "For `int[][] grid`, what is the correct outer loop header for a for-each traversal?",
          "options": [
            "for (int row : grid)",
            "for (int[] row : grid)",
            "for (int[][] row : grid)",
            "for (row : grid)"
          ],
          "correct_index": 1,
          "explanation": "Each element of a 2D int array is a 1D int array, so the outer variable must be declared as int[] row."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why can't you modify primitive cells through an enhanced for loop variable?",
          "options": [
            "The loop variable is final",
            "The loop variable is a copy of the cell, not the cell itself",
            "Enhanced for loops are read-only by language rule",
            "2D arrays are immutable"
          ],
          "correct_index": 1,
          "explanation": "The loop variable holds a copy of the element's value, so reassigning it leaves the array unchanged."
        },
        {
          "question": "When is an enhanced for loop the best choice for a 2D array?",
          "options": [
            "When you need the row and column indices",
            "When you must overwrite cells",
            "When you only need to read every value",
            "When the array is jagged"
          ],
          "correct_index": 2,
          "explanation": "For-each loops are concise for read-only passes like summing or searching but cannot give indices or modify primitive cells."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l5",
      "project_id": "csa-08",
      "order": 5,
      "title": "Working with Rows",
      "explanation": "## Treating a Row as a Unit\n\nBecause a 2D array is an array of rows, you can process **one entire row** by fixing the row index `r` and looping only over the columns. This makes per-row statistics natural: row sums, row maximums, or finding which row has some property.\n\n```java\nint[][] grid = { {1, 5, 2}, {9, 0, 4} };\nfor (int r = 0; r < grid.length; r++) {\n    int rowSum = 0;\n    for (int c = 0; c < grid[r].length; c++) {\n        rowSum += grid[r][c];\n    }\n    System.out.println(\"Row \" + r + \" sum = \" + rowSum);\n}\n```\n\nHere the **outer loop chooses a row** and the inner loop sweeps that row's columns. The accumulator `rowSum` resets each time the outer loop advances, so each row is summed independently.\n\n## Finding the Best Row\n\nA common pattern is to compute a value for each row, then track which row scored highest:\n\n```java\nint bestRow = 0;\nint bestSum = Integer.MIN_VALUE;\nfor (int r = 0; r < grid.length; r++) {\n    int sum = 0;\n    for (int c = 0; c < grid[r].length; c++) {\n        sum += grid[r][c];\n    }\n    if (sum > bestSum) {\n        bestSum = sum;\n        bestRow = r;\n    }\n}\n```\n\n## Key Points About Rows\n\n- The **outer loop variable** is the row you are focused on; hold it constant while the inner loop varies the column.\n- A whole row is accessible as `grid[r]`, a 1D array of length `grid[r].length`.\n- Per-row accumulators must be **declared inside the outer loop** so they reset for each row.\n\nThinking of rows as independent 1D arrays lets you reuse every 1D algorithm you already know, max, min, sum, search, applied one row at a time. This row-by-row mindset is essential for the more complex grid problems ahead.",
      "animated_diagrams": [
        {
          "title": "Processing one row at a time",
          "caption": "Fix the row, sweep its columns, reset the accumulator, then move down.",
          "loop": true,
          "nodes": [
            { "label": "r = 0 fixed", "sub": "pick a row", "detail": "The outer loop chooses row 0 and holds it constant while the inner loop runs." },
            { "label": "rowSum = 0", "sub": "reset", "detail": "The accumulator is declared inside the outer loop, so it resets at the start of this row." },
            { "label": "sweep cols", "sub": "1 + 5 + 2", "detail": "The inner loop adds each column of row 0, giving rowSum = 8." },
            { "label": "print, r = 1", "sub": "next row", "detail": "Report row 0's sum, then the outer loop advances and rowSum resets to 0 for row 1." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Largest row sum of { {1,5,2}, {9,0,4} }",
          "steps": [
            { "label": "start", "detail": "Track the best row sum seen so far, starting very low.", "code": "int best = Integer.MIN_VALUE;" },
            { "label": "row 0", "detail": "sum resets to 0, then adds 1 + 5 + 2 = 8.", "code": "int sum = 0; sum = 1+5+2; // 8" },
            { "label": "compare", "detail": "8 beats MIN_VALUE, so best becomes 8.", "code": "if (8 > best) best = 8;" },
            { "label": "row 1", "detail": "sum resets to 0, then adds 9 + 0 + 4 = 13.", "code": "int sum = 0; sum = 9+0+4; // 13" },
            { "label": "compare", "detail": "13 beats 8, so best becomes 13.", "code": "if (13 > best) best = 13;" },
            { "label": "done", "detail": "The largest row sum is 13.", "code": "System.out.println(best); // 13" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "grid[2] is the entire third row, which behaves like a 1D array.", "correct_answer": "true", "explanation": "A row is a real stored 1D array, so grid[2] is that whole row." },
            { "type": "fill_in", "question": "When processing a single row, which index is held constant, the row or the column? One word.", "correct_answer": "row", "explanation": "You fix the row index and let the inner loop vary the column." }
          ]
        }
      ],
      "callouts": [
        { "type": "tip", "position": "after", "title": "Reset inside the outer loop", "content": "A per-row accumulator must be declared inside the outer loop so it starts fresh for each row. Declare it before both loops by accident and you get one running total instead of separate row sums." }
      ],
      "challenge_title": "Largest Row Sum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        // TODO: print the largest row sum among all rows\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int best = Integer.MIN_VALUE;\n        for (int r = 0; r < grid.length; r++) {\n            int sum = 0;\n            for (int c = 0; c < grid[r].length; c++) {\n                sum += grid[r][c];\n            }\n            if (sum > best) {\n                best = sum;\n            }\n        }\n        System.out.println(best);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6",
          "expected_output": "15"
        },
        {
          "input": "3 2\n10 1\n2 2\n5 5",
          "expected_output": "11"
        },
        {
          "input": "2 2\n-1 -2\n-3 -1",
          "expected_output": "-3"
        }
      ],
      "key_terms": [
        {
          "term": "Row",
          "definition": "A single horizontal line of a 2D array, accessible as grid[r], that behaves like a 1D array of length grid[r].length."
        },
        {
          "term": "Per-row accumulator",
          "definition": "A sum or count variable declared inside the outer loop so it resets at the start of every row."
        },
        {
          "term": "Best-so-far tracking",
          "definition": "Keeping a running best value (and possibly its index) updated whenever a newly computed row value beats the current best."
        }
      ],
      "inline_quizzes": [
        {
          "question": "To compute a separate sum for each row, where must `int sum = 0;` be declared?",
          "options": [
            "Before the outer loop",
            "Inside the outer loop, before the inner loop",
            "Inside the inner loop",
            "After both loops"
          ],
          "correct_index": 1,
          "explanation": "Declaring sum inside the outer loop resets it for each row, producing an independent per-row total."
        }
      ],
      "quiz_questions": [
        {
          "question": "When processing a single row, which index is held constant?",
          "options": [
            "The column index c",
            "The row index r",
            "Both indices",
            "Neither index"
          ],
          "correct_index": 1,
          "explanation": "You fix the row index r and let the inner loop vary the column index c to sweep across that one row."
        },
        {
          "question": "What does the expression `grid[2]` represent?",
          "options": [
            "The cell in row 0, column 2",
            "The entire row at index 2, a 1D array",
            "The column at index 2",
            "The number of rows"
          ],
          "correct_index": 1,
          "explanation": "grid[2] is the third row, which is itself a 1D array of all the columns in that row."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l6",
      "project_id": "csa-08",
      "order": 6,
      "title": "Working with Columns",
      "explanation": "## Columns Are Different\n\nA **column** is a vertical slice of the grid: the cells `grid[0][c]`, `grid[1][c]`, `grid[2][c]`, and so on for a fixed column `c`. Unlike a row, a column is **not** a single Java array, there is no `grid[][c]` shortcut. To process one column you must fix the column index `c` and loop over the **row** index `r`.\n\n```java\nint[][] grid = { {1, 2, 3}, {4, 5, 6} };\nfor (int c = 0; c < grid[0].length; c++) {\n    int colSum = 0;\n    for (int r = 0; r < grid.length; r++) {\n        colSum += grid[r][c];\n    }\n    System.out.println(\"Col \" + c + \" sum = \" + colSum);\n}\n```\n\n## The Loop Order Flips\n\nThe big idea: for **column-wise** processing the **outer loop is the column** and the **inner loop is the row**: the reverse of row-major traversal.\n\n- **Row-wise:** `for r { for c { grid[r][c] } }`\n- **Column-wise:** `for c { for r { grid[r][c] } }`\n\nIn both cases the cell access is still `grid[r][c]`, only the loop *order* changes. The outer bound is `grid[0].length` (number of columns) and the inner bound is `grid.length` (number of rows).\n\n## Rows vs. Columns Summary\n\n```java\n// number of rows and columns\nint numRows = grid.length;\nint numCols = grid[0].length;\n```\n\n- A **row** uses a fixed `r`; it is a real 1D array `grid[r]`.\n- A **column** uses a fixed `c`; it is *not* a stored array, so you gather it cell by cell.\n- Swapping which loop is outer switches you between row-wise and column-wise processing.\n\nUnderstanding that columns must be assembled manually, and that the loop nesting determines the traversal direction, is exactly the **rows vs. columns** distinction the AP exam tests. Keep `grid[r][c]` constant and just decide which index the outer loop controls.",
      "animated_diagrams": [
        {
          "title": "Walking down one column",
          "caption": "Fix the column, then vary the row to gather cells top to bottom.",
          "loop": true,
          "nodes": [
            { "label": "c = 0 fixed", "sub": "outer loop", "detail": "For column-wise work the outer loop holds a column, here c = 0." },
            { "label": "r = 0", "sub": "grid[0][0]", "detail": "The inner loop varies the row. Start at grid[0][0], the value 1." },
            { "label": "r = 1", "sub": "grid[1][0]", "detail": "Step down one row, still column 0, reaching grid[1][0], the value 4." },
            { "label": "colSum = 5", "sub": "column done", "detail": "1 + 4 = 5 for column 0. The outer loop then advances to column 1." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Column-wise sweep of { {1,2,3}, {4,5,6} }",
          "steps": [
            { "label": "outer c=0", "detail": "Outer loop bound is grid[0].length, the column count.", "code": "for (int c=0; c<grid[0].length; c++)" },
            { "label": "inner r", "detail": "Inner loop bound is grid.length, the row count. Adds grid[0][0]+grid[1][0].", "code": "colSum = grid[0][0]+grid[1][0]; // 1+4=5" },
            { "label": "c=1", "detail": "Column 1 gathers grid[0][1]+grid[1][1].", "code": "colSum = 2+5; // 7" },
            { "label": "c=2", "detail": "Column 2 gathers grid[0][2]+grid[1][2].", "code": "colSum = 3+6; // 9" },
            { "label": "note", "detail": "Cell access stayed grid[r][c] the whole time. Only the loop order flipped.", "code": "grid[r][c] // same access, outer = c" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "A column is stored as its own 1D array, so grid[][c] gives you the whole column.", "correct_answer": "false", "explanation": "Columns are not stored as arrays. There is no grid[][c]. You must gather grid[r][c] across all rows." },
            { "type": "fill_in", "question": "For column-wise traversal the outer loop varies which index, row or column? One word.", "correct_answer": "column", "explanation": "Column-wise means the outer loop holds and steps through columns while the inner loop varies rows." }
          ]
        }
      ],
      "callouts": [
        { "type": "insight", "position": "after", "title": "Same access, flipped order", "content": "Row-wise and column-wise traversal both use grid[r][c]. The only difference is which index the outer loop controls. Outer = r gives row-major, outer = c gives column-major." }
      ],
      "challenge_title": "Largest Column Sum",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        // TODO: print the largest column sum among all columns\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int best = Integer.MIN_VALUE;\n        for (int c = 0; c < grid[0].length; c++) {\n            int sum = 0;\n            for (int r = 0; r < grid.length; r++) {\n                sum += grid[r][c];\n            }\n            if (sum > best) {\n                best = sum;\n            }\n        }\n        System.out.println(best);\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6",
          "expected_output": "9"
        },
        {
          "input": "3 2\n1 9\n1 9\n1 9",
          "expected_output": "27"
        },
        {
          "input": "2 2\n-1 -5\n-2 -1",
          "expected_output": "-3"
        }
      ],
      "key_terms": [
        {
          "term": "Column",
          "definition": "A vertical slice of a 2D array formed by a fixed column index across all rows; it is not stored as a single Java array."
        },
        {
          "term": "Column-wise traversal",
          "definition": "A nested loop whose outer loop is the column index and inner loop is the row index, the reverse of row-major order."
        },
        {
          "term": "Loop nesting order",
          "definition": "Which index the outer loop controls; it determines whether a traversal proceeds row by row or column by column."
        }
      ],
      "inline_quizzes": [
        {
          "question": "To sum one column, which loop varies the row index r?",
          "options": [
            "The outer loop",
            "The inner loop",
            "Neither; rows are not used",
            "Both loops equally"
          ],
          "correct_index": 1,
          "explanation": "For column-wise processing the column c is fixed by the outer loop and the inner loop varies the row index r to walk down the column."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why is a column harder to access than a row in Java?",
          "options": [
            "Columns can have different lengths",
            "A column is not stored as a single array; you must gather cells one at a time",
            "Columns use a different index type",
            "grid[r][c] does not work for columns"
          ],
          "correct_index": 1,
          "explanation": "A row is the real 1D array grid[r], but a column has no array of its own, so you collect grid[r][c] across all rows."
        },
        {
          "question": "For column-wise traversal, what is the correct outer-loop bound?",
          "options": [
            "grid.length (rows)",
            "grid[0].length (columns)",
            "grid.length * grid[0].length",
            "1"
          ],
          "correct_index": 1,
          "explanation": "Column-wise traversal loops the outer index over columns, so its bound is grid[0].length, the number of columns."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l7",
      "project_id": "csa-08",
      "order": 7,
      "title": "Grid Algorithms: Search and Position",
      "explanation": "## Searching a Grid\n\nA core 2D-array skill is **searching** for a value and reporting **where** it lives. Because you need the position, you must use **indexed nested loops**: the enhanced for loop cannot tell you `r` and `c`.\n\n```java\nint target = 7;\nint foundR = -1, foundC = -1;\nfor (int r = 0; r < grid.length && foundR == -1; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        if (grid[r][c] == target) {\n            foundR = r;\n            foundC = c;\n            break;\n        }\n    }\n}\n```\n\nThe **row-major** search above finds the *first* occurrence (smallest row, then smallest column). The flag `foundR == -1` stops the outer loop once a match is recorded.\n\n## Tracking a Maximum and Its Location\n\nFinding the **maximum value and its coordinates** combines best-so-far tracking with index capture:\n\n```java\nint maxVal = grid[0][0];\nint maxR = 0, maxC = 0;\nfor (int r = 0; r < grid.length; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        if (grid[r][c] > maxVal) {\n            maxVal = grid[r][c];\n            maxR = r;\n            maxC = c;\n        }\n    }\n}\n```\n\n- Initialize the best with the **first cell** `grid[0][0]`, not `0`, so negative grids work.\n- Update the value **and** both indices together whenever you find a larger cell.\n\n## Position Output Conventions\n\n- Coordinates are usually reported as `(row, column)`.\n- A row-major scan guarantees the **first** match found is the top-most, then left-most.\n\n## Why Indices Matter\n\nWhenever a problem asks *where*, first match, location of the max, a specific cell's neighbors, you need indexed loops. Reading values alone is a job for for-each; locating them is a job for `grid[r][c]` with explicit `r` and `c`. This search-and-position pattern underlies many free-response grid questions.",
      "animated_diagrams": [
        {
          "title": "Row-major search for a target",
          "caption": "Scan top row first, left to right, and stop at the first match.",
          "loop": true,
          "nodes": [
            { "label": "check (0,0)", "sub": "no match", "detail": "Start at the top-left cell. It does not equal the target, so keep going right." },
            { "label": "check (0,1)", "sub": "no match", "detail": "Next column of row 0. Still no match." },
            { "label": "check (0,2)", "sub": "no match", "detail": "Last column of row 0. No match, so drop to row 1, column 0." },
            { "label": "check (1,0)", "sub": "no match", "detail": "First cell of row 1. Keep scanning." },
            { "label": "check (1,1)", "sub": "match", "detail": "This cell equals the target. Record foundR=1, foundC=1 and stop." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Finding the max value and its position",
          "steps": [
            { "label": "seed", "detail": "Start the best with the first real cell, not 0, so negative grids work.", "code": "int maxVal = grid[0][0];" },
            { "label": "seed indices", "detail": "Remember where that first cell lives.", "code": "int maxR = 0, maxC = 0;" },
            { "label": "bigger cell", "detail": "When grid[r][c] beats maxVal, update all three together.", "code": "if (grid[r][c] > maxVal) { maxVal=grid[r][c]; maxR=r; maxC=c; }" },
            { "label": "report", "detail": "After the scan, maxR and maxC hold the location of the maximum.", "code": "System.out.println(maxR + \" \" + maxC);" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "true_false", "question": "You can report the (row, column) of a match using an enhanced for loop.", "correct_answer": "false", "explanation": "For-each gives values but not indices, so you need indexed nested loops to report position." },
            { "type": "fill_in", "question": "To make a max search work on an all-negative grid, seed the running max with which cell? Give the code.", "correct_answer": "grid[0][0]", "explanation": "Seeding with grid[0][0] uses a real cell as the baseline instead of 0, which no negative value could beat." }
          ]
        }
      ],
      "callouts": [
        { "type": "warning", "position": "after", "title": "Do not seed a max with 0", "content": "Initializing the running maximum to 0 breaks on grids where every value is negative, since no cell beats 0. Seed with grid[0][0] instead, and update the value together with both indices." }
      ],
      "challenge_title": "Find First Occurrence Position",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int target = sc.nextInt();\n        // TODO: print the row and column (space-separated) of the\n        // first occurrence of target in row-major order,\n        // or print -1 if it is not found\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int target = sc.nextInt();\n        int foundR = -1, foundC = -1;\n        for (int r = 0; r < grid.length && foundR == -1; r++) {\n            for (int c = 0; c < grid[r].length; c++) {\n                if (grid[r][c] == target) {\n                    foundR = r;\n                    foundC = c;\n                    break;\n                }\n            }\n        }\n        if (foundR == -1) {\n            System.out.println(-1);\n        } else {\n            System.out.println(foundR + \" \" + foundC);\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 2 6\n2",
          "expected_output": "0 1"
        },
        {
          "input": "2 2\n5 6\n7 8\n8",
          "expected_output": "1 1"
        },
        {
          "input": "2 2\n1 2\n3 4\n9",
          "expected_output": "-1"
        }
      ],
      "key_terms": [
        {
          "term": "Row-major search",
          "definition": "Scanning a grid row by row, left to right, so the first match found is the top-most then left-most occurrence."
        },
        {
          "term": "Position capture",
          "definition": "Storing the indices r and c (not just the value) when a target or new maximum is found, so the location can be reported."
        },
        {
          "term": "Search flag",
          "definition": "A sentinel such as foundR == -1 used to detect whether a match was found and to stop scanning early."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why must you use indexed nested loops, not for-each, to report a value's position?",
          "options": [
            "For-each is slower",
            "For-each does not expose the row and column indices",
            "For-each cannot read values",
            "For-each only works on one row"
          ],
          "correct_index": 1,
          "explanation": "The enhanced for loop gives you values but not their indices, so you cannot report (row, column) without indexed loops."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why initialize the running maximum to grid[0][0] instead of 0?",
          "options": [
            "It is faster",
            "So the algorithm works even when all values are negative",
            "Because 0 is not a valid index",
            "To skip the first cell"
          ],
          "correct_index": 1,
          "explanation": "Starting at grid[0][0] guarantees a real cell is the baseline; starting at 0 would wrongly win against an all-negative grid."
        },
        {
          "question": "A row-major scan that stops at the first match returns which occurrence?",
          "options": [
            "The last occurrence",
            "The top-most, then left-most occurrence",
            "A random occurrence",
            "The bottom-right occurrence"
          ],
          "correct_index": 1,
          "explanation": "Row-major order visits smaller rows first and, within a row, smaller columns first, so the first match is top-most then left-most."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-08-l8",
      "project_id": "csa-08",
      "order": 8,
      "title": "Capstone: Transpose and Combined Algorithms",
      "explanation": "## Bringing It Together\n\nThe **transpose** of a grid swaps its rows and columns: the cell at `(r, c)` in the original moves to `(c, r)` in the result. A grid with `R` rows and `C` columns transposes into one with `C` rows and `R` columns. Transposition is the ultimate **rows vs. columns** exercise because it forces you to track both index orders at once.\n\n```java\nint[][] grid = { {1, 2, 3}, {4, 5, 6} }; // 2 rows, 3 cols\nint[][] t = new int[grid[0].length][grid.length]; // 3 rows, 2 cols\nfor (int r = 0; r < grid.length; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        t[c][r] = grid[r][c];   // note the swapped indices\n    }\n}\n// t = { {1, 4}, {2, 5}, {3, 6} }\n```\n\n## Sizing the Result Correctly\n\n- The result has dimensions `[numCols][numRows]`, `new int[grid[0].length][grid.length]`.\n- The assignment is `t[c][r] = grid[r][c]`; swapping the indices is the whole trick.\n\n## Combining Standard Algorithms\n\nReal problems chain the patterns from this unit:\n\n- Traverse in **row-major** order to read the grid.\n- Use **per-row** or **per-column** accumulators for statistics.\n- Apply **search-and-position** to locate values.\n- Restructure with a **transpose** when the orientation must change.\n\n```java\n// print a transposed grid in row-major order\nfor (int r = 0; r < t.length; r++) {\n    for (int c = 0; c < t[r].length; c++) {\n        System.out.print(t[r][c]);\n        if (c < t[r].length - 1) System.out.print(\" \");\n    }\n    System.out.println();\n}\n```\n\n## The Mental Model\n\nEvery 2D-array task reduces to three questions: **which cells** do I visit (all, one row, one column), **in what order** (row-major or column-wise), and **what do I do** at each cell (sum, count, compare, copy). Transpose ties these together, you read row-major but write column-major. Master this and you can tackle any grid free-response on the AP exam.",
      "animated_diagrams": [
        {
          "title": "Transpose swaps each cell's indices",
          "caption": "Read the source at (r, c) and write it into the result at (c, r).",
          "loop": true,
          "nodes": [
            { "label": "size result", "sub": "[cols][rows]", "detail": "A 2x3 grid transposes into a 3x2 grid, so t is new int[grid[0].length][grid.length]." },
            { "label": "(0,0) to (0,0)", "sub": "1 stays", "detail": "grid[0][0]=1 goes to t[0][0]. On the diagonal the position does not move." },
            { "label": "(0,1) to (1,0)", "sub": "swap", "detail": "grid[0][1]=2 goes to t[1][0]. The indices trade places." },
            { "label": "(0,2) to (2,0)", "sub": "swap", "detail": "grid[0][2]=3 goes to t[2][0], climbing down the first column of t." },
            { "label": "row 1 copies", "sub": "4,5,6", "detail": "grid[1][0..2] land in t[0][1], t[1][1], t[2][1], filling t's second column." }
          ]
        }
      ],
      "step_throughs": [
        {
          "title": "Transposing { {1,2,3}, {4,5,6} }",
          "steps": [
            { "label": "allocate", "detail": "Result is sized columns by rows: 3 rows, 2 columns.", "code": "int[][] t = new int[grid[0].length][grid.length];" },
            { "label": "r=0,c=0", "detail": "Copy grid[0][0]=1 into t[0][0] using swapped indices.", "code": "t[0][0] = grid[0][0]; // 1" },
            { "label": "r=0,c=1", "detail": "Copy grid[0][1]=2 into t[1][0].", "code": "t[1][0] = grid[0][1]; // 2" },
            { "label": "r=0,c=2", "detail": "Copy grid[0][2]=3 into t[2][0].", "code": "t[2][0] = grid[0][2]; // 3" },
            { "label": "r=1,c=0", "detail": "Copy grid[1][0]=4 into t[0][1].", "code": "t[0][1] = grid[1][0]; // 4" },
            { "label": "r=1,c=1..2", "detail": "5 goes to t[1][1] and 6 goes to t[2][1].", "code": "t[1][1]=5; t[2][1]=6;" },
            { "label": "result", "detail": "t is { {1,4}, {2,5}, {3,6} }.", "code": "// t = { {1,4}, {2,5}, {3,6} }" }
          ]
        }
      ],
      "participation_activities": [
        {
          "activity_title": "Check yourself",
          "questions": [
            { "type": "fill_in", "question": "Complete the transpose assignment: t[__][__] = grid[r][c]. Fill the brackets in order, comma separated.", "correct_answer": "c, r", "explanation": "The transpose moves cell (r, c) to (c, r), so the assignment is t[c][r] = grid[r][c]." },
            { "type": "true_false", "question": "The transpose of an R by C grid should be sized new int[C][R].", "correct_answer": "true", "explanation": "The result has as many rows as the original had columns, so its dimensions are [numCols][numRows]." }
          ]
        }
      ],
      "callouts": [
        { "type": "warning", "position": "after", "title": "Size the transpose correctly", "content": "The result is [numCols][numRows], not [numRows][numCols]. Size it as [numRows][numCols] and you get an ArrayIndexOutOfBoundsException the moment the grid is not square. The write is t[c][r] = grid[r][c]." }
      ],
      "challenge_title": "Transpose the Grid",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        // TODO: build the transpose and print it, one row per line,\n        // values space-separated (transpose has cols rows and rows columns)\n    }\n}\n",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        int cols = sc.nextInt();\n        int[][] grid = new int[rows][cols];\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                grid[r][c] = sc.nextInt();\n        int[][] t = new int[cols][rows];\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                t[c][r] = grid[r][c];\n            }\n        }\n        for (int r = 0; r < t.length; r++) {\n            for (int c = 0; c < t[r].length; c++) {\n                if (c > 0) {\n                    System.out.print(\" \");\n                }\n                System.out.print(t[r][c]);\n            }\n            System.out.println();\n        }\n    }\n}\n",
      "challenge_test_cases": [
        {
          "input": "2 3\n1 2 3\n4 5 6",
          "expected_output": "1 4\n2 5\n3 6"
        },
        {
          "input": "2 2\n1 2\n3 4",
          "expected_output": "1 3\n2 4"
        },
        {
          "input": "1 3\n7 8 9",
          "expected_output": "7\n8\n9"
        }
      ],
      "key_terms": [
        {
          "term": "Transpose",
          "definition": "A new grid in which the element at (r, c) of the original is placed at (c, r), swapping rows and columns."
        },
        {
          "term": "Index swap",
          "definition": "The assignment t[c][r] = grid[r][c] that moves each cell to its transposed position by exchanging the two indices."
        },
        {
          "term": "Result sizing",
          "definition": "Creating the transpose with dimensions [numCols][numRows] so it has as many rows as the original had columns."
        }
      ],
      "inline_quizzes": [
        {
          "question": "If the original grid is 2 rows by 3 columns, what are the transpose's dimensions?",
          "options": [
            "2 rows by 3 columns",
            "3 rows by 2 columns",
            "2 rows by 2 columns",
            "3 rows by 3 columns"
          ],
          "correct_index": 1,
          "explanation": "Transposing swaps the dimensions, so a 2x3 grid becomes a 3x2 grid."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which assignment correctly fills the transpose t from grid?",
          "options": [
            "t[r][c] = grid[r][c]",
            "t[c][r] = grid[r][c]",
            "t[r][c] = grid[c][r] only when square",
            "t[c][r] = grid[c][r]"
          ],
          "correct_index": 1,
          "explanation": "The transpose moves cell (r, c) to (c, r), so t[c][r] = grid[r][c] with the indices swapped."
        },
        {
          "question": "Reading the source row-major while writing the transpose means the writes effectively go in what order?",
          "options": [
            "Row-major into t",
            "Column-major into t",
            "Random order",
            "Reverse row-major into t"
          ],
          "correct_index": 1,
          "explanation": "Because t[c][r] swaps indices, advancing c in the source steps down the rows of t, so writes land column-major in t."
        }
      ],
      "xp_reward": 100
    }
  ]
}
