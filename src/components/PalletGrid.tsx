import {
  DynamicDataSheetGrid,
  checkboxColumn,
  floatColumn,
  intColumn,
  keyColumn,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import type { PalletRow, PackResult } from '../types';

interface Props {
  rows: PalletRow[];
  onChange: (rows: PalletRow[]) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  packResult: PackResult;
}

const columns = [
  { ...keyColumn('stackable', checkboxColumn), title: 'Stack', minWidth: 50 },
  { ...keyColumn('quantity', intColumn), title: 'Qty', minWidth: 60 },
  { ...keyColumn('length', floatColumn), title: 'Length (in)', minWidth: 100 },
  { ...keyColumn('width', floatColumn), title: 'Width (in)', minWidth: 100 },
  { ...keyColumn('height', floatColumn), title: 'Height (in)', minWidth: 100 },
  { ...keyColumn('weight', floatColumn), title: 'Weight (lbs)', minWidth: 100 },
];

export default function PalletGrid({ rows, onChange, onClear, onUndo, onRedo, canUndo, canRedo, packResult }: Props) {
  const fitMap = new Map(
    packResult.placements.map((p) => [p.pallet.id, p.fits])
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">Pallets</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Undo (Ctrl+Z)">
            <span>
              <IconButton size="small" onClick={onUndo} disabled={!canUndo}>
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo (Ctrl+Shift+Z)">
            <span>
              <IconButton size="small" onClick={onRedo} disabled={!canRedo}>
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Button size="small" startIcon={<DeleteOutlineIcon />} onClick={onClear}>
            Clear
          </Button>
        </Box>
      </Box>
      <DynamicDataSheetGrid
        value={rows}
        onChange={onChange as (value: Record<string, any>[]) => void}
        columns={columns}
        createRow={() => ({ id: crypto.randomUUID(), stackable: null, quantity: null, length: null, width: null, height: null, weight: null })}
        rowClassName={({ rowData }) => {
          const fits = fitMap.get(rowData.id);
          if (fits === false) return 'row-no-fit';
          return undefined;
        }}
        autoAddRow
        lockRows={false}
      />
      <style>{`
        .row-no-fit .dsg-cell {
          background-color: #ffebee !important;
        }
      `}</style>
    </>
  );
}
