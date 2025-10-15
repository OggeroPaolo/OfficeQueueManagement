import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import GetTicket from '../../components/GetTicket.jsx';
import * as API from '../../API/API.js';

// Mock the API module
vi.mock('../../API/API.js', () => ({
  getServices: vi.fn(),
  getNewTicket: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GetTicket Component', () => {
  it('renders loading spinner and then service buttons', async () => {
    API.getServices.mockResolvedValue(['Service 1', 'Service 2']);
    API.getNewTicket.mockResolvedValue('TKT-AA00');

    render(<GetTicket />);

    // Check if spinner is shown during loading
    const spinner = document.querySelector('.spinner-border');
    expect(spinner).toBeInTheDocument();

    // Wait for service buttons
    const buttons = await screen.findAllByRole('button', { name: /Service/i });
    expect(buttons).toHaveLength(2);
  });

  it('selects a service and displays ticket', async () => {
    API.getServices.mockResolvedValue(['Service 1']);
    API.getNewTicket.mockResolvedValue('TKT-AA00');

    render(<GetTicket />);

    // Wait for the button and click it
    const button = await screen.findByRole('button', { name: 'Service 1' });
    fireEvent.click(button);

    // Ticket is displayed
    const ticket = await screen.findByText('TKT-AA00');
    expect(ticket).toBeInTheDocument();

    // Thank you message
    expect(
      screen.getByText(/Thank you, wait for your ticket number/i)
    ).toBeInTheDocument();
  });
});
