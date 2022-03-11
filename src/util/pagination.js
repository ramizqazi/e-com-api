/**
 * Encode cursor
 */
exports.encodeCursor = (cursor) => Buffer.from(cursor).toString('base64');

/**
 * Decode cursor
 */
exports.decodeCursor = (cursor) => Buffer.from(cursor, 'base64').toString('ascii');

/**
 * Paginate on a model
 */
exports.paginate = async (model, limit = 5, cursor = '', orderBy = '_id', options = {
  query: null,
  sort: null,
  projection: null,
  direction: 'desc',
}) => {
  // Query params
  const _direction = (options && options.direction) || 'desc';
  let _filter = {};
  let _sort = {
    [orderBy]: _direction === 'asc' ? 1 : -1,
  };
  const _projection = options && options.projection;
  const _limit = Number(limit);

  // Paginate with cursor
  if (cursor) {
    if (_direction === 'asc') {
      _filter[orderBy] = {
        $gte: this.decodeCursor(cursor).split(':').pop(),
      };
    } else {
      _filter[orderBy] = {
        $lte: this.decodeCursor(cursor).split(':').pop(),
      };
    }
  }

  // Add extra query and sort params via options
  if (options.query) {
    _filter = { ..._filter, ...options.query };
  }
  if (options.sort) {
    _sort = { ..._sort, ...options.sort };
  }

  // Run pagination query
  const data = await model
    .find(_filter, _projection)
    .sort(_sort)
    .limit(_limit);

  // Response
  const response = {
    ok: true,
    data,
    next_cursor: '',
  };

  // Get next cursor
  if (data.length === _limit) {
    const nextItem = await model.findOne({
      ..._filter,
      [orderBy]: _direction === 'asc' ? {
        $gt: data[data.length - 1][orderBy],
      } : {
        $lt: data[data.length - 1][orderBy],
      },
    }).sort(_sort);
    if (nextItem) {
      response.next_cursor = this.encodeCursor(`${orderBy}:${nextItem[orderBy]}`);
    }
  }

  return response;
};
