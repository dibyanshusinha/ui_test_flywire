import '@cypress/code-coverage/support';

// Cypress commands and support code
Cypress.Commands.add('navigateToPokemonTable', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'Pokémon Collection');
});

Cypress.Commands.add('searchPokemon', (name) => {
    cy.get('input[aria-label="Search Pokémon by name"]').type(name);
});

Cypress.Commands.add('navigateToPokemonDetail', (pokemonName) => {
    cy.get('table').contains(pokemonName).click();
    cy.url().should('include', '/pokemon/');
});
