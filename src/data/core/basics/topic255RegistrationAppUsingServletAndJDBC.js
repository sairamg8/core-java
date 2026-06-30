export default {
  id: 'registration-app-servlet-jdbc',
  title: '255. Registration App using Servlet and JDBC',
  explanation: `The Registration App ties together everything learned so far: HTML form → Servlet → JDBC → database → JSP response. It is the classic end-to-end exercise.

**Application flow:**

\`\`\`
1. User opens /register          → GET → RegistrationServlet → shows register.html
2. User fills form and submits   → POST → RegistrationServlet → validates → inserts via JDBC
3. On success                    → redirect to success.jsp
4. On duplicate email / error    → redirect back with error message
\`\`\`

**Database setup:**
\`\`\`sql
CREATE TABLE users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Components:**
1. \`register.html\` — the input form
2. \`RegistrationServlet.java\` — processes POST, calls JDBC
3. \`DBUtil.java\` — centralizes the JDBC connection
4. \`success.jsp\` — displays the welcome message
5. \`error.jsp\` or redirect with query param — shows error

**Security notes for production:**
- Never store plain-text passwords. Use BCrypt or PBKDF2:
  \`String hashed = BCrypt.hashpw(password, BCrypt.gensalt());\`
- Always use PreparedStatement — never concatenate user input into SQL
- Validate input server-side (client-side JS is easily bypassed)
- Set the session after successful registration to log the user in automatically`,
  code: `// ===== Registration App — Servlet + JDBC =====

// 1. DBUtil.java
package com.example;
import java.sql.*;

public class DBUtil {
    private static final String URL  = "jdbc:mysql://localhost:3306/appdb?useSSL=false&serverTimezone=UTC";
    private static final String USER = "javaapp";
    private static final String PASS = "SecurePass123";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}

// 2. RegistrationServlet.java
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.sql.*;

@WebServlet("/register")
public class RegistrationServlet extends HttpServlet {

    // doGet: show the registration form
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        // Redirect to static HTML form
        res.sendRedirect(req.getContextPath() + "/register.html");
    }

    // doPost: process the registration form
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");

        String name     = req.getParameter("name");
        String email    = req.getParameter("email");
        String password = req.getParameter("password");
        String confirm  = req.getParameter("confirmPassword");

        // Server-side validation
        if (name == null || name.isBlank() ||
            email == null || email.isBlank() ||
            password == null || password.isBlank()) {
            res.sendRedirect(req.getContextPath() + "/register.html?error=empty");
            return;
        }

        if (!password.equals(confirm)) {
            res.sendRedirect(req.getContextPath() + "/register.html?error=mismatch");
            return;
        }

        // Insert into database using PreparedStatement
        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, name);
            ps.setString(2, email);
            ps.setString(3, password); // In production: hash first! BCrypt.hashpw(password, BCrypt.gensalt())

            ps.executeUpdate();

            // Get the auto-generated user ID
            int newId;
            try (ResultSet keys = ps.getGeneratedKeys()) {
                keys.next();
                newId = keys.getInt(1);
            }

            // Store basic info in session (logs user in after registration)
            HttpSession session = req.getSession();
            session.setAttribute("loggedInUser", name);
            session.setAttribute("userId", newId);

            // Forward to success JSP (sets request attributes for JSP to display)
            req.setAttribute("userName", name);
            req.setAttribute("userEmail", email);
            req.setAttribute("userId", newId);
            RequestDispatcher rd = req.getRequestDispatcher("/WEB-INF/views/success.jsp");
            rd.forward(req, res);

        } catch (SQLIntegrityConstraintViolationException e) {
            // Duplicate email — UNIQUE constraint violated
            res.sendRedirect(req.getContextPath() + "/register.html?error=duplicate");
        } catch (SQLException e) {
            e.printStackTrace();
            res.sendRedirect(req.getContextPath() + "/register.html?error=db");
        }
    }
}

/* 3. register.html
<!DOCTYPE html>
<html>
<head><title>Register</title></head>
<body>
  <h2>Create Account</h2>
  <form method="post" action="register">
    Name:    <input type="text"     name="name"            required><br><br>
    Email:   <input type="email"    name="email"           required><br><br>
    Pass:    <input type="password" name="password"        required><br><br>
    Confirm: <input type="password" name="confirmPassword" required><br><br>
    <button type="submit">Register</button>
  </form>
</body>
</html>

4. WEB-INF/views/success.jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<body>
  <h2>Registration Successful!</h2>
  <p>Welcome, \${userName}! (ID: \${userId})</p>
  <p>Email: \${userEmail}</p>
  <a href="dashboard">Go to Dashboard</a>
</body>
</html>
*/`,
  codeTitle: 'Registration App — HTML Form + Servlet + JDBC + JSP',
  points: [
    'The Registration App integrates HTML form, Servlet (controller), JDBC (data access), and JSP (view) in one flow',
    'Always use PreparedStatement for INSERT with user input — never concatenate form fields into a SQL string',
    'SQLIntegrityConstraintViolationException indicates a UNIQUE constraint violation (duplicate email) — catch it specifically',
    'Server-side validation is mandatory — client-side HTML5 required and JavaScript validation can be bypassed by the browser',
    'After successful registration, create an HttpSession and store user info to automatically log the user in',
    'Use sendRedirect() for error cases (PRG pattern) and forward() for the success view so JSP can access request attributes',
    'In production, never store plain-text passwords — hash with BCrypt (jBCrypt library) before inserting into the database',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Catching plain SQLException for a duplicate-key error makes it hard to show a user-friendly message — the same exception type covers network errors, syntax errors, and constraint violations. Catch SQLIntegrityConstraintViolationException (a subclass) specifically for duplicate key scenarios, or check e.getSQLState().startsWith('23') which is the standard prefix for integrity constraint violations.",
    },
    {
      type: 'interview',
      content: "Q: How would you structure a user registration feature using Servlet and JDBC?\nA: Use separate layers: (1) HTML form collects user input; (2) Servlet reads and validates parameters, calls a DAO; (3) DAO uses PreparedStatement to INSERT into the users table; (4) On success, Servlet sets session attributes and forwards to a success JSP; (5) On duplicate email, Servlet redirects back to the form with an error code. Always hash passwords before storage.",
    },
    {
      type: 'tip',
      content: "Centralize JDBC connections in a DBUtil class that returns connections from a connection pool (like HikariCP or Tomcat's built-in DBCP). Opening a new Connection per request is expensive. With a pool, connections are reused. Add HikariCP to pom.xml and configure the DataSource in the Servlet's init() method, storing it in ServletContext for shared access.",
    },
  ],
}
