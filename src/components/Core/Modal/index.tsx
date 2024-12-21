import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useLockBodyScroll } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import styles from "./index.module.css";
import { DismissRegular } from "@fluentui/react-icons";

interface ModalProps {
  children: React.ReactNode;
  close?: () => void;
  onOk?: () => void;
  disabledOk?: boolean;
  loadingOk?: boolean;
  hideCloseButton?: boolean;
  hideOkButton?: boolean;
  closeText?: string;
  okText?: string;
  title?: string;
}

export const Modal = React.memo((props: ModalProps) => {
  const {
    close,
    children,
    onOk,
    disabledOk = false,
    loadingOk = false,
    hideOkButton = false,
    hideCloseButton = false,
    closeText,
    okText,
    title = "",
  } = props;

  const { t } = useTranslation();

  useLockBodyScroll();
  return (
    <Dialog open modalType="alert">
      <DialogSurface>
        <DialogBody>
          {close && (
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<DismissRegular />}
                    onClick={close}
                  />
                </DialogTrigger>
              }
            >
              {title}
            </DialogTitle>
          )}

          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {!hideCloseButton && close && (
              <Button appearance="secondary" onClick={close}>
                {closeText ?? t(TRANSLATION_KEY.FORM_CANCEL)}
              </Button>
            )}
            {!hideOkButton && onOk && (
              <Button
                appearance="primary"
                onClick={onOk}
                disabled={disabledOk || loadingOk}
              >
                {loadingOk && (
                  <Spinner size="extra-tiny" className={styles.spinner} />
                )}

                {okText ?? t(TRANSLATION_KEY.OK)}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
});

Modal.displayName = "Modal";
