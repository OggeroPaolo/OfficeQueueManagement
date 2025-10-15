import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import CounterNextTicket from '../../components/CounterNextTicket.jsx';
import * as API from '../../API/API';

// Mock the API module
vi.mock('../../API/API', () => ({
  getNextTicket: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CounterNextTicket Component', () => {
  it('shows initial message when no ticket is being served', async () => {
    render(<CounterNextTicket />);

    // Wait for the component to finish "loading"
    const initialMessage = await screen.findByText(/No ticket is being served currently/i);
    expect(initialMessage).toBeInTheDocument();
  });

  it('calls next ticket and displays it', async () => {
    // Mock API response
    API.getNextTicket.mockResolvedValue('TKT-AA00');

    render(<CounterNextTicket />);

    // Wait for button to appear
    const button = await screen.findByRole('button', {
      name: 'Call next customer',
    });

    fireEvent.click(button);

    // Wait for the ticket to appear
    const ticket = await screen.findByText('TKT-AA00');
    expect(ticket).toBeInTheDocument();

    // Also check the "Now serving ticket" text
    expect(screen.getByText('Now serving ticket:')).toBeInTheDocument();
  });
});
