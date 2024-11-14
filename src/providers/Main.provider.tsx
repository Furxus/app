import { BrowserRouter as Router } from "react-router-dom";

import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import createCache from "@emotion/cache";

import { HelmetProvider } from "react-helmet-async";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../reducers";

import App from "../App";
import { AuthProvider } from "./Auth.provider";
import { AppModeProvider } from "./AppMode.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { UserServersProvider } from "./UserServers.provider";
import { UserEmojisProvider } from "./UserEmojis.provider";
import { EditorExtensionsProvider } from "./EditorExtensions.provider";
import { TauriProvider } from "./Tauri.provider";

const queryClient = new QueryClient();

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
                    <Router
                        future={{
                            v7_startTransition: true,
                            v7_relativeSplatPath: true,
                        }}
                    >
                        <ThemeProvider theme={theme}>
                            <StyledEngineProvider injectFirst>
                                <CacheProvider value={emotionCache}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                    >
                                        <HelmetProvider>
                                            <AuthProvider>
                                                <AppModeProvider>
                                                    <UserServersProvider>
                                                        <UserEmojisProvider>
                                                            <TauriProvider>
                                                                <EditorExtensionsProvider>
                                                                    <CssBaseline />
                                                                    <App />
                                                                    {import.meta
                                                                        .env
                                                                        .DEV && (
                                                                        <ReactQueryDevtools
                                                                            buttonPosition="bottom-left"
                                                                            position="bottom"
                                                                            initialIsOpen={
                                                                                false
                                                                            }
                                                                        />
                                                                    )}
                                                                </EditorExtensionsProvider>
                                                            </TauriProvider>
                                                        </UserEmojisProvider>
                                                    </UserServersProvider>
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
