import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ModuleCard from './index';

describe('ModuleCard', () => {
  it('should render card with title', () => {
    render(<ModuleCard title="Test Module" imgUrl="test.png" />);

    expect(screen.getByText('Test Module')).toBeInTheDocument();
  });

  it('should render card with image', () => {
    render(<ModuleCard title="Test" imgUrl="test-image.png" />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.png');
  });

  it('should have module-card-container class', () => {
    const { container } = render(<ModuleCard title="Test" imgUrl="test.png" />);

    expect(container.querySelector('.module-card-container')).toBeInTheDocument();
  });

  it('should have base-card class', () => {
    const { container } = render(<ModuleCard title="Test" imgUrl="test.png" />);

    const card = container.querySelector('.module-card-container');
    expect(card).toHaveClass('base-card');
  });

  it('should have module-card-image-container class', () => {
    const { container } = render(<ModuleCard title="Test" imgUrl="test.png" />);

    expect(container.querySelector('.module-card-image-container')).toBeInTheDocument();
  });

  it('should have module-card-content-container class', () => {
    const { container } = render(<ModuleCard title="Test" imgUrl="test.png" />);

    expect(container.querySelector('.module-card-content-container')).toBeInTheDocument();
  });

  it('should render title in h3 element', () => {
    render(<ModuleCard title="Module Title" imgUrl="test.png" />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Module Title');
  });

  it('should render with long title', () => {
    const longTitle = 'This is a very long module title that should still render correctly';
    render(<ModuleCard title={longTitle} imgUrl="test.png" />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('should render with empty title', () => {
    render(<ModuleCard title="" imgUrl="test.png" />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('');
  });

  it('should render with empty image URL', () => {
    render(<ModuleCard title="Test" imgUrl="" />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '');
  });

  it('should have empty alt attribute for image', () => {
    render(<ModuleCard title="Test" imgUrl="test.png" />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', '');
  });

  it('should render with URL path as image source', () => {
    render(<ModuleCard title="Test" imgUrl="/assets/images/module.png" />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/assets/images/module.png');
  });

  it('should render with special characters in title', () => {
    render(<ModuleCard title="Module #1 & Test" imgUrl="test.png" />);

    expect(screen.getByText('Module #1 & Test')).toBeInTheDocument();
  });

  it('should render with numbers in title', () => {
    render(<ModuleCard title="Module 123" imgUrl="test.png" />);

    expect(screen.getByText('Module 123')).toBeInTheDocument();
  });

  it('should render with multiple words in title', () => {
    render(<ModuleCard title="Multiple Word Module Title" imgUrl="test.png" />);

    expect(screen.getByText('Multiple Word Module Title')).toBeInTheDocument();
  });

  it('should render image inside image container', () => {
    const { container } = render(<ModuleCard title="Test" imgUrl="test.png" />);

    const imageContainer = container.querySelector('.module-card-image-container');
    const image = imageContainer?.querySelector('img');
    expect(image).toBeInTheDocument();
  });

  it('should render title inside content container', () => {
    const { container } = render(<ModuleCard title="Test Title" imgUrl="test.png" />);

    const contentContainer = container.querySelector('.module-card-content-container');
    const heading = contentContainer?.querySelector('h3');
    expect(heading).toHaveTextContent('Test Title');
  });

  it('should render with external image URL', () => {
    render(<ModuleCard title="Test" imgUrl="https://example.com/image.png" />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.png');
  });

  it('should maintain structure with both props', () => {
    const { container } = render(<ModuleCard title="Complete Test" imgUrl="complete.png" />);

    expect(container.querySelector('.module-card-container')).toBeInTheDocument();
    expect(container.querySelector('.module-card-image-container')).toBeInTheDocument();
    expect(container.querySelector('.module-card-content-container')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should render with Unicode characters in title', () => {
    render(<ModuleCard title="Módulo de Configuração" imgUrl="test.png" />);

    expect(screen.getByText('Módulo de Configuração')).toBeInTheDocument();
  });
});
