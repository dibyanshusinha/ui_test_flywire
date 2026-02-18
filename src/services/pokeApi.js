const BASE = 'https://pokeapi.co/api/v2';

async function apiFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokeAPI error ${res.status}: ${url}`);
  return res.json();
}

export const fetchPokemonList = (limit, offset) =>
  apiFetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);

export const fetchPokemon = (nameOrId) =>
  apiFetch(`${BASE}/pokemon/${nameOrId}`);

export const fetchPokemonSpecies = (id) =>
  apiFetch(`${BASE}/pokemon-species/${id}`);

/** Pass the full URL from species.evolution_chain.url */
export const fetchEvolutionChain = (url) => apiFetch(url);

export const fetchMove = (nameOrId) =>
  apiFetch(`${BASE}/move/${nameOrId}`);
