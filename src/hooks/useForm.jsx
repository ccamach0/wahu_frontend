import { useState, useCallback } from 'react';

/**
 * Hook para manejar formularios
 * Soporta: validación, submit, reset, múltiples campos
 */
export function useForm(initialValues = {}, onSubmit, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (validate) {
      const fieldError = validate({ [name]: values[name] })[name];
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError || undefined,
      }));
    }
  }, [values, validate]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      setIsSubmitting(true);

      try {
        // Validar
        if (validate) {
          const newErrors = validate(values);
          setErrors(newErrors);

          if (Object.keys(newErrors).length > 0) {
            setIsSubmitting(false);
            return;
          }
        }

        // Submit
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    setFieldError,
    setValues,
  };
}

/**
 * Hook para manejar un campo de formulario único
 */
export function useField(initialValue = '', validate) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (validate && touched) {
      const newError = validate(newValue);
      setError(newError || '');
    }
  }, [validate, touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      const newError = validate(value);
      setError(newError || '');
    }
  }, [value, validate]);

  return {
    value,
    error,
    touched,
    bind: {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    },
    setValue,
    setError,
    reset: () => {
      setValue(initialValue);
      setError('');
      setTouched(false);
    },
  };
}
