import { SensitiveInfoProvider } from "@/components/Core";
import { EventProvider } from "@/components/Core/Event";
import { initI18n } from "@/i18n";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";
import { init } from "lux-js-sdk";
import * as React from "react";
import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import { App } from "./App";
import "./index.css";
import { store } from "./reducers";
import { getHubAddress, stringAddress } from "./utils/hubAddress";
import { ThemeContext, ThemeEnum } from "./utils/theme";

const hubAddress = getHubAddress();
init(stringAddress(hubAddress));

function Root() {
  const [theme, setTheme] = useState(ThemeEnum.Light);
  const themeContextValue = useMemo(() => ({ setTheme, theme }), [theme]);

  return (
    <StrictMode>
      <Provider store={store}>
        <Router>
          <ThemeContext.Provider value={themeContextValue}>
            <FluentProvider
              theme={theme === ThemeEnum.Light ? webLightTheme : webDarkTheme}
              style={{ width: "100%" }}
            >
              <EventProvider>
                <SensitiveInfoProvider>
                  <App />
                </SensitiveInfoProvider>
              </EventProvider>
            </FluentProvider>
          </ThemeContext.Provider>
        </Router>
      </Provider>
    </StrictMode>
  );
}

initI18n().then(() => {
  const container = document.getElementById("app");
  const root = createRoot(container as HTMLElement); // createRoot(container!) if you use TypeScript
  root.render(<Root />);
});
