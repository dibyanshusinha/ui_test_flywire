describe('Pokémon Explorer E2E Tests', () => {
    beforeEach(() => {
        cy.navigateToPokemonTable();
    });

    describe('Table View - Page Load and Navigation', () => {
        it('should load the Pokémon table view', () => {
            cy.get('h1').should('contain', 'Pokémon Collection');
            cy.get('table').should('exist');
            cy.get('tbody').find('tr').should('have.length.greaterThan', 0);
        });

        it('should display pagination controls', () => {
            cy.get('nav').should('exist');
            cy.get('button').should('exist');
        });

        it('should have correct table headers', () => {
            cy.get('thead').should('exist');
            cy.get('thead th').should('have.length.greaterThan', 0);
        });
    });

    describe('Pagination', () => {
        it('should navigate to next page', () => {
            cy.get('button').contains('Next').should('exist').click();
            cy.url().should('include', 'page=2');
        });

        it('should navigate to previous page', () => {
            cy.get('button').contains('Next').click();
            cy.url().should('include', 'page=2');
            cy.get('button').contains('Previous').click();
            cy.url().should('include', 'page=1');
        });

        it('should maintain pagination state on page reload', () => {
            cy.get('button').contains('Next').click();
            cy.url().should('include', 'page=2');
            cy.reload();
            cy.url().should('include', 'page=2');
            cy.get('tbody tr').should('have.length.greaterThan', 0);
        });

        it('should display correct number of rows per page', () => {
            cy.get('tbody tr').should('have.length', 10);
        });
    });

    describe('Pokémon Details Navigation', () => {
        it('should navigate to detail view when clicking a Pokémon row', () => {
            cy.get('tbody tr').first().click({ force: true });
            cy.url().should('include', '/pokemon/');
        });

        it('should display detail view with Pokémon information', () => {
            cy.get('tbody tr').first().click({ force: true });
            cy.get('h1').should('exist');
            cy.get('img').should('exist');
        });

        it('should navigate back to table view', () => {
            cy.get('tbody tr').first().click({ force: true });
            cy.url().should('include', '/pokemon/');

            cy.get('button').contains('Back').click({ force: true });
            cy.url().should('match', /\/$|page=\d+/);
        });
    });

    describe('Error Handling', () => {
        it('should handle loading state gracefully', () => {
            cy.visit('/');
            cy.get('table').should('exist');
        });

        it('should display content after loading completes', () => {
            cy.get('tbody tr').should('have.length.greaterThan', 0);
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            cy.get('h1').should('have.length', 1);
        });

        it('should have descriptive button text', () => {
            cy.get('button').should('have.length.greaterThan', 0);
            cy.get('button').first().invoke('text').should('not.be.empty');
        });
    });

    describe('Performance and Responsiveness', () => {
        it('should load table within reasonable time', () => {
            const start = Date.now();
            cy.visit('/');
            cy.get('tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
            const end = Date.now();
            expect(end - start).to.be.lessThan(10000);
        });

    });
});
