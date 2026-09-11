import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ItemCard from './index';

describe('ItemCard', () => {
  it('should render card container', () => {
    const { container } = render(<ItemCard title="Test Title" />);

    const card = container.querySelector('.item-card-container');
    expect(card).toBeInTheDocument();
  });

  it('should render title text', () => {
    render(<ItemCard title="Test Card Title" />);

    const title = screen.getByText('Test Card Title');
    expect(title).toBeInTheDocument();
  });

  it('should render title in h5 element', () => {
    render(<ItemCard title="Test Title" />);

    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toHaveTextContent('Test Title');
  });

  it('should have card class', () => {
    const { container } = render(<ItemCard title="Test" />);

    const card = container.querySelector('.item-card-container');
    expect(card).toHaveClass('card');
  });

  it('should render image container', () => {
    const { container } = render(<ItemCard title="Test" />);

    const imageContainer = container.querySelector('.item-card-image-container');
    expect(imageContainer).toBeInTheDocument();
  });

  it('should render content container', () => {
    const { container } = render(<ItemCard title="Test" />);

    const contentContainer = container.querySelector('.item-card-content-container');
    expect(contentContainer).toBeInTheDocument();
  });

  it('should render icon in image container', () => {
    const { container } = render(<ItemCard title="Test" />);

    const imageContainer = container.querySelector('.item-card-image-container');
    const icon = imageContainer?.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should render with empty title', () => {
    render(<ItemCard title="" />);

    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toHaveTextContent('');
  });

  it('should render with long title', () => {
    const longTitle = 'This is a very long title that should still render correctly in the card component';
    render(<ItemCard title={longTitle} />);

    const title = screen.getByText(longTitle);
    expect(title).toBeInTheDocument();
  });

  it('should render with special characters in title', () => {
    render(<ItemCard title="Title with @#$%^&*()" />);

    const title = screen.getByText('Title with @#$%^&*()');
    expect(title).toBeInTheDocument();
  });

  it('should render with numbers in title', () => {
    render(<ItemCard title="Item 123" />);

    const title = screen.getByText('Item 123');
    expect(title).toBeInTheDocument();
  });

  it('should render with unicode characters', () => {
    render(<ItemCard title="测试标题" />);

    const title = screen.getByText('测试标题');
    expect(title).toBeInTheDocument();
  });

  it('should maintain structure with different titles', () => {
    const { container } = render(<ItemCard title="Different Title" />);

    const card = container.querySelector('.item-card-container');
    const imageContainer = container.querySelector('.item-card-image-container');
    const contentContainer = container.querySelector('.item-card-content-container');

    expect(card).toBeInTheDocument();
    expect(imageContainer).toBeInTheDocument();
    expect(contentContainer).toBeInTheDocument();
  });

  it('should render title inside content container', () => {
    const { container } = render(<ItemCard title="Test" />);

    const contentContainer = container.querySelector('.item-card-content-container');
    const heading = contentContainer?.querySelector('h5');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test');
  });

  it('should have both item-card-container and card classes', () => {
    const { container } = render(<ItemCard title="Test" />);

    const card = container.querySelector('.item-card-container.card');
    expect(card).toBeInTheDocument();
  });

  it('should render FiPaperclip icon', () => {
    const { container } = render(<ItemCard title="Test" />);

    const imageContainer = container.querySelector('.item-card-image-container');
    const svg = imageContainer?.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('should render with whitespace in title', () => {
    render(<ItemCard title="  Test  " />);

    const title = screen.getByText('Test', { exact: false });
    expect(title).toBeInTheDocument();
  });

  it('should render with multiline title', () => {
    const multilineTitle = 'Line 1\nLine 2';
    render(<ItemCard title={multilineTitle} />);

    const heading = screen.getByRole('heading', { level: 5 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Line 1');
    expect(heading.textContent).toContain('Line 2');
  });

  it('should be accessible', () => {
    render(<ItemCard title="Accessible Title" />);

    const heading = screen.getByRole('heading', { level: 5, name: 'Accessible Title' });
    expect(heading).toBeInTheDocument();
  });

  it('should render consistently', () => {
    const { container: container1 } = render(<ItemCard title="Test" />);
    const { container: container2 } = render(<ItemCard title="Test" />);

    const card1 = container1.querySelector('.item-card-container');
    const card2 = container2.querySelector('.item-card-container');

    expect(card1?.className).toBe(card2?.className);
  });
});
