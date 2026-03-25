import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import type { Pallet } from '../types';

interface Props {
  onAdd: (pallet: Pallet) => void;
}

const PRESETS = [
  { label: '48×40 Standard', width: 48, length: 40 },
  { label: '42×42 Square', width: 42, length: 42 },
  { label: '48×48 Large', width: 48, length: 48 },
];

export default function PalletForm({ onAdd }: Props) {
  const [label, setLabel] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const wt = parseFloat(weight);
    if ([l, w, h, wt].some((v) => isNaN(v) || v <= 0)) return;

    onAdd({
      id: crypto.randomUUID(),
      label: label || `Pallet`,
      length: l,
      width: w,
      height: h,
      weight: wt,
    });
    setLabel('');
    setLength('');
    setWidth('');
    setHeight('');
    setWeight('');
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setWidth(String(preset.width));
    setLength(String(preset.length));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Add Pallet
      </Typography>
      <Stack spacing={1.5}>
        <TextField
          label="Label (optional)"
          size="small"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          fullWidth
        />
        <Stack direction="row" spacing={1}>
          <TextField
            label="Length (in)"
            size="small"
            type="number"
            required
            value={length}
            onChange={(e) => setLength(e.target.value)}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Width (in)"
            size="small"
            type="number"
            required
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Height (in)"
            size="small"
            type="number"
            required
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Weight (lbs)"
            size="small"
            type="number"
            required
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputProps={{ min: 1 }}
          />
        </Stack>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <Chip
              key={p.label}
              label={p.label}
              size="small"
              variant="outlined"
              onClick={() => applyPreset(p)}
            />
          ))}
        </Box>
        <Button type="submit" variant="contained" startIcon={<AddIcon />}>
          Add Pallet
        </Button>
      </Stack>
    </Box>
  );
}
