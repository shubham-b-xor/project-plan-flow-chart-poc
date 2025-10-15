import React from 'react';
import { TextField, Checkbox, Button, Typography, FormControlLabel } from '@mui/material';
import { UIOption } from '../../types';
import icon from '../../assets/svg/undraw_web-app_141a.svg';

interface UIOptionRendererProps {
  option: UIOption;
  onChange: (value: string | boolean) => void;
  disabled?: boolean;
}

export const UIOptionRenderer: React.FC<UIOptionRendererProps> = ({ 
  option, 
  onChange, 
  disabled = false 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (option.inputType === 'Checkbox') {
      onChange(event.target.checked);
    } else {
      onChange(event.target.value);
    }
  };

  const handleButtonClick = () => {
    console.log(`Button clicked: ${option.label}`);
  };

  if (!option.isVisible) {
    return null;
  }

  switch (option.inputType) {
    case 'Textbox':
      return (
        <TextField
          variant={'standard'}
          label={option.label}
          placeholder={''}
          value={option.value as string || ''}
          onChange={handleChange}
          disabled={disabled}
          size="small"
          fullWidth
          margin="dense"
          required={option.validation?.required}
          inputProps={{
            minLength: option.validation?.minLength,
            maxLength: option.validation?.maxLength,
            pattern: option.validation?.pattern,
          }}
          sx={{ mb: 1 }}
        />
      );

    case 'Checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={option.value as boolean || false}
              onChange={handleChange}
              disabled={disabled}
              size="small"
            />
          }
          label={option.uiText || option.label}
          sx={{ mb: 1, display: 'block' }}
        />
      );

    case 'Button':
      return (
        <Button
          variant="contained"
          size="small"
          onClick={handleButtonClick}
          disabled={disabled}
          fullWidth
          sx={{ mb: 1 }}
        >
          {option.uiText || option.label}
        </Button>
      );

    case 'Div':
      return (
        <Typography
          variant="body2"
          sx={{ 
            mb: 1, 
            p: 1, 
            backgroundColor: 'grey.100', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300'
          }}
        >
          {option.uiText || option.label}
        </Typography>
      );

    case 'Image':
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <img width="50%" height="50%" src={icon} alt={icon} />
        </div>
      );

    default:
      return null;
  }
};

export default UIOptionRenderer;