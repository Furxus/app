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
import { CacheProvider, ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

let restartRequestedBeforeConnected = false;
let gracefullyRestart = () => {
    restartRequestedBeforeConnected = true;
};

const httpLink = createUploadLink({
    uri: import.meta.env.VITE_APP_URL,
});

const wsUrl = import.meta.env.VITE_APP_URL?.replace("http", "ws").replace(
    "https",
    "wss"
);

const wsLink = new GraphQLWsLink(
    createClient({
        url: wsUrl,
        connectionParams: async () => {
            const token = localStorage.getItem("fx-token")
                ? `Bearer ${localStorage.getItem("fx-token")}`
                : undefined;
            if (!token) {
                return {};
            }
            return {
                Authorization: token,
            };
        },
        keepAlive: 10000,
        on: {
            connected: (socket: any) => {
                gracefullyRestart = () => {
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.close(4205, "Restarting");
                    }
                };

                if (restartRequestedBeforeConnected) {
                    restartRequestedBeforeConnected = false;
                    gracefullyRestart();
                }
            },
        },
    })
);

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("fx-token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            "apollo-require-preflight": true,
        },
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (!import.meta.env.DEV) return;
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.log(
                `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    }
    if (networkError) console.log(`[Network Error]: ${networkError}`);
});

const retryLink = new RetryLink({
    delay: {
        initial: 300,
        max: Infinity,
        jitter: true,
    },
    attempts: {
        max: Infinity,
        retryIf: (error) => !!error,
    },
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink as any
);

const link = ApolloLink.from([retryLink, errorLink, authLink, splitLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache,
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
                    backgroundColor: "#444",
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
                <ApolloProvider client={client}>
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
                </ApolloProvider>
            </PersistGate>
        </Provider>
    );
}
