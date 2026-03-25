import type { TruckType, TruckSpec } from '../types';

export const TRUCKS: Record<TruckType, TruckSpec> = {
  '53ft': {
    name: "53' Trailer",
    interiorLength: 630,
    interiorWidth: 102,
    interiorHeight: 108,
    maxPayload: 45000,
  },
  '26ft': {
    name: "26' Box Truck",
    interiorLength: 311,
    interiorWidth: 97,
    interiorHeight: 103,
    maxPayload: 10000,
  },
};
