import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../../src/components/Pagination';

describe('Pagination', () => {
  it('displays the current page and total pages', () => {
    render(<Pagination page={3} totalPages={10} onPageChange={vi.fn()} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables the Previous button on the first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('enables both buttons on a middle page', () => {
    render(<Pagination page={3} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('calls onPageChange with page - 1 when Previous is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: /previous/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with page + 1 when Next is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('does not call onPageChange when Previous is clicked on page 1', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: /previous/i }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('has an aria-label on the pagination container', () => {
    const { container } = render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(container.querySelector('[aria-label="Pagination"]')).toBeInTheDocument();
  });
});
