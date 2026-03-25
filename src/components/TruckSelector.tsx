import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { TruckType } from '../types';
import { TRUCKS } from '../constants/trucks';

interface Props {
  value: TruckType;
  onChange: (value: TruckType) => void;
}

export default function TruckSelector({ value, onChange }: Props) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Truck Type
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, v) => v && onChange(v)}
        fullWidth
        size="small"
      >
        {(Object.keys(TRUCKS) as TruckType[]).map((key) => (
          <ToggleButton key={key} value={key}>
            {TRUCKS[key].name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
