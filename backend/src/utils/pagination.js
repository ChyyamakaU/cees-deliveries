/**
 * Normalises ?page and ?limit query params into safe Sequelize paging options.
 */
function getPagination(query = {}, defaults = { page: 1, limit: 20, maxLimit: 100 }) {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page);
  const limit = Math.min(
    defaults.maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaults.limit)
  );

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
}

/**
 * Builds the standard paginated response envelope.
 */
function paginatedResponse({ rows, count, page, limit }) {
  return {
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(count / limit)) || 0,
    },
  };
}

module.exports = { getPagination, paginatedResponse };
