export const bulbasaurChain = {
  chain: {
    species: {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
    },
    evolves_to: [
      {
        species: {
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon-species/2/',
        },
        evolves_to: [
          {
            species: {
              name: 'venusaur',
              url: 'https://pokeapi.co/api/v2/pokemon-species/3/',
            },
            evolves_to: [],
          },
        ],
      },
    ],
  },
};

export const singleStageChain = {
  chain: {
    species: {
      name: 'ditto',
      url: 'https://pokeapi.co/api/v2/pokemon-species/132/',
    },
    evolves_to: [],
  },
};
