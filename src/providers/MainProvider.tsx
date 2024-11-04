import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    InMemoryCache,
    split,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

import { BrowserRouter as Router } from "react-router-dom";

import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import createCache from "@emotion/cache";

import { HelmetProvider } from "react-helmet-async";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../reducers";

import App from "../App";
import { AuthProvider } from "./AuthProvider";
import { AppModeProvider } from "./AppModeProvider";
import { io } from "socket.io-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const wsUrl = import.meta.env.VITE_APP_URL.replace("http", "ws").replace(
    "https",
    "wss"
);

const queryClient = new QueryClient();

export const socket = io(wsUrl, {
    autoConnect: false,
});

const emotionCache = createCache({
    key: "css",
    prepend: true,
});

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#242424",
        },
    },
    components: {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: "white",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 550,
                },
                contained: {
                    color: "white",
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "*::-webkit-scrollbar": {
                    width: "5px",
                    padding: "2px",
                },
                "*::-webkit-scrollbar-track": {
                    background: "#303030",
                },
                "*::-webkit-scrollbar-thumb": {
                    background: "#444",
                    borderRadius: "2px",
                },
            },
        },
    },
    typography: {
        button: { textTransform: "none" },
    },
});

export default function MainProvider() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <ThemeProvider theme={theme}>
                            <StyledEngineProvider injectFirst>
                                <CacheProvider value={emotionCache}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                    >
                                        <HelmetProvider>
                                            <AuthProvider>
                                                <AppModeProvider>
                                                    <CssBaseline />
                                                    <App />
                                                </AppModeProvider>
                                            </AuthProvider>
                                        </HelmetProvider>
                                    </LocalizationProvider>
                                </CacheProvider>
                            </StyledEngineProvider>
                        </ThemeProvider>
                    </Router>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    );
}
