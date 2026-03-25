import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TruckSpec, PackResult } from '../types';

const PALLET_COLORS = [
  '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc',
  '#ef5350', '#26c6da', '#ffca28', '#8d6e63',
  '#78909c', '#ec407a', '#5c6bc0', '#9ccc65',
];

interface Props {
  truck: TruckSpec;
  packResult: PackResult;
}

export default function TruckDiagram({ truck, packResult }: Props) {
  const padding = 10;
  const viewW = truck.interiorWidth + padding * 2;
  const viewH = truck.interiorLength + padding * 2;

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Top-Down View — {truck.name}
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxHeight: 500,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          style={{ width: '100%', maxHeight: 500, border: '1px solid #ccc', borderRadius: 4 }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Truck outline */}
          <rect
            x={padding}
            y={padding}
            width={truck.interiorWidth}
            height={truck.interiorLength}
            fill="#f5f5f5"
            stroke="#333"
            strokeWidth={2}
          />

          {/* Rear opening indicator */}
          <line
            x1={padding + 4}
            y1={padding + truck.interiorLength}
            x2={padding + truck.interiorWidth - 4}
            y2={padding + truck.interiorLength}
            stroke="#ff9800"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <text
            x={padding + truck.interiorWidth / 2}
            y={padding + truck.interiorLength + 8}
            textAnchor="middle"
            fontSize={6}
            fill="#666"
          >
            REAR DOOR
          </text>

          {/* Placed pallets */}
          {packResult.placements.map((placement, i) => {
            if (!placement.fits) return null;
            const { pallet, x, y } = placement;
            const color = PALLET_COLORS[i % PALLET_COLORS.length];
            return (
              <g key={pallet.id}>
                <rect
                  x={padding + x}
                  y={padding + y}
                  width={pallet.width}
                  height={pallet.length}
                  fill={color}
                  fillOpacity={0.7}
                  stroke={color}
                  strokeWidth={1}
                />
                <text
                  x={padding + x + pallet.width / 2}
                  y={padding + y + pallet.length / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={Math.min(pallet.width, pallet.length) * 0.35}
                  fill="#fff"
                  fontWeight="bold"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    </Box>
  );
}
