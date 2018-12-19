import React from 'react';
import classnames from 'classnames';

const TextAreaFieldGroupHover = ({
  name,
  value,
  label,
  error,
  info,
  type,
  onChange,
  customClass,
  disabled,
  required
}) => {
  return (
    <fieldset>
      <textarea
        id={name}
        name={name}
        value={value}
        type={type}
        className={classnames(
          `${value && value.length > 0 ? 'full ' : ''}${
            customClass ? customClass + ' ' : ''
          }`,
          {
            'is-invalid': error
          }
        )}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={name}>{label}</label>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </fieldset>
  );
};

TextAreaFieldGroupHover.defaultProps = {
  type: 'text'
};

export default TextAreaFieldGroupHover;
