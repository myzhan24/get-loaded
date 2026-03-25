export interface Pallet {
  id: string;
  label: string;
  length: number; // inches (depth into truck)
  width: number; // inches (across truck width)
  height: number; // inches
  weight: number; // lbs
}

export interface TruckSpec {
  name: string;
  interiorLength: number; // inches
  interiorWidth: number; // inches
  interiorHeight: number; // inches
  maxPayload: number; // lbs
}

export type TruckType = '53ft' | '26ft';

export interface PlacedPallet {
  pallet: Pallet;
  x: number; // position from left wall (inches)
  y: number; // position from front wall (inches)
  fits: boolean;
}

export interface PackResult {
  placements: PlacedPallet[];
  totalWeight: number;
  totalFloorArea: number;
  truckFloorArea: number;
  weightRemaining: number;
  floorAreaRemaining: number;
  allFit: boolean;
  overweight: boolean;
}
