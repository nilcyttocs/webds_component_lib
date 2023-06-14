import React from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export const ConfigInput = (props: any): JSX.Element => {
  return (
    <div>
      <Typography sx={{ fontWeight: 'bold' }}>
        {props.configEntry.name}
      </Typography>
      <div
        style={{
          width: '100%',
          marginTop: '8px',
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {props.configEntry.elements > 1 ? (
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Values:&nbsp;
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Value:&nbsp;
          </Typography>
        )}
        <Tooltip title={props.tooltip} arrow>
          <TextField
            variant="standard"
            value={props.inputValue !== undefined ? props.inputValue : ''}
            inputProps={{ style: { textAlign: 'center' } }}
            onChange={event => props.handleInputValueChange(event.target.value)}
            sx={{
              width: 48 * props.configEntry.elements + 'px',
              display: 'inline-block',
              '& .MuiInput-root': {
                width: '100%',
                fontSize: '0.875rem'
              },
              '& .MuiInput-input': {
                padding: 0,
                color:
                  props.inputValueColor !== undefined
                    ? props.inputValueColor
                    : null
              }
            }}
          />
        </Tooltip>
        {props.inputValueUnits && (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.65rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            &nbsp;({props.inputValueUnits})
          </Typography>
        )}
      </div>
      <div style={{ marginTop: '8px' }}>
        <Stack spacing={5} direction="row">
          <div>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Type
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {props.configEntry.type}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Min
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}
            >
              {props.configEntry.min}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Max
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}
            >
              {props.configEntry.max}
            </Typography>
          </div>
          {props.configEntry.elements > 1 && (
            <div>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Elements
              </Typography>
              <Typography
                variant="body2"
                sx={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}
              >
                {props.configEntry.elements}
              </Typography>
            </div>
          )}
        </Stack>
        {props.configEntry.description && (
          <div style={{ marginTop: '8px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {props.configEntry.description.trim()}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
