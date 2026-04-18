export default function ProjectCard({ project }) {
  const {
    title = 'Untitled',
    description = '',
    technologies = [],
    tags = [],
    githubLink,
    demoLink,
    images = [],
    featured,
  } = project;

  const techs = Array.isArray(technologies)
    ? technologies
    : String(technologies).split(',').map((t) => t.trim()).filter(Boolean);

  const tagList = Array.isArray(tags)
    ? tags
    : String(tags).split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div className={`card project-card${featured ? ' project-card--featured' : ''}`}>
      {images[0] && (
        <div className="project-card__img-wrap">
          <img src={images[0]} alt={title} className="project-card__img" />
        </div>
      )}

      <div className="project-card__body">
        <div className="project-card__header">
          <h3 className="project-card__title">{title}</h3>
          {featured && <span className="badge badge-cyan">Featured</span>}
        </div>

        <p className="project-card__desc">
          {description.length > 140 ? description.slice(0, 137) + '…' : description}
        </p>

        {techs.length > 0 && (
          <div className="project-card__techs">
            {techs.slice(0, 6).map((t) => (
              <span key={t} className="tag-chip">{t}</span>
            ))}
            {techs.length > 6 && (
              <span className="tag-chip">+{techs.length - 6}</span>
            )}
          </div>
        )}

        {tagList.length > 0 && (
          <div className="project-card__tags">
            {tagList.map((tag) => (
              <span key={tag} className="badge badge-default">{tag}</span>
            ))}
          </div>
        )}

        <div className="project-card__actions">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              GitHub
            </a>
          )}
          {demoLink && (
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-cyan btn-sm"
            >
              Demo
            </a>
          )}
        </div>
      </div>

      <style>{`
        .project-card { padding: 0; overflow: hidden; }
        .project-card--featured { border-color: rgba(0,212,255,0.3); }
        .project-card__img-wrap { height: 180px; overflow: hidden; background: var(--bg-secondary); }
        .project-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .project-card:hover .project-card__img { transform: scale(1.05); }
        .project-card__body { padding: 1.25rem; }
        .project-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.625rem; gap: 0.5rem; flex-wrap: wrap; }
        .project-card__title { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); }
        .project-card__desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.875rem; }
        .project-card__techs { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.625rem; }
        .project-card__tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.875rem; }
        .project-card__actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
