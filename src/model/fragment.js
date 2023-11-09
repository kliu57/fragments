// Implement a Fragment class to use your Data Model and In-Memory database

// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    logger.debug('Called Fragment constructor');

    if (!(ownerId && type)) {
      throw new Error('ownerId and type are required');
    }

    if (typeof size !== 'number') {
      throw new Error('size must be a number');
    }

    if (size < 0) {
      throw new Error('size cannot be negative');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error(`invalid type: ${type}`);
    }

    if (!id) {
      this.id = randomUUID();
    } else {
      this.id = id;
    }

    this.ownerId = ownerId;

    if (!created) {
      this.created = new Date().toISOString();
    } else {
      this.created = created;
    }

    if (!updated) {
      this.updated = new Date().toISOString();
    } else {
      this.updated = updated;
    }

    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    logger.debug(`Called Fragment byUser(${ownerId}, ${expand})`);
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    logger.debug(`Called Fragment byId(${ownerId}, ${id})`);

    const fragment = await readFragment(ownerId, id);

    if (fragment === undefined) {
      throw new Error(`fragment not found`);
    }

    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    logger.debug(`Called Fragment delete(${ownerId}, ${id})`);
    return await deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    logger.debug('Called Fragment save()');
    this.updated = new Date().toISOString(); // set updated datetime
    return await writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    logger.debug('Called Fragment getData()');
    return await readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    logger.debug(`Called Fragment setData(${data})`);

    if (data) {
      this.updated = new Date().toISOString(); // set updated datetime

      this.size = Buffer.byteLength(data); // set size to be number of bytes of data

      // Saves the current fragment to the database
      this.save();

      return await writeFragmentData(this.ownerId, this.id, data);
    } else {
      throw new Error(`data string is required`);
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    logger.debug('Called Fragment mimeType()');
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    logger.debug('Called Fragment isText()');
    const re = /text\/*/;
    return re.test(this.type);
  }

  /**
   * Returns true if this fragment is a image/* mime type
   * @returns {boolean} true if fragment's type is image/*
   */
  get isImage() {
    logger.debug('Called Fragment isImage()');
    const re = /image\/*/;
    return re.test(this.type);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    logger.debug('Called Fragment formats()');
    if (this.isText) {
      return ['text/plain'];
    } else if (this.isImage) {
      return ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    } else if (this.type === 'application/json') {
      return ['application/json', 'text/plain'];
    }
    return [];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    logger.debug(`Called Fragment isSupportedType(${value})`);
    const types = [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/webp',
    ];
    return types.includes(value);
  }
}

module.exports.Fragment = Fragment;
