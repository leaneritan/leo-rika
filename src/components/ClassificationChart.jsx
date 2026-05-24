const ChartSection = ({ title, children }) => (
  <section className="space-y-4 rounded-lg border border-white/10 bg-card p-5 md:p-6">
    <h2 className="text-2xl font-black text-white">{title}</h2>
    {children}
  </section>
);

const TreeNode = ({ node }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="min-w-40 rounded-lg border border-white/10 bg-white/5 p-4 text-center"
      style={{ borderTopColor: node.color || '#FFD700', borderTopWidth: 4 }}
    >
      <div className="font-black text-white">{node.label}</div>
      {node.note && <div className="mt-1 text-xs leading-relaxed text-muted">{node.note}</div>}
      {node.examples && <div className="mt-2 text-sm leading-relaxed text-teal">{node.examples}</div>}
    </div>
    {node.children?.length > 0 && (
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-px bg-white/20" />
        <div className="flex flex-wrap justify-center gap-4">
          {node.children.map((child, index) => (
            <TreeNode key={`${child.label}-${index}`} node={child} />
          ))}
        </div>
      </div>
    )}
  </div>
);

const TreeChart = ({ chart }) => (
  <ChartSection title={chart.title}>
    <div className="overflow-x-auto py-2">
      <TreeNode node={chart.root} />
    </div>
  </ChartSection>
);

const ComparisonChart = ({ chart }) => (
  <ChartSection title={chart.title}>
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="bg-teal/20">
            {chart.headers.map((header, index) => (
              <th key={index} className="border-b border-white/10 p-3 text-sm font-black text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white/[0.03]' : 'bg-transparent'}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`p-3 text-sm leading-relaxed ${cellIndex === 0 ? 'font-black text-white' : 'text-text'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ChartSection>
);

const GroupsChart = ({ chart }) => (
  <ChartSection title={chart.title}>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {chart.groups.map((group, index) => (
        <article
          key={`${group.label}-${index}`}
          className="flex min-h-56 flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-4"
          style={{ borderTopColor: group.color || '#FFD700', borderTopWidth: 4 }}
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{group.icon}</span>
              <h3 className="text-xl font-black text-white">{group.label}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(group.traits || []).map((trait, traitIndex) => (
                <span key={traitIndex} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-text">
                  {trait}
                </span>
              ))}
            </div>
          </div>
          {group.examples && <p className="mt-4 text-sm leading-relaxed text-muted">{group.examples}</p>}
        </article>
      ))}
    </div>
  </ChartSection>
);

const ClassificationChart = ({ charts }) => {
  if (!charts?.length) {
    return <div className="rounded-lg border border-white/10 bg-card p-6 text-muted">分類チャートがありません</div>;
  }

  return (
    <div className="space-y-6">
      {charts.map((chart, index) => {
        if (chart.type === 'tree') return <TreeChart key={index} chart={chart} />;
        if (chart.type === 'comparison') return <ComparisonChart key={index} chart={chart} />;
        if (chart.type === 'groups') return <GroupsChart key={index} chart={chart} />;
        return (
          <ChartSection key={index} title={chart.title || 'Chart'}>
            <p className="text-muted">このチャート形式はまだ表示できません</p>
          </ChartSection>
        );
      })}
    </div>
  );
};

export default ClassificationChart;
