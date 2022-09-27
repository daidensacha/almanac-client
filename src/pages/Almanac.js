import { useState } from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Events from './Events';
import Categories from './Categories';

// import TabPanel from '@mui/lab/TabPanel';

import Box from '@mui/material/Box';
import AnimatedPage from '../components/AnimatedPage';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const Almanac = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  return (
    <AnimatedPage>
      <Container component='main' maxWidth='lg'>
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {/* <h1>Almanac Page</h1>
          <p>Coming soon...</p> */}
          <Box sx={{ maxWidth: { xs: 720, sm: 880 , md: 1100}, bgcolor: 'background.paper' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label="Almanac" />
              <Tab label="Events" />
              <Tab label="Plants" />
              <Tab label="Categories" />
              <Tab label="Calendar" />
              {/* <Tab label="Item Six" />
              <Tab label="Item Seven" /> */}
            </Tabs>
            <TabPanel value={value} index={0}>
              Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Events />
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Categories />
            </TabPanel>
            <TabPanel value={value} index={4}>
              Item Five
            </TabPanel>
          </Box>
        </Box>
      </Container>
    </AnimatedPage>
  )
}

export default Almanac;