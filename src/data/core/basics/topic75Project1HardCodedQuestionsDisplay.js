export default {
  id: 'project1-hardcoded-questions-display',
  title: '75. Project 1- Hard Coded Questions and Display them',
  explanation: `This step implements the question display — iterating through the hard-coded question array and showing each question with its four options.

**Display format:**
\`\`\`
Q1: What is Java?
  1. Operating System
  2. Programming Language
  3. Database
  4. Network Protocol
\`\`\`

**Key implementation points:**
- Loop through the array using a counter for question numbers
- Display the question text then each option with a label (1, 2, 3, 4 or A, B, C, D)
- Keep the display logic in a separate method for reusability and testability

**Why hard-coded first?**
Hard-coding the questions directly into the source is intentional for this first iteration:
- Eliminates the complexity of file I/O or database while learning the structure
- Easy to modify and test
- Clear separation of concerns — change questions in QuestionService, not in game logic

**Separation of display logic:**
\`\`\`java
static void displayQuestion(int num, Question q) { ... }
\`\`\`
A static method that accepts the question number and Question object. Called once per loop iteration. Keeps the main game loop lean.

**Next step:**
After display is working, the next step (topic 76) adds user input collection to make the quiz interactive.`,
  code: `import java.util.Scanner;

public class QuizApp {
    public static void main(String[] args) {
        QuestionService service = new QuestionService();
        Question[] questions = service.getAllQuestions();

        System.out.println("=== Welcome to the Java Quiz! ===");
        System.out.println("Total questions: " + questions.length);
        System.out.println();

        // Display all questions (no input yet — just display)
        for (int i = 0; i < questions.length; i++) {
            displayQuestion(i + 1, questions[i]); // 1-based numbering
        }
    }

    // Separate method: clear responsibility, easy to test
    static void displayQuestion(int questionNum, Question q) {
        System.out.println("Q" + questionNum + ": " + q.getQuestionText());
        System.out.println("  1. " + q.getOptionA());
        System.out.println("  2. " + q.getOptionB());
        System.out.println("  3. " + q.getOptionC());
        System.out.println("  4. " + q.getOptionD());
        System.out.println();
    }
}
// Sample output:
// === Welcome to the Java Quiz! ===
// Total questions: 5
//
// Q1: What is Java?
//   1. Operating System
//   2. Programming Language
//   3. Database
//   4. Network Protocol
//
// Q2: JVM stands for?
//   1. Java Virtual Machine
//   ...`,
  codeTitle: 'Quiz App — Display Questions Loop',
  points: [
    'The for loop iterates 0 to questions.length-1; pass i+1 to displayQuestion() for 1-based question numbering',
    'displayQuestion() is a separate static method — it has one job (display) and can be tested or reused independently',
    'Calling it with (i+1, questions[i]) passes the question number and the Question object cleanly to the display method',
    'Hard-coded questions in QuestionService are fine for this phase — the structure supports swapping to a database later',
    'Print a blank line after each question (System.out.println()) to visually separate questions in the console',
    'This step is deliberately output-only — no Scanner yet. Get the display right before adding input complexity',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Build incrementally: display first, then add input, then add scoring. Trying to build all three at once makes debugging harder. Each increment should produce working visible output before adding the next layer.',
    },
    {
      type: 'tip',
      content: 'Move displayQuestion() to its own DisplayService class when the project grows. Following SRP from the start — even in small projects — builds the habit for larger codebases.',
    },
    {
      type: 'interview',
      content: 'Q: How would you display questions in a quiz app?\nA: Iterate the question array with a counter-based for loop, calling a displayQuestion(num, q) helper method on each iteration. Separate the display logic into its own method to keep the main game loop readable and the display independently testable.',
    },
  ],
}
