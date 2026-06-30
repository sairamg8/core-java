export default {
  id: 'introduction-to-mvc',
  title: '259. Introduction to MVC',
  explanation: `MVC (Model-View-Controller) is a design pattern that separates a web application into three distinct layers. It is the architectural foundation for every major Java web framework.

**The three layers:**

**Model:**
Represents data and business logic. Contains:
- Java Bean / POJO classes (User, Product, Order)
- DAO classes that interact with the database
- Service classes that implement business rules
The Model knows nothing about HTTP or HTML.

**View:**
Renders the user interface. In Servlet + JSP:
- JSP files with EL and JSTL
- Only displays the model data — no logic, no DB calls
The View knows nothing about where the data came from.

**Controller:**
Handles HTTP requests and orchestrates the flow:
- Reads request parameters
- Calls Model (service/DAO) to get or update data
- Sets model data as request attributes
- Decides which View to forward to
In Servlet + JSP: the Servlet is the Controller.

**Data flow:**
\`\`\`
Browser                 Controller (Servlet)         Model (DAO/Service)       View (JSP)
  │                           │                              │                     │
  │── GET /employees ─────────►                              │                     │
  │                           │── findAll() ─────────────────►                     │
  │                           │◄── List<Employee> ───────────│                     │
  │                           │── setAttribute("employees", list)                  │
  │                           │── forward("/WEB-INF/employees.jsp") ───────────────►
  │◄──────────────────────────────────── HTML response ──────────────────────────  │
\`\`\`

**Why MVC?**
- **Separation of concerns:** Each layer has one job
- **Maintainability:** Change the view (JSP) without touching the controller
- **Testability:** Test the model (DAO) and controller (Servlet) independently
- **Team collaboration:** Backend devs write Servlets/DAOs; frontend devs write JSPs

**MVC in frameworks:**
- Spring MVC: @Controller handles requests → Model → @RequestMapping → Thymeleaf/JSP view
- Spring Boot: Same pattern, less configuration
- The pattern is the same — only the boilerplate differs`,
  code: `// ===== MVC Pattern Implementation with Servlet + JSP =====

// ===== MODEL LAYER =====

// 1. Bean (data structure)
package com.example.model;
public class Employee {
    private int id;
    private String name;
    private String department;
    private double salary;

    // Constructors, getters, setters
    public Employee(int id, String name, String dept, double salary) {
        this.id = id; this.name = name; this.department = dept; this.salary = salary;
    }
    public int    getId()         { return id; }
    public String getName()       { return name; }
    public String getDepartment() { return department; }
    public double getSalary()     { return salary; }
}

// 2. DAO (data access — talks to DB)
package com.example.model;
import java.sql.*;
import java.util.*;
import com.example.util.DBUtil;

public class EmployeeDAO {
    public List<Employee> findAll() throws SQLException {
        List<Employee> list = new ArrayList<>();
        String sql = "SELECT id, name, department, salary FROM employees ORDER BY name";
        try (Connection c = DBUtil.getConnection();
             Statement  s = c.createStatement();
             ResultSet  r = s.executeQuery(sql)) {
            while (r.next()) {
                list.add(new Employee(r.getInt("id"), r.getString("name"),
                        r.getString("department"), r.getDouble("salary")));
            }
        }
        return list;
    }

    public void insert(Employee e) throws SQLException {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, e.getName());
            ps.setString(2, e.getDepartment());
            ps.setDouble(3, e.getSalary());
            ps.executeUpdate();
        }
    }
}

// ===== CONTROLLER LAYER =====

// 3. Servlet Controller
package com.example.controller;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.List;
import com.example.model.*;

@WebServlet("/employees")
public class EmployeeController extends HttpServlet {

    private EmployeeDAO dao = new EmployeeDAO();

    // Read: GET /employees → show list
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        try {
            List<Employee> employees = dao.findAll(); // call MODEL

            req.setAttribute("employees", employees);        // pass to VIEW
            req.setAttribute("count", employees.size());

            req.getRequestDispatcher("/WEB-INF/views/employees.jsp")
               .forward(req, res);                           // forward to VIEW

        } catch (Exception e) {
            throw new ServletException("Failed to load employees", e);
        }
    }

    // Create: POST /employees → save and redirect
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");

        String name = req.getParameter("name");
        String dept = req.getParameter("department");
        double sal  = Double.parseDouble(req.getParameter("salary"));

        try {
            dao.insert(new Employee(0, name, dept, sal)); // call MODEL
            res.sendRedirect(req.getContextPath() + "/employees"); // PRG: redirect
        } catch (Exception e) {
            throw new ServletException("Failed to insert employee", e);
        }
    }
}

/* ===== VIEW LAYER — WEB-INF/views/employees.jsp =====
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head><title>Employees</title></head>
<body>
  <h2>Employees (\${count})</h2>
  <table border="1">
    <tr><th>ID</th><th>Name</th><th>Department</th><th>Salary</th></tr>
    <c:forEach var="e" items="\${employees}">
      <tr>
        <td>\${e.id}</td>
        <td><c:out value="\${e.name}"/></td>
        <td><c:out value="\${e.department}"/></td>
        <td>\${e.salary}</td>
      </tr>
    </c:forEach>
  </table>
</body>
</html>
*/`,
  codeTitle: 'MVC with Servlet + JSP — Model (DAO), Controller (Servlet), View (JSP)',
  points: [
    'MVC separates a web app into three layers: Model (data/logic), View (presentation), Controller (HTTP handling)',
    'In Servlet + JSP: the Servlet is the Controller, the JSP is the View, and DAO/Bean classes form the Model',
    'The Controller reads request parameters, calls the Model, sets attributes on the request, then forwards to the View',
    'The Model (DAO/Service) knows nothing about HTTP — it works with plain Java objects and can be tested independently',
    'The View (JSP) knows nothing about where data came from — it only reads request attributes via EL expressions',
    'MVC enables team collaboration: backend devs own Servlets and DAOs; frontend devs own JSPs',
    'Every major Java web framework (Spring MVC, Struts, JSF) implements MVC — learning it here makes frameworks intuitive',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "The most common MVC violation: putting database code (JDBC calls, SQL) directly inside a JSP using scriptlets. This merges the Model and View, making the JSP impossible to test and the SQL impossible to find when it breaks. All database access belongs in DAO classes called from the Servlet (Controller), not in JSP files.",
    },
    {
      type: 'interview',
      content: "Q: Explain the MVC pattern and how it is implemented with Servlet and JSP.\nA: MVC stands for Model-View-Controller. In a Servlet + JSP app: the Servlet acts as Controller — it receives the HTTP request, validates input, calls the Model (DAO/Service), puts results in request attributes, and forwards to the JSP. The JSP is the View — it reads request attributes using EL and renders HTML. The Model (POJOs + DAO) handles data and business logic with no HTTP awareness. This separation makes each layer independently testable and maintainable.",
    },
    {
      type: 'tip',
      content: "Organize your packages by MVC layer from the start: com.example.controller (Servlets), com.example.model (POJOs, DAOs), com.example.service (business logic), com.example.util (DBUtil, helpers). This naming makes the layer of any class immediately obvious and reinforces the MVC boundaries throughout the codebase.",
    },
  ],
}
