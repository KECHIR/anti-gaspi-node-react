import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import "moment/locale/fr"

export default function FormikDateInput({ formik, formikFieldName, formikFieldLabel, dateFormat, spacing }) {
    return <div className='from-field-wrap'>
        <div>
            <label>
                <span className='form-label-field'> {formikFieldLabel} </span>
            </label>
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fr"  >
                <Stack spacing={spacing}>
                    <DesktopDatePicker
                        disablePast={true}
                        name={formikFieldName}
                        inputFormat={dateFormat}
                        value={formik.values[formikFieldName]}
                        onChange={(val) => formik.setFieldValue(`${formikFieldName}`, val)}
                        renderInput={(params) => <TextField  {...params} />}
                    />
                </Stack>
            </LocalizationProvider>
        </div>
        {formik.errors[formikFieldName] ? <span className='form-label-field text-feedback'> {formik.errors[formikFieldName]} </span> : null}
    </div>;
}