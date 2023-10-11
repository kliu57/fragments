// Unit tests for src/model/data/memory/index.js
// Make sure you cover all of the following async functions (i.e., they all return a Promise) and pass CI:
//     readFragment
//     writeFragment
//     readFragmentData,
//     writeFragmentData

// Fix this path to point to your project's `src/model/data/memory/index.js` source file
const index = require('../../src/model/data/memory/index');

describe('index', () => {
  let fragment = {
    ownerId: 'fragmentOwnerId',
    id: 'fragmentId',
    fragment: 'fragmentRawData',
  };

  test('writeFragment() returns nothing', async () => {
    const result = await index.writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('writeFragment() expects string key', () => {
    expect(async () => await index.writeFragment(1)).rejects.toThrow();
  });

  test('readFragment() returns what we wrote into the db', async () => {
    const result = await index.readFragment('fragmentOwnerId', 'fragmentId');
    expect(result).toBe(fragment);
  });

  test('readFragment() with incorrect primaryKey returns nothing', async () => {
    const result = await index.readFragment('incorrectPrimaryKey', 'fragmentId');
    expect(result).toBe(undefined);
  });

  test('readFragment() with incorrect secondaryKey returns nothing', async () => {
    const result = await index.readFragment('fragmentOwnerId', 'incorrectSecondaryKey');
    expect(result).toBe(undefined);
  });

  test('readFragment() expects string keys', () => {
    expect(async () => await index.readFragment()).rejects.toThrow();
    expect(async () => await index.readFragment(1)).rejects.toThrow();
    expect(async () => await index.readFragment(1, 1)).rejects.toThrow();
    expect(async () => await index.readFragment(1, 1, 1)).rejects.toThrow();
  });

  test('writeFragmentData() returns nothing', async () => {
    const result = await index.writeFragmentData(
      'fragmentOwnerId',
      'fragmentId',
      'fragmentRawDataNew'
    );
    expect(result).toBe(undefined);
  });

  test('readFragmentData() returns what we wrote into db', async () => {
    const result = await index.readFragmentData('fragmentOwnerId', 'fragmentId');
    expect(result).toBe('fragmentRawDataNew');
  });

  test('listFragments() expanded false returns array of fragment ids', async () => {
    const result = await index.listFragments('fragmentOwnerId', false);
    expect(result).toEqual(['fragmentId']);
  });

  test('listFragments() expanded true returns array of fragment objects', async () => {
    const result = await index.listFragments('fragmentOwnerId', true);
    expect(result).toEqual([fragment]);
  });

  test('deleteFragment() removes value from db', async () => {
    const result = await index.deleteFragment('fragmentOwnerId', 'fragmentId');
    expect(result).toEqual([undefined, undefined]);
    expect(await index.readFragment('fragmentOwnerId', 'fragmentId')).toBe(undefined);
  });
});
