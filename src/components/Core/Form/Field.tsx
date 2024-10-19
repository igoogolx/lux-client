import React from 'react'
import { useField } from 'formik'
import {
  Field as FluentInput,
  Input,
  type InputProps
} from '@fluentui/react-components'

export interface FieldProps<T extends string> {
  name: T
  validate?: (value: string) => string
  label?: string
  type?: InputProps['type']
  adornment?: InputProps['contentBefore']
  disabled?: boolean
  className?: string
}

export function Field<T extends string> (props: FieldProps<T>) {
  const { name, label, validate, type, adornment, disabled = false, className } = props
  const [field, meta] = useField({ name, validate })
  return (
    <FluentInput
      label={label}
      validationMessage={meta.error ? meta.error : null}
      className={className}
    >
      <Input
        {...field}
        type={type}
        contentAfter={adornment}
        disabled={disabled}
      />
    </FluentInput>
  )
}
