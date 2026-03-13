const PageShell = ({
  title,
  subtitle,
  tag = "Workspace",
  children,
  actions,
}) => {
  return (
    <div className="saas-page space-y-7">
      <section className="saas-card p-6 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-cyan/90 mb-2">
              {tag}
            </p>
            <h1 className="saas-heading">{title}</h1>
            {subtitle ? (
              <p className="saas-subheading mt-2">{subtitle}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </section>

      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default PageShell;
