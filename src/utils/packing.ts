import type { Pallet, TruckSpec, PlacedPallet, PackResult } from '../types';

export function packPallets(pallets: Pallet[], truck: TruckSpec): PackResult {
  const placements: PlacedPallet[] = [];
  let cursorX = 0;
  let cursorY = 0;
  let currentRowDepth = 0;

  // Track the top of each vertical column: floor-level index -> { topIndex, cumulativeHeight }
  const columnTop = new Map<number, { topIndex: number; cumulativeHeight: number }>();

  for (const pallet of pallets) {
    let placed = false;

    // Phase 1: If stackable, try to stack on an existing column
    if (pallet.stackable) {
      for (let i = 0; i < placements.length; i++) {
        const base = placements[i];
        if (base.stackedOn !== null) continue; // only iterate floor-level pallets
        if (!base.pallet.stackable) continue;
        if (!base.fits) continue;

        const col = columnTop.get(i) ?? { topIndex: i, cumulativeHeight: base.pallet.height };
        const topPallet = placements[col.topIndex].pallet;

        if (!topPallet.stackable) continue;
        if (pallet.width > topPallet.width || pallet.length > topPallet.length) continue;
        if (col.cumulativeHeight + pallet.height > truck.interiorHeight) continue;

        const newIndex = placements.length;
        placements.push({
          pallet,
          x: base.x,
          y: base.y,
          z: col.cumulativeHeight,
          stackedOn: col.topIndex,
          fits: true,
        });
        columnTop.set(i, { topIndex: newIndex, cumulativeHeight: col.cumulativeHeight + pallet.height });
        placed = true;
        break;
      }
    }

    // Phase 2: Place on floor (existing greedy shelf-packing)
    if (!placed) {
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
        z: 0,
        stackedOn: null,
        fits: fitsOnFloor,
      });

      if (fitsOnFloor) {
        cursorX += pallet.width;
        currentRowDepth = Math.max(currentRowDepth, pallet.length);
      }
    }
  }

  const totalWeight = pallets.reduce((sum, p) => sum + (p.weight ?? 0), 0);
  const totalFloorArea = pallets.reduce((sum, p) => sum + p.length * p.width, 0);
  const usedFloorArea = placements
    .filter((p) => p.fits && p.stackedOn === null)
    .reduce((sum, p) => sum + p.pallet.length * p.pallet.width, 0);
  const truckFloorArea = truck.interiorLength * truck.interiorWidth;
  const allFit = placements.every((p) => p.fits);
  const overweight = totalWeight > truck.maxPayload;

  return {
    placements,
    totalWeight,
    totalFloorArea,
    usedFloorArea,
    truckFloorArea,
    weightRemaining: truck.maxPayload - totalWeight,
    floorAreaRemaining: truckFloorArea - usedFloorArea,
    allFit,
    overweight,
  };
}
