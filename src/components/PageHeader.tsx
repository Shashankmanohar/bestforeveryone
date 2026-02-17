interface PageHeaderProps {
  title: string;
  subtitle: string;
  rightContent?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, rightContent }: PageHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-6 md:mb-8">
    <div>
      <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{subtitle}</p>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
    </div>
    {rightContent}
  </div>
);
