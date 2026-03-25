import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { TruckSpec } from '../types';

interface Props {
  truck: TruckSpec;
}

function inToFt(inches: number): string {
  const ft = Math.floor(inches / 12);
  const rem = Math.round(inches % 12);
  return rem > 0 ? `${ft}'${rem}"` : `${ft}'`;
}

export default function TruckInfo({ truck }: Props) {
  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        {truck.name} — Interior
      </Typography>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell component="th">Length</TableCell>
            <TableCell align="right">{truck.interiorLength}" ({inToFt(truck.interiorLength)})</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Width</TableCell>
            <TableCell align="right">{truck.interiorWidth}" ({inToFt(truck.interiorWidth)})</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Height</TableCell>
            <TableCell align="right">{truck.interiorHeight}" ({inToFt(truck.interiorHeight)})</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">Max Payload</TableCell>
            <TableCell align="right">{truck.maxPayload.toLocaleString()} lbs</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
