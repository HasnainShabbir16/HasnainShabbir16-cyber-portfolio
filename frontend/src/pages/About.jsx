import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import { getSiteSettings, getAbout } from '../api/public.js';

const DEFAULT_SKILLS = [
  { label: 'Network Penetration Testing', value: 85, color: 'green' },
  { label: 'Web Application Security', value: 80, color: 'cyan' },
  { label: 'CTF Challenges', value: 90, color: 'green' },
  { label: 'Python / Scripting', value: 75, color: 'cyan' },
  { label: 'Malware Analysis', value: 65, color: 'purple' },
  { label: 'Forensics & OSINT', value: 70, color: 'green' },
];

const DEFAULT_TOOLS = [
  'Kali Linux', 'Burp Suite', 'Metasploit', 'Nmap', 'Wireshark',
  'John the Ripper', 'Hashcat', 'Gobuster', 'SQLMap', 'Ghidra',
  'IDA Pro', 'Python', 'Bash', 'Docker', 'Git',
];

export default function About() {
  const [settings, setSettings] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    getSiteSettings().then((r) => setSettings(r.data)).catch(() => {});
    getAbout().then((r) => setAbout(r.data)).catch(() => {});
  }, []);

  const skills = about?.skills || DEFAULT_SKILLS;
  const tools = about?.tools || DEFAULT_TOOLS;
  const goals = about?.goals || [];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>About <span className="neon-text">Me</span></h1>
          <p>Get to know my background, skills, and journey in cybersecurity.</p>
        </div>
      </div>

      <div className="container">
        {/* Bio */}
        <section className="section-sm">
          <div className="about-bio">
            <div className="about-bio__img-col">
              {settings?.profileImage ? (
                <img src={settings.profileImage} alt="Profile" className="about-bio__img" />
              ) : (
                <div className="about-bio__img-placeholder">
                  <span>👤</span>
                </div>
              )}
              <div className="about-bio__social">
                {settings?.githubUrl && (
                  <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm w-full">GitHub</a>
                )}
                {settings?.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-cyan btn-sm w-full">LinkedIn</a>
                )}
              </div>
            </div>
            <div className="about-bio__text">
              <h2 className="section-title">{settings?.heroName || 'Hasnain Shabbir'}</h2>
              <p className="about-bio__subtitle neon-text-cyan mono">
                {settings?.heroSubtitle || 'Cybersecurity Enthusiast & Ethical Hacker'}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                {settings?.aboutText || about?.bio || 'Passionate about cybersecurity with a strong foundation in ethical hacking, penetration testing, and security research. I enjoy solving CTF challenges and contributing to the security community through writeups and tools.'}
              </p>
              {about?.bio2 && (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>{about.bio2}</p>
              )}
              <div className="flex-wrap mt-2">
                {['Ethical Hacking', 'CTF Player', 'Bug Hunter', 'Security Researcher'].map((tag) => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="section-sm">
          <h2 className="section-title">Technical Skills</h2>
          <div className="grid-2">
            {skills.map((skill) => (
              <ProgressBar
                key={skill.label}
                label={skill.label}
                value={skill.value}
                color={skill.color}
              />
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="section-sm">
          <h2 className="section-title">Tools & Technologies</h2>
          <div className="flex-wrap">
            {tools.map((tool) => (
              <span key={tool} className="about-tool-badge">{tool}</span>
            ))}
          </div>
        </section>

        {/* Goals */}
        {goals.length > 0 && (
          <section className="section-sm">
            <h2 className="section-title">Goals & Roadmap</h2>
            <div className="grid-auto">
              {goals.map((goal, i) => (
                <div key={i} className="card">
                  <div className="about-goal-num neon-text mono">{String(i + 1).padStart(2, '0')}</div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{goal.title}</h4>
                  {goal.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{goal.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .about-bio { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; align-items: start; }
        .about-bio__img { width: 100%; aspect-ratio: 1; border-radius: var(--radius-lg); object-fit: cover; border: 2px solid rgba(0,255,65,0.3); }
        .about-bio__img-placeholder { width: 100%; aspect-ratio: 1; border-radius: var(--radius-lg); background: var(--bg-surface); border: 2px solid rgba(0,255,65,0.2); display: flex; align-items: center; justify-content: center; font-size: 5rem; }
        .about-bio__social { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
        .about-bio__subtitle { font-size: 0.95rem; margin-bottom: 1rem; display: block; }
        .about-tool-badge { padding: 0.4rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius); font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-secondary); transition: var(--transition); }
        .about-tool-badge:hover { border-color: var(--neon-green); color: var(--neon-green); }
        .about-goal-num { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; opacity: 0.6; }
        @media (max-width: 768px) {
          .about-bio { grid-template-columns: 1fr; }
          .about-bio__img-col { display: flex; flex-direction: column; align-items: center; }
          .about-bio__img, .about-bio__img-placeholder { width: 200px; height: 200px; aspect-ratio: auto; }
          .about-bio__social { flex-direction: row; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
