import React, { useEffect, useRef, useState } from "react";
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
  Option
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { MenuItemProps } from "@/components/Core";
import styles from "./index.module.css";

type EditItemWithSelectDialogProps = {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: {
    value: string,
    type: DnsTypeEnum
  }) => void;
  value: string;
  disabled?: boolean;
  selectorItems: MenuItemProps[];
  type: DnsTypeEnum
};

export enum DnsTypeEnum {
  Custom = "custom",
  BuiltIn = "builtIn",
}


export default function EditItemWithSelectDialog(props: EditItemWithSelectDialogProps) {
  const {
    title,
    open,
    setOpen,
    value,
    onSubmit,
    disabled = false,
    selectorItems,
    type
  } = props;

  const { t } = useTranslation();
  const [editedValue, setEditedValue] = useState(value);
  const [curType, setCurType] = useState(type);

  const typeOptions = useRef([
    { id: DnsTypeEnum.BuiltIn, content: DnsTypeEnum.BuiltIn },
    { id: DnsTypeEnum.Custom, content: DnsTypeEnum.Custom }
  ]);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);


  return (
    <Dialog
      modalType="modal"
      open={open}
      onOpenChange={(e, data) => {
        setOpen(data.open);
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Input
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
            <div className={styles.selectContainer}>
              <Dropdown
                value={curType}
                onOptionSelect={(e, data) => {
                  setEditedValue("");
                  setCurType(data.optionValue as DnsTypeEnum);
                }}
                className={styles.select}
              >
                {typeOptions.current.map((option) => (
                  <Option key={option.content as string}>
                    {option.content as string}
                  </Option>
                ))}
              </Dropdown>
            </div>
            {
              curType === DnsTypeEnum.BuiltIn ?
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
                </div> :
                <Input
                  required
                  value={editedValue}
                  onChange={(e) => {
                    setEditedValue(e.target.value);
                  }}
                  className={styles.input}
                />
            }
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">{t(TRANSLATION_KEY.CLOSE)}</Button>
            </DialogTrigger>
            <Button
              appearance="primary"
              onClick={() => {
                onSubmit({ value: editedValue, type: curType });
                setOpen(false)
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
