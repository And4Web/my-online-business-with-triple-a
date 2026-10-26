export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      
<nav className="mx-auto flex max-w-6xl items-center justify-between gap-4">
  <a href="/" className="shrink-0 text-3xl font-extrabold tracking-tight">
    Nexora<span className="text-blue-400">.</span>
  </a>

  <div className="hidden items-center gap-8 text-base text-slate-200 md:flex">
    <a href="/" className="transition hover:text-blue-400">
      Home
    </a>
    <a href="#projects" className="transition hover:text-blue-400">
      Projects
    </a>
    <a href="#about" className="transition hover:text-blue-400">
      About
    </a>
  </div>

  <a
    href="#projects"
    className="shrink-0 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:border-blue-400 hover:bg-slate-900"
  >
    Explore Projects <span aria-hidden="true">→</span>
  </a>
</nav>


      {/* Hero Section starts*/}
    
<section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-24 text-center sm:py-32">
  <div
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl"
  />

  <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-300">
    <span className="h-2 w-2 rounded-full bg-blue-400" />
    Ready-made projects for developers
  </div>

  <h2 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
    Build faster.
    <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
      Launch smarter.
    </span>
  </h2>

  <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
    Discover ready-made full-stack source code, learn from real projects,
    and bring your next big idea to life without starting from scratch.
  </p>

  <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
    <a
      href="#projects"
      className="rounded-xl bg-blue-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
    >
      Explore Projects →
    </a>

    <a
      href="#about"
      className="rounded-xl border border-slate-700 px-8 py-4 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
    >
      Learn More
    </a>
  </div>

  <p className="mt-6 text-sm text-slate-500">
    Practical code · Clear documentation · Developer-focused
  </p>
</section>

      {/* Hero Section ends*/}

      

      {/* Product cards starts*/}

    
<section id="projects" className="mx-auto max-w-6xl px-4 pb-24">
  <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        The marketplace
      </p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
        Featured Projects
      </h2>
      <p className="mt-3 text-slate-400">
        Production-focused starting points for your next idea.
      </p>
    </div>

    <p className="text-sm text-slate-500">3 sample projects</p>
  </div>

  <div className="grid gap-6 md:grid-cols-3">
    <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-blue-500/50">
      <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
        E-commerce
      </span>
      <h3 className="mt-5 text-xl font-bold">E-commerce Platform</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
        Build an online store with product listings, shopping cart, and checkout foundations.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">Next.js</span>
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">MongoDB</span>
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">TypeScript</span>
      </div>
      <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-5">
        <p className="text-2xl font-bold">$39</p>
        <a href="#contact" className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-400">
          View Project →
        </a>
      </div>
    </article>

    <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-purple-500/50">
      <span className="inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
        Communication
      </span>
      <h3 className="mt-5 text-xl font-bold">Real-Time Chat App</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
        A messaging starter designed around live conversations and chat rooms.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">React</span>
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">Socket.IO</span>
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">Node.js</span>
      </div>
      <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-5">
        <p className="text-2xl font-bold">$29</p>
        <a href="#contact" className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-400">
          View Project →
        </a>
      </div>
    </article>

    <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-cyan-500/50">
      <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
        Productivity
      </span>
      <h3 className="mt-5 text-xl font-bold">Admin Dashboard</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
        A dashboard starter for organizing data, metrics, and management workflows.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">Next.js</span>
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">TypeScript</span>
        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">Tailwind</span>
      </div>
      <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-5">
        <p className="text-2xl font-bold">$19</p>
        <a href="#contact" className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-400">
          View Project →
        </a>
      </div>
    </article>
  </div>
</section>


      {/* Product cards ends*/}

      {/* About section starts*/}

    
<section id="about" className="mx-auto max-w-6xl px-4 py-20">
  <div className="rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center sm:px-12">
    <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
      About Nexora
    </p>

    <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
      Your next idea starts here.
    </h2>

    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
      Nexora helps developers and entrepreneurs save time with
      affordable, ready-made source-code projects. Explore practical
      starting points, learn from real code, and build something great.
    </p>

    <a
      href="#projects"
      className="mt-8 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
    >
      Explore Our Projects →
    </a>
  </div>
</section>


      {/* About section ends */}


    {/* Footer section starts */}

    
<footer className="border-t border-slate-800 bg-slate-950">
  <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <a href="/" className="text-2xl font-extrabold tracking-tight">
        Nexora<span className="text-blue-400">.</span>
      </a>
      <p className="mt-2 text-sm text-slate-400">
        Ready-made code. Bigger possibilities.
      </p>
    </div>

    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
      <a href="#projects" className="transition hover:text-blue-400">
        Projects
      </a>
      <a href="#about" className="transition hover:text-blue-400">
        About
      </a>
      <a href="mailto:hello@nexora.dev" className="transition hover:text-blue-400">
        Contact
      </a>
    </div>

    <p className="text-sm text-slate-500">
      © 2026 Nexora. All rights reserved.
    </p>
  </div>
</footer>


    {/* Footer section ends */}

      
    </main>
  );
}
