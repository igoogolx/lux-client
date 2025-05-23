import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { delaysSlice, proxiesSlice } from "@/reducers";
import checkForUpdate from "@/utils/checkForUpdate";
import { LAST_CHECK_UPDATE_DATE, LATEST_RELEASE_URL } from "@/utils/constants";
import { makeStyles } from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import { getProxyDelay } from "lux-js-sdk";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

export const useTestDelay = () => {
  const dispatch = useDispatch();
  return useCallback(
    async (id: string) => {
      dispatch(
        delaysSlice.actions.updateOne({
          delay: { id, loading: true },
        }),
      );
      try {
        const res = await getProxyDelay({ id });
        dispatch(
          proxiesSlice.actions.updateOne({
            proxy: { id, delay: res.delay },
          }),
        );
      } finally {
        dispatch(
          delaysSlice.actions.updateOne({
            delay: { id, loading: false },
          }),
        );
      }
    },
    [dispatch],
  );
};

// https://usehooks.com/useLockBodyScroll/
export const useLockBodyScroll = () => {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}; // Empty array ensures effect is only run on mount and unmount

export const useDangerStyles = makeStyles({
  danger: {
    color: tokens.colorStatusDangerForeground1,
    borderTopColor: tokens.colorStatusDangerBorder1,
    borderLeftColor: tokens.colorStatusDangerBorder1,
    borderRightColor: tokens.colorStatusDangerBorder1,
    borderBottomColor: tokens.colorStatusDangerBorder1,
  },
});

export const useMedia = (query: string, defaultState?: boolean) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(mql.matches);
    };

    mql.addEventListener("change", onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeEventListener("change", onChange);
    };
  }, [query]);

  return state;
};

export const useCheckForUpdate = (force = false) => {
  const { t } = useTranslation();
  const loading = useRef(false);
  return useCallback(async () => {
    if (loading.current) {
      return;
    }
    const curDate = new Date().toDateString();
    if (!force) {
      const lastCheckUpdateDate = localStorage.getItem(LAST_CHECK_UPDATE_DATE);
      if (curDate === lastCheckUpdateDate) {
        return;
      }
    }
    let checkedResult = false;
    try {
      loading.current = true;
      checkedResult = await checkForUpdate();
    } catch {
      if (force) {
        notifier.error(t(TRANSLATION_KEY.CHECK_UPDATE_ERROR));
      }
    } finally {
      loading.current = false;
    }
    if (checkedResult) {
      if (!force) {
        localStorage.setItem(LAST_CHECK_UPDATE_DATE, curDate);
      }
      notifier.success(t(TRANSLATION_KEY.NEW_VERSION_INFO), [
        {
          text: t(TRANSLATION_KEY.GO),
          onClick: () => {
            window.open(LATEST_RELEASE_URL);
          },
        },
      ]);
    } else if (force) {
      notifier.success(t(TRANSLATION_KEY.NO_NEW_VERSION));
    }
  }, [force, t]);
};

export const getCurrentTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const useThemeDetector = (onChange: (isDark: boolean) => void) => {
  const mqListener = useCallback(
    (e: MediaQueryListEvent) => {
      onChange(e.matches);
    },
    [onChange],
  );

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addEventListener("change", mqListener);
    return () => darkThemeMq.removeEventListener("change", mqListener);
  }, [mqListener]);
};
