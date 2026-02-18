import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';
import MovesList from '../../src/components/MovesList';
import { movesFixture } from '../fixtures/pokemon';
import { createTestQueryClient } from '../utils';

vi.mock('../../src/services/pokeApi', () => ({
  fetchMove: vi.fn().mockResolvedValue({ type: { name: 'grass' } }),
}));

import { fetchMove } from '../../src/services/pokeApi';

function renderMovesList(moves) {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MovesList moves={moves} />
    </QueryClientProvider>,
  );
}

describe('MovesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders move names for the first page', () => {
    renderMovesList(movesFixture.slice(0, 5));

    expect(screen.getByText('Move 1')).toBeInTheDocument();
    expect(screen.getByText('Move 5')).toBeInTheDocument();
  });

  it('formats hyphenated move names with each word capitalised', () => {
    renderMovesList([{ move: { name: 'razor-wind', url: 'https://pokeapi.co/api/v2/move/13/' } }]);

    expect(screen.getByText('Razor Wind')).toBeInTheDocument();
  });

  it('does not render pagination controls when moves fit on one page', () => {
    renderMovesList(movesFixture.slice(0, 3));

    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  it('renders pagination controls when there are more than 20 moves', () => {
    // movesFixture has 25 moves
    renderMovesList(movesFixture);

    expect(screen.getByText(/25 total/)).toBeInTheDocument();
  });

  it('shows page 1 of total pages in the pagination summary', () => {
    renderMovesList(movesFixture);

    // 25 moves / 20 per page = 2 pages
    expect(screen.getByText('1 / 2 (25 total)')).toBeInTheDocument();
  });

  it('disables the previous button on the first page', () => {
    renderMovesList(movesFixture);

    const [prevBtn] = screen.getAllByRole('button');
    expect(prevBtn).toBeDisabled();
  });

  it('advances to the next page when the next button is clicked', async () => {
    renderMovesList(movesFixture);

    const buttons = screen.getAllByRole('button');
    const nextBtn = buttons[buttons.length - 1];
    await userEvent.click(nextBtn);

    expect(screen.getByText('2 / 2 (25 total)')).toBeInTheDocument();
  });

  it('shows moves from the next page after advancing', async () => {
    renderMovesList(movesFixture);

    const buttons = screen.getAllByRole('button');
    const nextBtn = buttons[buttons.length - 1];
    await userEvent.click(nextBtn);

    // Page 2 starts at index 20 → move-21
    expect(screen.getByText('Move 21')).toBeInTheDocument();
  });

  it('disables the next button on the last page', async () => {
    renderMovesList(movesFixture);

    const buttons = screen.getAllByRole('button');
    const nextBtn = buttons[buttons.length - 1];
    await userEvent.click(nextBtn);

    const updatedButtons = screen.getAllByRole('button');
    const lastNextBtn = updatedButtons[updatedButtons.length - 1];
    expect(lastNextBtn).toBeDisabled();
  });

  it('navigates back to page 1 when the previous button is clicked from page 2', async () => {
    renderMovesList(movesFixture);

    // Go to page 2
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[buttons.length - 1]);

    // Go back to page 1
    const updatedButtons = screen.getAllByRole('button');
    await userEvent.click(updatedButtons[0]);

    expect(screen.getByText('1 / 2 (25 total)')).toBeInTheDocument();
  });

  it('renders the moves container with an accessible label', () => {
    const { container } = renderMovesList(movesFixture.slice(0, 3));

    expect(container.querySelector('[aria-label="Moves list"]')).toBeInTheDocument();
  });

  it('renders nothing for the type badge when the move fetch returns no data', async () => {
    fetchMove.mockResolvedValueOnce(undefined);

    const { container } = renderMovesList([movesFixture[0]]);

    // Wait for the query to settle (isLoading → false, data = undefined)
    await waitFor(() =>
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument(),
    );

    // No TypeBadge rendered — the null branch
    expect(container.querySelector('[style*="backgroundColor"]')).not.toBeInTheDocument();
  });
});
