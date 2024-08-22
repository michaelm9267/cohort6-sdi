import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart } from '../../../components/chart';

export const LogisticsVehiclesOverview = (props) => {
  const { chartSeries, labels } = props;
  // const chartOptions = useChartOptions(labels);
  const total = chartSeries.reduce((acc, item) => (acc += item), 0);

  return (
    <Card>
      <CardHeader title="Vehicles Overview" />
      <Box sx={{ p: 3 }}>
        <Grid
          alignItems="center"
          container
          spacing={3}
        >
          <Grid
            xs={12}
            md={6}
          >
            {/* <Chart
              height={300}
              // options={chartOptions}
              series={chartSeries}
              type="radialBar"
            /> */}
          </Grid>
          <Grid
            xs={12}
            md={6}
          >
            <Stack spacing={3}>
              <div>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  Total
                </Typography>
                <Typography variant="h5">{total}</Typography>
              </div>
              <List disablePadding>
                {chartSeries.map((item, index) => (
                  <ListItem
                    disableGutters
                    key={index}
                    sx={{ display: 'flex' }}
                  >
                    <Box
                      sx={{
                        // backgroundColor: chartOptions.colors[index],
                        borderRadius: '4px',
                        height: 16,
                        mr: 1,
                        width: 16,
                      }}
                    />
                    <Typography
                      color="text.secondary"
                      variant="body2"
                    >
                      {labels[index]}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="subtitle2">{item}</Typography>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

LogisticsVehiclesOverview.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};
