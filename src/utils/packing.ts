import type { Pallet, TruckSpec, PlacedPallet, PackResult } from '../types';

export function packPallets(pallets: Pallet[], truck: TruckSpec): PackResult {
  const placements: PlacedPallet[] = [];
  let cursorX = 0;
  let cursorY = 0;
  let currentRowDepth = 0;

  // Track which floor-level placements already have a pallet stacked on them
  const hasStack = new Set<number>();

  for (const pallet of pallets) {
    let placed = false;

    // Phase 1: If stackable, try to stack on an existing floor pallet
    if (pallet.stackable) {
      for (let i = 0; i < placements.length; i++) {
        const base = placements[i];
        if (base.stackedOn !== null) continue; // only stack on floor-level pallets
        if (!base.pallet.stackable) continue; // base must be stackable too
        if (hasStack.has(i)) continue; // single-level stacking only
        if (!base.fits) continue; // don't stack on non-fitting pallets
        if (pallet.width > base.pallet.width || pallet.length > base.pallet.length) continue; // footprint check
        if (base.pallet.height + pallet.height > truck.interiorHeight) continue; // height check

        placements.push({
          pallet,
          x: base.x,
          y: base.y,
          z: base.pallet.height,
          stackedOn: i,
          fits: true,
        });
        hasStack.add(i);
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
