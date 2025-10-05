
/**
 * RootStackParamList
 * Defines the parameter types for all routes in the main stack navigator of the UMILAX app.
 */
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Dashboard: { role: string };
  Complaints: undefined;
  Reports: undefined;
  DivisionSettings: undefined;
  CEOLogin: undefined;
  CEODashboard: undefined;
};
