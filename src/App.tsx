import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, LINKEDIN, REPO, templates, type Status, type Template } from './data'
import { highlight } from './highlight'

type Sort = 'order' | 'name' | 'category'
let savedScroll = 0

function useHash() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const on = () => setHash(location.hash)
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return hash
}

function useTheme() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme ?? 'dark')
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch { /* storage unavailable */ }
    setTheme(next)
  }
  return [theme, toggle] as const
}

function Badge({ status }: { status: Status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>
}

function Navbar({ theme, toggle }: { theme: string; toggle: () => void }) {
  const [open, setOpen] = useState(false)
  const links = [['Templates', '#templates'], ['Categories', '#categories'], ['Usage', '#usage'], ['About', '#about']]
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#" onClick={() => setOpen(false)}><span className="mark">V</span>Verilog Templates</a>
        <nav className={open ? 'links open' : 'links'} aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a className="btn small" href={REPO} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn small" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
        <button className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button className="icon-btn menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero wrap">
      <h1>Verilog Templates</h1>
      <p className="lead">
        48 reusable Verilog &amp; SystemVerilog RTL templates for digital design, verification and FPGA development.
      </p>
      <p className="muted">Reviewed, corrected and verified with simulation and lint.</p>
      <div className="row">
        <a className="btn primary" href="#templates">Browse Templates</a>
        <a className="btn" href={REPO} target="_blank" rel="noreferrer">GitHub</a>
        <a className="btn" href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </section>
  )
}

interface Filters { q: string; cat: string; lang: string; sort: Sort }

function Explorer({ f, setF, open }: { f: Filters; setF: (f: Filters) => void; open: (t: Template) => void }) {
  const search = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        search.current?.focus()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const shown = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    const list = templates.filter(t =>
      (!f.cat || t.category === f.cat) &&
      (!f.lang || t.language === f.lang) &&
      (!q || `${t.filename} ${t.category} ${t.description} ${t.notes}`.toLowerCase().includes(q)))
    if (f.sort === 'name') list.sort((a, b) => a.filename.localeCompare(b.filename))
    if (f.sort === 'category') list.sort((a, b) => categories.indexOf(a.category) - categories.indexOf(b.category))
    return list
  }, [f])

  const set = (patch: Partial<Filters>) => setF({ ...f, ...patch })
  const count = (c: string) => templates.filter(t => t.category === c).length

  return (
    <section id="templates" className="wrap section">
      <div className="filters">
        <div className="filter-row">
          <input ref={search} type="search" placeholder="Search templates   ( / )" value={f.q}
            onChange={e => set({ q: e.target.value })} aria-label="Search templates" />
          <select value={f.lang} onChange={e => set({ lang: e.target.value })} aria-label="Language">
            <option value="">Verilog + SystemVerilog</option>
            <option>Verilog</option>
            <option>SystemVerilog</option>
          </select>
          <select value={f.sort} onChange={e => set({ sort: e.target.value as Sort })} aria-label="Sort">
            <option value="order">Sort: library order</option>
            <option value="name">Sort: filename</option>
            <option value="category">Sort: category</option>
          </select>
        </div>
        <div id="categories" className="chips" role="group" aria-label="Categories">
          <button className={!f.cat ? 'chip on' : 'chip'} onClick={() => set({ cat: '' })}>All <i>{templates.length}</i></button>
          {categories.map(c => (
            <button key={c} className={f.cat === c ? 'chip on' : 'chip'} aria-pressed={f.cat === c}
              onClick={() => set({ cat: f.cat === c ? '' : c })}>{c} <i>{count(c)}</i></button>
          ))}
        </div>
      </div>

      <p className="muted result-count" aria-live="polite">{shown.length} of {templates.length} templates</p>

      {shown.length === 0 ? (
        <div className="empty">
          <p>No templates match these filters.</p>
          <button className="btn" onClick={() => setF({ q: '', cat: '', lang: '', sort: f.sort })}>Clear filters</button>
        </div>
      ) : (
        <ul className="grid">
          {shown.map(t => (
            <li key={t.filename}>
              <a className="card" href={`#/t/${t.filename}`} onClick={() => open(t)}>
                <code className="fname">{t.filename}</code>
                <span className="meta">{t.category}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Detail({ t, back }: { t: Template; back: () => void }) {
  const [copied, setCopied] = useState<'' | 'ok' | 'fail'>('')
  const lines = t.code.replace(/\n$/, '').split('\n').length
  const html = useMemo(() => highlight(t.code), [t.code])

  useEffect(() => {
    scrollTo(0, 0)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') back() }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [t, back])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(t.code)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    setTimeout(() => setCopied(''), 1800)
  }

  return (
    <main className="wrap detail">
      <a className="back" href="#templates" onClick={e => { e.preventDefault(); back() }}>← Back to templates</a>
      <div className="detail-head">
        <h1>{t.name}</h1>
        <Badge status={t.status} />
      </div>
      <p className="meta">{t.category} · {t.language} · <code>{t.filename}</code></p>
      <h2 className="sub">Review note</h2>
      <p className="note">{t.notes}</p>

      <div className="code-box">
        <div className="code-bar">
          <code>{t.filename}</code>
          <span className="muted">{lines} lines</span>
          <button className="btn small" onClick={copy}>
            {copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Copy failed' : 'Copy Code'}
          </button>
        </div>
        <div className="code-scroll" tabIndex={0} aria-label={`Source of ${t.filename}`}>
          <pre className="gutter" aria-hidden="true">{Array.from({ length: lines }, (_, i) => i + 1).join('\n')}</pre>
          <pre className="code"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
        </div>
      </div>
      <span className="sr" role="status">{copied === 'ok' ? 'Code copied to clipboard' : ''}</span>
    </main>
  )
}

function Usage() {
  return (
    <section id="usage" className="wrap section">
      <h2>What this library is for</h2>
      <p className="muted narrow">
        Most digital designs are built from the same small set of blocks. This library keeps them in one place so you
        can copy a working version instead of rewriting it each time.
      </p>
      <div className="three">
        <div>
          <h3>What you get</h3>
          <p>
            48 Verilog and SystemVerilog modules in 10 categories: combinational logic, arithmetic, sequential
            elements, FSMs, memories, FIFOs, UART, clock-domain crossing, SystemVerilog constructs and testbench helpers.
          </p>
        </div>
        <div>
          <h3>How to use it</h3>
          <ol className="plain">
            <li>Search by name or pick a category.</li>
            <li>Open a template and read the header comments for parameters and limits.</li>
            <li>Copy the code into your project, keeping the filename.</li>
            <li>Instantiate it with your own parameters. A few templates depend on others, for example <code>ripple_carry_adder</code> uses <code>full_adder</code>.</li>
            <li>Simulate it in your own tool flow.</li>
          </ol>
        </div>
        <div>
          <h3>Why it is useful</h3>
          <p>
            It saves time on standard blocks, gives students a reference for how common structures are written, and
            speeds up FPGA prototyping and lab work. The testbench templates show a self-checking style you can reuse
            for your own modules.
          </p>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="wrap section">
      <h2>About</h2>
      <p className="narrow">This library collects reusable RTL building blocks for learning, prototyping and digital design work.</p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <strong>Verilog Templates</strong>
        <nav aria-label="Footer">
          <a href={REPO} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="#categories">Categories</a>
        </nav>
        <span className="muted">Built for RTL / FPGA / VLSI development · Made by Rohan</span>
      </div>
    </footer>
  )
}

export default function App() {
  const hash = useHash()
  const [theme, toggle] = useTheme()
  const [f, setF] = useState<Filters>({ q: '', cat: '', lang: '', sort: 'order' })

  const current = hash.startsWith('#/t/') ? templates.find(t => t.filename === decodeURIComponent(hash.slice(4))) : undefined
  const open = () => { savedScroll = scrollY }
  const back = () => {
    location.hash = 'templates'
  }

  useEffect(() => {
    document.title = current ? `${current.filename} · Verilog Templates` : 'Verilog Templates'
    if (!current && savedScroll) {
      scrollTo({ top: savedScroll, behavior: 'instant' })
      savedScroll = 0
    }
  }, [current])

  return (
    <>
      <Navbar theme={theme} toggle={toggle} />
      {current ? <Detail t={current} back={back} /> : (
        <main>
          <Hero />
          <Explorer f={f} setF={setF} open={open} />
          <Usage />
          <About />
        </main>
      )}
      <Footer />
    </>
  )
}
