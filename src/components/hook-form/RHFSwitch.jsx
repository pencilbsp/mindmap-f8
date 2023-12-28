// form
import { useFormContext, Controller } from "react-hook-form"

import { Switch } from "../ui/switch"
// @mui
// ----------------------------------------------------------------------

export default function RHFSwitch({ name, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Switch
            {...field}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange({ target: { value: checked } })}
          />
        )
      }}
    />
  )
}
