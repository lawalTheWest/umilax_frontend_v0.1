import React from 'react';
import { render } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';

describe('SplashScreen', () => {
  it('renders welcome text', () => {
    const { getByText } = render(<SplashScreen />);
    // Updated to match current UI title text
    expect(getByText('UMILAX Salon Management')).toBeTruthy();
  });
});
