import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Pishing_domain from '../Frontend/src/pages/Pishing_domain.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

jest.mock('axios');
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

describe('Pishing_domain component', () => {
  const mockLiveData = {
    total_urls: 2,
    analysis: [
      { url: 'https://phish1.com', reason: 'Suspicious login page' },
      { url: 'https://phish2.com', reason: 'Fake banking site' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'dummy-token');
  });

  test('renders live threats list correctly when data is an array of objects', async () => {
    axios.get.mockResolvedValueOnce({ data: mockLiveData });

    render(<Pishing_domain />);

    // Wait for fetchingLive to finish
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());

    // Check total monitored count
    expect(screen.getByText(/Total Monitored: 2/i)).toBeInTheDocument();

    // Check each threat item
    mockLiveData.analysis.forEach(item => {
      expect(screen.getByText(item.url)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '' })).toHaveAttribute('href', item.url);
    });

    // Check analysis report reason
    expect(screen.getByText(mockLiveData.analysis[0].reason)).toBeInTheDocument();
  });

  test('shows loading spinner while fetching live data', async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // never resolves

    render(<Pishing_domain />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('handles scan URL success and shows safe domain', async () => {
    axios.get.mockResolvedValueOnce({ data: mockLiveData });
    axios.post.mockResolvedValueOnce({
      data: { is_phishing: false, url: 'https://example.com', reason: 'No issues' }
    });

    render(<Pishing_domain />);

    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);
    fireEvent.change(input, { target: { value: 'https://example.com' } });

    const button = screen.getByRole('button', { name: /Scan URL/i });
    fireEvent.click(button);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Domain appears to be safe.'));
    expect(screen.getByText('Safe Domain')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  test('handles scan URL failure and shows error toast', async () => {
    axios.get.mockResolvedValueOnce({ data: mockLiveData });
    axios.post.mockRejectedValueOnce(new Error('Network'));

    render(<Pishing_domain />);

    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);
    fireEvent.change(input, { target: { value: 'https://bad.com' } });

    const button = screen.getByRole('button', { name: /Scan URL/i });
    fireEvent.click(button);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Scanning failed. Check server connection.'));
  });

  test('shows phishing detected toast and UI when phishing', async () => {
    axios.get.mockResolvedValueOnce({ data: mockLiveData });
    axios.post.mockResolvedValueOnce({
      data: { is_phishing: true, url: 'https://phish.com', reason: 'Fake login' }
    });

    render(<Pishing_domain />);

    const input = screen.getByPlaceholderText(/https:\/\/example.com/i);
    fireEvent.change(input, { target: { value: 'https://phish.com' } });

    const button = screen.getByRole('button', { name: /Scan URL/i });
    fireEvent.click(button);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Malicious Domain Detected!'));
    expect(screen.getByText('Phishing Detected')).toBeInTheDocument();
    expect(screen.getByText('https://phish.com')).toBeInTheDocument();
  });
});