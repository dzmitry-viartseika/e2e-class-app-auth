describe('Newsletter', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });
  it('should display a success message', () => {
    cy.intercept('POST', '/newsletter*', { status: 201 }).as('subscribe'); // intercept any HTTP request localhost:3000/newsletter?anything
    cy.visit('/');
    cy.get('[data-cy="newsletter-email"]').type('test@example.com');
    cy.get('[data-cy="newsletter-submit"]').click();
    cy.wait('@subscribe');
    cy.contains('Thanks for signing up');
  });

  it('should display validation errors', () => {
    const RESPONSE_MESSAGE = 'Email exists already';
    cy.intercept('POST', '/newsletter*', {
      message: RESPONSE_MESSAGE,
    }).as('subscribe');
    cy.visit('/');
    cy.get('[data-cy="newsletter-email"]').type('test@example.com');
    cy.get('[data-cy="newsletter-submit"]').click();
    cy.wait('@subscribe');
    cy.contains(RESPONSE_MESSAGE);
  })
  it('should successfully create a new contact', () => {
    const TEST_EMAIL_ADDRESS = 'test@example.com';
    const CODE_STATUS_RESPONSE = 201;
    cy.request({
      method: 'POST',
      url: '/newsletter',
      body: { email: TEST_EMAIL_ADDRESS },
      form: true
    }).then(res => {
      expect(res.body.message).to.eq(CODE_STATUS_RESPONSE);
    });
  })
});
