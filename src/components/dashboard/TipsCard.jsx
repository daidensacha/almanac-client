// src/components/dashboard/TipsCard.jsx
import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from '@mui/material';
export default function TipsCard() {
  return (
    <Card>
      <CardHeader title="Tips & Notes" />
      <CardContent>
        <List dense>
          <ListItem>
            <ListItemText primary="Mulch now to retain soil moisture." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Stake peas against wind gusts." />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
