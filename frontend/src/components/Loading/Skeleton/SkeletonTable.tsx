import SkeletonRow from './SkeletonRow';
import './styles.css';

type SkeletonTableProps = {
  columns: number;
  rows?: number;
  className?: string;
};

const SkeletonTable = ({ columns, rows = 8, className = '' }: SkeletonTableProps) => {
  return (
    <table className={`skeleton-table ${className}`.trim()}>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  );
};

export default SkeletonTable;
