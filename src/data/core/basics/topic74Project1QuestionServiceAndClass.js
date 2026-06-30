export default {
  id: 'project1-questionservice-and-question-class',
  title: '74. Project 1- QuestionService and Question class',
  explanation: `This topic implements the two core classes of the Quiz App: \`Question\` (the domain model) and \`QuestionService\` (the data provider).

**Question class — design decisions:**
- **Private fields:** \`questionText\`, \`options\` (String[4]), \`correctOption\` (int, 1-based)
- **No setters:** questions should be immutable — set once in constructor, never changed
- **Getters only:** expose data read-only to the game loop
- **Single responsibility:** only holds question data, does not display or check answers

**QuestionService class — design decisions:**
- Provides \`getAllQuestions()\` which returns the full question bank as a \`Question[]\`
- Centralized: the game loop does not need to know where questions come from (array, file, DB)
- Extensible: you can later change the method to load from a database without touching the game loop

**Why separate Question from QuestionService?**
- **Single Responsibility Principle (SRP):** Question holds data; QuestionService provides it
- **Testability:** you can test QuestionService independently (does it return the right count?)
- **Future extensibility:** a \`DatabaseQuestionService\` can replace \`QuestionService\` with zero game logic change

**Adding more questions:**
Just add more \`new Question(...)\` entries to the array in QuestionService. The game loop picks up the new count automatically via \`questions.length\`.`,
  code: `// Question.java — pure data model
public class Question {
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private int correctOption; // 1=A, 2=B, 3=C, 4=D

    public Question(String questionText, String optionA, String optionB,
                    String optionC, String optionD, int correctOption) {
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctOption = correctOption;
    }

    // Getters only — no setters (immutable data)
    public String getQuestionText() { return questionText; }
    public String getOptionA()      { return optionA; }
    public String getOptionB()      { return optionB; }
    public String getOptionC()      { return optionC; }
    public String getOptionD()      { return optionD; }
    public int    getCorrectOption(){ return correctOption; }
}

// QuestionService.java — provides questions
public class QuestionService {
    public Question[] getAllQuestions() {
        Question[] questions = new Question[5];

        questions[0] = new Question(
            "What is Java?",
            "Operating System", "Programming Language",
            "Database", "Network Protocol", 2);

        questions[1] = new Question(
            "JVM stands for?",
            "Java Virtual Machine", "Java Verified Module",
            "Just Viable Method", "Java Variable Manager", 1);

        questions[2] = new Question(
            "Which keyword creates an object?",
            "create", "object", "new", "make", 3);

        questions[3] = new Question(
            "Default value of int in Java?",
            "null", "1", "0", "-1", 3);

        questions[4] = new Question(
            "Which OOP concept hides internal data?",
            "Inheritance", "Polymorphism",
            "Encapsulation", "Abstraction", 3);

        return questions;
    }
}`,
  codeTitle: 'Question Entity and QuestionService Data Provider',
  points: [
    'Question is an immutable data class — constructor sets all fields, only getters are provided, no setters',
    'QuestionService.getAllQuestions() is the single source of truth for the question bank — one place to add, remove, or modify questions',
    'Using 4 explicit String fields (optionA-D) is simpler than a String[] for fixed-count options — easier to read in the constructor call',
    'correctOption is 1-based (1=A, 2=B, ...) matching what users type — keeps the answer-checking logic simple',
    'SRP: Question knows only how to hold data; QuestionService knows only how to provide questions; QuizApp knows only the game loop',
    'The array size (5) is currently hard-coded; in a real app this would be driven by a database query count',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'If you change the question set (add a 6th question), you only touch QuestionService — the QuizApp game loop picks up questions.length automatically. This is the open/closed principle in practice.',
    },
    {
      type: 'gotcha',
      content: 'Using int correctOption (1-4) instead of String correctAnswer ("B") is a common beginner mistake to avoid. Comparing user input (an int from Scanner) to an int is simpler and avoids string comparison pitfalls.',
    },
    {
      type: 'interview',
      content: 'Q: Why separate Question from QuestionService?\nA: Single Responsibility Principle. Question only knows how to hold question data. QuestionService only knows how to provide it. The game loop only knows how to run the quiz. Each class has one reason to change — adding questions doesn\'t touch the game, and changing the game doesn\'t touch Question.',
    },
  ],
}
