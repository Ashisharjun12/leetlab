export const sampleProblems = [
  {
    title: "Add Two Numbers",
    description: "Given two integers, return their sum.",
    difficulty: "easy",
    companyId: null,
    tags: "math, basic",
    constraints: "-1000 <= num1, num2 <= 1000",
    examples: {
      PYTHON: {
        input: "5\n3",
        output: "8",
        explanation: "5 + 3 = 8"
      },
      JAVASCRIPT: {
        input: "10\n20",
        output: "30",
        explanation: "10 + 20 = 30"
      }
    },
    testCases: [
      {
        input: "5\n3",
        output: "8"
      },
       {
        input: "-1\n1",
        output: "0"
      }
    ],
    codeSnippets: {
      PYTHON: `def add_two(num1, num2):
  # Write your code here
  pass`,
      JAVASCRIPT: `/**
 * @param {number} num1
 * @param {number} num2
 * @return {number}
 */
var addTwoNumbers = function(num1, num2) {
    // Write your code here
    
};`
    },
    reference_solution: {
      PYTHON: `import sys

# Read input from stdin
input_lines = sys.stdin.read().splitlines()
num1 = int(input_lines[0])
num2 = int(input_lines[1])

# Calculate sum and print output
result = num1 + num2
print(result)`,
      JAVASCRIPT: `// Basic input handling for a Node.js-like environment
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  try {
    const num1 = parseInt(inputLines[0]);
    const num2 = parseInt(inputLines[1]);

    const result = num1 + num2;
    console.log(result);
  } catch (e) {
    console.error(e);
  }
});`
    }
  },
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    companyId: null,
    tags: "array, hash-table",
    constraints: "2 <= nums.length <= 104, -109 <= nums[i] <= 109, -109 <= target <= 109",
    examples: {
      PYTHON: {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      JAVASCRIPT: {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    },
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]"
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]"
      }
    ],
    codeSnippets: {
      PYTHON: `def twoSum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`,
      JAVASCRIPT: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`
    },
    reference_solution: {
      PYTHON: `import sys
import json

def twoSum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []

# Read input from stdin
input_lines = sys.stdin.read().splitlines()
# Assuming input format is a list string on the first line and target on the second

nums = json.loads(input_lines[0])
target = int(input_lines[1])

# Call the function and print output as JSON string
result = twoSum(nums, target)
print(json.dumps(result))`,
      JAVASCRIPT: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};

// Basic input handling for a Node.js-like environment (might need adjustments based on actual Judge0 setup)
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  try {
    // Assuming input format is a list string on the first line and target on the second
    const nums = JSON.parse(inputLines[0]);
    const target = parseInt(inputLines[1]);

    // Call the function and print output as JSON string
    const result = twoSum(nums, target);
    console.log(JSON.stringify(result));
  } catch (e) {
    console.error(e);
  }
});`
    }
  },
  {
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "easy",
    companyId: null,
    tags: "linked-list, recursion",
    constraints: "The number of nodes in the list is the range [0, 5000], -5000 <= Node.val <= 5000",
    examples: {
      PYTHON: {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed, so the last node becomes the first node."
      },
      JAVASCRIPT: {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed, so the last node becomes the first node."
      }
    },
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      },
      {
        input: "[1,2]",
        output: "[2,1]"
      }
    ],
    codeSnippets: {
      PYTHON: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
      JAVASCRIPT: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
};`
    },
    reference_solution: {
      PYTHON: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev

# Note: Linked List problems require specific handling for input/output
# This is a simplified example, actual parsing depends on the test case format
# For a typical online judge, you might need to build the linked list from input
`,
      JAVASCRIPT: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
};

// Basic input handling (might need adjustments based on actual Judge0 setup)
// This is a placeholder for building the linked list from input string representation
// In a real scenario, you'd parse the input string like "[1,2,3,4,5]" into a linked list structure.
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLine = '';
rl.on('line', (line) => {
  inputLine = line;
});

rl.on('close', () => {
  try {
    // Placeholder: build linked list from inputLine
    // For example, parsing "[1,2,3,4,5]" into a linked list.
    // This part is complex and depends on the exact input format and helper functions available.
    console.log("Linked list input parsing not implemented in this example.");
    // Example: const head = buildLinkedListFromString(inputLine);
    // const result = reverseList(head);
    // console.log(linkedListToString(result)); // Convert reversed list back to string output format

  } catch (e) {
    console.error(e);
  }
});`
    }
  }
]; 