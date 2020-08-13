'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      userId: 'splash1',
      password: 'db696915',
      createdAt: '2020-10-10',
      updatedAt: '2020-10-10',
    },
    {
      userId: 'splash2',
      password: 'db696915',
      createdAt: '2020-10-10',
      updatedAt: '2020-10-10',
    },
    {
      userId: 'splash3',
      password: 'db696915',
      createdAt: '2020-10-10',
      updatedAt: '2020-10-10',
    }], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
