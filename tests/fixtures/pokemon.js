export const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  base_experience: 64,
  height: 7,
  weight: 69,
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [
    { ability: { name: 'overgrow' }, is_hidden: false },
    { ability: { name: 'chlorophyll' }, is_hidden: true },
  ],
  stats: [
    { stat: { name: 'hp' }, base_stat: 45 },
    { stat: { name: 'attack' }, base_stat: 49 },
    { stat: { name: 'defense' }, base_stat: 49 },
    { stat: { name: 'special-attack' }, base_stat: 65 },
    { stat: { name: 'special-defense' }, base_stat: 65 },
    { stat: { name: 'speed' }, base_stat: 45 },
  ],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    other: {
      'official-artwork': {
        front_default:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
    },
  },
  moves: [
    { move: { name: 'razor-wind', url: 'https://pokeapi.co/api/v2/move/13/' } },
    { move: { name: 'swords-dance', url: 'https://pokeapi.co/api/v2/move/14/' } },
  ],
};

export const charmander = {
  id: 4,
  name: 'charmander',
  base_experience: 62,
  height: 6,
  weight: 85,
  types: [{ type: { name: 'fire' } }],
  abilities: [
    { ability: { name: 'blaze' }, is_hidden: false },
    { ability: { name: 'solar-power' }, is_hidden: true },
  ],
  stats: [
    { stat: { name: 'hp' }, base_stat: 39 },
    { stat: { name: 'attack' }, base_stat: 52 },
    { stat: { name: 'defense' }, base_stat: 43 },
    { stat: { name: 'special-attack' }, base_stat: 60 },
    { stat: { name: 'special-defense' }, base_stat: 50 },
    { stat: { name: 'speed' }, base_stat: 65 },
  ],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    other: { 'official-artwork': { front_default: null } },
  },
  moves: [{ move: { name: 'scratch', url: 'https://pokeapi.co/api/v2/move/10/' } }],
};

export const bulbasaurSpecies = {
  id: 1,
  name: 'bulbasaur',
  evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
};

export const pokemonList = {
  count: 1302,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
  ],
};

/** 25 moves for testing MovesList pagination (> MOVES_PER_PAGE = 20) */
export const movesFixture = Array.from({ length: 25 }, (_, i) => ({
  move: {
    name: `move-${i + 1}`,
    url: `https://pokeapi.co/api/v2/move/${i + 1}/`,
  },
}));
