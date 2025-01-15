
import { z } from 'zod';

export const kindergartenSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
});