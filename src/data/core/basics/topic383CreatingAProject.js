export default {
  id: 'job-app-creating-project',
  title: '383. Creating a Project',
  explanation: `The Job Application tracker (see [[building-job-app]]) can reuse the exact project shape from [[creating-spring-mvc-project-part1]] — a Maven project with \`packaging=war\`, the \`spring-webmvc\` dependency, and a \`provided\`-scope Servlet API — with the same \`web.xml\` and \`dispatcher-servlet.xml\` from [[configuring-dispatcherservlet]] and [[internal-resource-view-resolver]].

**What changes for this specific project — the package and component scan:**
\`\`\`xml
<!-- dispatcher-servlet.xml -->
<context:component-scan base-package="com.example.jobapp" />
<mvc:annotation-driven />

<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/" />
    <property name="suffix" value=".jsp" />
</bean>
\`\`\`

The \`base-package\` must match wherever \`Job\`, \`JobService\`, and the controllers actually live (\`com.example.jobapp\` here) — component scanning only looks inside the packages it is told about; a class one package outside the scanned tree is simply never picked up, with no error, no warning, just a bean that silently never gets created.

**Adding the JSTL dependency:** \`home.jsp\` will need to loop over the job list with \`<c:forEach>\` (JSTL, see [[jsp-tags-web-app]]), which requires the JSTL library on the classpath:
\`\`\`xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
\`\`\`

With the project, component scan, and JSTL dependency in place, the rest is: write \`Job\`, \`JobService\`, and the two controllers inside the scanned package, and the two JSPs under \`WEB-INF/views\`.`,
  code: `<!-- pom.xml additions specific to the Job app -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>

<!-- dispatcher-servlet.xml -->
<context:component-scan base-package="com.example.jobapp" />`,
  codeTitle: 'Project-specific additions: component scan + JSTL',
  points: [
    'This project reuses the exact WAR/Maven/Spring MVC setup from the earlier manual-configuration topics.',
    'The base-package in component-scan must exactly match where Job, JobService, and the controllers live.',
    'A class outside the scanned package tree is simply never registered as a bean - silently, with no error.',
    'The JSTL dependency is needed because home.jsp will use <c:forEach> to iterate the job list.',
    'Once the project and component scan are in place, the remaining work is writing the model, service, controllers, and views.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A too-narrow base-package (e.g. scanning only "com.example.jobapp.controller" instead of "com.example.jobapp") silently leaves JobService un-registered, and @Autowired JobService in a controller fails at startup with "No qualifying bean of type JobService found."' },
    { type: 'interview', content: 'Q: What happens if a @Service class lives outside the package passed to <context:component-scan base-package="...">?\nA: Nothing happens - and that is the problem. Component scanning silently skips it; no bean is registered, and any @Autowired dependency on it fails at startup with a NoSuchBeanDefinitionException, since Spring never found the class to begin with.' },
  ],
}
