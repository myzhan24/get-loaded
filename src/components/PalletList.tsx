import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Pallet, PackResult } from '../types';

interface Props {
  pallets: Pallet[];
  packResult: PackResult;
  onDelete: (id: string) => void;
}

export default function PalletList({ pallets, packResult, onDelete }: Props) {
  if (pallets.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        No pallets added yet.
      </Typography>
    );
  }

  const fitMap = new Map(
    packResult.placements.map((p) => [p.pallet.id, p.fits])
  );

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>L×W×H (in)</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {pallets.map((p, i) => {
            const fits = fitMap.get(p.id) ?? true;
            return (
              <TableRow
                key={p.id}
                sx={!fits ? { bgcolor: 'error.light', '& td': { color: 'error.contrastText' } } : undefined}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{p.label}</TableCell>
                <TableCell>
                  {p.length}×{p.width}×{p.height}
                </TableCell>
                <TableCell>{p.weight.toLocaleString()} lbs</TableCell>
                <TableCell padding="none">
                  <IconButton size="small" onClick={() => onDelete(p.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
