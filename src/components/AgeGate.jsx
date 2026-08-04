import React, { useState } from 'react';
import { font } from '@/lib/tokens';

const LABEL = font.body;
const SERIF = font.display;

const STORAGE_KEY = 'cf_age_check_v1';
const MIN_AGE = 13;

export function getAgeCheck() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAgeEligible() {
  const rec = getAgeCheck();
  return !!rec && rec.eligible === true;
}

function ageFromBirthYear(year) {
  return new Date().getFullYear() - year;
}

export default function AgeGate({ onPass }) {
  const [year, setYear] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const y = Number(year);
    const thisYear = new Date().getFullYear();
    if (!Number.isInteger(y) || y < 1900 || y > thisYear) {
      setError('Enter the year you were born, for example 2009.');
      return;
    }
    const eligible = ageFromBirthYear(y) >= MIN_AGE;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ eligible, at: Date.now() }));
    } catch { /* private browsing */ }
    if (eligible) onPass();
    else setBlocked(true);
  };

  if (blocked) {
    return (
      <div className="max-w-md w-full">
        <h1 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 700, color: '#ECF3EF', margin: '0 0 12px' }}>
          Compilearn is for ages {MIN_AGE} and up
        </h1>
        <p className="font-display text-sm" style={{ color: '#FFFFFF', lineHeight: 1.7 }}>
          We are not able to create an account for you right now, and we have not saved anything you entered.
          Ask a parent, guardian, or teacher to get in touch at{' '}
          <a href="mailto:jason.huang317235@gmail.com" style={{ color: '#5ED29C' }}>jason.huang317235@gmail.com</a>{' '}
          if you would like to use Compilearn in a classroom.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md w-full">
      <h1 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 700, color: '#ECF3EF', margin: '0 0 8px' }}>
        Before you start
      </h1>
      <p className="font-display text-sm mb-6" style={{ color: '#FFFFFF', lineHeight: 1.7 }}>
        What year were you born? We ask once, we only keep whether you met the age minimum, and we never
        share it.
      </p>

      <label className="block mb-4">
        <span className="font-sans text-xs tracking-widest uppercase block mb-2" style={{ color: '#FFFFFF', fontFamily: LABEL }}>
          Year of birth
        </span>
        <input
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
          inputMode="numeric"
          autoComplete="bday-year"
          placeholder="2009"
          aria-describedby={error ? 'age-error' : undefined}
          className="w-full px-4 py-3 font-display text-base outline-none"
          style={{ background: '#070B0A', border: '1px solid #26302B', color: '#ECF3EF' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#5ED29C'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#26302B'; }}
        />
      </label>

      {error && (
        <p id="age-error" role="alert" className="font-display text-sm mb-4" style={{ color: '#F0A89C' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-3 font-sans text-sm"
        style={{ background: '#5ED29C', color: '#070B0A', border: 'none', fontFamily: LABEL, fontWeight: 650 }}
      >
        Continue
      </button>
    </form>
  );
}
