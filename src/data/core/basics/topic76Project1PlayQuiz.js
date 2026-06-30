export default {
  id: 'project1-play-quiz',
  title: '76. Project 1- Play Quiz',
  explanation: `This step makes the quiz interactive — displaying each question and collecting the user's answer using \`Scanner\`, then determining if the answer is correct.

**The interactive game loop:**
\`\`\`java
for each question:
    displayQuestion(num, q)
    userAnswer = sc.nextInt()
    if (userAnswer == q.getCorrectOption()) score++
\`\`\`

**Scanner for integer input:**
\`\`\`java
Scanner sc = new Scanner(System.in);
int answer = sc.nextInt(); // reads one integer from the console
\`\`\`

**Input validation (basic):**
For a course project, basic validation (1-4 only) is acceptable. Production code would loop until valid input is received.

**Immediate feedback:**
After each answer, print "Correct!" or "Wrong! Correct answer was X" — this keeps the quiz engaging and teaches the user.

**Resource management:**
Close the Scanner when done: \`sc.close()\`. This is good practice even for console-based programs — in production, unclosed resources leak file descriptors.

**After this step:**
The quiz is fully playable. The final step (topic 77) adds the final score display and percentage calculation.`,
  code: `import java.util.Scanner;

public class QuizApp {
    public static void main(String[] args) {
        QuestionService service = new QuestionService();
        Question[] questions = service.getAllQuestions();
        Scanner sc = new Scanner(System.in);
        int score = 0;

        System.out.println("=== Java Quiz — Let's Play! ===");
        System.out.println("Enter 1, 2, 3, or 4 for each question.\\n");

        for (int i = 0; i < questions.length; i++) {
            displayQuestion(i + 1, questions[i]);

            System.out.print("Your answer: ");
            int userAnswer = sc.nextInt();

            if (userAnswer == questions[i].getCorrectOption()) {
                System.out.println("✓ Correct!");
                score++;
            } else {
                System.out.println("✗ Wrong! Correct answer was "
                    + questions[i].getCorrectOption());
            }
            System.out.println();
        }

        System.out.println("Quiz complete! Score: " + score + "/" + questions.length);
        sc.close();
    }

    static void displayQuestion(int num, Question q) {
        System.out.println("Q" + num + ": " + q.getQuestionText());
        System.out.println("  1. " + q.getOptionA());
        System.out.println("  2. " + q.getOptionB());
        System.out.println("  3. " + q.getOptionC());
        System.out.println("  4. " + q.getOptionD());
    }
}
// Sample run:
// Q1: What is Java?
//   1. Operating System
//   2. Programming Language
//   3. Database
//   4. Network Protocol
// Your answer: 2
// ✓ Correct!`,
  codeTitle: 'Interactive Quiz Game Loop with Scanner Input',
  points: [
    'sc.nextInt() reads the next integer from System.in — blocks until the user presses Enter',
    'Compare user answer (int) to getCorrectOption() (int) with == — integer comparison is simple and unambiguous',
    'Provide immediate feedback (Correct / Wrong with correct answer) after each response — critical for learning UX',
    'The score variable is incremented only on correct answers — declared outside the loop so it accumulates across all iterations',
    'Always close the Scanner (sc.close()) to release the underlying InputStream resource',
    'For robustness, wrap sc.nextInt() in a try-catch InputMismatchException if users might type letters instead of numbers',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'sc.nextInt() does NOT consume the newline after the number. If you later call sc.nextLine(), it will immediately return an empty string (reading the leftover newline). Add sc.nextLine() after nextInt() calls to consume the newline before reading String input.',
    },
    {
      type: 'tip',
      content: 'Showing the correct answer on wrong responses (not just "Wrong!") makes this a learning quiz rather than just a scoring game. Always include the answer reveal for educational apps.',
    },
    {
      type: 'interview',
      content: 'Q: How do you read integer input in Java?\nA: Use Scanner.nextInt(). Create Scanner sc = new Scanner(System.in); then int n = sc.nextInt();. Remember to close the scanner when done. For production, validate input in a loop and catch InputMismatchException.',
    },
  ],
}
