export default {
  id: 'introduction-to-mvc',
  title: '360. Introduction to MVC',
  explanation: `**MVC — Model, View, Controller** — is a design pattern that splits a web application into three responsibilities so code stays organized as it grows. Mixing data logic, HTML, and request handling in one servlet (see [[responding-to-the-client]]) becomes unmanageable; MVC separates them.

**The three parts:**

**Model** — the **data** and business logic. Plain Java objects (a \`Student\`, a \`Job\`) plus the services/repositories that produce them. The model knows nothing about the web.

**View** — the **presentation**. The page the user sees, typically a **JSP** or template. It takes model data and renders HTML. The view knows nothing about how the data was fetched.

**Controller** — the **coordinator**. It receives the request, calls the right business logic to build the model, and picks which view should render it. It is the glue between Model and View.

**The flow:**
1. Request hits the **Controller**.
2. Controller works with the **Model** (fetch/update data).
3. Controller hands the model to a **View**.
4. View renders HTML using the model, and the response goes back.

**Why it matters:** each piece changes independently — you can redesign the page (View) without touching data logic (Model), or swap the database without rewriting pages. In Spring, a front controller called the **DispatcherServlet** (see [[dispatcherservlet]]) routes every request to your \`@Controller\` methods, so you write controllers and views instead of raw servlets.`,
  points: [
    'MVC separates an app into Model (data + logic), View (presentation), and Controller (coordination).',
    'The Model is plain data/business objects and knows nothing about the web.',
    'The View (JSP/template) renders HTML from model data and knows nothing about data fetching.',
    'The Controller receives the request, builds the model, and selects the view.',
    'Separation lets you change the UI, logic, or data layer independently.',
  ],
  callouts: [
    { type: 'tip', content: 'A useful test of good MVC: could you replace JSP views with a JSON API without touching your model/business classes? If yes, your layers are properly separated.' },
    { type: 'interview', content: 'Q: In Spring MVC, what plays the role of the front controller?\nA: The DispatcherServlet. It receives all requests and dispatches them to the appropriate @Controller handler methods, then to a view resolver.' },
  ],
}
