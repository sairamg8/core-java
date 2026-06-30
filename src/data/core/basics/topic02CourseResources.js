export default {
  id: 'course-resources',
  title: '2. Use the Course Resources',
  explanation: `Every course ships with companion resources. Knowing how to use them separates learners who finish from learners who plateau.

**Types of resources and how to use each:**

**1. Source Code (GitHub)**
The instructor's completed code is available for every project. Strategy: attempt the code yourself first — spend at least 15 minutes debugging before looking up the answer. When you do look, compare your solution to the instructor's and understand the differences. Passive reading of correct code teaches nothing; active comparison teaches everything.

**2. Q&A / Discussion Forum**
Where you ask questions and help others. When posting: include your Java version, IDE, the full error stack trace, and what you already tried. Incomplete questions get slow or no answers. Answering other learners' questions is the fastest way to solidify your own understanding.

**3. Slides / Notes**
PDF or Markdown summaries of key concepts. Ideal for pre-interview review, not for first learning. Use slides to check a specific API after the concept is in your head.

**4. Community (Discord / Slack)**
Real-time help, accountability partners, project feedback. Introduce yourself. Help at your level — you do not need to be an expert to explain what you learned this week to someone who learned it yesterday.

**The productive debugging loop:**
1. Read the error message — especially the first line (exception type) and the line number
2. Google the error + "Java" + your version
3. Check the Q&A for identical issues
4. Post in Q&A with code, error, and what you tried`,
  points: [
    'The official Java documentation at docs.oracle.com/javase is the authoritative source for every API. Learn to navigate Javadoc format — it will be your most-used reference throughout your career.',
    'Error messages in Java are descriptive. A NullPointerException on line 42 of MyClass.java is not vague — it tells you exactly where something is null.',
    'Stack Overflow is acceptable as a resource, but always understand the answer before using it. Copying code you do not understand creates bugs you cannot fix.',
    'GitHub is the world\'s largest code collaboration platform. Learning to navigate repositories, read READMEs, and fork projects is a career skill.',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Keep a "debug journal" — a running text file with: the error, what you thought it meant, what it actually was, and how you fixed it. After 50 entries you will recognize patterns in your own mistakes and eliminate them permanently.',
    },
  ],
}
