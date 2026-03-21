type Section = {
  type: 'section'
  name: string
}

type Ingredient = {
  type: 'kcalPer100g' | 'kcalPerUnit'
  name: string
  kcal: number
  total: number
  hide?: boolean
}

export type Row = Section | Ingredient

export const sectionWithIngredients: Row[] = [
  {
    type: 'section',
    name: 'Breakfast'
  },
  {
    type: 'kcalPer100g',
    name: 'Margarine',
    kcal: 544,
    total: 20
  },
  {
    type: 'kcalPerUnit',
    name: 'Sliced bread',
    kcal: 71,
    total: 2
  }
]

export const collapsedSectionWithIngredients: Row[] = [
  {
    type: 'section',
    name: 'Breakfast'
  },
  // A section is collapsed if all subsequent ingredients
  // until the end of the list or until the next section are hidden
  {
    type: 'kcalPer100g',
    name: 'Margarine',
    kcal: 544,
    total: 20,
    hide: true
  },
  {
    type: 'kcalPerUnit',
    name: 'Sliced bread',
    kcal: 71,
    total: 2,
    hide: true
  }
]
