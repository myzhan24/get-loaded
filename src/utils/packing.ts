import type { Pallet, TruckSpec, PlacedPallet, PackResult } from '../types';

export function packPallets(pallets: Pallet[], truck: TruckSpec): PackResult {
  const placements: PlacedPallet[] = [];
  let cursorX = 0;
  let cursorY = 0;
  let currentRowDepth = 0;

  for (const pallet of pallets) {
    const tooTall = pallet.height > truck.interiorHeight;

    // Check if pallet fits in remaining row width
    if (cursorX + pallet.width > truck.interiorWidth) {
      // Start new row
      cursorX = 0;
      cursorY += currentRowDepth;
      currentRowDepth = 0;
    }

    const fitsOnFloor =
      !tooTall &&
      cursorX + pallet.width <= truck.interiorWidth &&
      cursorY + pallet.length <= truck.interiorLength;

    placements.push({
      pallet,
      x: cursorX,
      y: cursorY,
      fits: fitsOnFloor,
    });

    if (fitsOnFloor) {
      cursorX += pallet.width;
      currentRowDepth = Math.max(currentRowDepth, pallet.length);
    }
  }

  const totalWeight = pallets.reduce((sum, p) => sum + (p.weight ?? 0), 0);
  const totalFloorArea = pallets.reduce((sum, p) => sum + p.length * p.width, 0);
  const truckFloorArea = truck.interiorLength * truck.interiorWidth;
  const allFit = placements.every((p) => p.fits);
  const overweight = totalWeight > truck.maxPayload;

  return {
    placements,
    totalWeight,
    totalFloorArea,
    truckFloorArea,
    weightRemaining: truck.maxPayload - totalWeight,
    floorAreaRemaining: truckFloorArea - totalFloorArea,
    allFit,
    overweight,
  };
}
