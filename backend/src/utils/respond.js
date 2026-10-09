/**
 * Small helpers so every endpoint returns the same JSON envelope.
 */
function ok(res, data, message = 'OK', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

function created(res, data, message = 'Created') {
  return ok(res, data, message, 201);
}

/**
 * Responds with a list envelope: { success, message, data: [...], meta }.
 * `payload` is the object returned by paginatedResponse().
 */
function paginated(res, payload, message = 'OK') {
  return res.status(200).json({
    success: true,
    message,
    data: payload.data,
    meta: payload.meta,
  });
}

module.exports = { ok, created, paginated };
