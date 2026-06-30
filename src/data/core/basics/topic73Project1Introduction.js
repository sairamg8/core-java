export default {
  id: 'project1-introduction',
  title: '73. Project 1- Introduction',
  explanation: `This is the first full project in the course: a **Quiz Application** built using core Java concepts learned so far. The project reinforces OOP fundamentals by building a real working program from scratch.

**What we will build:**
A console-based quiz app where:
- Questions are stored as objects
- A user is presented questions one by one
- Answers are collected and scored
- The final score is displayed

**Why this project?**
Real understanding comes from combining concepts, not just reading them in isolation. This project uses:
- **Classes and objects** (Question class, QuizApp class)
- **Arrays** (storing questions)
- **Methods** (displayQuestion, calculateScore)
- **Loops** (iterate through questions)
- **User input** (Scanner)
- **Encapsulation** (private fields, public getters)

**Project structure:**
\`\`\`
QuizApp/
├── Question.java    — the data model (fields: text, options, answer)
├── QuestionService.java — manages the question bank
└── QuizApp.java     — main entry point, game loop
\`\`\`

**Learning goals:**
1. Design a class to model a domain entity (Question)
2. Separate data (model) from logic (service)
3. Use an array of objects to store the question bank
4. Control flow through the quiz game loop
5. Calculate and display the final score`,
  code: `// Skeleton overview of the full Quiz App project
// File 1: Question.java — data model
class Question {
    private String questionText;
    private String[] options;     // 4 answer choices
    private int correctOption;    // 1-based correct answer index

    Question(String text, String[] opts, int correct) {
        this.questionText = text;
        this.options = opts;
        this.correctOption = correct;
    }

    // Getters — no setters: questions are immutable once created
    public String getQuestionText() { return questionText; }
    public String[] getOptions()    { return options; }
    public int getCorrectOption()   { return correctOption; }
}

// File 2: QuestionService.java — question bank
class QuestionService {
    Question[] getAllQuestions() {
        return new Question[] {
            new Question("What is Java?",
                new String[]{"OS", "Language", "DB", "Framework"}, 2),
            new Question("JVM stands for?",
                new String[]{"Java Very Machine", "Java Virtual Machine",
                             "Java Verified Module", "None"}, 2),
        };
    }
}

// File 3: QuizApp.java — game loop
import java.util.Scanner;
public class QuizApp {
    public static void main(String[] args) {
        QuestionService service = new QuestionService();
        Question[] questions = service.getAllQuestions();
        Scanner sc = new Scanner(System.in);
        int score = 0;
        // loop through questions, read input, check answer, accumulate score
        sc.close();
        System.out.println("Score: " + score + "/" + questions.length);
    }
}`,
  codeTitle: 'Quiz App Project — Overview and Class Structure',
  points: [
    'The quiz project applies OOP to a real problem: model data with Question, separate concerns with QuestionService, drive the game in QuizApp',
    'Question is a data class with private fields and only getters — questions should not change after creation (immutable)',
    'QuestionService is a service class that returns the question bank — this separation means you can swap in DB-backed questions later',
    'Array of Question objects demonstrates arrays of objects (topic 44) combined with encapsulation (topics 49-50)',
    'The main loop pattern: get questions → iterate → ask → read input → check → accumulate — is the skeleton of every quiz/game app',
    'This project is a stepping stone to the Spring MVC REST API version of the Quiz App later in the course',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Before writing any code, sketch the class diagram: Question (fields: text, options[], correctOption) ←uses QuestionService ←uses QuizApp. Clear design before coding prevents major rewrites.',
    },
    {
      type: 'tip',
      content: 'Separate the main game loop from the question bank. If you hard-code questions in main(), changing questions means touching the game logic. The QuestionService separation makes both independently testable and changeable.',
    },
    {
      type: 'interview',
      content: 'Q: How would you design a quiz application in Java?\nA: Three-class design: (1) Question entity with immutable fields and getters; (2) QuestionService that returns the question bank (could be array, list, or DB later); (3) QuizApp main class with the game loop, Scanner input, answer checking, and score tracking.',
    },
  ],
}
