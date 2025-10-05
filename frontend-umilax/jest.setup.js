// Jest setup: mock heavy native / expo modules so tests don't try to import ESM/native code

// Basic mocks for expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: () => {}, replace: () => {}, back: () => {} }),
  Link: ({ children }) => children,
}));

// Provide a default mock for @react-navigation/native useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Ensure Alert.alert is available during tests
try {
  const RN = require('react-native');
  if (!RN.Alert || typeof RN.Alert.alert !== 'function') {
    RN.Alert = { alert: jest.fn() };
  } else {
    RN.Alert.alert = RN.Alert.alert || jest.fn();
  }
  // also expose Alert on the global scope so imported Alert references stay valid
  if (typeof global !== 'undefined' && !global.Alert) global.Alert = RN.Alert;
} catch (e) {
  // ignore
}

// Mock expo secure store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo modules used by the app
jest.mock('expo-asset', () => ({ __esModule: true }));
jest.mock('expo-font', () => ({ loadAsync: jest.fn(() => Promise.resolve()) }));
jest.mock('expo-modules-core', () => ({ __esModule: true }));
jest.mock('expo', () => ({ __esModule: true }));

// Mock vector icons to simple React components
jest.mock('@expo/vector-icons', () => {
  const RN = require('react-native');
  const ReactLocal = require('react');
  return {
    MaterialIcons: (props) => ReactLocal.createElement(RN.View, props, null),
    FontAwesome5: (props) => ReactLocal.createElement(RN.View, props, null),
    Ionicons: (props) => ReactLocal.createElement(RN.View, props, null),
  };
});

// Mock react-native-svg and charts
jest.mock('react-native-svg', () => {
  const RN = require('react-native');
  const ReactLocal = require('react');
  const MockSvg = (props) => ReactLocal.createElement(RN.View, props, props.children || null);
  return {
    Svg: MockSvg,
    Circle: MockSvg,
    G: MockSvg,
    Path: MockSvg,
    Rect: MockSvg,
    Text: MockSvg,
  };
});

jest.mock('react-native-svg-charts', () => ({
  BarChart: () => null,
  Grid: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

jest.mock('victory-native', () => ({
  VictoryChart: () => null,
  VictoryBar: () => null,
}));

// Stub other native modules that sometimes break tests
jest.mock('expo-router/build/layouts/StackClient', () => ({}));

// Silence YellowBox / LogBox warnings during tests
const { LogBox } = require('react-native');
if (LogBox && LogBox.ignoreAllLogs) LogBox.ignoreAllLogs(true);

// Mock global.fetch to avoid real network calls in unit tests; tests that
// need specific fetch behavior should override this mock per-test.
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() => Promise.resolve({ ok: false, text: async () => 'mock' }));
}
