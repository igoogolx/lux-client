import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { testUdpSlice } from "@/reducers/testUdp";
import { testProxyUdp } from "lux-js-sdk";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

export const useTestUdp = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return useCallback(
    async (id: string) => {
      dispatch(
        testUdpSlice.actions.updateOne({
          data: { id, loading: true },
        }),
      );
      try {
        const res = await testProxyUdp({ id });
        dispatch(
          testUdpSlice.actions.updateOne({
            data: { id, result: res.result },
          }),
        );
        if (!res.result) {
          notifier.error(t(TRANSLATION_KEY.UDP_FAILED_NOTIFICATION));
        } else {
          notifier.success(t(TRANSLATION_KEY.UDP_OK_NOTIFICATION));
        }
      } catch {
        dispatch(
          testUdpSlice.actions.updateOne({
            data: { id, result: false },
          }),
        );
      } finally {
        dispatch(
          testUdpSlice.actions.updateOne({
            data: { id, loading: false },
          }),
        );
      }
    },
    [dispatch, t],
  );
};
