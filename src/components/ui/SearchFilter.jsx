import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';

// PROPS TO PASS IN TO SearchBar
// value={search}
// onSearch={setSearch}
// handleClearClick={() => setSearch('')}
// placeholder='Search for event, plant, category or month'
// found={found}
// helpertext='Search for event, plant, category or month'

const SearchBar = props => {

  // const { search, setSearch, error, setError } = props;
  // const helpertext = 'Search for event, plant, category or month';
  const helpersuccess = `${props.found.length} result${props.found.length === 1 ? '': 's'} found`;
  // console.log(props.found.length)
  // console.log(props.value)
  return (
    <FormControl sx={{ m: 2 }}>
      <InputLabel htmlFor='outlined-adornment-amount'>Search</InputLabel>
      <OutlinedInput
        id='outlined-adornment-amount'
        type='text'
        // fullWidth
        // helperText='Search by name'
        placeholder={props.placeholder}
        size='small'
        onChange={e => props.onSearch(e.target.value.toLowerCase())}
        value={props.value}
        success={props.found}
        error={props.found.length === 0}
        endAdornment={
          <IconButton
            sx={{ visibility: props.value ? 'visible' : 'hidden' }}
            onClick={props.handleClearClick}>
            <ClearIcon />
          </IconButton>
        }
        startAdornment={
          <InputAdornment position='end'>
            <SearchIcon />
          </InputAdornment>
        }
        label='Search'
      />
      <FormHelperText>
        {props.value !== '' && props.found ? helpersuccess : props.helpertext}
      </FormHelperText>
    </FormControl>
  );
};

export default SearchBar;
