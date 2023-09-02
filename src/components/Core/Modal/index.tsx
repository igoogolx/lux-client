import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTrigger,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "../../../hooks";
import { TRANSLATION_KEY } from "../../../i18n/locales/key";

type ModalProps = {
  children: React.ReactNode;
  close?: () => void;
  closeWhenClickOutside?: boolean;
  onOk?: () => void;
  disabledOk?: boolean;
  loadingOk?: boolean;
  hideCloseButton?: boolean;
  hideOkButton?: boolean;
  closeText?: string;
  okText?: string;
};

export const Modal = React.memo((props: ModalProps) => {
  const {
    close,
    children,
    closeWhenClickOutside = false,
    onOk,
    disabledOk = false,
    loadingOk = false,
    hideOkButton = false,
    hideCloseButton = false,
    closeText,
    okText,
  } = props;

  const { t } = useTranslation();

  useLockBodyScroll();
  return (
    <Dialog
      open
      onOpenChange={(e, data) => {
        if (!data.open) {
          close?.();
        }
      }}
      modalType={closeWhenClickOutside ? "alert" : "modal"}
    >
      <DialogSurface>
        <DialogBody>
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {!hideCloseButton && close && (
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">
                  {closeText || t(TRANSLATION_KEY.CLOSE)}
                </Button>
              </DialogTrigger>
            )}
            {!hideOkButton && onOk && (
              <Button
                appearance="primary"
                onClick={onOk}
                disabled={disabledOk || loadingOk}
              >
                {okText || t(TRANSLATION_KEY.OK)}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
});
