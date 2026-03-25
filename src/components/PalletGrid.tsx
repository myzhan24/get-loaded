import {
  DynamicDataSheetGrid,
  floatColumn,
  intColumn,
  keyColumn,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';
import Typography from '@mui/material/Typography';
import type { PalletRow, PackResult } from '../types';

interface Props {
  rows: PalletRow[];
  onChange: (rows: PalletRow[]) => void;
  packResult: PackResult;
}

const columns = [
  { ...keyColumn('quantity', intColumn), title: 'Qty', minWidth: 60 },
  { ...keyColumn('length', floatColumn), title: 'Length (in)', minWidth: 100 },
  { ...keyColumn('width', floatColumn), title: 'Width (in)', minWidth: 100 },
  { ...keyColumn('height', floatColumn), title: 'Height (in)', minWidth: 100 },
  { ...keyColumn('weight', floatColumn), title: 'Weight (lbs)', minWidth: 100 },
];

export default function PalletGrid({ rows, onChange, packResult }: Props) {
  const fitMap = new Map(
    packResult.placements.map((p) => [p.pallet.id, p.fits])
  );

  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Pallets
      </Typography>
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
