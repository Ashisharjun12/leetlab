export const sampleProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "easy",
    tags: ["array", "hash-table"],
    companies: [],
    hints: [
      "Try using a hash map to store the numbers you've seen so far",
      "For each number, check if its complement (target - number) exists in the hash map",
      "If the complement exists, you've found your pair",
      "If not, add the current number to the hash map and continue"
    ],
    examples: {
      PYTHON: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      JAVASCRIPT: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      CPP: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ]
    },
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
      "Only one valid answer exists."
    ],
    testCases: [
      {
        input: "100 200",
        output: "300"
      },
      {
        input: "-500 -600",
        output: "-1100"
      },
      {
        input: "0 0",
        output: "0"
      }
    ],
    codeSnippets: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const [num1, num2] = input.split(' ').map(Number);
        
        // Write your code here
        // Example:
        // const sum = num1 + num2;
        // console.log(sum.toString());
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    num1, num2 = map(int, input_line.split())
    
    # Write your code here
    # Example:
    # sum = num1 + num2
    # print(sum)

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>
#include <sstream>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    stringstream ss(input);
    int num1, num2;
    ss >> num1 >> num2;
    
    // Write your code here
    // Example:
    // int sum = num1 + num2;
    // cout << sum << endl;
    
    return 0;
}`
    },
    reference_solution: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const [num1, num2] = input.split(' ').map(Number);
        
        // Solution
        const sum = num1 + num2;
        console.log(sum.toString());
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    num1, num2 = map(int, input_line.split())
    
    # Solution
    sum = num1 + num2
    print(sum)

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>
#include <sstream>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    stringstream ss(input);
    int num1, num2;
    ss >> num1 >> num2;
    
    // Solution
    int sum = num1 + num2;
    cout << sum << endl;
    
    return 0;
}`
    }
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.",
    difficulty: "easy",
    tags: ["string", "two-pointers"],
    companies: [],
    hints: [
      "Try using two pointers - one at the start and one at the end",
      "Swap the characters at both pointers",
      "Move the pointers towards each other",
      "Continue until the pointers meet in the middle"
    ],
    examples: {
      PYTHON: [
        {
          input: "s=hello",
          output: "olleh",
          explanation: "The string 'hello' reversed is 'olleh'."
        }
      ],
      JAVASCRIPT: [
        {
          input: "s=hello",
          output: "olleh",
          explanation: "The string 'hello' reversed is 'olleh'."
        }
      ],
      CPP: [
        {
          input: "s=hello",
          output: "olleh",
          explanation: "The string 'hello' reversed is 'olleh'."
        }
      ]
    },
    constraints: [
      "1 <= s.length <= 105",
      "s consists of printable ASCII characters"
    ],
    testCases: [
      {
        input: "s=hello",
        output: "olleh"
      },
      {
        input: "s=world",
        output: "dlrow"
      },
      {
        input: "s=python",
        output: "nohtyp"
      }
    ],
    codeSnippets: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const s = input.split('=')[1];
        
        // Write your code here
        // Example:
        // const chars = s.split('');
        // let left = 0;
        // let right = chars.length - 1;
        // while (left < right) {
        //     [chars[left], chars[right]] = [chars[right], chars[left]];
        //     left++;
        //     right--;
        // }
        // console.log(chars.join(''));
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    s = input_line.split('=')[1]
    
    # Write your code here
    # Example:
    // chars = list(s)
    // left, right = 0, len(chars) - 1
    // while left < right:
    //     chars[left], chars[right] = chars[right], chars[left]
    //     left += 1
    //     right -= 1
    // print(''.join(chars))

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    string s = input.substr(input.find('=') + 1);
    
    // Write your code here
    // Example:
    // int left = 0;
    // int right = s.length() - 1;
    // while (left < right) {
    //     swap(s[left], s[right]);
    //     left++;
    //     right--;
    // }
    // cout << s << endl;
    
    return 0;
}`
    },
    reference_solution: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const s = input.split('=')[1];
        
        // Solution
        const chars = s.split('');
        let left = 0;
        let right = chars.length - 1;
        while (left < right) {
            [chars[left], chars[right]] = [chars[right], chars[left]];
            left++;
            right--;
        }
        console.log(chars.join(''));
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    s = input_line.split('=')[1]
    
    # Solution
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    print(''.join(chars))

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    string s = input.substr(input.find('=') + 1);
    
    // Solution
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
    cout << s << endl;
    
    return 0;
}`
    }
  },
  {
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward. For example, 121 is a palindrome while 123 is not.",
    difficulty: "easy",
    tags: ["math", "number"],
    companies: [],
    hints: [
      "Try converting the number to a string and check if it reads the same forwards and backwards",
      "Alternatively, you can reverse the number mathematically without converting to string",
      "Remember to handle negative numbers (they can't be palindromes)",
      "Consider how to extract digits from a number using modulo and division"
    ],
    examples: {
      PYTHON: [
        {
          input: "x=121",
          output: "true",
          explanation: "121 reads as 121 from left to right and from right to left."
        },
        {
          input: "x=-121",
          output: "false",
          explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
        }
      ],
      JAVASCRIPT: [
        {
          input: "x=121",
          output: "true",
          explanation: "121 reads as 121 from left to right and from right to left."
        },
        {
          input: "x=-121",
          output: "false",
          explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
        }
      ],
      CPP: [
        {
          input: "x=121",
          output: "true",
          explanation: "121 reads as 121 from left to right and from right to left."
        },
        {
          input: "x=-121",
          output: "false",
          explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
        }
      ]
    },
    constraints: [
      "-231 <= x <= 231 - 1"
    ],
    testCases: [
      {
        input: "x=121",
        output: "true"
      },
      {
        input: "x=-121",
        output: "false"
      },
      {
        input: "x=10",
        output: "false"
      },
      {
        input: "x=0",
        output: "true"
      }
    ],
    codeSnippets: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const x = parseInt(input.split('=')[1]);
        
        // Write your code here
        // Example:
        // if (x < 0) {
        //     console.log('false');
        //     return;
        // }
        // const str = x.toString();
        // let left = 0;
        // let right = str.length - 1;
        // while (left < right) {
        //     if (str[left] !== str[right]) {
        //         console.log('false');
        //         return;
        //     }
        //     left++;
        //     right--;
        // }
        // console.log('true');
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    x = int(input_line.split('=')[1])
    
    # Write your code here
    # Example:
    // if x < 0:
    //     print('false')
    //     return
    // str_x = str(x)
    // left, right = 0, len(str_x) - 1
    // while left < right:
    //     if str_x[left] != str_x[right]:
    //         print('false')
    //         return
    //     left += 1
    //     right -= 1
    // print('true')

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    int x = stoi(input.substr(input.find('=') + 1));
    
    // Write your code here
    // Example:
    // if (x < 0) {
    //     cout << "false" << endl;
    //     return 0;
    // }
    // string str = to_string(x);
    // int left = 0;
    // int right = str.length() - 1;
    // while (left < right) {
    //     if (str[left] != str[right]) {
    //         cout << "false" << endl;
    //         return 0;
    //     }
    //     left++;
    //     right--;
    // }
    // cout << "true" << endl;
    
    return 0;
}`
    },
    reference_solution: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const x = parseInt(input.split('=')[1]);
        
        // Solution
        if (x < 0) {
            console.log('false');
            return;
        }
        const str = x.toString();
        let left = 0;
        let right = str.length - 1;
        while (left < right) {
            if (str[left] !== str[right]) {
                console.log('false');
                return;
            }
            left++;
            right--;
        }
        console.log('true');
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    x = int(input_line.split('=')[1])
    
    # Solution
    if x < 0:
        print('false')
        return
    str_x = str(x)
    left, right = 0, len(str_x) - 1
    while left < right:
        if str_x[left] != str_x[right]:
            print('false')
            return
        left += 1
        right -= 1
    print('true')

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    int x = stoi(input.substr(input.find('=') + 1));
    
    // Solution
    if (x < 0) {
        cout << "false" << endl;
        return 0;
    }
    string str = to_string(x);
    int left = 0;
    int right = str.length() - 1;
    while (left < right) {
        if (str[left] != str[right]) {
            cout << "false" << endl;
            return 0;
        }
        left++;
        right--;
    }
    cout << "true" << endl;
    
    return 0;
}`
    }
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "easy",
    tags: ["dynamic-programming", "math"],
    companies: [],
    hints: [
      "Think about the base cases: if n = 1, there is only one way; if n = 2, there are two ways.",
      "For n > 2, the number of ways to reach the nth step is the sum of the ways to reach the (n-1)th step and the (n-2)th step.",
      "This is a classic Fibonacci sequence problem.",
      "You can use dynamic programming to avoid recalculating the same subproblems."
    ],
    examples: {
      PYTHON: [
        {
          input: "n = 3",
          output: "3",
          explanation: "There are three ways to climb to the top: 1 + 1 + 1, 1 + 2, 2 + 1."
        }
      ],
      JAVASCRIPT: [
        {
          input: "n = 3",
          output: "3",
          explanation: "There are three ways to climb to the top: 1 + 1 + 1, 1 + 2, 2 + 1."
        }
      ],
      CPP: [
        {
          input: "n = 3",
          output: "3",
          explanation: "There are three ways to climb to the top: 1 + 1 + 1, 1 + 2, 2 + 1."
        }
      ]
    },
    constraints: [
      "1 <= n <= 45"
    ],
    testCases: [
      {
        input: "3",
        output: "3"
      },
      {
        input: "4",
        output: "5"
      },
      {
        input: "5",
        output: "8"
      }
    ],
    codeSnippets: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const n = parseInt(input);
        
        // Write your code here
        // Example:
        // let dp = new Array(n + 1).fill(0);
        // dp[1] = 1;
        // dp[2] = 2;
        // for (let i = 3; i <= n; i++) {
        //     dp[i] = dp[i - 1] + dp[i - 2];
        // }
        // console.log(dp[n].toString());
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    n = int(input_line)
    
    # Write your code here
    # Example:
    # dp = [0] * (n + 1)
    # dp[1] = 1
    # dp[2] = 2
    # for i in range(3, n + 1):
    #     dp[i] = dp[i - 1] + dp[i - 2]
    # print(dp[n])

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>
#include <sstream>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    int n = stoi(input);
    
    // Write your code here
    // Example:
    // int dp[n + 1];
    // dp[1] = 1;
    // dp[2] = 2;
    // for (int i = 3; i <= n; i++) {
    //     dp[i] = dp[i - 1] + dp[i - 2];
    // }
    // cout << dp[n] << endl;
    
    return 0;
}`
    },
    reference_solution: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    // Read input line by line
    let input = '';
    rl.on('line', (line) => {
        input = line.trim();
        // Parse input
        const n = parseInt(input);
        
        // Solution
        let dp = new Array(n + 1).fill(0);
        dp[1] = 1;
        dp[2] = 2;
        for (let i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        console.log(dp[n].toString());
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    input_line = sys.stdin.readline().strip()
    # Parse input
    n = int(input_line)
    
    # Solution
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    print(dp[n])

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>
#include <sstream>

using namespace std;

int main() {
    string input;
    getline(cin, input);
    
    // Parse input
    int n = stoi(input);
    
    // Solution
    int dp[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    cout << dp[n] << endl;
    
    return 0;
}`
    }
  },
  {
    title: "String Repeater",
    description: `Write a program that takes a number N and a string S as input, and outputs the string S repeated N times.

Input Format:
- First line: A number N (1 ≤ N ≤ 100)
- Second line: A string S (1 ≤ length(S) ≤ 100)

Output Format:
- A single line containing the string S repeated N times

Example 1:
Input:
3
hello

Output:
hellohellohello

Example 2:
Input:
2
abc

Output:
abcabc

Example 3:
Input:
1
test

Output:
test`,
    difficulty: "easy",
    tags: ["string", "input-output"],
    hints: [
      "Read the input line by line using appropriate input methods",
      "Convert the first line to a number",
      "Use string multiplication or concatenation in a loop",
      "Make sure to handle the newline character correctly"
    ],
    examples: {
      JAVASCRIPT: [
        {
          input: "3\nhello",
          output: "hellohellohello",
          explanation: "The number 3 indicates we should repeat 'hello' 3 times"
        },
        {
          input: "2\nabc",
          output: "abcabc",
          explanation: "The number 2 indicates we should repeat 'abc' 2 times"
        }
      ],
      PYTHON: [
        {
          input: "3\nhello",
          output: "hellohellohello",
          explanation: "The number 3 indicates we should repeat 'hello' 3 times"
        },
        {
          input: "2\nabc",
          output: "abcabc",
          explanation: "The number 2 indicates we should repeat 'abc' 2 times"
        }
      ],
      CPP: [
        {
          input: "3\nhello",
          output: "hellohellohello",
          explanation: "The number 3 indicates we should repeat 'hello' 3 times"
        },
        {
          input: "2\nabc",
          output: "abcabc",
          explanation: "The number 2 indicates we should repeat 'abc' 2 times"
        }
      ]
    },
    constraints: [
      "1 ≤ N ≤ 100",
      "1 ≤ length(S) ≤ 100",
      "S contains only lowercase letters"
    ],
    testCases: [
      {
        input: "3\nhello",
        output: "hellohellohello"
      },
      {
        input: "2\nabc",
        output: "abcabc"
      },
      {
        input: "1\ntest",
        output: "test"
      },
      {
        input: "4\nxyz",
        output: "xyzxyzxyzxyz"
      }
    ],
    codeSnippets: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    let lines = [];
    rl.on('line', (line) => {
        lines.push(line.trim());
        if (lines.length === 2) {
            const n = parseInt(lines[0]);
            const s = lines[1];
            
            // Write your code here
            // Example:
            // console.log(s.repeat(n));
            
            rl.close();
        }
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    n = int(sys.stdin.readline().strip())
    s = sys.stdin.readline().strip()
    
    # Write your code here
    # Example:
    # print(s * n)

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>

using namespace std;

int main() {
    int n;
    string s;
    
    // Read input
    cin >> n;
    cin >> s;
    
    // Write your code here
    // Example:
    // for (int i = 0; i < n; i++) {
    //     cout << s;
    // }
    // cout << endl;
    
    return 0;
}`
    },
    reference_solution: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    let lines = [];
    rl.on('line', (line) => {
        lines.push(line.trim());
        if (lines.length === 2) {
            const n = parseInt(lines[0]);
            const s = lines[1];
            console.log(s.repeat(n));
            rl.close();
        }
    });
}

main();`,
      PYTHON: `import sys

def main():
    n = int(sys.stdin.readline().strip())
    s = sys.stdin.readline().strip()
    print(s * n)

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>

using namespace std;

int main() {
    int n;
    string s;
    cin >> n;
    cin >> s;
    
    for (int i = 0; i < n; i++) {
        cout << s;
    }
    cout << endl;
    
    return 0;
}`
    }
  },
  {
    title: "Valid Anagram",
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Input Format:
- First line: String s
- Second line: String t

Output Format:
- Print "true" if t is an anagram of s, "false" otherwise

Example 1:
Input:
anagram
nagaram

Output:
true

Example 2:
Input:
rat
car

Output:
false

Example 3:
Input:
hello
world

Output:
false`,
    difficulty: "easy",
    tags: ["string", "hash-table", "sorting"],
    hints: [
      "Consider using a hash map to count character frequencies",
      "You can also sort both strings and compare them",
      "Check if the strings have the same length first",
      "Consider using an array of size 26 for lowercase letters"
    ],
    examples: {
      JAVASCRIPT: [
        {
          input: "anagram\nnagaram",
          output: "true",
          explanation: "Both strings contain the same letters in different order."
        },
        {
          input: "rat\ncar",
          output: "false",
          explanation: "The strings contain different letters."
        }
      ],
      PYTHON: [
        {
          input: "anagram\nnagaram",
          output: "true",
          explanation: "Both strings contain the same letters in different order."
        },
        {
          input: "rat\ncar",
          output: "false",
          explanation: "The strings contain different letters."
        }
      ],
      CPP: [
        {
          input: "anagram\nnagaram",
          output: "true",
          explanation: "Both strings contain the same letters in different order."
        },
        {
          input: "rat\ncar",
          output: "false",
          explanation: "The strings contain different letters."
        }
      ]
    },
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters"
    ],
    testCases: [
      {
        input: "anagram\nnagaram",
        output: "true"
      },
      {
        input: "rat\ncar",
        output: "false"
      },
      {
        input: "hello\nworld",
        output: "false"
      }
    ],
    codeSnippets: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    let s = '';
    let t = '';
    let lineCount = 0;
    
    rl.on('line', (line) => {
        if (lineCount === 0) {
            s = line.trim();
            lineCount++;
        } else {
            t = line.trim();
            // Write your code here
            // Example:
            // const result = isAnagram(s, t);
            // console.log(result.toString());
            rl.close();
        }
    });
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    s = sys.stdin.readline().strip()
    t = sys.stdin.readline().strip()
    
    # Write your code here
    # Example:
    # result = isAnagram(s, t)
    # print(str(result).lower())

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    string s, t;
    getline(cin, s);  // Read first line
    getline(cin, t);  // Read second line
    
    // Write your code here
    // Example:
    // bool result = isAnagram(s, t);
    // cout << (result ? "true" : "false") << endl;
    
    return 0;
}`
    },
    reference_solution: {
      JAVASCRIPT: `// Read input from stdin
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function main() {
    let s = '';
    let t = '';
    let lineCount = 0;
    
    rl.on('line', (line) => {
        if (lineCount === 0) {
            s = line.trim();
            lineCount++;
        } else {
            t = line.trim();
            const result = isAnagram(s, t);
            console.log(result.toString());
            rl.close();
        }
    });
}

function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const charCount = new Map();
    
    // Count characters in s
    for (const char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // Decrement counts for characters in t
    for (const char of t) {
        const count = charCount.get(char);
        if (!count) return false;
        charCount.set(char, count - 1);
    }
    
    return true;
}

main();`,
      PYTHON: `import sys

def main():
    # Read input from stdin
    s = sys.stdin.readline().strip()
    t = sys.stdin.readline().strip()
    
    # Solution
    result = isAnagram(s, t)
    print(str(result).lower())

def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    
    char_count = {}
    
    # Count characters in s
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    
    # Decrement counts for characters in t
    for char in t:
        if char not in char_count or char_count[char] == 0:
            return False
        char_count[char] -= 1
    
    return True

if __name__ == "__main__":
    main()`,
      CPP: `#include <iostream>
#include <string>
#include <unordered_map>

using namespace std;

bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    
    unordered_map<char, int> charCount;
    
    // Count characters in s
    for (char c : s) {
        charCount[c]++;
    }
    
    // Decrement counts for characters in t
    for (char c : t) {
        if (charCount[c] == 0) return false;
        charCount[c]--;
    }
    
    return true;
}

int main() {
    string s, t;
    getline(cin, s);  // Read first line
    getline(cin, t);  // Read second line
    
    bool result = isAnagram(s, t);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}`
    }
  },
  
];