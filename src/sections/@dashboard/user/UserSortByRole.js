import PropTypes from 'prop-types';
// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

UserSortByRole.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
};

export default function UserSortByRole({ options,value, onSort }) {
  return (
    <TextField select size="small" defaultValue=""  value={value} label="Role" onChange={onSort} style={{width:"200px", marginRight:"20px"}}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
