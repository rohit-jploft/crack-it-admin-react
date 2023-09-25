import PropTypes from 'prop-types';
// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

MeetingSortByStatus.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
};

export default function MeetingSortByStatus({ options,value, onSort }) {
  return (
    <TextField select size="small" label="Status" value={value} onChange={onSort} style={{width:"200px", marginRight:"20px"}}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
