import { ErrorMessage, Field } from 'formik';

export default function FormikTextInput({ fieldClassName, labelName, type, id, name, component, rows, maxLength }) {

    const formikFieldProps = { className: fieldClassName, type, id, name, component, rows };
    if (maxLength) {
        formikFieldProps.maxLength = maxLength;
    }

    // className={fieldClassName || 'tds-form-input'} type={type} id={id} name={name} rows={rows} component={component}

    return <div className='from-field-wrap'>
        <div>
            <label>
                <span className='form-label-field'> {labelName} </span>
            </label>
        </div>
        <div>
            <Field {...formikFieldProps} />
        </div>
        <ErrorMessage name={name} className='form-label-field text-feedback' component="span" />
    </div>
}