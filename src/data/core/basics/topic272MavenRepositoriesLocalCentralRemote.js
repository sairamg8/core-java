export default {
  id: 'maven-repositories',
  title: '272. Maven Repositories (Local, Central, Remote)',
  explanation: `A **repository** is where Maven stores and retrieves artifacts (JARs). There are three types, searched in a specific order.

**1. Local Repository (\`~/.m2/repository\`):**
A folder on your machine that caches every artifact Maven has ever downloaded. Maven checks here FIRST. If the artifact is present, no download happens.
- Location: \`~/.m2/repository\` (Linux/Mac) or \`C:\\Users\\you\\.m2\\repository\` (Windows)
- Organized by GAV: \`~/.m2/repository/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar\`

**2. Central Repository:**
Maven's public, default remote repository at \`repo.maven.apache.org\`. It hosts millions of open-source artifacts. If an artifact is not in your local repo, Maven downloads it from Central and caches it locally.

**3. Remote Repositories:**
Any other repository you configure — typically a company's private repository (Nexus, Artifactory) hosting internal libraries or proxying Central. Configured in \`pom.xml\` or \`settings.xml\`.

**Resolution order (where Maven looks):**
\`\`\`
1. Local repository (~/.m2)        — already downloaded?
2. Remote repositories (if configured) — company Nexus/Artifactory
3. Central repository               — Maven's public server
\`\`\`
Once downloaded from anywhere, the artifact is cached in the local repo so it is never downloaded twice.

**Configuring a remote repository (pom.xml):**
\`\`\`xml
<repositories>
  <repository>
    <id>company-nexus</id>
    <url>https://nexus.mycompany.com/repository/maven-public/</url>
  </repository>
</repositories>
\`\`\`

**settings.xml — machine-wide configuration:**
\`~/.m2/settings.xml\` holds credentials, mirrors, and proxy settings that apply to all projects. Use a \`<mirror>\` to route ALL requests through a company proxy repo:
\`\`\`xml
<mirror>
  <id>nexus</id>
  <mirrorOf>*</mirrorOf>
  <url>https://nexus.mycompany.com/repository/maven-public/</url>
</mirror>
\`\`\`

**Clearing/refreshing the local cache:**
\`mvn -U\` forces Maven to re-check remote repos for updated SNAPSHOTs. Deleting a folder under \`~/.m2\` forces a fresh download of that artifact.`,
  code: `# ===== Maven Repositories — local, central, remote =====

# --- LOCAL REPOSITORY: ~/.m2/repository ---
# Every downloaded artifact is cached here, organized by GAV path.
ls ~/.m2/repository/com/google/code/gson/gson/2.10.1/
# gson-2.10.1.jar  gson-2.10.1.pom  ...

# Path pattern mirrors the GAV:
#   groupId 'com.google.code.gson' -> com/google/code/gson
#   artifactId 'gson'              -> /gson
#   version '2.10.1'               -> /2.10.1
#   => ~/.m2/repository/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar


# --- CENTRAL REPOSITORY (default, no config needed) ---
# When an artifact is missing locally, Maven downloads from:
#   https://repo.maven.apache.org/maven2/
# Then caches it in ~/.m2. First build of a project downloads a lot.


# --- Force re-check of remote repositories (update SNAPSHOTs) ---
mvn -U clean package      # -U = update snapshots, re-check remote

# --- Offline mode: use ONLY the local repository (no network) ---
mvn -o clean package      # -o = offline


# ===== settings.xml — ~/.m2/settings.xml (machine-wide config) =====
# <settings>
#   <!-- Route ALL artifact requests through a company proxy repo -->
#   <mirrors>
#     <mirror>
#       <id>company-nexus</id>
#       <mirrorOf>*</mirrorOf>
#       <url>https://nexus.mycompany.com/repository/maven-public/</url>
#     </mirror>
#   </mirrors>
#
#   <!-- Credentials for a private/authenticated repository -->
#   <servers>
#     <server>
#       <id>company-nexus</id>
#       <username>build-user</username>
#       <password>secret-token</password>
#     </server>
#   </servers>
# </settings>


# ===== pom.xml — declare an extra remote repository =====
# <repositories>
#   <repository>
#     <id>company-nexus</id>
#     <url>https://nexus.mycompany.com/repository/maven-public/</url>
#   </repository>
# </repositories>`,
  codeTitle: 'Maven Repository Types and Resolution Order',
  points: [
    'Three repository types: local (~/.m2, your cache), central (Maven\'s public server), and remote (company Nexus/Artifactory)',
    'Maven checks the local repository first; only if the artifact is missing does it download from remote/central',
    'The local repo organizes artifacts by GAV path: groupId/artifactId/version/artifactId-version.jar',
    'Central is the default public repository (repo.maven.apache.org) — no configuration needed to use it',
    'Remote repositories are configured in pom.xml <repositories> or settings.xml for private/company artifacts',
    'A <mirror> with mirrorOf=* in settings.xml routes ALL requests through one repository (common with corporate proxies)',
    'mvn -U forces re-checking remote repos for SNAPSHOT updates; mvn -o runs offline using only the local cache',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "A corrupted or partial download in the local repository (~/.m2) causes errors like 'Could not resolve dependency' even though the artifact exists. This happens when a download is interrupted. The fix is to delete that artifact's folder under ~/.m2/repository and rebuild — Maven re-downloads a clean copy. Sometimes you'll see a .lastUpdated file marking a failed attempt; deleting it forces a retry.",
    },
    {
      type: 'interview',
      content: "Q: In what order does Maven resolve dependencies across repositories?\nA: Maven first checks the local repository (~/.m2/repository). If the artifact is there, it uses it with no network access. If not, it queries the configured remote repositories (such as a company Nexus) and the central repository. Once downloaded from any remote source, the artifact is cached in the local repository so future builds reuse it without downloading again.",
    },
    {
      type: 'tip',
      content: "In a company environment, configure a single mirror in settings.xml pointing to an internal Nexus or Artifactory that proxies Maven Central. This caches all external dependencies inside the company network (faster, resilient to Central outages), and lets the company host private artifacts in the same place. A mirrorOf=* entry transparently redirects every request through it.",
    },
  ],
}
