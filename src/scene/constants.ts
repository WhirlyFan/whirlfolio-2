/** Special selection ids for non-career nodes. */
export const PROFILE_ID = '__profile__'
export const FUNFACTS_ID = '__funfacts__'
export const PHOTOS_ID = '__photos__'

/** Galaxy generation parameters — shared by the dust cloud and the star layout
 *  so career stars sit ON the spiral arms. */
export const GALAXY = {
  radius: 11,
  branches: 4, // one arm per career-section type (experience/education/project/research)
  spin: 0.9,
  randomness: 0.28,
  randomnessPower: 2.6,
  insideColor: '#ffd9a0', // warm core
  outsideColor: '#6aa6ff', // cool rim
} as const
