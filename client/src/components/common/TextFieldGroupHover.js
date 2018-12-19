import React from 'react';
import classnames from 'classnames';

const TextFieldGroupHover = ({
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
      <input
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
      {error && <div className="mt-3 mb-2 text-danger">{error}</div>}
    </fieldset>
  );
};

TextFieldGroupHover.defaultProps = {
  type: 'text'
};

export default TextFieldGroupHover;
