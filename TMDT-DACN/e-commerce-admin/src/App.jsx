import Inter from "../public/static/fonts/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import RootComponent from "./components/RootComponent";
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import RootPage from "./components/RootPage";
//import DataTable from "./test/DataTable";
import Login from './components/Login';
//import Hello from "./test/Hello";
// import "../app.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/bodyComponents/home/Home";
import Inventory from "./components/bodyComponents/inventory/Inventory";
import Customer from "./components/bodyComponents/customer/Customer";
import Revenue from "./components/bodyComponents/revenue/Revenue";
import Growth from "./components/bodyComponents/growth/Growth";
//import Report from "./components/bodyComponents/report/Report";
//import Setting from "./components/bodyComponents/Settings/Setting";
import Order from "./components/bodyComponents/order/Order";
//import OrderModal from "./components/bodyComponents/order/OrderModal";

function App() {
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",

      // primary: {
      //   main: "#573BFE",
      // },
      // text: {
      //   primary: "#202635",
      //   secondary: "#A0AEC0",
      // },
      // secondary: {
      //   main: "#01C0F6",
      // },
      // error: {
      //   main: "#E03137",
      // },
    },

    typography: {
      fontFamily: "Inter",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Raleway'), local('Raleway-Regular'), url(${Inter}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
    //here we customize our typographi and in the variant prop we can use out myVar value
  });
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Customer />
            </PrivateRoute>
          }
        />
        <Route
          path="/revenue"
          element={
            <PrivateRoute>
              <Revenue />
            </PrivateRoute>
          }
        />
        <Route
          path="/growth"
          element={
            <PrivateRoute>
              <Growth />
            </PrivateRoute>
          }
        />
        {/* Các route khác */}
      </Route>
    )
  );

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <CssBaseline />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
