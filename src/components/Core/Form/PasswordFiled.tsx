import React, { useState } from 'react'
import { Button } from '@fluentui/react-components'
import { EyeOffRegular, EyeRegular } from '@fluentui/react-icons'
import { Field, type FieldProps } from './Field'

type PasswordFiledProps<T extends string> = Omit<FieldProps<T>, 'type'>

export function PasswordFiled<T extends string> (props: PasswordFiledProps<T>) {
  const [isShowPassword, setIsShowPassword] = useState(false)

  return (
    <Field
      type={isShowPassword ? 'text' : 'password'}
      adornment={
        <Button
          onClick={() => { setIsShowPassword(!isShowPassword) }}
          appearance="transparent"
          size="small"
          icon={isShowPassword ? <EyeRegular /> : <EyeOffRegular />}
        />
      }
      {...props}
    />
  )
}
