import { init } from "@paralleldrive/cuid2";

export const generateId = init({
  random: Math.random,
  length: 16,
});