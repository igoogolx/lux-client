import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Input,
  Option,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type MenuItemProps } from "../index";
import styles from "./index.module.css";

interface EditItemWithDialogProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (value: string) => void;
  inputType?: "number";
  value: string;
  disabled?: boolean;
  canReset?: boolean;
  selectorItems?: MenuItemProps[];
  type?: "input" | "selector";
}

export default function EditItemWithDialog(
  props: Readonly<EditItemWithDialogProps>,
) {
  const {
    title,
    open,
    setOpen,
    value,
    onSubmit,
    inputType,
    disabled = false,
    canReset = true,
    selectorItems,
    type = "input",
  } = props;

  const { t } = useTranslation();

  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  return (
    <Dialog
      modalType="alert"
      open={open}
      onOpenChange={(e, data) => {
        setEditedValue(value);
        setOpen(data.open);
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Input
          type={inputType}
          size="medium"
          className={styles.input}
          value={value}
          disabled={disabled}
        />
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent className={styles.dialogBody}>
            {type === "input" ? (
              <Input
                type={inputType}
                required
                value={editedValue}
                onChange={(e) => {
                  setEditedValue(e.target.value);
                }}
                className={styles.input}
              />
            ) : (
              selectorItems && (
                <div className={styles.selectContainer}>
                  <Dropdown
                    value={editedValue}
                    onOptionSelect={(e, data) => {
                      setEditedValue(data.optionValue as string);
                    }}
                    className={styles.select}
                  >
                    {selectorItems.map((option) => (
                      <Option key={option.content as string}>
                        {option.content as string}
                      </Option>
                    ))}
                  </Dropdown>
                  {canReset && (
                    <Button
                      onClick={() => {
                        setEditedValue("");
                      }}
                      className={styles.btn}
                    >
                      {t(TRANSLATION_KEY.FORM_RESET)}
                    </Button>
                  )}
                </div>
              )
            )}
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{t(TRANSLATION_KEY.CLOSE)}</Button>
            </DialogTrigger>
            <Button
              appearance="primary"
              onClick={() => {
                onSubmit(editedValue);
              }}
            >
              {t(TRANSLATION_KEY.FORM_SAVE)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
