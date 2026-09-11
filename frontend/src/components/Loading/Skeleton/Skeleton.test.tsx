import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkeletonRow from './SkeletonRow';
import SkeletonTable from './SkeletonTable';
import SkeletonInput from './SkeletonInput';

describe('SkeletonRow', () => {
  it('should render correct number of columns', () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonRow columns={3} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });

  it('should render skeleton cells with correct class', () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonRow columns={2} />
        </tbody>
      </table>
    );

    const skeletonCells = container.querySelectorAll('.skeleton-cell');
    expect(skeletonCells).toHaveLength(2);
  });

  it('should render single column', () => {
    const { container } = render(
      <table>
        <tbody>
          <SkeletonRow columns={1} />
        </tbody>
      </table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(1);
  });
});

describe('SkeletonTable', () => {
  it('should render with default 8 rows', () => {
    const { container } = render(<SkeletonTable columns={3} />);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(8);
  });

  it('should render custom number of rows', () => {
    const { container } = render(<SkeletonTable columns={3} rows={5} />);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(5);
  });

  it('should render correct number of columns in each row', () => {
    const { container } = render(<SkeletonTable columns={4} rows={2} />);

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(8); // 4 columns × 2 rows
  });

  it('should apply skeleton-table class', () => {
    const { container } = render(<SkeletonTable columns={3} />);

    const table = container.querySelector('table');
    expect(table).toHaveClass('skeleton-table');
  });

  it('should apply custom className', () => {
    const { container } = render(<SkeletonTable columns={3} className="custom-skeleton" />);

    const table = container.querySelector('table');
    expect(table).toHaveClass('skeleton-table', 'custom-skeleton');
  });

  it('should render with single row', () => {
    const { container } = render(<SkeletonTable columns={3} rows={1} />);

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(1);
  });
});

describe('SkeletonInput', () => {
  it('should render with default dimensions', () => {
    const { container } = render(<SkeletonInput />);

    const input = container.querySelector('.skeleton-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveStyle({ width: '100%', height: '40px' });
  });

  it('should render with custom width', () => {
    const { container } = render(<SkeletonInput width="200px" />);

    const input = container.querySelector('.skeleton-input');
    expect(input).toHaveStyle({ width: '200px' });
  });

  it('should render with custom height', () => {
    const { container } = render(<SkeletonInput height="60px" />);

    const input = container.querySelector('.skeleton-input');
    expect(input).toHaveStyle({ height: '60px' });
  });

  it('should render with custom dimensions', () => {
    const { container } = render(<SkeletonInput width="300px" height="50px" />);

    const input = container.querySelector('.skeleton-input');
    expect(input).toHaveStyle({ width: '300px', height: '50px' });
  });

  it('should apply skeleton-input class', () => {
    const { container } = render(<SkeletonInput />);

    const input = container.querySelector('.skeleton-input');
    expect(input).toHaveClass('skeleton-input');
  });
});
