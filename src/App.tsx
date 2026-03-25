import { useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Header from './components/Header';
import TruckSelector from './components/TruckSelector';
import PalletGrid from './components/PalletGrid';
import TruckDiagram from './components/TruckDiagram';
import TruckInfo from './components/TruckInfo';
import CapacityStats from './components/CapacityStats';
import type { PalletRow, Pallet, TruckType } from './types';
import { TRUCKS } from './constants/trucks';
import { packPallets } from './utils/packing';

function createEmptyRow(): PalletRow {
  return { id: crypto.randomUUID(), stackable: null, quantity: null, length: null, width: null, height: null, weight: null };
}

function rowsToPallets(rows: PalletRow[]): Pallet[] {
  const pallets: Pallet[] = [];
  for (const r of rows) {
    if (r.length == null || r.width == null || r.height == null || r.length <= 0 || r.width <= 0 || r.height <= 0) continue;
    const qty = r.quantity != null && r.quantity > 0 ? r.quantity : 1;
    for (let i = 0; i < qty; i++) {
      pallets.push({
        id: `${r.id}-${i}`,
        length: r.length,
        width: r.width,
        height: r.height,
        weight: r.weight ?? undefined,
        stackable: r.stackable ?? false,
      });
    }
  }
  return pallets;
}

export default function App() {
  const [rows, setRows] = useState<PalletRow[]>(() => Array.from({ length: 10 }, createEmptyRow));
  const [truckType, setTruckType] = useState<TruckType>('53ft');

  const truck = TRUCKS[truckType];
  const pallets = useMemo(() => rowsToPallets(rows), [rows]);
  const packResult = useMemo(() => packPallets(pallets, truck), [pallets, truck]);

  const clearRows = () => setRows(Array.from({ length: 10 }, createEmptyRow));

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <TruckSelector value={truckType} onChange={setTruckType} />
              <PalletGrid rows={rows} onChange={setRows} onClear={clearRows} packResult={packResult} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Paper sx={{ p: 2 }}>
              <TruckDiagram truck={truck} packResult={packResult} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <TruckInfo truck={truck} />
              <CapacityStats packResult={packResult} truck={truck} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
