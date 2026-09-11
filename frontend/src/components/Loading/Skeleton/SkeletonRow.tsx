import './styles.css';

type SkeletonRowProps = {
  columns: number;
};

const SkeletonRow = ({ columns }: SkeletonRowProps) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-cell" />
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
