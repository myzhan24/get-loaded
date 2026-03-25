import { useState, useMemo } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Header from './components/Header';
import TruckSelector from './components/TruckSelector';
import PalletForm from './components/PalletForm';
import PalletList from './components/PalletList';
import TruckDiagram from './components/TruckDiagram';
import CapacityStats from './components/CapacityStats';
import type { Pallet, TruckType } from './types';
import { TRUCKS } from './constants/trucks';
import { packPallets } from './utils/packing';

export default function App() {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [truckType, setTruckType] = useState<TruckType>('53ft');

  const truck = TRUCKS[truckType];
  const packResult = useMemo(() => packPallets(pallets, truck), [pallets, truck]);

  const addPallet = (pallet: Pallet) => setPallets((prev) => [...prev, pallet]);
  const deletePallet = (id: string) => setPallets((prev) => prev.filter((p) => p.id !== id));

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2 }}>
              <TruckSelector value={truckType} onChange={setTruckType} />
              <PalletForm onAdd={addPallet} />
              <PalletList pallets={pallets} packResult={packResult} onDelete={deletePallet} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 2 }}>
              <TruckDiagram truck={truck} packResult={packResult} />
              <CapacityStats packResult={packResult} truck={truck} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
