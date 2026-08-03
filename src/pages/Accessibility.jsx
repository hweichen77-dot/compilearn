import React from 'react'
import { font } from "@/lib/tokens";
import { Link } from 'react-router-dom'
import { createPageUrl } from '../utils'
import { Stagger, StaggerItem } from "@/lib/motion";

const LABEL = font.body
const SERIF = font.display

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 style={{ fontFamily: SERIF, fontSize: '1.35rem', fontWeight: 700, color: '#ECF3EF', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
        {title}
      </h2>
      <div className="font-display text-sm space-y-3" style={{ color: '#FFFFFF', lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  )
}

export default function Accessibility() {
  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-20" style={{ background: 'transparent' }}>
      <Stagger className="max-w-2xl mx-auto rounded-2xl px-6 sm:px-10 py-10 bg-[#0C1210]/88 backdrop-blur-sm" as="div">
        <StaggerItem as="div">
          <h1 style={{ fontFamily: SERIF, fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ECF3EF', margin: '0 0 8px', lineHeight: 1.08 }}>
            Accessibility
          </h1>
          <p className="font-sans text-xs mb-12" style={{ color: '#FFFFFF', fontFamily: LABEL }}>
            Last updated: August 2026
          </p>
        </StaggerItem>

        <StaggerItem as="div"><Section title="Where things stand">
          <p>
            Compilearn is built to work for people who navigate by keyboard, read with a screen
            reader, enlarge text, or turn animation off. We aim for WCAG 2.1 Level AA.
          </p>
          <p>
            Nobody outside the project has audited the site, and we have not sat down with JAWS,
            NVDA, or VoiceOver and worked through it. What follows describes what we built and
            checked in a browser. It is not a certified conformance claim.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="What is in place">
          <ul className="list-disc pl-5 space-y-1">
            <li>A skip link that appears on the first tab press and jumps to the main content.</li>
            <li>Header, navigation, main, and footer landmarks on every page.</li>
            <li>Visible focus outlines that follow the keyboard rather than the mouse.</li>
            <li>Animation and page transitions stop when your system asks for reduced motion.</li>
            <li>Text labels on icon-only controls, so a screen reader announces what they do.</li>
            <li>The code editor is a labeled text field, and running a program announces its result through a live region.</li>
            <li>Lessons are ordinary headings, paragraphs, lists, and tables, so they reflow at large text sizes and read in order.</li>
          </ul>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Known problems">
          <p>
            In the code editor, Tab inserts two spaces instead of moving to the next control,
            because that is what writing code needs. Press <strong>Escape</strong> to leave the
            editor, then Tab continues as usual. Nothing on screen tells you that yet, which is a
            problem we intend to fix.
          </p>
          <p>
            We checked color contrast by eye against the dark theme. We did not measure it in every
            state, so some hover and disabled styles may fall short of the 4.5 to 1 ratio.
          </p>
          <p>
            The competitive judge and the playground print results into panels that refill after a
            run. They read fine on their own, but we have never listened to a long run with a screen
            reader to hear what order it comes out in.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Tell us what breaks">
          <p>
            If something here blocks you, email{' '}
            <a href="mailto:jason.huang317235@gmail.com" style={{ color: '#5ED29C' }}>
              jason.huang317235@gmail.com
            </a>{' '}
            and say which page you were on and what you were using. Reports about a barrier get
            answered first, ahead of other work.
          </p>
          <p>
            Everything on Compilearn is free and needs no account to start, so nothing described
            here sits behind a paywall or a sign-up.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Related">
          <p>
            See our <Link to={createPageUrl('Privacy')} style={{ color: '#5ED29C' }}>Privacy Policy</Link>
            {' '}and <Link to={createPageUrl('Terms')} style={{ color: '#5ED29C' }}>Terms</Link>.
          </p>
        </Section></StaggerItem>
      </Stagger>
    </div>
  )
}
