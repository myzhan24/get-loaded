import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
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

  // Undo/redo history
  const historyRef = useRef<PalletRow[][]>([]);
  const futureRef = useRef<PalletRow[][]>([]);
  const pushHistory = useCallback((prev: PalletRow[]) => {
    historyRef.current = [...historyRef.current, prev];
    futureRef.current = [];
  }, []);

  const handleRowsChange = useCallback((newRows: PalletRow[]) => {
    setRows((prev) => {
      pushHistory(prev);
      return newRows;
    });
  }, [pushHistory]);

  const canUndo = historyRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setRows((current) => {
      futureRef.current = [...futureRef.current, current];
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    setRows((current) => {
      historyRef.current = [...historyRef.current, current];
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (mod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (mod && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const truck = TRUCKS[truckType];
  const pallets = useMemo(() => rowsToPallets(rows), [rows]);
  const packResult = useMemo(() => packPallets(pallets, truck), [pallets, truck]);

  const clearRows = () => handleRowsChange(Array.from({ length: 10 }, createEmptyRow));

  const cardSx = { p: 2, backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)' };

  return (
    <Box sx={{ backgroundImage: `url(${import.meta.env.BASE_URL}644729.png)`, backgroundSize: 'cover', backgroundRepeat: 'repeat', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={cardSx}>
              <TruckSelector value={truckType} onChange={setTruckType} />
              <PalletGrid rows={rows} onChange={handleRowsChange} onClear={clearRows} onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} packResult={packResult} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Paper sx={cardSx}>
              <TruckDiagram truck={truck} packResult={packResult} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={cardSx}>
              <TruckInfo truck={truck} />
              <CapacityStats packResult={packResult} truck={truck} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
