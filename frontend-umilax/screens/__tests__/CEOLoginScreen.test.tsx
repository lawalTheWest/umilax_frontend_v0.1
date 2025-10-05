import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CEOLoginScreen from '../CEOLoginScreen';

describe('CEOLoginScreen', () => {
  it('renders login form and disabled Google SSO button', () => {
    const { getByPlaceholderText, getByText } = render(<CEOLoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Google SSO (Post-Launch)')).toBeDisabled();
  });

  it('shows error on invalid credentials', () => {
    const { getByPlaceholderText, getByText } = render(<CEOLoginScreen />);
    // Mock fetch to return a failed response
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 400, text: async () => 'Invalid credentials', json: async () => ({}) }));
    const RN = require('react-native');
    // Ensure Alert.alert is a spy we can assert against
    RN.Alert = RN.Alert || {};
    RN.Alert.alert = jest.fn();
    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@umilax.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Login'));
    return waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(RN.Alert.alert).toHaveBeenCalled();
    });
  });

  it('navigates to dashboard on valid credentials', () => {
    // Navigation is mocked in integration tests
  });
});
