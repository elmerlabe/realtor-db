import { AuthProvider } from "./context";
import AppRoutes from "./routes";

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
