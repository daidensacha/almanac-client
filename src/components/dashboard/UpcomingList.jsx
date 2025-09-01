import { useState, useMemo } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

export default function UpcomingList({ events = [] }) {
  const [range, setRange] = useState('1m'); // '1w' | '1m' | '3m' | 'all'
  const [filter, setFilter] = useState(''); // plant/category text

  const handleRange = (_e, val) => {
    if (val !== null) setRange(val); // MUI passes null when deselecting
  };
  const handleFilter = (e) => setFilter(e.target.value);

  // TODO: replace with real filtering once events are wired
  const filtered = useMemo(() => {
    let list = events;
    if (filter.trim()) {
      const q = filter.toLowerCase();
      list = list.filter(
        (ev) =>
          (ev.title || '').toLowerCase().includes(q) ||
          (ev.plantName || '').toLowerCase().includes(q) ||
          (ev.categoryName || '').toLowerCase().includes(q),
      );
    }
    // range filter stub
    // e.g., compute cutoff date by range and filter by ev.date
    return list;
  }, [events, filter, range]);

  const rangeLabel = {
    '1w': 'Next 7 days',
    '1m': 'Next 30 days',
    '3m': 'Next 90 days',
    all: 'All',
  }[range];

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Events
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 1 }}
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
      >
        <ToggleButtonGroup size="small" exclusive value={range} onChange={handleRange}>
          <ToggleButton value="1w">1w</ToggleButton>
          <ToggleButton value="1m">1m</ToggleButton>
          <ToggleButton value="3m">3m</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          size="small"
          label="Plant/Category"
          value={filter}
          onChange={handleFilter}
          sx={{ minWidth: 220 }}
        />
      </Stack>

      <List dense disablePadding>
        {filtered.length === 0 ? (
          <ListItem>
            <ListItemText primary="[No events yet]" secondary="Add events to see them here" />
          </ListItem>
        ) : (
          filtered.map((ev) => (
            <ListItem key={ev.id}>
              <ListItemText
                primary={ev.title || 'Untitled event'}
                secondary={ev.date ? new Date(ev.date).toLocaleDateString() : null}
              />
            </ListItem>
          ))
        )}
      </List>

      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" color="text.secondary">
        Filter: {filter ? `"${filter}"` : '[All]'} • Range: [{rangeLabel}]
      </Typography>
    </Paper>
  );
}
