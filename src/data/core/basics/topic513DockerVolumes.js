export default {
  id: 'docker-volumes',
  title: '513. Docker Volumes',
  explanation: `Every PostgreSQL container run so far in this chapter (see [[web-app-with-postgresql]], [[docker-compose-topic]]) has a problem that hasn't been addressed yet: what happens to the actual job data when the container stops or is removed? This topic covers **volumes**, the mechanism that answers that question correctly.

**Confirming the problem first, concretely.** Running \`docker rm job-db\` after adding jobs through the Job app deletes the container — and every row that was ever inserted into PostgreSQL along with it. This is because, by default, a container's filesystem is **ephemeral**: written entirely inside the container's own writable layer, which exists only as long as the container itself does. Stopping and restarting the *same* container preserves that layer; removing the container and creating a new one from the same image does not.

**Why this is expected, not a bug — connecting back to the image/container relationship established earlier (see [[what-is-docker]]).** An image is meant to be a fixed, reusable template; a container is a disposable, replaceable instance of it. If a container's own writable layer were the source of truth for something as important as a production database, that data would be exactly one \`docker rm\` away from permanent loss — which is precisely why Docker doesn't design containers to be the durable storage layer by default.

**Volumes — Docker-managed storage that lives outside any single container's lifecycle:**
\`\`\`bash
docker volume create job-db-data

docker run -d --name job-db \\
  -v job-db-data:/var/lib/postgresql/data \\
  -e POSTGRES_DB=jobapp -e POSTGRES_PASSWORD=postgres \\
  postgres:16
\`\`\`
\`-v job-db-data:/var/lib/postgresql/data\` mounts the named volume \`job-db-data\` at the exact path PostgreSQL writes its data files to inside the container. Now \`docker rm job-db\`, followed by starting a brand-new PostgreSQL container with that *same* \`-v job-db-data:...\` mount, sees the exact same data — the volume, not the container, is where the data actually persisted.

**The same pattern in \`docker-compose.yml\`, matching the two-line change most Compose files actually need:**
\`\`\`yaml
services:
  db:
    image: postgres:16
    volumes:
      - job-db-data:/var/lib/postgresql/data
volumes:
  job-db-data:
\`\`\`

**Volumes vs. bind mounts — the other, related storage option worth distinguishing.** A **bind mount** (\`-v /host/path:/container/path\`) maps a specific host directory directly, useful for live-editing source code during local development; a **named volume** (\`-v job-db-data:...\`) is managed entirely by Docker itself, with no dependency on a specific host filesystem path — the correct default for anything that needs to persist and be portable across machines, like a real database's data.`,
  code: `# Named volume - Docker-managed, portable, correct for database data
docker volume create job-db-data
docker run -d --name job-db -v job-db-data:/var/lib/postgresql/data \\
  -e POSTGRES_DB=jobapp -e POSTGRES_PASSWORD=postgres postgres:16

# docker rm job-db, then start a fresh container with the SAME volume:
docker run -d --name job-db -v job-db-data:/var/lib/postgresql/data \\
  -e POSTGRES_DB=jobapp -e POSTGRES_PASSWORD=postgres postgres:16
# -> all previous data is still there

# In docker-compose.yml:
# services:
#   db:
#     image: postgres:16
#     volumes:
#       - job-db-data:/var/lib/postgresql/data
# volumes:
#   job-db-data:`,
  codeTitle: 'A named volume surviving container removal - the correct pattern for database data',
  points: [
    'The own filesystem of a container is ephemeral by default - data written inside it is lost the moment the container is removed (docker rm), not just stopped.',
    'This is expected behavior, not a bug: images are meant to be fixed templates and containers disposable instances, so durable data should never depend on the lifecycle of one specific container surviving.',
    'A named volume, created with docker volume create and mounted with -v <volume>:<container-path>, persists independently of any single container and survives docker rm.',
    'Removing a container and starting a fresh one with the same named volume mount restores the exact same data, since the volume - not the container - was where the data actually lived.',
    'A bind mount maps a specific host directory (useful for live-editing source locally); a named volume is Docker-managed and portable across machines - the correct default for something like production database data.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Running a database container without any -v volume mount at all works perfectly during testing, right up until the container is removed or recreated (a routine part of upgrading an image version, for example) - at which point every row of data is permanently gone, since nothing outside the disposable container layer was ever preserving it.' },
    { type: 'interview', content: 'Q: Why does running docker rm job-db delete all data stored in that PostgreSQL container, and how does a named volume prevent that?\nA: By default, a container writes to its own ephemeral writable layer, which exists only as long as that specific container does - removing the container discards that layer and everything written to it. Mounting a named volume (docker volume create plus -v volume-name:/path/inside/container) redirects that specific path to Docker-managed storage that exists independently of any one container, so removing and recreating the container with the same volume mount preserves all the data that was actually written to the volume.' },
  ],
}
