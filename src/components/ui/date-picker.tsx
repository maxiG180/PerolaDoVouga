'use client'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/pt'

interface DatePickerProps {
    value: Date | null
    onChange: (date: Date | null) => void
    label?: string
    disabled?: boolean
}

export function DatePicker({ value, onChange, label, disabled }: DatePickerProps) {
    const handleChange = (newValue: Dayjs | null) => {
        onChange(newValue ? newValue.toDate() : null)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
            <MuiDatePicker
                label={label}
                value={value ? dayjs(value) : null}
                onChange={handleChange}
                disabled={disabled}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        size: 'medium',
                    }
                }}
            />
        </LocalizationProvider>
    )
}
