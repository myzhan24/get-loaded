import {
  DynamicDataSheetGrid,
  floatColumn,
  intColumn,
  keyColumn,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import type { PalletRow, PackResult } from '../types';

interface Props {
  rows: PalletRow[];
  onChange: (rows: PalletRow[]) => void;
  onClear: () => void;
  packResult: PackResult;
}

const columns = [
  { ...keyColumn('quantity', intColumn), title: 'Qty', minWidth: 60 },
  { ...keyColumn('length', floatColumn), title: 'Length (in)', minWidth: 100 },
  { ...keyColumn('width', floatColumn), title: 'Width (in)', minWidth: 100 },
  { ...keyColumn('height', floatColumn), title: 'Height (in)', minWidth: 100 },
  { ...keyColumn('weight', floatColumn), title: 'Weight (lbs)', minWidth: 100 },
];

export default function PalletGrid({ rows, onChange, onClear, packResult }: Props) {
  const fitMap = new Map(
    packResult.placements.map((p) => [p.pallet.id, p.fits])
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">Pallets</Typography>
        <Button size="small" startIcon={<ClearAllIcon />} onClick={onClear}>
          Clear
        </Button>
      </Box>
      <DynamicDataSheetGrid
        value={rows}
        onChange={onChange as (value: Record<string, any>[]) => void}
        columns={columns}
        createRow={() => ({ id: crypto.randomUUID(), quantity: null, length: null, width: null, height: null, weight: null })}
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
