describe('Note App', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'cypress',
      username: 'cypress',
      password: 'cypress'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2023')
  })

  it('login form can be opened', function () {
    cy.contains('log in').click()
  })

  it('login fails with wrong password', function () {
    cy.contains('log in').click()
    cy.get('#username').type('root')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'cypress logged in')
  })

  it('user can login', function () {
    cy.contains('log in').click()
    cy.get('#username').type('cypress')
    cy.get('#password').type('cypress')
    cy.get('#login-button').click()

    cy.contains('cypress logged in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'cypress', password: 'cypress' })
    })

    it('a new note can be created', function () {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.createNote({
          content: 'another cypress note',
          important: true
        })
      })

      it('it can be made not important', function () {
        cy.contains('another cypress note')
          .contains('make not important')
          .click()

        cy.contains('another cypress note')
          .contains('make important')
      })
    })

    describe('several notes exist', function () {
      beforeEach(function () {
        cy.createNote({ content: 'first note', important: false })
        cy.createNote({ content: 'second note', important: false })
        cy.createNote({ content: 'third note', important: false })
      })

      it('one of those can be made important', function () {
        cy.contains('second note')
          .contains('make important')
          .click()

        cy.contains('second note')
          .contains('make not important')
      })
    })
  })
})