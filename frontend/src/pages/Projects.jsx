import { useState, useEffect, useCallback } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import { PageLoader } from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { getProjects, getCategories } from '../api/public.js';

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, catRes] = await Promise.all([
          getProjects(),
          getCategories('project'),
        ]);
        setProjects(projRes.data?.projects || projRes.data || []);
        setCategories(catRes.data?.categories || catRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Collect all unique tags
  const allTags = [...new Set(
    projects.flatMap((p) => {
      const tags = Array.isArray(p.tags)
        ? p.tags
        : String(p.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
      return tags;
    })
  )];

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'all' || (() => {
      const catId = p.category?._id || p.category?.id || p.categoryId;
      return String(catId) === String(activeCategory);
    })();

    const matchSearch = !debouncedSearch ||
      p.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchTag = !activeTag || (() => {
      const tags = Array.isArray(p.tags)
        ? p.tags
        : String(p.tags || '').split(',').map((t) => t.trim());
      return tags.includes(activeTag);
    })();

    return matchCat && matchSearch && matchTag;
  });

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My <span className="neon-text">Projects</span></h1>
          <p>Cybersecurity tools, research, and open-source contributions.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Filters */}
        <div className="projects-filters">
          <input
            type="text"
            placeholder="Search projects..."
            className="form-input projects-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {categories.length > 0 && (
            <div className="tabs" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
              <button
                className={`tab-btn${activeCategory === 'all' ? ' active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id || cat.id}
                  className={`tab-btn${activeCategory === String(cat._id || cat.id) ? ' active' : ''}`}
                  onClick={() => setActiveCategory(String(cat._id || cat.id))}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {allTags.length > 0 && (
            <div className="flex-wrap">
              <button
                className={`tag-chip${!activeTag ? ' tag-chip--active' : ''}`}
                onClick={() => setActiveTag('')}
              >
                All Tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-chip${activeTag === tag ? ' tag-chip--active' : ''}`}
                  onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
          Showing {filtered.length} of {projects.length} projects
        </p>

        {filtered.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <p>No projects match your filters.</p>
          </div>
        ) : (
          <div className="grid-auto">
            {filtered.map((p) => (
              <ProjectCard key={p._id || p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .projects-filters { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .projects-search { max-width: 400px; }
        .tag-chip--active { background: rgba(0,255,65,0.2); border-color: rgba(0,255,65,0.5); font-weight: 700; }
        .tag-chip { cursor: pointer; }
      `}</style>
    </div>
  );
}
