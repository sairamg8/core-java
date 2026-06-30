export default {
  id: 'project1-calculate-score',
  title: '77. Project 1- Calculate Score',
  explanation: `The final step of the Quiz App adds a proper score display with percentage, grade, and a method to calculate and present the results in a polished way.

**Score calculation:**
\`\`\`java
int correct = 3;
int total = 5;
double percentage = (double) correct / total * 100;
// (double) cast ensures floating-point division, not integer division
\`\`\`

**Grade logic:**
\`\`\`
>= 90% → A
>= 75% → B
>= 60% → C
>= 40% → D
< 40%  → F
\`\`\`

**Separating score display into a method:**
\`\`\`java
static void showResults(int score, int total) {
    double pct = (double) score / total * 100;
    System.out.printf("Score: %d/%d (%.1f%%)%n", score, total, pct);
    System.out.println("Grade: " + getGrade(pct));
}
\`\`\`

**Complete project reflection:**
At this point the project demonstrates:
- **Encapsulation:** Question has private fields and public getters
- **Arrays of objects:** Question[] stores the question bank
- **Loops:** iterate questions in order
- **Methods:** displayQuestion(), showResults(), getGrade() each have one job
- **User input:** Scanner.nextInt()
- **Conditionals:** answer checking, grade logic

This is the foundation the REST API Quiz App later in the course builds on.`,
  code: `import java.util.Scanner;

// Complete Quiz App with score calculation
public class QuizApp {
    public static void main(String[] args) {
        QuestionService service = new QuestionService();
        Question[] questions = service.getAllQuestions();
        Scanner sc = new Scanner(System.in);
        int score = 0;

        System.out.println("=== Java Bible Quiz ===\\n");

        for (int i = 0; i < questions.length; i++) {
            displayQuestion(i + 1, questions[i]);
            System.out.print("Your answer (1-4): ");
            int answer = sc.nextInt();

            if (answer == questions[i].getCorrectOption()) {
                System.out.println("✓ Correct!\\n");
                score++;
            } else {
                System.out.printf("✗ Wrong. Answer: %d%n%n",
                    questions[i].getCorrectOption());
            }
        }

        sc.close();
        showResults(score, questions.length);
    }

    static void displayQuestion(int num, Question q) {
        System.out.println("Q" + num + ": " + q.getQuestionText());
        System.out.println("  1. " + q.getOptionA());
        System.out.println("  2. " + q.getOptionB());
        System.out.println("  3. " + q.getOptionC());
        System.out.println("  4. " + q.getOptionD());
    }

    static void showResults(int score, int total) {
        double percentage = (double) score / total * 100;
        System.out.println("=== Quiz Results ===");
        System.out.printf("Score:      %d / %d%n", score, total);
        System.out.printf("Percentage: %.1f%%%n", percentage);
        System.out.println("Grade:      " + getGrade(percentage));
        System.out.println(percentage >= 60 ? "Status: PASS" : "Status: FAIL");
    }

    static String getGrade(double pct) {
        if (pct >= 90) return "A";
        if (pct >= 75) return "B";
        if (pct >= 60) return "C";
        if (pct >= 40) return "D";
        return "F";
    }
}`,
  codeTitle: 'Complete Quiz App with Score, Percentage, and Grade',
  points: [
    'Cast one operand to double before integer division: (double) score / total gives 0.6, not 0 (integer division truncates)',
    'Use printf for formatted output: %.1f%% prints one decimal place with a literal percent sign (escaping %% is required in printf format strings)',
    'Separate showResults() and getGrade() into their own methods — each has a single clear purpose and is independently testable',
    'The complete project now uses: encapsulation, arrays, loops, methods, scanner input, conditional logic, and formatted output',
    'This project structure (model + service + runner) scales directly to Spring Boot: Question → @Entity, QuestionService → @Service, QuizApp → @RestController',
    'Adding more questions to QuestionService is the only change needed to expand the quiz — the game logic is untouched',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'int/int in Java gives int (truncates): 3/5 = 0, not 0.6. Always cast to double first: (double)3/5 = 0.6. This is the most common score calculation bug.',
    },
    {
      type: 'tip',
      content: 'String.format("%.1f%%", pct) and System.out.printf("%.1f%%%n", pct) both work. %% produces a literal % in the output. %.1f rounds to 1 decimal place.',
    },
    {
      type: 'interview',
      content: 'Q: How would you calculate and display a percentage in Java?\nA: percentage = (double) score / total * 100 — cast to double before division to avoid integer truncation. Display with System.out.printf("%.1f%%", percentage) for one-decimal precision and the literal % symbol.',
    },
  ],
}
