import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ProgressProvider } from "./context/ProgressContext";

// Pages
import {
    Home,
    MorningDhkar,
    EveningDhkar,
    TasbihPrayer,
    KeysToRelief,
    Settings,
} from "./pages";

// PWA Components
import {
    OfflineIndicator,
    InstallPrompt,
    NotificationInitializer,
} from "./components";

const App = () => {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <ProgressProvider>
                    <div
                        className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-sans"
                        dir="rtl">
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/morning"
                                    element={<MorningDhkar />}
                                />
                                <Route
                                    path="/evening"
                                    element={<EveningDhkar />}
                                />
                                <Route
                                    path="/tasbih"
                                    element={<TasbihPrayer />}
                                />
                                <Route
                                    path="/relief"
                                    element={<KeysToRelief />}
                                />
                                <Route
                                    path="/settings"
                                    element={<Settings />}
                                />
                            </Routes>
                        </AnimatePresence>

                        {/* PWA Components */}
                        {/* <OfflineIndicator /> */}
                        <InstallPrompt />
                        <NotificationInitializer />
                    </div>
                </ProgressProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
};

export default App;
