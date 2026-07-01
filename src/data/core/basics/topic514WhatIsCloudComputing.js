export default {
  id: 'what-is-cloud-computing',
  title: '514. What Is Cloud Computing?',
  explanation: `The Docker chapter packaged the Job app into a portable container image (see [[docker-volumes]]) — this chapter, AWS, is about where that image actually *runs* in production. Before any specific AWS service, this topic defines **cloud computing** itself: what problem it solves relative to running a server yourself.

**The traditional alternative cloud computing replaces: buying and running physical servers.** Before cloud computing was widespread, deploying the Job app for real users meant buying (or renting rack space for) a physical machine, installing an OS, configuring networking, and being personally responsible for hardware failures, power, and physical security — a large upfront cost and ongoing operational burden, for capacity that has to be sized in advance and is expensive to change quickly.

**What cloud computing actually is: renting computing resources (compute, storage, networking, databases) from a provider, on demand, over the internet — instead of owning physical hardware.** A cloud provider (AWS, Azure, Google Cloud) owns and maintains enormous data centers full of physical machines; a customer rents a slice of that capacity, paying only for what's actually used, without ever touching a physical server.

**The three properties that define cloud computing's advantage over the old model, precisely:**
- **On-demand** — capacity can be provisioned in minutes, not the weeks it takes to purchase and install physical hardware
- **Elastic** — capacity can scale up during a traffic spike and back down afterward, paying only for what's actually used at any given moment
- **Pay-as-you-go** — no large upfront capital purchase; cost tracks actual usage instead

**Why this matters specifically for the Job app, concretely, connecting straight back to the Docker chapter.** A Docker image is portable *in principle* — the whole point of containerization (see [[solution-with-containerization]]) is that it runs identically anywhere. Cloud computing is what actually provides the "anywhere" at production scale: a place to run that container reliably, reachable by real users, without buying and maintaining physical servers to do it. This chapter builds toward exactly that — deploying the containerized Job app to AWS.`,
  code: `# The traditional alternative to cloud computing:
# Buy a physical server -> install OS -> configure networking
# -> maintain hardware yourself -> capacity fixed until you buy more hardware

# Cloud computing:
# Rent exactly the capacity needed, right now, from AWS
# -> scale up during traffic spikes, scale down afterward
# -> pay only for what is actually used
# -> no physical hardware to buy, rack, or maintain`,
  codeTitle: 'The traditional server model vs. cloud computing, side by side',
  points: [
    'Before cloud computing, deploying an application meant buying or renting physical hardware, with capacity fixed in advance and expensive to change quickly.',
    'Cloud computing means renting compute, storage, networking, and database resources from a provider like AWS, on demand, over the internet.',
    'The three defining properties are on-demand provisioning (minutes, not weeks), elasticity (scale up and down as needed), and pay-as-you-go pricing (cost tracks actual usage).',
    'A cloud provider owns and maintains the physical data centers; customers rent capacity without ever touching physical hardware themselves.',
    'Cloud computing is what makes a portable Docker image (built in the previous chapter) actually reachable by real users at production scale, without buying physical servers to run it on.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming cloud computing is simply hardware ownership handed off to someone else undersells the actual shift - the defining value is elasticity and on-demand provisioning, not just outsourcing hardware ownership; a traditional rented server that still has to be manually resized weeks in advance does not capture what makes cloud computing different.' },
    { type: 'interview', content: 'Q: What are the three defining properties of cloud computing that distinguish it from traditionally buying and running physical servers?\nA: On-demand provisioning (capacity available in minutes rather than the weeks needed to buy and install hardware), elasticity (capacity can scale up during demand spikes and back down afterward), and pay-as-you-go pricing (cost tracks actual usage rather than a large upfront capital purchase). Together these remove the need to size hardware capacity in advance and own physical infrastructure.' },
  ],
}
