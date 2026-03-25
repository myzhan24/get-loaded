import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import type { PackResult, TruckSpec } from '../types';

interface Props {
  packResult: PackResult;
  truck: TruckSpec;
}

function StatBar({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }) {
  const pct = Math.min((used / total) * 100, 100);
  const over = used > total;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight="bold">
          {used.toLocaleString()} / {total.toLocaleString()} {unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={over ? 'error' : pct > 85 ? 'warning' : 'primary'}
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Box>
  );
}

export default function CapacityStats({ packResult, truck }: Props) {
  const fittingCount = packResult.placements.filter((p) => p.fits).length;
  const totalCount = packResult.placements.length;

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Capacity
        </Typography>
        <Stack spacing={2}>
          <StatBar
            label="Weight"
            used={packResult.totalWeight}
            total={truck.maxPayload}
            unit="lbs"
          />
          <StatBar
            label="Floor Area"
            used={packResult.totalFloorArea}
            total={packResult.truckFloorArea}
            unit="sq in"
          />
          <Typography variant="body2">
            Pallets loaded: {fittingCount} / {totalCount}
          </Typography>
          {packResult.overweight && (
            <Alert severity="error" variant="filled">
              Over weight limit by {(packResult.totalWeight - truck.maxPayload).toLocaleString()} lbs
            </Alert>
          )}
          {!packResult.allFit && (
            <Alert severity="warning" variant="filled">
              {totalCount - fittingCount} pallet(s) do not fit on the truck floor
            </Alert>
          )}
          {packResult.allFit && !packResult.overweight && totalCount > 0 && (
            <Alert severity="success">All pallets fit!</Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
