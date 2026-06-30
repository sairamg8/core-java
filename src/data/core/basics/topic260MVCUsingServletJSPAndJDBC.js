export default {
  id: 'mvc-servlet-jsp-jdbc',
  title: '260. MVC Using Servlet, JSP and JDBC',
  explanation: `This is the complete MVC application combining all three layers with full CRUD operations: Servlet (Controller) + JSP (View) + JDBC (Model). It is the capstone of the Servlet & JSP chapter.

**Full application structure:**
\`\`\`
com.example.controller/
  EmployeeController.java   ← single Servlet handling all CRUD
com.example.model/
  Employee.java             ← Java Bean
  EmployeeDAO.java          ← JDBC data access
com.example.util/
  DBUtil.java               ← connection helper
WEB-INF/views/
  employee-list.jsp         ← view all employees
  employee-form.jsp         ← add/edit form
\`\`\`

**Action-based routing in one Servlet:**
A common pattern for simple apps is to use a single Servlet and route on an \`action\` parameter:
\`\`\`
GET  /employees             → list all
GET  /employees?action=new  → show add form
POST /employees?action=add  → insert row
GET  /employees?action=edit&id=5  → show edit form
POST /employees?action=update     → update row
GET  /employees?action=delete&id=5 → delete row
\`\`\`

**Full CRUD flow:**

| HTTP | URL | Action | JDBC |
|------|-----|--------|------|
| GET | /employees | List all | SELECT |
| GET | /employees?action=new | Show form | — |
| POST | /employees?action=add | Insert | INSERT |
| GET | /employees?action=edit&id=N | Show edit form | SELECT by id |
| POST | /employees?action=update | Update | UPDATE |
| GET | /employees?action=delete&id=N | Delete & redirect | DELETE |

**This pattern scales to frameworks:**
Spring MVC replaces the Servlet with @Controller and @RequestMapping. The JDBC DAO becomes a Spring Data Repository. The JSP becomes a Thymeleaf template. The concepts are identical — only the syntax differs.`,
  code: `// ===== MVC Full CRUD — Servlet + JSP + JDBC =====

// ===== Employee.java (Model / Bean) =====
package com.example.model;

public class Employee {
    private int id;
    private String name, department;
    private double salary;

    public Employee() {}
    public Employee(int id, String name, String dept, double salary) {
        this.id = id; this.name = name; this.department = dept; this.salary = salary;
    }

    public int    getId()         { return id; }
    public String getName()       { return name; }
    public String getDepartment() { return department; }
    public double getSalary()     { return salary; }
    public void setId(int id)              { this.id = id; }
    public void setName(String n)          { this.name = n; }
    public void setDepartment(String d)    { this.department = d; }
    public void setSalary(double s)        { this.salary = s; }
}

// ===== EmployeeDAO.java (Model / Data Access) =====
package com.example.model;

import java.sql.*;
import java.util.*;
import com.example.util.DBUtil;

public class EmployeeDAO {

    public List<Employee> findAll() throws SQLException {
        List<Employee> list = new ArrayList<>();
        try (Connection c = DBUtil.getConnection();
             Statement  s = c.createStatement();
             ResultSet  r = s.executeQuery("SELECT * FROM employees ORDER BY name")) {
            while (r.next()) list.add(map(r));
        }
        return list;
    }

    public Employee findById(int id) throws SQLException {
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM employees WHERE id = ?")) {
            ps.setInt(1, id);
            try (ResultSet r = ps.executeQuery()) {
                return r.next() ? map(r) : null;
            }
        }
    }

    public void insert(Employee e) throws SQLException {
        String sql = "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, e.getName()); ps.setString(2, e.getDepartment()); ps.setDouble(3, e.getSalary());
            ps.executeUpdate();
        }
    }

    public void update(Employee e) throws SQLException {
        String sql = "UPDATE employees SET name=?, department=?, salary=? WHERE id=?";
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, e.getName()); ps.setString(2, e.getDepartment());
            ps.setDouble(3, e.getSalary()); ps.setInt(4, e.getId());
            ps.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        try (Connection c = DBUtil.getConnection();
             PreparedStatement ps = c.prepareStatement("DELETE FROM employees WHERE id = ?")) {
            ps.setInt(1, id); ps.executeUpdate();
        }
    }

    private Employee map(ResultSet r) throws SQLException {
        return new Employee(r.getInt("id"), r.getString("name"),
                r.getString("department"), r.getDouble("salary"));
    }
}

// ===== EmployeeController.java (Controller / Servlet) =====
package com.example.controller;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import com.example.model.*;

@WebServlet("/employees")
public class EmployeeController extends HttpServlet {

    private final EmployeeDAO dao = new EmployeeDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        String action = req.getParameter("action");
        if (action == null) action = "list";

        try {
            switch (action) {
                case "new":
                    req.getRequestDispatcher("/WEB-INF/views/employee-form.jsp").forward(req, res);
                    break;
                case "edit":
                    int editId = Integer.parseInt(req.getParameter("id"));
                    req.setAttribute("employee", dao.findById(editId));
                    req.getRequestDispatcher("/WEB-INF/views/employee-form.jsp").forward(req, res);
                    break;
                case "delete":
                    dao.delete(Integer.parseInt(req.getParameter("id")));
                    res.sendRedirect(req.getContextPath() + "/employees");
                    break;
                default: // "list"
                    req.setAttribute("employees", dao.findAll());
                    req.getRequestDispatcher("/WEB-INF/views/employee-list.jsp").forward(req, res);
            }
        } catch (Exception e) { throw new ServletException(e); }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        String action = req.getParameter("action");

        Employee e = new Employee();
        e.setName(req.getParameter("name"));
        e.setDepartment(req.getParameter("department"));
        e.setSalary(Double.parseDouble(req.getParameter("salary")));

        try {
            if ("update".equals(action)) {
                e.setId(Integer.parseInt(req.getParameter("id")));
                dao.update(e);
            } else {
                dao.insert(e);
            }
        } catch (Exception ex) { throw new ServletException(ex); }

        res.sendRedirect(req.getContextPath() + "/employees"); // PRG
    }
}`,
  codeTitle: 'Full MVC CRUD App — Servlet Controller + DAO Model + JSP View',
  points: [
    'A single Servlet can handle all CRUD operations by routing on an action request parameter (list/new/add/edit/update/delete)',
    'The DAO contains all SQL and JDBC code — the Servlet calls DAO methods without knowing any SQL',
    'After POST operations (add, update, delete), always redirect with sendRedirect() to prevent double-submission on refresh (PRG)',
    'Pass model objects to the JSP via req.setAttribute() — the JSP reads them with EL (${employee.name}) using bean property getters',
    'The edit form pre-populates with the existing record fetched by findById() — set as request attribute before forwarding to the form JSP',
    'Keep all JDBC code in the DAO — if the database changes (MySQL to PostgreSQL), only the DAO needs updating',
    'This Servlet + JSP + JDBC MVC structure is exactly what Spring MVC automates — the concepts are identical',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Instantiating EmployeeDAO as an instance variable of the Servlet (private EmployeeDAO dao = new EmployeeDAO()) is fine only if DAO has no mutable instance state — which a well-written DAO should not have (it gets a fresh connection for each method call). If your DAO does store state, create a new DAO per request inside doGet/doPost instead.",
    },
    {
      type: 'interview',
      content: "Q: How would you implement full CRUD in a Servlet + JSP application?\nA: Use one Servlet mapped to /entity with an action parameter to route requests: GET without action shows the list (SELECT all), action=new shows the form, POST action=add inserts (INSERT), action=edit loads the record (SELECT by id) and shows the pre-filled form, POST action=update saves changes (UPDATE), action=delete removes the record (DELETE) and redirects. All SQL is in a DAO class; the JSP only renders model data set as request attributes.",
    },
    {
      type: 'tip',
      content: "This Servlet CRUD pattern is the foundation for Spring MVC. When you learn Spring, you will see that @GetMapping, @PostMapping, Model, and Thymeleaf/JSP templates are just a cleaner syntax for exactly this: a method per URL → calls service → sets model → returns view name. The mental model is identical — Spring removes the boilerplate.",
    },
  ],
}
