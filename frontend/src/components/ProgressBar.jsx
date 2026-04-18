import { useState, useEffect, useRef } from 'react';

export default function ProgressBar({ label, value = 0, color = 'green' }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(Math.min(value, 100));
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const gradients = {
    green: 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))',
    cyan: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
    purple: 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))',
  };

  return (
    <div className="progress-bar-wrapper" ref={ref}>
      <div className="progress-bar-header">
        <span className="progress-bar-label">{label}</span>
        <span className="progress-bar-value">{value}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${width}%`,
            background: gradients[color] || gradients.green,
          }}
        />
      </div>
    </div>
  );
}
