import {type ChangeEvent, type FormEvent, useMemo, useState} from 'react';

export type AppState =
  | 'splash'
  | 'wash-selection'
  | 'payment-selection'
  | 'payment'
  | 'waiting-screen'
  | 'payment-result'
  | 'wash-in-progress'
  | 'out-of-order'
  | 'reversal'
  | 'leave-number-discount'
  | 'phone-number-input'
  | 'busy';
import './App.css';

type BirthTime = {
  hour: number;
  minute: number;
};

type PartnerPayload = {
  name?: string;
  birth_date: string;
  birth_time?: BirthTime;
};

type CompatibilityResponse = {
  score: number;
  summary_en: string;
  summary_ka: string;
  highlights_en: string[];
  highlights_ka: string[];
};

type FormState = {
  aName: string;
  aDate: string;
  aHour: string;
  aMinute: string;
  bName: string;
  bDate: string;
  bHour: string;
  bMinute: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() || 'http://localhost:8000';

const initialState: FormState = {
  aName: '',
  aDate: '',
  aHour: '',
  aMinute: '',
  bName: '',
  bDate: '',
  bHour: '',
  bMinute: '',
};

const toOptionalTime = (hour: string, minute: string) => {
  if (!hour && !minute) return undefined;
  const parsedHour = Number(hour || 0);
  const parsedMinute = Number(minute || 0);
  return {hour: parsedHour, minute: parsedMinute};
};

const buildPayload = (form: FormState) => {
  const partnerA: PartnerPayload = {
    name: form.aName || undefined,
    birth_date: form.aDate,
    birth_time: toOptionalTime(form.aHour, form.aMinute),
  };
  const partnerB: PartnerPayload = {
    name: form.bName || undefined,
    birth_date: form.bDate,
    birth_time: toOptionalTime(form.bHour, form.bMinute),
  };
  return {partner_a: partnerA, partner_b: partnerB};
};

const localFallback = (form: FormState): CompatibilityResponse => {
  const toScore = (date: string, hour: string, minute: string) => {
    const digits = date.split('-').join('').split('');
    let total = digits.reduce((sum: number, digit: string) => sum + Number(digit), 0);
    total += Number(hour || 0) + Number(minute || 0);
    return total;
  };

  const score =
    (toScore(form.aDate, form.aHour, form.aMinute) * 3 +
      toScore(form.bDate, form.bHour, form.bMinute) * 5) %
    101;

  return {
    score,
    summary_en: `Estimated compatibility — score ${score}/100.`,
    summary_ka: `დაახლოებითი შესაბამისობა — ქულა ${score}/100.`,
    highlights_en: [
      'This is an offline estimate.',
      'Add birth time for a more precise profile.',
      'We will replace this with AI insights soon.',
    ],
    highlights_ka: [
      'ეს არის ოფლაინ შეფასება.',
      'დაბადების დრო მეტი სიზუსტისთვის დაამატეთ.',
      'მალე AI ანალიზით ჩაანაცვლებს.',
    ],
  };
};

export default function App() {
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<CompatibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ready = useMemo(() => form.aDate && form.bDate, [form.aDate, form.bDate]);

  const updateField =
    (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({...prev, [key]: event.target.value}));
    };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!ready) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/compatibility`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(buildPayload(form)),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: CompatibilityResponse = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        'We could not reach the compatibility API. Showing an offline estimate instead.'
      );
      setResult(localFallback(form));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Couples Compatibility</p>
          <h1>A thoughtful, beautiful read on how your energies align.</h1>
          <p className="subhead">
            Enter birth dates and optional birth time. We return insights in English and
            Georgian.
          </p>
        </div>
        <div className="badge-stack">
          <div className="badge">
            <span className="badge-title">Dual Language</span>
            <span className="badge-text">EN + KA results</span>
          </div>
          <div className="badge">
            <span className="badge-title">Private</span>
            <span className="badge-text">No data stored</span>
          </div>
        </div>
      </header>

      <main className="content">
        <form className="card form-card" onSubmit={submit}>
          <div className="card-header">
            <h2>Tell us about the couple</h2>
            <p>Birth dates are required. Time is optional but adds detail.</p>
          </div>

          <section className="partner-grid">
            <div className="partner-card">
              <h3>Partner A</h3>
              <label>
                Name (optional)
                <input
                  type="text"
                  placeholder="e.g. Ana"
                  value={form.aName}
                  onChange={updateField('aName')}
                />
              </label>
              <label>
                Birth date
                <input
                  type="date"
                  value={form.aDate}
                  onChange={updateField('aDate')}
                  required
                />
              </label>
              <div className="time-row">
                <label>
                  Hour
                  <input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="00"
                    value={form.aHour}
                    onChange={updateField('aHour')}
                  />
                </label>
                <label>
                  Minute
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="00"
                    value={form.aMinute}
                    onChange={updateField('aMinute')}
                  />
                </label>
              </div>
            </div>

            <div className="partner-card">
              <h3>Partner B</h3>
              <label>
                Name (optional)
                <input
                  type="text"
                  placeholder="e.g. Nika"
                  value={form.bName}
                  onChange={updateField('bName')}
                />
              </label>
              <label>
                Birth date
                <input
                  type="date"
                  value={form.bDate}
                  onChange={updateField('bDate')}
                  required
                />
              </label>
              <div className="time-row">
                <label>
                  Hour
                  <input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="00"
                    value={form.bHour}
                    onChange={updateField('bHour')}
                  />
                </label>
                <label>
                  Minute
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="00"
                    value={form.bMinute}
                    onChange={updateField('bMinute')}
                  />
                </label>
              </div>
            </div>
          </section>

          <button className="primary" type="submit" disabled={!ready || loading}>
            {loading ? 'Calculating...' : 'Generate Compatibility'}
          </button>
          {error ? <p className="error">{error}</p> : null}
        </form>

        <section className="card result-card">
          <div className="card-header">
            <h2>Compatibility Snapshot</h2>
            <p>We show both languages side-by-side.</p>
          </div>

          {result ? (
            <div className="result-grid">
              <div className="result-panel">
                <h3>English</h3>
                <p className="score">{result.summary_en}</p>
                <ul>
                  {result.highlights_en.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="result-panel">
                <h3>ქართული</h3>
                <p className="score">{result.summary_ka}</p>
                <ul>
                  {result.highlights_ka.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="placeholder">
              <p>Submit the form to see a full compatibility readout.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
