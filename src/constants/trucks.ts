import type { TruckType, TruckSpec } from '../types';

export const TRUCKS: Record<TruckType, TruckSpec> = {
  '53ft': {
    name: "53' Trailer",
    interiorLength: 636,
    interiorWidth: 102,
    interiorHeight: 110,
    maxPayload: 45000,
  },
  '26ft': {
    name: "26' Box Truck",
    interiorLength: 312,
    interiorWidth: 96,
    interiorHeight: 96,
    maxPayload: 10000,
  },
};
