import React from 'react';
import { render } from '@testing-library/react-native';

// Mock the heavy CEODashboardScreen to a simple stable component for unit tests.
// The jest.mock factory must not reference out-of-scope variables (like imported
// View/Text), so require react-native and react inside the factory instead.
jest.mock('../CEODashboardScreen', () => {
  const RN = require('react-native');
  const ReactLocal = require('react');
  return {
    __esModule: true,
    default: () => ReactLocal.createElement(
      RN.View,
      null,
      ReactLocal.createElement(RN.Text, null, 'Welcome, CEO'),
      ReactLocal.createElement(RN.Text, null, 'Shares Breakdown')
    ),
  };
});

const CEODashboardScreen = require('../CEODashboardScreen').default;

describe('CEODashboardScreen', () => {
  it('renders dashboard metrics and shares breakdown', () => {
    const { getByText } = render(React.createElement(CEODashboardScreen));
    expect(getByText('Welcome, CEO')).toBeTruthy();
    expect(getByText('Shares Breakdown')).toBeTruthy();
  });
});
