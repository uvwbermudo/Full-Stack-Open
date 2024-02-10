describe('Blog app', function () {
  beforeEach(function () {
    const newUser = {
      username: 'cypress',
      password: 'cypress',
      name: 'cypress'
    }

    const otherUser = {
      username: 'other',
      password: 'other',
      name: 'other'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, newUser)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, otherUser)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.get('#loginForm')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('cypress')
      cy.get('#loginButton').click()

      cy.get('html').should('contain', 'logged in as cypress')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('cypress')
      cy.get('#password').type('wrong')
      cy.get('#loginButton').click()

      cy.get('.error').should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'logged in as cypress')
    })

  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'cypress', password: 'cypress' })
    })

    it('A new blog can be created', function () {
      cy.contains('Add Blog').click()
      cy.get('#blogTitle').type('Cypress Blog')
      cy.get('#blogUrl').type('cypress.com')
      cy.get('#blogAuthor').type('cypress')
      cy.get('#blogSubmit').click()

      cy.get('.blogDiv').contains('Cypress Blog by cypress').as('theBlog')
      cy.get('@theBlog').contains('Show').click()
      cy.get('@theBlog').find('.blogUrl').should('contain', 'cypress.com')
      cy.get('@theBlog').find('.blogCreator').should('contain', 'cypress')

    })

    it('a blog exists and it can be liked', function () {
      cy.createBlog({ title: 'BlogToLike', url: 'cypress.com', author: 'cypress' })
      cy.get('.blogDiv').contains('BlogToLike by cypress').as('theBlog')
      cy.get('@theBlog').contains('Show').click()
      cy.get('@theBlog').find('.likeCount')
        .then(($likeSpan) => {
          const currentLikes = Number($likeSpan.text())
          cy.get('@theBlog').find('.likeButton').click()

          cy.wait(1000)
          cy.get('@theBlog').find('.likeCount')
            .then(($updatedLikeSpan) => {
              const updatedLikes = Number($updatedLikeSpan.text())
              expect(updatedLikes).to.eql(currentLikes + 1)
            })

        })
    })

    it('a blog created by the user can be deleted', function () {
      cy.createBlog({ title: 'BlogToDelete', url: 'cypress.com', author: 'cypress' })
      cy.createBlog({ title: 'Don\'tTouchMe', url: 'cypress.com', author: 'cypress' })
      cy.get('.blogDiv').contains('BlogToDelete by cypress').as('theBlog')
      cy.get('@theBlog').contains('Show').click()

      cy.get('@theBlog').contains('Delete this blog').click()
      cy.wait(500)
      cy.get('@theBlog').should('not.exist')
    })

    it('Blogs created by others cannot be deleted', function () {
      cy.login({ username: 'other', password: 'other' })
      cy.createBlog({ title: 'Not Your Blog!', url: 'others.blog', author: 'another' })
      cy.login({ username: 'cypress', password: 'cypress' })
      cy.createBlog({ title: 'My Blog!', url: 'cypress.blog', author: 'cypress' })

      cy.get('.blogDiv').contains('My Blog! by cypress').as('myBlog')
      cy.get('@myBlog').contains('Show').click()
      cy.get('@myBlog').contains('Delete this blog').should('exist')

      cy.get('.blogDiv').contains('Not Your Blog! by another').as('otherBlog')
      cy.get('@otherBlog').contains('Show').click()
      cy.get('@otherBlog').contains('Delete this blog').should('not.exist')

    })

    it('blogs are ordered according to likes', function () {
      cy.createBlog({ title: 'Top 3 Blog', url: 'cypress.com', author: 'cypress' })
      cy.createBlog({ title: 'Top 2 Blog', url: 'cypress.com', author: 'cypress' })
      cy.createBlog({ title: 'Top 1 Blog', url: 'cypress.com', author: 'cypress' })

      cy.get('.blogDiv').contains('Top 1 Blog by cypress').as('top1')
      cy.get('.blogDiv').contains('Top 2 Blog by cypress').as('top2')
      cy.get('.blogDiv').contains('Top 3 Blog by cypress').as('top3')

      cy.get('@top1').contains('Show').click()
      cy.get('@top2').contains('Show').click()
      cy.get('@top3').contains('Show').click()
      for (let i = 0; i < 5; i++) {
        cy.get('@top1').find('.likeButton').click()
        cy.wait(500)
      }

      for (let i = 0; i < 3; i++) {
        cy.get('@top2').find('.likeButton').click()
        cy.wait(500)
      }

      cy.get('@top3').find('.likeButton').click()
      cy.wait(500)

      cy.get('.blogDiv').eq(0).should('contain', 'Top 1 Blog by cypress')
      cy.get('.blogDiv').eq(1).should('contain', 'Top 2 Blog by cypress')
      cy.get('.blogDiv').eq(2).should('contain', 'Top 3 Blog by cypress')

    })
  })

})